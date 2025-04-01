"use client"

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [loginModal, openLoginModal] = useState(false);
  const {data : session} = useSession();
  const pathname = usePathname();
  const email = session?.user?.email;
  const userName = email && email.slice(0,email.indexOf("@"));
  
  // Check if we're on the dashboard route
  const isDashboardRoute = pathname?.startsWith('/counselor/dashboard');

  return (
    <nav className={`fixed top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3`}>
        <div className="flex md:flex-row md:justify-center md:items-center w-full max-w-[90vw] h-fit pr-10 py-3 gap-5 bg-white/90 backdrop-blur-3xl rounded-full shadow-lg border-2 border-[#a8738b]/80 md:relative">
              <>
              <div className="md:grow flex justify-start items-center gap-10 pl-10">
                {isDashboardRoute ? (
                  // Dashboard route links
                  <>
                    <Link href="/counselor/dashboard" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Dashboard </Link>
                  </>
                ) : (
                  // Regular route links
                  <>
                    <Link href="/" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Home </Link>
                    <Link href="/chat" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Chat </Link>
                    <Link href="/about" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> About </Link>
                    <Link href="/#events" scroll className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100">Events</Link>
                  </>
                )}
              </div>

              <div 
              role="button"
              className="transition-all ease-out">
                <Link href="/login" className="rounded-lg px-4 py-2 text-white transition-all duration-100 bg-[#a8738b] hover:opacity-90 shadow-lg hover:shadow-xl"> Login </Link>
              </div>
              </>
        </div>
    </nav>
  )
}
