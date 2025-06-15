import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docarite",
  description: "Automated documentation",
  icons: {
    icon: "/logo_no_name.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen flex flex-col items-center">
          {children}
      </body>
    </html>
  );
}
