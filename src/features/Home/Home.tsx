import Hero from './components/Hero/Hero';
import Header from '../Header/Header';
import Statement from './components/Statement/Statement';
import Showcase from './components/Showcase/Showcase';
import WhoItsFor from './components/WhoItsFor/WhoItsFor';
import Services from './components/Services/Services';
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
        <WhoItsFor />
        <Services />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
