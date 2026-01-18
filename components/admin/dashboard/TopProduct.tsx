"use client";
import TableNoSort from "@/components/shared/table/TableNoSort";

const TopProduct = ({ orderData }: { orderData: Order[] | null }) => {
  if (!orderData || orderData === null) {
    return (
      <div className="overflow-x-auto shadow-md rounded-lg bg-white flex items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  // Hàm tính toán top sản phẩm bán chạy nhất
  const getTopProductsBySales = (orders: any[], top: number = 5) => {
    const productSales: Record<
      string,
      { name: string; quantity: number; image: string }
    > = {};

    orders.forEach((order) => {
      order.products.forEach((productDetail: any) => {
        const product = productDetail.product;
        const productId = product._id;
        const productName = product.name;
        const productImage = product.files[0]?.url || ""; // Lấy hình ảnh đầu tiên
        const quantity = productDetail.quantity;

        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            quantity: 0,
            image: productImage,
          };
        }

        productSales[productId].quantity += quantity;
      });
    });

    // Chuyển object thành mảng, sắp xếp và lấy top sản phẩm
    return Object.entries(productSales)
      .map(([id, { name, quantity, image }]) => ({ id, name, quantity, image }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, top);
  };

  // Gọi hàm và lấy kết quả
  const topProducts = getTopProductsBySales(orderData);

  // Render từng dòng của bảng
  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
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
      </tr>
    );
  };

  // Cột hiển thị trong bảng
  const columns = [
    { header: "Image", accessor: "image" },
    { header: "Product Name", accessor: "name" },
    { header: "Quantity Sold", accessor: "quantity" },
  ];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white">
      <TableNoSort columns={columns} data={topProducts} renderRow={renderRow} />
    </div>
  );
};

export default TopProduct;
