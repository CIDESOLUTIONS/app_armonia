import { create } from 'zustand';

interface ComplexState {
  selectedComplexId: string | null;
  selectedComplexName: string | null;
  setSelectedComplex: (id: string, name: string) => void;
}

export const useComplexStore = create<ComplexState>((set) => ({
  selectedComplexId: null,
  selectedComplexName: null,
  setSelectedComplex: (id, name) => set({ selectedComplexId: id, selectedComplexName: name }),
}));
