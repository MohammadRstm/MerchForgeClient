import Hero from './components/Hero/Hero';
import Header from '../Header/Header';
import Statement from './components/Statement/Statement';
import HowItWorks from './components/HowItWorks/HowItWorks';
import ProductManagement from './components/ProductManagement/ProductManagement';
import Showcase from './components/Showcase/Showcase';
import Integrations from './components/Integrations/Integrations';
import AIServices from './components/AiServices/AiServices';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Pricing from './components/Pricing/Pricing';
import Footer from './components/Footer/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home" id="top">
      <Header />
      <main>
        <Hero />
        <Statement />
        <Showcase />
        <HowItWorks />
        <AIServices />
        <ProductManagement />
        <Integrations />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}