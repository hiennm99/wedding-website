import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {FloatingPetals} from "./FloatingPetals.tsx";
import {RadioButton} from "./button/RadioButton.tsx";
import {FormSection} from "./FormSection.tsx";
import {TRANSPORT_OPTIONS} from "../data/transports.ts";

export function WeddingVote() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Form state
    const [attendee, setAttendee] = useState('');
    const [joinable, setJoinable] = useState(true);
    const [transport, setTransport] = useState('car');
    const [message, setMessage] = useState('');

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

    const resetForm = useCallback(() => {
        setAttendee('');
        setJoinable(true);
        setTransport('car');
        setMessage('');
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!attendee.trim()) {
            alert('Vui lòng nhập tên của bạn');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', { attendee, joinable, transport, message });

            // Navigate to thank you page
            navigate('/thankful');
            resetForm()
        } catch (error) {
            console.error('Submit error:', error);
            alert('⚠ Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    }, [attendee, joinable, transport, message, navigate, resetForm]);

    const handleLocationClick = () => {
        window.open('https://maps.app.goo.gl/pEpZV62sEixZvXgC7', '_blank');
    };

    const handleBackToInvitation = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative">
            {/* Background floating elements */}
            <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
                isVisible ? 'opacity-30' : 'opacity-0'
            }`}>
                {!isMobile && <FloatingPetals count={12} />}
            </div>

            {/* Floating Location Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleLocationClick}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                    aria-label="View Location"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                </button>
            </div>

            {/* Back button */}
            <div className="fixed top-6 left-6 z-50">
                <button
                    onClick={handleBackToInvitation}
                    className="bg-white/90 hover:bg-white text-rose-600 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-pink-200"
                    aria-label="Quay lại thiệp mời"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                {/* Header */}
                {/* Form Container */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100">
                            <h2 className="text-5xl text-rose-600 text-center font-['Allura']">
                                Mời mọi người cùng tham dự nha
                            </h2>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-6">
                            {/* Attendee Name */}
                            <FormSection title="👤 Tên của bạn">
                                <input
                                    value={attendee}
                                    onChange={(e) => setAttendee(e.target.value)}
                                    placeholder="Vui lòng nhập họ và tên..."
                                    className="w-full bg-white border-2 border-pink-200 rounded-lg px-4 py-3 text-rose-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                                    required
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* RSVP Options */}
                            <FormSection title="✨ Xác nhận tham dự">
                                <div className="space-y-2">
                                    <RadioButton
                                        checked={joinable}
                                        onClick={() => !isSubmitting && setJoinable(true)}
                                        label="🎉 Có, tôi sẽ tham dự"
                                        disabled={isSubmitting}
                                    />
                                    <RadioButton
                                        checked={!joinable}
                                        onClick={() => !isSubmitting && setJoinable(false)}
                                        label="😢 Không thể tham dự"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </FormSection>

                            {/* Transportation Options - Only show if attending */}
                            {joinable && (
                                <FormSection title="🚗 Phương tiện di chuyển">
                                    <div className="space-y-2">
                                        {TRANSPORT_OPTIONS.map((item) => (
                                            <RadioButton
                                                key={item.value}
                                                checked={transport === item.value}
                                                onClick={() => !isSubmitting && setTransport(item.value)}
                                                label={item.label}
                                                disabled={isSubmitting}
                                            />
                                        ))}
                                    </div>
                                </FormSection>
                            )}

                            {/* Message */}
                            <FormSection title="💌 Lời chúc cho cô dâu chú rể">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Gửi lời chúc mừng đến Hiền & Vi..."
                                    className="w-full bg-white border-2 border-pink-200 rounded-lg px-4 py-3 text-rose-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none transition-colors"
                                    rows={4}
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* Submit button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!attendee.trim() || isSubmitting}
                                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <span>GỬI XÁC NHẬN</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="text-center mt-6 text-rose-400 text-sm">
                        <p>💕 Cảm ơn bạn đã dành thời gian xác nhận tham dự 💕</p>
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