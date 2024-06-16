import Image from "next/image";
import Link from "next/link";
import React from "react";

const LogoLink = ({
  width,
  height,
  appNameClass,
}: {
  width: number;
  height: number;
  appNameClass: string;
}) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/site-logo.svg"
        width={width}
        height={height}
        alt="askdevs logo"
      />
      <p className={appNameClass}>
        Ask<span> </span>
        <span className="text-primary-500">Devs</span>
      </p>
    </Link>
  );
};

export default LogoLink;
