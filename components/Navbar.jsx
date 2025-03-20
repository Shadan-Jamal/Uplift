import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="absolute top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3 overflow-hidden">
        <div className="flex flex-row justify-center items-center w-full max-w-[90vw] h-fit py-3 gap-5 text-black">
            <Link href="/" className="hover:text-indigo-600 hover:scale-105 transition-all duration-100"> Home </Link>
            <Link href="/login" className="hover:text-indigo-600 hover:scale-105 transition-all duration-100"> Login </Link>
            <Link href="/chat" className="hover:text-indigo-600 hover:scale-105 transition-all duration-100"> Chat </Link>
            <Link href="/about" className="hover:text-indigo-600 hover:scale-105 transition-all duration-100"> About </Link>
        </div>
    </nav>
  )
}
