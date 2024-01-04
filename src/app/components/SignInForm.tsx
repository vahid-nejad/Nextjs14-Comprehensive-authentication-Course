"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import NextAuthProviders from "./NextAuthProviders";

interface Props {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

type InputType = z.infer<typeof FormSchema>;

const SignInForm = (props: Props) => {
  const router = useRouter();
  const [visiblePass, setVisiblePass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.email,
      password: data.password,
    });
    if (!result?.ok) {
      toast.error(result?.error);
      return;
    }
    toast.success("Welcome To Sakura Dev Channel");
    router.push(props.callbackUrl ? props.callbackUrl : "/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 border rounded-md shadow overflow-hidden w-full"
    >
      <div className="bg-gradient-to-b from-white to-slate-200 dark:from-slate-700 dark:to-slate-900 p-2 text-center">
        Sign In Form
      </div>
      <div className="p-2 flex flex-col gap-2">
        <Input label="Email" {...register("email")} errorMessage={errors.email?.message} />
        <Input
          label="Password"
          {...register("password")}
          type={visiblePass ? "text" : "password"}
          errorMessage={errors.password?.message}
          endContent={
            <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
              {visiblePass ? <EyeSlashIcon className="w-4" /> : <EyeIcon className="w-4" />}
            </button>
          }
        />
        <div className="flex items-center justify-center gap-2">
          <Button color="primary" type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
          <Button as={Link} href="/auth/signup">
            Sign Up
          </Button>
        </div>
      </div>
      <NextAuthProviders />
    </form>
  );
};

export default SignInForm;
