/**
 * The hero's background mesh.
 *
 * Deliberately not the usual particle demo. The familiar version is Brownian:
 * dots bounce off the walls, lines appear whenever two happen to pass close, and
 * nothing means anything. This one drifts calmly and periodically *does work* —
 * a node fires, a signal travels its links to neighbours, those fire in turn for
 * a few generations, and the wave decays. That is the product's own story (one
 * input, many generated outputs) rather than decoration bolted onto it.
 *
 * Framework-free on purpose: React owns the element and the lifecycle, this owns
 * the pixels. Keeping the simulation out of a component also keeps it readable
 * as a simulation.
 */

export type Rgb = readonly [number, number, number];

export interface HeroNetworkColors {
    /** The mesh itself. Read from --mf-text, drawn at very low alpha. */
    ink: Rgb;
    /** Signals only, never the mesh. Read from --mf-accent. */
    accent: Rgb;
}

export interface HeroNetwork {
    /** Pause when off-screen or on a hidden tab. Idempotent. */
    setRunning(running: boolean): void;
    destroy(): void;
}

/** How far apart two nodes can be and still be linked, in CSS px. */
const LINK_DISTANCE = 116;

/** One node per this many square px, so density holds across viewport sizes. */
const AREA_PER_NODE = 6_800;
const MIN_NODES = 48;
const MAX_NODES = 156;

/** Retina is worth it for hairlines; beyond 2x is not worth the fill rate. */
const MAX_DPR = 2;

const MAX_PULSES = 44;
/** A firing node lights at most this many neighbours, so a wave fans out rather than floods. */
const MAX_BRANCHES = 2;
/** Hops before a wave dies. Four crosses the field without ever saturating it. */
const MAX_GENERATIONS = 4;

const POINTER_RADIUS = 190;
/** Peak px of pointer-driven drift, at the nearest depth. Small on purpose. */
const POINTER_PARALLAX = 14;

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    /** 0 = far (small, dim, slow), 1 = near. Drives size, alpha, speed, parallax. */
    depth: number;
    /** Transient brightness from a signal arriving, decays each frame. */
    charge: number;
}

interface Pulse {
    from: number;
    to: number;
    /** Progress along the edge, 0..1. */
    t: number;
    speed: number;
    generation: number;
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Creates and starts the simulation. The canvas is sized from its own client box,
 * so layout stays entirely CSS's problem.
 */
export function createHeroNetwork(
    canvas: HTMLCanvasElement,
    colors: HeroNetworkColors,
    options: { reducedMotion?: boolean } = {},
): HeroNetwork {
    const context = canvas.getContext('2d', { alpha: true });

    // A canvas with no 2D context is a browser without canvas support. The hero
    // is fully readable without this, so failing quietly is the right answer.
    if (!context) {
        return { setRunning: () => {}, destroy: () => {} };
    }

    const ctx = context;
    const reducedMotion = options.reducedMotion ?? false;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let frame = 0;
    let running = false;
    let destroyed = false;

    // Rendered positions, recomputed once per frame. Links, signals and nodes all
    // read these so pointer parallax cannot desynchronise them.
    let renderX: Float32Array = new Float32Array(0);
    let renderY: Float32Array = new Float32Array(0);

    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;
    /** Normalised -1..1 from the centre, eased toward the real pointer each frame. */
    let tiltX = 0;
    let tiltY = 0;

    let nextFireAt = 0;

    // ---- spatial grid -------------------------------------------------------
    // Linking every pair is O(n²) and, in the version this replaces, also drew
    // each edge twice. Bucketing by link distance means only the neighbouring
    // cells are ever compared, and the cell walk below visits each pair once.
    let cols = 0;
    let rows = 0;
    let buckets: number[][] = [];

    function buildGrid() {
        cols = Math.max(1, Math.ceil(width / LINK_DISTANCE));
        rows = Math.max(1, Math.ceil(height / LINK_DISTANCE));
        buckets = Array.from({ length: cols * rows }, () => []);
    }

    function fillGrid() {
        for (let i = 0; i < buckets.length; i++) buckets[i].length = 0;

        for (let i = 0; i < nodes.length; i++) {
            const cx = Math.min(cols - 1, Math.max(0, Math.floor(renderX[i] / LINK_DISTANCE)));
            const cy = Math.min(rows - 1, Math.max(0, Math.floor(renderY[i] / LINK_DISTANCE)));
            buckets[cy * cols + cx].push(i);
        }
    }

    // ---- setup --------------------------------------------------------------

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const rect = canvas.getBoundingClientRect();

        width = Math.max(1, Math.round(rect.width));
        height = Math.max(1, Math.round(rect.height));

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        buildGrid();
    }

