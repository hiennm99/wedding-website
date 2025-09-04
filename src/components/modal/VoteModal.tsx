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
                alert('❌ Có lỗi xảy ra: ' + result.message);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('❌ Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <FloatingPetals count={50} />
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="sticky top-4 right-4 ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 transition-colors z-10 text-pink-600 text-xl disabled:opacity-50"
                    aria-label="Đóng modal"
                >
                    ×
                </button>

                <div className="bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 px-8 py-6 rounded-t-3xl">
                    <h2 className="text-3xl text-rose-600 text-center font-['Allura']">
                        Mời mọi người cùng tham dự nha
                    </h2>
                </div>

                <div className="p-8 space-y-6">
                    {/* Attendee Name */}
                    <FormSection title="👤 Tên của bạn">
                        <input
                            value={attendee}
                            onChange={(e) => setAttendee(e.target.value)}
                            placeholder="Vui lòng nhập họ và tên..."
                            className="w-full bg-white border-2 border-pink-200 rounded-xl px-4 py-3 text-rose-700 placeholder-pink-400 font-light focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
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
                            className="w-full bg-white border-2 border-pink-200 rounded-xl px-4 py-3 text-rose-700 placeholder-pink-400 font-light focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none text-sm"
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </FormSection>

                    <button
                        onClick={handleSubmit}
                        disabled={!attendee.trim() || isSubmitting}
                        className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-6 py-3 rounded-full font-light transition-all duration-300 tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
        </div>
    );
};