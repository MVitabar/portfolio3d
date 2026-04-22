import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "M Vitabar | 3D Artist & CGI Specialist | Product Visualization Brazil",
  description: "Professional 3D artist and CGI specialist based in Brazil. Creating photorealistic product visualizations, CGI renders, and 3D animations for e-commerce, advertising, and digital campaigns. Transform your concepts into stunning 3D visuals.",
  keywords: ["3D artist", "CGI specialist", "product visualization", "photorealistic rendering", "3D animation", "Brazil", "e-commerce", "advertising", "CGI artist", "3D modeling"],
  authors: [{ name: "M Vitabar" }],
  creator: "M Vitabar",
  publisher: "M Vitabar Studio",
  openGraph: {
    title: "M Vitabar | 3D Artist & CGI Specialist | Brazil",
    description: "Professional 3D artist creating photorealistic product visualizations and CGI solutions. Based in Brazil, serving global brands and agencies with premium 3D rendering services.",
    url: "https://mvitabar.com",
    siteName: "M Vitabar - 3D Art Studio",
    images: [
      {
        url: "https://mvitabar.com/Gemini_Generated_Image_swz4wiswz4wiswz4.png",
        width: 1200,
        height: 630,
        alt: "M Vitabar - Professional 3D Artist & CGI Specialist",
        type: "image/png"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "M Vitabar | 3D Artist & CGI Specialist",
    description: "Creating stunning photorealistic 3D visuals and CGI solutions for brands worldwide. Based in Brazil, serving global clients.",
    images: [{
      url: "https://mvitabar.com/Gemini_Generated_Image_swz4wiswz4wiswz4.png",
      width: 1200,
      height: 630,
      alt: "M Vitabar - 3D Artist Portfolio"
    }],
    site: "@mvitabar_3d",
    creator: "@mvitabar_3d"
  },
  metadataBase: new URL("https://mvitabar.com"),
  alternates: {
    canonical: "https://mvitabar.com"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code"
  }
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
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
