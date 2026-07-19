import React from "react";
import {
  Navbar,
  HeroSection,
  NowPlayingSection,
  ComingSoonSection,
  Footer,
} from "../../components";

const HomePage: React.FC = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <NowPlayingSection />
      <ComingSoonSection />
    </main>
    <Footer />
  </>
);

export default HomePage;
