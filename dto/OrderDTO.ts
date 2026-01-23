import { number } from "zod";

export interface Order {
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

export interface CreateOrder {
  cost: number;
  discount: number;
  details: {
    id: string;
    material: string;
    size: string;
    unitPrice: number;
    quantity: number;
    discount: string;
  }[];
  status: string;
  shippingMethod: string;
  ETD: Date;
  customer: string;
  staff?: string;
}

export interface DetailOrder {
  id: string;
  material: string;
  size: string;
  unitPrice: number;
  quantity: number;
  discount: string;
}

export interface UpdateStatusOrder {
  orderId: string;
  status: string;
}
