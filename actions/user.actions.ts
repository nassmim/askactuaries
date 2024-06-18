import { Question } from "@database";
import User from "@database/user.model";
import { connectToDB } from "@lib/mongoose";
import {
  ICreateUserParams,
  IDeleteUserParams,
  IUpdateUserParams,
} from "@types";
import { revalidatePath } from "next/cache";

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

export const getUserById = async (userId: string) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const user = await User.findOne({ clerkId: userId }).catch((error) => {
    throw new Error(
      "Issue while trying to fetch user: " +
        (error instanceof Error ? error.message : error),
    );
  });
  return user;
};

export const deleteUser = async (params: IDeleteUserParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const userToDelete = await getUserById(params.clerkId).catch(
    (error: Error) => {
      throw new Error(error.message);
    },
  );

  if (!userToDelete) throw new Error("User has not been found");

  try {
    const userQuestionsIds = await Question.find({ author: userToDelete._id });
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
