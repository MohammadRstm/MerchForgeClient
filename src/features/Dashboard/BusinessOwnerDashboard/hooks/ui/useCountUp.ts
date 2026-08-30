import { useEffect, useRef, useState } from "react";

const DURATION_MS = 700;

/** Animates from the previous value to `target` on every change — a subtle entrance for KPI numbers, not a gimmick that runs on every render. */
const useCountUp = (target: number) => {
    const [value, setValue] = useState(target);
    const fromRef = useRef(target);
    const frameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const from = fromRef.current;
        const delta = target - from;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - start) / DURATION_MS, 1);
            // easeOutCubic — fast start, gentle settle, matches the rest of the dashboard's transitions.
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(from + delta * eased);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            } else {
                fromRef.current = target;
            }
        };

        frameRef.current = requestAnimationFrame(tick);
        return () => {
            if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
        };
    }, [target]);

    return value;
};

export default useCountUp;
