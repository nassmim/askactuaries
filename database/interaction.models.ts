"use server";
import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  questions: Schema.Types.ObjectId;
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const InteractionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  questions: Array({ type: Schema.Types.ObjectId, ref: "Question" }),
  followers: Array({ type: Schema.Types.ObjectId, ref: "User" }),
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);
export default Interaction;
