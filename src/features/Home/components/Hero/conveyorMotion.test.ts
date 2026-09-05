import { describe, expect, it } from 'vitest';
import { approach, beltOffset, clamp } from './conveyorMotion';

describe('beltOffset', () => {
    const setWidth = 900;

    it('starts one set-width to the left, so the first copy sits flush with the stage', () => {
        expect(beltOffset(0, setWidth)).toBe(-900);
    });

    it('rises toward zero as distance grows, which is what makes cards travel left to right', () => {
        const early = beltOffset(100, setWidth);
        const later = beltOffset(400, setWidth);
        expect(later).toBeGreaterThan(early);
        expect(beltOffset(450, setWidth)).toBe(-450);
    });

    it('wraps back to -setWidth exactly at a full lap, rather than reaching 0', () => {
        // At distance === setWidth the second copy has slid fully into the first
        // copy's start position - visually identical to distance 0, so the wrap
        // must be seamless rather than showing the track flush at offset 0.
        expect(beltOffset(setWidth, setWidth)).toBe(-900);
        expect(beltOffset(setWidth * 2, setWidth)).toBe(-900);
    });

    it('wraps the same way for negative distance, from a hard reverse drag', () => {
        expect(beltOffset(-100, setWidth)).toBe(-100);
        expect(beltOffset(-setWidth, setWidth)).toBe(-900);
    });

    it('parks at -setWidth rather than dividing by zero before the track has any width', () => {
        expect(beltOffset(500, 0)).toBe(0);
    });
});

describe('approach', () => {
    it('moves partway toward the target, not all the way, for a partial frame', () => {
        const result = approach(0, 100, 2, 0.1); // rate*dt = 0.2
        expect(result).toBeCloseTo(20, 5);
    });

    it('never overshoots the target even with a large rate or dt', () => {
        expect(approach(0, 100, 10, 1)).toBe(100);
        expect(approach(200, 100, 10, 1)).toBe(100);
    });

    it('leaves the value unchanged once it has arrived', () => {
        expect(approach(100, 100, 2, 0.1)).toBe(100);
    });
});

describe('clamp', () => {
    it('passes values already inside the range through unchanged', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('caps at each bound', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(15, 0, 10)).toBe(10);
    });
});
