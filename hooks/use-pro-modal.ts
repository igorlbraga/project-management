import { create } from "zustand";

type ProModalStore = {
    isOpen: boolean,
    setOpen: (value: boolean, id?: string) => void
}

export const useProModal = create<ProModalStore>((set) => ({
    isOpen: false,
    setOpen: (value) => set({ isOpen: value })
}))