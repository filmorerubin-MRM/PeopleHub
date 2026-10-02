import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleHub — Employee Experience",
  description: "A centralized employee support, learning, and wellness portal.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
