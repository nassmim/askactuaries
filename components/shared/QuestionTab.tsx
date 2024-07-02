import { getQuestions } from "@actions/question.actions";
import QuestionCard from "@components/cards/QuestionCard";
import { IGetQuestionsReturnType, SearchParamsProps } from "@types";
import Pagination from "./Pagination";

interface IQuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: IQuestionTabProps) => {
  let result;
  try {
    result = await getQuestions({
      userId,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 3,
    });
  } catch (error) {
    return;
  }

  const { questions, isNext } = result as IGetQuestionsReturnType;

  return (
    <>
      {questions.map((question) => (
        <QuestionCard
          key={question._id}
          question={question}
          clerkId={clerkId}
        />
      ))}
      ;
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNext!}
      />
    </>
  );
};

export default QuestionTab;
