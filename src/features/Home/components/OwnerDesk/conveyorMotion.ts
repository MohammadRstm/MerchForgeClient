/**
 * The screenshot conveyor's physics, pulled out of the component so the
 * direction, wrap-around and depth maths can be checked without a running
 * animation frame loop — both because it is easy to get a looping offset or a
 * falloff curve backwards, and because this runs inside a canvas/pane sandbox
 * that can suspend requestAnimationFrame entirely, which would otherwise
 * leave this logic completely unverified.
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

export function lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t;
}

/** Smoothstep: eases both ends of a 0-1 range instead of changing at a constant rate. */
function smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
}

export interface DepthStyle {
    /** 1 at the centre, MIN_SCALE at and beyond the falloff radius. */
    scale: number;
    /** 1 at the centre, minOpacity at and beyond the falloff radius. */
    opacity: number;
    /**
     * Degrees, signed by which side of centre the tile is on — 0 at the
     * centre, up to maxRotation at the radius. Curves the belt away from the
     * viewer at the edges, the way a physical film strip or coverflow does,
     * rather than just shrinking flat rectangles.
     */
    rotateY: number;
    /** 0 at the centre, up to maxBlur (px) at and beyond the radius — a shallow depth of field, not a focal one. */
    blur: number;
}

export interface DepthConfig {
    /** Distance from centre, in px, at which a tile has fully reached its minimum state. */
    radius: number;
    minScale: number;
    minOpacity: number;
    maxRotation: number;
    maxBlur: number;
}

/**
 * The belt's signature effect: small -> medium -> large -> medium -> small as
 * a tile crosses the centre of the stage. `signedDistance` is the tile's
 * centre minus the stage's centre, in px — negative to the left, positive to
 * the right — so the sign is what lets the two sides rotate to face the
 * centre instead of both leaning the same way.
 */
export function depthForOffset(signedDistance: number, config: DepthConfig): DepthStyle {
    const t = clamp(1 - Math.abs(signedDistance) / Math.max(config.radius, 1), 0, 1);
    const eased = smoothstep(t);
    const direction = Math.sign(signedDistance);

    return {
        scale: lerp(config.minScale, 1, eased),
        opacity: lerp(config.minOpacity, 1, eased),
        // A tile to the right (positive distance) tilts its left edge toward the
        // viewer as it recedes, and the mirror for the left side - the two
        // converge toward the centre rather than both tilting the same way.
        rotateY: -direction * config.maxRotation * (1 - eased),
        blur: lerp(config.maxBlur, 0, eased),
    };
}
