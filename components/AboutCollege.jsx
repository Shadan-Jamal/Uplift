"use client";
import Image from "next/image";

export default function AboutCollege() {
  return (
    <div className="flex flex-col items-center space-x-4 p-4 h-[80dvh]">
        <div className="flex justify-start w-full">
            {/* <h1 className="text-5xl text-black underline text-center">About SCC</h1> */}
        </div>
        <div className="flex justify-center items-center gap-14 w-full h-full">
            <Image src={"/Colleg-front-view.jpg"} width={500} height={500} className="rounded-2xl border-2 border-[#]" />
            <p className="flex-1 text-lg text-gray-800 max-w-[50em]">
                St. Claret College, Autonomous was established in 2005 by the International Missionary Congregation of Claretians who manage two universities and over 150 educational institutions in 70 countries around the world. SCC is recognized by UGC, permanently affiliated to Bangalore University, AICTE Approved and NAAC accredited with A+ Grade. SCC offers value based education to transform students to be enlightened leaders and networkers who bring about a civilization of love and harmony. In addition to the regular curriculum, students receive specialized training from professional bodies to enhance their skills in group discussions, teamwork, and leadership. This training equips them with the competencies needed to secure suitable positions in the corporate world.
            </p>
        </div>
    </div>
  )
}
