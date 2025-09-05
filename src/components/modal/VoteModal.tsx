import React, {useCallback, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import type {VoteModalProps} from "../../types";
import {useFormState} from "../../hooks/useFormState.ts";
import {FormSection} from "../FormSection.tsx";
import {RadioButton} from "../button/RadioButton.tsx";
import {TRANSPORT_OPTIONS} from "../constants";
import {FloatingPetals} from "../FloatingPetals.tsx";
import databaseService, { type AttendeeData } from "../../services/databaseService.ts";

export const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        attendee, setAttendee,
        joinable, setJoinable,
        transport, setTransport,
        message, setMessage,
        resetForm
    } = useFormState();

    const handleSubmit = useCallback(async () => {
        // Validate required fields
        if (!attendee.trim()) {
            alert('Vui lòng nhập tên của bạn');
            return;
        }

        setIsSubmitting(true);

        // Format data for Supabase
        const formData: AttendeeData = {
            attendee: attendee.trim(),
            joinable: joinable ? 'Có' : 'Không',
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
                onClose();
            } else {
                console.error('Failed:', result.message);
                alert('⚠ Có lỗi xảy ra: ' + result.message);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('⚠ Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    }, [attendee, transport, message, joinable, resetForm, onClose, navigate]);

    const handleClose = useCallback(() => {
        if (isSubmitting) return; // Prevent close while submitting
        resetForm();
        onClose();
    }, [resetForm, onClose, isSubmitting]);

    // Prevent scroll when modal is open
    useMemo(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Background overlay with glassmorphism effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-pink-300/20 via-purple-300/15 to-rose-300/20 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Floating petals behind modal */}
            <div className="absolute inset-0 pointer-events-none">
                <FloatingPetals count={30} />
            </div>

            {/* Center container with proper positioning */}
            <div className="flex min-h-screen items-start justify-center pt-8 pb-8 px-4">
                {/* Modal content with glassmorphism */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl max-h-[85vh] overflow-hidden">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 text-pink-600 text-2xl font-bold shadow-lg border-2 border-pink-200/50 disabled:opacity-50 hover:scale-110"
                        aria-label="Đóng modal"
                    >
                        ×
                    </button>

                    {/* Header with gradient */}
                    <div className="bg-gradient-to-br from-pink-100/80 via-rose-50/80 to-pink-100/80 backdrop-blur-sm px-8 py-6 rounded-t-3xl border-b border-pink-200/30">
                        <h2 className="text-3xl text-rose-600 text-center font-['Allura'] drop-shadow-sm">
                            Mời mọi người cùng tham dự nha
                        </h2>
                    </div>

                    {/* Form content - scrollable area */}
                    <div className="max-h-[calc(85vh-120px)] overflow-y-auto">
                        <div className="p-8 space-y-6 bg-white/50 backdrop-blur-sm">
                            {/* Attendee Name */}
                            <FormSection title="👤 Tên của bạn">
                                <input
                                    value={attendee}
                                    onChange={(e) => setAttendee(e.target.value)}
                                    placeholder="Vui lòng nhập họ và tên..."
                                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-pink-200/50 rounded-xl px-4 py-3 text-rose-700 placeholder-pink-400 font-light focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/90 text-sm shadow-sm"
                                    required
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* RSVP Options */}
                            <FormSection title="✨ Xác nhận tham dự">
                                <div className="flex flex-col sm:flex-row gap-3">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-pink-200/50 rounded-xl px-4 py-3 text-rose-700 placeholder-pink-400 font-light focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/90 resize-none text-sm shadow-sm"
                                    rows={3}
                                    disabled={isSubmitting}
                                />
                            </FormSection>

                            {/* Submit button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!attendee.trim() || isSubmitting}
                                className="w-full bg-gradient-to-r from-pink-400/90 to-rose-400/90 backdrop-blur-sm hover:from-pink-500/95 hover:to-rose-500/95 text-white px-6 py-3 rounded-full font-light transition-all duration-300 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-white/30 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        ✨ GỬI XÁC NHẬN ✨
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bottom rounded corner fix */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-b-3xl h-2"></div>
                </div>
            </div>

            {/* Additional floating elements for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-gradient-to-r from-pink-300/30 to-purple-300/30 rounded-full backdrop-blur-sm animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 4 + 6}s`
                        }}
                    />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px) rotate(0deg);
                            opacity: 0.3;
                        }
                        50% {
                            transform: translateY(-20px) rotate(180deg);
                            opacity: 0.6;
                        }
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `
            }} />
        </div>
    );
};