    function seed() {
        const target = Math.round((width * height) / AREA_PER_NODE);
        const count = Math.min(MAX_NODES, Math.max(MIN_NODES, target));

        nodes = new Array(count);

        for (let i = 0; i < count; i++) {
            // Cubed so most nodes sit far back and only a few read as foreground.
            // An even spread across depths just looks like noise at two sizes.
            const depth = Math.pow(Math.random(), 3);
            const speed = lerp(0.05, 0.16, depth);
            const angle = Math.random() * Math.PI * 2;

            nodes[i] = {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                depth,
                charge: 0,
            };
        }

        renderX = new Float32Array(count);
        renderY = new Float32Array(count);
        pulses = [];
    }

    // ---- signals ------------------------------------------------------------

    /** Neighbours within link distance. O(n), but only ever on an actual firing. */
    function neighboursOf(index: number, exclude: number): number[] {
        const found: number[] = [];
        const ox = renderX[index];
        const oy = renderY[index];

        for (let i = 0; i < nodes.length; i++) {
            if (i === index || i === exclude) continue;

            const dx = renderX[i] - ox;
            const dy = renderY[i] - oy;

            if (dx * dx + dy * dy < LINK_DISTANCE * LINK_DISTANCE) found.push(i);
        }

        return found;
    }

    function fire(index: number, from: number, generation: number) {
        if (generation > MAX_GENERATIONS || pulses.length >= MAX_PULSES) return;

        const candidates = neighboursOf(index, from);
        if (candidates.length === 0) return;

        // Shuffle-free pick: walk from a random offset so branches vary without
        // sorting or allocating a shuffled copy every firing.
        const start = Math.floor(Math.random() * candidates.length);
        const branches = Math.min(MAX_BRANCHES, candidates.length);

        for (let n = 0; n < branches; n++) {
            if (pulses.length >= MAX_PULSES) break;

            pulses.push({
                from: index,
                to: candidates[(start + n) % candidates.length],
                t: 0,
                speed: lerp(0.014, 0.024, Math.random()),
                generation,
            });
        }
    }

    // ---- drawing ------------------------------------------------------------

