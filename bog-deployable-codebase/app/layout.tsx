import './globals.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: site.name,
  description: 'BOG public website and private member platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative bg-black text-white">
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
