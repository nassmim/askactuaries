"use server";
import { Question } from "@database";
import Answer from "@database/answer.model";
import User from "@database/user.model";
import { connectToDB } from "@lib/mongoose";
import { assignBadges } from "@lib/utils";
import {
  BadgeCriteriaType,
  ICreateUserParams,
  IDeleteUserParams,
  IGetAllUsersParams,
  IGetUserParams,
  IToggleSaveQuestionParams,
  IUpdateUserParams,
} from "@types";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { FilterEnum } from "zod";

export const createUser = async (params: ICreateUserParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const newUser = await User.create(params).catch((error) => {
    throw new Error(
      "Issue while trying to create a new user: " +
        (error instanceof Error ? error.message : error),
    );
  });
  return newUser;
};

export const updateUser = async (params: IUpdateUserParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { clerkId, updateData, path } = params;

  await User.findOneAndUpdate({ clerkId }, updateData).catch((error) => {
    throw new Error(
      "Issue while trying to update a user: " +
        (error instanceof Error ? error.message : error),
    );
  });

  revalidatePath(path);
};

export const getUser = async (params: IGetUserParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const user = await User.findOne({ clerkId: params.userId }).catch((error) => {
    throw new Error(
      "Issue while trying to fetch user: " +
        (error instanceof Error ? error.message : error),
    );
  });
  return user;
};

export const getUserProfile = async (params: IGetUserParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const user = await User.findOne({ clerkId: params.userId }).catch((error) => {
    throw new Error(
      "Issue while trying to fetch user: " +
        (error instanceof Error ? error.message : error),
    );
  });

  if (!user) throw new Error("User not found");

  let totalQuestions,
    totalAnswers,
    questionUpvotes,
    answerUpvotes,
    questionViews;
  try {
    totalQuestions = await Question.countDocuments({ author: user._id });
    totalAnswers = await Answer.countDocuments({ author: user._id });
    [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: { _id: 0, upvotes: { $size: "$upvotes" } },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: { _id: 0, upvotes: { $size: "$upvotes" } },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);
  } catch (error) {}

  const criteria = [
    {
      type: "QUESTION_COUNT" as BadgeCriteriaType,
      count: totalQuestions as number,
    },
    {
      type: "ANSWER_COUNT" as BadgeCriteriaType,
      count: totalAnswers as number,
    },
    {
      type: "QUESTION_UPVOTES" as BadgeCriteriaType,
      count: (questionUpvotes?.totalUpvotes || 0) as number,
    },
    {
      type: "ANSWER_UPVOTES" as BadgeCriteriaType,
      count: (answerUpvotes?.totalUpvotes || 0) as number,
    },
    {
      type: "TOTAL_VIEWS" as BadgeCriteriaType,
      count: (questionViews?.totalViews || 0) as number,
    },
  ];

  const badgeCounts = assignBadges({ criteria });

  return {
    user,
    totalQuestions,
    totalAnswers,
    badgeCounts,
    reputation: user.reputation,
  };
};

export const getAllUsers = async (params: IGetAllUsersParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { page = 1, limit = 1, filter, searchQuery } = params;
  const numberToSkip = (page - 1) * limit;

  const query: FilterQuery<typeof User> = {};

  if (searchQuery) {
    query.$or = [
      { name: { $regex: new RegExp(searchQuery, "i") } },
      { username: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  let sortOptions = {};
  switch (filter) {
    case "new_users":
      sortOptions = { joinedAt: -1 };
      break;
    case "old_users":
      sortOptions = { joinedAt: 1 };
      break;
    case "top_contributors":
      sortOptions = { reputation: -1 };
      break;
    default:
      break;
  }

  const totalUsers = await User.countDocuments(query);
  const users = await User.find(query)
    .skip(numberToSkip)
    .limit(limit)
    .sort(sortOptions)
    .catch((error) => {
      throw new Error(
        "Issue while trying to fetch the users: " +
          (error instanceof Error ? error.message : error),
      );
    });

  const isNext = totalUsers > numberToSkip + users.length;

  return { users, isNext };
};

export const deleteUser = async (params: IDeleteUserParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const userToDelete = await getUser({ userId: params.clerkId }).catch(
    (error: Error) => {
      throw new Error(error.message);
    },
  );

  if (!userToDelete) throw new Error("User has not been found");

  try {
    // const userQuestionsIds = await Question.find({ author: userToDelete._id });
    Question.deleteMany({ author: userToDelete._id });
  } catch (err) {}

  await User.findByIdAndDelete(userToDelete._id).catch((error) => {
    throw new Error(
      "Issue while trying to delete a new user: " +
        (error instanceof Error ? error.message : error),
    );
  });

  return userToDelete;
};

export const toggleSaveQuestion = async (params: IToggleSaveQuestionParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { questionId, userId, path } = params;

  let user;
  try {
    user = await User.findById(userId);

    if (!user) throw new Error("User not found");
  } catch (error) {
    throw new Error(
      "Issue while trying to get the user account: " +
        (error instanceof Error ? error.message : error),
    );
  }

  const isQuestionSaved = user.saved.includes(questionId);

  try {
    if (isQuestionSaved)
      await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } });
    else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { saved: questionId },
      });
    }
  } catch (error) {
    throw new Error(
      "Issue while trying to update the user's saved questions: " +
        (error instanceof Error ? error.message : error),
    );
  }

  revalidatePath(path);
};
