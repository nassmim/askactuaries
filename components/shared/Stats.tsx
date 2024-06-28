import { formatNumber } from "@lib/utils";
import Image from "next/image";

const StatsCard = ({
  imageURL,
  value,
  title,
}: {
  imageURL: string;
  value: number;
  title: string;
}) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imageURL} alt={title} width={40} height={50} />
      <div>
        <p className="paragraph-semibold text-dark100_light900">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

const Stats = ({
  totalQuestions,
  totalAnswers,
}: {
  totalQuestions: number;
  totalAnswers: number;
}) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark100_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark100_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard
          imageURL="/assets/icons/gold-medal.svg"
          value={0}
          title="Gold badges"
        />
        <StatsCard
          imageURL="/assets/icons/silver-medal.svg"
          value={0}
          title="Silver badges"
        />
        <StatsCard
          imageURL="/assets/icons/bronze-medal.svg"
          value={0}
          title="Bronze badges"
        />
      </div>
    </div>
  );
};

export default Stats;
