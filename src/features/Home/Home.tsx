import Hero from './components/Hero/Hero';
import Studio from './components/Studio/Studio';
import Header from '../Header/Header';
import ProofStrip from './components/ProofStrip/ProofStrip';
import HowItWorks from './components/HowItWorks/HowItWorks';
import OwnerDesk from './components/OwnerDesk/OwnerDesk';
import Faq from './components/Faq/Faq';
import Pricing from './components/Pricing/Pricing';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Footer from './components/Footer/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home" id="top">
      <Header />
      <main>
        <Hero />
        <ProofStrip />
        <Studio />
        <HowItWorks />
        <OwnerDesk />
        <Pricing />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
