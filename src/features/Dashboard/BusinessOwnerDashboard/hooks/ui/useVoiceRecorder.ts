import { useRef, useState } from "react";

/**
 * Wraps MediaRecorder so the chat hook deals in "a recording finished, here is a
 * Blob" rather than in browser media APIs.
 *
 * Recording is optional: not every browser exposes MediaRecorder and the user may
 * refuse microphone access, so unsupported and denied are reported as state instead
 * of throwing — the owner can always type instead.
 */
const useVoiceRecorder = (onRecorded: (audio: Blob) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const isSupported =
        typeof window !== "undefined" &&
        typeof window.MediaRecorder !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia);

    const start = async () => {
        setError(undefined);

        if (!isSupported) {
            setError("Voice recording isn't supported in this browser.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                // Tracks are stopped explicitly, otherwise the browser keeps showing
                // the microphone as in use after recording ends.
                stream.getTracks().forEach((track) => track.stop());

                const audio = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
                chunksRef.current = [];

                if (audio.size > 0) onRecorded(audio);
            };

            recorder.start();
            recorderRef.current = recorder;
            setIsRecording(true);
        } catch {
            // Covers a denied permission prompt and a missing microphone alike; the
            // owner just needs to know to type instead.
            setError("Couldn't access the microphone.");
            setIsRecording(false);
        }
    };

    const stop = () => {
        recorderRef.current?.stop();
        recorderRef.current = null;
        setIsRecording(false);
    };

    return { isSupported, isRecording, error, start, stop };
};

export default useVoiceRecorder;
