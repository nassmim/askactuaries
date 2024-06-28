import Link from "next/link";

import Metric from "../shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
import { PopulatedAnswerType } from "@types";
import { pages } from "@constants";

interface Props {
  clerkId?: string | null;
  answer: PopulatedAnswerType;
}

const AnswerCard = ({ clerkId, answer }: Props) => {
  const { question, author } = answer;
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(answer.createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            <Link href={`${pages.question}/${question._id}/#${answer._id}`}>
              {question.title}
            </Link>
          </h3>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction
              type="Answer"
              itemId={JSON.stringify(answer._id)}
            />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          image={author.picture}
          alt="user avatar"
          value={author.name}
          title={` • asked ${getTimeStamp(answer.createdAt)}`}
          href={`${pages.profile}/${author.clerkId}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            image="/assets/icons/like.svg"
            alt="like icon"
            value={formatNumber(question.upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
