import { useEffect, useRef, useState } from "react";

/** How many recent amplitude samples are kept — sets the width of the waveform. */
const WAVEFORM_LENGTH = 40;
const SAMPLE_INTERVAL_MS = 80;

/**
 * Wraps MediaRecorder so the chat hook deals in "a recording finished, here is a
 * Blob" rather than in browser media APIs.
 *
 * Recording is optional: not every browser exposes MediaRecorder and the user may
 * refuse microphone access, so unsupported and denied are reported as state instead
 * of throwing — the owner can always type instead.
 *
 * Alongside the recorder, this also runs a live amplitude meter (Web Audio API)
 * while recording, so the composer can show the owner their actual voice — a
 * scrolling waveform, not just a spinner promising something is happening.
 */
const useVoiceRecorder = (onRecorded: (audio: Blob) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [waveform, setWaveform] = useState<number[]>([]);
    const [elapsedMs, setElapsedMs] = useState(0);

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    // Set right before a discard-stop, so the onstop handler that same stop()
    // call triggers knows to throw the audio away instead of handing it to
    // onRecorded — the recording still needs the browser's own stop sequence
    // (flushing the last chunk, releasing the mic) to run either way.
    const discardNextRef = useRef(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);
    const lastSampleAtRef = useRef(0);
    const startedAtRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isSupported =
        typeof window !== "undefined" &&
        typeof window.MediaRecorder !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia);

    const stopMeter = () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        analyserRef.current = null;

        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
        }

        if (timerRef.current != null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const start = async () => {
        setError(undefined);
        setWaveform([]);
        setElapsedMs(0);

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
                stopMeter();

                // Tracks are stopped explicitly, otherwise the browser keeps showing
                // the microphone as in use after recording ends.
                stream.getTracks().forEach((track) => track.stop());

                const audio = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
                chunksRef.current = [];

                if (discardNextRef.current) {
                    discardNextRef.current = false;
                    return;
                }

                if (audio.size > 0) onRecorded(audio);
            };

            recorder.start();
            recorderRef.current = recorder;
            setIsRecording(true);

            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const samples = new Uint8Array(analyser.frequencyBinCount);
            lastSampleAtRef.current = 0;

            const tick = (time: number) => {
                if (!analyserRef.current) return;

                if (time - lastSampleAtRef.current >= SAMPLE_INTERVAL_MS) {
                    lastSampleAtRef.current = time;
                    analyserRef.current.getByteTimeDomainData(samples);

                    // Root-mean-square of the waveform around its 128 midpoint —
                    // a steady, low-noise stand-in for "how loud is this instant."
                    let sumSquares = 0;
                    for (let i = 0; i < samples.length; i++) {
                        const normalized = (samples[i] - 128) / 128;
                        sumSquares += normalized * normalized;
                    }
                    const rms = Math.sqrt(sumSquares / samples.length);
                    const level = Math.min(1, rms * 4);

                    setWaveform((prev) => [...prev.slice(-(WAVEFORM_LENGTH - 1)), level]);
                }

                rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);

            startedAtRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setElapsedMs(Date.now() - startedAtRef.current);
            }, 200);
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

    /**
     * Stops recording the same way stop() does, but throws the result away
     * instead of handing it to onRecorded — for when the owner abandons the
     * conversation (closes the modal, discards the draft) mid-recording, where
     * sending what they were saying would mean processing (and spending a
     * credit on) a turn for a draft that no longer exists.
     */
    const cancel = () => {
        if (!recorderRef.current) return;

        discardNextRef.current = true;
        recorderRef.current.stop();
        recorderRef.current = null;
        setIsRecording(false);
    };

    // Safety net for any unmount that isn't routed through cancel() first (a
    // parent closing without calling it, React discarding the component
    // outright) — otherwise the mic stays live and the browser keeps showing it
    // as in use for as long as the underlying MediaRecorder is never stopped.
    useEffect(() => {
        return () => {
            if (recorderRef.current) {
                discardNextRef.current = true;
                recorderRef.current.stop();
            }
        };
    }, []);

    return { isSupported, isRecording, error, start, stop, cancel, waveform, elapsedMs };
};

export default useVoiceRecorder;
