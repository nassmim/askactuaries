"use client";
import { Button } from "@components/ui/button";
import { formURLQuery } from "@lib/utils";
import { FilterType } from "@types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchFilter = ({ filters }: { filters: FilterType[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(searchParams.get("filter"));

  const handleTypeClick = (item: string) => {
    let newURL;
    const paramsURL = searchParams ? searchParams.toString() : "";
    if (active === item) {
      setActive("");
      newURL = formURLQuery({
        params: paramsURL,
        key: "filter",
        value: null,
      });
    } else {
      setActive(item);
      newURL = formURLQuery({
        params: paramsURL,
        key: "filter",
        value: item.toLowerCase(),
      });
    }

    router.push(newURL, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => {
            handleTypeClick(filter.value);
          }}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === filter.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-400"}`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default SearchFilter;
