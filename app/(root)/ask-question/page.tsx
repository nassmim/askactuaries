import { getUser } from "@actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Question from "@components/forms/Question";
import { pages } from "@constants";
import { redirect } from "next/navigation";

const AskQuestion = async () => {
  const { userId } = auth();

  if (!userId) redirect(`${pages.signIn}`);
  let user;
  try {
    user = await getUser({ userId });
  } catch (error) {
    return;
  }

  if (!user) redirect(`${pages.signIn}`);

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
