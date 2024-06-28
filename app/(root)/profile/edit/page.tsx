import { getProfile } from "@actions/profile.actions";
import { getUser } from "@actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Profile from "@components/forms/Profile";
import { ParamsProps } from "@types";

const EditProfile = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return;

  let user;
  try {
    user = await getUser({ userId });
  } catch (error) {
    return;
  }
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile user={JSON.stringify(user)} />
      </div>
    </>
  );
};

export default EditProfile;
