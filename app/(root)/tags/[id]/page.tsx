import { getQuestions } from "@actions/question.actions";
import QuestionCard from "@components/cards/QuestionCard";
import NoResult from "@components/shared/NoResult";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { pages } from "@constants";
import { QuestionType, TagType, URLProps } from "@types";
import React from "react";

const TagQuestions = async ({ params, searchParams }: URLProps) => {
  let result;
  try {
    result = await getQuestions({
      tagId: params.id,
      searchQuery: searchParams.q,
    });
  } catch (error) {
    return;
  }

  const { tag, questions }: { tag: TagType; questions: QuestionType[] } =
    result;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tag.name}</h1>

      <div className="mt-11 *:w-full">
        <LocalSearchBar
          iconPosition="left"
          image="/assets/icons/search.svg"
          placeholder="Search tags questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length ? (
          questions.map((question: QuestionType) => (
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
    </>
  );
};
export default TagQuestions;