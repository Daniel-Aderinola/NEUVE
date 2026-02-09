import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'NEUVE | Contemporary Fashion',
  description:
    'An independent fashion brand inspired by the art, science and minimalism. Discover elevated essentials and statement pieces.',
  keywords: 'fashion, luxury, minimal, contemporary, clothing, designer',
  openGraph: {
    title: 'NEUVE | Contemporary Fashion',
    description: 'An independent fashion brand inspired by the art, science and minimalism.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
