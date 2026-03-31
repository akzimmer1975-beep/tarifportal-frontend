"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isExpertEnabled } from "@/lib/expert-auth";

type ExpertGateProps = {
  children: ReactNode;
};

export default function ExpertGate({ children }: ExpertGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = isExpertEnabled();
    setAllowed(ok);

    if (!ok && pathname !== "/expert/login") {
      router.replace("/expert/login");
    }
  }, [pathname, router]);

  if (allowed === null) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
          Expertenbereich wird geladen…
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}