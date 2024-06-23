"use sever";

import { Tag, User } from "@database";
import { connectToDB } from "@lib/mongoose";
import {
  IGetAllTagsParams,
  IGetUserTopInteractedTagsParams,
  TagType,
} from "@types";

export const getAllTags = async (
  params: IGetAllTagsParams,
): Promise<{ tags: TagType[] }> => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  // const { page=1, pageSize=1, filter, searchQuery } = params

  const tags = await Tag.find({}).catch((error) => {
    throw new Error(
      "Issue while trying to fetch the tags: " +
        (error instanceof Error ? error.message : error),
    );
  });
  return { tags };
};

export const getUserTopInteractedTags = async (
  params: IGetUserTopInteractedTagsParams,
) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  let user;
  try {
    user = await User.findById(params.userId);
  } catch (error) {
    throw new Error(
      "Issue while trying to fetch the user's tags: " +
        (error instanceof Error ? error.message : error),
    );
  }

  if (!user) throw new Error("User not found");

  return [
    { _id: "1", name: "Tag1" },
    { _id: "2", name: "Tag2" },
    { _id: "3", name: "Tag3" },
  ];
};
