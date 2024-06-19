"use server";
import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  picture: string;
  portfolioURL?: string;
  reputation: number;
  saved?: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String, default: "" },
  picture: { type: String, required: true },
  portfolioURL: { type: String, default: "" },
  reputation: { type: Number, default: 0 },
  saved: Array({ type: Schema.Types.ObjectId, ref: "Question" }),
  joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);
export default User;
