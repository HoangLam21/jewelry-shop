"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import InputEdit from "@/components/shared/input/InputEdit";
import ImportCard from "@/components/shared/card/ImportCard";
import { formatCurrency, formatPrice } from "@/lib/utils";
import ImportOrderCard, {
  DetailImportProduct,
} from "@/components/shared/card/ImportOrderCard";
import TableSearchNoFilter from "@/components/shared/table/TableSearchNoFilter";
import Image from "next/image";
import { FileContent, ProductResponse } from "@/dto/ProductDTO";
import { Variant } from "../product/ProductList";
import { CreateImport } from "@/dto/ImportDTO";
import { fetchProduct } from "@/lib/service/product.service";
import { createImport } from "@/lib/service/import.service";
import AddDetailImport from "./AddDetailImport";
import { verifyImport } from "@/lib/actions/import.action";
import { useUser } from "@clerk/nextjs";
import InputSelection from "@/components/shared/input/InputSelection";
import { fetchStaff } from "@/lib/service/staff.service";
import {
  Package,
  Calendar,
  User,
  ShoppingCart,
  Plus,
  DollarSign,
  Building2,
} from "lucide-react";

export interface Product {
  id: string;
  image: string;
  imageInfo: FileContent[];
  productName: string;
  price: string;
  collection: string;
  description: string;
  vouchers: string;
  provider: string;
  category: string;
  variants: Variant[];
}

