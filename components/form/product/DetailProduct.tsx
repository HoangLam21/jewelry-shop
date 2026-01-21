// import PagingBar from "@/components/shared/bar/PagingBar";
// import React, { useState } from "react";
// import Description from "./Description";
// import AdditionalInformation from "./AdditonalInformation";
// import Reviews from "./Reviews";
// import { ProductData } from "@/components/admin/product/ProductList";
// import { ProductResponse } from "@/dto/ProductDTO";

// const DetailProduct = ({ item }: { item: ProductResponse }) => {
//   const [activeTitle, setActiveTitle] = useState("DESCRIPTION"); // Track the active title
//   //const title = ["DESCRIPTION", "ADDITIONAL INFORMATION", "REVIEWS"];
//   const title = ["DESCRIPTION", "REVIEWS"];

//   const handleTitleClick = (selectedTitle: string) => {
//     setActiveTitle(selectedTitle);
//     console.log(`Selected Title: ${selectedTitle}`);
//   };
//   return (
//     <div className="w-full h-full flex flex-col">
//       <div className="w-full h-full flex flex-col items-center border-b border-border-color ">
//         <PagingBar title={title} event={handleTitleClick} />
//       </div>
//       {activeTitle === "DESCRIPTION" && (
//         <Description description={item.description} />
//       )}
//       {/* {activeTitle === "ADDITIONAL INFORMATION" && <AdditionalInformation />} */}
//       {activeTitle === "REVIEWS" && <Reviews />}
//     </div>
//   );
// };

// export default DetailProduct;

import PagingBar from "@/components/shared/bar/PagingBar";
import React, { useState } from "react";
import Description from "./Description";
import Reviews from "./Reviews";
import { ProductResponse } from "@/dto/ProductDTO";
import { Star } from "lucide-react";

interface DetailProductProps {
  item: ProductResponse;
  productId: string;
  ratingStats: {
    averageRating: number;
    totalReviews: number;
    distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  };
}

const DetailProduct: React.FC<DetailProductProps> = ({
  item,
  productId,
  ratingStats,
}) => {
  const [activeTitle, setActiveTitle] = useState("DESCRIPTION");
  const [totalReviews, setTotalReviews] = useState(ratingStats.totalReviews);

  const handleTitleClick = (selectedTitle: string) => {
    setActiveTitle(selectedTitle);
  };

  return (
    <div className="w-full flex flex-col bg-white dark:bg-dark-300 rounded-lg shadow-sm">
      {/* Header với Rating Summary */}
      <div className="w-full border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-4">
          {/* Navigation Tabs */}
          <PagingBar
            title={["DESCRIPTION", "REVIEWS"]}
            event={handleTitleClick}
          />

          {/* Rating Summary - Hiển thị khi tab REVIEWS active */}
          {activeTitle === "REVIEWS" && (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-400 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold text-dark100_light500">
                  {ratingStats.averageRating.toFixed(1)}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {activeTitle === "DESCRIPTION" && (
          <Description description={item.description} />
        )}
        {activeTitle === "REVIEWS" && (
          <Reviews
            productId={productId}
            setTotalReviews={setTotalReviews}
            ratingStats={ratingStats}
          />
        )}
      </div>
    </div>
  );
};

export default DetailProduct;
