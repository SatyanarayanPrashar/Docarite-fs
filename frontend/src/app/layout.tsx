import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";

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
          <div className="fixed top-0 left-0 w-screen h-screen -z-10">
            <Image
              src="/backgound.png"
              alt="Background"
              fill
              priority
            />
          </div>

          {children}
      </body>
    </html>
  );
}
