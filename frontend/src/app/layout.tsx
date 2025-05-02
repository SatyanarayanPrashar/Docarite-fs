import type { Metadata } from "next";
import "./globals.css";
import Main_wrapper from "@/components/main_wrapper";

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
      <body className="">
        <Main_wrapper>
          {children}
        </Main_wrapper>
      </body>
    </html>
  );
}
