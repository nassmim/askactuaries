import { SheetClose } from "@components/ui/sheet";
import { sidebarLinks } from "@constants/sidebar";
import { SidebarLink } from "@types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({
  link,
  isActive,
  isCollapsible,
}: {
  link: SidebarLink;
  isActive: boolean;
  isCollapsible?: boolean;
}) => {
  return (
    <Link
      key={link.route}
      href={link.route}
      className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
    >
      <Image
        src={link.imgURL}
        alt={link.label}
        width={20}
        height={20}
        className={`${isActive ? "" : "invert-colors"}`}
      />
      <p
        className={`${isActive ? "base-bold" : "base-medium"} ${isCollapsible && "max-lg:hidden"}`}
      >
        {link.label}
      </p>
    </Link>
  );
};

const LeftLinks = ({
  sheetClose,
  isCollapsible,
}: {
  sheetClose?: boolean;
  isCollapsible?: boolean;
}) => {
  const pathName = usePathname();

  return (
    <>
      {sidebarLinks.map((link) => {
        const isActive =
          pathName === link.route ||
          (link.route.length > 1 && pathName.includes(link.route));

        return sheetClose ? (
          <SheetClose asChild key={link.route}>
            <NavLink
              link={link}
              isActive={isActive}
              isCollapsible={isCollapsible}
            />
          </SheetClose>
        ) : (
          <NavLink
            key={link.route}
            link={link}
            isActive={isActive}
            isCollapsible={isCollapsible}
          />
        );
      })}
    </>
  );
};

export default LeftLinks;
