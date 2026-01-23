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
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isProductOverlayOpen, setIsProductOverlayOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [item, setItem] = useState<CreateImport>({
    details: [],
    provider: "",
    staff: "", // Staff ID sẽ được tự động set bởi API từ user đang đăng nhập
  });

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
        // Reset form
        setItem({
          details: [],
          provider: "",
          staff: "6776bdd574de08ccc866a4b8",
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

        <div className="p-6">
          <InputEdit
            titleInput="Provider ID"
            width="w-full"
            name="provider"
            onChange={handleChange}
            placeholder="Enter provider ID (required)"
            value={item?.provider ?? ""}
          />
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
