import AboutSection from '@/components/about-section'
import HeroSection from '@/components/hero-section'
import HowItWorksSection from '@/components/how-works'
import KeyFeaturesSection from '@/components/key-features'
import React from 'react'

function page() {
  return (
    <div>
      <HeroSection/>
      <AboutSection/>
      <HowItWorksSection/>
      <KeyFeaturesSection/>
    </div>
  )
}

export default page
