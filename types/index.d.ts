import { BADGE_CRITERIA, RouteType } from "@/constants";
import { IUser } from "@database";
import { Schema, SortOrder } from "mongoose";

export interface IGetAllTagsParams {
  page?: number;
  limit?: number;
  filter?: string;
  searchQuery?: string;
}

export interface IGetUserTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface IGetAllUsersParams {
  page?: number;
  limit?: number;
  filter?: string;
  searchQuery?: string;
}

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

export interface IGetQuestionAnswersParams {
  questionId: string;
  filter?: string;
  page?: number;
  limit?: number;
}

export interface ICreateAnswerParams {
  content: string;
  author: string;
  questionId: string;
  path: string;
}

export interface IQuestionVoteParams {
  questionId: string;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  action: string;
  path: string;
}

export interface IToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

export interface IAnswerVoteParams {
  answerId: string;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  action: string;
  path: string;
}

export interface IGetUserQuestionsParams {
  questionId: string;
  userId: string | undefined;
}

export interface IGetQuestionParams {
  questionId: string;
}

export interface IGetUserStatsParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface ICreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId[] | IUser;
  path: string;
}

interface TagType {
  _id: string;
  name: string;
  totalQuestions?: number;
}

export interface AuthorType {
  _id: string;
  clerkId?: string;
  name: string;
  picture: string;
}

interface UserType {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  picture: string;
  portfolioURL?: string;
  reputation: number;
  joinedAt: Date;
}

interface QuestionType {
  _id: string;
  title: string;
  content: string;
  author: AuthorType;
  upvotes: UserType[];
  views: number;
  createdAt: Date;
}

interface AnswerType {
  _id: string;
  content: string;
  question: QuestionType;
  author: AuthorType;
  upvotes: UserType[];
  downvotes: UserType[];
  createdAt: Date;
}

export interface PopulatedUserType extends UserType {
  saved?: QuestionType[];
}

export interface PopulatedQuestionType extends QuestionType {
  answers: AnswerType[];
  tags: TagType[];
}

export interface PopulatedTagType extends TagType {
  questions: QuestionType[];
  followers: UserType[];
}

export interface IGetQuestionsParams {
  userId?: string;
  clerkId?: string;
  tagId?: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
  sort?: {
    [key: string]: SortOrder;
  };
  limit?: number;
}

export interface IDeleteQuestionParams {
  questionId: string;
  path: string;
}

export interface IDeleteAnswerParams {
  answerId: string;
  path: string;
}

export interface PopulatedAnswerType extends AnswerType {
  content: string;
}

export interface IViewQuestionParams {
  questionId: string;
  userId: string | undefined;
  path: string;
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

export interface IEditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
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

export interface IGetUserParams {
  userId: string;
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
