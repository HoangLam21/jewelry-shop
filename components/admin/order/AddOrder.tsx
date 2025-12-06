import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { format, formatDate } from "date-fns";
import InputEdit from "@/components/shared/input/InputEdit";
import InputSelection from "@/components/shared/input/InputSelection";
import LabelInformation from "@/components/shared/label/LabelInformation";
import ImportCard from "@/components/shared/card/ImportCard";
import { formatCurrency, formatPrice } from "@/lib/utils";
import ImportOrderCard, {
  DetailImportProduct,
} from "@/components/shared/card/ImportOrderCard";
import TableSearch from "@/components/shared/table/TableSearch";
import TableSearchNoFilter from "@/components/shared/table/TableSearchNoFilter";
import PhoneNumberInput from "@/components/shared/input/PhoneInput";
import Image from "next/image";
import { FileContent, ProductResponse } from "@/dto/ProductDTO";
import { fetchProduct } from "@/lib/service/product.service";
import Product from "@/database/product.model";
import { ProductData, Variant } from "../product/ProductList";
import { CreateOrder } from "@/dto/OrderDTO";
import InputDate from "@/components/shared/input/InputDate";
import AddDetailProduct from "./AddDetailProduct";
import { groupVariants } from "../product/ProductEdit";
import { createOrder } from "@/lib/service/order.service";
import { fetchVoucher } from "@/lib/service/voucher.service";
import InputNumberSelection from "@/components/shared/input/InputNumberSelection";

const AddOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState<ProductData[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProductData | null>(null);
  const [isProductOverlayOpen, setIsProductOverlayOpen] = useState(false);
  const [voucherList, setVoucherList] = useState<
    { name: string; discount: number }[]
  >([]);

  const [productDetail, setProductDetail] = useState({
    id: "",
    material: "",
    size: "",
    unitPrice: "",
    quantity: 0,
    discount: "0",
  });

  const [item, setItem] = useState<CreateOrder>({
    cost: 0, // Default to 0
    discount: 0, // Default to 0
    details: [],
    status: "pending", // Default to an empty string
    shippingMethod: "", // Default to an empty string
    ETD: new Date(), // Default to the current date
    customer: "", // Default to an empty string
    staff: "6776bdd574de08ccc866a4b8", // Default to an empty string
  });

  if (!item) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchProduct();
        if (result) {
          const data: ProductData[] = result.map((item: any) => ({
            id: item._id,
            image: item.files[0].url,
            imageInfo: item.files,
            productName: item.name,
            price: formatCurrency(item.cost),
            collection: item.collections,
            description: item.description,
            vouchers: item.vouchers?.[item.vouchers.length - 1]?._id || "",
            provider: item.provider ? item.provider._id : "",
            category: item.category ? item.category.name : "No category",
            variants: item.variants,
            categoryId: item.category ? item.category._id : "",
          }));

          setList(data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error fetching data: ${errorMessage}`);
      }
    };

    const fetchDataVoucher = async () => {
      try {
        const result = await fetchVoucher();

        console.log(result, "result");

        if (result) {
          const formattedVouchers = result.map((voucher: any) => ({
            name: voucher.name,
            discount: voucher.discount,
          }));
          setVoucherList(formattedVouchers);
        }
      } catch (err: any) {
        console.error("Error fetching vouchers:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error fetching vouchers: ${errorMessage}`);
      }
    };

    fetchData();
    fetchDataVoucher();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (item) {
      setItem({
        ...item,
        [e.target.name]: e.target.value,
      });
    }
  };

  const formatDate = (date: Date | string): string => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) // Check for a valid date
      ? parsedDate.toISOString()
      : ""; // Return empty string if invalid date
  };

  const filterData = list.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const matchesSearch =
      item.productName.toLowerCase().includes(lowerCaseQuery) ||
      item.price.toLowerCase().includes(lowerCaseQuery) ||
      item.id.toLowerCase().includes(lowerCaseQuery);

    // Lọc theo bộ lọc trạng thái (online/offline)

    return matchesSearch;
  });

  const addToCart = (product: ProductData) => {
    console.log("Product added to cart:", product); // Debug log
    setSelectedItem(product);
    setProductDetail({
      ...productDetail,
      id: product.id,
    });
    setIsProductOverlayOpen(true); // Mở modal
  };

  const updateCart = (updatedItem: DetailImportProduct) => {
    // Update the item details with the new quantity
    const updatedDetails = item.details.map((detail) =>
      detail.id === updatedItem.id
        ? { ...detail, quantity: updatedItem.quantity } // Update the quantity
        : detail
    );
    console.log(updatedDetails, "updatedDetails");
    // Update the state with the new details
    setItem({
      ...item,
      details: updatedDetails,
    });
  };

  // Calculate the total price and discount
  const calculateTotal = () => {
    return item.details.reduce((total, detail) => {
      const price = detail.unitPrice * detail.quantity;
      const discountAmount = (price * parseFloat(detail.discount)) / 100;
      return total + price - discountAmount;
    }, 0);
  };

  //SAVE
  const handleSave = async () => {
    if (item) {
      // Tính tổng chi phí cuối cùng
      const totalCost =
        calculateTotal() - (calculateTotal() * item.discount) / 100;

      // Cập nhật state của item với giá trị cost
      setItem((prev) => ({
        ...prev!,
        cost: totalCost,
      }));

      const data: CreateOrder = {
        cost: totalCost, // Gán cost với giá trị tổng cuối cùng
        discount: item.discount, // Default to 0
        details: item.details,
        status: item.status, // Default to an empty string
        shippingMethod: item.shippingMethod, // Default to an empty string
        ETD: new Date(), // Default to the current date
        customer: item.customer, // Default to an empty string
        staff: "6776bdd574de08ccc866a4b8", // Default to an empty string
      };

      console.log(data);

      try {
        const result = await createOrder(data);
        console.log(result);
        alert("Order created successfully!");
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create order.");
      }
    } else {
      alert("No information of customer to update");
    }
  };

  console.log(item, "this is item to order");
  return (
    <div className="w-full h-full rounded-md shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Import Information */}
        <div className="w-full flex gap-20 items-center">
          <div className="rounded-lg w-28 h-20 flex items-center justify-center border">
            <p>NH</p>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-2">
            <LabelInformation
              title="Create At"
              content={`${format(new Date(), "PPP")}`}
            />
            <LabelInformation title="Status" content={item.status} />
            <LabelInformation title="Staff id" content={item.staff} />
          </div>
        </div>

        {/* Supplier Information */}
        <TitleSession title="Supplier Information" />
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <InputEdit
            titleInput="CustomerId"
            width="w-full"
            name="customer"
            onChange={handleChange}
            placeholder="Enter CustomerId"
            value={item?.customer ?? ""}
          />

          <InputSelection
            width="w-full"
            titleInput="Shipping method"
            options={["Standard", "Express ", "Economy"]}
            value={item?.shippingMethod ?? ""}
            onChange={(value) => {
              setItem((prev) => ({
                ...prev!,
                shippingMethod: value,
              }));
            }}
          />

          <InputDate
            titleInput="ETD"
            width="w-full"
            value={item ? formatDate(item.ETD) : ""}
            onChange={() => {}}
          />

          <InputNumberSelection
            width="w-full"
            titleInput="Voucher"
            options={voucherList.map((voucher) => ({
              name: voucher.name,
              value: voucher.discount,
            }))}
            value={item?.discount ?? 0}
            onChange={(value) => {
              setItem((prev) => ({
                ...prev!,
                discount: value,
              }));
            }}
          />
        </div>

        {/* Invoice Detail */}
        <TitleSession title="Order Product" />
        <div className="w-full md:w-2/3 lg:w-[250px]">
          <TableSearchNoFilter onSearch={setSearchQuery} />
        </div>

        <div className="w-full h-4/6 flex overflow-hidden">
          <div className="container grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 w-full gap-8 max-h-[400px] md:w-2/3 lg:w-3/4 overflow-y-auto ">
            {filterData.map((product: ProductData) => (
              <ImportCard
                key={product.id}
                item={product}
                onClick={() => addToCart(product)}
              />
            ))}
          </div>
          {/* Cart Section */}
          <div className="flex flex-col md:w-2/5 w-2/3 lg:w-2/5 max-h-[400px]">
            {item.details.length > 0 ? (
              <div className="container w-full flex flex-col overflow-y-auto rounded-lg p-4 pt-2">
                <h4 className="text-[18px] font-semibold">In cart:</h4>
                <hr className="my-2" />
                <div>
                  {item.details.map((cartItem) => (
                    <div
                      key={`${cartItem.id}-${cartItem.material}-${cartItem.size}`}
                      className="flex flex-col gap-4"
                    >
                      <ImportOrderCard
                        updateCart={() => updateCart(cartItem)}
                        cartItem={cartItem}
                        setItem={setItem}
                        item={selectedItem}
                      />
                    </div>
                  ))}
                </div>

                <hr className="my-2" />

                {/* Cart summary */}
                <div className="w-full flex flex-col gap-4 p-2">
                  <div className="flex justify-between">
                    <span>Sub total:</span>
                    <div>{formatPrice(calculateTotal())}</div>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <div>
                      {item.discount
                        ? `-${formatCurrency(
                            (calculateTotal() * item.discount) / 100
                          )}`
                        : "-"}
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold text-[16px]">Total:</span>
                    <div className="font-bold">
                      {formatCurrency(
                        calculateTotal() -
                          (calculateTotal() * item.discount) / 100
                      )}
                    </div>
                  </div>
                  <button onClick={handleSave}>Order</button>
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
      {isProductOverlayOpen && (
        <AddDetailProduct
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

export default AddOrder;
