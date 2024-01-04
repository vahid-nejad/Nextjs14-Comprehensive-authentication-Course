import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}

declare module NodeJS {
  interface ProcessEnv {
    SMPT_EMAIL: string;
    SMTP_GMAIL_PASS: string;
  }
}
