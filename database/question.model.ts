"use server";
import { ICreateQuestionParams } from "@types";
import { Schema, models, model, Document } from "mongoose";

export interface IQuestion
  extends Document,
    Omit<ICreateQuestionParams, "path"> {
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: Array({ type: Schema.Types.ObjectId, required: true, ref: "Tag" }),
  views: { type: Number, default: 0 },
  upvotes: Array({ type: Schema.Types.ObjectId, ref: "User" }),
  downvotes: Array({ type: Schema.Types.ObjectId, ref: "User" }),
  author: { type: Schema.Types.ObjectId, ref: "User" },
  answers: Array({ type: Schema.Types.ObjectId, ref: "Answer" }),
  createdAt: { type: Date, default: Date.now },
});

const Question = models.Question || model("Question", QuestionSchema);
export default Question;
