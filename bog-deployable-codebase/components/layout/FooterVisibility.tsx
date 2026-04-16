"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

export default function FooterVisibility() {
  const pathname = usePathname();

  const hideFooter =
    pathname.startsWith("/admin") || pathname.startsWith("/portal");

  if (hideFooter) return null;

  return <Footer />;
}
