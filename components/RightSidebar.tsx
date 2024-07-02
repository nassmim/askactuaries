import Image from "next/image";
import Link from "next/link";
import React from "react";
import Tag from "./shared/Tag";
import { pages } from "@constants";
import { getQuestions } from "@actions/question.actions";
import { getPopularTags } from "@actions/tag.actions";
import { IGetQuestionsReturnType } from "@types";

const RightSidebar = async () => {
  const result = await getQuestions({
    sort: { views: -1, upvotes: -1 },
    limit: 5,
  }).catch(() => {
    return { questions: [] };
  });

  const hotQuestions = (result as IGetQuestionsReturnType).questions;

  const popularTags = await getPopularTags().catch(() => []);

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={`${pages.question}/${question._id}`}
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
