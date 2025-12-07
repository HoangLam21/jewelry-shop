import { FileContent } from "./ProductDTO";

export interface CreateRatingDTO {
  productId: string;
  point: number;
  content: string;
  images?: FileContent[];
}
