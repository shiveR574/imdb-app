import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.scss";
import NavBar from "../components/NavBar";
import MovieList from "../components/MovieList";

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
        <MovieList />
        {children}
      </body>
    </html>
  )
}