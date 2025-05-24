import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import CategorySection from '../../components/home/CategorySection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage; 