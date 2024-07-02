import {
  getQuestions,
  getRecommendedQuestions,
} from "@actions/question.actions";
import QuestionCard from "@components/cards/QuestionCard";
import SearchFilter from "@components/home/SearchFilter";
import NoResult from "@components/shared/NoResult";
import Pagination from "@components/shared/Pagination";
import Filter from "@components/shared/filter/FilterSelect";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { Button } from "@components/ui/button";
import { pages } from "@constants";
import { HomePageFilters } from "@constants/filters";
import { SearchParamsProps } from "@types";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Hiome | Ask Devs",
  description: "Platform to ask devs and receive help",
};

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  let result;
  try {
    if (searchParams.filter === "recommended") {
      if (userId)
        result = await getRecommendedQuestions({
          userId,
          searchQuery: searchParams.q,
          page: searchParams.page ? +searchParams.page : 1,
          limit: 3,
        });
      else
        result = {
          questions: [],
          isNext: false,
        };
    }
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 3,
    });
  } catch (error) {
    return;
  }

  const { questions, isNext } = result;

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link
          href={`${pages.askQuestion}`}
          className="flex justify-end max-sm:w-full"
        >
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={pages.home}
          iconPosition="left"
          image="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <SearchFilter filters={HomePageFilters} />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <NoResult
            title="There is no question to show"
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

export default Home;
