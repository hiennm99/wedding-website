import React, { useState, useEffect } from "react";
import {CircularImage} from "./common/CircularImage.tsx";
import {FloatingLocationButton} from "./button/FloatingLocationButton.tsx";
import {FloatingCalendarButton} from "./button/FloatingCalendarButton.tsx";
import {FloatingPetals} from "./FloatingPetals.tsx";

const GalleryCouple = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/GalleryCouple.webp';

export const Thankful: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Animation entrance
        const timer = setTimeout(() => setIsVisible(true), 100);

        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        // Animation entrance sequence
        const timer1 = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        const timer2 = setTimeout(() => {
            setShowContent(true);
        }, 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50 relative overflow-hidden">
            {/* Background floating elements */}
            <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
                isVisible ? 'opacity-30' : 'opacity-0'
            }`}>
                <FloatingPetals count={isMobile ? 12 : 50} />
            </div>

            {/* Floating Buttons */}
            <FloatingCalendarButton />
            <FloatingLocationButton />

            {/* Main Content */}
            <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-1000 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                <div className="max-w-6xl w-full mx-auto">
                    {/* Thank you card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-100 to-rose-100 px-6 sm:px-8 py-6 border-b border-pink-100">
                            <div className="text-center">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-600 mb-2">
                                    🎉 Cảm ơn bạn! 🎉
                                </h1>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 lg:p-12 bg-gradient-to-r from-pink-50 to-rose-50">
                            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                                {/* Image */}
                                <div className="flex-shrink-0 order-2 lg:order-1">
                                    <div className={`transition-all duration-1000 delay-300 ${
                                        showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                    }`}>
                                        <CircularImage
                                            src={GalleryCouple}
                                            alt="Cảm ơn bạn đã tham dự"
                                            size="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
                                        />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
                                    <div className={`transition-all duration-1000 delay-500 ${
                                        showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                    }`}>
                                        <div className="space-y-6">
                                            <h2 className="text-3xl sm:text-2xl lg:text-3xl xl:text-4xl font-['Allura'] text-rose-600 leading-relaxed">
                                                Sự hiện diện của bạn sẽ làm cho ngày đặc biệt của chúng tôi thêm ý nghĩa và trọn vẹn hơn
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gradient-to-r from-pink-100 to-rose-100 px-6 sm:px-8 py-4 border-t border-pink-100">
                            <div className="text-center">
                                <p className="text-rose-400 text-xs sm:text-sm">
                                    💕 Hiền & Vi 💕
                                </p>
                                <p className="text-rose-300 text-xs mt-1">
                                    Hẹn gặp bạn trong ngày trọng đại của chúng tôi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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

                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }

                    .animate-twinkle {
                        animation: twinkle 2s ease-in-out infinite;
                    }

                    /* Reduce animations on mobile for performance */
                    @media (max-width: 767px) {
                        .animate-float {
                            animation: float 8s ease-in-out infinite;
                        }
                    }

                    /* Smooth transitions */
                    * {
                        transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    }
                `
            }} />
        </div>
    );
};