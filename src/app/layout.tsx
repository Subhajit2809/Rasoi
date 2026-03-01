import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";
import "@/lib/env"; // Fail fast on missing env vars

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Rasoi — Smart Kitchen Assistant",
    template: "%s | Rasoi",
  },
  description:
    "Manage your fridge, get Indian meal suggestions, and sync your grocery list in real-time with your partner.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rasoi",
    startupImage: "/icons/icon.svg",
  },
  icons: {
    apple: "/icons/icon.svg",
    icon: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Rasoi",
    title: "Rasoi — Smart Kitchen Assistant for Indian Households",
    description:
      "Track your fridge, get meal ideas, and share grocery lists with your household — all in one app.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rasoi — Smart Kitchen Assistant for Indian Households",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasoi — Smart Kitchen Assistant",
    description:
      "Track your fridge, get meal ideas, and share grocery lists with your household.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#D2691E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Lets content extend under the iPhone notch/home indicator
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFF8F0] text-gray-900 antialiased">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
