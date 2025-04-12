"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [loginModal, openLoginModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Fetch user data when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          // First try to fetch from user API
          let response = await fetch(`/api/user?id=${session?.user?.id}`);
          let data = await response.json();
          
          // If user not found, try counselor API
          if (response.status === 404) {
            response = await fetch(`/api/counselor?email=${session?.user?.email}`);
            data = await response.json();
          }
          
          if (response.ok) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  // Check if we're on the dashboard route
  const isDashboardRoute = pathname?.startsWith('/counselor/dashboard');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className={`fixed top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3`}>
      <div className="flex md:flex-row md:justify-center md:items-center w-full max-w-[90vw] h-fit pr-10 py-1 gap-5 bg-white/90 backdrop-blur-3xl rounded-full shadow-lg border-2 border-[#a8738b]/80 md:relative">
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

          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a8738b] hover:bg-[#9d92f] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:ring-offset-2"
                aria-label="User profile"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    {userData?.id && (
                      <>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium text-[#a8738b]">{userData?.id}</p>
                      </>
                    )}
                    {userData?.name && (
                      <>
                        <p className="text-sm text-gray-500 mt-2">Name</p>
                        <p className="font-medium text-[#a8738b]">{userData.name}</p>
                      </>
                    )}
                    {userData?.email && userData?.userType === "counselor" && (
                      <>
                        <p className="text-sm text-gray-500 mt-2">Email</p>
                        <p className="font-medium text-[#a8738b]">{userData.email}</p>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              role="button"
              className={`transition-all ease-out ${!session?.user && 'my-2'}`}
            >
              <Link href="/login" className={`rounded-lg px-4 py-2 text-white transition-all duration-100 bg-[#a8738b] hover:opacity-90 shadow-lg hover:shadow-xl`}> Login </Link>
            </div>
          )}
        </>
      </div>
    </nav>
  )
}
