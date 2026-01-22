// "use client";
// import { TotalCostGoods } from "@/components/admin/finance/BarChart";
// import { LineChart } from "@/components/admin/finance/LineChart";
// import { TopImportedProduct } from "@/components/admin/finance/PieChart";
// import TableGoods from "@/components/admin/finance/TableGoods";
// import LabelAnalytics from "@/components/card/finance/LabelCard";
// import { CretaeFinance } from "@/dto/FinaceDTO";
// import { fetchFinance } from "@/lib/service/finance.service";
// import { fetchImport } from "@/lib/service/import.service";
// import { fetchOrder } from "@/lib/service/order.service";
// import React, { useEffect, useState } from "react";

// interface labelProps {
//   icon: string;
//   title: string; // Title text
//   value: number; // Numeric value
//   width: string;
// }

// const Page = () => {
//   const [orderData, setOrderData] = useState<Order[] | null>(null);
//   const [importData, setImportData] = useState<any[] | null>(null);
//   const [financeData, setFinanceData] = React.useState<CretaeFinance[] | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;
//     setIsLoading(true);

//     const loadOrder = async () => {
//       try {
//         const data = await fetchOrder();
//         if (isMounted) {
//           setOrderData(data || []);
//         }
//       } catch (error) {
//         console.error("Error loading Order:", error);
//         if (isMounted) {
//           setOrderData([]);
//         }
//       }
//     };

//     const loadFinance = async () => {
//       try {
//         const data = await fetchFinance();
//         if (isMounted) {
//           setFinanceData((data || []) as CretaeFinance[]);
//         }
//       } catch (error) {
//         console.error("Error loading Finance:", error);
//         if (isMounted) {
//           setFinanceData([]);
//         }
//       }
//     };

//     const loadImport = async () => {
//       try {
//         const data = await fetchImport();
//         if (isMounted) {
//           setImportData(data || []);
//         }
//       } catch (error) {
//         console.error("Error loading Import:", error);
//         if (isMounted) {
//           setImportData([]);
//         }
//       }
//     };

//     // Load all data in parallel
//     Promise.all([loadOrder(), loadFinance(), loadImport()]).then(() => {
//       if (isMounted) {
//         setIsLoading(false);
//       }
//     });

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Tính toán formattedData và total - phải đặt trước return có điều kiện
//   const result = React.useMemo(() => {
//     if (!financeData || financeData.length === 0) {
//       return {};
//     }
//     return financeData.reduce((acc: any, item) => {
//       const date = new Date(item.date).toISOString().split("T")[0];
//       if (!acc[date]) {
//         acc[date] = { date, income: 0, outcome: 0 };
//       }

//       // Cộng dồn giá trị dựa trên type (income hoặc outcome)
//       if (item.type === "income") {
//         acc[date].income += item.value;
//       } else if (item.type === "outcome") {
//         acc[date].outcome += item.value;
//       }

//       return acc;
//     }, {});
//   }, [financeData]);

//   // Chuyển đổi đối tượng thành mảng
//   const formattedData = React.useMemo(() => Object.values(result), [result]);

//   const total = React.useMemo(
//     () => ({
//       income: formattedData.reduce((acc, curr: any) => acc + curr.income, 0),
//       outcome: formattedData.reduce((acc, curr: any) => acc + curr.outcome, 0),
//     }),
//     [formattedData]
//   );

//   if (
//     isLoading ||
//     orderData === null ||
//     financeData === null ||
//     importData === null
//   ) {
//     return (
//       <div className="flex h-screen w-screen items-center justify-center bg-white">
//         <div className="loader"></div>
//       </div>
//     );
//   }
//   const labelData: labelProps[] = [
//     {
//       icon: "solar:sale-outline",
//       title: "Total Revenue",
//       value: Number(total.income),
//       width: "w-[358px]",
//     },
//     {
//       icon: "solar:sale-outline",
//       title: "Total Profit",
//       value: Number(total.income) - Number(total.outcome),
//       width: "w-[358px]",
//     },
//     {
//       icon: "solar:sale-outline",
//       title: "Overall Expense",
//       value: Number(total.outcome),
//       width: "w-[358px]",
//     },
//   ];

//   // Hàm tính toán top sản phẩm bán chạy nhất
//   const getTopProductsBySales = (orders: any[], top: number = 5) => {
//     const productSales: Record<
//       string,
//       { name: string; quantity: number; color: string }
//     > = {};

