import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import {
  getStorageMode,
  readStore,
  saveCustomRequest,
} from '@/lib/storage';

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { error: 'Unauthorized. Studio passcode required.' },
      { status: 401 }
    );
  }
  const store = readStore();
  return NextResponse.json({
    requests: store.requests,
    storageMode: getStorageMode(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !Array.isArray(body.materials) ||
      (body.materials.length === 0 && !body.customMaterial?.trim())
    ) {
      return NextResponse.json(
        { error: 'Please select or specify at least one material.' },
        { status: 400 }
      );
    }
    if (!body.productType?.trim()) {
      return NextResponse.json(
        { error: 'Please select a desired product.' },
        { status: 400 }
      );
    }
    if (
      !body.customer?.fullName?.trim() ||
      !body.customer?.email?.trim() ||
      !body.customer?.phone?.trim() ||
      !body.customer?.city?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please complete all required customer contact fields.' },
        { status: 400 }
      );
    }

    const saved = saveCustomRequest({
      materials: body.materials,
      customMaterial: body.customMaterial || '',
      productType: body.productType,
      customization: {
        colourPreference: body.customization?.colourPreference || 'Deep Ocean Teal',
        colourHex: body.customization?.colourHex || '#0E3D4D',
        designStyle: body.customization?.designStyle || 'Marbled Atelier',
        pattern: body.customization?.pattern || 'Organic Vein',
        size: body.customization?.size || 'Standard',
        personalText: body.customization?.personalText || '',
        logoDataUrl: body.customization?.logoDataUrl,
        logoName: body.customization?.logoName,
        specialInstructions: body.customization?.specialInstructions || '',
      },
      uploadedImages: Array.isArray(body.uploadedImages)
        ? body.uploadedImages.slice(0, 6)
        : [],
      customer: {
        fullName: body.customer.fullName.trim(),
        email: body.customer.email.trim(),
        phone: body.customer.phone.trim(),
        city: body.customer.city.trim(),
        deliveryAddress: body.customer.deliveryAddress?.trim() || '',
        preferredContact: body.customer.preferredContact || 'WhatsApp',
      },
    });

    return NextResponse.json(
      {
        success: true,
        referenceNumber: saved.referenceNumber,
        request: saved,
        storageMode: getStorageMode(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
