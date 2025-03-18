"use client";

import { useState,useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPW, setPW] = useState({
        showPassword: false, 
        showConfirmPassword: false});
    const error = useRef();
    const [errorState, setErrorState] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try{
            if(email === "" || password === "" || confirmPassword === ""){
                error.current = true;
                setErrorState("Please fill all the fields");
                return;
            }

            if(password !== confirmPassword){
                error.current = true;
                setErrorState("Passwords do not match");
                return;
            }

            if(!email.includes("claretcollege.edu.in")){
                error.current = true;
                setErrorState("Please use your college email");
                return;
            }

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            if(response.status === 400){
                setErrorState("User already exists");
                return;
            }

            if(!response.ok){
                setErrorState("User registration failed");
                return;
            }
            error.current = false;
            const data = await response.json();
            console.log(data.message);
            setErrorState(data.message);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
        catch(error){
            error.current = true;
            setErrorState("User registration failed");
            console.log(error);
        }
    }

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
                    <div className="p-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <h1 className="text-3xl font-bold text-black">Register</h1>
                            
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

                                <div className={`space-y-2 flex justify-center items-center border-b-2 ${password ? "border-green-500" : "border-black"} pr-3`}>
                                    <input 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={`${showPW.showPassword ? "text" : "password"}`} 
                                        placeholder="Password" 
                                        className={`w-full p-3 bg-transparent text-black placeholder:text-gray-500 focus:outline-none transition-all duration-300`}
                                    />

                                    <button 
                                    className="hover:cursor-pointer"
                                    onClick={() => setPW({...showPW, showPassword: !showPW.showPassword})}>
                                        {showPW.showPassword ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                        : 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        }
                                    </button>
                                </div>

                                <div className={`space-y-2 flex justify-center items-center border-b-2 
                                ${confirmPassword === "" && "border-b-black"}
                                ${confirmPassword === password ? "border-green-500" : "border-red-500"} pr-3`}>
                                    <input 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type={`${showPW.showConfirmPassword ? "text" : "password"}`}
                                        placeholder="Confirm Password" 
                                        className={`w-full p-3 bg-transparent text-black placeholder:text-gray-500 focus:outline-none transition-all duration-300`}
                                    />
                                    <button 
                                    className="hover:cursor-pointer"
                                    onClick={() => setPW({...showPW, showConfirmPassword: !showPW.showConfirmPassword})}>
                                        {showPW.showConfirmPassword ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                        : 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        }
                                    </button>
                                </div>

                                {errorState === "User registered successfully" ? <p className="text-green-500">{errorState}</p> : <p className="text-red-500">{errorState}</p>}
                                
                                <motion.button
                                    onClick={handleRegister}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors duration-200"
                                >
                                    Register
                                </motion.button>
                            </div>

                            <p className="text-sm text-gray-600">
                                Already registered?{" "}
                                <Link href="/login" className="text-blue-600 hover:underline">
                                    Login
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </section>
    );
}
