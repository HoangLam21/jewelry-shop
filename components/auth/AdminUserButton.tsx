"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * UserButton component for Admin Sidebar with larger avatar size
 * This component provides logout and manage account functionality
 */
export default function AdminUserButton() {
    useEffect(() => {
        // Listen for unhandled errors from Clerk
        const handleError = (event: ErrorEvent) => {
            // Check if it's a Clerk network error
            if (
                event.error?.message?.includes("Failed to fetch") ||
                event.error?.message?.includes("Network error") ||
                event.error?.message?.includes("clerk")
            ) {
                console.warn("Clerk network error detected, this may be temporary:", event.error);
                // Don't prevent default - let Clerk handle retries
                // The error is likely transient and will be retried automatically
            }
        };

        window.addEventListener("error", handleError);

        return () => {
            window.removeEventListener("error", handleError);
        };
    }, []);

    return (
        <UserButton
            appearance={{
                elements: {
                    avatarBox: "w-[70px] h-[70px]",
                },
            }}
            afterSignOutUrl="/"
            // Add error handling for sign out
            userProfileProps={{
                appearance: {
                    elements: {
                        rootBox: "shadow-none",
                    },
                },
            }}
        />
    );
}
