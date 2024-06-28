import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const currentDate = new Date();
  const timeDifferenceInMs = currentDate.getTime() - createdAt.getTime();

  const numberOfMsInMinute = 60 * 1000;
  const numberOfMsInHour = 60 * numberOfMsInMinute;
  const numberOfMsInDay = 24 * numberOfMsInHour;
  const numberOfMsInWeek = 7 * numberOfMsInDay;
  const numberOfMsInMonth = 30 * numberOfMsInDay;
  const numberOfMsInYear = 12 * numberOfMsInMonth;

  let adjustedTimeDifference: number;
  let nameToDisplay: string;

  if (timeDifferenceInMs < numberOfMsInMinute) {
    adjustedTimeDifference = Math.floor(timeDifferenceInMs / 1000);
    nameToDisplay = "second";
  } else if (timeDifferenceInMs < numberOfMsInHour) {
    adjustedTimeDifference = Math.floor(
      timeDifferenceInMs / numberOfMsInMinute,
    );
    nameToDisplay = "minute";
  } else if (timeDifferenceInMs < numberOfMsInDay) {
    adjustedTimeDifference = Math.floor(timeDifferenceInMs / numberOfMsInHour);
    nameToDisplay = "hour";
  } else if (timeDifferenceInMs < numberOfMsInWeek) {
    adjustedTimeDifference = Math.floor(timeDifferenceInMs / numberOfMsInDay);
    nameToDisplay = "day";
  } else if (timeDifferenceInMs < numberOfMsInMonth) {
    adjustedTimeDifference = Math.floor(timeDifferenceInMs / numberOfMsInWeek);
    nameToDisplay = "week";
  } else if (timeDifferenceInMs < numberOfMsInYear) {
    adjustedTimeDifference = Math.floor(timeDifferenceInMs / numberOfMsInMonth);
    nameToDisplay = "month";
  } else {
    adjustedTimeDifference = Math.floor(timeDifferenceInMs / numberOfMsInYear);
    nameToDisplay = "year";
  }

  return `${adjustedTimeDifference} ${adjustedTimeDifference > 1 && nameToDisplay + "s"}`;
};

export const formatNumber = (numberValue: number): string => {
  if (numberValue >= 1000000) return (numberValue / 1000000).toFixed(1) + "M";
  else if (numberValue >= 1000) return (numberValue / 1000).toFixed(1) + "k";
  else return numberValue.toString();
};

export const formatDateAsMonthYear = (date: Date) => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${year}`;
};
