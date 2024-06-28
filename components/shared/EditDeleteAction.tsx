"use client";
import { deleteAnswer } from "@actions/answer.actions";
import { deleteQuestion } from "@actions/question.actions";
import { pages } from "@constants";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const EditDeleteAction = ({
  type,
  itemId,
}: {
  type: string;
  itemId: string;
}) => {
  const pathName = usePathname();
  const router = useRouter();

  const handleEdit = () => router.push(`${pages.editQuestion}/${itemId}`);

  const handleDelete = async () => {
    if (type === "question")
      await deleteQuestion({ questionId: itemId, path: pathName });
    else await deleteAnswer({ answerId: itemId, path: pathName });
  };

  return (
    <div className="max:sm:w-full flex items-center justify-end gap-3">
      {type === "question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
