"use server";
import { SortOrder, type FilterQuery } from "mongoose";
import {
  IQuestion,
  Question,
  Tag,
  User,
  Interaction,
  Answer,
} from "@database/index";
import { connectToDB } from "@lib/mongoose";
import {
  ICreateQuestionParams,
  IGetQuestionsParams,
  IGetQuestionParams,
  IQuestionVoteParams,
  IDeleteQuestionParams,
  IEditQuestionParams,
  RecommendedParams,
} from "@types";
import { Schema } from "mongoose";
import { revalidatePath } from "next/cache";
import { getUpdateQuery } from "./general.actions";

type QuestionFilterType = FilterQuery<typeof Question>;

export const getQuestion = async (params: IGetQuestionParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  try {
    const question = await Question.findById(params.questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    throw new Error(
      "Error while trying to fetch the question." +
        (error instanceof Error ? error.message : error),
    );
  }
};

export const getQuestions = async (params: IGetQuestionsParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  let result: { tag?: any; totalQuestions?: any; questions: any; isNext: any };
  const {
    clerkId,
    userId,
    tagId,
    page = 1,
    filter = "",
    searchQuery = "",
    sort = {},
    limit = 0,
  } = params;

  const numberToSkip = (page - 1) * limit;

  try {
    if (userId) result = await getUserQuestions(userId, numberToSkip, limit);
    else {
      const query: QuestionFilterType = {};

      let sortOptions = {};
      switch (filter) {
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "recommended":
          sortOptions = { createdAt: -1 };
          break;
        case "frequent":
        case "most_viewed":
          sortOptions = { views: -1 };
          break;
        case "unanswered":
          query.answers = { $size: 0 };
          break;
        case "most_recent":
          sortOptions = { createdAt: -1 };
          break;
        case "oldest":
          sortOptions = { createdAt: 1 };
          break;
        case "most_voted":
          sortOptions = { upvotes: -1 };
          break;
        case "most_answered":
          sortOptions = { answers: -1 };
          break;
      }

      sortOptions = {
        ...sort,
        ...sortOptions,
      };

      if (clerkId)
        result = await getSavedQuestions(
          clerkId,
          query,
          sortOptions,
          searchQuery,
          numberToSkip,
          limit,
        );
      else if (tagId)
        result = await getQuestionsByTag(
          tagId,
          query,
          searchQuery,
          numberToSkip,
          limit,
        );
      else
        result = await getAllQuestions(
          searchQuery,
          query,
          sortOptions,
          numberToSkip,
          limit,
        );
    }

    const { tag, totalQuestions, questions, isNext } = result;
    return { tag, totalQuestions, questions, isNext };
  } catch (error) {
    throw new Error(
      "Error while trying to fetch the questions from DB." +
        (error instanceof Error ? error.message : error),
    );
  }
};

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDB();

    const { userId, page = 1, limit = 10, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const numberToSkip = (page - 1) * limit;

    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } },
        { author: { $ne: user._id } },
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(numberToSkip)
      .limit(limit);

    const isNext = totalQuestions > numberToSkip + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}

export const createQuestion = async (params: ICreateQuestionParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { title, content, tags, author, path } = params;

  const question: IQuestion = await Question.create({
    title,
    content,
    author,
  }).catch((error) => {
    throw new Error(
      "Error raised while trying to create the question in the DB" +
        (error instanceof Error ? error.message : error),
    );
  });

  const tagDocumentsIds: Schema.Types.ObjectId[] = [];

  try {
    for (const tag of tags) {
      const tagFromDB = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );

      tagDocumentsIds.push(tagFromDB._id);
    }
  } catch (error) {
    throw new Error(
      "Error raised while trying to create the tags in the DB" +
        (error instanceof Error ? error.message : error),
    );
  }

  try {
    question.tags.push(...tagDocumentsIds);
    question.save();
  } catch (error) {
    throw new Error(
      "Error raised while trying to associate the tags documents to the question document in the DB" +
        (error instanceof Error ? error.message : error),
    );
  }

  try {
    await Interaction.create({
      user: author,
      action: "askQuestion",
      question: question._id,
      tags: tagDocumentsIds,
    });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
  } catch (error) {
    throw new Error(
      "Error raised while trying to update the user's reputation" +
        (error instanceof Error ? error.message : error),
    );
  }

  revalidatePath(path);
};

