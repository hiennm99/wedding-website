
import React, {useState, useRef, useEffect, useCallback} from "react";
import {useNavigate} from "react-router";
import {LoadingScreen} from "./LoadingScreen.tsx";

const BackgroundMusic = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/musics/BackgroundMusic.mp3';
const Envelope = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/Envelope2.webp';

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
}

export const WeddingEnvelope: React.FC = () => {
    const navigate = useNavigate();
    const [, setIsVisible] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showWelcome, setShowWelcome] = useState<boolean>(true);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [isBubbleTransition, setIsBubbleTransition] = useState<boolean>(false);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [loadingProgress, ] = useState(0);
    const [currentlyLoading, ] = useState('');
    const [showText, setShowText] = useState(false);
    const [autoHover, setAutoHover] = useState(false);
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
        }, 2000);

        // Auto hover effect - cycles every 2 seconds
        const hoverInterval = setInterval(() => {
            setAutoHover(prev => !prev);
        }, 2000);

        // Auto play audio after 2 seconds
        const audioTimer = setTimeout(() => {
            try {
                audioRef.current.play().catch(console.error);
            } catch (error) {
                console.error('Audio auto play failed:', error);
            }
        }, 2000);

        return () => {
            clearInterval(textInterval);
            clearInterval(hoverInterval);
            clearTimeout(audioTimer);
        };
    }, []);

    // Generate bubbles for transition
    const generateBubbles = useCallback(() => {
        const newBubbles: Bubble[] = [];
        const bubbleCount = isMobile ? 40 : 60; // Giảm số lượng bubble

        for (let i = 0; i < bubbleCount; i++) {
            newBubbles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 30 + 8, // Giảm size
                delay: Math.random() * 0.5, // Giảm delay từ 2s xuống 0.5s
                duration: Math.random() * 1 + 1.5, // Giảm duration từ 2+3 xuống 1+1.5
                opacity: Math.random() * 0.7 + 0.3
            });
        }
        setBubbles(newBubbles);
    }, [isMobile]);

    const handleOpenCard = async () => {
        if (isTransitioning) return;

        // Ensure audio is playing
        try {
            await audioRef.current.play();
        } catch (error) {
            console.error('Audio play failed:', error);
        }

        setIsTransitioning(true);
        setIsBubbleTransition(true);

        // Generate bubbles for transition
        generateBubbles();

        // Wait for bubble animation to complete
        setTimeout(() => {
            setShowWelcome(false);
            navigate('/home');
        }, 800); // 3.5 seconds for full bubble transition
    };

    // Show loading screen when transitioning
    if (isTransitioning && !isBubbleTransition) {
        return (
            <LoadingScreen
                progress={loadingProgress}
                loadedAssets={[]}
                failedAssets={[]}
                currentlyLoading={currentlyLoading}
            />
        );
    }

    // Welcome screen with bubble transition
    if (showWelcome) {
        return (
            <div className="fixed inset-0 overflow-hidden">
                {/* Background layers */}
                <div className={`absolute inset-0 bg-gradient-to-br from-pink-50 via-blue-50 to-rose-100 transition-all duration-2000 ${
                    isBubbleTransition ? 'opacity-0 scale-110' : 'opacity-100'
                }`} />

                {/* Main content container */}
                <div className={`relative z-10 flex items-center justify-center min-h-screen p-6 transition-all duration-2000 ${
                    isBubbleTransition ? 'opacity-0 scale-50' : 'opacity-100'
                }`}>
                    <div className="transition-all duration-700 ease-out">
                        {/* Card container */}
                        <div className="relative">
                            {/* Auto pulsing glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-3xl blur-2xl scale-105 sm:scale-110 md:scale-115 animate-pulse"></div>

                            {/* Main card with auto scaling */}
                            <div className={`relative p-1 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto transform transition-all duration-1000 ${
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
                                            autoHover ? 'scale-115 brightness-115' : 'scale-100'
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
                                        <div className={`bg-gradient-to-r from-pink-500/95 via-rose-400/95 to-purple-500/95 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold text-white shadow-2xl border border-white/30 transform transition-all duration-300 ${
                                            showText ? 'scale-100 translate-y-0' : 'scale-75 translate-y-2'
                                        }`}>
                                            <span className="flex items-center gap-2 drop-shadow-sm">
                                                <span className="animate-bounce text-yellow-200">✨</span>
                                                <span className="bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent font-extrabold">
                                                    {isMobile ? 'Chạm để mở thiệp' : 'Nhấn để xem thiệp'}
                                                </span>
                                                <span className="animate-bounce text-pink-200" style={{animationDelay: '0.3s'}}>💕</span>
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

                {/* Bubble Transition Overlay */}
                {isBubbleTransition && (
                    <div className="fixed inset-0 z-50 pointer-events-none">
                        {/* Gradient overlay for smooth transition */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-blue-50/80 to-rose-100/80 backdrop-blur-sm animate-fade-in" />

                        {/* Bubbles */}
                        {bubbles.map((bubble) => (
                            <div
                                key={bubble.id}
                                className="absolute rounded-full bg-gradient-to-br from-white/60 via-pink-100/40 to-blue-100/60 backdrop-blur-sm border border-white/30 shadow-lg"
                                style={{
                                    left: `${bubble.x}%`,
                                    top: `${bubble.y}%`,
                                    width: `${bubble.size}px`,
                                    height: `${bubble.size}px`,
                                    opacity: bubble.opacity,
                                    animation: `bubbleFloat ${bubble.duration}s ease-out ${bubble.delay}s forwards, bubbleFade 1s ease-in ${bubble.delay + bubble.duration - 1}s forwards`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Enhanced CSS animations */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .continuous-shimmer {
                            animation: shimmer 3s infinite linear;
                        }
                        
                        @keyframes shimmer {
                            0% { transform: translateX(-100%) skewX(-12deg); }
                            100% { transform: translateX(200%) skewX(-12deg); }
                        }

                        @keyframes bubbleFloatFast {
                            0% {
                                transform: translateY(0) scale(0.5);
                                opacity: 0;
                            }
                            15% {
                                opacity: 0.9;
                                transform: translateY(-15px) scale(0.8);
                            }
                            50% {
                                opacity: 0.8;
                                transform: translateY(-40px) scale(1);
                            }
                            100% {
                                transform: translateY(-80px) scale(1.1);
                                opacity: 0.6;
                            }
                        }

                        @keyframes bubbleFadeFast {
                            0% {
                                opacity: 0.6;
                                transform: scale(1.1);
                            }
                            100% {
                                opacity: 0;
                                transform: scale(0.3);
                            }
                        }

                        @keyframes fade-in-fast {
                            0% {
                                opacity: 0;
                            }
                            100% {
                                opacity: 1;
                            }
                        }

                        .animate-fade-in-fast {
                            animation: fade-in-fast 0.8s ease-out forwards;
                        }
                    `
                }} />
            </div>
        );
    }

    return null;
};

export default WeddingEnvelope;