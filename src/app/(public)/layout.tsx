"use client";

import { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="public-layout">
      {children}
    </div>
  );
}