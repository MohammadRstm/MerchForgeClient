import Hero from './components/Hero/Hero';
import Header from '../Header/Header';
import ProofStrip from './components/ProofStrip/ProofStrip';
import Statement from './components/Statement/Statement';
import Capabilities from './components/Capabilities/Capabilities';
import ProductShowcase from './components/ProductShowcase/ProductShowcase';
import HowItWorks from './components/HowItWorks/HowItWorks';
import MerchantBenefits from './components/MerchantBenefits/MerchantBenefits';
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
        <Capabilities />
        <ProductShowcase />
        <HowItWorks />
        <MerchantBenefits />
        <Pricing />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
