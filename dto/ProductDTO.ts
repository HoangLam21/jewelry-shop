import { Variant } from "@/components/admin/product/ProductList";

export interface FileContent {
  _id: string;
  fileName: string;
  url: string;
  publicId: string;
  bytes: string;
  width: string;
  height: string;
  format: string;
  type: string;
}
export interface ProductResponse {
  _id: string;
  category: string;
  cost: number;
  createAt: string;
  description: string;
  files: FileContent[];
  name: string;
  collections: string;
  provider: {
    _id: string;
    name: string;
    address: string;
  };
  sales: number;
  variants: [
    {
      _id: string;
      addOn: number;
      material: string;
      sizes: [
        {
          _id: string;
          size: string;
          stock: number;
        }
      ];
    }
  ];
  vouchers: [
    {
      _id: string;
      name: string;
      discount: number;
      expDate: string;
      createAt: string;
    }
  ];
}

export interface CreateProduct {
  name: string;
  cost: number;
  description: string;
  images: FileContent[];
  vouchers: string;
  provider?: string;
  category?: string;
  collections: string;
  variants: Variant[];
}
