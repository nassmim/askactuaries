import { getUserAnswers } from "@actions/answer.actions";
import AnswerCard from "@components/cards/AnswerCard";
import { SearchParamsProps } from "@types";
import Pagination from "./Pagination";

interface IAnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string;
}

const AnswerTab = async ({
  searchParams,
  userId,
  clerkId,
}: IAnswerTabProps) => {
  let result;
  try {
    result = await getUserAnswers({
      userId,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 5,
    });
  } catch (error) {
    return;
  }

  const { answers, isNext } = result;

  return (
    <>
      {answers.map((answer) => (
        <AnswerCard key={answer._id} answer={answer} clerkId={clerkId} />
      ))}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNext!}
      />
    </>
  );
};

export default AnswerTab;
