import { getUserTopInteractedTags } from "@actions/tag.actions";
import Tag from "@components/shared/Tag";
import { pages } from "@constants";
import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags = await getUserTopInteractedTags({
    userId: user.clerkId,
  });

  return (
    <Link
      href={`/${pages.profile}/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt={`picture of ${user.username}`}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 && (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <Tag key={tag._id} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
