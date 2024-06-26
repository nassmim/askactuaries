"use server";

import { Question } from "@database";
import Answer from "@database/answer.model";
import { connectToDB } from "@lib/mongoose";
import {
  IAnswerVoteParams,
  ICreateAnswerParams,
  IGetQuestionAnswersParams,
} from "@types";
import { revalidatePath } from "next/cache";
import { getUpdateQuery } from "./general.actions";

export const createAnswer = async (params: ICreateAnswerParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { content, author, questionId, path } = params;

  try {
    const newAnswer = await Answer.create({
      content,
      author,
      question: questionId,
    });
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id },
    });
  } catch (error) {
    throw new Error(
      "Issue while trying to create a new answer: " +
        (error instanceof Error ? error.message : error),
    );
  }
  revalidatePath(path);
};

export const getQuestionAnswers = async (params: IGetQuestionAnswersParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  try {
    const answers = await Answer.find({ question: params.questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    throw new Error(
      "Error while trying to fetch the answers for this question." +
        (error instanceof Error ? error.message : error),
    );
  }
};

export const voteAnswer = async (params: IAnswerVoteParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { answerId, userId, hasUpVoted, hasDownVoted, action, path } = params;
  const updateQuery = getUpdateQuery(userId, hasUpVoted, hasDownVoted, action);

  try {
    await Answer.findByIdAndUpdate(answerId, updateQuery);
  } catch (error) {
    throw new Error(
      "Error while trying to vote a answer" +
        (error instanceof Error ? error.message : error),
    );
  }

  revalidatePath(path);
};
