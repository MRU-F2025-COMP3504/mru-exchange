import type { RequireProperty, Product } from '@shared/types';
import { getAssetByBucket } from '@shared/utils';

interface ProductImages {
  images: string[];
}

export function getProductImages(
  product: RequireProperty<Product, 'image'>,
): string[] {
  const container = product.image as object as ProductImages;

  return container.images.map((path) =>
    getAssetByBucket('product-images', path),
  );
}
