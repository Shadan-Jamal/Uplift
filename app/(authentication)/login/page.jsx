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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#a8738b]">Login</h1>
            
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <input 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        type="email" 
                        placeholder="Email" 
                        className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                            userData.email ? "border-[#9d92f]" : "border-[#a8738b]"
                        }`}
                    />
                </div>

                <div className="space-y-2">
                    <input 
                        value={userData.password}
                        onChange={(e) => setUserData({...userData , password : e.target.value})}
                        type="password" 
                        placeholder="Password" 
                        className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                            userData.password ? "border-[#9d92f]" : "border-[#a8738b]"
                        }`}
                    />
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
            console.error("Login error:", error);
            setError(error.message || "An unexpected error occurred");
        }
        finally {
            setIsLoading(false);
        }
    };
    console.log(error)
    return (
        <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold text-[#a8738b]">Login</h1>
            
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <input 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        type="email" 
                        placeholder="Email" 
                        className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                            userData.email ? "border-[#9d92f]" : "border-[#a8738b]"
                        }`}
                    />
                </div>

                <div className="space-y-2">
                    <input 
                        value={userData.password}
                        onChange={(e) => setUserData({...userData , password : e.target.value})}
                        type="password" 
                        placeholder="Password" 
                        className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                            userData.password ? "border-[#9d92f]" : "border-[#a8738b]"
                        }`}
                    />
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