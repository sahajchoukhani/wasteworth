export type ProductCategory =
  | 'Rings'
  | 'Earrings'
  | 'Bangles'
  | 'Keychains'
  | 'WasteWorth Form';

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  editorialNote: string;
  materialUsed: string;
  customizationAvailable: string[];
  indicativePrice: string;
  isQuoteOnly?: boolean;
  image: string;
  tag: string;
  featuredSpan?: 'tall' | 'wide' | 'standard';
}

export type RequestStatus =
  | 'New'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Completed';

export interface UploadedImageItem {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
}

export interface CustomCreationRequest {
  id: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  internalNotes: string;
  materials: string[];
  customMaterial: string;
  productType: string;
  customization: {
    colourPreference: string;
    colourHex: string;
    designStyle: string;
    pattern: string;
    size: string;
    personalText: string;
    logoDataUrl?: string;
    logoName?: string;
    specialInstructions: string;
  };
  uploadedImages: UploadedImageItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    deliveryAddress: string;
    preferredContact: 'WhatsApp' | 'Email' | 'Phone';
  };
}

export interface DecorEnquiry {
  id: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  internalNotes: string;
  organizationName: string;
  productType: string;
  approximateQuantity: string;
  logoDataUrl?: string;
  logoName?: string;
  colourPreferences: string;
  designPreferences: string;
  budgetRange: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
}

export interface SubmissionsStore {
  requests: CustomCreationRequest[];
  decorEnquiries: DecorEnquiry[];
}
