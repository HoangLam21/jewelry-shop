// import { NextApiRequest, NextApiResponse } from "next";
// import { addProductsToCart } from "@/lib/actions/cart.action";

// interface CartProduct {
//     productId: string;
//     quantity: number;
// }

// interface RequestBody {
//     userId: string;
//     products: CartProduct[];
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "POST") {
//         try {
//             // Validate request body
//             const { userId, products } = req.body as RequestBody;

//             if (!userId) {
//                 return res.status(400).json({ error: "userId is required" });
//             }

//             if (
//                 !products ||
//                 !Array.isArray(products) ||
//                 products.length === 0
//             ) {
//                 return res.status(400).json({
//                     error: "products array is required and cannot be empty",
//                 });
//             }

//             // Validate each product in the array
//             for (const product of products) {
//                 if (
//                     !product.productId ||
//                     typeof product.quantity !== "number" ||
//                     product.quantity <= 0
//                 ) {
//                     return res.status(400).json({
//                         error: "Each product must have a valid productId and quantity greater than 0",
//                     });
//                 }
//             }

//             const cart = await addProductsToCart(userId, products);
//             return res.status(201).json(cart);
//         } catch (error) {
//             console.error("Error adding products to cart: ", error);
//             return res
//                 .status(500)
//                 .json({ error: "Failed to add products to cart" });
//         }
//     } else {
//         return res.status(405).json({ error: "Method not allowed" });
//     }
// }