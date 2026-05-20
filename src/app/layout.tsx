import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.scss";
import NavBar from "../components/NavBar";
import SessionProvider from "@/src/utils/SessionProvider";
import {getServerSession} from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMDB App",
  description: "A simple IMDb clone built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <NavBar />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}