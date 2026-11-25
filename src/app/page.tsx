import { listProducts } from '@/lib/storage';
import { WasteWorthHomeClient } from '@/components/WasteWorthHomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await listProducts(false);
  return <WasteWorthHomeClient initialProducts={products} />;
}
