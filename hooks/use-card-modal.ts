import { create } from "zustand";

type CardModalStore = {
    id?: string,
    isOpen: boolean,
    setOpen: (value: boolean, id?: string) => void
}

export const useCardModal = create<CardModalStore>((set) => ({
    id: undefined,
    isOpen: false,
    setOpen: (value, id) => set({ isOpen: value, id })
}))