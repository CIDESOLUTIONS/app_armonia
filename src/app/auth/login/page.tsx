"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const portalParam = searchParams.get("portal") as
    | "admin"
    | "resident"
    | "reception"
    | null;

  return <LoginForm portalType={portalParam} />;
}
