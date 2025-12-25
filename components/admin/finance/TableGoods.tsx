"use client";
import TableInvoice from "@/components/shared/table/TableInvoice";
import TableNoSort from "@/components/shared/table/TableNoSort";
import TableNoSortIndex from "@/components/shared/table/TableNoSortIndex";
import { formatCurrency } from "@/lib/utils";

const TableGoods = ({ orderData }: { orderData: Order[] }) => {
  if (!orderData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  console.log(orderData);
  // Hàm tính toán top sản phẩm bán chạy nhất
  const getTopProductsBySales = (orders: any[], top: number = 5) => {
    const productSales: Record<
      string,
      { name: string; quantity: number; image: string; profit: number } // Thêm profit vào Record
    > = {};

    orders.forEach((order) => {
      order.products.forEach((productDetail: any) => {
        const product = productDetail.product;
        const productId = product._id;
        const productName = product.name;
        const productImage = product.files[0]?.url || ""; // Lấy hình ảnh đầu tiên
        const quantity = productDetail.quantity;
        const productCost = product.cost; // Lấy giá cost của sản phẩm

        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            quantity: 0,
            image: productImage,
            profit: 0 // Khởi tạo profit
          };
        }

        // Cập nhật số lượng và tính lợi nhuận
        productSales[productId].quantity += quantity;
        productSales[productId].profit += productCost * quantity; // Tính lợi nhuận
      });
    });

    // Chuyển object thành mảng, sắp xếp và lấy top sản phẩm theo số lượng
    return Object.entries(productSales)
      .map(([id, { name, quantity, image, profit }]) => ({
        id,
        name,
        quantity,
        image,
        profit
      }))
      .sort((a, b) => b.quantity - a.quantity) // Sắp xếp theo số lượng
      .slice(0, top);
  };

  // Gọi hàm và lấy kết quả
  const topProducts = getTopProductsBySales(orderData);

  // Render từng dòng của bảng
  const renderRow = (item: any, index: number) => {
    return (
      <tr
        key={index}
        className="border-t border-gray-200 my-4 text-sm dark:text-dark-360 hover:bg-gray-100"
      >
        <td className="px-4 py-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
        </td>
        <td className="px-4 py-3">{item.name || ""}</td>
        <td className="px-4 py-3 hidden md:table-cell">{item.quantity}</td>
        <td className="px-4 py-3 hidden md:table-cell">
          {formatCurrency(item.profit)}
        </td>
      </tr>
    );
  };

  // Cột hiển thị trong bảng
  const columns = [
    { header: "Image", accessor: "image" },
    { header: "Product Name", accessor: "name" },
    { header: "Quantity Sold", accessor: "quantity" },
    { header: "Profit", accessor: "profit" }
  ];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <TableNoSortIndex
        columns={columns}
        data={topProducts}
        renderRow={renderRow}
      />
    </div>
  );
};

export default TableGoods;
