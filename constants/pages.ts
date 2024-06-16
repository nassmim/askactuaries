export const pages = {
  home: "/",
  signIn: "sign-in",
  signUp: "sign-up",
  community: "community",
  collections: "collections",
  jobs: "jobs",
  tags: "tags",
  profile: "profile",
  askQuestion: "ask-question",
} as const;

export type RouteType = (typeof pages)[keyof typeof pages];
