"use client";

import { Input } from "@components/ui/input";
import { RouteType } from "@constants";
import Image from "next/image";

interface CustomInputProps {
  route: RouteType;
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
        value=""
        onChange={() => {}}
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
