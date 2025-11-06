"use client";

// Import React and necessary hooks
import React, { useEffect } from "react";
// Import all RHF methods we need
import { useFormContext, useWatch } from "react-hook-form";

// Import child components and services
import { MultipleImageUpload } from "./Image"; // Assuming this path is correct
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the available sizes
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

interface ProductBasicInfoProps {
  onImagesChange: (files: File[]) => void;
}

export default function ProductBasicInfo({ onImagesChange }: ProductBasicInfoProps) {
  // 1. Get ALL methods from RHF context
  const {
    register,
    formState: { errors },
    control, // <-- For useWatch
    setValue, // <-- To programmatically set values
    clearErrors, // <-- To clear errors
    getValues, // <-- To get other field values for validation
  } = useFormContext();

  // 2. Register "uncontrolled" fields in a useEffect
  useEffect(() => {
    // These fields don't have a standard <input>, so we register them manually.
    register("images", { required: "At least one image is required" });
    register("sizes", { required: "At least one size is required" });
  }, [register]);

  // 3. Fetch categories
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/get-categories");
        return response.data;
      } catch (error) {
        console.log(error);
        return { categories: [], subcategories: {} }; // Return default on error
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const categories = data?.categories || [];
  const subCategories = data?.subcategories || {}; // <-- Fixed typo from subCategories to subcategories

  // 4. Watch for changes in 'category' and 'sizes'
  const selectedCategory = useWatch({ control, name: "category" });
  const selectedSizes = useWatch({ control, name: "sizes", defaultValue: [] });

  // 5. useEffect to reset sub-category when category changes
  useEffect(() => {
    setValue("subCategory", ""); // Reset sub-category
  }, [selectedCategory, setValue]);

  // 6. Handler for Image Upload
  // This function connects your 'MultipleImageUpload' component to RHF
  const handleImagesChange = (files: File[]) => {
    onImagesChange(files); // Pass files to parent
    if (files.length > 0) {
      setValue("images", files, { shouldValidate: true }); // Set RHF value
      clearErrors("images"); // Clear error if files are added
    } else {
      setValue("images", [], { shouldValidate: true }); // Set empty array and validate
    }
  };

  // 7. Handler for the new Size selection
  const handleSizeClick = (size: string) => {
    // Check if the size is already selected
    const currentSizes: string[] = getValues("sizes") || [];
    let newSizes: string[];

    if (currentSizes.includes(size)) {
      // If selected, filter it out (de-select)
      newSizes = currentSizes.filter((s) => s !== size);
    } else {
      // If not selected, add it
      newSizes = [...currentSizes, size];
    }
    
    // Update the RHF value and trigger validation
    setValue("sizes", newSizes, { shouldValidate: true });
  };

  return (
    <>
      {/* ---------- Image Upload ---------- */}
      <label>Product Images</label>
      <MultipleImageUpload onImagesChange={handleImagesChange} />
      {/* UNCOMMENTED: This will now show errors from RHF */}
      {errors.images && (
        <p className="text-xs text-red-500">
          {String(errors.images.message)}
        </p>
      )}

      {/* ---------- Basic Inputs Grid ---------- */}
      <div className="grid grid-cols-1 gap-2 text-sm mt-4">
        {/* ----- Product Title ----- */}
        <div>
          <label>Product Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          />
          {errors.title && (
            <p className="text-xs text-red-500">
              {String(errors.title.message)}
            </p>
          )}
        </div>

        {/* ----- Category ----- */}
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
            <p className="text-xs text-red-500">
              {String(errors.category.message)}
            </p>
          )}
        </div>

        {/* ----- Sub Category (Dynamic) ----- */}
        <div>
          <label>Sub Category</label>
          <select
            {...register("subCategory", {
              required: "Sub-category is required",
            })}
            disabled={!selectedCategory || !subCategories[selectedCategory]} // Disable if no category or no sub-categories
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
            <p className="text-xs text-red-500">
              {String(errors.subCategory.message)}
            </p>
          )}
        </div>

        {/* ----- NEW: Size Selector ----- */}
        <div>
          <label>Size</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {availableSizes.map((size) => {
              const isSelected = selectedSizes && selectedSizes.includes(size);
              return (
                <button
                  type="button" // <-- IMPORTANT: Prevents form submission
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  className={`px-3 py-1 rounded-md cursor-pointer text-xs border
                    ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500" // Selected style
                        : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" // Default style
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {errors.sizes && (
            <p className="text-xs text-red-500 mt-1">
              {String(errors.sizes.message)}
            </p>
          )}
        </div>

        {/* ----- Regular Price ----- */}
        <div>
          <label>Regular Price</label>
          <input
            type="number"
            {...register("regularPrice", {
              required: "Regular price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be 0 or more" },
            })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          />
          {errors.regularPrice && (
            <p className="text-xs text-red-500">
              {String(errors.regularPrice.message)}
            </p>
          )}
        </div>

        {/* ----- Sale Price ----- */}
        <div>
          <label>Sale Price (Optional)</label>
          <input
            type="number"
            {...register("salePrice", {
              valueAsNumber: true,
              min: { value: 0, message: "Price must be 0 or more" },
              validate: (salePrice) => {
                const regularPrice = getValues("regularPrice");
                if (salePrice && regularPrice) {
                  return (
                    salePrice < regularPrice ||
                    "Sale price must be less than regular price"
                  );
                }
                return true;
              },
            })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          />
          {errors.salePrice && (
            <p className="text-xs text-red-500">
              {String(errors.salePrice.message)}
            </p>
          )}
        </div>

        {/* ----- Stock ----- */}
        <div>
          <label>Stock</label>
          <input
            type="number"
            {...register("stock", {
              required: "Stock quantity is required",
              valueAsNumber: true,
              min: { value: 0, message: "Stock cannot be negative" },
            })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          />
          {errors.stock && (
            <p className="text-xs text-red-500">
              {String(errors.stock.message)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}