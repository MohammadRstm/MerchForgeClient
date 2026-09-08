/**
 * The two calculations behind throwing the conveyor belt, kept out of the
 * component so they can be checked directly.
 *
 * That separation is not ceremony here. Both of these are functions of elapsed
 * time, and the only place they can be exercised end to end is a browser - but
 * the preview pane this project is developed against throttles timers savagely
 * (a requested 20ms came back as 228ms and then 993ms) and never fires
 * requestAnimationFrame at all. A flick simulated there is measured as roughly
 * fiftieth of its intended speed and the settle loop never runs a single step,
 * so the behaviour would go out unverified. As plain functions of numbers, both
 * are testable without a clock that works.
 */

/**
 * Turns the pointer's parting velocity into a playback rate for the belt.
 *
 * Advancing the animation clock carries cards to the left, so a leftward throw
 * (negative velocity) has to become a positive rate and a rightward one runs
 * the belt in reverse - hence the negation. Dividing by the belt's own speed is
 * what makes the result a multiple of normal rather than an absolute: throw
 * twice as fast as the belt travels and you get exactly 2.
 *
 * A velocity of zero returns zero, not one. Releasing while holding the belt
 * still should leave it still for an instant and let it wind back up, which is
 * what the settle below then does; snapping straight to full speed would feel
 * like the belt was yanked out of the hand.
 */
export function throwRateFromVelocity(
    velocityPxPerMs: number,
    beltPxPerMs: number,
    maxRate: number,
): number {
    if (!Number.isFinite(velocityPxPerMs) || beltPxPerMs <= 0) return 1;

    const thrown = -velocityPxPerMs / beltPxPerMs;

    return Math.max(-maxRate, Math.min(maxRate, thrown));
}

/**
 * One frame of easing the playback rate back toward 1.
 *
 * Exponential rather than linear, so most of the throw is spent quickly and the
 * last of it drifts in - which is how something with mass slows down. Written
 * against the elapsed time of the frame rather than assuming a fixed step, so
 * the settle takes the same wall-clock time on a 60Hz display as on a 144Hz one
 * instead of finishing twice as fast.
 */
export function settleStep(currentRate: number, dtMs: number, tauMs: number): number {
    if (tauMs <= 0) return 1;

    return 1 + (currentRate - 1) * Math.exp(-Math.max(dtMs, 0) / tauMs);
}
