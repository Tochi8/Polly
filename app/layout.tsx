import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polly",
  description: "Manipulation-proof polls for social communities",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={dmSans.variable}
    >
      <body className="min-h-full flex flex-col">
        {children}
        </body>
    </html>
  );
}
