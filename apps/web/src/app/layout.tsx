/**
 * ============================================================================
 * LAYOUT UTAMA
 * ============================================================================
 * komponen layout root yang ngebungkus semua halaman nih.
 * ada ThemeProvider buat dark/light mode.
 * ============================================================================
 */

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

// font Inter - font UI modern yang enak dibaca
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// JetBrains Mono - buat kode atau yang butuh monospace kece
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tumbas - AI Customer Support Platform",
  description: "Intelligent customer support platform with AI-powered classification, sentiment analysis, and response suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
