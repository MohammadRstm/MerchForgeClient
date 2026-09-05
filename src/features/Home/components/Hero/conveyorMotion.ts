/**
 * The belt's own physics, pulled out of ConveyorScene so the direction and
 * wrap-around maths can be checked without a running animation frame loop —
 * both because it is easy to get a looping offset backwards, and because this
 * runs inside a canvas/pane sandbox that can suspend requestAnimationFrame
 * entirely, which would otherwise leave this logic completely unverified.
 */

/**
 * Where the track should sit for a given total distance travelled.
 *
 * The track holds several identical copies of the tile set end to end, laid
 * out left to right in DOM order. At offset 0 the first copy sits flush with
 * the stage's left edge. To make cards travel left to right on screen — enter
 * from the left, cross the stage, exit on the right — the track has to slide
 * rightward over time, which means this offset must count up from -setWidth
 * toward 0 and then wrap back to -setWidth, not the other way around: at
 * -setWidth the *second* copy sits where the first one started, with the
 * first copy parked just off-stage to the left, ready to slide into view as
 * the offset rises.
 */
export function beltOffset(distance: number, setWidth: number): number {
    if (setWidth <= 0) return 0;
    const wrapped = ((distance % setWidth) + setWidth) % setWidth;
    return wrapped - setWidth;
}

/** One frame of exponential decay of `current` toward `target`, framerate-independent. */
export function approach(current: number, target: number, ratePerSecond: number, dt: number): number {
    return current + (target - current) * Math.min(Math.max(ratePerSecond * dt, 0), 1);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}
