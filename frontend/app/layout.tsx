import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/src/contexts/WalletContext";
import { Navigation } from "@/src/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forensic Evidence System",
  description: "Blockchain-based chain of custody tracking for forensic evidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <WalletProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-gray-300 py-6 mt-8 border-t">
            <div className="max-w-7xl mx-auto px-6 text-center text-sm">
              <p>© 2024 Forensic Evidence System. Blockchain-based chain of custody tracking.</p>
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
