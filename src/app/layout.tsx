import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ErrorBoundary from "@/components/public/ErrorBoundary";
import { AuthProvider, CartProvider } from "@/composables";

export const metadata: Metadata = {
  title: "CS4B | Consulting Strategic for Digital Business",
  description: "Consultoría en transformación digital. Licencias Microsoft, antivirus, hardware, desarrollo de software, consultoría IT y capacitación.",
  icons: {
    icon: "/logo_cs4b.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <AuthProvider>
            <Suspense fallback={<div className="min-h-screen" />}>
              <CartProvider>
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </Suspense>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
