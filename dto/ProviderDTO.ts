export interface CreateProvider {
  name: string;
  address: string;
  contact: string;
  representativeName: string;
  city: string;
  country: string;
}

export interface Provider {
  _id: string;
  name: string;
  address: string;
  representativeName: string;
  createAt: Date;
  contact: string;
  city: string;
  country: string;
  email: string;
}
