import { getQuestion } from "@actions/question.actions";
import { getUserById } from "@actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Answer from "@components/forms/Answer";
import AllAnswers from "@components/shared/AllAnswers";
import Metric from "@components/shared/Metric";
import ParseHTML from "@components/shared/ParseHTML";
import Tag from "@components/shared/Tag";
import Votes from "@components/shared/Votes";
import { pages } from "@constants";
import { formatNumber, getTimeStamp } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Question = async ({ params, searchParams }) => {
  let question;
  try {
    question = await getQuestion({ questionId: params.id });
  } catch (error) {
    return;
  }

  const author = question.author;

  let user;
  const { userId: clerkId } = auth();
  if (clerkId) user = await getUserById(clerkId);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/${pages.profile}/${author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={author.picture}
              alt={`picture of ${author.name}`}
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              questionId={question._id}
              userId={user._id}
              upvotes={question.upvotes.length}
              hasUpvoted={question.upvotes.includes(user._id)}
              downvotes={question.upvotes.length}
              hasDownvoted={question.downvotes.includes(user._id)}
              hasSaved={user?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          image="/assets/icons/clock.svg"
          alt="clock icon"
          value={`asked ${getTimeStamp(question.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          image="/assets/icons/message.svg"
          alt="messages"
          value={formatNumber(question.answers.length)}
          title={`${question.answers.length > 1 ? "Answers" : "Answer"}`}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          image="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(question.views)}
          title={`${question.views > 1 ? "Views" : "View"}`}
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <Tag key={tag._id} tag={tag} />
        ))}
      </div>

      <AllAnswers question={question} />
      <Answer
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(question.author._id)}
      />
    </>
  );
};

export default Question;
