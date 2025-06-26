

import ProtectedLayout from "@/components/ProtectedLayout";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata, Viewport } from "next";

const APP_NAME = "scene";
const APP_DEFAULT_TITLE = "scene kya hain?";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "hola amigos!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Gothic+A1:wght@300;400;500;600&family=Parisienne&display=swap" rel="stylesheet" />
      <link href="https://fonts.cdnfonts.com/css/graphik-trial" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <meta name="theme-color" content="#ffffff" />
      {/* <ServiceWorkerRegister /> */}
        <ProtectedLayout>
          {children}
          <Toaster />
        </ProtectedLayout>
      </body>
    </html>
  );
}