
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; // Changed to Inter and Roboto_Mono
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
// import { Footer } from "@/components/layout/footer"; // To be dynamically imported
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer), {
  // ssr: false, // Removed: Footer is server-compatible and ssr:false is not allowed in Server Components for dynamic imports
});


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Updated variable name
  display: 'swap',
});

const roboto_mono = Roboto_Mono({ // Changed to Roboto_Mono
  subsets: ["latin"],
  variable: "--font-roboto-mono", // Updated variable name
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Design Alchemist - AI-Powered Design Feedback",
  description: "Upload your designs and get AI-driven insights and improvements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto_mono.variable} antialiased flex flex-col min-h-screen bg-background`} // Updated to use new font variables
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
