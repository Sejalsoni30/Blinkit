import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar.js';
import { Hero } from '../components/landing/Hero.js';
import { StatsStrip } from '../components/landing/StatsStrip.js';
import { ProblemSection } from '../components/landing/ProblemSection.js';
import { FeaturesGrid } from '../components/landing/FeaturesGrid.js';
import { HowItWorks } from '../components/landing/HowItWorks.js';
import { DashboardPreview } from '../components/landing/DashboardPreview.js';
import { RolesSection } from '../components/landing/RolesSection.js';
import { FaqSection } from '../components/landing/FaqSection.js';
import { CtaBanner } from '../components/landing/CtaBanner.js';
import { LandingFooter } from '../components/landing/LandingFooter.js';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-yellow-200">
      {/* 1. Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Stats Strip */}
      <StatsStrip />

      {/* 4. Problem Section */}
      <ProblemSection />

      {/* 5. Features Grid */}
      <FeaturesGrid />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Live Dashboard Preview */}
      <DashboardPreview />

      {/* 8. Roles Section */}
      <RolesSection />

      {/* 9. FAQ Section */}
      <FaqSection />

      {/* 10. Final CTA Banner */}
      <CtaBanner />

      {/* 11. Footer */}
      <LandingFooter />
    </div>
  );
};
