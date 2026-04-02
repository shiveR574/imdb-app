import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.scss";
import NavBar from "../components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMDB App",
  description: "A simple IMDb clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
      <main> 
        {children} 
      </main>
      </body>
    </html>
  )
}