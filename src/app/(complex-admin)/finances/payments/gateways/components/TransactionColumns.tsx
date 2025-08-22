"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, RotateCcw, CreditCard, Banknote, Smartphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";
    case "REFUNDED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "COMPLETED":
      return "Completada";
    case "PENDING":
      return "Pendiente";
    case "FAILED":
      return "Fallida";
    case "REFUNDED":
      return "Reembolsada";
    default:
      return status;
  }
};

const getProviderIcon = (provider) => {
  switch (provider) {
    case "STRIPE":
      return <CreditCard className="h-4 w-4" />;
    case "PAYPAL":
      return <Smartphone className="h-4 w-4" />;
    case "PSE":
      return <Banknote className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

const formatCurrency = (amount, currency = "COP") => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const transactionColumns = ({ onRefund, onViewDetails, isRefunding }) => [
  {
    accessorKey: "providerTransactionId",
    header: "ID Transacción",
    cell: ({ row }) => {
      const id = row.getValue("providerTransactionId");
      return (
        <div className="font-mono text-sm">
          {id ? id.substring(0, 12) + "..." : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      return (
        <div className="font-medium">
          {formatCurrency(amount, currency)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge 
          variant="outline" 
          className={getStatusColor(status)}
        >
          {getStatusText(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Pasarela",
    cell: ({ row }) => {
      const provider = row.getValue("provider");
      return (
        <div className="flex items-center gap-2">
          {getProviderIcon(provider)}
          <span className="capitalize">
            {provider?.toLowerCase()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Usuario",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium">{user?.name || "Usuario"}</div>
          <div className="text-sm text-muted-foreground">
            {user?.email || "sin-email@ejemplo.com"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString("es-CO")}</div>
          <div className="text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true, locale: es })}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      const canRefund = transaction.status === "COMPLETED";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {canRefund && (
              <DropdownMenuItem 
                onClick={() => onRefund(transaction.id)}
                disabled={isRefunding}
                className="text-red-600 focus:text-red-600"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {isRefunding ? "Procesando..." : "Reembolsar"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];