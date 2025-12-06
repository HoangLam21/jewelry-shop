export interface Voucher {
  _id: string;
  name: string;
  discount: number;
  expDate: Date;
}

export interface CreateVoucher {
  name: string;
  discount: number;
  expDate: Date;
}
