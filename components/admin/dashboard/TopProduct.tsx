// "use client";
// import TableNoSort from "@/components/shared/table/TableNoSort";

// const TopProduct = ({ orderData }: { orderData: Order[] | null }) => {
//   if (!orderData || orderData === null) {
//     return (
//       <div className="overflow-x-auto shadow-md rounded-lg bg-white flex items-center justify-center min-h-[400px]">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   // Hàm tính toán top sản phẩm bán chạy nhất
//   const getTopProductsBySales = (orders: any[], top: number = 5) => {
//     const productSales: Record<
//       string,
//       { name: string; quantity: number; image: string }
//     > = {};

//     orders.forEach((order) => {
//       order.products.forEach((productDetail: any) => {
//         const product = productDetail.product;
//         const productId = product._id;
//         const productName = product.name;
//         const productImage = product.files[0]?.url || ""; // Lấy hình ảnh đầu tiên
//         const quantity = productDetail.quantity;

//         if (!productSales[productId]) {
//           productSales[productId] = {
//             name: productName,
//             quantity: 0,
//             image: productImage,
//           };
//         }

//         productSales[productId].quantity += quantity;
//       });
//     });

//     // Chuyển object thành mảng, sắp xếp và lấy top sản phẩm
//     return Object.entries(productSales)
//       .map(([id, { name, quantity, image }]) => ({ id, name, quantity, image }))
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, top);
//   };

//   // Gọi hàm và lấy kết quả
//   const topProducts = getTopProductsBySales(orderData);

//   // Render từng dòng của bảng
//   const renderRow = (item: any) => {
//     return (
//       <tr
//         key={item.id}
//         className="border-t border-gray-200 my-4 text-sm dark:text-dark-360 hover:bg-gray-100"
//       >
//         <td className="px-4 py-3">
//           <img
//             src={item.image}
//             alt={item.name}
//             className="w-12 h-12 object-cover rounded-lg"
//           />
//         </td>
//         <td className="px-4 py-3">{item.name || ""}</td>
//         <td className="px-4 py-3 hidden md:table-cell">{item.quantity}</td>
//       </tr>
//     );
//   };

//   // Cột hiển thị trong bảng
//   const columns = [
//     { header: "Image", accessor: "image" },
//     { header: "Product Name", accessor: "name" },
//     { header: "Quantity Sold", accessor: "quantity" },
//   ];

//   return (
//     <div className="overflow-x-auto shadow-md rounded-lg bg-white">
//       <TableNoSort columns={columns} data={topProducts} renderRow={renderRow} />
//     </div>
//   );
// };

// export default TopProduct;

"use client";
import { Package, TrendingUp } from "lucide-react";
import Image from "next/image";

interface TopProductProps {
  orderData: Order[] | null;
  loading?: boolean;
}

interface ProductSale {
  id: string;
  name: string;
  quantity: number;
  image: string;
  revenue: number;
}

const TopProduct = ({ orderData, loading }: TopProductProps) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orderData || orderData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Products
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Package className="w-12 h-12 mb-3 opacity-20" />
          <p>No product data available</p>
        </div>
      </div>
    );
  }

  const getTopProductsBySales = (
    orders: any[],
    top: number = 5
  ): ProductSale[] => {
    const productSalesMap: Record<
      string,
      {
        name: string;
        quantity: number;
        image: string;
        revenue: number;
      }
    > = {};

    orders.forEach((order) => {
      if (!order.products || !Array.isArray(order.products)) return;

      order.products.forEach((productDetail: any) => {
        if (!productDetail?.product) return;

        const product = productDetail.product;
        const productId = product._id;
        const productName = product.name || "Unknown Product";
        const productImage = product.files?.[0]?.url || "";
        const quantity = productDetail.quantity || 0;
        const revenue = (product.cost || 0) * quantity;

        if (!productSalesMap[productId]) {
          productSalesMap[productId] = {
            name: productName,
            quantity: 0,
            image: productImage,
            revenue: 0,
          };
        }

        productSalesMap[productId].quantity += quantity;
        productSalesMap[productId].revenue += revenue;
      });
    });

    // Convert to array and sort
    return Object.entries(productSalesMap)
      .map(([id, data]) => ({
        id,
        name: data.name,
        quantity: data.quantity,
        image: data.image,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, top);
  };

  const topProducts = getTopProductsBySales(orderData);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Products
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Best selling items this month
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary-100" />
        </div>
      </div>

      <div className="p-6">
        {topProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No products sold yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary-100 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-100 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue: {(item.revenue / 1000000).toFixed(1)}M ₫
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {item.quantity}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    sold
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProduct;
