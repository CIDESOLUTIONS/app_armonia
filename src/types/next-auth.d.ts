import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
      complexId?: string | null;
      schemaName?: string | null;
      isGlobalAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    complexId?: string | null;
    schemaName?: string | null;
    isGlobalAdmin?: boolean;
  }
}
