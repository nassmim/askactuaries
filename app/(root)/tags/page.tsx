import FilterSelect from "@components/shared/filter/FilterSelect";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { TagFilters } from "@constants/filters";
import { getAllTags } from "@actions/tag.actions";
import { pages } from "@constants";
import NoResult from "@components/shared/NoResult";
import Link from "next/link";
import { SearchParamsProps } from "@types";
import Pagination from "@components/shared/Pagination";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  let result;
  try {
    result = await getAllTags({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 5,
    });
  } catch (error) {
    return;
  }

  const { tags, isNext } = result;

  return (
    <>
      <h1 className="h2-bold text-dark100_light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={pages.tags}
          iconPosition="left"
          image="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <FilterSelect filters={TagFilters} otherClasses="min-h-[56px]" />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              key={tag._id}
              href={`${pages.tags}/${tag._id}`}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length ? tag.questions.length + "+" : "0"}
                  </span>
                  Question{tag.questions.length > 1 ? "s" : ""}
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No tags found"
            description="It looks like there are no tags yet"
            link={`${pages.askQuestion}`}
            linkLabel="Ask a question"
          />
        )}
      </section>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext!}
        />
      </div>
    </>
  );
};

export default Tags;
