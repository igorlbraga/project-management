"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./sidebar";

export function MobileSidebar() {
    const pathname = usePathname()

    const { isOpen, setOpen } = useMobileSidebar()

    useEffect(() => setOpen(false), [pathname, setOpen])

    return (
        <div>
            <Button
                onClick={() => setOpen(true)}
                className="block md:hidden mr-2"
                variant="ghost"
                size="sm"
            >
                <Menu className="w-4 h-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={() => setOpen(false)}>
                <SheetContent
                    side="left"
                    className="p-2 pt-10"
                >
                    <Sidebar
                        storageKey="t-sidebar-mobile-state"
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
} 