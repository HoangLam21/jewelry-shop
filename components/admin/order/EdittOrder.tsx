import TitleSession from "@/components/shared/label/TitleSession";
import React, { useEffect, useState } from "react";
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
}

interface Product {
  id: string;
  image: string;
  productName: string;
  price: string;
  material: string;
  quantity: number;
}

const stockInfTitle = "font-medium text-[16px] ";

const EditOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams() as { id: string };

  const cleanId = typeof id === "string" ? id.replace("edit-", "") : "";

  const [item, setItem] = useState<Import | null>(null);
  const [updatedItem, setUpdatedItem] = useState<Import | null>(null); // Store the edited item
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (id) {
      const foundStaff = ImportData.find((item) => item.id === id);
      setUpdatedItem(foundStaff || null);
      setItem(foundStaff || null);
    }
  }, [id]);

  // Handle saving the import
  const handleSave = () => {
    if (item) {
      console.log("Saved product: ", item);
    }
  };

  // Handle supplier field changes
  const changeSuplierField = (
    field: keyof Import["suplier"],
    value: string
  ) => {
    setItem((prev: any) => ({
      ...prev,
      suplier: {
        ...prev.suplier,
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }, 500); // Chờ 500ms sau lần nhập cuối cùng

    return () => clearTimeout(timer);
  }, [phoneNumber]);

  const handleChange = (e: any) => {
    setPhoneNumber(e.target.value);
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    // Kiểm tra nếu phoneNumber chỉ chứa số và có độ dài 10
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const filterData = ProductsData.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch =
      item.productName.toLowerCase().includes(lowerCaseQuery) ||
      item.price.toLowerCase().includes(lowerCaseQuery) ||
      item.id.toLowerCase().includes(lowerCaseQuery);
    // ||
    // item.quantity.toString().toLowerCase().includes(lowerCaseQuery);
    return matchesSearch;
  });

  // Function to add product to cart
  const [cartItems, setCartItems] = useState<Product[]>([]); // State to store products in the cart

  // Function to add product to cart
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        // Update quantity if item already exists in cart
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCart = (updatedItem: Product) => {
    setCartItems((prev) => {
      if (updatedItem.quantity === 0) {
        // Loại bỏ sản phẩm nếu số lượng bằng 0
        return prev.filter((item) => item.id !== updatedItem.id);
      }
      // Cập nhật sản phẩm nếu số lượng lớn hơn 0
      return prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
    });
  };
  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + parseFloat(item.price.replace("$", "")) * item.quantity,
    0
  );

  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total +
      parseFloat(item.price.replace("$", "")) *
        item.quantity *
        (item.quantity / 100),
    0
  );

  if (!item) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  console.log(item, "this is iten");

  return (
    <div className="w-full h-full rounded-md shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Import Information */}
        <div className="w-full flex gap-20 items-center">
          <div className="rounded-lg w-28 h-20 flex items-center justify-center border">
            <p>NH {item.id}</p>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-2">
            <LabelInformation
              title="Create At"
              content={`${format(item.createAt, "PPP")}`}
            />
            <LabelInformation
              title="Status"
              content={item.status ? "Done" : "Pending"}
            />
            <LabelInformation title="Staff id" content={item.createBy} />
          </div>
        </div>

        {/* Supplier Information */}
        <TitleSession title="Customer Information" />
        <div className="grid grid-cols-1 gap-2">
          <InputEdit
            titleInput="Name"
            value={item.suplier.fullname}
            onChange={(e) => changeSuplierField("fullname", e.target.value)}
            width="w-full"
            placeholder="Enter customer name..."
          />
          <PhoneNumberInput item={item} setItem={setItem} />
          <InputEdit
            titleInput="Address"
            value={item.suplier.address}
            onChange={(e) => changeSuplierField("address", e.target.value)}
            width="w-full"
            placeholder="Enter customer address..."
          />
        </div>

        {/* Invoice Detail */}
        <TitleSession title="Detail Order" />
        <div className="w-full md:w-2/3 lg:w-[250px]">
          <TableSearchNoFilter onSearch={setSearchQuery} />
        </div>

        <div className="w-full h-4/6 flex overflow-hidden">
          <div className="container grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 w-full gap-8 max-h-[400px] md:w-2/3 lg:w-3/4 overflow-y-auto ">
            {/* {filterData.map((product: Product) => (
              <ImportCard
                key={product.id}
                item={product}
                onClick={() => addToCart(product)}
              />
            ))} */}
          </div>
          {/* Cart Section */}
          <div className="flex flex-col md:w-2/5 w-2/3 lg:w-2/5 max-h-[400px]">
            {cartItems.length > 0 ? (
              <div className="container w-full flex flex-col overflow-y-auto rounded-lg p-4 pt-2">
                <h4 className="text-[18px] font-semibold">In cart:</h4>
                <hr className="my-2" />
                <div>
                  {/* Map over cart items and display them */}
                  {/* {cartItems.map((cartItem) => (
                    <div key={cartItem.id} className="flex flex-col gap-4">
                      <ImportOrderCard
                        item={cartItem}
                        updateCart={updateCart}
                      />
                    </div>
                  ))} */}
                </div>

                <hr className="my-2" />

                {/* Cart summary section */}
                <div className="w-full flex flex-col gap-4 p-2">
                  <div className="HDNH_maincontent_footer_total flex justify-between">
                    <span className={stockInfTitle}>Sub total:</span>
                    <div className="HDNH_total">{formatPrice(totalAmount)}</div>
                  </div>
                  <div className="HDNH_maincontent_footer_discount flex justify-between">
                    <span className={stockInfTitle}>Discount:</span>
                    <div className="HDNH_discount">
                      {formatPrice(totalDiscount)}
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="HDNH_maincontent_footer_finaltotal flex justify-between">
                    <span className="font-bold text-[16px]">Total:</span>
                    <div className="HDNH_finaltotal font-bold">
                      {formatPrice(totalAmount - totalDiscount)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-start items-center font-medium text-[16px]">
                Your cart is empty.
                <div className="w-52 h-52 ">
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

export default EditOrder;
