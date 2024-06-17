import Metric from "@components/shared/Metric";
import Tag from "@components/shared/Tag";
import { pages } from "@constants";
import { formatNumber, getTimeStamp } from "@lib/utils";
import { QuestionType } from "@types";
import Link from "next/link";

const QuestionCard = ({ question }: { question: QuestionType }) => {
  return (
    <div className="card-wrapper rounded p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(question.createdAt)} ago
          </span>
          <Link href={`/${pages.question}/${question._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {question.tags &&
          question.tags.map((tag) => <Tag key={question._id} tag={tag} />)}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          href={`/profile/${question.author._id}`}
          image="/assets/icons/avatar.svg"
          alt="user"
          value={question.author.name}
          title={`- asked ${getTimeStamp(question.createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <Metric
          image="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatNumber(question.upvotes)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          image="/assets/icons/message.svg"
          alt="messages"
          value={formatNumber(question.answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          image="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(question.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
