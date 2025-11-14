import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceForProducts from "apps/seller-ui/src/app/utils/axiosInstanceForProduct";
// ... other imports
// Removed unused image imports

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

interface ProductBasicInfoProps {
  // No image props needed
}
const ProductBasicInfo: React.FC<ProductBasicInfoProps> = () => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext(); // Correctly gets context from FormProvider

  // 1. This 'useEffect' now ONLY registers 'sizes'.
  // 'images' is registered in the parent CreateProduct component.
  useEffect(() => {
    register("sizes", { required: "At least one size is required" });
  }, [register]);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const resp = await axiosInstanceForProducts.get("/api/get-categories");
        return resp.data;
      } catch {
        return { categories: [], subcategories: {} };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const categories = data?.categories || [];
  const subCategories = data?.subcategories || {};

  const selectedCategory = useWatch({ control, name: "category" });
  const selectedSizes = useWatch({ control, name: "sizes", defaultValue: [] });

  useEffect(() => {
    setValue("subCategory", "");
  }, [selectedCategory, setValue]);

  const handleSizeClick = (size: string) => {
    const currentSizes = getValues("sizes") || [];
    let newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s: any) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", newSizes, { shouldValidate: true });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 text-sm mt-4">
        {/* ... (all your input fields for title, category, etc. remain the same) ... */}
        
        {/* Product Title */}
        <div>
          <label>Product Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{String(errors.title.message)}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label>Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          >
            <option value="">Select Category</option>
            {categories.map((c: string, i: number) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">{String(errors.category.message)}</p>
          )}
        </div>

        {/* Sub Category */}
        <div>
          <label>Sub Category</label>
          <select
            {...register("subCategory", { required: "Sub-category is required" })}
            disabled={!selectedCategory || !subCategories[selectedCategory]}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          >
            <option value="">Select Sub Category</option>
            {selectedCategory &&
              subCategories[selectedCategory] &&
              subCategories[selectedCategory].map((sc: string, i: number) => (
                <option key={i} value={sc}>
                  {sc}
                </option>
              ))}
          </select>
          {errors.subCategory && (
            <p className="text-xs text-red-500">{String(errors.subCategory.message)}</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label>Size</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {availableSizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  className={`px-3 py-1 rounded-md cursor-pointer text-xs border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {errors.sizes && (
            <p className="text-xs text-red-500 mt-1">{String(errors.sizes.message)}</p>
          )}
        </div>
        
        {/* ... (Regular Price, Sale Price, Stock inputs) ... */}

      </div>
    </>
  );
};

export default ProductBasicInfo;