    function draw() {
        const [ir, ig, ib] = colors.ink;
        const [ar, ag, ab] = colors.accent;

        ctx.clearRect(0, 0, width, height);

        // Links. Drawn first so nodes and signals sit above the mesh.
        ctx.lineWidth = 1;

        for (let cy = 0; cy < rows; cy++) {
            for (let cx = 0; cx < cols; cx++) {
                const cellNodes = buckets[cy * cols + cx];
                if (cellNodes.length === 0) continue;

                // Same cell, forward pairs only; then four of the eight
                // neighbours. Between them every pair is considered exactly once.
                for (let a = 0; a < cellNodes.length; a++) {
                    for (let b = a + 1; b < cellNodes.length; b++) {
                        linkPair(cellNodes[a], cellNodes[b], ir, ig, ib);
                    }
                }

                for (const [ox, oy] of FORWARD_CELLS) {
                    const nx = cx + ox;
                    const ny = cy + oy;
                    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;

                    const other = buckets[ny * cols + nx];

                    for (const i of cellNodes) {
                        for (const j of other) linkPair(i, j, ir, ig, ib);
                    }
                }
            }
        }

        // Signals.
        for (const pulse of pulses) {
            const fx = renderX[pulse.from];
            const fy = renderY[pulse.from];
            const tx = renderX[pulse.to];
            const ty = renderY[pulse.to];

            const headX = lerp(fx, tx, pulse.t);
            const headY = lerp(fy, ty, pulse.t);
            const tailT = Math.max(0, pulse.t - 0.32);
            const tailX = lerp(fx, tx, tailT);
            const tailY = lerp(fy, ty, tailT);

            // Fades in and out across its run so signals never pop into being.
            const life = Math.sin(pulse.t * Math.PI);
            const strength = life * (1 - (pulse.generation - 1) / (MAX_GENERATIONS + 1));

            const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
            gradient.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0)`);
            gradient.addColorStop(1, `rgba(${ar}, ${ag}, ${ab}, ${0.85 * strength})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(headX, headY);
            ctx.stroke();

            // Head. Two arcs rather than shadowBlur, which costs far more than
            // it is worth at this size.
            ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${0.16 * strength})`;
            ctx.beginPath();
            ctx.arc(headX, headY, 5.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${0.95 * strength})`;
            ctx.beginPath();
            ctx.arc(headX, headY, 1.7, 0, Math.PI * 2);
            ctx.fill();
        }

        // Nodes.
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const radius = lerp(0.75, 2.1, node.depth) + node.charge * 1.5;
            const alpha = lerp(0.30, 0.68, node.depth) + node.charge * 0.4;

            ctx.beginPath();
            ctx.arc(renderX[i], renderY[i], radius, 0, Math.PI * 2);

            if (node.charge > 0.01) {
                // A node that just received a signal carries the accent briefly,
                // then settles back to ink.
                ctx.fillStyle = `rgba(${lerp(ir, ar, node.charge)}, ${lerp(ig, ag, node.charge)}, ${lerp(ib, ab, node.charge)}, ${Math.min(1, alpha)})`;
            } else {
                ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, ${alpha})`;
            }

            ctx.fill();
        }
    }

    function linkPair(i: number, j: number, ir: number, ig: number, ib: number) {
        const dx = renderX[j] - renderX[i];
        const dy = renderY[j] - renderY[i];
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared >= LINK_DISTANCE * LINK_DISTANCE) return;

        const distance = Math.sqrt(distanceSquared);
        const closeness = 1 - distance / LINK_DISTANCE;
        const depth = (nodes[i].depth + nodes[j].depth) / 2;
        const charged = Math.max(nodes[i].charge, nodes[j].charge);

        // Quadratic falloff. Linear leaves a visible disc of lines around every
        // node; squaring it lets the mesh dissolve instead of ending.
        const alpha = closeness * closeness * lerp(0.16, 0.38, depth) + charged * 0.12;
        if (alpha < 0.004) return;

        ctx.strokeStyle = `rgba(${ir}, ${ig}, ${ib}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(renderX[i], renderY[i]);
        ctx.lineTo(renderX[j], renderY[j]);
        ctx.stroke();
    }

    // ---- frame --------------------------------------------------------------

    function step(now: number) {
        // Ease the tilt rather than tracking the pointer directly, so the field
        // glides instead of snapping.
        const targetTiltX = pointerActive ? (pointerX / width) * 2 - 1 : 0;
        const targetTiltY = pointerActive ? (pointerY / height) * 2 - 1 : 0;
        tiltX += (targetTiltX - tiltX) * 0.045;
        tiltY += (targetTiltY - tiltY) * 0.045;

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            node.x += node.vx;
            node.y += node.vy;

            // Wrapping, not bouncing. Bouncing collects nodes along the edges and
            // reads as an aquarium; the mask fades the borders out anyway, so a
            // wrap is never visible.
            const margin = LINK_DISTANCE;
            if (node.x < -margin) node.x = width + margin;
            if (node.x > width + margin) node.x = -margin;
            if (node.y < -margin) node.y = height + margin;
            if (node.y > height + margin) node.y = -margin;

            node.charge *= 0.94;

            const parallax = POINTER_PARALLAX * node.depth;
            renderX[i] = node.x - tiltX * parallax;
            renderY[i] = node.y - tiltY * parallax;
        }

        // Pointer proximity lifts nodes gently, the way the cursor finding a live
        // region should feel. No push, no repulsion — those read as a toy.
        if (pointerActive) {
            for (let i = 0; i < nodes.length; i++) {
                const dx = renderX[i] - pointerX;
                const dy = renderY[i] - pointerY;
                const distanceSquared = dx * dx + dy * dy;

                if (distanceSquared < POINTER_RADIUS * POINTER_RADIUS) {
                    const closeness = 1 - Math.sqrt(distanceSquared) / POINTER_RADIUS;
                    nodes[i].charge = Math.max(nodes[i].charge, closeness * 0.42);
                }
            }
        }

        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];
            pulse.t += pulse.speed;

            if (pulse.t >= 1) {
                nodes[pulse.to].charge = 1;
                fire(pulse.to, pulse.from, pulse.generation + 1);
                pulses.splice(i, 1);
            }
        }

        if (now >= nextFireAt) {
            fire(Math.floor(Math.random() * nodes.length), -1, 1);
            nextFireAt = now + 900 + Math.random() * 1800;
        }

        fillGrid();
        draw();
    }

    // Clearing `frame` on the way out is what lets setRunning tell a live chain
    // from a dead one. Leaving a stale handle there instead is the subtle way
    // this breaks: a restart sees a non-zero handle, assumes the chain is
    // running, and the canvas stays frozen with no way back.
    function loop(now: number) {
        if (destroyed || !running) {
            frame = 0;
            return;
        }

        step(now);
        frame = requestAnimationFrame(loop);
    }

    /** One frame, no motion — what a reduced-motion visitor gets. */
    function renderStill() {
        for (let i = 0; i < nodes.length; i++) {
            renderX[i] = nodes[i].x;
            renderY[i] = nodes[i].y;
        }
        fillGrid();
        draw();
    }

    // ---- events -------------------------------------------------------------

    const onPointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        pointerActive = true;
    };

    const onPointerLeave = () => {
        pointerActive = false;
    };

    const resizeObserver = new ResizeObserver(() => {
        const previous = { width, height };
        resize();

        // Re-seeding on every resize throws away the whole field; a browser
        // window being dragged would restart it continuously. Only a real change
        // in area justifies it.
        const changed =
            Math.abs(previous.width - width) > 80 || Math.abs(previous.height - height) > 80;

        if (changed || nodes.length === 0) {
            seed();
        }

        if (reducedMotion) renderStill();
    });

    resize();
    seed();
    resizeObserver.observe(canvas);

    if (reducedMotion) {
        renderStill();
    } else {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        canvas.addEventListener('pointerleave', onPointerLeave);
    }

    return {
        setRunning(next: boolean) {
            if (reducedMotion || destroyed) return;
            running = next;

            if (running) {
                // Guarded on the handle rather than on `next !== running`, so a
                // chain that stopped for any reason can always be restarted.
                // Comparing the flags instead would make a dead chain permanent.
                if (!frame) {
                    nextFireAt = performance.now() + 400;
                    frame = requestAnimationFrame(loop);
                }
            } else if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        },

        destroy() {
            destroyed = true;
            if (frame) cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerleave', onPointerLeave);
        },
    };
}

/**
 * Half the neighbourhood. Combined with forward-only pairs inside a cell, every
 * pair of nodes is compared exactly once per frame.
 */
const FORWARD_CELLS: ReadonlyArray<readonly [number, number]> = [
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];
