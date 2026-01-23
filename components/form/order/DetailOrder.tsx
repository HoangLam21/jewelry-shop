import React from "react";
import MyButton from "@/components/shared/button/MyButton";
import {
  X,
  Package,
  Truck,
  Calendar,
  Tag,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

interface OrderDetailModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder: (orderId: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onCancelOrder,
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const calculateSubtotal = () => {
    return (
      order?.products?.reduce((total: number, item: any) => {
        return total + item.product.cost * item.quantity;
      }, 0) || 0
    );
  };

  const subtotal = calculateSubtotal();
  const discount = order?.discount || 0;
  const total = order?.cost || 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="background-light800_dark400 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary-100" />
              <div>
                <h2 className="text-2xl font-bold text-dark100_light500">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  #{order?._id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-dark100_light500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Status */}
              <div className="bg-gray-50 dark:bg-dark-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order?.status
                  )}`}
                >
                  {order?.status}
                </span>
              </div>

              {/* Shipping Method */}
              <div className="bg-gray-50 dark:bg-dark-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Shipping Method
                  </span>
                </div>
                <p className="text-lg font-semibold text-dark100_light500 capitalize">
                  {order?.shippingMethod}
                </p>
              </div>

              {/* ETD */}
              <div className="bg-gray-50 dark:bg-dark-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Estimated Delivery
                  </span>
                </div>
                <p className="text-lg font-semibold text-dark100_light500">
                  {new Date(order?.ETD).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Total Cost */}
              <div className="bg-gray-50 dark:bg-dark-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Cost
                  </span>
                </div>
                <p className="text-lg font-bold text-primary-100">
                  {order?.cost.toLocaleString()} VND
                </p>
              </div>
            </div>

            {/* Products List */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-dark100_light500 mb-4">
                Products
              </h3>
              {order?.products && order.products.length > 0 ? (
                <div className="space-y-4">
                  {order.products.map((detail: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-dark-300 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={
                              detail?.product.files[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={detail?.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg text-dark100_light500 mb-2 truncate">
                            {detail?.product.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400">
                                Material:
                              </span>
                              <span className="font-medium text-dark100_light500">
                                {detail?.material}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400">
                                Size:
                              </span>
                              <span className="font-medium text-dark100_light500">
                                {detail?.size}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400">
                                Quantity:
                              </span>
                              <span className="font-medium text-dark100_light500">
                                x{detail?.quantity}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400">
                                Price:
                              </span>
                              <span className="font-semibold text-primary-100">
                                {(
                                  detail?.product.cost * detail?.quantity
                                ).toLocaleString()}{" "}
                                VND
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No products found for this order.</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-dark-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-dark100_light500 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-dark100_light500">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString()} VND
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Discount ({discount}%)</span>
                    </div>
                    <span className="font-medium">
                      -{((subtotal * discount) / 100).toLocaleString()} VND
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-dark100_light500">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-100">
                      {total.toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-400">
            {order?.status === "pending" && (
              <MyButton
                title="Cancel Order"
                background="bg-red-500 hover:bg-red-600"
                text_color="text-white"
                width="w-auto"
                event={() => onCancelOrder(order._id)}
              />
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-300 dark:bg-gray-700 text-dark100_light500 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;
