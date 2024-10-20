import { OrganizationProfile } from "@clerk/nextjs";

export default function SettingsPage() {
    return (
        <div className="w-full">
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: "w-full shadow-none",
                        cardBox: "w-full shadow-none",
                    }
                }}
            />
        </div>
    );
}