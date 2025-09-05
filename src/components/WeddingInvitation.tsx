import React from "react";
import { useState, useCallback, useEffect } from "react";
import {Header} from "./Header.tsx";
import {VoteModal} from "./modal/VoteModal.tsx";

// Main Wedding Invitation Component
const WeddingInvitation: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

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

    const handleLocationClick = () => {
        window.open('https://maps.app.goo.gl/pEpZV62sEixZvXgC7', '_blank');
    };

    return (
        <div className="font-sans antialiased relative min-h-screen">
            {/* Background with gradient fade-in effect */}
            <div className={`fixed inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 transition-all duration-2000 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`} />

            {/* Floating background elements */}
            <div className={`fixed inset-0 pointer-events-none transition-all duration-3000 ease-out ${
                isVisible ? 'opacity-30' : 'opacity-0'
            }`}>
                {/* Floating hearts */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`heart-${i}`}
                        className="absolute text-pink-300 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 4 + 6}s`
                        }}
                    >
                        💕
                    </div>
                ))}

                {/* Floating sparkles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={`sparkle-${i}`}
                        className="absolute text-yellow-300 animate-twinkle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 15 + 8}px`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        ✨
                    </div>
                ))}
            </div>
            {/* Floating Location Button */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-1000 ease-out ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } md:bottom-8 md:right-8`}>
                <button
                    onClick={handleLocationClick}
                    className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 backdrop-blur-sm border-2 border-white/20 animate-gentle-bounce"
                    aria-label="View Location"
                >
                    <div className="flex items-center justify-center w-6 h-6">
                        <svg
                            className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                            Xem địa điểm
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                        </div>
                    </div>
                </button>
            </div>

            {/* Main Content Container */}
            <div className={`relative z-10 transition-all duration-2000 ease-out ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                {/* Content with staggered animation */}
                <div className={`transform transition-all duration-2000 ease-out ${
                    showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                    <Header onOpenModal={openModal} />
                </div>

                {/* Modal with fade effect */}
                <div className={`transition-all duration-500 ease-out ${
                    isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                    <VoteModal isOpen={isModalOpen} onClose={closeModal} />
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