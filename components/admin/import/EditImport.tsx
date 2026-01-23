import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import InputEdit from "@/components/shared/input/InputEdit";
import ImportCard from "@/components/shared/card/ImportCard";
import { formatPrice } from "@/lib/utils";
import ImportOrderCard from "@/components/shared/card/ImportOrderCard";
import TableSearchNoFilter from "@/components/shared/table/TableSearchNoFilter";
import PhoneNumberInput from "@/components/shared/input/PhoneInput";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ImportData, ProductsData } from "@/constants/data";
import { Variant } from "@/components/admin/product/ProductList";
import { FileContent } from "@/dto/ProductDTO";
import {
  Package,
  Calendar,
  User,
  ShoppingCart,
  FileText,
  Save,
} from "lucide-react";
interface Invoice {
  id: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  discount: number;
}

interface Import {
  id: string;
  suplier: {
    id: string;
    phoneNumber: string;
    fullname: string;
    address: string;
  };
  invoice: Invoice[];
  status: boolean;
  createAt: Date;
  createBy: string;
  details?: DetailImportProduct[]; // Add details field for cart items
}

// Product interface matching ImportCard
interface Product {
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

// DetailImportProduct interface matching ImportOrderCard
interface DetailImportProduct {
  id: string;
  material: string;
  size: string;
  unitPrice: number;
  quantity: number;
  discount: string;
}

const EditImport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams<{ id: string }>() as { id: string };

  const [cartItems, setCartItems] = useState<DetailImportProduct[]>([]);

  // Get initial import data
  const initialItem = useMemo(() => {
    if (!id) return null;
    return ImportData.find((item) => item.id === id) || null;
  }, [id]);

  // Editable item state - initialize only once
  const [editableItem, setEditableItem] = useState<Import | null>(() => {
    if (initialItem) {
      return { ...initialItem, details: [] };
    }
    return null;
  });

  const changeSuplierField = (
    field: keyof Import["suplier"],
    value: string
  ) => {
    setEditableItem((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        suplier: {
          ...prev.suplier,
          [field]: value,
        },
      };
    });
  };

  // Filter products with proper typing
  const filterData = useMemo(() => {
    return (ProductsData as unknown as Product[]).filter((item) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        item.productName.toLowerCase().includes(lowerCaseQuery) ||
        item.price.toLowerCase().includes(lowerCaseQuery) ||
        item.id.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [searchQuery]);

  // Add product to cart
  const addToCart = (product: Product) => {
    // Check if product has variants
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];

      // Get first size from sizes array if available
      const firstSize =
        firstVariant.sizes && firstVariant.sizes.length > 0
          ? String(firstVariant.sizes[0])
          : "Default";

      const newCartItem: DetailImportProduct = {
        id: product.id,
        material: firstVariant.material || "Default",
        size: firstSize,
        unitPrice: parseFloat(product.price.replace("$", "")),
        quantity: 1,
        discount: "0%",
      };

      setCartItems((prev) => {
        const exists = prev.find(
          (item) =>
            item.id === newCartItem.id &&
            item.material === newCartItem.material &&
            item.size === newCartItem.size
        );

        if (exists) {
          return prev.map((item) =>
            item.id === newCartItem.id &&
            item.material === newCartItem.material &&
            item.size === newCartItem.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, newCartItem];
      });

      // Update editableItem details
      setEditableItem((prev) => {
        if (!prev) return null;
        const updatedDetails = prev.details || [];
        const exists = updatedDetails.find(
          (item) =>
            item.id === newCartItem.id &&
            item.material === newCartItem.material &&
            item.size === newCartItem.size
        );

        if (exists) {
          return {
            ...prev,
            details: updatedDetails.map((item) =>
              item.id === newCartItem.id &&
              item.material === newCartItem.material &&
              item.size === newCartItem.size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }

        return {
          ...prev,
          details: [...updatedDetails, newCartItem],
        };
      });
    }
  };

  // Update cart item
  const updateCart = (updatedItem: DetailImportProduct) => {
    setCartItems((prev) => {
      if (updatedItem.quantity === 0) {
        return prev.filter(
          (item) =>
            !(
              item.id === updatedItem.id &&
              item.material === updatedItem.material &&
              item.size === updatedItem.size
            )
        );
      }
      return prev.map((item) =>
        item.id === updatedItem.id &&
        item.material === updatedItem.material &&
        item.size === updatedItem.size
          ? updatedItem
          : item
      );
    });
  };

  // Calculate totals
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
  }, [cartItems]);

  const totalDiscount = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const discountPercent = parseFloat(item.discount.replace("%", "")) || 0;
      return total + (item.unitPrice * item.quantity * discountPercent) / 100;
    }, 0);
  }, [cartItems]);

  if (!editableItem) {
    return (
      <div className="flex w-full h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading import...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Import Overview */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-300 dark:border-amber-700 shadow-sm">
            <div className="text-center">
              <Package className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Import
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                NH {editableItem.id}
              </p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Created Date</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {format(editableItem.createAt, "MMM dd, yyyy")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  editableItem.status
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                }`}
              >
                {editableItem.status ? "Delivered" : "Pending"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Staff ID</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {editableItem.createBy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Supplier Information
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <InputEdit
            titleInput="Supplier Name"
            value={editableItem.suplier.fullname}
            onChange={(e) => changeSuplierField("fullname", e.target.value)}
            width="w-full"
            placeholder="Enter supplier name..."
          />
          <PhoneNumberInput item={editableItem} setItem={setEditableItem} />
          <InputEdit
            titleInput="Address"
            value={editableItem.suplier.address}
            onChange={(e) => changeSuplierField("address", e.target.value)}
            width="w-full"
            placeholder="Enter supplier address..."
          />
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Products
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
                {filterData.map((product) => (
                  <ImportCard
                    key={product.id}
                    item={product}
                    onClick={() => addToCart(product)}
                  />
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 max-h-[500px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Cart ({cartItems.length})
                  </h4>
                </div>

                {cartItems.length > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {cartItems.map((cartItem) => {
                        const product = filterData.find(
                          (p) => p.id === cartItem.id
                        );
                        return (
                          <ImportOrderCard
                            key={`${cartItem.id}-${cartItem.material}-${cartItem.size}`}
                            cartItem={cartItem}
                            updateCart={updateCart}
                            setItem={setEditableItem}
                            item={product || null}
                          />
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Discount:
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          -{formatPrice(totalDiscount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                        <span className="text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">
                          {formatPrice(totalAmount - totalDiscount)}
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
                    <p className="text-gray-500 dark:text-gray-400">
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

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditImport;
