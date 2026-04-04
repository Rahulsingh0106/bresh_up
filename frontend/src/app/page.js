import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsBar from '@/components/landing/StatsBar';
import Testimonials from '@/components/landing/Testimonials';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsBar />
      <Testimonials />
    </div>
  );
}
