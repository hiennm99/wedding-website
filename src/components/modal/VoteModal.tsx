import {useCallback, useState, useEffect} from "react";
import {FloatingPetals} from "../FloatingPetals.tsx";
import {FormSection} from "../FormSection.tsx";
import {RadioButton} from "../button/RadioButton.tsx";

const TRANSPORT_OPTIONS = [
    { value: 'car', label: '🚗 Xe hơi' },
    { value: 'motorbike', label: '🏍️ Xe máy' },
    { value: 'bus', label: '🚌 Xe buýt' },
    { value: 'other', label: '🚶 Khác' }
];

export function VoteModal({ isOpen = true, onClose = () => {} }) {
    const navigate = () => console.log('Navigate to /thankful');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        return () => window.removeEventListener('resize', checkMobile);
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

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form submitted:', { attendee, joinable, transport, message });
            navigate();
            resetForm();
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
            alert('⚠ Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    }, [attendee, transport, message, joinable, resetForm, onClose]);

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        resetForm();
        onClose();
    }, [resetForm, onClose, isSubmitting]);

    // Prevent background scroll - SIMPLIFIED VERSION
    useEffect(() => {
        if (isOpen) {
            // Simple approach - just prevent body scroll
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background overlay */}
            <div
                className={`absolute inset-0 ${
                    isMobile
                        ? 'bg-black/50'
                        : 'bg-gradient-to-br from-pink-300/20 via-purple-300/15 to-rose-300/20 backdrop-blur-sm'
                }`}
                onClick={handleBackdropClick}
            />

            {/* Floating petals - only on desktop */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                    <FloatingPetals count={6} />
                </div>
            )}

            {/* Modal content with its own scroll */}
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Modal container */}
                <div className={`relative bg-white rounded-2xl shadow-xl border overflow-hidden ${
                    isMobile
                        ? 'border-gray-200'
                        : 'bg-white/95 backdrop-blur-md border-white/30'
                }`}>
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-colors duration-200 text-gray-600 text-xl font-bold shadow-md border disabled:opacity-50"
                        aria-label="Đóng modal"
                    >
                        ×
                    </button>

                    {/* Header - FIXED */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100">
                        <h2 className="text-2xl text-rose-600 text-center font-semibold">
                            Mời mọi người cùng tham dự nha
                        </h2>
                    </div>

                    {/* Form content - SCROLLABLE */}
                    <div className="overflow-y-auto max-h-[calc(90vh-100px)] custom-scroll">
                        <div className="p-6 space-y-5">
                            {/* Attendee Name */}
                            <FormSection title="👤 Tên của bạn">
                                <input
                                    value={attendee}
                                    onChange={(e) => setAttendee(e.target.value)}
                                    placeholder="Vui lòng nhập họ và tên..."
                                    className="w-full bg-white border-2 border-pink-200 rounded-lg px-4 py-3 text-rose-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-sm"
                                    required
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* RSVP Options */}
                            <FormSection title="✨ Xác nhận tham dự">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <RadioButton
                                        checked={joinable}
                                        onClick={() => !isSubmitting && setJoinable(true)}
                                        label="🎉 Có, tôi sẽ tham dự"
                                    />
                                    <RadioButton
                                        checked={!joinable}
                                        onClick={() => !isSubmitting && setJoinable(false)}
                                        label="😢 Không thể tham dự"
                                    />
                                </div>
                            </FormSection>

                            {/* Transportation Options - Only show if attending */}
                            {joinable && (
                                <FormSection title="🚗 Phương tiện di chuyển">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {TRANSPORT_OPTIONS.map((item) => (
                                            <RadioButton
                                                key={item.value}
                                                checked={transport === item.value}
                                                onClick={() => !isSubmitting && setTransport(item.value)}
                                                label={item.label}
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
                                    className="w-full bg-white border-2 border-pink-200 rounded-lg px-4 py-3 text-rose-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none text-sm"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* Submit button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!attendee.trim() || isSubmitting}
                                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    'GỬI XÁC NHẬN'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for animations and scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float-simple {
                        0%, 100% {
                            transform: translateY(0px);
                            opacity: 0.2;
                        }
                        50% {
                            transform: translateY(-10px);
                            opacity: 0.4;
                        }
                    }
                    
                    .animate-float-simple {
                        animation: float-simple 4s ease-in-out infinite;
                    }
                    
                    /* Custom scrollbar */
                    .custom-scroll::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .custom-scroll::-webkit-scrollbar-track {
                        background: rgba(255, 192, 203, 0.1);
                        border-radius: 3px;
                    }
                    
                    .custom-scroll::-webkit-scrollbar-thumb {
                        background: rgba(219, 39, 119, 0.3);
                        border-radius: 3px;
                    }
                    
                    .custom-scroll::-webkit-scrollbar-thumb:hover {
                        background: rgba(219, 39, 119, 0.5);
                    }
                    
                    /* Reduce animations on mobile */
                    @media (max-width: 767px) {
                        .animate-float-simple {
                            animation: none;
                        }
                    }
                `
            }} />
        </div>
    );
}