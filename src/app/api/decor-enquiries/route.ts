import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import {
  getStorageMode,
  readStore,
  saveDecorEnquiry,
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
    enquiries: store.decorEnquiries,
    storageMode: getStorageMode(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.organizationName?.trim() ||
      !body.productType?.trim() ||
      !body.approximateQuantity?.trim() ||
      !body.contactName?.trim() ||
      !body.email?.trim() ||
      !body.phone?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please complete all required organization and contact fields.' },
        { status: 400 }
      );
    }

    const saved = saveDecorEnquiry({
      organizationName: body.organizationName.trim(),
      productType: body.productType.trim(),
      approximateQuantity: body.approximateQuantity.trim(),
      logoDataUrl: body.logoDataUrl,
      logoName: body.logoName,
      colourPreferences: body.colourPreferences?.trim() || 'Teal & Champagne Gold',
      designPreferences: body.designPreferences?.trim() || '',
      budgetRange: body.budgetRange?.trim() || 'To be discussed',
      contactName: body.contactName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      city: body.city?.trim() || '',
    });

    return NextResponse.json(
      {
        success: true,
        referenceNumber: saved.referenceNumber,
        enquiry: saved,
        storageMode: getStorageMode(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to submit enquiry. Please try again.' },
      { status: 500 }
    );
  }
}
