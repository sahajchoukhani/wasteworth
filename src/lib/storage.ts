import fs from 'fs';
import path from 'path';
import { SEED_PRODUCTS } from './catalog';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase/server';
import {
  CustomCreationRequest,
  DecorEnquiry,
  ProductCategory,
  ProductItem,
  RequestStatus,
  SubmissionsStore,
} from '@/types/wasteworth';

const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data');
const PRIMARY_FILE = path.join(PRIMARY_DATA_DIR, 'submissions.json');
const FALLBACK_FILE = path.join('/tmp', 'wasteworth-submissions.json');
const STORAGE_BUCKET = 'customer-uploads';

const EMPTY_STORE: SubmissionsStore = {
  products: [...SEED_PRODUCTS],
  requests: [],
  decorEnquiries: [],
};

function resolveStoreFile(): {
  filePath: string;
  mode: 'local-file' | 'tmp-ephemeral';
} {
  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ PRIMARY_DATA_DIR)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ PRIMARY_DATA_DIR, {
        recursive: true,
      });
    }
    fs.accessSync(/*turbopackIgnore: true*/ PRIMARY_DATA_DIR, fs.constants.W_OK);
    return { filePath: PRIMARY_FILE, mode: 'local-file' };
  } catch {
    return { filePath: FALLBACK_FILE, mode: 'tmp-ephemeral' };
  }
}

export function getBackendMode(): 'supabase' | 'local-file' | 'tmp-ephemeral' {
  if (isSupabaseConfigured()) return 'supabase';
  return resolveStoreFile().mode;
}

export function readLocalStore(): SubmissionsStore {
  const { filePath } = resolveStoreFile();
  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      fs.writeFileSync(
        /*turbopackIgnore: true*/ filePath,
        JSON.stringify(EMPTY_STORE, null, 2),
        'utf-8'
      );
      return {
        products: [...SEED_PRODUCTS],
        requests: [],
        decorEnquiries: [],
      };
    }
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SubmissionsStore>;
    return {
      products:
        Array.isArray(parsed.products) && parsed.products.length > 0
          ? parsed.products
          : [...SEED_PRODUCTS],
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      decorEnquiries: Array.isArray(parsed.decorEnquiries)
        ? parsed.decorEnquiries
        : [],
    };
  } catch {
    return {
      products: [...SEED_PRODUCTS],
      requests: [],
      decorEnquiries: [],
    };
  }
}

export function writeLocalStore(store: SubmissionsStore): void {
  const { filePath } = resolveStoreFile();
  fs.writeFileSync(
    /*turbopackIgnore: true*/ filePath,
    JSON.stringify(store, null, 2),
    'utf-8'
  );
}

export function generateReferenceNumber(prefix: 'WW' | 'WWF'): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const alpha = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${year}-${randomPart}${alpha}`;
}

/* ===========================
 * PRODUCTS (DB + Local Fallback)
 * =========================== */

export async function listProducts(includeInactive = false): Promise<ProductItem[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    let query = sb
      .from('products')
      .select('*')
      .order('display_order', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      return data.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        category: row.category as ProductCategory,
        shortDescription: row.description,
        materialUsed: row.material,
        indicativePrice: row.indicative_price,
        image: row.image_url,
        customizationAvailable: row.customization_available || [],
        isConceptRender: Boolean(row.is_concept_render),
        isActive: Boolean(row.is_active),
        displayOrder: row.display_order ?? 0,
        createdAt: row.created_at,
      }));
    }
  }

  const local = readLocalStore();
  return includeInactive
    ? local.products
    : local.products.filter((p) => p.isActive);
}

export async function createProduct(
  input: Omit<ProductItem, 'id' | 'createdAt'>
): Promise<ProductItem> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from('products')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.shortDescription,
        category: input.category,
        material: input.materialUsed,
        indicative_price: input.indicativePrice,
        image_url: input.image,
        customization_available: input.customizationAvailable,
        is_concept_render: Boolean(input.isConceptRender),
        is_active: input.isActive,
        display_order: input.displayOrder,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      shortDescription: data.description,
      materialUsed: data.material,
      indicativePrice: data.indicative_price,
      image: data.image_url,
      customizationAvailable: data.customization_available || [],
      isConceptRender: Boolean(data.is_concept_render),
      isActive: Boolean(data.is_active),
      displayOrder: data.display_order ?? 0,
      createdAt: data.created_at,
    };
  }

  const store = readLocalStore();
  const created: ProductItem = {
    ...input,
    id: `ww-prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.products.push(created);
  writeLocalStore(store);
  return created;
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductItem>
): Promise<ProductItem | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.shortDescription !== undefined)
      patch.description = updates.shortDescription;
    if (updates.category !== undefined) patch.category = updates.category;
    if (updates.materialUsed !== undefined) patch.material = updates.materialUsed;
    if (updates.indicativePrice !== undefined)
      patch.indicative_price = updates.indicativePrice;
    if (updates.image !== undefined) patch.image_url = updates.image;
    if (updates.customizationAvailable !== undefined)
      patch.customization_available = updates.customizationAvailable;
    if (updates.isActive !== undefined) patch.is_active = updates.isActive;

    const { data, error } = await sb
      .from('products')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      shortDescription: data.description,
      materialUsed: data.material,
      indicativePrice: data.indicative_price,
      image: data.image_url,
      customizationAvailable: data.customization_available || [],
      isConceptRender: Boolean(data.is_concept_render),
      isActive: Boolean(data.is_active),
      displayOrder: data.display_order ?? 0,
      createdAt: data.created_at,
    };
  }

  const store = readLocalStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  store.products[idx] = { ...store.products[idx], ...updates };
  writeLocalStore(store);
  return store.products[idx];
}

