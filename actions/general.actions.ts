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

export { getUpdateQuery };
