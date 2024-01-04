"use client";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be atleast 2 characters")
      .max(45, "First name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed!"),
    lastName: z
      .string()
      .min(2, "Last name must be atleast 2 characters")
      .max(45, "Last name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed!"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "Please enter a valid phone number!"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters ")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters ")
      .max(50, "Password must be less than 50 characters"),
    accepted: z.literal(true, {
      errorMap: () => ({
        message: "Please accept all terms",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password doesn't match!",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const [passStrength, setPassStrength] = useState(0);
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
  }, [watch().password]);
  const toggleVisblePass = () => setIsVisiblePass((prev) => !prev);

  const saveUser: SubmitHandler<InputType> = async (data) => {
    const { accepted, confirmPassword, ...user } = data;
    try {
      const result = await registerUser(user);
      toast.success("The User Registered Successfully.");
    } catch (error) {
      toast.error("Something Went Wrong!");
      console.error(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(saveUser)}
      className="grid grid-cols-2 gap-3 p-2 place-self-stretch shadow border rounded-md"
    >
      <Input
        errorMessage={errors.firstName?.message}
        isInvalid={!!errors.firstName}
        {...register("firstName")}
        label="First Name"
        startContent={<UserIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.lastName?.message}
        isInvalid={!!errors.lastName}
        {...register("lastName")}
        label="Last Name"
        startContent={<UserIcon className="w-4" />}
      />
      <Input
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
        {...register("email")}
        className="col-span-2"
        label="Email"
        startContent={<EnvelopeIcon className="w-4" />}
      />{" "}
      <Input
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        {...register("phone")}
        className="col-span-2"
        label="Phone"
        startContent={<PhoneIcon className="w-4" />}
      />{" "}
      <Input
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        {...register("password")}
        className="col-span-2"
        label="Password"
        type={isVisiblePass ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
        endContent={
          isVisiblePass ? (
            <EyeSlashIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisblePass}
            />
          ) : (
            <EyeIcon
              className="w-4 cursor-pointer"
              onClick={toggleVisblePass}
            />
          )
        }
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
        {...register("confirmPassword")}
        className="col-span-2"
        label="Confirm Password"
        type={isVisiblePass ? "text" : "password"}
        startContent={<KeyIcon className="w-4" />}
      />
      <Controller
        control={control}
        name="accepted"
        render={({ field }) => (
          <Checkbox
            onChange={field.onChange}
            onBlur={field.onBlur}
            className="col-span-2"
          >
            I Accept The <Link href="/terms">Terms</Link>
          </Checkbox>
        )}
      />
      {!!errors.accepted && (
        <p className="text-red-500">{errors.accepted.message}</p>
      )}
      <div className="flex justify-center col-span-2">
        <Button className="w-48" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
