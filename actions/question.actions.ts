"use server";
import { type FilterQuery } from "mongoose";
import { IQuestion, Question, Tag, User } from "@database/index";
import { connectToDB } from "@lib/mongoose";
import {
  ICreateQuestionParams,
  IGetQuestionsParams,
  IGetQuestionParams,
  IQuestionVoteParams,
  IDeleteQuestionParams,
} from "@types";
import { Schema } from "mongoose";
import { revalidatePath } from "next/cache";
import { getUpdateQuery } from "./general.actions";
import Answer from "@database/answer.model";
import Interaction from "@database/interaction.models";

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

  let questions;
  let tag;
  let totalQuestions;
  try {
    const {
      clerkId,
      userId,
      tagId,
      page = 1,
      pageSize = 10,
      filter,
      searchQuery,
    } = params;

    if (clerkId) questions = await getSavedQuestions(clerkId, searchQuery);
    else if (tagId) {
      const result = await getQuestionsByTag(tagId, searchQuery);
      tag = result.tag;
      questions = result.questions;
    } else if (userId) {
      const result = await getUserQuestions(userId, page, pageSize);
      totalQuestions = result.totalQuestions;
      questions = result.questions;
    } else {
      questions = await Question.find({})
        .populate({ path: "tags", model: Tag })
        .populate({ path: "author", model: User })
        .sort({ createdAt: -1 });
    }

    return { tag, totalQuestions, questions };
  } catch (error) {
    throw new Error(
      "Error while trying to fetch the questions from DB." +
        (error instanceof Error ? error.message : error),
    );
  }
};

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

  revalidatePath(path);
};

export const voteQuestion = async (params: IQuestionVoteParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { questionId, userId, hasUpVoted, hasDownVoted, action, path } = params;
  const updateQuery = getUpdateQuery(userId, hasUpVoted, hasDownVoted, action);

  try {
    await Question.findByIdAndUpdate(questionId, updateQuery);
  } catch (error) {
    throw new Error(
      "Error while trying to vote a question" +
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

async function getSavedQuestions(clerkId: string, searchQuery?: string) {
  const query: FilterQuery<typeof Question> = searchQuery
    ? { title: { $regex: new RegExp(searchQuery, "i") } }
    : {};

  let user;
  try {
    user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
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

  return user.saved;
}

async function getQuestionsByTag(tagId: string, searchQuery?: string) {
  const filter: FilterQuery<typeof Tag> = { _id: tagId };
  const query: FilterQuery<typeof Question> = searchQuery
    ? { title: { $regex: new RegExp(searchQuery, "i") } }
    : {};

  let tag;
  try {
    tag = await Tag.findOne(filter).populate({
      path: "questions",
      match: query,
      options: {
        sort: { createdAt: -1 },
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
  return { tag, questions };
}

async function getUserQuestions(
  userId: string,
  page: number,
  pageSize: number,
) {
  let totalQuestions, questions;
  try {
    totalQuestions = await Question.countDocuments({ author: userId });

    questions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");
  } catch (error) {
    throw new Error(
      "Error while trying to get the questions written by a user" +
        (error instanceof Error ? error.message : error),
    );
  }

  return { totalQuestions, questions };
}
