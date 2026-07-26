import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Main Character – Memento Mori",
  description: "Remember that life is finite. Make every second feel valuable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-neutral-100 antialiased selection:bg-neutral-800 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
