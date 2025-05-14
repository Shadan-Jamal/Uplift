"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPW, setPW] = useState({
        showPassword: false, 
        showConfirmPassword: false
    });
    const [step, setStep] = useState(1); // 1: email/password, 2: OTP verification
    const [timer, setTimer] = useState(120);
    const [isResending, setIsResending] = useState(false);
    const error = useRef();
    const [errorState, setErrorState] = useState("");
    const btnRef = useRef(null);
    const router = useRouter();

    // Timer effect for OTP expiration
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setErrorState("OTP expired. Please request a new one.");
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleRequestOTP = async () => {
        try {
            if (email === "" || password === "" || confirmPassword === "") {
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

            if (!email.includes('@')) {
                error.current = true;
                setErrorState("Invalid Email Format");
                return;
            }

            if (!email.includes("claretcollege.edu.in")) {
                error.current = true;
                setErrorState("Please use your college email");
                return;
            }

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    action: "request-otp" 
                }),
            });

            if (response.status === 400) {
                const data = await response.json();
                setErrorState(data.message || "Failed to send OTP");
                return;
            }

            if (!response.ok) {
                setErrorState("Failed to send verification code");
                return;
            }

            const data = await response.json();
            setErrorState(data.message);
            setStep(2);
            setTimer(120);
            toast.success("Verification code sent to your email");
        } catch (error) {
            error.current = true;
            setErrorState("Failed to send verification code");
            console.log(error);
        }
    };

    const handleResendOTP = async () => {
        if (isResending) return;
        
        setIsResending(true);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    action: "request-otp" 
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorState(data.message || "Failed to resend OTP");
                return;
            }

            setTimer(120);
            setErrorState("");
            toast.success("New verification code sent");
        } catch (error) {
            setErrorState("Failed to resend verification code");
        } finally {
            setIsResending(false);
        }
    };

    const handleRegister = async () => {
        try {
            if (otp === "") {
                error.current = true;
                setErrorState("Please enter the verification code");
                return;
            }

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    otp,
                    action: "verify-otp" 
                }),
            });

            if (response.status === 400) {
                const data = await response.json();
                setErrorState(data.message || "Invalid verification code");
                return;
            }

            if (!response.ok) {
                setErrorState("Registration failed");
                return;
            }

            btnRef.current.disabled = true;
            btnRef.current.style.backgroundColor = "gray";
            btnRef.current.style.cursor = "not-allowed";

            error.current = false;
            const data = await response.json();
            setErrorState(data.message);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setOtp("");
            toast.success("Registration successful! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error) {
            error.current = true;
            setErrorState("Registration failed");
            console.log(error);
            btnRef.current.disabled = false;
            btnRef.current.style.backgroundColor = "#a8738b";
            btnRef.current.style.cursor = "pointer";
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
                            <div className="relative w-24 h-24 mb-2">
                                <Image 
                                    src="/care_logo.png" 
                                    alt="CARE Logo" 
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-[#a8738b]">Register</h1>
                            
                            <div className="w-full space-y-6">
                                {step === 1 ? (
                                    <>
                                        <div className="space-y-2">
                                            <input 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email" 
                                                placeholder="Email" 
                                                className={`w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 ${
                                                    email ? "border-green-500" : "border-[#a8738b]"
                                                }`}
                                            />
                                        </div>

                                        <div className={`space-y-2 flex justify-center items-center border-b-2 ${password ? "border-green-500" : "border-[#a8738b]"} pr-3`}>
                                            <input 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                type={`${showPW.showPassword ? "text" : "password"}`} 
                                                placeholder="Password" 
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
                                                placeholder="Confirm Password" 
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

                                        {errorState && <p className="text-red-500">{errorState}</p>}
                                        
                                        <motion.button
                                            ref={btnRef}
                                            onClick={handleRequestOTP}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 bg-[#a8738b] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                                        >
                                            Send Verification Code
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <p className="text-center text-[#a8738b]">
                                                We've sent a verification code to <span className="font-semibold">{email}</span>
                                            </p>
                                            <input 
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                type="text" 
                                                placeholder="Enter verification code" 
                                                className="w-full p-3 bg-transparent border-b-2 text-[#a8738b] placeholder:text-[#a8738b]/50 focus:outline-none transition-all duration-300 border-[#a8738b]"
                                                maxLength={6}
                                            />
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#a8738b]">
                                                    {timer > 0 ? `Code expires in ${timer}s` : "Code expired"}
                                                </span>
                                                <button 
                                                    onClick={handleResendOTP}
                                                    disabled={timer > 0 || isResending}
                                                    className={`text-[#a8738b] hover:text-[#86a4c2] transition-colors duration-200 ${(timer > 0 || isResending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isResending ? "Sending..." : "Resend code"}
                                                </button>
                                            </div>
                                        </div>

                                        {errorState && <p className="text-red-500">{errorState}</p>}
                                        
                                        <div className="flex gap-3">
                                            <motion.button
                                                onClick={() => setStep(1)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-1/3 py-3 bg-gray-300 text-[#a8738b] rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button
                                                ref={btnRef}
                                                onClick={handleRegister}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-2/3 py-3 bg-[#a8738b] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                                            >
                                                Verify & Register
                                            </motion.button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-[#a8738b]">
                                Already registered?{" "}
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
