"use server";
import { Answer, Question, Tag, User } from "@database";
import { connectToDB } from "@lib/mongoose";

const getUpdateQuery = (
  userId: string,
  hasUpVoted: boolean,
  hasDownVoted: boolean,
  action: string,
) => {
  let updateQuery = {};

  if (action === "upvote") {
    if (hasUpVoted) updateQuery = { $pull: { upvotes: userId } };
    else if (hasDownVoted)
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    else updateQuery = { $addToSet: { upvotes: userId } };
  } else {
    if (hasDownVoted) updateQuery = { $pull: { downvotes: userId } };
    else if (hasUpVoted)
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    else updateQuery = { $addToSet: { downvotes: userId } };
  }

  return updateQuery;
};

const searchGlobally = async (params: IGlobalSearchParams) => {
  await connectToDB().catch((error: Error) => {
    throw new Error(error.message);
  });

  const searchableTypes = ["question", "answer", "user", "tag"] as const;
  type SearchableType = (typeof searchableTypes)[number];
  const { query, type } = params;

  const regexQuery = { $regex: query, $options: "i" };

  let results = [];

  const modelsAndTypes: {
    type: SearchableType;
    model: typeof User;
    searchField: string;
  }[] = [
    { type: "user", model: User, searchField: "name" },
    { type: "question", model: Question, searchField: "title" },
    { type: "answer", model: Answer, searchField: "content" },
    { type: "tag", model: Tag, searchField: "name" },
  ];

  console.log(type);
  const typeLowercase = type?.toLowerCase();

  try {
    if (!typeLowercase || !searchableTypes.includes(typeLowercase)) {
      for (const { model, searchField } of modelsAndTypes) {
        const queryResult = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        const resultsToDisplay = queryResult.map((result) => ({
          title:
            type === "answer"
              ? `Answers containing ${query}`
              : result[searchField],
          type,
          id:
            type === "user"
              ? result.clerkId
              : type === "answer"
                ? result.question
                : result._id,
        }));

        results.push(...resultsToDisplay);
      }
    } else {
      let modelToUse = modelsAndTypes.find(
        (item) => item.type === typeLowercase,
      );
      modelToUse = modelToUse!;
      const queryResult = await modelToUse.model
        .find({ [modelToUse.searchField]: regexQuery })
        .limit(8);

      results = queryResult.map((result) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : result[modelToUse.searchField],
        type,
        id:
          type === "user"
            ? result.clerkId
            : type === "answer"
              ? result.question
              : result._id,
      }));
    }
  } catch (error) {
    throw new Error(
      "Issue while trying to perform the global search: " +
        (error instanceof Error ? error.message : error),
    );
  }

  return JSON.stringify(results);
};

export { getUpdateQuery, searchGlobally };
