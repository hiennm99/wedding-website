import React, { useState } from "react";
import { WeddingCalendar } from "../WeddingCalendar";

export const FloatingCalendarButton: React.FC = () => {
    const [showCalendar, setShowCalendar] = useState(false);

    const handleCalendarClick = () => {
        setShowCalendar(!showCalendar);
    };

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-24 right-2 z-50">
                <button
                    onClick={handleCalendarClick}
                    className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                    aria-label="View Calendar"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                            Xem lịch cưới
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                        </div>
                    </div>
                </button>
            </div>

            {/* Calendar Modal/Overlay */}
            {showCalendar && (
                <>
                    {/* Background Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        onClick={() => setShowCalendar(false)}
                    />

                    {/* Calendar Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="relative max-w-md w-full animate-in zoom-in-95 duration-300">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-10"
                                aria-label="Đóng lịch"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Calendar Content */}
                            <WeddingCalendar />
                        </div>
                    </div>
                </>
            )}

            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes animate-in {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    
                    .animate-in {
                        animation: animate-in 0.3s ease-out forwards;
                    }
                    
                    .zoom-in-95 {
                        animation: animate-in 0.3s ease-out forwards;
                    }
                `
            }} />
        </>
    );
};