"use client";

import { useRef, useState } from "react";


export default function page() {
    const [selections, setSelections] = useState({});
    const [totalScore, setTotalScore] = useState(0);

    const handleScore = (rowIndex, score) => {
        setSelections(prev => {
            // If this question already has a selection, subtract its score
            const currentScore = prev[rowIndex] || 0;
            const newScore = prev[rowIndex] === score ? 0 : score;
            
            // Update total score
            setTotalScore(prev => prev - currentScore + newScore);
            
            // If clicking the same circle again, remove the selection
            if (prev[rowIndex] === score) {
                const newSelections = { ...prev };
                delete newSelections[rowIndex];
                return newSelections;
            }
            
            // Otherwise, update the selection
            return {
                ...prev,
                [rowIndex]: score
            };
        });
    }

    console.log(totalScore)
    console.log(selections)

  return (
    <section className="w-[100dvw] h-[100dvh] container mx-auto bg-black">
        <div className="w-full h-fit pt-10 px-8 flex justify-around items-end lg:mb-5">
            <h1 className="text-start text-3xl pt-11 lg:pt-12">Take the first step toward self-awareness.</h1>
            <button
                    disabled={Object.keys(selections).length === 9}
                    className="px-8 py-3 bg-[#a8738b] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Done
                </button>
        </div>
        <div className="grid grid-cols-6 gap-0 w-full h-max">
            
            <div className="col-span-2 grid grid-rows-10">
                <div className="row-span-1 w-full  h-full flex items-center px-4 border-b">
                    <p className="text-lg font-medium text-[#a8738b]">Problems:</p>
                </div>

                {[
                    "Little interest or pleasure in doing things?",
                    "Feeling down, depressed, or hopeless?",
                    "Trouble falling or staying asleep, or sleeping too much?",
                    "Feeling tired or having little energy?",
                    "Poor appetite or overeating?",
                    "Feeling bad about yourself?",
                    "Trouble concentrating on things?",
                    "Moving or speaking slowly or being fidgety/restless?",
                    "Thoughts of self-harm?"
                ].map((question, index) => (
                    <div key={index} className="row-span-1 w-full border-b h-full flex items-center px-4">
                        <p className="text-lg text-[#a8738b]">{index + 1}. {question}</p>
                    </div>
                ))}
            </div>

            {[
                { label: "Not at all", score: 0 },
                { label: "Several days", score: 1 },
                { label: "More than half the days", score: 2 },
                { label: "Nearly every day", score: 3 }
            ].map((category, colIndex) => (
                <div key={colIndex} className="col-span-1 grid grid-rows-10">
                    <div className="row-span-1  flex flex-col justify-center items-center gap-1 p-2">
                        <h3 className="font-medium text-[#a8738b] text-sm text-center">{category.label}</h3>
                        <p className="text-sm text-gray-500">Score: {category.score}</p>
                    </div>

                    <div className="row-span-9 grid grid-rows-9">   
                        {[...Array(9)].map((_, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="row-span-1 flex items-center justify-center"
                            >
                                <button
                                    className={`w-6 h-6 rounded-full border-2 
                                        ${selections[rowIndex] === category.score 
                                            ? 'border-[#a8738b] bg-[#a8738b]' 
                                            : 'border-[#a8738b] hover:bg-[#a8738b] hover:border-transparent'
                                        } 
                                        focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:ring-offset-2 transition-all duration-200`}
                                    onClick={() => handleScore(rowIndex, category.score)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}
