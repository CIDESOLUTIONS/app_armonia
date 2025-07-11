"use client";

import { TranslationProvider } from "@/context/TranslationContext";
import { ToastProvider } from "@/components/ui/use-toast";
import { ReactNode } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <ToastProvider>{children}</ToastProvider>
    </TranslationProvider>
  );
}
