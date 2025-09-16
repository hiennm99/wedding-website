import {useCallback, useState} from "react";
import type {FormState} from "../types";

export const useFormState = (): FormState => {
    const [attendee, setAttendee] = useState<string>("");
    const [joinable, setJoinable] = useState<boolean>(true);
    const [hasRelative, setHasRelative] = useState<boolean>(false);
    const [transport, setTransport] = useState<string>('bus');
    const [message, setMessage] = useState<string>('');

    const resetForm = useCallback(() => {
        setAttendee("");
        setJoinable(true);
        setHasRelative(false);
        setTransport('bus');  // Changed from 'car' to 'bus' to match initial state
        setMessage('');
    }, []);

    return {
        attendee, setAttendee,
        joinable, setJoinable,
        hasRelative, setHasRelative,  // Make sure this matches the destructuring
        transport, setTransport,
        message, setMessage,
        resetForm
    };
};