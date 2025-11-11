interface Order {
  _id: string;
  cost: number;
  discount: number;
  details: {
    additionalProp1: {
      material: string;
      size: string;
      quantity: number;
    };
    additionalProp2: {
      material: string;
      size: string;
      quantity: number;
    };
    additionalProp3: {
      material: string;
      size: string;
      quantity: number;
    };
  };
  status: string;
  shippingMethod: string;
  ETD: string;
  customer: string;
  staff: string;
  createAt: string;
}

interface CustomerResponse {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  point: number;
  sales: number;
  orders: Order[];
}

interface CreateCustomer {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}
