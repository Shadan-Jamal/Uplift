import { Onest } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "./Providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next"

const onest = Onest({
  variable : "--font-onest-sans",
  subsets : ["latin"]
})

export const metadata = {
  title: "CARE",
  description: "Keep your spirits lifted!",
  icons: {
    icon: '/care_logo.png',
    apple: '/care_logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${onest.className} antialiased`}>
        <AuthProvider>
          <div className="grid-overlay " />
          <Navbar />
          <main className="relative z-10 bg-gradient-to-b from-[#eba1c2] via-[#f8fcff] to-[#b18deb] ">
            {children}
          </main>
        </AuthProvider>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-9NGW777J0V" />
    </html>
  );
}
