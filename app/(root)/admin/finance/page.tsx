"use client";
import { TotalCostGoods } from "@/components/admin/finance/BarChart";
import { LineChart } from "@/components/admin/finance/LineChart";
import { TopImportedProduct } from "@/components/admin/finance/PieChart";
import TableGoods from "@/components/admin/finance/TableGoods";
import LabelAnalytics from "@/components/card/finance/LabelCard";
import { CretaeFinance } from "@/dto/FinaceDTO";
import { fetchFinance } from "@/lib/service/finance.service";
import { fetchImport } from "@/lib/service/import.service";
import { fetchOrder } from "@/lib/service/order.service";
import React, { useEffect, useState } from "react";

interface labelProps {
  icon: string;
  title: string; // Title text
  value: number; // Numeric value
  width: string;
}

const Page = () => {
  const [orderData, setOrderData] = useState<Order[] | null>(null);
  const [importData, setImportData] = useState<any[] | null>(null);
  const [financeData, setFinanceData] = React.useState<CretaeFinance[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    const loadOrder = async () => {
      try {
        const data = await fetchOrder();
        if (isMounted) {
          setOrderData(data || []);
        }
      } catch (error) {
        console.error("Error loading Order:", error);
        if (isMounted) {
          setOrderData([]);
        }
      }
    };

    const loadFinance = async () => {
      try {
        const data = await fetchFinance();
        if (isMounted) {
          setFinanceData((data || []) as CretaeFinance[]);
        }
      } catch (error) {
        console.error("Error loading Finance:", error);
        if (isMounted) {
          setFinanceData([]);
        }
      }
    };

    const loadImport = async () => {
      try {
        const data = await fetchImport();
        if (isMounted) {
          setImportData(data || []);
        }
      } catch (error) {
        console.error("Error loading Import:", error);
        if (isMounted) {
          setImportData([]);
        }
      }
    };

    // Load all data in parallel
    Promise.all([loadOrder(), loadFinance(), loadImport()]).then(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Tính toán formattedData và total - phải đặt trước return có điều kiện
  const result = React.useMemo(() => {
    if (!financeData || financeData.length === 0) {
      return {};
    }
    return financeData.reduce((acc: any, item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, income: 0, outcome: 0 };
      }

      // Cộng dồn giá trị dựa trên type (income hoặc outcome)
      if (item.type === "income") {
        acc[date].income += item.value;
      } else if (item.type === "outcome") {
        acc[date].outcome += item.value;
      }

      return acc;
    }, {});
  }, [financeData]);

  // Chuyển đổi đối tượng thành mảng
  const formattedData = React.useMemo(() => Object.values(result), [result]);

  const total = React.useMemo(
    () => ({
      income: formattedData.reduce((acc, curr: any) => acc + curr.income, 0),
      outcome: formattedData.reduce((acc, curr: any) => acc + curr.outcome, 0)
    }),
    [formattedData]
  );

  if (isLoading || orderData === null || financeData === null || importData === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }
  const labelData: labelProps[] = [
    {
      icon: "solar:sale-outline",
      title: "Total Revenue",
      value: Number(total.income),
      width: "w-[358px]"
    },
    {
      icon: "solar:sale-outline",
      title: "Total Profit",
      value: Number(total.income) - Number(total.outcome),
      width: "w-[358px]"
    },
    {
      icon: "solar:sale-outline",
      title: "Overall Expense",
      value: Number(total.outcome),
      width: "w-[358px]"
    }
  ];

  // Hàm tính toán top sản phẩm bán chạy nhất
  const getTopProductsBySales = (orders: any[], top: number = 5) => {
    const productSales: Record<
      string,
      { name: string; quantity: number; color: string }
    > = {};

    // Hàm tạo mã màu từ productId (có thể dùng hash hoặc ngẫu nhiên)
    const generateColor = (id: string): string => {
      // Tạo mã màu từ hash của id (cách cơ bản)
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
        (hash >> 16) &
        0xff
      )
        .toString(16)
        .padStart(2, "0")}${((hash >> 8) & 0xff)
        .toString(16)
        .padStart(2, "0")}`;
      return color;
    };

    orders.forEach((order) => {
      order.products.forEach((productDetail: any) => {
        const product = productDetail.product;
        const productId = product._id;
        const productName = product.name;
        const quantity = productDetail.quantity;

        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            quantity: 0,
            color: generateColor(productId) // Sinh mã màu dựa trên productId
          };
        }

        productSales[productId].quantity += quantity;
      });
    });

    // Chuyển object thành mảng, sắp xếp và lấy top sản phẩm
    return Object.entries(productSales)
      .map(([id, { name, quantity, color }]) => ({ id, name, quantity, color }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, top);
  };

  function getTop5ProductsByQuantity(importData: any[]) {
    // Kiểm tra nếu mảng có phần tử hợp lệ
    if (!importData || !Array.isArray(importData)) {
      throw new Error("Invalid import data structure");
    }

    // Gộp tất cả sản phẩm từ các phần tử trong mảng `importData`
    const allProducts = importData
      .flatMap((data) => data.products || []) // Lấy `products` từ mỗi phần tử
      .filter((product: any) => product?.product?.name && product?.quantity); // Lọc sản phẩm hợp lệ

    // Lọc ra sản phẩm duy nhất theo `product._id`
    const uniqueProducts = Array.from(
      new Map(
        allProducts.map((product: any) => [product.product._id, product])
      ).values()
    );

    // Sắp xếp các sản phẩm theo số lượng giảm dần
    const sortedProducts = uniqueProducts.sort(
      (a: any, b: any) => b.quantity - a.quantity
    );

    // Danh sách màu cố định hoặc tạo màu động
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F39C12", "#8E44AD"];

    // Lấy 5 sản phẩm đầu tiên và gán màu
    return sortedProducts.slice(0, 5).map((product: any, index: number) => ({
      id: product.product._id,
      name: product.product.name,
      quantity: product.quantity,
      color: colors[index % colors.length] // Lấy màu theo thứ tự
    }));
  }

  const topImportedProducts = getTop5ProductsByQuantity(importData);
  console.log(topImportedProducts);
  const topProducts = getTopProductsBySales(orderData);
  return (
    <div className="flex flex-col w-full h-full p-4 gap-6">
      <div className="flex flex-row items-center justify-between">
        {labelData.map((item) => (
          <LabelAnalytics param={item} key={item.title} />
        ))}
      </div>
      <div>
        <LineChart formattedData={formattedData} />
      </div>
      <div className="grid grid-cols-2 gap-x-8">
        <TotalCostGoods total={topProducts} />
        <TopImportedProduct total={topImportedProducts} />
      </div>
      <div>
        <TableGoods orderData={orderData} />
      </div>
    </div>
  );
};

export default Page;
