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

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            const scrollY = window.scrollY;

            // Prevent background scroll
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                // Restore scroll position when modal closes
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.documentElement.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Background overlay */}
            <div
                className={`absolute inset-0 ${
                    isMobile
                        ? 'bg-black/50'
                        : 'bg-gradient-to-br from-pink-300/20 via-purple-300/15 to-rose-300/20 backdrop-blur-sm'
                }`}
                onClick={handleClose}
            />

            {/* Floating petals - only on desktop */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                    <FloatingPetals count={6} />
                </div>
            )}

            {/* Modal container with its own scroll */}
            <div className="absolute inset-0 flex items-start justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl my-auto">
                    {/* Modal content */}
                    <div className={`relative w-full rounded-2xl shadow-xl border ${
                        isMobile
                            ? 'bg-white border-gray-200'
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

                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100 rounded-t-2xl">
                            <h2 className="text-2xl text-rose-600 text-center font-semibold">
                                Mời mọi người cùng tham dự nha
                            </h2>
                        </div>

                        {/* Form content */}
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

            {/* CSS for animations */}
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
                    
                    /* Reduce animations on mobile */
                    @media (max-width: 767px) {
                        .animate-float-simple {
                            animation: none;
                        }
                    }

                    /* Custom scrollbar for modal */
                    .absolute.inset-0.overflow-y-auto::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .absolute.inset-0.overflow-y-auto::-webkit-scrollbar-track {
                        background: rgba(255, 192, 203, 0.1);
                        border-radius: 3px;
                    }
                    
                    .absolute.inset-0.overflow-y-auto::-webkit-scrollbar-thumb {
                        background: rgba(219, 39, 119, 0.3);
                        border-radius: 3px;
                    }
                    
                    .absolute.inset-0.overflow-y-auto::-webkit-scrollbar-thumb:hover {
                        background: rgba(219, 39, 119, 0.5);
                    }

                    /* Ensure modal can scroll on mobile */
                    @media (max-height: 640px) {
                        .flex.min-h-full.items-center {
                            align-items: flex-start;
                            padding-top: 2rem;
                            padding-bottom: 2rem;
                        }
                    }
                `
            }} />
        </div>
    );
}