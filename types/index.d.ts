import { BADGE_CRITERIA, RouteType } from "@/constants";
import { IUser } from "@database";
import { Schema } from "mongoose";

export interface IDeleteUserParams {
  clerkId: string;
}

export interface IUpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}
export interface ICreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}
export interface IGetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface ICreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId[] | IUser;
  path: string;
}

export interface TagType {
  _id: string;
  name: string;
  totalQuestions?: number;
}

export interface AuthorType {
  _id: string;
  name: string;
  picture: string;
}

export interface QuestionType {
  _id: string;
  title: string;
  tags: TagType[];
  author: AuthorType;
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

export interface SidebarLink {
  imgURL: string;
  route: RouteType;
  label: string;
}

export interface FilterType {
  name: string;
  value: string;
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
