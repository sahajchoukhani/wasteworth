'use client';

import React, { useRef, useState } from 'react';
import { AtelierPreloader } from './AtelierPreloader';
import { ScrollController } from './ScrollController';
import { CustomCursor } from './CustomCursor';
import { Navbar } from './Navbar';
import { WorthTunnelSection } from './WorthTunnelSection';
import { CollectionSection } from './CollectionSection';
import {
  WasteWizardSection,
  PreselectedProductTrigger,
} from './WasteWizardSection';
import { WasteWorthFormSection } from './WasteWorthFormSection';
import { ProcessSection } from './ProcessSection';
import { LoopSection } from './LoopSection';
import { StorySection } from './StorySection';
import { Footer } from './Footer';
import { ProductItem } from '@/types/wasteworth';

interface WasteWorthHomeClientProps {
  initialProducts: ProductItem[];
}

export function WasteWorthHomeClient({
  initialProducts,
}: WasteWorthHomeClientProps) {
  const [preselected, setPreselected] =
    useState<PreselectedProductTrigger | null>(null);
  const seqRef = useRef(0);

  const handleCustomizeProduct = (productType: string) => {
    seqRef.current += 1;
    setPreselected({ product: productType, seq: seqRef.current });
  };

  return (
    <>
      <AtelierPreloader />
      <ScrollController />
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <WorthTunnelSection products={initialProducts} />
        <CollectionSection
          products={initialProducts}
          onCustomizeProduct={handleCustomizeProduct}
        />
        <WasteWizardSection preselected={preselected} />
        <WasteWorthFormSection />
        <ProcessSection />
        <LoopSection />
        <StorySection />
      </main>
      <Footer />
    </>
  );
}
