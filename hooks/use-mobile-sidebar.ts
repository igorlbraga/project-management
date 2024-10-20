import { create } from "zustand";

type MobileSidebarStore = {
    isOpen: boolean,
    setOpen: (value: boolean) => void
}

export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
    isOpen: false,
    setOpen: (value) => set({ isOpen: value })
}))