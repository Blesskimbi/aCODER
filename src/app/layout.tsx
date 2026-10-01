import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://a-coder.dev"),
  title: {
    default: "A-Coder IDE — Your True Open Source AI IDE",
    template: "%s · A-Coder IDE",
  },
  description:
    "An open-source, AI-native code editor built on VS Code. Chat, Plan, Agent and Learn modes, direct-to-provider model access, and first-class local models. Apache-2.0.",
  applicationName: "A-Coder IDE",
  openGraph: {
    type: "website",
    siteName: "A-Coder IDE",
    locale: "en_AU",
    url: "https://a-coder.dev",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas antialiased">{children}</body>
    </html>
  );
}
