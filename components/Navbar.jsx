"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ScreeningModal from "./ScreeningModal";
import Notification from './Notification';
import Image from "next/image";

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const { data: session } = useSession();
  const [navbarPosition, setNavbarPosition] = useState(false);
  const pathname = usePathname();

  // Check if we should show the screening modal
  useEffect(() => {
    if (session?.user?.type === "student" && !localStorage.getItem("screeningModalShown")) {
      setShowScreeningModal(true);
    }
  }, [session]);

  // Fetch user data when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          let response, data; 
          if(session?.user?.type === "counselor"){
            response = await fetch(`/api/counselor?email=${session?.user?.email}`);
            data = await response.json();
          }
          else{
            response =  await fetch(`/api/user?email=${session?.user?.email}`);
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
  const isLoginRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  //Set Navbar to static position if under chat directory
  // useEffect(() => {
  //     if(pathname.includes("/chat")){
  //       setNavbarPosition(true);
  //     }
  //     else{
  //       setNavbarPosition(false);
  //     }
  // },[])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const profileVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {isLoginRoute ? null : (
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={`fixed top-0 z-50 w-[100dvw]`}
        >
          <div className="bg-white/90 backdrop-blur-sm shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image 
                      src="/care_logo.png" 
                      alt="CARE Logo" 
                      fill 
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-2xl font-bold text-[#a8738b]">CARE</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                  {session?.user?.type === "counselor" ? (
                    <>
                    <Link 
                      href="/counselor/dashboard" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/counselor/dashboard' ? 'font-bold' : ''
                        }`}
                    >
                      Dashboard
                    </Link>
                      <Link 
                        href="/counselor/dashboard/chat" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/counselor/dashboard/chat' ? 'font-bold' : ''
                        }`}
                      >
                        Chat
                      </Link>
                      <Link 
                        href="/counselor/dashboard/events" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/counselor/dashboard/events' ? 'font-bold' : ''
                        }`}
                      >
                        Events
                      </Link>
                      <Link 
                        href="/counselor/dashboard/affirmations" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/counselor/dashboard/events' ? 'font-bold' : ''
                        }`}
                      >
                        Affirmations
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/' ? 'font-bold' : ''
                        }`}
                      >
                        Home
                      </Link>
                      <Link 
                        href="/chat" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/chat' ? 'font-bold' : ''
                        }`}
                      >
                        Chat
                      </Link>
                      <Link 
                        href="/about" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/about' ? 'font-bold' : ''
                        }`}
                      >
                        About
                      </Link>
                      <Link 
                        href="/events" 
                        className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                          pathname === '/events' ? 'font-bold' : ''
                        }`}
                      >
                        Events
                      </Link>
                      {session?.user?.type === "student" && (
                        <Link 
                          href="/screening" 
                          className={`text-[#a8738b] hover:scale-110 transition-all duration-200 ease-in-out hover:text-[#9d92f] font-medium ${
                            pathname === '/screening' ? 'font-bold' : ''
                          }`}
                        >
                          Screening
                        </Link>
                      )}
                  </>
                )}
              </div>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                  {session && <Notification />}
                  {session ? (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a8738b] hover:bg-[#9d92f] transition-colors"
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
                      </motion.button>

                      <AnimatePresence>
                        {showProfile && (
                          <motion.div
                            variants={profileVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                          >
                            <div className="px-4 py-2 border-b border-gray-100">
                              {userData?.userId && session?.user?.type === "student" && (
                                <>
                                  <p className="text-sm text-gray-500">User ID</p>
                                  <p className="font-medium text-[#a8738b]">{userData.userId}</p>
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
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={handleLogout}
                              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/login" 
                        className="px-4 py-2 bg-[#a8738b] text-white rounded-lg hover:bg-[#9d92f] transition-colors"
                      >
                        Login
                      </Link>
                    </motion.div>
                  )}

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    <svg
                      className="w-6 h-6 text-[#a8738b]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="md:hidden bg-white border-t border-gray-100"
              >
                <div className="container mx-auto px-4 py-4 space-y-4">
                  {session?.user?.type === "counselor" ? (
                    <>
                    <motion.div variants={menuItemVariants}>
                      <Link 
                        href="/counselor/dashboard" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/counselor/dashboard' ? 'font-bold' : ''
                          }`}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/counselor/dashboard/chat" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/counselor/dashboard/chat' ? 'font-bold' : ''
                          }`}
                        >
                          Chat
                        </Link>
                      </motion.div>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/counselor/dashboard/events" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/counselor/dashboard/events' ? 'font-bold' : ''
                          }`}
                        >
                          Events
                        </Link>
                      </motion.div>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/counselor/dashboard/affirmations" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/counselor/dashboard/affirmations' ? 'font-bold' : ''
                          }`}
                        >
                          Affirmations
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/' ? 'font-bold' : ''
                          }`}
                        >
                          Home
                        </Link>
                      </motion.div>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/chat" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/chat' ? 'font-bold' : ''
                          }`}
                        >
                          Chat
                        </Link>
                      </motion.div>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/about" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/about' ? 'font-bold' : ''
                          }`}
                        >
                          About
                        </Link>
                      </motion.div>
                      <motion.div variants={menuItemVariants}>
                        <Link 
                          href="/events" 
                          className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                            pathname === '/events' ? 'font-bold' : ''
                          }`}
                        >
                          Events
                        </Link>
                      </motion.div>
                      {session?.user?.type === "student" && (
                        <motion.div variants={menuItemVariants}>
                          <Link 
                            href="/screening" 
                            className={`block text-[#a8738b] hover:text-[#9d92f] font-medium py-2 ${
                              pathname === '/screening' ? 'font-bold' : ''
                            }`}
                          >
                            Screening
                          </Link>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
      <ScreeningModal 
        isOpen={showScreeningModal} 
        onClose={() => setShowScreeningModal(false)} 
      />
    </>
  );
}

