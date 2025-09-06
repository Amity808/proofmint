"use client";

import React, { Suspense, lazy } from "react";
import Footer from "~~/components/home/Footer";
import Header from "~~/components/home/Header";
import Support from "~~/components/home/Support";

// Lazy load components
const HeroSection = lazy(() => import("~~/components/home/HeroSection"));
const Description = lazy(() => import("~~/components/home/Description"));
const HowItWorks = lazy(() => import("~~/components/home/HowItWorks"));
const PartnerTestimonials = lazy(() => import("~~/components/home/PartnerTestimonials"));
const FAQ = lazy(() => import("~~/components/home/FAQ"));

interface HomeProps {
  account: string;
  // role: Role;
}

const Home: React.FC<HomeProps> = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main role="main" aria-labelledby="home-title">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <HeroSection />
          <Description />
          <HowItWorks />
          <PartnerTestimonials />
          <FAQ />
        </Suspense>
      </main>
      <Footer />
      <Support />
    </div>
  );
};

export default Home;