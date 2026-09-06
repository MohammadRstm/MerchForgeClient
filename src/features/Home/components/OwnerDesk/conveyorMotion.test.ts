import { describe, expect, it } from 'vitest';
import { approach, beltOffset, clamp, depthForOffset, lerp } from './conveyorMotion';

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

describe('lerp', () => {
    it('interpolates linearly between two values', () => {
        expect(lerp(0, 100, 0.5)).toBe(50);
        expect(lerp(10, 20, 0)).toBe(10);
        expect(lerp(10, 20, 1)).toBe(20);
    });
});

describe('depthForOffset', () => {
    const config = { radius: 400, minScale: 0.6, minOpacity: 0.4, maxRotation: 30, maxBlur: 3 };

    it('is at full size, full opacity, unrotated and unblurred exactly at the centre', () => {
        const style = depthForOffset(0, config);
        expect(style.scale).toBe(1);
        expect(style.opacity).toBe(1);
        // Signed-zero territory (Math.sign(0) negated) - assert the value rather
        // than its sign bit, which has no visible effect on the CSS anyway.
        expect(style.rotateY).toBeCloseTo(0, 10);
        expect(style.blur).toBe(0);
    });

    it('reaches the minimum state at and beyond the falloff radius', () => {
        expect(depthForOffset(400, config).scale).toBeCloseTo(config.minScale, 5);
        expect(depthForOffset(1000, config).scale).toBeCloseTo(config.minScale, 5);
        expect(depthForOffset(1000, config).opacity).toBeCloseTo(config.minOpacity, 5);
        expect(depthForOffset(1000, config).blur).toBeCloseTo(config.maxBlur, 5);
    });

    it('shrinks monotonically as distance from centre grows - this is the small -> medium -> large -> medium -> small effect', () => {
        const near = depthForOffset(50, config).scale;
        const mid = depthForOffset(200, config).scale;
        const far = depthForOffset(350, config).scale;
        expect(near).toBeGreaterThan(mid);
        expect(mid).toBeGreaterThan(far);
    });

    it('treats equal distances on either side identically for scale, opacity and blur', () => {
        const left = depthForOffset(-150, config);
        const right = depthForOffset(150, config);
        expect(left.scale).toBeCloseTo(right.scale, 10);
        expect(left.opacity).toBeCloseTo(right.opacity, 10);
        expect(left.blur).toBeCloseTo(right.blur, 10);
    });

    it('rotates the two sides in opposite directions, so they face the centre rather than both leaning one way', () => {
        const left = depthForOffset(-150, config);
        const right = depthForOffset(150, config);
        expect(left.rotateY).toBeGreaterThan(0);
        expect(right.rotateY).toBeLessThan(0);
        expect(left.rotateY).toBeCloseTo(-right.rotateY, 10);
    });

    it('never divides by zero when the configured radius is 0', () => {
        const style = depthForOffset(50, { ...config, radius: 0 });
        expect(Number.isFinite(style.scale)).toBe(true);
        expect(style.scale).toBeCloseTo(config.minScale, 5);
    });
});
