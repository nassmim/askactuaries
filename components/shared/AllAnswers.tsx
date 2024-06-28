import { PopulatedQuestionType } from "@types";
import React from "react";
import FilterSelect from "./filter/FilterSelect";
import { AnswerFilters } from "@constants/filters";
import { getQuestionAnswers } from "@actions/answer.actions";
import Link from "next/link";
import { pages } from "@constants";
import Image from "next/image";
import { getTimeStamp } from "@lib/utils";
import ParseHTML from "./ParseHTML";
import { Votes } from "./Votes";

const AllAnswers = async ({
  question,
  userId,
  page,
  filter,
}: {
  question: PopulatedQuestionType;
  userId: string;
  page?: number;
  filter?: number;
}) => {
  let result;
  try {
    result = await getQuestionAnswers({ questionId: question._id });
  } catch (error) {
    return;
  }
  const answers = result.answers;

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {question.answers.length} Answer
          {question.answers.length > 1 ? "s" : ""}
        </h3>
        <FilterSelect filters={AnswerFilters} />
      </div>

      <div>
        {answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`${pages.profile}/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    alt="profile"
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1">
                      answered {getTimeStamp(answer.createdAt)} ago
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  <Votes
                    type="answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasUpVoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasDownVoted={answer.downvotes.includes(userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
