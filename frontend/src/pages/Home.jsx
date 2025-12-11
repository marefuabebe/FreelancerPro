import { useState } from 'react'
import HeroSection from '../components/home/HeroSection.jsx'
import CategoriesGrid from '../components/home/CategoriesGrid.jsx'
import SpecialistsSection from '../components/home/SpecialistsSection.jsx'
import FeatureCards from '../components/home/FeatureCards.jsx'
import PricingCalculator from '../components/home/PricingCalculator.jsx'
import TestimonialsCarousel from '../components/home/TestimonialsCarousel.jsx'
import PricingPlans from '../components/home/PricingPlans.jsx'
import FinalCTA from '../components/home/FinalCTA.jsx'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleCloseSpecialists = () => {
    setSelectedCategory(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <CategoriesGrid onCategorySelect={handleCategorySelect} />

      {selectedCategory && (
        <SpecialistsSection
          selectedCategory={selectedCategory}
          onClose={handleCloseSpecialists}
        />
      )}



      <FeatureCards />
      <PricingCalculator />
      <PricingPlans />
      <TestimonialsCarousel />
      <FinalCTA />
    </div>
  )
}
