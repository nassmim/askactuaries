"use server";
import { Question } from "@database";
import Answer from "@database/answer.model";
import User from "@database/user.model";
import { connectToDB } from "@lib/mongoose";
import {
  ICreateUserParams,
  IDeleteUserParams,
  IGetAllUsersParams,
  IGetUserParams,
  IToggleSaveQuestionParams,
  IUpdateUserParams,
} from "@types";
import { revalidatePath } from "next/cache";

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

  const totalQuestions = await Question.countDocuments({ author: user._id });
  const totalAnswers = await Answer.countDocuments({ author: user._id });

  return { user, totalQuestions, totalAnswers };
};

export const getAllUsers = async (params: IGetAllUsersParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  // const { page=1, pageSize=1, filter, searchQuery } = params

  const users = User.find({})
    .sort({ createdAt: -1 })
    .catch((error) => {
      throw new Error(
        "Issue while trying to fetch the users: " +
          (error instanceof Error ? error.message : error),
      );
    });

  return { users };
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
  console.log(questionId);
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
