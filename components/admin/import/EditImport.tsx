import TitleSession from "@/components/shared/label/TitleSession";
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import InputEdit from "@/components/shared/input/InputEdit";
import LabelInformation from "@/components/shared/label/LabelInformation";
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

const stockInfTitle = "font-medium text-[16px] ";

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
      const firstSize = firstVariant.sizes && firstVariant.sizes.length > 0 
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
      return (
        total + (item.unitPrice * item.quantity * discountPercent) / 100
      );
    }, 0);
  }, [cartItems]);

  if (!editableItem) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-md shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Import Information */}
        <div className="w-full flex gap-20 items-center">
          <div className="rounded-lg w-28 h-20 flex items-center justify-center border">
            <p>NH {editableItem.id}</p>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-2">
            <LabelInformation
              title="Create At"
              content={`${format(editableItem.createAt, "PPP")}`}
            />
            <LabelInformation
              title="Status"
              content={editableItem.status ? "Done" : "Pending"}
            />
            <LabelInformation title="Staff id" content={editableItem.createBy} />
          </div>
        </div>

        {/* Supplier Information */}
        <TitleSession title="Supplier Information" />
        <div className="grid grid-cols-1 gap-2">
          <InputEdit
            titleInput="Name"
            value={editableItem.suplier.fullname}
            onChange={(e) => changeSuplierField("fullname", e.target.value)}
            width="w-full"
            placeholder="Enter suplier name..."
          />
          <PhoneNumberInput item={editableItem} setItem={setEditableItem} />
          <InputEdit
            titleInput="Address"
            value={editableItem.suplier.address}
            onChange={(e) => changeSuplierField("address", e.target.value)}
            width="w-full"
            placeholder="Enter suplier address..."
          />
        </div>

        {/* Invoice Detail */}
        <TitleSession title="Detail Product" />
        <div className="w-full md:w-2/3 lg:w-[250px]">
          <TableSearchNoFilter onSearch={setSearchQuery} />
        </div>

        <div className="w-full h-4/6 flex overflow-hidden">
          <div className="container grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 w-full gap-8 max-h-[400px] md:w-2/3 lg:w-3/4 overflow-y-auto">
            {filterData.map((product) => (
              <ImportCard
                key={product.id}
                item={product}
                onClick={() => addToCart(product)}
              />
            ))}
          </div>

          {/* Cart Section */}
          <div className="flex flex-col md:w-2/5 w-2/3 lg:w-2/5 max-h-[400px]">
            {cartItems.length > 0 ? (
              <div className="container w-full flex flex-col overflow-y-auto rounded-lg p-4 pt-2">
                <h4 className="text-[18px] font-semibold">In cart:</h4>
                <hr className="my-2" />
                <div>
                  {cartItems.map((cartItem) => {
                    const product = filterData.find((p) => p.id === cartItem.id);
                    return (
                      <div
                        key={`${cartItem.id}-${cartItem.material}-${cartItem.size}`}
                        className="flex flex-col gap-4"
                      >
                        <ImportOrderCard
                          cartItem={cartItem}
                          updateCart={updateCart}
                          setItem={setEditableItem}
                          item={product || null}
                        />
                      </div>
                    );
                  })}
                </div>

                <hr className="my-2" />

                {/* Cart summary section */}
                <div className="w-full flex flex-col gap-4 p-2">
                  <div className="flex justify-between">
                    <span className={stockInfTitle}>Sub total:</span>
                    <div>{formatPrice(totalAmount)}</div>
                  </div>
                  <div className="flex justify-between">
                    <span className={stockInfTitle}>Discount:</span>
                    <div>{formatPrice(totalDiscount)}</div>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold text-[16px]">Total:</span>
                    <div className="font-bold">
                      {formatPrice(totalAmount - totalDiscount)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-start items-center font-medium text-[16px]">
                Your cart is empty.
                <div className="w-52 h-52">
                  <Image
                    src={"/assets/images/EmptyCart.jpg"}
                    alt="empty cart"
                    width={200}
                    height={230}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditImport;