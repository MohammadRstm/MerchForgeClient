import Hero from './components/Hero/Hero';
import Navbar from './components/Navbar/Navbar';
import Problem from './components/Problem/Problem';
import HowItWorks from './components/HowItWorks/HowItWorks';
import ProductManagement from './components/ProductManagement/ProductManagement';
import AIProductCreation from './components/AiProductCreation/AiProductCreation';
import WhyMerchForge from './components/WhyMerchForge/WhyMerchForge';
import Integrations from './components/Integrations/Integrations';
import AIServices from './components/AiServices/AiServices';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Pricing from './components/Pricing/Pricing';
import Footer from './components/Footer/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home" id="top">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <AIProductCreation />
        <AIServices />
        <ProductManagement />
        <Integrations />
        <Pricing />
        <WhyMerchForge />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}