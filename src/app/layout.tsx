import type { Metadata, Viewport } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { OrganizationStructuredData } from "@/components/structured-data";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const montserrat = Montserrat({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#018856",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://failms.org'),
  title: {
    default: "FAILMS - CONFIAL | Federazione Autonoma Italiana Lavoratori Metalmeccanici e Siderurgici",
    template: "%s | FAILMS CONFIAL",
  },
  description: "Il sindacato dell'industria che difende i diritti, governa le transizioni e costruisce futuro nei luoghi di lavoro. FAILMS aderisce a CONFIAL - Confederazione Italiana Autonoma Lavoratori.",
  keywords: "FAILMS, CONFIAL, sindacato, metalmeccanici, siderurgici, industria, lavoratori, contrattazione, diritti",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FAILMS",
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    title: "FAILMS - CONFIAL | Sindacato Industria",
    description: "Il sindacato dell'industria che difende i diritti, governa le transizioni e costruisce futuro nei luoghi di lavoro.",
    type: "website",
    locale: "it_IT",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${lato.variable} ${montserrat.variable}`}>
      <head>
        <OrganizationStructuredData />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
