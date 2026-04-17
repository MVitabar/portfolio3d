import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "3D Artist Portfolio",
  description: "Portfolio showcasing 3D art and animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
    </html>
  );
}
