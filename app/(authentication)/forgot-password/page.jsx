"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPW, setPW] = useState({
        showPassword: false, 
        showConfirmPassword: false
    });
    const [step, setStep] = useState(1); // 1: email verification, 2: password reset
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const error = useRef();
    const [errorState, setErrorState] = useState("");
    const btnRef = useRef(null);
    const router = useRouter();

    const handleEmailVerification = async () => {
        console.log("RESETTING")
        try {
            // if (email === "") {
            //     error.current = true;
            //     setErrorState("Please enter your email");
            //     return;
            // }

            // if (!email.includes('@')) {
            //     error.current = true;
            //     setErrorState("Invalid Email Format");
            //     return;
            // }

            // if (!email.includes("claretcollege.edu.in")) {
            //     error.current = true;
            //     setErrorState("Please use your college email");
            //     return;
            // }

            setIsLoading(true);
            
            // Call the API to request a verification code
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    action: "request" 
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                setErrorState(data.message || "Failed to send verification code");
                setIsLoading(false);
                return;
            }

            setErrorState("");
            setStep(2);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setErrorState("Email verification failed. Please try again.");
        }
    };

    const handlePasswordReset = async () => {
        try {
            if (password === "" || confirmPassword === "") {
                error.current = true;
                setErrorState("Please fill all the fields");
                return;
            }

            if (password !== confirmPassword) {
                error.current = true;
                setErrorState("Passwords do not match");
                return;
            }

            if (password.length < 8) {
                error.current = true;
                setErrorState("Password must be at least 8 characters long");
                return;
            }

            if (verificationCode === "") {
                error.current = true;
                setErrorState("Please enter the verification code");
                return;
            }

            setIsLoading(true);
            
            // First verify the code
            const verifyResponse = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    action: "verify",
                    verificationCode 
                }),
            });

            const verifyData = await verifyResponse.json();
            
            if (!verifyResponse.ok) {
                setErrorState(verifyData.message || "Invalid verification code");
                setIsLoading(false);
                return;
            }
            
            // Then reset the password
            const resetResponse = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    action: "reset",
                    newPassword: password
                }),
            });

            const resetData = await resetResponse.json();
            
            if (!resetResponse.ok) {
                setErrorState(resetData.message || "Failed to reset password");
                setIsLoading(false);
                return;
            }

            setErrorState("Password reset successful");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setVerificationCode("");
            setIsLoading(false);
            
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setIsLoading(false);
            setErrorState("Password reset failed. Please try again.");
        }
    };

    return (
        <section className="md:flex md:flex-row md:justify-between md:items-center h-[100dvh] w-[100dvw] bg-gradient-to-bl lg:bg-gradient-to-br from-[#eba1c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl">
            <section className="w-full md:w-1/2 h-full absolute md:relative">
                <div className="flex items-center justify-center overflow-hidden">
                    <Image 
                        src="/login-pics/login.jpeg" 
                        alt="login-bg" 
                        fill
                        className="object-cover blur-sm md:object-cover opacity-80"
                        priority
                    />
                </div>
            </section>

            <section className="w-[80dvw] md:w-1/2 h-full flex items-center justify-center container mx-auto">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border-2 border-[#a8738b]">
                    <div className="px-7 py-6 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <h1 className="text-2xl lg:text-3xl font-bold text-[#a8738b]">
                                {step === 1 ? "Forgot Password" : "Reset Password"}
                            </h1>
                            
                            <div className="w-full space-y-6">
                                {step === 1 ? (
                                    <>
                                        <div className="space-y-2">
                                            <input 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email" 
                                                placeholder="College Email" 
                                                className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                                                    email ? "border-green-500" : "border-[#a8738b]"
                                                }`}
                                            />
                                        </div>

                                        {errorState && <p className="text-red-500">{errorState}</p>}
                                        
                                        <motion.button
                                            ref={btnRef}
                                            onClick={handleEmailVerification}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-3 bg-[#a8738b] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl 
                                            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            {isLoading ? "Sending..." : "Send Verification Code"}
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <input 
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                type="text" 
                                                placeholder="Verification Code" 
                                                className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                                                    verificationCode ? "border-green-500" : "border-[#a8738b]"
                                                }`}
                                            />
                                        </div>

                                        <div className={`space-y-2 flex justify-center items-center border-b-2 ${password ? "border-green-500" : "border-[#a8738b]"} pr-3`}>
                                            <input 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                type={`${showPW.showPassword ? "text" : "password"}`} 
                                                placeholder="New Password" 
                                                className={`w-full p-3 bg-transparent text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300`}
                                            />

                                            <button 
                                                className="hover:cursor-pointer"
                                                onClick={() => setPW({...showPW, showPassword: !showPW.showPassword})}>
                                                {showPW.showPassword ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                                : 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                                }
                                            </button>
                                        </div>
                                
                                        <div className={`space-y-2 flex justify-center items-center border-b-2
                                        ${confirmPassword === "" && "border-b-[#a8738b]"}
                                        ${confirmPassword === password ? "border-green-500" : "border-red-500"} pr-3`}>
                                            <input 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                type={`${showPW.showConfirmPassword ? "text" : "password"}`}
                                                placeholder="Confirm New Password" 
                                                className={`w-full p-3 bg-transparent text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300`}
                                            />
                                            <button 
                                                className="hover:cursor-pointer"
                                                onClick={() => setPW({...showPW, showConfirmPassword: !showPW.showConfirmPassword})}>
                                                {showPW.showConfirmPassword ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                                : 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a8738b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                                }
                                            </button>
                                        </div>

                                        {errorState && <p className={`${errorState === "Password reset successful" ? "text-green-500" : "text-red-500"}`}>{errorState}</p>}
                                        
                                        <motion.button
                                            ref={btnRef}
                                            onClick={handlePasswordReset}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-3 bg-[#a8738b] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {isLoading ? "Resetting..." : "Reset Password"}
                                        </motion.button>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-[#a8738b]">
                                Remember your password?{" "}
                                <Link href="/login" className="text-[#9d92f] hover:text-[#86a4c2] transition-colors duration-200">
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