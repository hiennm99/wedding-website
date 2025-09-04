import {useState, useRef} from "react";
import {useNavigate} from "react-router";
import {FloatingPetals} from "./FloatingPetals.tsx";
import BackgroundMusic from '../assets/musics/BackgroundMusic.mp3'

// Wedding Music Component
export const WeddingMusic: React.FC = () => {
    const navigate = useNavigate();
    const [showWelcome, ] = useState(true);
    const audioRef = useRef(new Audio(BackgroundMusic));

    const playSound = () => {
        audioRef.current.play();
        navigate("/home");
    };

    // Welcome screen để trigger autoplay
    if (showWelcome) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 flex items-center justify-center z-50 p-4">
                {/* Floating petals */}
                <FloatingPetals count={25} />

                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md mx-auto shadow-2xl border border-pink-200 relative z-10">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-['Allura'] text-rose-600 mb-2">Hiền & Vi</h2>
                        <p className="text-pink-600 font-light mb-4">Wedding Invitation</p>
                    </div>
                    <div className="mb-12 animate-bounce">
                        <button
                            onClick={playSound}
                            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-sm tracking-wide"
                        >
                            ✨ Mở Thiệp Cưới ✨
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default WeddingMusic;