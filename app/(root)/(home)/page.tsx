import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/"></UserButton>
    </div>
  );
};

export default Home;
