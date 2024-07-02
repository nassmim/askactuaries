"use client";
import { voteAnswer } from "@actions/answer.actions";
import { viewQuestion } from "@actions/interaction.actions";
import { voteQuestion } from "@actions/question.actions";
import { toggleSaveQuestion } from "@actions/user.actions";
import { toast } from "@components/ui/use-toast";
import { formatNumber } from "@lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface VotesProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const VotingArrow = ({
  action,
  votes,
  hasVoted,
  hasVotedIcon,
  hasNotVotedIcon,
  hasVotedAlt,
  hasNotVotedAlt,
  handleClick,
}: {
  action: string;
  votes: number;
  hasVoted: boolean;
  hasVotedIcon: string;
  hasNotVotedIcon: string;
  hasVotedAlt: string;
  hasNotVotedAlt: string;
  handleClick: (action: string) => void;
}) => {
  return (
    <div className="flex-center gap-1">
      <Image
        src={hasVoted ? hasVotedIcon : hasNotVotedIcon}
        alt={hasVoted ? hasVotedAlt : hasNotVotedAlt}
        width={18}
        height={18}
        className="cursor-pointer"
        onClick={() => handleClick(action)}
      />
      <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
        <p className="subtle-medium text-dark400_light900">
          {formatNumber(votes)}
        </p>
      </div>
    </div>
  );
};

export const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: VotesProps) => {
  const router = useRouter();
  const path = usePathname();

  const handleSave = () => {
    toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path,
    });
    return toast({
      title: hasSaved ? "Removed from bookmarks" : "Bookmarked",
      variant: hasSaved ? "destructive" : "default",
    });
  };

  const handleVote = async (action: string) => {
    if (!userId)
      return toast({ title: "Please login", description: "Please login" });

    if (type === "question") {
      await voteQuestion({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasUpVoted,
        hasDownVoted,
        action,
        path,
      });
    } else if (type === "answer") {
      await voteAnswer({
        answerId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasUpVoted,
        hasDownVoted,
        action,
        path,
      });
    }

    toast({
      title:
        action === "upvote"
          ? hasUpVoted
            ? "Upvote Removed"
            : "Upvote done successfully"
          : hasDownVoted
            ? "downvote Removed"
            : "Downvote done successfully",
      variant:
        action === "upvote"
          ? hasUpVoted
            ? "destructive"
            : "default"
          : hasDownVoted
            ? "destructive"
            : "default",
    });
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
      path,
    });
  }, [itemId, userId, path, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <VotingArrow
          action="upvote"
          votes={upvotes}
          hasVoted={hasUpVoted}
          hasVotedIcon="/assets/icons/upvoted.svg"
          hasNotVotedIcon="/assets/icons/upvote.svg"
          hasVotedAlt="downvote"
          hasNotVotedAlt="upvote"
          handleClick={handleVote}
        />
        <VotingArrow
          action="downvote"
          votes={downvotes}
          hasVoted={hasDownVoted}
          hasVotedIcon="/assets/icons/downvoted.svg"
          hasNotVotedIcon="/assets/icons/downvote.svg"
          hasVotedAlt="upvote"
          hasNotVotedAlt="downvote"
          handleClick={handleVote}
        />
      </div>

      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt={hasSaved ? "unsave" : "save"}
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};
