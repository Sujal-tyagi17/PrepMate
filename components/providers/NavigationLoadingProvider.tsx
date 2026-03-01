"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/* ── Hook ────────────────────────────────────────────────────── */
export function useNavigate() {
    const router = useRouter();

    const navigate = useCallback(
        (url: string) => {
            // Signal the PageLoader to show
            window.dispatchEvent(new CustomEvent("pm:navstart"));
            router.push(url);
        },
        [router]
    );

    return { navigate };
}

// Keep named export for layout compat (no-op wrapper, loader is now PageLoader)
export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
