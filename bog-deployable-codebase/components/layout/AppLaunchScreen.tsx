"use client";

import { useEffect, useState } from "react";

function isRunningAsInstalledApp() {
  if (typeof window === "undefined") return false;

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function AppLaunchScreen() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!isRunningAsInstalledApp()) {
      return;
    }

    setShouldRender(true);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 5000);

    const removeTimer = window.setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = originalOverflow;
    }, 5650);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-700 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
      aria-label="BOG app loading screen"
    >
      <div className="absolute inset-0 bg-black" />

      <img
        src="/images/bog-app-opener.png"
        alt="BOG app opener"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.38)_78%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
}
