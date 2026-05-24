import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";

export default function HomePage() {
  return (
    <>
      
      <main style={{ paddingTop: 64 }}>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
      </main>
      
    </>
  );
}
