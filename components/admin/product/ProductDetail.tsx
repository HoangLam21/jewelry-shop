import InputUnEdit from "@/components/shared/input/InputUnEdit";
import SwiperProduct from "@/components/shared/swiper/SwiperImage";
import TableImport from "@/components/shared/table/TableImport";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductData, Variant } from "./ProductList";
import { formatCurrency } from "@/lib/utils";
import { useProductManageContext } from "@/contexts/ProductManageContext";

interface Props {
  detailProduct: ProductData;
  onEdit: (id: string) => void;
  onBack: (value: boolean) => void;
}

const ProductDetail = ({ detailProduct, onBack, onEdit }: Props) => {
  const router = useRouter();
  const { providerList, voucherList, collectionList } =
    useProductManageContext();

  const nameProvider = detailProduct?.provider
    ? providerList.find((provider) => provider.id === detailProduct.provider)
        ?.name || "Unknown"
    : "None";
  const nameVoucher = detailProduct?.vouchers
    ? voucherList.find((voucher) => voucher.id === detailProduct.vouchers)
        ?.name || "Unknown"
    : "None";
  const nameCollection = detailProduct?.collection
    ? collectionList.find((coll) => coll.id === detailProduct.collection)
        ?.name || "Unknown"
    : "None";

  const handleAddImport = () => {
    router.push("/admin/import/add");
  };

  const columns = [
    { header: "Material", accessor: "material" },
    {
      header: "Add on",
      accessor: "addon",
    },
    {
      header: "Size",
      accessor: "size",
    },
    {
      header: "Stock",
      accessor: "stock",
    },
  ];
  const renderRow = (variant: Variant) => {
    return (
      <>
        <tr
          key={variant.material}
          className="border-t border-gray-300 text-sm dark:text-dark-360"
        >
          {/* Cột Material */}
          <td rowSpan={variant.sizes.length || 1} className="px-4 py-2">
            <p className="text-sm dark:text-dark-360">{variant.material}</p>
          </td>
          {/* Cột AddOn */}
          <td rowSpan={variant.sizes.length || 1} className="px-4 py-2">
            <p className="text-sm dark:text-dark-360">
              {formatCurrency(variant.addOn)}
            </p>
          </td>
          {/* Hiển thị Size và Stock từ hàng đầu tiên */}
          {variant.sizes.length > 0 ? (
            <>
              <td className="px-4 py-2">
                <p className="text-sm dark:text-dark-360">
                  {variant.sizes[0].size}
                </p>
              </td>
              <td className="px-4 py-2 flex detailProducts-center justify-between">
                <p className="text-sm dark:text-dark-360">
                  {variant.sizes[0].stock}
                </p>
              </td>
            </>
          ) : (
            <>
              <td colSpan={2} className="px-4 py-2 text-center">
                No sizes available
              </td>
            </>
          )}
        </tr>
        {/* Các hàng còn lại hiển thị thông tin sizes */}
        {variant.sizes.slice(1).map((sizeInfo, index) => (
          <tr
            key={`${variant.material}-${sizeInfo.size}-${index}`}
            className="border-t border-gray-300 text-sm dark:text-dark-360"
          >
            <td className="px-4 py-2">
              <p className="text-sm dark:text-dark-360">{sizeInfo.size}</p>
            </td>
            <td className="px-4 py-2 flex detailProducts-center justify-between">
              <p className="text-sm dark:text-dark-360">{sizeInfo.stock}</p>
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="w-[880px] h-[700px] rounded-lg background-light800_dark300 detailProducts-center justify-start flex flex-row shadow-sm drop-shadow-sm shadow-zinc-700 pr-2 pb-6 gap-5 overflow-y-scroll overflow-x-hidden scrollable">
        <div className="flex flex-col w-[50%] h-full detailProducts-start justify-start gap-4 flex-grow-0">
          <div className="flex w-full h-[350px] detailProducts-start justify-start">
            <Image
              src={detailProduct.image}
              alt="productImage"
              width={750}
              height={350}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <div className="w-full h-[80px] flex ">
            <SwiperProduct
              urlImage={detailProduct.imageInfo.map(
                (detailProduct) => detailProduct.url
              )}
              width="80"
              height="80"
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow h-full justify-start gap-4 detailProducts-center">
          <div className="flex flex-col gap-6 w-full h-fit">
            <div className="flex flex-row detailProducts-start justify-between w-full h-fit pt-2">
              <div className="flex w-fit h-fit pt-4">
                <p className="text-dark100_light500 h3-bold">
                  {detailProduct.productName}
                </p>
              </div>
              <div className="flex w-fit h-fit justify-end detailProducts-center">
                <Icon
                  icon="iconoir:cancel"
                  width={24}
                  height={24}
                  className="text-dark100_light500 cursor-pointer"
                  onClick={() => onBack(false)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 detailProducts-start justify-start w-full h-fit pr-4">
              <div className="flex flex-row gap-4 w-full h-fit">
                <div className="w-1/2 h-fit gap-4 flex flex-col">
                  <InputUnEdit
                    titleInput="ID"
                    value={detailProduct.id}
                    width="w-full"
                  />
                  <InputUnEdit
                    titleInput="Category"
                    value={detailProduct.category || ""}
                    width="w-full"
                  />
                </div>
                <div className="w-1/2 h-fit gap-4 flex flex-col">
                  <InputUnEdit
                    titleInput="Collection"
                    value={nameCollection}
                    width="w-full"
                  />
                  <InputUnEdit
                    titleInput="Price"
                    value={detailProduct.price}
                    width="w-full"
                  />
                </div>
              </div>
              <div className="flex w-full h-fit">
                <InputUnEdit
                  titleInput="Voucher"
                  value={nameVoucher}
                  width="w-full"
                />
              </div>
              <div className="flex w-full h-fit">
                <InputUnEdit
                  titleInput="Provider"
                  value={nameProvider}
                  width="w-full"
                />
              </div>
              <div className="flex w-full h-fit">
                <InputUnEdit
                  titleInput="Description"
                  value={detailProduct.description}
                  width="w-full"
                />
              </div>

              <div className="flex flex-row gap-4 w-full h-fit">
                <div className="flex border border-border-color rounded-lg w-full h-fit">
                  <TableImport
                    columns={columns}
                    data={detailProduct.variants || []}
                    renderRow={renderRow}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end w-full detailProducts-center pr-4 pb-2">
            <div className="flex flex-row w-full h-fit gap-6 justify-end">
              <Button
                onClick={() => onEdit(detailProduct.id)}
                className="paragraph-regular text-primary-100 py-2 px-3 rounded-lg border-primary-100 w-fit shadow-none border"
              >
                Edit
              </Button>
              <Button
                className="bg-primary-100 hover:bg-primary-100 text-dark-100 paragraph-regular py-2 px-3 rounded-lg w-fit"
                onClick={handleAddImport}
              >
                Add import
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
