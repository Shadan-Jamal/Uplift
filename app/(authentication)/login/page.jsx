"use client"
import { motion } from "motion/react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const page = () => {
    const [loginChoice, setLoginChoice] = useState("student")

    return (
        <section className="md:flex md:flex-row md:justify-between md:items-center h-[100dvh] w-[100dvw] bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl">

            <section className="w-full md:w-1/2 h-full absolute md:relative">
                <div className="flex items-center justify-center overflow-hidden">
                    <Image 
                        src="/login-pics/login.jpeg" 
                        alt="login-bg" 
                        fill
                        className="object-cover blur-sm md:object-contain opacity-80"
                        priority
                    />
                </div>
            </section>

            <section className="w-[80dvw] md:w-1/2 h-full flex items-center justify-center container mx-auto">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border-2 border-[#a8738b]">
                    <div className="w-full flex border-b-2 border-[#a8738b]">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setLoginChoice("student")}
                            className={`flex-1 py-2 md:py-4 text-base md:text-base lg:text-lg font-medium transition-colors duration-200 ${
                                loginChoice === "student"
                                    ? "bg-[#a8738b] text-white"
                                    : "text-[#a8738b] hover:bg-[#a8738b]/5"
                            }`}
                        >
                            Student
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setLoginChoice("counselor")}
                            className={`flex-1 py-2 md:py-4 text-base md:text-base lg:text-lg font-medium transition-colors duration-200 ${
                                loginChoice === "counselor" 
                                    ? "bg-[#a8738b] text-white"
                                    : "text-[#a8738b] hover:bg-[#a8738b]/5"
                            }`}
                        >
                            Faculty
                        </motion.button>
                    </div>

                    <div className="p-8">
                        {loginChoice === "student" ? <StudentLogin /> : <CouncilLogin />}
                    </div>
                </div>
            </section>
        </section>
    )
}

const StudentLogin = () => {
    const [userData, setUserData] = useState({email : "", password : ""})
    const [error, setError] = useState(null)
    const router  = useRouter()
    const [isLoading, setIsLoading] = useState(false)  
    const [showPW, setPW] = useState(false)
    const handleLogin = async () => {
        setError(null)
        if(!userData.email || !userData.password){
            setError("Please fill in all fields")
            return
        }
        if(userData.password.length < 8){
            setError("Password must be at least 6 characters long")
            return
        }
        if(!userData.email.includes("@") || !userData.email.includes(".") || !userData.email.includes("claretcollege.edu.in")){
            setError("Please enter a valid email")
            return
        }
        if(userData.password.includes(" ")){
            setError("Password must not contain spaces")
            return
        }
        if(userData.email.includes(" ")){
            setError("Email must not contain spaces")
            return
        }
        
        try{
            setIsLoading(true)
            const res = await signIn("credentials",{ 
                email : userData.email,
                password : userData.password,
                userType: "student",
                redirect : false,
            })
                        
            if(res.error){
                setError("Invalid email or password")
                return
            }
            setError("Logged in successfully.")
            router.replace("/")
        }
        catch(error){
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 mb-2">
                <Image 
                    src="/care_logo.png" 
                    alt="CARE Logo" 
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#a8738b]">Login</h1>
            
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <input 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        type="email" 
                        placeholder="College Email" 
                        className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                            userData.email ? "border-[#9d92f]" : "border-[#a8738b]"
                        }`}
                    />
                </div>

                <div className={`space-y-2 flex items-center gap-2 w-full border-b-2 text-[#a8738b] 
                ${ userData.password ? "border-[#9d92f]" : "border-[#a8738b]"}`}>
                    <input 
                        value={userData.password}
                        onChange={(e) => setUserData({...userData , password : e.target.value})}
                        type={showPW ? "text" : "password"}
                        placeholder="Password" 
                        className={`w-full p-3 bg-transparent  placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 
                        }`}
                    />
                    <button 
                        className="hover:cursor-pointer"
                        onClick={() => setPW(!showPW)}>
                        {showPW ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                        : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                    </button>
                </div>

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-[#a8738b] hover:text-[#86a4c2] transition-colors duration-200">
                        Forgot Password?
                    </Link>
                </div>

                {error!= null && <div
                className="w-full h-fit"
                >   
                    {error && <p className={`w-fit text-md text-white ${error.includes("Logged") ? "bg-green-400" : "bg-red-500"} py-2 px-3 rounded-lg`}>{error}</p>}
                </div>
                }
                
                <motion.button
                    disabled={isLoading}
                    onClick={handleLogin} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 bg-[#a8738b] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </motion.button>
            </div>

            <p className="text-sm text-[#a8738b]">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#a8738b] hover:text-[#86a4c2] transition-colors duration-200">
                    Register
                </Link>
            </p>
        </div>
    );
}

const CouncilLogin = () => {
    const [userData,setUserData] = useState({email : "", password : ""})
    const [error, setError] = useState(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPW, setPW] = useState(false)
    const handleLogin = async () => {
        setError(null)
        if(!userData.email || !userData.password){
            setError("Please fill in all fields")
            return
        }
        if(userData.password.length < 8){
            setError("Password must be at least 6 characters long")
            return
        }
        if(!userData.email.includes("@") || !userData.email.includes(".") || !userData.email.includes("claretcollege.edu.in")){
            setError("Please enter a valid email")
            return
        }
        if(userData.password.includes(" ")){
            setError("Password must not contain spaces")
            return
        }
        if(userData.email.includes(" ")){
            setError("Email must not contain spaces")
            return
        }

        try {
            setIsLoading(true);
            const res = await signIn("credentials", {
                email: userData.email,
                password: userData.password,
                userType: "counselor",
                redirect: false,
            });

            if(res.error){
                setError("Invalid email or password")
                return
            }
            setError("Logged in successfully.");
            router.replace("/counselor/dashboard");
        } catch (error) {
            setError(error.message || "An unexpected error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };
    console.log(error)
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24">
                <Image 
                    src="/care_logo.png" 
                    alt="CARE Logo" 
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#a8738b]">Login</h1>
            
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <input 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        type="email" 
                        placeholder="College Email" 
                        className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                            userData.email ? "border-[#9d92f]" : "border-[#a8738b]"
                        }`}
                    />
                </div>

                <div className={`space-y-2 flex items-center gap-2 w-full border-b-2 text-[#a8738b] 
                ${ userData.password ? "border-[#9d92f]" : "border-[#a8738b]"}`}>
                    <input 
                        value={userData.password}
                        onChange={(e) => setUserData({...userData , password : e.target.value})}
                        type={showPW ? "text" : "password"}
                        placeholder="Password" 
                        className={`w-full p-3 bg-transparent  placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 
                        }`}
                    />
                    <button 
                        className="hover:cursor-pointer"
                        onClick={() => setPW(!showPW)}>
                        {showPW ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                        : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                    </button>
                </div>

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-[#a8738b] hover:text-[#86a4c2] transition-colors duration-200">
                        Forgot Password?
                    </Link>
                </div>

                {error!= null && <div
                className="w-full h-fit"
                >   
                    {error && <p className={`w-fit text-md text-white ${error.includes("Logged") ? "bg-green-400" : "bg-red-500"} py-2 px-3 rounded-lg`}>{error}</p>}
                </div>
                }
                
                <motion.button
                    disabled={isLoading}
                    onClick={handleLogin} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 bg-[#a8738b] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </motion.button>
            </div>

            <p className="text-sm text-[#a8738b]">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#a8738b] hover:text-[#86a4c2] transition-colors duration-200">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default page;