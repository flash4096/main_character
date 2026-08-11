import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Main Character – Memento Mori",
  description: "Remember that life is finite. Make every second feel valuable.",
};

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('main_character_theme') || 'classic';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-black text-neutral-100 antialiased selection:bg-neutral-800 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
