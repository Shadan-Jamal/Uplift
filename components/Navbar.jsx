import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="absolute top-0 z-50 flex flex-row justify-center items-center w-full h-fit py-3 overflow-hidden">
        <div className="flex flex-row justify-center items-center w-full max-w-[90vw] h-fit py-3 gap-5">
            <Link href="/"> Home </Link>
            <Link href="/login"> Login </Link>
            <Link href="/chat"> Chat </Link>
            <Link href="/about"> About </Link>
        </div>
    </nav>
  )
}
