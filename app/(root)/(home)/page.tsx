import SearchFilter from "@components/home/SearchFilter";
import Filter from "@components/shared/filter/FilterSelect";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { Button } from "@components/ui/button";
import { pages } from "@constants";
import { HomePageFilters } from "@constants/filters";
import Link from "next/link";

const Home = () => {
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
    </>
  );
};

export default Home;
