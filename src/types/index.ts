// Types
export interface TransportOption {
    value: string;
    label: string;
}

export interface FormState {
    attendee: string;
    setAttendee: (value: string) => void;
    joinable: boolean;
    setJoinable: (value: boolean) => void;
    transport: string;
    setTransport: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
    resetForm: () => void;
}

export interface RadioButtonProps {
    checked: boolean;
    onClick: () => void;
    label: string;
    disabled?: boolean; // Thêm prop này
}

export interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export interface VoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface CircularImageProps {
    src: string;
    alt: string;
    size?: string;
    className?: string;
    objectPosition?: string; // Thêm dòng này
}

export interface HeaderProps {
    onOpenModal: () => void;
}

export interface AttendeeData {
    attendee: string;
    joinable: string;
    transport: string;
    message: string;
}

export interface AirtableRecord {
    fields: {
        Attendee: string;
        Joinable: string;
        Transport: string;
        Message: string;
    };
}

export interface AirtablePayload {
    records: AirtableRecord[];
}