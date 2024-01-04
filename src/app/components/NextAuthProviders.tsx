import { Button } from "@nextui-org/react";

import { signIn } from "next-auth/react";

const NextAuthProviders = () => {
  const googleSignIn = async () => {
    const result = await signIn("google", {
      callbackUrl: "/",
    });
    console.log({ result });
  };
  return (
    <div className="flex justify-center items-center p-4 border-t m-3">
      <Button onClick={googleSignIn}>Sign in with Google</Button>
    </div>
  );
};

export default NextAuthProviders;