// "use client"

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { signOut } from "next-auth/react";
// import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";

// export default function Navbar() {
//   const [showProfile, setShowProfile] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   console.log(session)
//   // Fetch user data when session is available
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (session) {
//         try {
//           let response, data; 
//           if(session?.user?.type === "counselor"){
//             response = await fetch(`/api/counselor?email=${session?.user?.email}`);
//             data = await response.json();
//           }

//           else{
//             response =  await fetch(`/api/user?email=${session?.user?.email}`);
//             data = await response.json();
//           }
          
          
//           if (response.ok) {
//             setUserData(data);
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     };
    
//     fetchUserData();
//   }, [session]);

  
//   // Check if we're on the dashboard route
//   const isDashboardRoute = pathname?.startsWith('/counselor/dashboard');
//   const isLoginRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

//   const handleLogout = async () => {
//     await signOut({ callbackUrl: '/' });
//   };
//   console.log(userData)
//   return (isLoginRoute ? null :
//     <nav className={`fixed top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3`}>
//       <div className="flex md:flex-row md:justify-center md:items-center w-full max-w-[90vw] h-fit pr-10 py-1 gap-5 bg-white/90 backdrop-blur-3xl rounded-full shadow-lg border-2 border-[#a8738b]/80 md:relative">
//         <>
//           <div className="md:grow flex justify-start items-center gap-10 pl-10">
//             {isDashboardRoute ? (
//               // Dashboard route links
//               <>
//                 <Link href="/counselor/dashboard" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Dashboard </Link>
//               </>
//             ) : (
//               // Regular route links
//               <>
//                 <Link href="/" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Home </Link>
//                 <Link href="/chat" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Chat </Link>
//                 <Link href="/about" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> About </Link>
//                 <Link href="/#events" scroll className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100">Events</Link>
//               </>
//             )}
//           </div>

//           {session ? (
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfile(!showProfile)}
//                 className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a8738b] hover:bg-[#9d92f] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:ring-offset-2"
//                 aria-label="User profile"
//               >
//                 <svg
//                   className="w-6 h-6 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//               </button>

//               {showProfile && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
//                   <div className="px-4 py-2 border-b border-gray-100">
//                     {userData?.userId && session?.user?.type === "student" && (
//                       <>
//                         <p className="text-sm text-gray-500">User ID</p>
//                         <p className="font-medium text-[#a8738b]">{userData.userId}</p>
//                       </>
//                     )}
//                     {userData?.name && (
//                       <>
//                         <p className="text-sm text-gray-500 mt-2">Name</p>
//                         <p className="font-medium text-[#a8738b]">{userData.name}</p>
//                       </>
//                     )}
//                     {userData?.email && userData?.userType === "counselor" && (
//                       <>
//                         <p className="text-sm text-gray-500 mt-2">Email</p>
//                         <p className="font-medium text-[#a8738b]">{userData.email}</p>
//                       </>
//                     )}
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                       />
//                     </svg>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div
//               role="button"
//               className={`transition-all ease-out ${!session?.user && 'my-2'}`}
//             >
//               <Link href="/login" className={`rounded-lg px-4 py-2 text-white transition-all duration-100 bg-[#a8738b] hover:opacity-90 shadow-lg hover:shadow-xl`}> Login </Link>
//             </div>
//           )}
//         </>
//       </div>
//     </nav>
//   )
// }
