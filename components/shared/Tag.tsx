import { Badge } from "@components/ui/badge";
import Link from "next/link";
import React from "react";

const Tag = ({ tag, showCount }: { tag: any; showCount: boolean }) => {
  return (
    <Link href={`/tags/${tag._id}`} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {tag.name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">
          {tag.totalQuestions}
        </p>
      )}
    </Link>
  );
};

export default Tag;
