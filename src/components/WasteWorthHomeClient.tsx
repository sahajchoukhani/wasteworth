'use client';

import React, { useState } from 'react';
import { AtelierPreloader } from './AtelierPreloader';
import { ScrollProgressBar } from './ScrollProgressBar';
import { CustomCursor } from './CustomCursor';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { KineticMarquee } from './KineticMarquee';
import { CollectionSection } from './CollectionSection';
import { WasteWizardSection } from './WasteWizardSection';
import { WasteWorthFormSection } from './WasteWorthFormSection';
import { ProcessSection } from './ProcessSection';
import { LoopSection } from './LoopSection';
import { StorySection } from './StorySection';
import { Footer } from './Footer';

export function WasteWorthHomeClient() {
  const [selectedWizardProduct, setSelectedWizardProduct] = useState<
    string | null
  >(null);

  return (
    <>
      <AtelierPreloader />
      <ScrollProgressBar />
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <KineticMarquee />
        <CollectionSection
          onCustomizeProduct={(productType) =>
            setSelectedWizardProduct(productType)
          }
        />
        <WasteWizardSection preselectedProduct={selectedWizardProduct} />
        <WasteWorthFormSection />
        <ProcessSection />
        <LoopSection />
        <StorySection />
      </main>
      <Footer />
    </>
  );
}