/* ===========================
 * PRIVATE STORAGE (Signed URLs)
 * =========================== */

export async function uploadPrivateFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: 'materials' | 'logos'
): Promise<{ storagePath: string }> {
  const safeExt =
    mimeType === 'image/png'
      ? 'png'
      : mimeType === 'image/webp'
      ? 'webp'
      : 'jpg';
  const uniqueName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}.${safeExt}`;

  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.storage
      .from(STORAGE_BUCKET)
      .upload(uniqueName, buffer, {
        contentType: mimeType,
        upsert: false,
      });
    if (error) throw new Error(error.message);
    return { storagePath: uniqueName };
  }

  // Local dev fallback: store in private data/uploads/ (never in public/)
  const localDir = path.join(PRIMARY_DATA_DIR, 'uploads', folder);
  fs.mkdirSync(/*turbopackIgnore: true*/ localDir, { recursive: true });
  const localFile = path.join(PRIMARY_DATA_DIR, 'uploads', uniqueName);
  fs.writeFileSync(/*turbopackIgnore: true*/ localFile, buffer);
  return { storagePath: uniqueName };
}

export async function createSignedAdminUrl(
  storagePath: string
): Promise<string | undefined> {
  if (!storagePath) return undefined;
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, 300); // 5-minute signed URL
    if (!error && data?.signedUrl) return data.signedUrl;
    return undefined;
  }
  // Local dev fallback: read from private data/uploads/ for authorized admin
  try {
    const localFile = path.join(PRIMARY_DATA_DIR, 'uploads', storagePath);
    if (fs.existsSync(/*turbopackIgnore: true*/ localFile)) {
      const buf = fs.readFileSync(/*turbopackIgnore: true*/ localFile);
      const ext = path.extname(storagePath).toLowerCase();
      const mime =
        ext === '.png'
          ? 'image/png'
          : ext === '.webp'
          ? 'image/webp'
          : 'image/jpeg';
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/* ===========================
 * CUSTOMIZATION REQUESTS
 * =========================== */

export async function saveCustomRequest(
  payload: Omit<
    CustomCreationRequest,
    | 'id'
    | 'referenceNumber'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'adminNotes'
    | 'estimatedPrice'
    | 'finalQuotedPrice'
  >
): Promise<CustomCreationRequest> {
  const referenceNumber = generateReferenceNumber('WW');
  const sb = getSupabaseAdmin();

  if (sb) {
    const { data, error } = await sb
      .from('customization_requests')
      .insert({
        reference_number: referenceNumber,
        customer_name: payload.customer.fullName,
        email: payload.customer.email,
        phone: payload.customer.phone,
        city: payload.customer.city,
        address: payload.customer.deliveryAddress,
        material_types: payload.materials,
        custom_material: payload.customMaterial,
        product_category: payload.productType,
        colour_preference: payload.customization.colourPreference,
        design_style: payload.customization.designStyle,
        size: payload.customization.size,
        pattern: payload.customization.pattern,
        personalization_text: payload.customization.personalText,
        special_instructions: payload.customization.specialInstructions,
        uploaded_image_paths: payload.uploadedImagePaths,
        logo_path: payload.customization.logoPath || null,
        status: 'NEW',
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);

    return {
      id: data.id,
      referenceNumber: data.reference_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status as RequestStatus,
      adminNotes: data.admin_notes || '',
      estimatedPrice: data.estimated_price ?? null,
      finalQuotedPrice: data.final_quoted_price ?? null,
      materials: data.material_types || [],
      customMaterial: data.custom_material || '',
      productType: data.product_category,
      customization: payload.customization,
      uploadedImagePaths: data.uploaded_image_paths || [],
      uploadedImages: payload.uploadedImages,
      customer: payload.customer,
    };
  }

  const store = readLocalStore();
  const now = new Date().toISOString();
  const record: CustomCreationRequest = {
    ...payload,
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referenceNumber,
    createdAt: now,
    updatedAt: now,
    status: 'NEW',
    adminNotes: '',
    estimatedPrice: null,
    finalQuotedPrice: null,
  };
  store.requests.unshift(record);
  writeLocalStore(store);
  return record;
}

export async function listCustomRequestsWithSignedUrls(): Promise<
  CustomCreationRequest[]
> {
  const sb = getSupabaseAdmin();
  let rows: CustomCreationRequest[] = [];

  if (sb) {
    const { data, error } = await sb
      .from('customization_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    rows = (data || []).map((row) => ({
      id: row.id,
      referenceNumber: row.reference_number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status as RequestStatus,
      adminNotes: row.admin_notes || '',
      estimatedPrice: row.estimated_price ?? null,
      finalQuotedPrice: row.final_quoted_price ?? null,
      materials: row.material_types || [],
      customMaterial: row.custom_material || '',
      productType: row.product_category,
      customization: {
        colourPreference: row.colour_preference || '',
        colourHex: '#0E4456',
        designStyle: row.design_style || '',
        pattern: row.pattern || '',
        size: row.size || '',
        personalText: row.personalization_text || '',
        logoPath: row.logo_path || undefined,
        specialInstructions: row.special_instructions || '',
      },
      uploadedImagePaths: row.uploaded_image_paths || [],
      uploadedImages: (row.uploaded_image_paths || []).map(
        (p: string, idx: number) => ({
          id: `img_${idx}`,
          name: path.basename(p),
          size: 0,
          storagePath: p,
        })
      ),
      customer: {
        fullName: row.customer_name,
        email: row.email,
        phone: row.phone,
        city: row.city,
        deliveryAddress: row.address || '',
        preferredContact: 'WhatsApp',
      },
    }));
  } else {
    rows = readLocalStore().requests;
  }

  // Generate temporary signed URLs for admin viewing only
  return Promise.all(
    rows.map(async (r) => {
      const signedImages = await Promise.all(
        (r.uploadedImages || []).map(async (img) => {
          if (img.storagePath) {
            const signedUrl = await createSignedAdminUrl(img.storagePath);
            return { ...img, signedUrl };
          }
          return img;
        })
      );
      const logoSignedUrl = r.customization.logoPath
        ? await createSignedAdminUrl(r.customization.logoPath)
        : undefined;
      return {
        ...r,
        uploadedImages: signedImages,
        customization: {
          ...r.customization,
          logoSignedUrl,
        },
      };
    })
  );
}

export async function updateCustomRequest(
  id: string,
  updates: {
    status?: RequestStatus;
    adminNotes?: string;
    estimatedPrice?: number | null;
    finalQuotedPrice?: number | null;
  }
): Promise<CustomCreationRequest | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.status) patch.status = updates.status;
    if (typeof updates.adminNotes === 'string')
      patch.admin_notes = updates.adminNotes;
    if (updates.estimatedPrice !== undefined)
      patch.estimated_price = updates.estimatedPrice;
    if (updates.finalQuotedPrice !== undefined)
      patch.final_quoted_price = updates.finalQuotedPrice;

    const { data, error } = await sb
      .from('customization_requests')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error || !data) return null;
    const all = await listCustomRequestsWithSignedUrls();
    return all.find((r) => r.id === id) || null;
  }

  const store = readLocalStore();
  const idx = store.requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.requests[idx] = {
    ...store.requests[idx],
    ...(updates.status ? { status: updates.status } : {}),
    ...(typeof updates.adminNotes === 'string'
      ? { adminNotes: updates.adminNotes }
      : {}),
    ...(updates.estimatedPrice !== undefined
      ? { estimatedPrice: updates.estimatedPrice }
      : {}),
    ...(updates.finalQuotedPrice !== undefined
      ? { finalQuotedPrice: updates.finalQuotedPrice }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeLocalStore(store);
  return store.requests[idx];
}

/* ===========================
 * DECOR ENQUIRIES
 * =========================== */

export async function saveDecorEnquiry(
  payload: Omit<
    DecorEnquiry,
    'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status' | 'adminNotes'
  >
): Promise<DecorEnquiry> {
  const referenceNumber = generateReferenceNumber('WWF');
  const sb = getSupabaseAdmin();

  if (sb) {
    const { data, error } = await sb
      .from('decor_enquiries')
      .insert({
        reference_number: referenceNumber,
        customer_name: payload.contactName,
        organization_name: payload.organizationName,
        email: payload.email,
        phone: payload.phone,
        city: payload.city,
        product_type: payload.productType,
        quantity: payload.approximateQuantity,
        logo_path: payload.logoPath || null,
        colour_preferences: payload.colourPreferences,
        design_preferences: payload.designPreferences,
        budget_range: payload.budgetRange,
        special_instructions: payload.specialInstructions,
        status: 'NEW',
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return {
      ...payload,
      id: data.id,
      referenceNumber: data.reference_number,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status as RequestStatus,
      adminNotes: data.admin_notes || '',
    };
  }

  const store = readLocalStore();
  const now = new Date().toISOString();
  const record: DecorEnquiry = {
    ...payload,
    id: `dec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referenceNumber,
    createdAt: now,
    updatedAt: now,
    status: 'NEW',
    adminNotes: '',
  };
  store.decorEnquiries.unshift(record);
  writeLocalStore(store);
  return record;
}

