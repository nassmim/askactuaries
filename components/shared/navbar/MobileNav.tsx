"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import LogoLink from "../LogoLink";
import { SignedOut } from "@clerk/nextjs";
import { pages } from "@constants";

import AuthButton from "../auth/AuthButton";
import Left from "./LeftLinks";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>

      <SheetContent
        side={"left"}
        className="background-light900_dark200 border-none"
      >
        <LogoLink
          width={23}
          height={23}
          appNameClass="h2-bold text-dark100_light900 font-spaceGrotesk"
        />
        <div>
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <Left />
            </section>
          </SheetClose>

          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose>
                <AuthButton
                  route={pages.signIn}
                  className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                >
                  <span className="primary-text-gradient">Sign In</span>
                </AuthButton>
                <AuthButton
                  route={pages.signUp}
                  label="Sign Up"
                  className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                ></AuthButton>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
