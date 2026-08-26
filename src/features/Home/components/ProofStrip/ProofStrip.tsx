import Marquee from '../Marquee/Marquee';
import './ProofStrip.css';

const PROOF_POINTS = [
  'AI product creation from a photo',
  'Professional product images, generated',
  'Multiple colors, one photo',
  'Faster listings, less manual work',
  'Built for growing merchants',
];

export default function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="What MerchForge does for merchants">
      <Marquee items={PROOF_POINTS} speed={32} />
    </section>
  );
}
