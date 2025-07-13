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
import { getFinanceSummary, getRecentTransactions } from "@/services/financeService";
