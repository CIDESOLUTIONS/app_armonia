"use client";

import { SessionProvider } from "next-auth/react";
import { TranslationProvider } from "@/context/TranslationContext";
import { ToastProvider } from "@/components/ui/use-toast";
import { ReactNode } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TranslationProvider>
        <ToastProvider>{children}</ToastProvider>
      </TranslationProvider>
    </SessionProvider>
  );
}
