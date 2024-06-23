interface VotesProps {
  type: string;
  questionId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = () => {
  return <div>Votes</div>;
};

export default Votes;
