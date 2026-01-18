import { CategoryResponse } from "@/dto/CategoryDTO";
import { useRouter } from "next/navigation";

// Sửa interface props
interface CategoriesProps {
  categoriesData: CategoryResponse[];
}

const Categories = ({ categoriesData }: CategoriesProps) => {
  const router = useRouter();

  const handleNavigateCategoryDetail = (id: string) => {
    router.push(`/category/${id}`);
  };

  return (
    <div className="mt-[150px] w-[95%] mx-auto">
      {/* Header */}
      <div className="flex items-center mb-4">
        <p className="jost text-[30px] font-normal text-dark100_light500">
          CATEGORIES
        </p>
        <div className="border-b-2 border-primary-100 ml-auto">
          <p className="font-medium text-dark100_light500 text-[14px] mt-5">
            See all
          </p>
        </div>
      </div>

      <div
        className="mt-[30px] flex overflow-x-auto gap-20 scrollbar-hide"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#ffffff #f4ece3",
        }}
      >
        {categoriesData?.map((category: CategoryResponse) => (
          <div
            key={category._id}
            className="flex-shrink-0 cursor-pointer flex flex-col items-center"
          >
            <div
              onClick={() => handleNavigateCategoryDetail(category._id)}
              className="w-[140px] h-[140px] object-cover rounded-full flex justify-center items-center my-3 shadow-md"
            >
              <p className="text-xl jost capitalize mt-2 text-dark100_light500">
                {category.name}
                <span className="text-primary-100 text-3xl">.</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background-color: #ffffff;
          border-radius: 10px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background-color: #f4ece3;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Categories;
