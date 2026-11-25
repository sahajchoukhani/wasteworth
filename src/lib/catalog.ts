import { ProductItem } from '@/types/wasteworth';

export const COLLECTION_CATEGORIES = [
  'All',
  'Rings',
  'Earrings',
  'Bangles',
  'Keychains',
  'WasteWorth Form',
] as const;

export const PRODUCT_CATALOG: ProductItem[] = [
  {
    id: 'ww-ring-01',
    slug: 'abyssal-signet-ring',
    name: 'Abyssal Vein Signet',
    category: 'Rings',
    shortDescription:
      'Hand-pressed ocean-teal HDPE signet inlaid with fine champagne-brass leaf filaments.',
    editorialNote:
      'Each signet carries an unrepeatable mineral-like swirl formed when discarded bottle caps are heat-compressed in small studio batches.',
    materialUsed: 'Upcycled HDPE bottle caps & reclaimed brass',
    customizationAvailable: ['Ring size (US 5–11)', 'Teal / Ivory swirl ratio', 'Inner band initials'],
    indicativePrice: 'From ₹750 (indicative)',
    image: '/images/product-ring.svg',
    tag: 'Signature Piece',
    featuredSpan: 'tall',
  },
  {
    id: 'ww-ear-01',
    slug: 'foliage-drop-earrings',
    name: 'Foliage Drop Earrings',
    category: 'Earrings',
    shortDescription:
      'Featherlight translucent PET leaf silhouettes suspended from brushed champagne-gold hooks.',
    editorialNote:
      'Cut, sanded, and flame-polished from post-consumer beverage bottles to catch light like sea glass.',
    materialUsed: 'Clarified PET bottles & hypoallergenic brass hooks',
    customizationAvailable: ['Leaf tint', 'Drop length', 'Gold or silver wire'],
    indicativePrice: 'From ₹650 (indicative)',
    image: '/images/product-earrings.svg',
    tag: 'Featherlight',
    featuredSpan: 'standard',
  },
  {
    id: 'ww-bang-01',
    slug: 'tideline-sculpted-cuff',
    name: 'Tideline Sculpted Cuff',
    category: 'Bangles',
    shortDescription:
      'Architectural open cuff blending marbled deep teal polymer with a warm ivory-and-gold inner rim.',
    editorialNote:
      'Molded from layered packaging waste and finished with a satin wax buff for an heirloom tactile feel.',
    materialUsed: 'Recycled PP containers & brushed aluminium core',
    customizationAvailable: ['Wrist circumference', 'Cuff width', 'Engraved inner quote'],
    indicativePrice: 'From ₹1,150 (indicative)',
    image: '/images/product-bangle.svg',
    tag: 'Limited Batch',
    featuredSpan: 'wide',
  },
  {
    id: 'ww-key-01',
    slug: 'dual-leaf-atelier-fob',
    name: 'Dual-Leaf Atelier Fob',
    category: 'Keychains',
    shortDescription:
      'Tactile marbled teal-and-gold pocket sculpture paired with a solid champagne-toned clasp.',
    editorialNote:
      'Inspired directly by the WasteWorth split-leaf emblem—built to age gracefully in daily carry.',
    materialUsed: 'Sorted plastic packaging & reclaimed alloy clasp',
    customizationAvailable: ['Monogram stamp', 'Swirl palette', 'Gift-box tag'],
    indicativePrice: 'From ₹480 (indicative)',
    image: '/images/product-keychain.svg',
    tag: 'Everyday Relic',
    featuredSpan: 'standard',
  },
  {
    id: 'ww-ring-02',
    slug: 'solstice-band-ring',
    name: 'Solstice Marbled Band',
    category: 'Rings',
    shortDescription:
      'Minimalist 6mm band pairing warm travertine-toned recycled polymer with subtle gold dust.',
    editorialNote:
      'Designed for stacking or solo wear, turning everyday container lids into quiet luxury.',
    materialUsed: 'Upcycled PP lids & metallic mineral pigment',
    customizationAvailable: ['Band width (4mm / 6mm)', 'Finish (Matte / Gloss)', 'Initials'],
    indicativePrice: 'From ₹590 (indicative)',
    image: '/images/product-ring.svg',
    tag: 'Stackable',
    featuredSpan: 'standard',
  },
  {
    id: 'ww-form-01',
    slug: 'crest-university-nameplate',
    name: 'Crest Architectural Nameplate',
    category: 'WasteWorth Form',
    shortDescription:
      'Custom-milled recycled polymer and brushed metal desk or door plaques for campuses and studios.',
    editorialNote:
      'Transforms institutional plastic waste into permanent architectural signage with laser-etched crests.',
    materialUsed: 'Campus HDPE waste & brushed brass plate',
    customizationAvailable: ['Institution crest', 'Dimensions', 'Teal / Charcoal / Ivory base'],
    indicativePrice: 'Request a quote',
    isQuoteOnly: true,
    image: '/images/product-decor-form.svg',
    tag: 'WasteWorth Form',
    featuredSpan: 'wide',
  },
  {
    id: 'ww-form-02',
    slug: 'monolith-award-trophy',
    name: 'Monolith Recycled Trophy',
    category: 'WasteWorth Form',
    shortDescription:
      'Sculptural exhibition and convocation awards cast from marbled ocean-teal waste streams.',
    editorialNote:
      'Each award carries a visible, dignified story of the exact material batch it rescued.',
    materialUsed: 'Compressed multi-stream plastic & champagne-gold plinth',
    customizationAvailable: ['Event engraving', 'Edition numbering', 'Custom silhouette'],
    indicativePrice: 'Request a quote',
    isQuoteOnly: true,
    image: '/images/product-decor-form.svg',
    tag: 'Bespoke Edition',
    featuredSpan: 'standard',
  },
];
