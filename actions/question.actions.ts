"use server";
import { IQuestion, Question, Tag, User } from "@database/index";
import { connectToDB } from "@lib/mongoose";
import {
  ICreateQuestionParams,
  IGetQuestionsParams,
  IGetQuestionParams,
} from "@types";
import { Schema } from "mongoose";
import { revalidatePath } from "next/cache";

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

  try {
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return questions;
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
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
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
