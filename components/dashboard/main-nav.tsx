"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6 overflow-x-auto", className)}
            {...props}
        >
            <Link
                href="/dashboard"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                )}
            >
                Dashboard
            </Link>
            <Link
                href="/check-in"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/check-in" ? "text-primary" : "text-muted-foreground"
                )}
            >
                Check In
            </Link>
            <Link
                href="/visitors"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/visitors" ? "text-primary" : "text-muted-foreground"
                )}
            >
                History
            </Link>
        </nav>
    );
}