//     // Hàm tạo mã màu từ productId (có thể dùng hash hoặc ngẫu nhiên)
//     const generateColor = (id: string): string => {
//       // Tạo mã màu từ hash của id (cách cơ bản)
//       let hash = 0;
//       for (let i = 0; i < id.length; i++) {
//         hash = id.charCodeAt(i) + ((hash << 5) - hash);
//       }
//       const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
//         (hash >> 16) &
//         0xff
//       )
//         .toString(16)
//         .padStart(2, "0")}${((hash >> 8) & 0xff)
//         .toString(16)
//         .padStart(2, "0")}`;
//       return color;
//     };

//     orders.forEach((order) => {
//       order.products.forEach((productDetail: any) => {
//         const product = productDetail.product;
//         const productId = product._id;
//         const productName = product.name;
//         const quantity = productDetail.quantity;

//         if (!productSales[productId]) {
//           productSales[productId] = {
//             name: productName,
//             quantity: 0,
//             color: generateColor(productId), // Sinh mã màu dựa trên productId
//           };
//         }

//         productSales[productId].quantity += quantity;
//       });
//     });

//     // Chuyển object thành mảng, sắp xếp và lấy top sản phẩm
//     return Object.entries(productSales)
//       .map(([id, { name, quantity, color }]) => ({ id, name, quantity, color }))
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, top);
//   };

//   function getTop5ProductsByQuantity(importData: any[]) {
//     // Kiểm tra nếu mảng có phần tử hợp lệ
//     if (!importData || !Array.isArray(importData)) {
//       throw new Error("Invalid import data structure");
//     }

//     // Gộp tất cả sản phẩm từ các phần tử trong mảng `importData`
//     const allProducts = importData
//       .flatMap((data) => data.products || []) // Lấy `products` từ mỗi phần tử
//       .filter((product: any) => product?.product?.name && product?.quantity); // Lọc sản phẩm hợp lệ

//     // Lọc ra sản phẩm duy nhất theo `product._id`
//     const uniqueProducts = Array.from(
//       new Map(
//         allProducts.map((product: any) => [product.product._id, product])
//       ).values()
//     );

//     // Sắp xếp các sản phẩm theo số lượng giảm dần
//     const sortedProducts = uniqueProducts.sort(
//       (a: any, b: any) => b.quantity - a.quantity
//     );

//     // Danh sách màu cố định hoặc tạo màu động
//     const colors = ["#FF5733", "#33FF57", "#3357FF", "#F39C12", "#8E44AD"];

//     // Lấy 5 sản phẩm đầu tiên và gán màu
//     return sortedProducts.slice(0, 5).map((product: any, index: number) => ({
//       id: product.product._id,
//       name: product.product.name,
//       quantity: product.quantity,
//       color: colors[index % colors.length], // Lấy màu theo thứ tự
//     }));
//   }

//   const topImportedProducts = getTop5ProductsByQuantity(importData);
//   console.log(topImportedProducts);
//   const topProducts = getTopProductsBySales(orderData);
//   return (
//     <div className="flex flex-col w-full h-full p-4 gap-6">
//       <div className="flex flex-row items-center justify-between">
//         {labelData.map((item) => (
//           <LabelAnalytics param={item} key={item.title} />
//         ))}
//       </div>
//       <div>
//         <LineChart formattedData={formattedData} />
//       </div>
//       <div className="grid grid-cols-2 gap-x-8">
//         <TotalCostGoods total={topProducts} />
//         <TopImportedProduct total={topImportedProducts} />
//       </div>
//       <div>
//         <TableGoods orderData={orderData} />
//       </div>
//     </div>
//   );
// };

// export default Page;
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
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

interface labelProps {
  icon: string;
  title: string;
  value: number;
  width: string;
}

