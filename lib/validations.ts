import { z } from "zod";
export const questionFormFields = {
  title: "title",
  explanation: "explanation",
  tags: "tags",
} as const;

export const QuestionFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "The title must be at least 5 characters." })
    .max(100, { message: "The title can't exceed 100 characters" }),

  explanation: z.string().min(100, {
    message:
      "You must fully explain your request. A minimum of 100 characters is required",
  }),
  tags: z
    .array(
      z.string().min(2, { message: "Tag must be at least of 2 characters" }),
    )
    .min(1, { message: "You must add at least one tag for your question" })
    .max(3, { message: "No more than 3 tags for one question." }),
});

export const answerFormFields = {
  answer: "answer",
} as const;

export const AnswerFormSchema = z.object({
  answer: z.string(),
});

export const ProfileFormSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2).max(50),
  bio: z.string().min(10).max(150),
  location: z.string().min(2),
  portfolioURL: z.string().url(),
});
