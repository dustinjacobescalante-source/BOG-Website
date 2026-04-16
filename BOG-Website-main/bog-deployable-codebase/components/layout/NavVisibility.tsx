"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/nav";

export default function NavVisibility() {
  const pathname = usePathname();

  const hideNav =
    pathname.startsWith("/portal") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth");

  if (hideNav) return null;

  return <Nav />;
}
