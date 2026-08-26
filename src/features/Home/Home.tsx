import Hero from './components/Hero/Hero';
import Header from '../Header/Header';
import ProofStrip from './components/ProofStrip/ProofStrip';
import Statement from './components/Statement/Statement';
import Showcase from './components/Showcase/Showcase';
import WhoItsFor from './components/WhoItsFor/WhoItsFor';
import Services from './components/Services/Services';
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
        <Statement />
        <Showcase />
        <WhoItsFor />
        <Services />
        <Faq />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
