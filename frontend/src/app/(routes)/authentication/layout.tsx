import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docarite | Login",
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
      <div className="relative min-h-screen flex flex-col items-center">
        {children}
      </div>
  );
}
