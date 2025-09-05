import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router";
import {FloatingPetals} from "./FloatingPetals.tsx";
import {LoadingScreen} from "./LoadingScreen.tsx";
import {detectMobile} from "../hooks/detectMobile.ts";

const BackgroundMusic = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/musics/BackgroundMusic.mp3';
const Background = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/Background.webp'
const Envelope = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/Envelope.webp';

export const WeddingMusic: React.FC = () => {
    const isMobile = detectMobile();
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loadingProgress, ] = useState(0);
    const [currentlyLoading, ] = useState('');
    const [showText, setShowText] = useState(false);
    const [autoHover, setAutoHover] = useState(false); // Auto hover effect
    const [, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        opacity: number;
        animationDelay: number;
        duration: number;
        blur: number;
    }>>([]);

    const audioRef = useRef(new Audio(BackgroundMusic));

    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 30; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 20 + 5,
                    opacity: Math.random() * 0.3 + 0.1,
                    animationDelay: Math.random() * 3,
                    duration: Math.random() * 3 + 2,
                    blur: Math.random() * 1.5 + 0.3
                });
            }
            setParticles(newParticles);
        };

        generateParticles();

        // Auto text blinking every 1 second
        const textInterval = setInterval(() => {
            setShowText(prev => !prev);
        }, 1000);

        // Auto hover effect - cycles every 3 seconds
        const hoverInterval = setInterval(() => {
            setAutoHover(prev => !prev);
        }, 800);

        // Auto play audio after 2 seconds
        const audioTimer = setTimeout(() => {
            try {
                audioRef.current.play().catch(console.error);
            } catch (error) {
                console.error('Audio auto play failed:', error);
            }
        }, 1000);

        return () => {
            clearInterval(textInterval);
            clearInterval(hoverInterval);
            clearTimeout(audioTimer);
        };
    }, []);

    const handleOpenCard = async () => {
        if (isTransitioning) return;

        // Ensure audio is playing
        try {
            await audioRef.current.play();
        } catch (error) {
            console.error('Audio play failed:', error);
        }

        setIsTransitioning(true);
        setShowWelcome(false);

        setTimeout(() => {
            navigate('/home');
        }, 100);
    };

    // Show loading screen khi đang transition
    if (isTransitioning) {
        return (
            <LoadingScreen
                progress={loadingProgress}
                loadedAssets={[]}
                failedAssets={[]}
                currentlyLoading={currentlyLoading}
            />
        );
    }

    // Welcome screen
    if (showWelcome) {
        return (
            <div className="fixed inset-0 overflow-hidden">
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blue-50 to-rose-100" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${Background})` }}
                />

                {/* Floating petals */}
                <FloatingPetals count={isMobile ? 30 : 50} />

                {/* Main content container */}
                <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                    <div className="transition-all duration-700 ease-out">
                        {/* Card container */}
                        <div className="relative">
                            {/* Auto pulsing glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-3xl blur-2xl scale-105 sm:scale-110 md:scale-115 animate-pulse"></div>

                            {/* Main card with auto scaling */}
                            <div className={`relative p-1 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-sm mx-auto transform transition-all duration-1000 ${
                                autoHover ? 'scale-105 shadow-3xl' : 'scale-100'
                            }`}>

                                {/* Image container with auto effects */}
                                <div
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl"
                                    onClick={handleOpenCard}
                                >
                                    {/* Image with auto zoom effect */}
                                    <img
                                        src={Envelope}
                                        alt="Wedding Invitation"
                                        className={`w-full h-auto rounded-2xl transition-all duration-1000 ${
                                            autoHover ? 'scale-110 brightness-110' : 'scale-100'
                                        }`}
                                        draggable={false}
                                    />

                                    {/* Auto overlay effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-pink-600/30 via-rose-400/20 to-transparent rounded-2xl transition-all duration-1000 ${
                                        autoHover ? 'opacity-100' : 'opacity-0'
                                    }`}></div>

                                    {/* Continuous shimmer effect - always active */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 rounded-2xl continuous-shimmer"></div>

                                    {/* Auto text animation */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                                        showText ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                        <div className={`bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium text-gray-700 shadow-xl transform transition-all duration-300 ${
                                            showText ? 'scale-100 translate-y-0' : 'scale-75 translate-y-2'
                                        }`}>
                                            <span className="flex items-center gap-2">
                                                <span className="animate-bounce">✨</span>
                                                {isMobile ? 'Chạm để mở thiệp' : 'Nhấn để xem thiệp'}
                                                <span className="animate-bounce" style={{animationDelay: '0.3s'}}>💕</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Continuous floating light effects - always sparkling */}
                                    <>
                                        <div className="absolute top-6 left-6 w-3 h-3 bg-white rounded-full animate-ping shadow-lg"></div>
                                        <div className="absolute top-12 right-8 w-2 h-2 bg-pink-200 rounded-full animate-ping shadow-lg" style={{animationDelay: '0.5s'}}></div>
                                        <div className="absolute bottom-8 left-12 w-2.5 h-2.5 bg-white rounded-full animate-ping shadow-lg" style={{animationDelay: '1s'}}></div>
                                        <div className="absolute bottom-6 right-6 w-3 h-3 bg-pink-100 rounded-full animate-ping shadow-lg" style={{animationDelay: '0.7s'}}></div>
                                        <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white rounded-full animate-ping shadow-lg" style={{animationDelay: '0.3s'}}></div>
                                        <div className="absolute top-1/3 right-4 w-2 h-2 bg-pink-200 rounded-full animate-ping shadow-lg" style={{animationDelay: '0.8s'}}></div>
                                    </>

                                    {/* Continuous magical particles - always sparkling */}
                                    <>
                                        {[...Array(isMobile ? 15 : 8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute bg-white rounded-full shadow-lg animate-ping"
                                                style={{
                                                    top: `${20 + Math.random() * 60}%`,
                                                    left: `${10 + Math.random() * 80}%`,
                                                    width: `${Math.random() * (isMobile ? 12 : 8) + (isMobile ? 8 : 4)}px`,
                                                    height: `${Math.random() * (isMobile ? 12 : 8) + (isMobile ? 8 : 4)}px`,
                                                    animationDelay: `${Math.random() * 2}s`,
                                                    opacity: isMobile ? 0.9 : 0.7,
                                                    animationDuration: isMobile ? '1s' : '1.5s'
                                                }}
                                            />
                                        ))}
                                    </>

                                    {/* Additional auto breathing effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-300/10 to-purple-300/10 rounded-2xl animate-pulse"></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Auto CSS animations */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .continuous-shimmer {
                            animation: shimmer 3s infinite linear;
                        }
                        
                        @keyframes shimmer {
                            0% { transform: translateX(-100%) skewX(-12deg); }
                            100% { transform: translateX(200%) skewX(-12deg); }
                        }
                    `
                }} />
            </div>
        );
    }

    return null;
};

export default WeddingMusic;