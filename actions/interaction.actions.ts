"use server";

import { Question } from "@database";
import Interaction from "@database/interaction.models";
import { connectToDB } from "@lib/mongoose";
import { IViewQuestionParams } from "@types";
import { revalidatePath } from "next/cache";

export const viewQuestion = async (params: IViewQuestionParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { questionId, userId, path } = params;

  try {
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if (userId) {
      await Interaction.findOneAndUpdate(
        { question: questionId, user: userId, action: "view" },
        {
          $setOnInsert: { question: questionId, user: userId, action: "view" },
        },
        { upsert: true },
      );
    }
  } catch (error) {
    throw new Error(
      "Error raised while trying to create an interaction" +
        (error instanceof Error ? error.message : error),
    );
  }

  revalidatePath(path);
};
