import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import RoleProtection from "@/components/custom/RoleProtection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ganimi - Connect with Expert Service Providers",
  description: "Find the perfect service provider for your needs. Connect with expert tutors, developers, designers, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: '"Wix Madefor Display", system-ui, sans-serif' }}
      >
        <AuthProvider>
          <RoleProtection>
            {children}
          </RoleProtection>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
