import { getUserById } from "@actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Question from "@components/forms/Question";
import { pages } from "@constants";
import { redirect } from "next/navigation";

const AskQuestion = async () => {
  // const { userId } = auth()
  const userId = "123456789";

  if (!userId) redirect(`/${pages.signIn}`);
  let user;
  try {
    user = await getUserById(userId);
  } catch (error) {
    console.log(
      "There was an issue while trying to get your user account. Details: " +
        (error as Error).message,
    );
    return;
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question userId={JSON.stringify(user._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
