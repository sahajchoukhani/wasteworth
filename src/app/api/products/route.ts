import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { sanitizeText } from '@/lib/rateLimit';
import { createProduct, getBackendMode, listProducts } from '@/lib/storage';
import { ProductCategory } from '@/types/wasteworth';

const VALID_CATEGORIES: ProductCategory[] = [
  'Keychains',
  'Earrings',
  'Rings',
  'Bangles',
  'Vases',
];

export async function GET(req: NextRequest) {
  const includeAllParam = req.nextUrl.searchParams.get('all') === '1';
  const authed = includeAllParam ? await isAdminAuthenticated() : false;
  const products = await listProducts(authed);

  return NextResponse.json({
    products,
    backendMode: getBackendMode(),
  });
}

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = sanitizeText(body.name, 120);
    const category = body.category as ProductCategory;
    const shortDescription = sanitizeText(body.shortDescription, 400);
    const materialUsed = sanitizeText(body.materialUsed, 200);
    const indicativePrice = sanitizeText(body.indicativePrice, 80);
    const image = sanitizeText(body.image, 400) || '/images/real/product-keychain.jpg';

    if (!name || !VALID_CATEGORIES.includes(category) || !shortDescription || !materialUsed) {
      return NextResponse.json(
        { error: 'Please provide name, valid category, description, and material.' },
        { status: 400 }
      );
    }

    const slug = `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${Date.now().toString(36).slice(-4)}`;

    const product = await createProduct({
      name,
      slug,
      category,
      shortDescription,
      materialUsed,
      indicativePrice: indicativePrice || 'Request a quote',
      image,
      customizationAvailable: Array.isArray(body.customizationAvailable)
        ? body.customizationAvailable.map((s: unknown) => sanitizeText(s, 80)).filter(Boolean)
        : ['Colour palette', 'Custom finishing'],
      isConceptRender: Boolean(body.isConceptRender),
      isActive: body.isActive !== false,
      displayOrder: Number(body.displayOrder) || 10,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Could not create product.' },
      { status: 500 }
    );
  }
}
