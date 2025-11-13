"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import ProductSpecifications from "./ProductSpecifications"; // Fixed import typo
import ColorSelector from "./color-selector/ColorSelector";
import CustomProperties from "./custom-properties/CustomeProperties";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceForProducts from "apps/seller-ui/src/app/utils/axiosInstanceForProduct";

export default function ProductDetails() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const { data } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      try {
        const res =
          await axiosInstanceForProducts.get('/api/get-discount-codes');
        return res.data.discount_codes; // This should be an array of objects
      } catch (error) {
        console.log(error);
      }
    },
  });

  const selectedDiscountIds = watch('discountCodes') || [];

  const handleDiscountClick = (discountId: string) => {
    const currentlySelected = [...selectedDiscountIds];
    const index = currentlySelected.indexOf(discountId);

    if (index > -1) {
      currentlySelected.splice(index, 1);
    } else {
      currentlySelected.push(discountId);
    }
    setValue('discountCodes', currentlySelected, { shouldDirty: true });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Short Description */}
        <div className="col-span-2">
          <label>Short Description</label>
          <textarea
            {...register("shortDescription", {
              required: "Short description required",
              minLength: {
                value: 150,
                message: "Minimum 150 characters required",
              },
            })}
            rows={2}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm resize-none"
          ></textarea>
          {errors.shortDescription && (
            <p className="text-xs text-red-500">
              {String(errors.shortDescription.message)}
            </p>
          )}
        </div>

        {/* Detailed Description */}
        <div className="col-span-2">
          <label>Detailed Description</label>
          <textarea
            {...register("description", { required: "Description required" })}
            rows={3}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm resize-none"
          ></textarea>
          {errors.description && (
            <p className="text-xs text-red-500">
              {String(errors.description.message)}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label>Tags</label>
          <input
            {...register("tags")}
            placeholder="modern, wood"
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm"
          />
        </div>

        {/* Warranty */}
        <div>
          <label>Warranty</label>
          <input
            {...register("warranty")}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label>Slug</label>
          <input
            {...register("slug", {
              required: "Slug is required",
              minLength: {
                value: 3,
                message: "Slug must be at least 3 characters long",
              },
              maxLength: {
                value: 50,
                message: "Slug must be no more than 50 characters long",
              },
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // More flexible slug pattern
                message:
                  "Slug must be lowercase alphanumeric with hyphens (e.g., 'product-slug')",
              },
            })}
            placeholder="product-slug"
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm"
          />
          {errors.slug && (
            <p className="text-red-500">{errors.slug.message as string}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label>Brand</label>
          <input
            {...register("brand")}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm"
          />
        </div>

        {/* Video URL */}
        <div className="col-span-2">
          <label>Video URL</label>
          <input
            {...register("videoUrl")}
            placeholder="https://youtube.com/..."
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm"
          />
        </div>

        {/* Cash on Delivery */}
        <div>
          <label>Cash on Delivery</label>
          <select
            {...register("cashOnDelivery")}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* ColorSelector */}
        <div className="col-span-2 mt-2">
          <ColorSelector control={control} errors={errors} />
        </div>
      </div>

      <ProductSpecifications />

      <CustomProperties />

      {/* --- MOVED: Discount Code --- */}
      <div className="text-xs mt-3">
        <label>Discount Codes (Select multiple)</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {Array.isArray(data) &&
            data.map((code: any) => {
              // Check if this code's ID is in the selected array
              const isSelected = selectedDiscountIds.includes(code.id);
              return (
                <button
                  type="button" // <-- IMPORTANT: Prevents form submission
                  key={code.id}
                  onClick={() => handleDiscountClick(code.id)}
                  className={`px-3 py-1 rounded-md cursor-pointer text-xs border
                    ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500" // Selected style
                        : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600" // Default style
                    }
                  `}
                >
                  {code.discountCode} {code.discountValue} {code.discountType=='percentage'?'%':'Rs'} {/* Display the code name */}
                </button>
              );
            })}
        </div>
      </div>
      {/* --- END OF MOVED SECTION --- */}
    </>
  );
}