import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {FloatingPetals} from "./FloatingPetals.tsx";
import {RadioButton} from "./button/RadioButton.tsx";
import {FormSection} from "./FormSection.tsx";
import {FloatingLocationButton} from "./button/FloatingLocationButton.tsx";
import {FloatingCalendarButton} from "./button/FloatingCalendarButton.tsx";
import {TRANSPORT_OPTIONS} from "../data/transports.ts";
import databaseService, {type AttendeeData} from "../services/databaseService.ts";
import {useFormState} from "../hooks/useFormState.ts";

export function WeddingVote() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Form state
    const {
        attendee, setAttendee,
        joinable, setJoinable,
        hasRelative, setHasRelative,
        transport, setTransport,
        message, setMessage,
        resetForm
    } = useFormState();

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

    const handleSubmit = useCallback(async () => {
        // Validate required fields
        if (!attendee.trim()) {
            alert('Vui lòng nhập tên của bạn');
            return;
        }

        setIsSubmitting(true);

        // Format data for Supabase - Now matches database schema
        const formData: AttendeeData = {
            attendee: attendee.trim(),
            joinable: joinable,  // Keep as boolean
            has_relative: hasRelative,  // Keep as boolean
            transport: joinable ? transport : '',
            message: message.trim()
        };

        console.log('Submitting to Supabase:', formData);

        try {
            const result = await databaseService.insertData(formData);

            if (result.success) {
                console.log('Success:', result.message);
                // Navigate and cleanup
                navigate('/thankful');
                resetForm();
            } else {
                console.error('Failed:', result.message);
                alert('❌ Có lỗi xảy ra: ' + result.message);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('❌ Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    }, [attendee, joinable, hasRelative, transport, message, navigate, resetForm]);

    const handleBackToInvitation = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen relative">
            {/* Background floating elements */}
            <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
                isVisible ? 'opacity-30' : 'opacity-0'
            }`}>
                <FloatingPetals count={isMobile ? 12 : 50} />
            </div>

            {/* Floating Buttons */}
            <FloatingCalendarButton />
            <FloatingLocationButton />

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
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-rose-600 text-center font-['Allura']">
                                ✨ Mời mọi người cùng tham dự nha ✨
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
                                    className="w-full bg-white border-2 border-rose-300 rounded-2xl px-4 py-3 text-rose-700 italic font-light placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors"
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
                                <>
                                    <FormSection title="✨ Bạn sẽ đi cùng người thân chưa">
                                        <div className="space-y-2">
                                            <RadioButton
                                                checked={hasRelative}
                                                onClick={() => !isSubmitting && setHasRelative(true)}
                                                label="🎉 Có, tôi sẽ đi cùng người thân"
                                                disabled={isSubmitting}
                                            />
                                            <RadioButton
                                                checked={!hasRelative}
                                                onClick={() => !isSubmitting && setHasRelative(false)}
                                                label="😢 Không, tôi chỉ đi một mình nha"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </FormSection>
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
                                </>
                            )}

                            {/* Message */}
                            <FormSection title="💌 Lời chúc cho cô dâu chú rể">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Gửi lời chúc mừng đến Hiền & Vi..."
                                    className="w-full italic font-light bg-white border-2 border-pink-200 rounded-lg px-4 py-3 text-rose-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none transition-colors"
                                    rows={4}
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* Submit button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!attendee.trim() || isSubmitting}
                                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-2xl animate-spin"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <span>✨ GỬI XÁC NHẬN ✨</span>
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