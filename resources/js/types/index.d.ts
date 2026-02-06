// resources/js/types/index.ts

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    products_count?: number;
    parent_id?: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
    imageAlt: string;
    category: string;
    categorySlug: string;
    price: number;
    currency: string;
    formattedPrice: string;
    description?: string;
    href: string;
    storeName: string;
    storeSlug: string;
    madeToOrder: boolean;
    leadTimeDays?: number;
    hasVariants?: boolean;
  }
  
  export interface Store {
    id: number;
    name: string;
    slug: string;
    address?: Record<string, any>;
    status: string;
  }
  
  export interface NavItem {
    label: string;
    href: string;
    active?: boolean;
  }