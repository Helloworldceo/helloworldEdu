import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helloworldceo — Learn, Build, Grow",
  description: "A modern education platform for university students. Browse courses, watch video lessons, take quizzes, and earn certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t py-6 text-center text-sm text-gray-400">
            © 2026 Helloworldceo. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
