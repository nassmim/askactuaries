"use client";
import { SignedOut } from "@clerk/clerk-react";
import Left from "./shared/navbar/LeftLinks";
import { pages } from "@constants";
import AuthButton from "./shared/auth/AuthButton";
import Image from "next/image";

const LeftSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        <Left isCollapsible={true} />
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <AuthButton
            route={pages.signIn}
            className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          >
            <Image
              src="/assets/icons/account.svg"
              alt="login"
              width={20}
              height={20}
              className="invert-colors lg:hidden"
            />
            <span className="primary-text-gradient max-lg:hidden">Sign In</span>
          </AuthButton>
          <AuthButton
            route={pages.signUp}
            className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          >
            <Image
              src="/assets/icons/sign-up.svg"
              alt="sign up"
              width={20}
              height={20}
              className="invert-colors lg:hidden"
            />
            <span className="max-lg:hidden">Sign Up</span>
          </AuthButton>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
