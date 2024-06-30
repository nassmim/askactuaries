"use sever";

import { Tag, User } from "@database";
import { connectToDB } from "@lib/mongoose";
import { IGetAllTagsParams, IGetUserTopInteractedTagsParams } from "@types";
import { FilterQuery } from "mongoose";

export const getAllTags = async (params: IGetAllTagsParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const { filter, searchQuery, page = 1, limit = 0 } = params;
  const numberToSkip = (page - 1) * limit;
  const query: FilterQuery<typeof Tag> = {};

  let sortOptions = {};
  switch (filter) {
    case "popular":
      sortOptions = { questions: -1 };
      break;
    case "recent":
      sortOptions = { createdAt: -1 };
      break;
    case "old":
      sortOptions = { createdAt: 1 };
      break;
    case "name":
      sortOptions = { name: 1 };
      break;
  }

  if (searchQuery)
    query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
  const tags = await Tag.find(query)
    .skip(numberToSkip)
    .limit(limit)
    .sort(sortOptions)
    .catch((error) => {
      throw new Error(
        "Issue while trying to fetch the tags: " +
          (error instanceof Error ? error.message : error),
      );
    });

  const totalTags = await Tag.countDocuments(query);
  const isNext = totalTags > numberToSkip + tags.length;

  return { tags, isNext };
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

export const getPopularTags = async () => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const popularTags = Tag.aggregate([
    { $project: { name: 1, totalQuestions: { $size: "$questions" } } },
    { $sort: { totalQuestions: -1 } },
    { $limit: 5 },
  ]);

  return popularTags;
};
