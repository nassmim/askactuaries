"use client";

import { Input } from "@components/ui/input";
import { formURLQuery, removeKeysFromQuery } from "@lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  image: string;
  placeholder?: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  image,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newURL = formURLQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newURL, { scroll: false });
      } else {
        if (pathName === route) {
          const newURL = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
          });
          router.push(newURL, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathName, router, searchParams, query]);

  return (
    <div
      className={`background-light800_darkgradient flex grow items-center gap-4 rounded-['10px'] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={image}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={image}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
