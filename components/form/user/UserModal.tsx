import { fetchOrder, deleteOrder } from "@/lib/service/order.service";
import React, { useEffect, useState } from "react";
import MyButton from "@/components/shared/button/MyButton";
import OrderDetailModal from "../order/DetailOrder";
import { ShoppingBag, Package, Clock, X } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
}

// Helper function to get user from localStorage
const getUserFromLocalStorage = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData) as User;
    }
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
  }
  return null;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const [user] = useState<User | null>(() => getUserFromLocalStorage());
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch orders when modal opens
  useEffect(() => {
    console.log("userrrr", user);
    if (!isOpen || !user?._id) {
      return;
    }

    let isMounted = true;
    const getAllOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrder();
        if (isMounted) {
          setOrdersData(data);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    getAllOrders();
    return () => {
      isMounted = false;
    };
  }, [isOpen, user?._id]);

  // Filter orders by current user
  useEffect(() => {
    if (user?._id && ordersData.length > 0) {
      const filtered = ordersData.filter(
        (order) => order.customer._id === user._id
      );
      setFilteredOrders(filtered);
    }
  }, [user, ordersData]);

  const handleOrderDetailClick = (order: any) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      handleCloseOrderModal();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

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

  if (!isOpen) return null;

  // Don't render if user is not logged in
  if (!user?._id) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="background-light800_dark400 text-dark100_light500 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Login Required</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please login to view your purchase history
            </p>
            <button
              onClick={onClose}
              className="bg-primary-100 text-white px-6 py-2 rounded-lg hover:bg-primary-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 right-0 w-full sm:w-[480px] h-full background-light800_dark400 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary-100" />
            <h2 className="text-2xl font-bold text-dark100_light500">
              Purchase History
            </h2>
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
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white dark:bg-dark-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary-100" />
                      <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                        #{order._id.slice(-8)}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Cost
                      </span>
                      <span className="font-semibold text-dark100_light500">
                        {order.cost.toLocaleString()} VND
                      </span>
                    </div>

                    {order.discount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Discount
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          -{order.discount}%
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-dark100_light500 capitalize">
                        {order.shippingMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        ETD: {new Date(order.ETD).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <MyButton
                    title="View Details"
                    background="bg-primary-100"
                    text_color="text-white"
                    width="w-full"
                    event={() => handleOrderDetailClick(order)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-dark100_light500 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You haven`&apos;t made any purchases yet
              </p>
              <button
                onClick={onClose}
                className="bg-primary-100 text-white px-6 py-2 rounded-lg hover:bg-primary-200 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {isOrderModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrderModal}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </>
  );
};

export default UserModal;
