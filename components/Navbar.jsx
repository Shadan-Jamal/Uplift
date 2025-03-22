import Link from "next/link";

export default function Navbar() {

  return (
    <nav className={`fixed top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3 overflow-hidden`}>
        <div className="flex flex-row justify-center items-center w-full max-w-[90vw] h-fit pr-10 py-3 gap-5 bg-white/90 backdrop-blur-3xl rounded-full shadow-lg border-2 border-[#a8738b]/80">
            <div className="grow flex justify-center items-center gap-10">
              <Link href="/" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Home </Link>
              <Link href="/chat" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> Chat </Link>
              <Link href="/about" className="text-[#a8738b] hover:text-[#9d92f] font-bold hover:scale-105 transition-all duration-100"> About </Link>
            </div>
            <div 
            role="button"
            className="transition-all ease-out hover:scale-110">
              <Link href="/login" className="rounded-lg px-4 py-2 text-white transition-all duration-100 bg-[#a8738b] hover:opacity-90 shadow-lg hover:shadow-xl"> Login </Link>
            </div>
        </div>
    </nav>
  )
}
