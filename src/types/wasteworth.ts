export type ProductCategory =
  | 'Keychains'
  | 'Earrings'
  | 'Rings'
  | 'Bangles'
  | 'Vases';

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  materialUsed: string;
  customizationAvailable: string[];
  indicativePrice: string;
  image: string;
  isConceptRender?: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
}

export type RequestStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'IN_PRODUCTION'
  | 'COMPLETED';

export interface UploadedImageItem {
  id: string;
  name: string;
  size: number;
  storagePath?: string;
  dataUrl?: string;
  signedUrl?: string;
}

export interface CustomCreationRequest {
  id: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  status: RequestStatus;
  adminNotes: string;
  estimatedPrice: number | null;
  finalQuotedPrice: number | null;
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
    logoPath?: string;
    logoSignedUrl?: string;
    logoName?: string;
    specialInstructions: string;
  };
  uploadedImagePaths: string[];
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
  adminNotes: string;
  organizationName: string;
  productType: string;
  approximateQuantity: string;
  logoPath?: string;
  logoSignedUrl?: string;
  logoName?: string;
  colourPreferences: string;
  designPreferences: string;
  budgetRange: string;
  specialInstructions: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
}

export interface SubmissionsStore {
  products: ProductItem[];
  requests: CustomCreationRequest[];
  decorEnquiries: DecorEnquiry[];
}
