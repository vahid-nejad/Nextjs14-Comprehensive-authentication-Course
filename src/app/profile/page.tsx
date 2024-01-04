import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  //   if (!session || !session.user) redirect("/auth/signin");
  return (
    <div>
      <Image
        height={300}
        width={300}
        src={user?.image ?? ""}
        alt={user?.firstName ?? ""}
        className="rounded-full"
      />
      <div className="grid grid-cols-4 gap-y-4">
        <p>First Name:</p> <p className="col-span-3">{user?.firstName}</p>
        <p>Last Name:</p> <p className="col-span-3">{user?.lastName}</p>
        <p>Phone:</p> <p className="col-span-3">{user?.phone}</p>
        <p>Email:</p> <p className="col-span-3">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
