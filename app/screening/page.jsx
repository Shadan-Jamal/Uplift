"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function page() {
    const [selections, setSelections] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const scoreRef = useRef(0);
    const router = useRouter();

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
    
    const getScoreColor = (score) => {
        if (score >= 1 && score <= 4) {
            return {"label" : "Minimal", "color" : "bg-emerald-200"};
        } else if (score >= 5 && score <= 9) {
            return {"label" : "Mild", "color" : "bg-yellow-300"};
        } else if (score >= 10 && score <= 14) {
            return {"label" : "Moderate", "color" : "bg-orange-400"};
        } else if (score >= 15 && score <= 19) {
            return {"label" : "Moderately Severe", "color" : "bg-red-400"};
        } else if (score >= 20 && score <= 27) {
            return {"label" : "Severe", "color" : "bg-red-600"};
        }
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    }

    const handleScore = (score) => {
        console.log(score)
        setSelections(prev => {
            // If clicking the same option again, remove the selection
            if (prev[currentQuestion] === score) {
                const newSelections = { ...prev };
                delete newSelections[currentQuestion];
                // Update total score by subtracting the removed score
                scoreRef.current = scoreRef.current - score;
                // setTotalScore(prev => prev - score);
                return newSelections;
            }
            
            // If selecting a new option
            const currentScore = prev[currentQuestion] || 0;
            const newSelections = {
                ...prev,
                [currentQuestion]: score
            };
            
            // Update total score by subtracting the old score and adding the new score
            scoreRef.current = scoreRef.current - currentScore + score;
            console.log(newSelections)
            return newSelections;
        });
    }

    const handleSubmit = async () => {
        setShowScore(true);
        
        // Prepare the answers array
        const answers = questions.map((question, index) => ({
            question,
            answer: selections[index] || 0
        }));

        try {
            // Submit to API
            const response = await fetch('/api/screening', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score: scoreRef.current / 2,
                    level: getScoreColor(scoreRef.current / 2).label,
                    answers
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit screening results');
            }

            // Store in localStorage
            localStorage.setItem("screeningCompleted", "true");
            localStorage.setItem("screeningScore", (scoreRef.current / 2).toString());
            localStorage.setItem("screeningLevel", getScoreColor(scoreRef.current / 2).label);

            // Start countdown
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Error submitting screening:', error);
            // Still show the score and redirect, but log the error
            setShowScore(true);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push('/');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    if (showScore) {
        return (
            <section className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-bl lg:bg-gradient-to-br from-[#86a4c2] via-[#f8fcff] to-[#b18deb] backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#86a4c2]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#b18deb]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f8fcff]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-[#a8738b] max-w-md w-full mx-auto"
                >
                    <h2 className="text-3xl font-bold text-[#86a4c2] mb-4">Your Score</h2>
                    <div className="text-6xl font-bold text-[#a8738b] mb-6">{scoreRef.current / 2}</div>
                    <div className={`${getScoreColor(scoreRef.current / 2).color} px-5 py-3 rounded-lg text-white font-medium shadow-md`}>
                        {getScoreColor(scoreRef.current / 2).label}
                    </div>
                    <p className="text-lg text-gray-600 mt-4">
                        Redirecting to home page in {countdown} seconds...
                    </p>
                </motion.div>
            </section>
        );
    }
    
    return (
        <section className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-bl lg:bg-gradient-to-br from-[#e4f3ff] from-80% to-[#b18deb] backdrop-blur-3xl relative overflow-hidden">
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
                    <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-[#6caafa] mb-4">
                        Mental Health Analysis
                    </h1>
                    <p className="text-lg md:text-xl text-[#a8738b] font-medium">Please read the statements and indicate how often have you been bothered by any of the following in the last 2 weeks:</p>
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
                                <div className="font-medium text-lg mb-2">{category.label}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end items-center">
                    {currentQuestion === questions.length - 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={selections[currentQuestion] === undefined}
                            className="px-8 py-3 bg-[#a8738b] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Submit Assessment
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            disabled={selections[currentQuestion] === undefined}
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
