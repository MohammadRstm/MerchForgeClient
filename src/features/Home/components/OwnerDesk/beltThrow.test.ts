import { describe, expect, it } from 'vitest';
import { settleStep, throwRateFromVelocity } from './beltThrow';

/** The belt's own speed in the current layout: 7168px of travel over 72s. */
const BELT = 7168 / 72000;
const MAX = 9;

describe('throwRateFromVelocity', () => {
    it('turns a leftward throw into a faster forward belt', () => {
        // Twice the belt's own speed, leftward.
        const rate = throwRateFromVelocity(-BELT * 2, BELT, MAX);

        expect(rate).toBeCloseTo(2, 5);
    });

    it('runs the belt backwards for a rightward throw', () => {
        const rate = throwRateFromVelocity(BELT * 3, BELT, MAX);

        expect(rate).toBeCloseTo(-3, 5);
    });

    it('is symmetric, so a flick each way is the same speed in opposite directions', () => {
        const left = throwRateFromVelocity(-BELT * 4, BELT, MAX);
        const right = throwRateFromVelocity(BELT * 4, BELT, MAX);

        expect(left).toBeCloseTo(-right, 10);
    });

    /**
     * A hard flick is easily fifty times the belt's speed, and a belt tearing
     * past at 50x is a blur rather than a showcase.
     */
    it('clamps a violent flick in both directions', () => {
        expect(throwRateFromVelocity(-BELT * 200, BELT, MAX)).toBe(MAX);
        expect(throwRateFromVelocity(BELT * 200, BELT, MAX)).toBe(-MAX);
    });

    /**
     * Releasing while holding the belt still should leave it still for an
     * instant and let the settle wind it back up - not snap it to full speed.
     */
    it('returns a standstill, not normal speed, when released without motion', () => {
        // Signed-zero territory: negating 0 yields -0, and toBe would compare
        // that with Object.is. The sign of a zero rate means nothing here.
        expect(throwRateFromVelocity(0, BELT, MAX)).toBeCloseTo(0, 10);
    });

    it('falls back to normal speed rather than dividing by a zero-width belt', () => {
        expect(throwRateFromVelocity(-0.5, 0, MAX)).toBe(1);
        expect(throwRateFromVelocity(Number.NaN, BELT, MAX)).toBe(1);
    });
});

describe('settleStep', () => {
    const TAU = 620;

    it('decays toward 1 by one time constant per tau', () => {
        // After tau, the distance from 1 should be down to 1/e of what it was.
        const rate = settleStep(9, TAU, TAU);

        expect(rate).toBeCloseTo(1 + 8 * Math.exp(-1), 5);
    });

    it('leaves a belt already at normal speed alone', () => {
        expect(settleStep(1, 16, TAU)).toBeCloseTo(1, 10);
    });

    it('converges monotonically without overshooting past 1', () => {
        let rate = 9;
        let previous = Number.POSITIVE_INFINITY;

        for (let frame = 0; frame < 400; frame += 1) {
            rate = settleStep(rate, 16, TAU);
            expect(rate).toBeLessThan(previous);
            expect(rate).toBeGreaterThan(1);
            previous = rate;
        }

        expect(rate).toBeCloseTo(1, 2);
    });

    /** A reversed belt has to come back up through zero to 1, not stall below it. */
    it('brings a reversed belt back up toward normal', () => {
        let rate = -MAX;

        for (let frame = 0; frame < 400; frame += 1) {
            rate = settleStep(rate, 16, TAU);
        }

        expect(rate).toBeCloseTo(1, 2);
    });

    /**
     * The reason this takes dt rather than assuming a frame: on a 144Hz display
     * the loop runs more than twice as often, and a fixed step would settle the
     * throw in less than half the time.
     */
    it('settles over the same wall-clock time regardless of framerate', () => {
        // Both runs cover exactly 1008ms - 144 frames at 7ms against 63 at 16ms.
        // Picking frame sizes that divide the total evenly is the point: an
        // earlier version looped "while elapsed < 1000", which covered 1001ms
        // one way and 1008ms the other and then reported that gap as a
        // framerate dependency it had introduced itself.
        const run = (frameMs: number, frames: number) => {
            let rate = 9;
            for (let frame = 0; frame < frames; frame += 1) {
                rate = settleStep(rate, frameMs, TAU);
            }
            return rate;
        };

        expect(run(7, 144)).toBeCloseTo(run(16, 63), 6);
    });

    it('snaps straight to normal speed if the time constant is meaningless', () => {
        expect(settleStep(9, 16, 0)).toBe(1);
    });
});
