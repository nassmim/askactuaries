import Image from "next/image";
import Link from "next/link";
import React from "react";
import Tag from "./shared/Tag";
import { QuestionType, TagType } from "@types";

const popularTags: TagType[] = [
  { _id: "1", name: "javascript", totalQuestions: 5 },
  { _id: "4", name: "react", totalQuestions: 5 },
  { _id: "5", name: "next", totalQuestions: 5 },
  { _id: "6", name: "vue", totalQuestions: 5 },
  { _id: "7", name: "redux", totalQuestions: 5 },
];

const topQuestions: Pick<QuestionType, "_id" | "title">[] = [
  {
    _id: "1",
    title: "How to use express as a custom server in NEXTJS",
  },
  {
    _id: "2",
    title: "How to use express as a custom server in NEXTJS",
  },
  {
    _id: "3",
    title: "How to use express as a custom server in NEXTJS",
  },
  {
    _id: "4",
    title: "How to use express as a custom server in NEXTJS",
  },
  {
    _id: "5",
    title: "How to use express as a custom server in NEXTJS",
  },
];
const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {topQuestions.map((question) => (
            <Link
              key={question._id}
              href={`/questions/${question._id}`}
              className="flex cursor-pointer justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="Chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <Tag key={tag._id} tag={tag} showCount />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
