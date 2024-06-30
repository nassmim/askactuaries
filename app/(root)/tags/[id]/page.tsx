import { getQuestions } from "@actions/question.actions";
import QuestionCard from "@components/cards/QuestionCard";
import NoResult from "@components/shared/NoResult";
import Pagination from "@components/shared/Pagination";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { pages } from "@constants";
import { PopulatedQuestionType, TagType, URLProps } from "@types";
import React from "react";

const TagQuestions = async ({ params, searchParams }: URLProps) => {
  let result;
  try {
    result = await getQuestions({
      tagId: params.id,
      searchQuery: searchParams.q,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 1,
    });
  } catch (error) {
    return;
  }

  const {
    tag,
    questions,
    isNext,
  }: { tag: TagType; questions: PopulatedQuestionType[]; isNext: boolean } =
    result;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tag.name}</h1>

      <div className="mt-11 *:w-full">
        <LocalSearchBar
          route={`${pages.tags}/${tag._id}`}
          iconPosition="left"
          image="/assets/icons/search.svg"
          placeholder="Search tags questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length ? (
          questions.map((question: PopulatedQuestionType) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <NoResult
            title="There is no question linked to this tag"
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
export default TagQuestions;
