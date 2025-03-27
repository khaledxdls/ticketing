import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { getCurrentUser } from "./_lib/auth/actions";
import Header from "./_components/Header";
import { UserContext } from "./_context/userContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
type user = {
  id: string;
  email: string;
} | null;
export const metadata: Metadata = {
  title: "Ticketing App",
  description: "Buy and sell tickets for your favorite events",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get current user for the navigation
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header currentUser={currentUser} />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
