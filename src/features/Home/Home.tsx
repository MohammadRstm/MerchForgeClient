import './Home.css';
import Hero from './components/Hero/Hero';
import Studio from './components/Studio/Studio';
import Header from '../Header/Header';
import ProofStrip from './components/ProofStrip/ProofStrip';
import OwnerDesk from './components/OwnerDesk/OwnerDesk';
import WhatsNext from './components/WhatsNext/WhatsNext';
import Faq from './components/Faq/Faq';
import Pricing from './components/Pricing/Pricing';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Footer from './components/Footer/Footer';

export default function Home() {
  return (
    <div className="home" id="top">
      <Header />
      <main>
        <Hero />
        <ProofStrip />
        <Studio />
        <OwnerDesk />
        <WhatsNext />
        <Pricing />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
