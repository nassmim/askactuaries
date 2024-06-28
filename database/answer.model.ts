"use server";
import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
  question: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Question",
  },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  upvotes: Array({ type: Schema.Types.ObjectId, ref: "User" }),
  downvotes: Array({ type: Schema.Types.ObjectId, ref: "User" }),
  createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model("Answer", AnswerSchema);
export default Answer;
