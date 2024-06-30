import FilterSelect from "@components/shared/filter/FilterSelect";
import LocalSearchBar from "@components/shared/search/LocalSearchBar";
import { UserFilters } from "@constants/filters";
import { getAllUsers } from "@actions/user.actions";
import { pages } from "@constants";
import Link from "next/link";
import UserCard from "@components/cards/UserCard";
import { SearchParamsProps } from "@types";
import Pagination from "@components/shared/Pagination";

const Community = async ({ searchParams }: SearchParamsProps) => {
  let result;
  try {
    result = await getAllUsers({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams?.page ? +searchParams.page : 1,
      limit: 5,
    });
  } catch (error) {
    return;
  }

  const { users, isNext } = result;

  return (
    <>
      <h1 className="h2-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={pages.community}
          iconPosition="left"
          image="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <FilterSelect filters={UserFilters} otherClasses="min-h-[56px]" />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {users && users.length > 0 ? (
          users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link
              href={`${pages.signUp}`}
              className="mt-2 font-bold text-accent-blue"
            >
              Join to be the first!
            </Link>
          </div>
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

export default Community;
