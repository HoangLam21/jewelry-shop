"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MyButton from "@/components/shared/button/MyButton";
import DetailProduct from "@/components/form/product/DetailProduct";
import Categories from "@/components/form/home/Categories";
import RelatedProduct from "@/components/form/product/RelatedProduct";
import { getProductById } from "@/lib/services/product.service";
import { useCart } from "@/contexts/CartContext";
import { ProductData } from "@/components/admin/product/ProductList";
import { useBuyNow } from "@/contexts/BuyNowContext";
interface BuyNowItem {
  _id: string;
  name: string;
  images: string;
  cost: number;
  quantity: number;
  vouchers: any[];
  variants: any[];
  selectedMaterial: string;
  selectedSize: string;
}
const page = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>() as { id: string };
  const [product, setProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  const { dispatchBuyNow } = useBuyNow();

  const handleAddToCart = () => {
    if (selectedMaterial && selectedSize) {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          ...product,
        },
      });
      alert("Add to cart!");
      setIsModalOpen(false);
    } else {
      alert("Please select both material and size before adding to cart!");
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };
    getProduct();
  }, [id]);
  if (!product) {
    return <p>Loading provider information...</p>;
  }

  console.log(product);
  // const handleQuantityChange = (newQuantity: string | number) => {
  //   let quantity =
  //     typeof newQuantity === "string" ? parseInt(newQuantity, 10) : newQuantity;

  //   if (isNaN(quantity) || quantity < 1) {
  //     quantity = 1; // Đặt giá trị tối thiểu là 1
  //   }

  //   const updatedItem = { ...product, quantity }; // Cập nhật số lượng
  //   setUpdateCart(updatedItem); // Gửi thông tin mới về cho giỏ hàng
  //   setProduct(updatedItem); // Cập nhật trực tiếp sản phẩm trong component
  // };

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };
  const handleBuyNow = () => {
    if (selectedMaterial && selectedSize) {
      dispatchBuyNow({
        type: "BUY_NOW",
        payload: {
          ...product,
          selectedMaterial,
          selectedSize,
          quantity,
        },
      });
      alert("Buy now!");
      router.push("/checkout/buy");
      setIsModalOpen(false);
    } else {
      alert("Please select both material and size before adding to cart!");
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-16">
      <div className="w-full flex gap-8 h-[692px]">
        <div className="w-1/2 h-[692px] items-center">
          {/* <Swiper
            spaceBetween={0} // Không có khoảng cách giữa các slide
            slidesPerView={1} // Chỉ hiển thị 1 slide tại một thời điểm
            pagination={{ clickable: true }} // Thêm dấu chấm để chuyển slide
            navigation // Thêm nút điều hướng
            modules={[Navigation, Pagination]}
            className="w-full h-full" // Swiper chiếm toàn bộ không gian
          >
            {product.imageInfo.map((item, index) => (
              <SwiperSlide key={index} className="w-full h-full">
                <Image
                  src={"/assets/images/193569C00_RGB.jpg"}
                  alt="product image"
                  width={800}
                  height={520}
                  className="w-full h-full object-cover" // Ảnh chiếm toàn bộ không gian
                />
              </SwiperSlide>
            ))}
          </Swiper> */}
          <Image
            src={product.files[0].url}
            alt="product image"
            width={692}
            height={692}
            className="w-full h-[692px] object-cover rounded-md" // Ảnh chiếm toàn bộ không gian
          />
        </div>

        <div className="w-1/2 flex flex-col gap-6">
          <p className="text-[30px] text-dark100_light500">{product.name}</p>
          {/* <p className="text-[30px] ">{product.productName}</p> */}
          <p className="text-[40px] text-primary-100 ">
            {product.cost.toLocaleString()} VND
          </p>
          <p className="text-[16px] text-dark100_light500">
            {product.description}
          </p>
          <p className="underline text-[20px] text-dark100_light500">
            COLLECTIONS
          </p>
          <p className="text-[16px] text-dark100_light500">
            {product.collections}
          </p>

          {/* <p className="underline text-[20px]">PROVIDER</p>
          <p className="text-[16px]">{product.provider?.name || "N/A"}</p> */}

          <p className="underline text-[20px] text-dark100_light500">
            VARIANTS
          </p>
          <div className="flex">
            {product.variants.map((variant: any, index: any) => (
              <div key={index}>
                <p className="font-bold text-dark100_light500">
                  Material: {variant.material}
                </p>
                <p className="text-dark100_light500">Sizes:</p>
                <ul>
                  {variant.sizes.map((size: any, idx: any) => (
                    <li key={idx} className="text-dark100_light500">
                      {size.size} - Stock: {size.stock}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="underline text-[20px] text-dark100_light500">
            VOUCHERS
          </p>
          <ul>
            {product.vouchers.map((voucher: any) => (
              <li key={voucher._id} className="text-dark100_light500">
                {voucher.name} - sale off {voucher.discount}%
              </li>
            ))}
          </ul>

          <p className="text-[16px] text-dark100_light500">
            {product.sales} sales
          </p>
          {/* <p className="text-[16px]">{product.quantity} in stocks</p>
          <div className="flex w-2/5 gap-2">
            <button
              onClick={() =>
                handleQuantityChange(
                  (calculateTotalStock(product) - 1).toString()
                )
              }
              className="w-11 h-11 border border-gray-300 rounded-md self-center text-[16px] focus:outline-none text-center"
            >
              -
            </button>
            <input
              type="text"
              value={calculateTotalStock(product)}
              onChange={(e) => handleQuantityChange(e.target.value)}
              min={1}
              className="w-20 h-11 border border-gray-300 rounded-md self-center text-[16px] focus:outline-none text-center"
            />
            <button
              onClick={() =>
                handleQuantityChange(
                  (calculateTotalStock(product) + 1).toString()
                )
              }
              className="w-11 h-11 border border-gray-300 rounded-md self-center text-[16px] focus:outline-none text-center"
            >
              +
            </button>
          </div> */}
          <div className="w-full flex justify-between gap-4 mt-4">
            <MyButton
              title="BUY NOW"
              width="w-1/2"
              event={() => setIsBuy(true)}
              background="bg-primary-100"
              text_color="text-white"
            />
            <MyButton
              title="ADD TO CART"
              width="w-1/2"
              event={() => setIsModalOpen(true)}
              background="bg-black"
              text_color="text-white"
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-[24px] text-dark100_light500 font-bold jost mb-4">
              Choose Material and Size
            </h3>
            <div className="mb-4">
              <p className="font-semibold text-[20px] jost">Material:</p>
              {product.variants
                .filter(
                  (variant: any) =>
                    variant.sizes.some((size: any) => size.stock > 0) // Kiểm tra nếu bất kỳ size nào của material có stock > 0
                )
                .map((variant: any) => (
                  <button
                    key={variant.material}
                    className={`px-4 py-2 m-2 rounded ${
                      selectedMaterial === variant.material
                        ? "bg-primary-100 text-white"
                        : "bg-gray-200 dark:bg-gray-950"
                    }`}
                    onClick={() => setSelectedMaterial(variant.material)}
                  >
                    {variant.material}
                  </button>
                ))}
            </div>

            {/* Hiển thị Size dựa trên Material đã chọn */}
            {selectedMaterial && (
              <div className="mb-4">
                <p className="font-semibold text-[20px] jost">Size:</p>
                {product.variants
                  .find((variant: any) => variant.material === selectedMaterial)
                  ?.sizes.filter((size: any) => size.stock > 0) // Chỉ hiển thị size có stock > 0
                  .map((size: any) => (
                    <button
                      key={size._id}
                      className={`px-4 py-2 m-2 rounded ${
                        selectedSize === size.size
                          ? "bg-primary-100 text-white"
                          : "bg-gray-200 dark:bg-gray-950"
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded dark:bg-gray-950"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-100 text-white px-4 py-2 rounded"
                onClick={handleAddToCart}
                disabled={!selectedMaterial || !selectedSize}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isBuy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-dark100_light500 background-light800_dark400 p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-[24px] text-dark100_light500 font-bold jost mb-4">
              Choose Material and Size
            </h3>
            <div className="mb-4">
              <p className="font-semibold text-[20px] jost">Material:</p>
              {product.variants
                .filter(
                  (variant: any) =>
                    variant.sizes.some((size: any) => size.stock > 0) // Kiểm tra nếu bất kỳ size nào của material có stock > 0
                )
                .map((variant: any) => (
                  <button
                    key={variant.material}
                    className={`px-4 py-2 m-2 rounded ${
                      selectedMaterial === variant.material
                        ? "bg-primary-100 text-white"
                        : "bg-gray-200 dark:bg-gray-950"
                    }`}
                    onClick={() => setSelectedMaterial(variant.material)}
                  >
                    {variant.material}
                  </button>
                ))}
            </div>

            {/* Hiển thị Size dựa trên Material đã chọn*/}
            {selectedMaterial && (
              <div className="mb-4">
                <p className="font-semibold text-[20px] jost ">Size:</p>
                {product.variants
                  .find((variant: any) => variant.material === selectedMaterial)
                  ?.sizes.filter((size: any) => size.stock > 0) // Chỉ hiển thị size có stock > 0
                  .map((size: any) => (
                    <button
                      key={size._id}
                      className={`px-4 py-2 m-2 rounded ${
                        selectedSize === size.size
                          ? "bg-primary-100 text-white"
                          : "bg-gray-200 dark:bg-gray-950"
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
                <p className="font-semibold text-[20px] jost">Quantity:</p>
                <div className="w-[15%] flex items-center justify-center">
                  <button
                    className="px-2 background-light700_dark300"
                    onClick={handleDecreaseQuantity}
                  >
                    -
                  </button>
                  <span className="text-[16px] font-normal jost mx-2">
                    {quantity}
                  </span>
                  <button
                    className="px-2 background-light700_dark300"
                    onClick={handleIncreaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded dark:bg-gray-950"
                onClick={() => setIsBuy(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-100 text-white px-4 py-2 rounded"
                onClick={handleBuyNow}
                disabled={!selectedMaterial || !selectedSize}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <DetailProduct item={product} />
      <RelatedProduct categoryItem={product.category} />
    </div>
  );
};

export default page;
