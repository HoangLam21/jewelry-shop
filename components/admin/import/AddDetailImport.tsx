// AddDetailProduct.tsx
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { CreateOrder } from "@/dto/OrderDTO";
import InputEdit from "@/components/shared/input/InputEdit";
import LabelInformation from "@/components/shared/label/LabelInformation";
import { useState } from "react";
import { CreateImport } from "@/dto/ImportDTO";
import { Product } from "./AddImport";

type AddDetailProductProps = {
  isProductOverlayOpen: boolean;
  selectedProduct: Product | null; // Define the type according to the shape of selectedProduct
  setIsProductOverlayOpen: (isOpen: boolean) => void;
  item: CreateImport;
  setItem: any;
};
const AddDetailImport: React.FC<AddDetailProductProps> = ({
  isProductOverlayOpen,
  selectedProduct,
  setIsProductOverlayOpen,
  item,
  setItem,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [stock, setStock] = useState<number | null>(null);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  // Function to handle size selection
  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
    updateStockAndPrice(size, selectedMaterial);
  };

  // Function to handle material selection
  const handleMaterialSelection = (material: string) => {
    setSelectedMaterial(material);
    updateStockAndPrice(selectedSize, material);
  };

  // Function to update stock and price based on size and material
  const updateStockAndPrice = (size: string, material: string) => {
    if (selectedProduct) {
      const variant = selectedProduct.variants.find(
        (v) => v.material === material
      );
      if (variant) {
        const sizeInfo = variant.sizes.find((s) => s.size === size);
        setStock(sizeInfo ? sizeInfo.stock : null);
        setUnitPrice(
          Number(selectedProduct.price.replace(/\D/g, "")) + variant.addOn
        ); // Tính unitPrice
      } else {
        setStock(null);
        setUnitPrice(0);
      }
    }
  };

  const handleAddDetail = () => {
    if (selectedSize && selectedMaterial && quantity > 0) {
      // Tạo chi tiết sản phẩm mới
      const newDetail = {
        id: selectedProduct?.id,
        material: selectedMaterial,
        size: selectedSize,
        unitPrice: unitPrice,
        quantity: quantity,
        discount: discount.toString(),
      };

      // Kiểm tra xem sản phẩm đã tồn tại trong danh sách chưa
      const existingDetailIndex = item.details.findIndex(
        (detail) =>
          detail.id === newDetail.id &&
          detail.material === newDetail.material &&
          detail.size === newDetail.size
      );

      let updatedDetails;
      if (existingDetailIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
        updatedDetails = item.details.map((detail, index) =>
          index === existingDetailIndex
            ? { ...detail, quantity: detail.quantity + newDetail.quantity }
            : detail
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
        updatedDetails = [...item.details, newDetail];
      }

      // Cập nhật state `item`
      setItem({
        ...item,
        details: updatedDetails,
      });

      // Reset form
      setSelectedSize("");
      setSelectedMaterial("");
      setQuantity(0);
      setDiscount(0);
      setStock(null);
      setUnitPrice(0);
      setIsProductOverlayOpen(false);
    }
  };

  return (
    <>
      {isProductOverlayOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[750px] h-[620px] flex rounded-lg">
            <div className="relative w-[375px] h-[620px]">
              <Image
                alt="product-img"
                src={selectedProduct.image}
                fill
                className=""
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="w-[375px] flex flex-col gap-2 p-2">
              <div className="relative flex w-full items-center justify-end">
                <Icon
                  icon="iconoir:cancel"
                  className="text-[24px] text-text-color cursor-pointer"
                  onClick={() => setIsProductOverlayOpen(false)}
                />
              </div>
              <h2 className="text-[20px] font-semibold text-text-dark-500">
                {selectedProduct.productName}
              </h2>
              <div className="w-full grid grid-cols-1 gap-2">
                <LabelInformation title="Id" content={selectedProduct.id} />

                <div className="flex gap-4 items-center">
                  <p>Size:</p>
                  <div className="flex gap-4">
                    {[
                      ...new Set(
                        selectedProduct.variants.flatMap((variant) =>
                          variant.sizes.map((size) => size.size)
                        )
                      ),
                    ].map((uniqueSize) => (
                      <button
                        key={uniqueSize}
                        type="button"
                        className={`w-10 h-10 rounded-full ${
                          selectedSize === uniqueSize
                            ? "bg-primary-100 text-white"
                            : "bg-gray-300"
                        }`}
                        onClick={() => handleSizeSelection(uniqueSize)}
                      >
                        {uniqueSize}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <p>Material:</p>
                  <div className="flex gap-4">
                    {selectedProduct.variants.map((variant) => (
                      <button
                        key={variant.material}
                        type="button"
                        className={`w-20 h-6 rounded-full ${
                          selectedMaterial === variant.material
                            ? "bg-primary-100 text-white"
                            : "bg-gray-300"
                        }`}
                        onClick={() =>
                          handleMaterialSelection(variant.material)
                        }
                      >
                        {variant.material}
                      </button>
                    ))}
                  </div>
                </div>

                <LabelInformation
                  title="Available Stock"
                  content={stock !== null ? stock.toString() : "N/A"}
                />

                <LabelInformation
                  title="Unit Price"
                  content={`${unitPrice} vnd`}
                />

                <InputEdit
                  titleInput="Quantity"
                  width="w-full"
                  name="quantity"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Enter Quantity"
                  value={quantity.toString()}
                />

                <button
                  type="button"
                  className={`mt-4 p-2 rounded bg-primary-100 text-white `}
                  onClick={handleAddDetail} // Add the new detail when clicked
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDetailImport;
