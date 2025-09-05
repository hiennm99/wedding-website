import React, {useCallback} from "react";
import type {HeaderProps} from "../types";
// import {WeddingInfoCard} from "./WeddingInfoCard.tsx";
import {CircularImage} from "./common/CircularImage.tsx";
import {FloatingPetals} from "./FloatingPetals.tsx";
import {WeddingCalendar} from "./WeddingCalendar.tsx";
// import HeroCouple from '../assets/images/HeroCouple.webp';
// import Background from '../assets/images/Background.webp';

const Background = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/Background.webp'
const HeroCouple = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/HeroCouple.webp';

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
    const handleOpenModal = useCallback(() => {
        onOpenModal();
    }, [onOpenModal]);

    return (
        <>
            <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-10">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blue-50 to-rose-100" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${Background})` }}
                />

                {/* Floating petals */}
                <FloatingPetals count={50} />

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
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blue-50 to-rose-100" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${Background})` }}
                />

                {/* Floating petals */}
                <FloatingPetals count={50} />
                <WeddingCalendar/>
            </section>
        </>

    );
};