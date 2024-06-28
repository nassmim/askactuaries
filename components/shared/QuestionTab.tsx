import { getQuestions } from "@actions/question.actions";
import QuestionCard from "@components/cards/QuestionCard";
import { SearchParamsProps } from "@types";

interface IQuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string;
}

const QuestionTab = async ({
  searchProps,
  userId,
  clerkId,
}: IQuestionTabProps) => {
  let result;
  try {
    result = await getQuestions({ userId });
  } catch (error) {
    return;
  }

  return result.questions.map((question) => (
    <QuestionCard key={question._id} question={question} clerkId={clerkId} />
  ));
};

export default QuestionTab;
