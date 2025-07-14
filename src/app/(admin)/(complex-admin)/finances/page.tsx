"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getFinanceSummary,
  getRecentTransactions,
} from "@/services/financeService";
import { BankStatementUpload } from "@/components/finances/BankStatementUpload";

export default function FinancesPage() {
  // ... (existing code)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Módulo Financiero
      </h1>

      <div className="mb-8">
        <BankStatementUpload />
      </div>

      {/* ... (rest of the component) */}
    </div>
  );
}
