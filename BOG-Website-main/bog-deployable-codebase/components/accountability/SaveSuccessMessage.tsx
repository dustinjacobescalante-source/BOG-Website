'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SaveSuccessMessage() {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setVisible(false);
    }, 2500);

    const cleanupTimer = window.setTimeout(() => {
      router.replace(pathname);
    }, 3200);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [router, pathname]);

  return (
    <div
      className={`rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300 transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      Saved successfully.
    </div>
  );
}
