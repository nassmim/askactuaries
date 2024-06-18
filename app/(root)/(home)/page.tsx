import { getQuestions } from "@actions/question.actions";
import QuestionCard from "@components/cards/QuestionCard";
import SearchFilter from "@components/home/SearchFilter";
import NoResult from "@components/shared/NoResult";
import Filter from "@components/shared/filter/FilterSelect";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { Button } from "@components/ui/button";
import { pages } from "@constants";
import { HomePageFilters } from "@constants/filters";
import { QuestionType } from "@types";
import Link from "next/link";

const questions: QuestionType[] = [
  {
    _id: "1",
    title: "Cascading deletes in SQLAlchemy",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sql" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "john-doe.jpg",
    },
    upvotes: 1000000000,
    views: 100,
    answers: [],
    createdAt: new Date("2021-09-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div element",
    tags: [{ _id: "3", name: "CSCC" }],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "john-doe.jpg",
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2021-09-01T12:00:00.000Z"),
  },
];

const Home = async () => {
  const questions = await getQuestions({});
  console.log(questions);
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h2-bold text-dark100_light900">All Questions</h1>

        <Link
          href={pages.askQuestion}
          className="flex justify-end max-sm:w-full"
        >
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
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
    </>
  );
};

export default Home;
