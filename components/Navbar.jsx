"use client"

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [loginModal, openLoginModal] = useState(false);
  return (
    <nav className={`fixed top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3`}>
        <div className="flex flex-row justify-center items-center w-full max-w-[90vw] h-fit pr-10 py-3 gap-5 bg-white/90 backdrop-blur-3xl rounded-full shadow-lg border-2 border-[#a8738b]/80 relative">
            <div className="grow flex justify-center items-center gap-10">
              <Link href="/" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Home </Link>
              <Link href="/chat" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Chat </Link>

              <Link href="/about" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> About </Link>

              <Link href="/#events" scroll className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100">Events</Link>
            </div>
            <div 
            role="button"
            className="transition-all ease-out hover:scale-105">

              {/* <Link href="/login" className="rounded-lg px-4 py-2 text-white transition-all duration-100 bg-[#a8738b] hover:opacity-90 shadow-lg hover:shadow-xl"> Login </Link> */}
              
              <div 
              role="button"
              onClick={() => openLoginModal(!loginModal)}
              className="rounded-full bg-red-400/50 p-1 hover:bg-rose-400 hover:cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#a8738b"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="hover:stroke-[#9d92f] transition-colors duration-200"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {loginModal && <div className="absolute z-[99999] right-0 -bottom-28 min-w-[13em] max-h-[20em] bg-white">
                <div className="w-full h-[80%] p-5">
                  <p className="text-black text-lg">Name : 22D3074</p>
                  <button className="text-white bg-red-500 px-3 py-2 text-center w-full">Log Out</button>
                </div>
              </div>}
            </div>
        </div>
    </nav>
  )
}
