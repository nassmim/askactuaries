import { getUserAnswers } from "@actions/answer.actions";
import AnswerCard from "@components/cards/AnswerCard";
import { SearchParamsProps } from "@types";

interface IAnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string;
}

const AnswerTab = async ({ searchProps, userId, clerkId }: IAnswerTabProps) => {
  let result;
  try {
    result = await getUserAnswers({ userId });
  } catch (error) {
    return;
  }
  console.log(result.answers);
  return result.answers.map((answer) => (
    <AnswerCard key={answer._id} answer={answer} clerkId={clerkId} />
  ));
};

export default AnswerTab;
