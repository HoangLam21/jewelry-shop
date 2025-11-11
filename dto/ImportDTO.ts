export interface Import {
  id: string;
  suplier: {
    id: string;
    phoneNumber: string;
    fullname: string;
    address: string;
  };
  invoice: {
    id: string;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    discount: number;
  }[];
  status: boolean;
  createAt: Date;
  createBy: string;
}

export interface Invoice {
  id: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  discount: number;
}

export interface CreateImport {
  staff: string;
  provider: string;
  details: {
    id: string;
    material: string;
    size: string;
    unitPrice: number;
    quantity: number;
    discount: string;
  }[];
}
