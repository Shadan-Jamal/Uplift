"use client"
import { motion } from "motion/react"
import { useState } from "react"
import Image from "next/image"

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
      <section className="w-1/2 h-full grid place-content-center place-items-center">
        <div className="border border-white rounded-2xl md:max-w-[20em] md:h-auto p-10 flex flex-col justify-center items-center gap-3 text-white drop-shadow-xl relative overflow-hidden">
          <div className="absolute w-full top-0 h-fit py-1 px-2 flex flex-row justify-center items-center bg-black">
            <motion.button 
            whileHover={{scale : 1.1}}
            onClick={() => setLoginChoice("student")}
            className=" text-white text-center w-1/2 cursor-pointer">Student</motion.button>
            <motion.button 
            onClick={() => setLoginChoice("")}
            whileHover={{scale : 1.1}}
            className=" text-white text-center w-1/2 cursor-pointer">Council</motion.button>
          </div>
          {loginChoice == "student" ? <StudentLogin /> : <CouncilLogin />}
        </div>
      </section>
    </section>
  )
}

const StudentLogin = () => {
  return (
  <div>
    <div className="w-full px-5 py-2 mb-5"><h4 className="text-2xl font-bold w-full h-fit">Student Login</h4></div>
      <div className="w-full h-fit">
          <form action="#" className="flex flex-col justify-center items-center gap-5">
              <input type="email" placeholder="Enter College Mail ID" className="border-b-[1px]" />
              <input type="password" placeholder="Enter Password" className="border-b-[1px]" />
              <motion.input 
              whileHover={{backgroundColor : "black", color: "white"}}
              className="px-3 py-1 rounded-[2px]"
              type="submit" value="Submit" />
          </form>
      </div>
  </div>
  )
}

const CouncilLogin = () => {
  return (
  <div>
    <div className="w-full px-5 py-2 mb-5"><h4 className="text-2xl font-bold w-full h-fit">Council Login</h4></div>
      <div className="w-full h-fit">
          <form action="#" className="flex flex-col justify-center items-center gap-5">
              <input type="email" placeholder="Enter College Mail ID" className="border-b-[1px] focus:outline-0" />
              <input type="password" placeholder="Enter Password" className="border-b-[1px]" />
              <motion.input 
              whileHover={{backgroundColor : "black", color: "white"}}
              className="px-3 py-1 rounded-[2px]"
              type="submit" value="Submit" />
          </form>
      </div>
  </div>
  )
}

export default page