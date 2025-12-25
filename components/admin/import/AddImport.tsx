import TitleSession from "@/components/shared/label/TitleSession";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ImportData, ProductsData } from "@/constants/data";
import { format } from "date-fns";
import InputEdit from "@/components/shared/input/InputEdit";
import InputSelection from "@/components/shared/input/InputSelection";
import LabelInformation from "@/components/shared/label/LabelInformation";
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [list, setList] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isProductOverlayOpen, setIsProductOverlayOpen] = useState(false);

  const [productDetail, setProductDetail] = useState({
    id: "",
    material: "",
    size: "",
    unitPrice: "",
    quantity: 0,
    discount: "0",
  });

  const [item, setItem] = useState<CreateImport>({
    details: [],
    provider: "", // Default to an empty string
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
        const result: ProductResponse[] = await fetchProduct();
        if (result) {
          const data: Product[] = result.map((item) => ({
            id: item._id,
            image: item.files[0].url,
            imageInfo: item.files,
            productName: item.name,
            price: formatCurrency(item.cost),
            collection: item.collections,
            description: item.description,
            vouchers: item.vouchers?.[item.vouchers.length - 1]?._id || "",
            provider: item.provider ? item.provider._id : "",
            category: item.category,
            variants: item.variants,
          }));

          setList(data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const errorMessage = err?.message || "An unexpected error occurred.";
        alert(`Error fetching data: ${errorMessage}`);
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

    const matchesSearch =
      item.productName.toLowerCase().includes(lowerCaseQuery) ||
      item.price.toLowerCase().includes(lowerCaseQuery) ||
      item.id.toLowerCase().includes(lowerCaseQuery);

    // Lọc theo bộ lọc trạng thái (online/offline)

    return matchesSearch;
  });

  const addToCart = (product: Product) => {
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

  console.log(item.details, "details");

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
      const totalCost = calculateTotal();

      // Cập nhật state của item với giá trị cost
      setItem((prev) => ({
        ...prev!,
        cost: totalCost,
      }));

      const data: CreateImport = {
        details: item.details,
        provider: item.provider, // Default to an empty string
        staff: "6776bdd574de08ccc866a4b8", // Default to an empty string
      };

      console.log(data, "data import");

      try {
        const result = await createImport(data);
        await verifyImport(result._id);
        if (result) {
          console.log(result, "rs of impirt");
          alert("Order created successfully!");
        }
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create order.");
      }
    } else {
      alert("No information of customer to update");
    }
  };

  return (
    <div className="w-full h-full rounded-md shadow-md">
      <div className="p-4 flex flex-col gap-4">
        {/* Import Information */}
        <div className="w-full flex gap-20 items-center">
          <div className="rounded-lg w-28 h-20 flex items-center justify-center border">
            <p>NH </p>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-2">
            <LabelInformation
              title="Create At"
              content={`${format(new Date(), "PPP")}`}
            />
            <LabelInformation title="Staff id" content={item.staff} />
          </div>
        </div>

        {/* Supplier Information */}
        <TitleSession title="Supplier Information" />
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <InputEdit
            titleInput="ProviderId"
            width="w-full"
            name="provider"
            onChange={handleChange}
            placeholder="Enter CustomerId"
            value={item?.provider ?? ""}
          />
        </div>

        {/* details Detail */}
        <TitleSession title="Import Product" />
        <div className="w-full md:w-2/3 lg:w-[250px]">
          <TableSearchNoFilter onSearch={setSearchQuery} />
        </div>

        <div className="w-full h-4/6 flex overflow-hidden">
          <div className="container grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 w-full gap-8 max-h-[400px] md:w-2/3 lg:w-3/4 overflow-y-auto ">
            {filterData.map((product: Product) => (
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
                    <span>Total:</span>
                    <div>{formatPrice(calculateTotal())}</div>
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