export const editQuestion = async (params: IEditQuestionParams) => {
  const { questionId, title, content, path } = params;

  const question = await Question.findById(questionId).catch((error) => {
    throw new Error(
      "Error raised while trying to update the question" +
        (error instanceof Error ? error.message : error),
    );
  });

  if (!question) throw new Error("Question not found");

  question.title = title;
  question.content = content;
  await question.save();

  revalidatePath(path);
};

export const voteQuestion = async (params: IQuestionVoteParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { questionId, userId, hasUpVoted, hasDownVoted, action, path } = params;
  const updateQuery = getUpdateQuery(userId, hasUpVoted, hasDownVoted, action);

  let question;
  try {
    question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
  } catch (error) {
    throw new Error(
      "Error while trying to vote a question" +
        (error instanceof Error ? error.message : error),
    );
  }

  try {
    await User.findByIdAndUpdate(userId, {
      $inc: {
        reputation:
          action === "upvote" ? (hasUpVoted ? -1 : 1) : hasDownVoted ? 1 : -1,
      },
    });
    await User.findByIdAndUpdate(question.author, {
      $inc: {
        reputation:
          action === "upvote"
            ? hasUpVoted
              ? -10
              : 10
            : hasDownVoted
              ? 10
              : -10,
      },
    });
  } catch (error) {
    throw new Error(
      "Error raised while trying to update the voting and the posting users' reputation" +
        (error instanceof Error ? error.message : error),
    );
  }

  revalidatePath(path);
};

export const deleteQuestion = async (params: IDeleteQuestionParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { questionId, path } = params;
  try {
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await User.updateMany(
      { saved: questionId },
      { $pull: { saved: questionId } },
    );

    await Interaction.updateMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );
  } catch (error) {
    throw new Error(
      "Error while trying to delete a question" +
        (error instanceof Error ? error.message : error),
    );
  }

  revalidatePath(path);
};

async function getSavedQuestions(
  clerkId: string,
  query: QuestionFilterType,
  sortOptions: {
    [key: string]: SortOrder;
  },
  searchQuery: string,
  numberToSkip: number,
  limit: number,
) {
  if (searchQuery) query.title = { $regex: new RegExp(searchQuery, "i") };

  let user;
  try {
    user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: numberToSkip,
        limit: limit + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) throw new Error("User not found");
  } catch (error) {
    throw new Error(
      "Error while trying to get the user and its saved questions" +
        (error instanceof Error ? error.message : error),
    );
  }

  const isNext = user.saved.length > limit;

  return { isNext, questions: user.saved };
}

async function getQuestionsByTag(
  tagId: string,
  query: QuestionFilterType,
  searchQuery: string,
  numberToSkip: number,
  limit: number,
) {
  const filter: FilterQuery<typeof Tag> = { _id: tagId };
  if (searchQuery) query.title = { $regex: new RegExp(searchQuery, "i") };

  let tag;
  try {
    tag = await Tag.findOne(filter).populate({
      path: "questions",
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: numberToSkip,
        limit: limit + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) throw new Error("Tag not found");
  } catch (error) {
    throw new Error(
      "Error while trying to get the questions related to a tag" +
        (error instanceof Error ? error.message : error),
    );
  }

  const questions = tag.questions;
  const isNext = questions.length > limit;

  return { tag, questions, isNext };
}

async function getUserQuestions(
  userId: string,
  numberToSkip: number,
  limit: number,
) {
  let totalQuestions, questions;
  try {
    totalQuestions = await Question.countDocuments({ author: userId });
    console.log(numberToSkip);
    console.log(limit);
    questions = await Question.find({ author: userId })
      .skip(numberToSkip)
      .limit(limit)
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");
  } catch (error) {
    throw new Error(
      "Error while trying to get the questions written by a user" +
        (error instanceof Error ? error.message : error),
    );
  }

  const isNext = totalQuestions > numberToSkip + questions.length;

  return { totalQuestions, questions, isNext };
}

async function getAllQuestions(
  searchQuery: string,
  query: QuestionFilterType,
  sortOptions: {
    [key: string]: SortOrder;
  },
  numberToSkip: number,
  limit: number,
) {
  if (searchQuery) {
    query.$or = [
      { title: { $regex: new RegExp(searchQuery, "i") } },
      { content: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  const totalQuestions = await Question.countDocuments(query);
  const questions = await Question.find(query)
    .populate({ path: "tags", model: Tag })
    .populate({ path: "author", model: User })
    .skip(numberToSkip)
    .limit(limit)
    .sort(sortOptions);

  const isNext = totalQuestions > numberToSkip + questions.length;

  return { isNext, questions };
}
