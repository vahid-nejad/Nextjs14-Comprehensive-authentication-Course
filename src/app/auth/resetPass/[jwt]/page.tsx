import ResetPasswordForm from "@/app/components/ResetPasswordForm";
import { verifyJwt } from "@/lib/jwt";

interface Props {
  params: {
    jwt: string;
  };
}

const ResetPasswordPage = ({ params }: Props) => {
  const payload = verifyJwt(params.jwt);
  if (!payload)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        The URL is not valid!
      </div>
    );
  return (
    <div className="flex justify-center">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
};

export default ResetPasswordPage;
