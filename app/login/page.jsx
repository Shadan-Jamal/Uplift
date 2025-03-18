"use client"
import { motion } from "motion/react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const page = () => {
    const [loginChoice,setLoginChoice] = useState("");

    return (
        <section className="flex flex-row justify-between items-center h-[100dvh] w-[100dvw]">
            <section className="w-1/2 h-full relative flex items-center justify-center overflow-hidden">
                <Image 
                    src="/login-pics/login-bg.jpg" 
                    alt="login-bg" 
                    fill
                    className="object-cover"
                    priority
                />
            </section>

            <section className="w-1/2 h-full flex items-center justify-center">
                <div className="w-full max-w-md bg-slate-200 rounded-xl shadow-2xl overflow-hidden">
                    <div className="w-full flex border-b-2 border-black">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setLoginChoice("student")}
                            className={`flex-1 py-4 text-lg font-medium transition-colors duration-200 ${
                                loginChoice === "student" 
                                    ? "bg-black text-white" 
                                    : "text-black hover:bg-black/5"
                            }`}
                        >
                            Student
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setLoginChoice("")}
                            className={`flex-1 py-4 text-lg font-medium transition-colors duration-200 ${
                                loginChoice === "" 
                                    ? "bg-black text-white" 
                                    : "text-black hover:bg-black/5"
                            }`}
                        >
                            Council
                        </motion.button>
                    </div>
                    
                    <div className="p-8">
                        {loginChoice === "student" ? <StudentLogin /> : <CouncilLogin />}
                    </div>
                </div>
            </section>
        </section>
    );
}

const StudentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold text-black">Login</h1>
            
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        placeholder="Email" 
                        className={`w-full p-3 bg-transparent border-b-2 text-black placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${
                            email ? "border-green-500" : "border-black"
                        }`}
                    />
                </div>

                <div className="space-y-2">
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        placeholder="Password" 
                        className={`w-full p-3 bg-transparent border-b-2 text-black placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${
                            password ? "border-green-500" : "border-black"
                        }`}
                    />
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors duration-200"
                >
                    Login
                </motion.button>
            </div>

            <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}

const CouncilLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold text-black">Login</h1>
            
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        placeholder="Email" 
                        className={`w-full p-3 bg-transparent border-b-2 text-black placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${
                            email ? "border-green-500" : "border-black"
                        }`}
                    />
                </div>

                <div className="space-y-2">
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        placeholder="Password" 
                        className={`w-full p-3 bg-transparent border-b-2 text-black placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${
                            password ? "border-green-500" : "border-black"
                        }`}
                    />
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors duration-200"
                >
                    Login
                </motion.button>
            </div>

            <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default page;