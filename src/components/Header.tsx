import React, {useCallback, useEffect, useState} from "react";
import type {HeaderProps} from "../types";
// import {WeddingInfoCard} from "./WeddingInfoCard.tsx";
import {CircularImage} from "./common/CircularImage.tsx";
import {FloatingPetals} from "./FloatingPetals.tsx";
import {WeddingCalendar} from "./WeddingCalendar.tsx";
import {FloatingLocationButton} from "./button/FloatingLocationButton.tsx";

const HeroCouple = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/HeroCouple.webp';

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleOpenModal = useCallback(() => {
        onOpenModal();
    }, [onOpenModal]);

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

    return (
        <>
            <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-10">
                {/* Background floating elements */}
                <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
                    isVisible ? 'opacity-30' : 'opacity-0'
                }`}>
                    <FloatingPetals count={isMobile ? 12 : 50} />
                </div>

                {/* Floating Location Button */}
                <FloatingLocationButton />

                <div className="max-w-4xl mx-auto text-center relative z-20">
                    <div className="mb-12">
                        <p className="text-rose-600 text-4xl md:text-5xl mb-6 font-['Allura'] italic tracking-wide pb-10">
                            Save the Date
                        </p>
                        <h1 className="text-pink-400 text-7xl lg:text-6xl font-['Allura'] font-bold mb-8 tracking-wide">
                            Hiền & Vi
                        </h1>
                    </div>

                    <div className="flex justify-center mb-12">
                        <CircularImage src={HeroCouple} alt="Hiền & Vi" objectPosition="center 20%"/>
                    </div>

                    {/* Bouncing Button */}
                    <div className="mb-12 animate-bounce">
                        <button
                            onClick={handleOpenModal}
                            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 tracking-wider uppercase shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-500 animate-pulse"
                        >
                            ✨ JOIN WITH US ✨
                        </button>
                    </div>
                </div>
            </section>
            <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-10">
                <WeddingCalendar/>
            </section>
        </>

    );
};