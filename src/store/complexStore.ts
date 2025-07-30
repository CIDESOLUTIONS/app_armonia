import { create } from "zustand";

interface ComplexState {
  selectedComplexId: string | null;
  selectedComplexName: string | null;
  allComplexes: { id: number; name: string; schemaName: string }[];
  setSelectedComplex: (id: string, name: string) => void;
  setAllComplexes: (
    complexes: { id: number; name: string; schemaName: string }[],
  ) => void;
}

export const useComplexStore = create<ComplexState>((set) => ({
  selectedComplexId: null,
  selectedComplexName: null,
  allComplexes: [],
  setSelectedComplex: (id, name) =>
    set({ selectedComplexId: id, selectedComplexName: name }),
  setAllComplexes: (complexes) => set({ allComplexes: complexes }),
}));
