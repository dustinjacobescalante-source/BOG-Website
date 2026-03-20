import './globals.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import type { Metadata } from "next";
import "./globals.css";
import NavVisibility from "@/components/layout/NavVisibility";

export const metadata: Metadata = {
  title: "BOG | Brotherhood of Growth",
  description:
    "A brotherhood platform built on discipline, accountability, growth, and leadership.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black text-white antialiased">
        <NavVisibility />
        {children}
      </body>
    </html>
  );
}
        <div
          className="fixed inset-0 -z-30 opacity-50"
          style={{
            backgroundImage: "url('/assets/buffalo.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '1000px',
          }}
        />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.14),transparent_20%),linear-gradient(180deg,#090909_0%,#000_100%)]" />
        <div className="fixed inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
