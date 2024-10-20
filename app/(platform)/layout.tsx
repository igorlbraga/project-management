import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "sonner"

function PlatformLayout({ children }: {
    children: React.ReactNode
}) {
    return <ClerkProvider
        appearance={{
            elements: {
                userButtonPopoverFooter: "hidden",
                organizationSwitcherPopoverFooter: "hidden",
            }
        }}
        afterSignOutUrl="/">
        <QueryProvider>
            <Toaster />
            <ModalProvider />
            {children}
        </QueryProvider>
    </ClerkProvider>;
}

export default PlatformLayout;