export async function listDecorEnquiriesWithSignedUrls(): Promise<
  DecorEnquiry[]
> {
  const sb = getSupabaseAdmin();
  let rows: DecorEnquiry[] = [];

  if (sb) {
    const { data, error } = await sb
      .from('decor_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    rows = (data || []).map((row) => ({
      id: row.id,
      referenceNumber: row.reference_number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status as RequestStatus,
      adminNotes: row.admin_notes || '',
      organizationName: row.organization_name,
      productType: row.product_type,
      approximateQuantity: row.quantity,
      logoPath: row.logo_path || undefined,
      colourPreferences: row.colour_preferences || '',
      designPreferences: row.design_preferences || '',
      budgetRange: row.budget_range || '',
      specialInstructions: row.special_instructions || '',
      contactName: row.customer_name,
      email: row.email,
      phone: row.phone,
      city: row.city || '',
    }));
  } else {
    rows = readLocalStore().decorEnquiries;
  }

  return Promise.all(
    rows.map(async (d) => ({
      ...d,
      logoSignedUrl: d.logoPath
        ? await createSignedAdminUrl(d.logoPath)
        : undefined,
    }))
  );
}

export async function updateDecorEnquiry(
  id: string,
  updates: { status?: RequestStatus; adminNotes?: string }
): Promise<DecorEnquiry | null> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.status) patch.status = updates.status;
    if (typeof updates.adminNotes === 'string')
      patch.admin_notes = updates.adminNotes;

    const { data, error } = await sb
      .from('decor_enquiries')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error || !data) return null;
    const all = await listDecorEnquiriesWithSignedUrls();
    return all.find((d) => d.id === id) || null;
  }

  const store = readLocalStore();
  const idx = store.decorEnquiries.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.decorEnquiries[idx] = {
    ...store.decorEnquiries[idx],
    ...(updates.status ? { status: updates.status } : {}),
    ...(typeof updates.adminNotes === 'string'
      ? { adminNotes: updates.adminNotes }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  writeLocalStore(store);
  return store.decorEnquiries[idx];
}
