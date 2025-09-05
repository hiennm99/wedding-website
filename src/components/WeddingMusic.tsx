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
    const [isHovered, setIsHovered] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showText, setShowText] = useState(false); // New state for text visibility
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

        // Auto show hint after 3 seconds on mobile
        if (isMobile) {
            const timer = setTimeout(() => {
                setShowHint(true);
            }, 3000);
            return () => clearTimeout(timer);
        }

        // Text blinking every 1 second
        const textInterval = setInterval(() => {
            setShowText(prev => !prev);
        }, 1000);

        return () => {
            clearInterval(textInterval);
        };
    }, [isMobile]);

    const handleOpenCard = async () => {
        if (isTransitioning) return;

        // Mobile: Cần user interaction để play audio
        try {
            if (isMobile) {
                // Preload audio trước
                audioRef.current.load();
                await audioRef.current.play();
            } else {
                audioRef.current.play().catch(console.error);
            }
        } catch (error) {
            console.error('Audio play failed:', error);
        }

        // Set transition state và ẩn welcome screen
        setIsTransitioning(true);
        setShowWelcome(false);

        // Navigate sau khi loading xong
        setTimeout(() => {
            navigate('/home');
        }, 100);
    };

    // Mobile touch handlers
    const handleTouchStart = () => {
        if (isMobile) {
            setIsHovered(true);
        }
    };

    const handleTouchEnd = () => {
        if (isMobile) {
            // Delay để user có thể thấy hiệu ứng
            setTimeout(() => {
                setIsHovered(false);
            }, 200);
        }
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

                {/* Floating petals - Reduce count on mobile for performance */}
                <FloatingPetals count={isMobile ? 30 : 50} />

                {/* Main content container */}
                <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                    <div className="transition-all duration-700 ease-out">
                        {/* Card container */}
                        <div className="relative">
                            {/* Glow effect - Continuous pulsing - Responsive sizing */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-3xl blur-2xl scale-105 sm:scale-110 md:scale-115 animate-pulse"></div>

                            {/* Main card */}
                            <div className={`relative p-1 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-sm mx-auto transform transition-all duration-700 ${
                                isHovered ? 'scale-105 shadow-3xl' : isMobile ? '' : 'hover:scale-105 hover:shadow-3xl'
                            }`}>

                                {/* Image container */}
                                <div
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl"
                                    onClick={handleOpenCard}
                                    onMouseEnter={() => !isMobile && setIsHovered(true)}
                                    onMouseLeave={() => !isMobile && setIsHovered(false)}
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    // Prevent mobile scroll when touching
                                    onTouchMove={(e) => e.preventDefault()}
                                >
                                    {/* Image */}
                                    <img
                                        src={Envelope}
                                        alt="Wedding Invitation"
                                        className={`w-full h-auto rounded-2xl transition-all duration-700 ${
                                            isHovered ? 'scale-110 brightness-110' : ''
                                        }`}
                                        // Prevent drag on mobile
                                        draggable={false}
                                    />

                                    {/* Hover overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-pink-600/30 via-rose-400/20 to-transparent rounded-2xl transition-all duration-500 ${
                                        isHovered ? 'opacity-100' : 'opacity-0'
                                    }`}></div>

                                    {/* Continuous shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 rounded-2xl continuous-shimmer"></div>

                                    {/* Click hint - Appears rhythmically every 1 second */}
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

                                    {/* Continuous floating light effects - Always visible and continuously sparkling */}
                                    <>
                                        <div className="absolute top-6 left-6 w-3 h-3 bg-white rounded-full animate-ping shadow-lg"></div>
                                        <div className="absolute top-12 right-8 w-2 h-2 bg-pink-200 rounded-full animate-ping shadow-lg" style={{animationDelay: '0.5s'}}></div>
                                        <div className="absolute bottom-8 left-12 w-2.5 h-2.5 bg-white rounded-full animate-ping shadow-lg" style={{animationDelay: '1s'}}></div>
                                        <div className="absolute bottom-6 right-6 w-3 h-3 bg-pink-100 rounded-full animate-ping shadow-lg" style={{animationDelay: '0.7s'}}></div>
                                        <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white rounded-full animate-ping shadow-lg" style={{animationDelay: '0.3s'}}></div>
                                        <div className="absolute top-1/3 right-4 w-2 h-2 bg-pink-200 rounded-full animate-ping shadow-lg" style={{animationDelay: '0.8s'}}></div>
                                    </>

                                    {/* Continuous magical particles - Always sparkling */}
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
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default WeddingMusic;