import { create } from "zustand";

interface CommandPaletteState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
