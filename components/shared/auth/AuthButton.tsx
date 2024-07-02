import { Button } from "@components/ui/button";
import { RouteType } from "@constants";
import Link from "next/link";
import React from "react";

const AuthButton = ({
  children,
  route,
  label,
  className,
}: {
  children?: React.ReactNode;
  route: RouteType;
  label?: string;
  className: string;
}) => {
  return (
    <Link href={`${route}`}>
      <Button className={className}>
        {label}
        {children}
      </Button>
    </Link>
  );
};

export default AuthButton;
