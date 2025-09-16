import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FloatingPetals } from "./FloatingPetals.tsx";
import { useAttendeeStore } from "../stores/attendeeStore.ts";
import {CircularImage} from "./common/CircularImage.tsx";

const GalleryCouple = 'https://3utqeqt0pa7xbazg.public.blob.vercel-storage.com/images/GalleryCouple.webp';

export function Thankful() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Get data from Zustand store
    const {
        name,
        joinable,
        isSubmitted,
        getDisplayName,
        resetStore
    } = useAttendeeStore();

    const attendeeName = getDisplayName();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Redirect if no submission data
        if (!isSubmitted && !name.trim()) {
            navigate('/vote');
            return;
        }

        // Animation entrance
        const timer = setTimeout(() => setIsVisible(true), 100);

        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timer);
        };
    }, [isSubmitted, name, navigate]);


    const handleBackToHome = () => {
        // Navigate FIRST before clearing store
        navigate('/', { replace: true });

        // Then clear the form data - do this after navigation
        setTimeout(() => {
            resetStore();
        }, 100);
    };

    const handleBackToForm = () => {
        navigate('/vote');
    };

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
            {/* Background floating elements */}
            <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
                isVisible ? 'opacity-40' : 'opacity-0'
            }`}>
                <FloatingPetals count={isMobile ? 15 : 60} />
            </div>

            {/* Main Content */}
            <div className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                <div className="max-w-2xl mx-auto text-center">
                    {/* Thank you message */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-rose-600 font-['Allura'] mb-4">
                                Cảm ơn {attendeeName}! ✨
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto rounded-full"></div>
                        </div>

                        {/* Content based on attendance */}
                        <div className="space-y-6">
                            {joinable ? (
                                <>
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h2 className="text-xl sm:text-2xl text-rose-700 font-semibold mb-4">
                                        Tuyệt vời! Chúng tôi rất mong được gặp {attendeeName}!
                                    </h2>
                                    <p className="text-rose-600 text-lg leading-relaxed">
                                        Cảm ơn {attendeeName} đã xác nhận tham dự đám cưới của chúng tôi.
                                        Sự hiện diện của {attendeeName} sẽ làm cho ngày đặc biệt này trở nên ý nghĩa hơn! 💕
                                    </p>
                                    <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 mt-6">
                                        <p className="text-rose-700 font-medium">
                                            📅 Hẹn gặp {attendeeName} vào ngày cưới nhé!
                                        </p>
                                        <p className="text-rose-600 text-sm mt-2">
                                            Chúng tôi sẽ gửi thêm thông tin chi tiết sớm thôi!
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-6xl mb-4">💙</div>
                                    <h2 className="text-xl sm:text-2xl text-rose-700 font-semibold mb-4">
                                        Cảm ơn {attendeeName} đã thông báo!
                                    </h2>
                                    <p className="text-rose-600 text-lg leading-relaxed">
                                        Chúng tôi hiểu {attendeeName} có những lý do riêng.
                                        Dù không thể tham dự nhưng tình cảm của {attendeeName}
                                         dành cho chúng tôi vẫn rất quý giá! 💝
                                    </p>
                                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mt-6">
                                        <p className="text-blue-700 font-medium">
                                            Chúng tôi sẽ nhớ đến {attendeeName} trong ngày đặc biệt này!
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Couple Gallery Image */}
                        <div className="mt-8 pt-6 border-t border-pink-200 items-center justify-center">
                            <div className="text-center items-center justify-center">
                                <div className="flex  mb-4 items-center justify-center"> {/* Thêm margin-bottom cho hình */}
                                    <CircularImage
                                        src={GalleryCouple}
                                        alt="Cảm ơn bạn đã tham dự"
                                        size="w-64 h-64 sm:w-48 sm:h-48 md:w-56 md:h-56"
                                    />
                                </div>
                                {/* Fallback content if image doesn't load */}
                                <div
                                    style={{ display: 'none' }}
                                    className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                                >
                                    <span className="text-6xl mb-4">💕</span>
                                    <p className="text-rose-600 font-['Allura'] text-2xl">Hiền & Vi</p>
                                    <p className="text-rose-400 text-sm mt-2">Gallery Coming Soon</p>
                                </div>

                                <p className="text-rose-500 italic text-sm mt-4">
                                    "Tình yêu không chỉ là nhìn vào mắt nhau, mà là cùng nhìn về một hướng" ✨
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button
                                onClick={handleBackToHome}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                🏠 Về trang chủ
                            </button>
                            <button
                                onClick={handleBackToForm}
                                className="flex-1 bg-white hover:bg-gray-50 text-rose-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-2 border-rose-300"
                            >
                                ✏️ Sửa thông tin
                            </button>
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="text-center text-rose-400 text-sm">
                        <p className="mb-2">💌 Nếu có thay đổi, {attendeeName} có thể cập nhật lại thông tin bất cứ lúc nào</p>
                        <p>🌸 Hiền & Vi 🌸</p>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                            opacity: 0.6;
                        }
                        50% {
                            transform: translateY(-20px) rotate(180deg);
                            opacity: 1;
                        }
                    }

                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }

                    /* Reduce animations on mobile */
                    @media (max-width: 767px) {
                        .animate-float {
                            animation: none;
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
}