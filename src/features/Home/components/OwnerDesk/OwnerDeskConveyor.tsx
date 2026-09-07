import { useEffect, useRef } from 'react';
import { approach, beltOffset, depthForOffset, type DepthConfig } from './conveyorMotion';
import RevenueChart from '../../../../assets/Landing/Landing__OwnerDesk__revenue-chart.png';
import CategoryPerformance from '../../../../assets/Landing/Landing__OwnerDesk__category-performance.png';
import InventoryHealth from '../../../../assets/Landing/Landing__OwnerDesk__inventory-health.png';
import ProductSneaker from '../../../../assets/Landing/Landing__OwnerDesk__product-sneaker.png';
import ProductBlouse from '../../../../assets/Landing/Landing__OwnerDesk__product-blouse.png';
import ProductCamiSet from '../../../../assets/Landing/Landing__OwnerDesk__product-cami-set.png';
import ProductBikini from '../../../../assets/Landing/Landing__OwnerDesk__product-bikini.png';
import TemplateVineta from '../../../../assets/Landing/Landing__OwnerDesk__template-vineta.png';
import TemplateVinetaStyle1 from '../../../../assets/Landing/Landing__OwnerDesk__template-vineta-style1.png';

/**
 * Real captures from a live MerchForge dashboard (Urban Thread Co.'s Fashion-01
 * account), not an illustration of one — the opposite choice from the rail-and-
 * panels mockup this replaces. Each image is a card taken straight out of the
 * Overview and Products pages, plus two storefront template previews from the
 * website picker.
 */
const TILES = [
    { src: RevenueChart, alt: 'The Revenue Overview chart from a real MerchForge dashboard' },
    { src: ProductSneaker, alt: 'A sneaker product card from a real MerchForge catalog, with its price and stock' },
    { src: CategoryPerformance, alt: 'Real revenue split by category, Shoes and Shirts, from a MerchForge dashboard' },
    { src: ProductBlouse, alt: 'A blouse product card from a real MerchForge catalog, with reviews and units sold' },
    { src: TemplateVineta, alt: 'A storefront template preview from the MerchForge template picker' },
    { src: ProductCamiSet, alt: 'A cami and shorts set product card from a real MerchForge catalog' },
    { src: InventoryHealth, alt: 'A real Inventory Health card from a MerchForge dashboard' },
    { src: ProductBikini, alt: 'A product card from a real MerchForge catalog, with its sales trend' },
    { src: TemplateVinetaStyle1, alt: 'A second storefront template preview from the MerchForge template picker' },
];

/** Laps the belt needs before content repeats, so the falloff never runs past the edge of the track. */
const LAPS = 3;

/** Steady drift — slow enough to actually read a screenshot as it takes the centre. */
const BASE_SPEED = 34;

/** How quickly a fresh mount settles into its resting speed. */
const RECOVERY_PER_SECOND = 1.6;

/** How far either side of centre a tile still shows any life, before dropping to the floor state. */
const FALLOFF_RADIUS = 380;

const DEPTH: DepthConfig = { radius: FALLOFF_RADIUS, minScale: 0.62, minOpacity: 0.45, maxRotation: 28, maxBlur: 2.5 };

/**
 * The section's dashboard proof, styled as a shallow 3D film strip rather
 * than a slideshow: screenshots drift continuously left to right, growing
 * toward full size and square-on as they near the centre of the stage, then
 * shrinking and turning away again as they pass — always exactly one focal
 * card, never a jump cut between them.
 *
 * Fully automatic, unlike the hero's showcase: there is nothing here to page
 * to or choose between, so there is nothing for a visitor to operate.
 */
export default function OwnerDeskConveyor() {
    const stageRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const distanceRef = useRef(0);
    const velocityRef = useRef(0);

    useEffect(() => {
        const stage = stageRef.current;
        const track = trackRef.current;
        if (!stage || !track) return;

        // Queried once rather than collected via ref callbacks during render:
        // the tile list is fixed for the life of this component, so there is
        // nothing to keep in sync after mount.
        const tiles = [...track.querySelectorAll<HTMLElement>('.desk-conveyor__tile')];

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Static is the reduced-motion form of a thing that otherwise never
            // stops moving. Left at its natural layout, every tile at rest, rather
            // than frozen mid-belt in whatever the first frame would have been.
            return;
        }

        let visible = false;
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
        observer.observe(stage);

        let frame = 0;
        let last: number | null = null;

        const tick = (now: number) => {
            frame = requestAnimationFrame(tick);
            if (!visible) { last = null; return; }
            if (last === null) { last = now; return; }
            const dt = Math.min((now - last) / 1000, 1 / 15);
            last = now;

            velocityRef.current = approach(velocityRef.current, BASE_SPEED, RECOVERY_PER_SECOND, dt);
            distanceRef.current += velocityRef.current * dt;

            const setWidth = track.scrollWidth / LAPS;
            track.style.transform = `translate3d(${beltOffset(distanceRef.current, setWidth).toFixed(2)}px, 0, 0)`;

            const stageRect = stage.getBoundingClientRect();
            const centreX = stageRect.left + stageRect.width / 2;

            for (const tile of tiles) {
                const rect = tile.getBoundingClientRect();
                const signedDistance = rect.left + rect.width / 2 - centreX;
                const depth = depthForOffset(signedDistance, DEPTH);

                tile.style.transform = `translateZ(0) rotateY(${depth.rotateY.toFixed(2)}deg) scale(${depth.scale.toFixed(3)})`;
                tile.style.opacity = depth.opacity.toFixed(3);
                tile.style.filter = depth.blur > 0.05 ? `blur(${depth.blur.toFixed(2)}px)` : 'none';
                // The focal card visibly sits in front of its neighbours rather
                // than merely being bigger than them.
                tile.style.zIndex = String(Math.round(depth.scale * 100));
            }
        };

        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="desk-conveyor" ref={stageRef}>
            <div className="desk-conveyor__track" ref={trackRef}>
                {Array.from({ length: LAPS }, (_, lap) =>
                    TILES.map((tile, index) => (
                        // Only the first lap's alt text is real; the repeats are the
                        // same cards again for the loop, and a screen reader
                        // announcing the same nine captions three times over would be
                        // noise rather than information.
                        <figure className="desk-conveyor__tile" key={`${lap}-${index}`}>
                            <img
                                src={tile.src}
                                alt={lap === 0 ? tile.alt : ''}
                                aria-hidden={lap !== 0}
                                loading={lap === 0 ? 'eager' : 'lazy'}
                            />
                        </figure>
                    )),
                )}
            </div>
        </div>
    );
}
