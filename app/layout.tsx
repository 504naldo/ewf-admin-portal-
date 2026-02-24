import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EWF Emergency Call - Admin Portal',
  description: 'Admin dashboard for EWF Emergency Call System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
