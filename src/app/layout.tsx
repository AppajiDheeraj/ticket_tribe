import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketTribe — Predict Stocks with Your Tribe",
  description:
    "A web app where friend groups compete by predicting daily stock movements. Make predictions, lock them at 7 PM IST, auto-scoring at 2:30 AM IST, and climb the leaderboard.",
  keywords: [
    "TickerTribe",
    "stock prediction game",
    "leaderboard",
    "daily stock predictions",
    "AAPL",
    "TSLA",
    "GOOGL",
    "NVDA",
    "AMZN",
    "tribe stock competition"
  ],
  openGraph: {
    title: "TicketTribe — Predict Stocks with Friends",
    description:
      "Compete with friends in private tribes by predicting daily tech stock movements. Scores update automatically after US market close.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
  <Toaster richColors />

  {/* 🔥 ADD THIS */}
  <div id="top-layer-portal"></div>

  {children}
</body>

    </html>
  );
}
