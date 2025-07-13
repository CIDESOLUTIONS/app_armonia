"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface CurrencySwitcherProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export function CurrencySwitcher({ currency, setCurrency }: CurrencySwitcherProps) {
  const toggleCurrency = () => {
    setCurrency(currency === "COP" ? "USD" : "COP");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCurrency}
      title={currency === "COP" ? "Switch to USD" : "Cambiar a COP"}
    >
      <DollarSign className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle currency</span>
    </Button>
  );
}
