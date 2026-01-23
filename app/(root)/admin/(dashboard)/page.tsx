"use client";
import { Chart } from "@/components/admin/dashboard/Chart";
import TopProduct from "@/components/admin/dashboard/TopProduct";
import TopSeller from "@/components/admin/dashboard/TopSeller";
import { fetchOrder } from "@/lib/service/order.service";
import React, { useEffect, useState } from "react";
import { TrendingUp, Package, Users, DollarSign } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  loading?: boolean;
}

const StatCard = ({ title, value, icon, trend, loading }: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </span>
        <div className="p-2 bg-primary-100/10 rounded-lg">{icon}</div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const [orderData, setOrderData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrder();

        if (isMounted && data) {
          setOrderData(data);

          // Calculate stats - với type assertion rõ ràng
          if (Array.isArray(data) && data.length > 0) {
            const totalRevenue = data.reduce(
              (sum: number, order: any) => sum + (order?.cost || 0),
              0
            );

            const customerIds = data
              .map((order: any) => order?.customer?._id)
              .filter((id): id is string => !!id);
            const uniqueCustomers = new Set(customerIds).size;

            const totalProductsSold = data.reduce((sum: number, order: any) => {
              const products = order?.products;
              if (!products || !Array.isArray(products)) return sum;

              const orderTotal = products.reduce(
                (pSum: number, p: any) => pSum + (p?.quantity || 0),
                0
              );
              return sum + orderTotal;
            }, 0);

            setStats({
              totalOrders: data.length,
              totalRevenue,
              totalProducts: totalProductsSold,
              totalCustomers: uniqueCustomers,
            });
          }
        }
      } catch (error) {
        console.error("Error loading Order:", error);
        if (isMounted) {
          setOrderData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadOrder();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4 lg:p-6 gap-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Package className="w-5 h-5 text-primary-100" />}
          trend="+12% from last month"
          loading={loading}
        />
        <StatCard
          title="Revenue"
          value={`${stats.totalRevenue.toLocaleString("vi-VN")} VND`}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          trend="+8% from last month"
          loading={loading}
        />
        <StatCard
          title="Products Sold"
          value={stats.totalProducts}
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          trend="+15% from last month"
          loading={loading}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          trend="+5% from last month"
          loading={loading}
        />
      </div>

      {/* Chart Section */}
      <div className="w-full">
        <Chart />
      </div>

      {/* Top Sellers and Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <TopSeller orderData={orderData} loading={loading} />
        <TopProduct orderData={orderData} loading={loading} />
      </div>
    </div>
  );
};

export default Page;
