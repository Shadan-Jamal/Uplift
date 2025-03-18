import { Lexend } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const lexend = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Uplift",
  description: "Keep your spirits lifted!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexend.className} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
