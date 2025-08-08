import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const outift = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Wireframe2Code - Convert Wireframes to Code",
  description: "AI-powered tool to convert wireframes into production-ready code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={outift.className}
        suppressHydrationWarning
      >
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
