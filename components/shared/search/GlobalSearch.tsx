"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { formURLQuery, removeKeysFromQuery } from "@lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GlobalResults from "./GlobalResults";

const GlobalSearch = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!isOpen) setIsOpen(true);
    else if (isOpen && value === "") setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathName]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newURL = formURLQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newURL, { scroll: false });
      } else {
        if (query) {
          const newURL = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["global", "type"],
          });
          router.push(newURL, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, pathName, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search"
        />
        <Input
          type="text"
          placeholder="Search on the platform"
          className="paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
          onChange={handleInputChange}
        />
      </div>

      {isOpen && <GlobalResults />}
    </div>
  );
};

export default GlobalSearch;
