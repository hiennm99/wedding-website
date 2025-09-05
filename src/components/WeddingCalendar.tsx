import { useState, useEffect, useRef } from 'react';

export function WeddingCalendar() {
    const [isVisible, setIsVisible] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-rose-200 p-8 flex items-center justify-center relative overflow-hidden">
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

            <div ref={calendarRef} className="relative">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative" style={{ width: '300px' }}>

                    {/* Spiral Rings */}
                    <div className="absolute -top-4 left-0 right-0 flex justify-around px-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="relative">
                                <div className="w-3 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-md"></div>
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-2 border-pink-500 rounded-full bg-pink-200"></div>
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="pt-8 pb-4 px-6 text-center">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-2xl font-bold text-gray-800">2025</span>
                            <span className="text-2xl font-bold text-gray-800">September</span>
                        </div>
                    </div>

                    {/* Day Labels */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                        <div className="grid grid-cols-7 py-3">
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
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    const day = calendarDays[cellIndex];

                                    return (
                                        <div key={dayIndex} className="aspect-square p-2 flex items-center justify-center border-r border-pink-50 last:border-r-0 relative">
                                            {day ? (
                                                <>
                                                    <span className="text-sm font-semibold text-gray-700 hover:text-pink-600 relative z-10">
                                                        {day}
                                                    </span>
                                                    {day === 28 && isVisible && (
                                                        <div className="text-5xl pointer-events-none heart-flying text-pink-500">
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
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-4 text-center">
                        <p className="text-base text-pink-600 font-semibold flex items-center justify-center gap-2">
                            <span>💒</span>
                            <span>11:00 AM</span>
                            <span>💒</span>
                        </p>
                        <p className="text-xs text-pink-400 mt-1">Wedding Day</p>
                    </div>
                </div>

                {/* Floating hearts around calendar */}
                {isVisible && (
                    <div className="absolute -inset-10 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-pink-300 animate-bounce"
                                style={{
                                    left: `${10 + Math.random() * 80}%`,
                                    top: `${10 + Math.random() * 80}%`,
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: '3s',
                                    fontSize: '12px'
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