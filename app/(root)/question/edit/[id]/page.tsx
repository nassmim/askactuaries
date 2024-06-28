import { getQuestion } from "@actions/question.actions";
import { getUser } from "@actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Question from "@components/forms/Question";
import { ParamsProps } from "@types";

const EditQuestion = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return;

  let user;
  let question;
  try {
    user = await getUser({ userId });
    question = await getQuestion({ questionId: params.id });
  } catch (error) {
    return;
  }
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="edit"
          userId={JSON.stringify(user._id)}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
};

export default EditQuestion;
