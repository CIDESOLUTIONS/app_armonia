import { create } from "zustand";

interface CurrencyState {
  currency: "COP" | "USD" | "EUR";
  setCurrency: (currency: "COP" | "USD" | "EUR") => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: "COP", // Default currency
  setCurrency: (currency) => set({ currency }),
}));