const AddImport = () => {
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isProductOverlayOpen, setIsProductOverlayOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [staffId, setStaffId] = useState<string>("");
  const [staffList, setStaffList] = useState<{ id: string; name: string }[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [loadingStaff, setLoadingStaff] = useState(false);

  const [item, setItem] = useState<CreateImport>({
    details: [],
    provider: "",
    staff: "", // Staff ID sẽ được tự động set bởi API từ user đang đăng nhập
  });

  // Fetch staff ID from auth and staff list for admin
  useEffect(() => {
    const fetchStaffId = async () => {
      console.log("[AddImport] useEffect triggered - isLoaded:", isLoaded, "user:", user?.id);

      if (!isLoaded) {
        console.log("[AddImport] Not loaded yet, waiting...");
        return;
      }

      if (!user?.id) {
        console.log("[AddImport] No user ID");
        return;
      }

      // Ưu tiên lấy role từ publicMetadata (nhanh nhất) - set ngay để dropdown hiển thị
      let role = user.publicMetadata?.role as string | undefined;
      console.log("[AddImport] Role from metadata:", role);

      if (role && (role === "admin" || role === "staff" || role === "customer")) {
        setUserRole(role);
        console.log("[AddImport] Set userRole from metadata:", role);

        // Nếu là admin, fetch staff list NGAY LẬP TỨC
        if (role === "admin") {
          console.log("[AddImport] Admin detected from metadata, fetching staff list immediately...");
          setLoadingStaff(true);
          try {
            const staffs = await fetchStaff();
            console.log("[AddImport] Fetched staffs from metadata:", staffs);
            if (staffs && Array.isArray(staffs) && staffs.length > 0) {
              const formattedStaffs = staffs.map((staff: any) => ({
                id: staff._id,
                name: `${staff.fullName} (${staff.email})`,
              }));
              console.log("[AddImport] Formatted staffs:", formattedStaffs.length, "items");
              setStaffList(formattedStaffs);
            } else {
              console.warn("[AddImport] Staff list is empty or not an array");
            }
          } catch (error) {
            console.error("[AddImport] Error fetching staff list from metadata:", error);
          } finally {
            setLoadingStaff(false);
          }
        }
      }

      try {
        // Fetch role và userIdInDb từ API (luôn fetch để lấy userIdInDb)
        const response = await fetch(`/api/auth/role?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          // Sử dụng role từ API nếu metadata không có
          if (!role && data.role) {
            role = data.role;
            setUserRole(data.role);
            console.log("[AddImport] Role from API:", data.role);
          }

          // Sử dụng role cuối cùng (từ API hoặc metadata)
          const finalRole = role || data.role;
          console.log("[AddImport] Final role:", finalRole, "from metadata:", role, "from API:", data.role);

          // Nếu user là staff, userIdInDb sẽ là staff ID
          if (finalRole === "staff" && data.userIdInDb) {
            setStaffId(data.userIdInDb);
            setItem((prev) => ({
              ...prev,
              staff: data.userIdInDb,
            }));
          } else if (finalRole === "admin" || data.role === "admin") {
            // Admin cần chọn staff từ dropdown
            // Fetch danh sách staff để hiển thị trong dropdown
            console.log("[AddImport] Detected admin, fetching staff list...");
            setLoadingStaff(true);
            try {
              const staffs = await fetchStaff();
              console.log("[AddImport] Fetched staffs:", staffs);
              if (staffs && Array.isArray(staffs)) {
                const formattedStaffs = staffs.map((staff: any) => ({
                  id: staff._id,
                  name: `${staff.fullName} (${staff.email})`,
                }));
                console.log("[AddImport] Formatted staffs:", formattedStaffs);
                setStaffList(formattedStaffs);
              } else {
                console.warn("[AddImport] Staff list is not an array:", staffs);
              }
            } catch (error) {
              console.error("[AddImport] Error fetching staff list:", error);
            } finally {
              setLoadingStaff(false);
            }
            setStaffId("");
            setItem((prev) => ({
              ...prev,
              staff: "", // Admin cần chọn staff từ dropdown
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching staff ID:", error);
      }
    };

    fetchStaffId();
  }, [user, isLoaded]);

  // Fetch staff list ngay khi detect là admin (fallback)
  useEffect(() => {
    const fetchStaffList = async () => {
      // Nếu đã có staffList hoặc không phải admin, không cần fetch
      if (staffList.length > 0 || (userRole !== "admin" && user?.publicMetadata?.role !== "admin")) {
        return;
      }

      // Nếu là admin nhưng chưa có staffList, fetch ngay
      if ((userRole === "admin" || user?.publicMetadata?.role === "admin") && !loadingStaff) {
        console.log("[AddImport] Fallback: Fetching staff list for admin...");
        setLoadingStaff(true);
        try {
          const staffs = await fetchStaff();
          console.log("[AddImport] Fallback fetched staffs:", staffs);
          if (staffs && Array.isArray(staffs)) {
            const formattedStaffs = staffs.map((staff: any) => ({
              id: staff._id,
              name: `${staff.fullName} (${staff.email})`,
            }));
            setStaffList(formattedStaffs);
          }
        } catch (error) {
          console.error("[AddImport] Fallback error fetching staff list:", error);
        } finally {
          setLoadingStaff(false);
        }
      }
    };

    if (isLoaded && user) {
      fetchStaffList();
    }
  }, [userRole, user, isLoaded, staffList.length, loadingStaff]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: ProductResponse[] = await fetchProduct();
        if (result) {
          const data: Product[] = result.map((item) => ({
            id: item._id,
            image: item.files?.[0]?.url ?? "",
            imageInfo: item.files,
            productName: item.name,
            price: formatCurrency(item.cost),
            collection: item.collections,
            description: item.description,
            vouchers: item.vouchers?.[item.vouchers.length - 1]?._id || "",
            provider: item.provider ? item.provider._id : "",

            // ✅ FIX category luôn string
            category: typeof item.category === "string" ? item.category : item.category?._id || "",

            variants: item.variants,
          }));

          setList(data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        alert(
          `Error fetching data: ${err?.message || "An unexpected error occurred."}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (item) {
      setItem({
        ...item,
        [e.target.name]: e.target.value,
      });
    }
  };

  const filterData = list.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      item.productName.toLowerCase().includes(lowerCaseQuery) ||
      item.price.toLowerCase().includes(lowerCaseQuery) ||
      item.id.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const addToCart = (product: Product) => {
    setSelectedItem(product);
    setIsProductOverlayOpen(true);
  };

  const updateCart = (updatedItem: DetailImportProduct) => {
    const updatedDetails = item.details.map((detail) =>
      detail.id === updatedItem.id
        ? { ...detail, quantity: updatedItem.quantity }
        : detail
    );
    setItem({
      ...item,
      details: updatedDetails,
    });
  };

  const calculateTotal = () => {
    return item.details.reduce((total, detail) => {
      const price = detail.unitPrice * detail.quantity;
      const discountAmount = (price * parseFloat(detail.discount)) / 100;
      return total + price - discountAmount;
    }, 0);
  };

  const calculateSubtotal = () => {
    return item.details.reduce(
      (total, detail) => total + detail.unitPrice * detail.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    return item.details.reduce((total, detail) => {
      const price = detail.unitPrice * detail.quantity;
      const discountAmount = (price * parseFloat(detail.discount)) / 100;
      return total + discountAmount;
    }, 0);
  };

  const handleSave = async () => {
    // Validate staff ID cho admin
    if (userRole === "admin" && !item.staff) {
      alert("Please select a staff member");
      return;
    }

    if (!item.provider) {
      alert("Please enter Provider ID");
      return;
    }

    if (item.details.length === 0) {
      alert("Please add at least one product to cart");
      return;
    }

    setSaving(true);

    try {
      const data: CreateImport = {
        details: item.details,
        provider: item.provider,
        staff: item.staff, // Staff ID sẽ được tự động set bởi API từ user đang đăng nhập
      };

      const result = await createImport(data);
      await verifyImport(result._id);

      if (result) {
        alert("Import order created successfully!");
        // Reset form (giữ staff ID nếu đã fetch được)
        setItem({
          details: [],
          provider: "",
          staff: staffId, // Sử dụng staff ID đã fetch từ auth
        });
      }
    } catch (error) {
      console.error("Error creating import:", error);
      alert("Failed to create import order.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Import Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-300 dark:border-green-700 shadow-sm">
            <div className="text-center">
              <Package className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                New Import
              </p>
              <p className="font-bold text-gray-900 dark:text-white">NH-NEW</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Created Date</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {format(new Date(), "MMM dd, yyyy")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Staff ID</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {item.staff}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Supplier Information
            </h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Staff Selection - chỉ hiển thị cho admin, đặt TRƯỚC Provider ID */}
          {/* Luôn check cả state và metadata để đảm bảo hiển thị */}
          {(() => {
            const isAdmin = userRole === "admin" || user?.publicMetadata?.role === "admin";
            console.log("[AddImport] Render check - isAdmin:", isAdmin, "userRole:", userRole, "metadataRole:", user?.publicMetadata?.role);

            if (!isAdmin) {
              return null;
            }

            return (
              <div>
                {loadingStaff ? (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Loading staff list...</span>
                  </div>
                ) : staffList.length > 0 ? (
                  <InputSelection
                    width="w-full"
                    titleInput="Staff"
                    options={staffList.map((staff) => ({
                      name: staff.name,
                      value: staff.id,
                    }))}
                    value={item?.staff ?? ""}
                    onChange={(value) => {
                      console.log("[AddImport] Staff selected:", value);
                      setItem((prev) => ({
                        ...prev,
                        staff: value,
                      }));
                    }}
                  />
                ) : (
                  <div className="text-yellow-600 dark:text-yellow-400 text-sm py-2 border border-yellow-300 dark:border-yellow-700 rounded-lg px-3 bg-yellow-50 dark:bg-yellow-900/20">
                    ⚠️ No staff found. Please contact administrator or wait for staff list to load.
                  </div>
                )}
              </div>
            );
          })()}

          <InputEdit
            titleInput="Provider ID"
            width="w-full"
            name="provider"
            onChange={handleChange}
            placeholder="Enter provider ID (required)"
            value={item?.provider ?? ""}
          />

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <div>Debug: userRole={userRole || "not set"}, metadataRole={String(user?.publicMetadata?.role || "not set")}</div>
              <div>staffList.length={staffList.length}, loadingStaff={String(loadingStaff)}</div>
              <div>item.staff={item.staff || "empty"}, isLoaded={String(isLoaded)}</div>
              <div>Should show dropdown: {(userRole === "admin" || user?.publicMetadata?.role === "admin") ? "YES" : "NO"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Products
              </h3>
            </div>
            <div className="w-full max-w-xs">
              <TableSearchNoFilter onSearch={setSearchQuery} />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Grid */}
            <div className="lg:col-span-2">
              {filterData.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
                  {filterData.map((product: Product) => (
                    <ImportCard
                      key={product.id}
                      item={product}
                      onClick={() => addToCart(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <Package className="w-16 h-16 mb-4 opacity-20" />
                  <p>No products found</p>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 max-h-[500px] flex flex-col sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Cart ({item.details.length})
                  </h4>
                </div>

                {item.details.length > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {item.details.map((cartItem) => (
                        <ImportOrderCard
                          key={`${cartItem.id}-${cartItem.material}-${cartItem.size}`}
                          updateCart={() => updateCart(cartItem)}
                          cartItem={cartItem}
                          setItem={setItem}
                          item={selectedItem}
                        />
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(calculateSubtotal())}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Discount:
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{formatPrice(calculateDiscount())}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-gray-900 dark:text-white">
                            Total:
                          </span>
                        </div>
                        <span className="text-green-600 dark:text-green-400">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Image
                      src="/assets/images/EmptyCart.jpg"
                      alt="empty cart"
                      width={150}
                      height={150}
                      className="opacity-50 mb-4"
                    />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Click on products to add
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving || !item.provider || item.details.length === 0}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating Import...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Import Order
            </>
          )}
        </button>
      </div>

      {/* Product Detail Modal */}
      {isProductOverlayOpen && (
        <AddDetailImport
          isProductOverlayOpen={isProductOverlayOpen}
          setIsProductOverlayOpen={setIsProductOverlayOpen}
          selectedProduct={selectedItem}
          item={item}
          setItem={setItem}
        />
      )}
    </div>
  );
};

export default AddImport;
