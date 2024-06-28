export const pages = {
  home: "//",
  signIn: "/sign-in",
  signUp: "/sign-up",
  community: "/community",
  collections: "/collections",
  jobs: "/jobs",
  tags: "/tags",
  profile: "/profile",
  editProfile: "/profile/edit",
  askQuestion: "/ask-question",
  question: "/question",
  editQuestion: "/question/edit",
} as const;

export type RouteType = (typeof pages)[keyof typeof pages];
