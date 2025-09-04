import {useCallback, useState} from "react";
import type {FormState} from "../types";

export const useFormState = (): FormState => {
    const [attendee, setAttendee] = useState<string>("");
    const [joinable, setJoinable] = useState<boolean>(true);
    const [transport, setTransport] = useState<string>('bus');
    const [message, setMessage] = useState<string>('');

    const resetForm = useCallback(() => {
        setAttendee("");
        setJoinable(true);
        setTransport('car');
        setMessage('');
    }, []);

    return {
        attendee, setAttendee,
        joinable, setJoinable,
        transport, setTransport,
        message, setMessage,
        resetForm
    };
};