const Page = () => {
  const [orderData, setOrderData] = useState<any[] | null>(null);
  const [importData, setImportData] = useState<any[] | null>(null);
  const [financeData, setFinanceData] = React.useState<CretaeFinance[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

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

    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([loadOrder(), loadFinance(), loadImport()]);
      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  const result = React.useMemo(() => {
    if (!financeData || financeData.length === 0) {
      return {};
    }
    return financeData.reduce((acc: any, item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, income: 0, outcome: 0 };
      }

      if (item.type === "income") {
        acc[date].income += item.value;
      } else if (item.type === "outcome") {
        acc[date].outcome += item.value;
      }

      return acc;
    }, {});
  }, [financeData]);

  const formattedData = React.useMemo(() => Object.values(result), [result]);

  const total = React.useMemo(
    () => ({
      income: formattedData.reduce((acc, curr: any) => acc + curr.income, 0),
      outcome: formattedData.reduce((acc, curr: any) => acc + curr.outcome, 0),
    }),
    [formattedData]
  );

  if (
    isLoading ||
    orderData === null ||
    financeData === null ||
    importData === null
  ) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-100 dark:to-dark-200">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-gray-600 dark:text-dark-360 font-medium animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const labelData: labelProps[] = [
    {
      icon: "solar:dollar-minimalistic-outline",
      title: "Total Revenue",
      value: Number(total.income),
      width: "w-full",
    },
    {
      icon: "solar:graph-up-outline",
      title: "Total Profit",
      value: Number(total.income) - Number(total.outcome),
      width: "w-full",
    },
    {
      icon: "solar:chart-square-outline",
      title: "Overall Expense",
      value: Number(total.outcome),
      width: "w-full",
    },
  ];

  const getTopProductsBySales = (orders: any[], top: number = 5) => {
    const productSales: Record<
      string,
      { name: string; quantity: number; color: string }
    > = {};

    const generateColor = (id: string): string => {
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
            color: generateColor(productId),
          };
        }

        productSales[productId].quantity += quantity;
      });
    });

    return Object.entries(productSales)
      .map(([id, { name, quantity, color }]) => ({ id, name, quantity, color }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, top);
  };

  function getTop5ProductsByQuantity(importData: any[]) {
    if (!importData || !Array.isArray(importData)) {
      throw new Error("Invalid import data structure");
    }

    const allProducts = importData
      .flatMap((data) => data.products || [])
      .filter((product: any) => product?.product?.name && product?.quantity);

    const uniqueProducts = Array.from(
      new Map(
        allProducts.map((product: any) => [product.product._id, product])
      ).values()
    );

    const sortedProducts = uniqueProducts.sort(
      (a: any, b: any) => b.quantity - a.quantity
    );

    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F39C12", "#8E44AD"];

    return sortedProducts.slice(0, 5).map((product: any, index: number) => ({
      id: product.product._id,
      name: product.product.name,
      quantity: product.quantity,
      color: colors[index % colors.length],
    }));
  }

  const topImportedProducts = getTop5ProductsByQuantity(importData);
  const topProducts = getTopProductsBySales(orderData);

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-6 lg:p-8 gap-6 bg-gray-50 dark:bg-dark-100 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-360">
            Financial Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-dark-360 mt-1">
            Overview of your financial performance
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
          <Icon icon="tabler:download" width={20} height={20} />
          <span className="hidden md:inline">Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {labelData.map((item, index) => (
          <div
            key={item.title}
            className="group relative bg-white dark:bg-dark-110 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-dark-200 overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-dark-360 font-medium mb-2">
                  {item.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-360">
                  ${item.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Icon
                    icon={
                      index === 0
                        ? "tabler:trending-up"
                        : index === 1
                          ? "tabler:trending-up"
                          : "tabler:trending-down"
                    }
                    width={16}
                    height={16}
                    className={index === 2 ? "text-red-500" : "text-green-500"}
                  />
                  <span
                    className={`text-xs font-medium ${
                      index === 2
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {index === 2 ? "12.5%" : "23.5%"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-dark-360">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  index === 0
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : index === 1
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-orange-100 dark:bg-orange-900/30"
                }`}
              >
                <Icon
                  icon={item.icon}
                  width={24}
                  height={24}
                  className={
                    index === 0
                      ? "text-blue-600 dark:text-blue-400"
                      : index === 1
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart Section */}
      <div className="bg-white dark:bg-dark-110 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-360">
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-dark-360 mt-1">
              Income vs Expenses over time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
              This Month
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-dark-360 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-lg transition-colors">
              Last Month
            </button>
          </div>
        </div>
        <LineChart formattedData={formattedData} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-110 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="tabler:chart-bar"
              width={24}
              height={24}
              className="text-blue-600 dark:text-blue-400"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-360">
              Top Selling Products
            </h2>
          </div>
          <TotalCostGoods total={topProducts} />
        </div>

        <div className="bg-white dark:bg-dark-110 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="tabler:chart-pie"
              width={24}
              height={24}
              className="text-purple-600 dark:text-purple-400"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-360">
              Top Imported Products
            </h2>
          </div>
          <TopImportedProduct total={topImportedProducts} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-dark-110 rounded-xl shadow-sm border border-gray-100 dark:border-dark-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-dark-200">
          <div className="flex items-center gap-2">
            <Icon
              icon="tabler:table"
              width={24}
              height={24}
              className="text-gray-600 dark:text-dark-360"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-360">
              Recent Orders
            </h2>
          </div>
        </div>
        <TableGoods orderData={orderData} />
      </div>
    </div>
  );
};

export default Page;
