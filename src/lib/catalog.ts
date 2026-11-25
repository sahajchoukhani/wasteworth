import { ProductItem } from '@/types/wasteworth';

export const COLLECTION_CATEGORIES = [
  'All',
  'Keychains',
  'Earrings',
  'Rings',
  'Bangles',
  'Vases',
] as const;

export const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 'ww-prod-keychains',
    slug: 'bottle-cap-mosaic-keychain',
    name: 'Bottle-Cap Mosaic Keychain',
    category: 'Keychains',
    shortDescription:
      'Pocket-sized marbled fob pressed from sorted HDPE bottle caps and fitted with a solid brass split-ring.',
    materialUsed: 'Upcycled HDPE bottle caps & reclaimed brass hardware',
    customizationAvailable: ['Bottle-cap colour mix', 'Stamped initials', 'Clasp finish'],
    indicativePrice: 'From ₹450 (indicative)',
    image: '/images/real/product-keychain.jpg',
    isConceptRender: false,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'ww-prod-earrings',
    slug: 'clarified-pet-drop-earrings',
    name: 'Clarified PET Drop Earrings',
    category: 'Earrings',
    shortDescription:
      'Featherlight hand-cut earrings shaped from discarded beverage bottles and suspended on hypoallergenic brass hooks.',
    materialUsed: 'Post-consumer PET bottles & hypoallergenic brass wire',
    customizationAvailable: ['Polymer tint', 'Drop silhouette', 'Hook metal'],
    indicativePrice: 'From ₹620 (indicative)',
    image: '/images/real/product-earrings.jpg',
    isConceptRender: false,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'ww-prod-rings',
    slug: 'pressed-polymer-signet-ring',
    name: 'Pressed Polymer Signet Ring',
    category: 'Rings',
    shortDescription:
      'Hand-pressed ring formed from layered ocean-teal plastic caps and containers, sanded to a satin mineral finish.',
    materialUsed: 'Upcycled HDPE bottle caps & container lids',
    customizationAvailable: ['Ring size (US 5–11)', 'Swirl palette', 'Inner band engraving'],
    indicativePrice: 'From ₹750 (indicative)',
    image: '/images/real/product-ring.jpg',
    isConceptRender: false,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'ww-prod-bangles',
    slug: 'layered-polymer-cuff-bangle',
    name: 'Layered Polymer Cuff Bangle',
    category: 'Bangles',
    shortDescription:
      'Sculpted open cuff blending swirled packaging polymers with a brushed aluminium core for everyday resilience.',
    materialUsed: 'Recycled PP containers & crushed aluminium can core',
    customizationAvailable: ['Wrist circumference', 'Cuff width', 'Inner inscription'],
    indicativePrice: 'From ₹1,100 (indicative)',
    image: '/images/real/product-bangle.jpg',
    isConceptRender: false,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'ww-prod-vases',
    slug: 'reclaimed-vessel-planter-vase',
    name: 'Reclaimed Vessel & Planter Vase',
    category: 'Vases',
    shortDescription:
      'Small decorative vase and tabletop planter cast from shredded plastic packaging and stabilized mineral filler.',
    materialUsed: 'Shredded plastic packaging & reclaimed polymer composite',
    customizationAvailable: ['Vessel height', 'Speckle palette', 'Matte or satin seal'],
    indicativePrice: 'From ₹1,450 (indicative)',
    image: '/images/real/product-vase.jpg',
    isConceptRender: false,
    isActive: true,
    displayOrder: 5,
  },
];
