import { Onest } from "next/font/google";

import "./globals.css";
import Navbar from "../components/Navbar";


const onest = Onest({
  variable : "--font-onest-sans",
  subsets : ["latin"]
})

export const metadata = {
  title: "Uplift",
  description: "Keep your spirits lifted!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${onest.className} antialiased`}>
        <div className="grid-overlay " />
        <Navbar />
        <main className="relative z-10 bg-gradient-to-b from-[#eba1c2] via-[#f8fcff] to-[#b18deb] ">
          {children}
        </main>
      </body>
    </html>
  );
}
