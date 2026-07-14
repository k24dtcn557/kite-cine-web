import React from 'react';
import {
  Navbar,
  HeroSection,
  NowPlayingSection,
  ComingSoonSection,
  TheaterLocator,
  Footer,
} from '../../components';

const HomePage: React.FC = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <NowPlayingSection />
      <ComingSoonSection />
      <TheaterLocator />
    </main>
    <Footer />
  </>
);

export default HomePage;
