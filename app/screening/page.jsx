"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function page() {
    const [selections, setSelections] = useState({});
    const [totalScore, setTotalScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        "Not feeling like doing anything or enjoying things.",
        "Feeling down, depressed, or hopeless?",
        "Difficulty in sleeping, or sleeping too much?",
        "Feeling tired or having little energy?",
        "Poor appetite or overeating?",
        "Feeling worthless or disappointing yourself or your family?",
        "Trouble concentrating on things, such as reading and watching TV?",
        "Moving or speaking slowly or being restless and fidgety?",
        "Thoughts that you would be better off dead, or of hurting yourself."
    ];

    const categories = [
        { label: "Never", score: 0 },
        { label: "Several days", score: 1 },
        { label: "More than half the days", score: 2 },
        { label: "Nearly every day", score: 3 }
    ];

    const handleScore = (score) => {
        setSelections(prev => {
            const currentScore = prev[currentQuestion] || 0;
            const newScore = prev[currentQuestion] === score ? 0 : score;
            
            setTotalScore(prev => prev - currentScore + newScore);
            
            if (prev[currentQuestion] === score) {
                const newSelections = { ...prev };
                delete newSelections[currentQuestion];
                return newSelections;
            }
            
            return {
                ...prev,
                [currentQuestion]: score
            };
        });
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    }

    const handleSubmit = () => {
        console.log('Final selections:', selections);
        console.log('Total score:', totalScore);
    }

    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-bl lg:bg-gradient-to-br from-[#86a4c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            
            {/* Therapeutic decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#86a4c2]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#b18deb]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f8fcff]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-4xl mx-auto relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold text-[#86a4c2] mb-4">
                        Mental Health Analysis
                    </h1>
                    <p className="text-xl text-[#a8738b] font-medium">Take the first step toward self-awareness</p>
                </motion.div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border-2 border-[#a8738b] relative overflow-hidden">
                    {/* Progress indicator */}
                    <div className="absolute top-0 left-0 h-1 bg-[#a8738b] transition-all duration-300"
                         style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>

                    <div className="flex justify-between items-center mb-8">
                        <div className="text-sm text-[#a8738b] font-medium">
                            {currentQuestion + 1} of {questions.length}
                        </div>
                        <div className="flex items-center gap-2">
                            {[...Array(questions.length)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        i <= currentQuestion ? 'bg-[#a8738b]' : 'bg-[#a8738b]/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-medium text-[#a8738b] mb-3">
                                {currentQuestion + 1}. {questions[currentQuestion]}
                            </h2>
                            <p className="text-black/50 italic">Please select the option that best describes your experience</p>
                        </motion.div>
                    </AnimatePresence>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 rounded-xl border-2 transition-all duration-300
                                    ${selections[currentQuestion] === category.score
                                        ? 'border-[#a8738b] bg-[#a8738b]/10 text-[#bb3973] shadow-lg ring-2 ring-[#a8738b]/20'
                                        : 'border-[#a8738b]/30 hover:border-[#a8738b] hover:bg-[#a8738b]/5 text-black/50'
                                    }`}
                                onClick={() => handleScore(category.score)}
                            >
                                <div className="font-medium text-lg mb-2 ">{category.label}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    {currentQuestion === questions.length - 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={!selections[currentQuestion]}
                            className="px-8 py-3 bg-[#a8738b] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Submit Assessment
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            disabled={!selections[currentQuestion]}
                            className="px-8 py-3 bg-[#a8738b] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Next Question
                        </motion.button>
                    )}
                </div>
            </div>
        </section>
    );
}


// "use client";

// import { useRef, useState } from "react";


// export default function page() {
//     const [selections, setSelections] = useState({});
//     const [totalScore, setTotalScore] = useState(0);

//     const handleScore = (rowIndex, score) => {
//         setSelections(prev => {
//             // If this question already has a selection, subtract its score
//             const currentScore = prev[rowIndex] || 0;
//             const newScore = prev[rowIndex] === score ? 0 : score;
            
//             // Update total score
//             setTotalScore(prev => prev - currentScore + newScore);
            
//             // If clicking the same circle again, remove the selection
//             if (prev[rowIndex] === score) {
//                 const newSelections = { ...prev };
//                 delete newSelections[rowIndex];
//                 return newSelections;
//             }
            
//             // Otherwise, update the selection
//             return {
//                 ...prev,
//                 [rowIndex]: score
//             };
//         });
//     }

//     console.log(totalScore)
//     console.log(selections)

//   return (
//     <section className="w-[100dvw] h-[100dvh] container mx-auto">
//         <div className="w-full h-fit pt-10 px-8 flex justify-around items-end lg:mb-5">
//             <h1 className="text-start text-3xl pt-11 lg:pt-12">Take the first step toward self-awareness.</h1>
//             <button
//                     disabled={Object.keys(selections).length === 9}
//                     className="px-8 py-3 bg-[#a8738b] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                     Done
//                 </button>
//         </div>
//         <div className="grid grid-cols-6 gap-0 w-full h-max">
            
//             <div className="col-span-2 grid grid-rows-10">
//                 <div className="row-span-1 w-full  h-full flex items-center px-4 border-b">
//                     <p className="text-lg font-medium text-black">Problems:</p>
//                 </div>

//                 {[
//                     "Little interest or pleasure in doing things?",
//                     "Feeling down, depressed, or hopeless?",
//                     "Trouble falling or staying asleep, or sleeping too much?",
//                     "Feeling tired or having little energy?",
//                     "Poor appetite or overeating?",
//                     "Feeling bad about yourself?",
//                     "Trouble concentrating on things?",
//                     "Moving or speaking slowly or being fidgety/restless?",
//                     "Thoughts of self-harm?"
//                 ].map((question, index) => (
//                     <div key={index} className="row-span-1 w-full border-b h-full flex items-center px-4">
//                         <p className="text-lg text-black">{index + 1}. {question}</p>
//                     </div>
//                 ))}
//             </div>

//             {[
//                 { label: "Not at all", score: 0 },
//                 { label: "Several days", score: 1 },
//                 { label: "More than half the days", score: 2 },
//                 { label: "Nearly every day", score: 3 }
//             ].map((category, colIndex) => (
//                 <div key={colIndex} className="col-span-1 grid grid-rows-10">
//                     <div className="row-span-1  flex flex-col justify-center items-center gap-1 p-2">
//                         <h3 className="font-medium text-black text-sm text-center">{category.label}</h3>
//                         <p className="text-sm text-gray-500">Score: {category.score}</p>
//                     </div>

//                     <div className="row-span-9 grid grid-rows-9">   
//                         {[...Array(9)].map((_, rowIndex) => (
//                             <div
//                                 key={rowIndex}
//                                 className="row-span-1 flex items-center justify-center"
//                             >
//                                 <button
//                                     className={`w-6 h-6 rounded-full border-2 
//                                         ${selections[rowIndex] === category.score 
//                                             ? 'border-[#a8738b] bg-[#a8738b]' 
//                                             : 'border-[#a8738b] hover:bg-[#a8738b] hover:border-transparent'
//                                         } 
//                                         focus:outline-none focus:ring-2 focus:ring-[#a8738b] focus:ring-offset-2 transition-all duration-200`}
//                                     onClick={() => handleScore(rowIndex, category.score)}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     </section>
//   )
// }
