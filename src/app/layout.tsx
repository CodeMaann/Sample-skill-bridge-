import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillBridge | Navigate Your Career Path',
  description: 'High-end career trajectory visualization and skill-gap analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}