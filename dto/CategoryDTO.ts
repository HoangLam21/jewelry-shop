export interface CategoryResponse {
  _id: string;
  name: string;
  hot: boolean;
  description: string;
  products: {
    _id: string;
    fullName: string;
    cost: number;
  }[];
  createAt: Date;
}

export interface CreateCategory {
  name: string;
  hot: boolean;
}

export interface ProductAdditionToCategory {
  categoryId: string;
  productId: string[];
}
