"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formURLQuery } from "@lib/utils";

import { FilterType } from "@types";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  filters: FilterType[];
  placeholder?: string;
  otherClasses?: string;
  containerClasses?: string;
}

const FilterSelect = ({
  filters,
  placeholder,
  otherClasses,
  containerClasses,
}: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFilter = searchParams.get("filter");

  const handleUpdateFilter = (value: string) => {
    const newURL = formURLQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newURL, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateFilter}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
          defaultValue={initialFilter || undefined}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={`${placeholder || "Select a filter"}`} />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;
