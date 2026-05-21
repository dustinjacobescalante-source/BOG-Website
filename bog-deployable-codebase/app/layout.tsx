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
    startupImage: [
      {
        url: "/images/bog-splash-1290x2796.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/images/bog-splash-1290x2796.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/images/bog-splash-1290x2796.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/images/bog-splash-1290x2796.png",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/images/bog-splash-1290x2796.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/images/bog-splash-1290x2796.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
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
  themeColor: "#000000",
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
