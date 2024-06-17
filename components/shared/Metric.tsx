import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MetricProps {
  value: string | number;
  href?: string;
  image: string;
  alt: string;
  title: string;
  textStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  value,
  href,
  image,
  alt,
  title,
  textStyles,
  isAuthor,
}: MetricProps) => {
  const content = (
    <>
      <Image
        src={image}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {content}
      </Link>
    );
  } else return <div className="flex-center flex-wrap gap-1">{content}</div>;
};

export default Metric;
