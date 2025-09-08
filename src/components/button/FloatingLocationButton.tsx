import React from "react";

export const FloatingLocationButton: React.FC = () => {
    const handleLocationClick = () => {
        window.open('https://maps.app.goo.gl/pEpZV62sEixZvXgC7', '_blank');
    };
    return (
        <>
            <div className="fixed bottom-6 right-2 z-50">
                <button
                    onClick={handleLocationClick}
                    className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                    aria-label="View Location"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>

                    {/* Tooltip */}
                    <div
                        className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div
                            className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                            Xem địa điểm
                            <div
                                className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                        </div>
                    </div>
                </button>
            </div>
        </>
    );
}