// Calendar Component
export const WeddingCalendar: React.FC = () => {
    const generateCalendar = (): (number | null)[] => {
        const daysInMonth = 30;
        const firstDay = 1;
        const days: (number | null)[] = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const days = generateCalendar();

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-4">
                <div className="text-center">
                    <h3 className="text-xl font-bold">THÁNG 9</h3>
                    <p className="text-sm opacity-90">2025</p>
                </div>
            </div>

            <div className="grid grid-cols-7 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                    <div key={day} className="p-3 text-center text-xs font-semibold text-pink-700">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 bg-white">
                {days.map((day, index) => (
                    <div key={index} className="aspect-square p-1">
                        {day && (
                            <div className={`w-full h-full flex items-center justify-center text-sm ${
                                day === 28
                                    ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-xl shadow-lg transform scale-105 font-bold border-2 border-white'
                                    : 'text-gray-600 hover:bg-pink-50 rounded-lg transition-all duration-200 hover:scale-105'
                            }`}>
                                {day}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-3 text-center border-t border-pink-200">
                <p className="text-base text-rose-600 font-semibold">11:00 AM</p>
            </div>
        </div>
    );
};