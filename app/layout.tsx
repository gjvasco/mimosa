import type { Metadata, Viewport } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Mimosa Alelí",
    template: "%s | Mimosa Alelí",
  },
  description: "Accesorios, velas aromáticas y aceites esenciales",
  manifest: "/manifest.json",
  applicationName: "Mimosa Alelí",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mimosa Admin",
  },
  icons: {
    apple: "/mimosa-aleli-logo.png",
    icon: "/mimosa-aleli-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6f4656",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}