export interface ProductImage {
  id: number;
  url: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSeller {
  name: string;
  location: string;
  returnPolicy: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  store_slug: string;
  designer: string;
  price: number;
  originalPrice?: number;
  currency: string;
  conditionBadges: string[];
  description: string;
  images: ProductImage[];
  specs: ProductSpec[];
  seller: ProductSeller;
  shippingNote: string;
}
