import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Project Aegis | Geospatial Risk Intelligence',
  description:
    'Real-time mapping of NASA EONET natural hazard events against critical human infrastructure — powered by GeoPandas, Overpass API, and local LLM inference.',
  keywords: [
    'geospatial intelligence', 'NASA EONET', 'natural hazards',
    'critical infrastructure', 'risk analysis', 'GeoPandas',
  ],
  authors: [{ name: 'SAKEC Capstone Team 2026' }],
  openGraph: {
    title: 'Project Aegis — Geospatial Risk Intelligence',
    description: 'Real-time hazard mapping against critical infrastructure.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#08090C] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}