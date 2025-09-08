import React from "react";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {Header} from "./Header.tsx";
import {FloatingLocationButton} from "./button/FloatingLocationButton.tsx";

// Main Wedding Invitation Component
const WeddingInvitation: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);

    // Navigate to vote page instead of opening modal
    const handleOpenVote = useCallback(() => {
        navigate('/vote');
    }, [navigate]);

    useEffect(() => {
        // Create entrance animation sequence
        const timer1 = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        const timer2 = setTimeout(() => {
            setShowContent(true);
        }, 800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="font-sans antialiased relative min-h-screen">
            {/* Background with gradient fade-in effect */}

            {/* Floating Location Button */}
            <FloatingLocationButton />

            {/* Main Content Container */}
            <div className={`relative z-10 transition-all duration-2000 ease-out ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                {/* Content with staggered animation */}
                <div className={`transform transition-all duration-2000 ease-out ${
                    showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                    <Header onOpenModal={handleOpenVote} />
                </div>
            </div>

            {/* Overlay particles effect */}
            <div className={`fixed inset-0 pointer-events-none transition-all duration-600 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute w-2 h-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full shadow-lg animate-float-slow"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${Math.random() * 6 + 8}s`
                        }}
                    />
                ))}
            </div>

            {/* CSS Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                            opacity: 0.7;
                        }
                        50% {
                            transform: translateY(-20px) rotate(180deg);
                            opacity: 1;
                        }
                    }

                    @keyframes float-slow {
                        0%, 100% {
                            transform: translateY(0px) translateX(0px);
                            opacity: 0.3;
                        }
                        25% {
                            transform: translateY(-15px) translateX(10px);
                            opacity: 0.6;
                        }
                        50% {
                            transform: translateY(-30px) translateX(-5px);
                            opacity: 0.8;
                        }
                        75% {
                            transform: translateY(-10px) translateX(-10px);
                            opacity: 0.5;
                        }
                    }

                    @keyframes twinkle {
                        0%, 100% {
                            transform: scale(0.8) rotate(0deg);
                            opacity: 0.5;
                        }
                        50% {
                            transform: scale(1.2) rotate(180deg);
                            opacity: 1;
                        }
                    }

                    @keyframes gentle-bounce {
                        0%, 20%, 50%, 80%, 100% {
                            transform: translateY(0);
                        }
                        40% {
                            transform: translateY(-10px);
                        }
                        60% {
                            transform: translateY(-5px);
                        }
                    }

                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }

                    .animate-float-slow {
                        animation: float-slow 8s ease-in-out infinite;
                    }

                    .animate-twinkle {
                        animation: twinkle 2s ease-in-out infinite;
                    }

                    .animate-gentle-bounce {
                        animation: gentle-bounce 2s ease-in-out infinite;
                    }

                    /* Smooth entrance animations */
                    .fade-in-up {
                        animation: fadeInUp 1s ease-out forwards;
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translate3d(0, 40px, 0);
                        }
                        to {
                            opacity: 1;
                            transform: translate3d(0, 0, 0);
                        }
                    }

                    .fade-in-scale {
                        animation: fadeInScale 1.5s ease-out forwards;
                    }

                    @keyframes fadeInScale {
                        from {
                            opacity: 0;
                            transform: scale3d(0.3, 0.3, 0.3);
                        }
                        50% {
                            opacity: 0.8;
                        }
                        to {
                            opacity: 1;
                            transform: scale3d(1, 1, 1);
                        }
                    }

                    /* Smooth transitions */
                    * {
                        transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    }

                    /* Enhanced backdrop blur effect */
                    .backdrop-blur-enhanced {
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                    }
                `
            }} />
        </div>
    );
};

export default WeddingInvitation;