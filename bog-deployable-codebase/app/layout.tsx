import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavVisibility from "@/components/layout/NavVisibility";
import FooterVisibility from "@/components/layout/FooterVisibility";
import AppLaunchScreen from "@/components/layout/AppLaunchScreen";

export const metadata: Metadata = {
  title: "BOG Buffalo Dogs",
  description: "BOG Buffalo Dogs | Brotherhood of Growth",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png?v=3",
    shortcut: "/icon.png?v=3",
    apple: "/apple-icon.png?v=3",
  },
  appleWebApp: {
    capable: true,
    title: "BOG",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0f16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="min-h-screen bg-black text-white antialiased">
        <AppLaunchScreen />

        <div
          className="fixed inset-0 -z-30 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.06) 0, transparent 55%)",
            backgroundSize: "1000px",
          }}
        />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_20%),linear-gradient(180deg,#090909_0%,#000_100%)]" />
        <div className="fixed inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />

        <NavVisibility />
        <main>{children}</main>
        <FooterVisibility />
      </body>
    </html>
  );
}
