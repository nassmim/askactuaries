import { getQuestions } from "@actions/question.actions";
import { auth } from "@clerk/nextjs/server";
import QuestionCard from "@components/cards/QuestionCard";
import NoResult from "@components/shared/NoResult";
import Pagination from "@components/shared/Pagination";
import Filter from "@components/shared/filter/FilterSelect";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { pages } from "@constants";
import { QuestionFilters } from "@constants/filters";
import { IGetQuestionsReturnType, SearchParamsProps } from "@types";

const Collections = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();

  if (!userId) return;

  let result;
  try {
    result = await getQuestions({
      clerkId: userId as string | undefined,
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 5,
    });
  } catch (error) {
    return;
  }

  const { questions, isNext } = result as IGetQuestionsReturnType;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={pages.collections}
          iconPosition="left"
          image="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter filters={QuestionFilters} otherClasses="min-h-[56px]" />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              clerkId={userId}
            />
          ))
        ) : (
          <NoResult
            title="There is no saved question to show"
            description="Be the first to break the silence!"
            link={pages.askQuestion}
            linkLabel="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext!}
        />
      </div>
    </>
  );
};

export default Collections;
