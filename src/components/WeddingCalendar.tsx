import { useState, useEffect, useRef } from 'react';

export function WeddingCalendar() {
    const [isVisible, setIsVisible] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (calendarRef.current) {
            observer.observe(calendarRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    // September 2025 starts on Monday (1st = Monday)
    const daysInMonth = 30;
    const startDay = 1; // 0=Sunday, 1=Monday, etc.

    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div ref={calendarRef} className="relative">
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes flyToTarget {
                            0% { 
                                transform: translate(-200px, -200px) scale(0) rotate(0deg); 
                                opacity: 0; 
                            }
                            30% {
                                opacity: 1;
                                transform: translate(-100px, -100px) scale(1.8) rotate(180deg); 
                            }
                            100% { 
                                transform: translate(-50%, -50%) scale(1.2) rotate(360deg); 
                                opacity: 1; 
                            }
                        }
                        .heart-flying {
                            animation: flyToTarget 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                            opacity: 0;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-200px, -200px) scale(0);
                            font-weight: bold;
                            z-index: 5;
                        }
                    `
                }} />

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative" style={{ width: '350px' }}>
                    {/* Spiral Rings */}
                    <div className="absolute -top-4 left-0 right-0 flex justify-around px-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="relative">
                                <div className="w-3 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-md"></div>
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-2 border-pink-500 rounded-full bg-pink-200"></div>
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="pt-8 pb-4 px-6 text-center">
                        <div className="flex justify-center items-center mb-2">
                            <span className="text-3xl font-bold text-gray-800">September</span>
                        </div>
                    </div>

                    {/* Day Labels */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                        <div className="grid grid-cols-7 py-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <div key={index} className="text-center text-sm font-semibold">
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white">
                        {Array.from({ length: 6 }, (_, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-7 border-b border-pink-50 last:border-b-0">
                                {Array.from({ length: 7 }, (_, dayIndex) => {
                                    const cellIndex = weekIndex * 7 + dayIndex;
                                    const day = calendarDays[cellIndex];

                                    return (
                                        <div key={dayIndex} className="aspect-square p-3 flex items-center justify-center border-r border-pink-50 last:border-r-0 relative">
                                            {day ? (
                                                <>
                                                    <span className='text-lg font-semibold relative z-10 transition-colors duration-300 text-gray-700 hover:text-pink-600'>
                                                        {day}
                                                    </span>
                                                    {day === 28 && isVisible && (
                                                        <div className="text-6xl pointer-events-none heart-flying text-pink-500">
                                                            ♡
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                weekIndex === 0 && dayIndex > 0 && (
                                                    <span className="text-pink-300">💕</span>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-6 text-center">
                        <p className="text-xl text-pink-600 font-bold flex items-center justify-center gap-3 mb-2">
                            <span>👑</span>
                            <span>11:00 AM</span>
                            <span>👑</span>
                        </p>
                        <p className="text-sm text-pink-400 font-medium">Wedding Day</p>
                    </div>
                </div>

                {/* Floating hearts around calendar */}
                {isVisible && (
                    <div className="absolute -inset-12 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-pink-300 animate-bounce"
                                style={{
                                    left: `${5 + Math.random() * 90}%`,
                                    top: `${5 + Math.random() * 90}%`,
                                    animationDelay: `${i * 0.4}s`,
                                    animationDuration: '3s',
                                    fontSize: '14px'
                                }}
                            >
                                💕
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}