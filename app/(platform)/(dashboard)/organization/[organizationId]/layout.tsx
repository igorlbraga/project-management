
import { startCase } from "lodash";

export async function generateMetadata() {
    const { orgSlug } = auth()

    return {
        title: startCase(orgSlug || "organization")
    }
}

import { OrgControl } from "./_components/org-control";
import { auth } from "@clerk/nextjs/server";

export default function OrganizationIdLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full">
            <OrgControl />
            {children}
        </div>
    );
}