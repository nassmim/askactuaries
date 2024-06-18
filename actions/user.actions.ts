import User from "@database/user.model";
import { connectToDB } from "@lib/mongoose";

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
