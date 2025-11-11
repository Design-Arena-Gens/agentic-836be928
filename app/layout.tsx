import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const font = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Go To Market AI Agent',
  description:
    'Agentic workspace that builds go-to-market strategies, launch playbooks, and growth loops for AI products.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={font.className}>{children}</body>
    </html>
  );
}
