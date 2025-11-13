"use client";
import React, { useState, useEffect, useRef ,useMemo} from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch,
  useFieldArray,
  Controller,
  Control,
} from "react-hook-form";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct";

// ===== Interfaces =====
interface Specification {
  name: string;
  value: string;
}

interface ProductFormValues {
  title: string;
  shortDescription: string;
  category: string;
  subCategory: string;
  description: string;
  tags: string;
  warranty: string;
  slug: string;
  brand: string;
  videoUrl: string;
  regularPrice: number;
  salePrice: number;
  stock: number;
  discountCodes: string[]; // array for multiple discount codes
  cashOnDelivery: boolean | string;
  specifications: Specification[];
  images: File[];
  sizes: string[];
  color: string[];
  properties: { [key: string]: string };
}

// ===== MultipleImageUpload Component =====
interface MultipleImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
}) => {
  const { register, setValue } = useForm<{ images: File[] }>({
    defaultValues: { images: [] },
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize URLs
  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  // Cleanup URLs on unmount and when previewUrls changes
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const updateFiles = (files: File[]) => {
    setSelectedFiles(files);
    setValue("images", files, { shouldValidate: true });
    onImagesChange(files); // Call here to avoid infinite loop
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incomingFiles = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...incomingFiles].slice(0, 8);
      updateFiles(newFiles);
      e.target.value = "";
    }
  };

  const handleDelete = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  const mainImageUrl = previewUrls[previewUrls.length - 1];
  const thumbnailUrls = previewUrls.slice(0, -1);

  return (
    <div className="relative w-full max-w-full bg-gray-900 rounded-lg border border-gray-700 p-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full shadow text-white"
        title="Add / Edit Images"
      >
        <Plus size={20} />
      </button>

      <div className="w-full h-60 sm:h-72 flex items-center justify-center bg-gray-800 rounded-md mb-3 relative z-10">
        {mainImageUrl ? (
          <>
            <img
              src={mainImageUrl}
              alt="Main Preview"
              className="max-w-full max-h-full object-contain rounded-md"
              draggable={false}
            />
            <button
              type="button"
              onClick={() => handleDelete(previewUrls.length - 1)}
              className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full shadow text-white z-20"
              title="Delete Image"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400 select-none">
            <p>Upload Images</p>
            <p className="text-xs text-gray-500">(Max 8)</p>
          </div>
        )}
      </div>

      {thumbnailUrls.length > 0 && (
        <div className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {thumbnailUrls.map((url, index) => (
            <div
              key={url}
              className="relative w-16 h-16 flex-shrink-0 rounded-md border border-gray-700 bg-gray-800"
            >
              <img
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-contain rounded-md"
                draggable={false}
              />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 p-1 rounded-full text-white shadow z-20"
                title="Delete Image"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        multiple
        {...register("images")}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
};
// ===== ProductBasicInfo =====
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
interface ProductBasicInfoProps {
  onImagesChange: (files: File[]) => void;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ onImagesChange }) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    getValues,
  } = useFormContext<ProductFormValues>();

  useEffect(() => {
    register("images", { required: "At least one image is required" });
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

  const handleImagesChange = (files: File[]) => {
    onImagesChange(files);
    if (files.length > 0) {
      setValue("images", files, { shouldValidate: true });
      clearErrors("images");
    } else {
      setValue("images", [], { shouldValidate: true });
    }
  };

  const handleSizeClick = (size: string) => {
    const currentSizes = getValues("sizes") || [];
    let newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", newSizes, { shouldValidate: true });
  };

  return (
    <>
      <label className="font-semibold text-sm">Product Images</label>
      <MultipleImageUpload onImagesChange={handleImagesChange} />
      {errors.images && (
        <p className="text-xs text-red-500">{String(errors.images.message)}</p>
      )}

      <div className="grid grid-cols-1 gap-2 text-sm mt-4">
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
            <p className="text-xs text-red-500">{String(errors.regularPrice.message)}</p>
          )}
        </div>

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
                  return salePrice < regularPrice || "Sale price must be less than regular price";
                }
                return true;
              },
            })}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          />
          {errors.salePrice && (
            <p className="text-xs text-red-500">{String(errors.salePrice.message)}</p>
          )}
        </div>

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
            <p className="text-xs text-red-500">{String(errors.stock.message)}</p>
          )}
        </div>
      </div>
    </>
  );
};

// ===== ProductSpecifications =====
function ProductSpecifications() {
  const { control, register } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-2 text-white">Custom Specifications</h3>
      <button
        type="button"
        onClick={() => append({ name: "", value: "" })}
        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-xs text-white transition"
      >
        + Add Specification
      </button>

      {fields.length > 0 && (
        <div className="mt-3 space-y-2">
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-6 gap-2 items-end">
              <div className="col-span-2 flex flex-col">
                <label htmlFor={`specifications.${index}.name`} className="text-xs mb-1">
                  Specification Name
                </label>
                <input
                  id={`specifications.${index}.name`}
                  {...register(`specifications.${index}.name` as const)}
                  placeholder="e.g., Battery life, weight , Material"
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
                />
              </div>

              <div className="col-span-3 flex flex-col">
                <label htmlFor={`specifications.${index}.value`} className="text-xs mb-1">
                  Value
                </label>
                <input
                  id={`specifications.${index}.value`}
                  {...register(`specifications.${index}.value` as const)}
                  placeholder="e.g., 4000mah, 1.5kg , Plastic"
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-600 text-xs pb-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== CustomProperties =====
function CustomProperties() {
  const { control } = useFormContext<ProductFormValues>();

  const [properties, setProperties] = useState<
    { name: string; options: string[] }[]
  >([]);
  const [newPropertyName, setNewPropertyName] = useState("");
  const [newValueInputs, setNewValueInputs] = useState<{ [key: string]: string }>(
    {}
  );

  const handleAddNewProperty = () => {
    if (
      !newPropertyName.trim() ||
      properties.find((p) => p.name.toLowerCase() === newPropertyName.toLowerCase())
    ) {
      return;
    }
    setProperties([...properties, { name: newPropertyName, options: [] }]);
    setNewValueInputs({ ...newValueInputs, [newPropertyName]: "" });
    setNewPropertyName("");
  };

  const handleAddNewValue = (propertyName: string) => {
    const value = newValueInputs[propertyName]?.trim();
    if (!value) return;
    setProperties((currentProperties) =>
      currentProperties.map((prop) => {
        if (prop.name === propertyName && !prop.options.includes(value)) {
          return { ...prop, options: [...prop.options, value] };
        }
        return prop;
      })
    );
    setNewValueInputs({ ...newValueInputs, [propertyName]: "" });
  };

  const handleRemoveProperty = (propertyName: string) => {
    setProperties(properties.filter((prop) => prop.name !== propertyName));
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-2 text-white">Custom Properties</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPropertyName}
          onChange={(e) => setNewPropertyName(e.target.value)}
          placeholder="e.g., Color, Size, Material"
          className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddNewProperty();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddNewProperty}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-xs text-white transition whitespace-nowrap"
        >
          + Add Property
        </button>
      </div>

      <div className="space-y-4">
        {properties.map((prop) => (
          <div
            key={prop.name}
            className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-200">{prop.name}</h4>
              <button
                type="button"
                onClick={() => handleRemoveProperty(prop.name)}
                className="text-red-400 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newValueInputs[prop.name] || ""}
                onChange={(e) =>
                  setNewValueInputs({
                    ...newValueInputs,
                    [prop.name]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewValue(prop.name);
                  }
                }}
                placeholder="Add a value (e.g., Red) and press Enter"
                className="w-full bg-gray-900 text-gray-200 border border-gray-600 px-2 py-1 rounded-sm text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddNewValue(prop.name)}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-sm text-xs text-white transition"
              >
                Add
              </button>
            </div>

            <Controller
              name={`properties.${prop.name}`}
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {prop.options.length === 0 && (
                    <p className="text-xs text-gray-400">No values added yet.</p>
                  )}
                  {prop.options.map((option) => {
                    const isSelected = field.value === option;
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => field.onChange(option)}
                        className={`px-2 py-0.5 rounded-full text-xs transition ${
                          isSelected
                            ? "bg-indigo-600 text-white font-semibold"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
// ===== ColorSelector =====
const defaultColors = [
  "#000000",
  "#0000FF",
  "#008000",
  "#00FFFF",
  "#FF0000",
  "#FFFFFF",
  "#FFFF00",
  "#FF00FF",
];

interface ColorSelectorProps {
  control: Control<ProductFormValues>;
  errors: any;
}


function ColorSelector({ control, errors }: ColorSelectorProps) {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#000000");

  const handleAddNewColor = () => {
    if (newColor && !defaultColors.includes(newColor) && !customColors.includes(newColor)) {
      setCustomColors((prev) => [...prev, newColor]);
    }
    setShowColorPicker(false);
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-200">Select Colors</label>
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex gap-1.5 flex-wrap items-center">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ["#FFFFFF", "#FFFF00"].includes(color.toUpperCase());

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => {
                    const currentValue = field.value || [];
                    const newValue = isSelected
                      ? currentValue.filter((c: string) => c !== color)
                      : [...currentValue, color];
                    field.onChange(newValue);
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 ${
                    isLightColor ? "border border-gray-400" : ""
                  } ${isSelected ? "ring-2 ring-offset-1 ring-offset-gray-800 ring-indigo-500" : ""}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                >
                  {isSelected && (
                    <Check
                      size={12}
                      className={isLightColor ? "text-black" : "text-white"}
                    />
                  )}
                </button>
              );
            })}

            {!showColorPicker && (
              <button
                type="button"
                onClick={() => setShowColorPicker(true)}
                className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
                aria-label="Add new color"
              >
                <Plus size={12} />
              </button>
            )}

            {showColorPicker && (
              <div className="flex items-center gap-1 p-0.5 bg-gray-800 rounded-md border border-gray-700">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-5 h-5 border-none p-0 rounded-sm cursor-pointer bg-transparent"
                  style={{ backgroundColor: newColor }}
                />
                <button
                  type="button"
                  onClick={handleAddNewColor}
                  className="px-1 py-0 bg-indigo-600 hover:bg-indigo-700 rounded text-[11px] text-white"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="px-1 py-0 bg-gray-600 hover:bg-gray-500 rounded text-[11px] text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      />
      {errors.color && <p className="text-xs text-red-500">{String(errors.color.message)}</p>}
    </div>
  );
}

// ===== ProductDetails Component =====
function ProductDetails() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProductFormValues>();

  const { data } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      try {
        const res = await axiosInstanceForProducts.get('/api/get-discount-codes');
        return res.data.discount_codes; // array of discount codes
      } catch (error) {
        console.log(error);
        return [];
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
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-500">{String(errors.shortDescription.message)}</p>
          )}
        </div>

        {/* Detailed Description */}
        <div className="col-span-2">
          <label>Detailed Description</label>
          <textarea
            {...register("description", { required: "Description required" })}
            rows={3}
            className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{String(errors.description.message)}</p>
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
              minLength: { value: 3, message: "Slug must be at least 3 characters long" },
              maxLength: { value: 50, message: "Slug must be no more than 50 characters long" },
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
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

      {/* Discount Codes */}
      <div className="text-xs mt-3">
        <label>Discount Codes (Select multiple)</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {Array.isArray(data) &&
            data.map((code: any) => {
              const isSelected = selectedDiscountIds.includes(code.id);
              return (
                <button
                  type="button"
                  key={code.id}
                  onClick={() => handleDiscountClick(code.id)}
                  className={`px-3 py-1 rounded-md cursor-pointer text-xs border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  {code.discountCode} {code.discountValue} {code.discountType === "percentage" ? "%" : "Rs"}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
}

// ===== Main CreateProduct Page =====
export default function CreateProduct() {
  const methods = useForm<ProductFormValues>({
    defaultValues: { specifications: [], sizes: [], discountCodes: [], color: [], properties: {} },
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onSubmit = (data: ProductFormValues) => {
    // combine uploadedFiles if needed or use data.images directly
    console.log("Form data:", data);
  };

  const handleImagesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  return (
    <div className="p-6 text-gray-200 min-h-screen bg-gray-950">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Basic Info and Images */}
          <div className="w-full lg:w-96 bg-gray-900/60 border border-gray-700 rounded-xl p-4 flex flex-col space-y-4">
            <ProductBasicInfo onImagesChange={handleImagesChange} />
          </div>

          {/* Right side - Product Details */}
          <div className="flex-1 bg-gray-900/60 border border-gray-700 rounded-xl p-5 flex flex-col">
            <ProductDetails />
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-white text-sm transition"
              >
                Create Product
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}



// "use client";
// import React, { useState } from "react";
// import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
// import ProductBasicInfo from "./components/ProductBasicInfo";
// import ProductDetails from "./components/ProductDetails";


// // Your interfaces remain the same
// interface Specification {
//   name: string;
//   value: string;
// }

// interface ProductFormValues {
//   title: string;
//   shortDescription: string;
//   category: string;
//   subCategory: string;
//   description: string;
//   tags: string;
//   warranty: string;
//   slug: string;
//   brand: string;
//   videoUrl: string;
//   regularPrice: number;
//   salePrice: number;
//   stock: number;
//   discountCode: string;
//   cashOnDelivery: boolean;
//   specifications: Specification[];
//   images: FileList; // Note: Your MultipleImageUpload component doesn't seem to use this.
// }

// export default function CreateProduct() {
//   // 1. Initialize all form methods
//   const methods = useForm<ProductFormValues>({
//     defaultValues: { specifications: [] },
//   });

//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//   // 2. This logic stays in the parent
//   const onSubmit = (data: ProductFormValues) => {
//     console.log("React Hook Form Data:", data);
//     //console.log("Uploaded Files State:", uploadedFiles);
//     // You'll likely want to combine these for your API call
//     // const finalData = { ...data, images: uploadedFiles };
//     // console.log("Final Data to Submit:", finalData);
//   };

//   const handleImagesChange = (files: File[]) => {
//     console.log("Updated images in parent:", files);
//     setUploadedFiles(files);
//   };

//   return (
//     <div className="p-6 text-gray-200">
//       {/* 3. Wrap your form in FormProvider */}
//       <FormProvider {...methods}>
//         <form
//           onSubmit={methods.handleSubmit(onSubmit)} // Use methods.handleSubmit
//           className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//         >
//           {/* 4. Render the new child components */}
//           <div className="flex flex-col bg-gray-900/60 border border-gray-700 rounded-xl p-4 space-y-4 h-fit">
//             <ProductBasicInfo onImagesChange={handleImagesChange} />
//           </div>

//           <div className="lg:col-span-2 bg-gray-900/60 border border-gray-700 rounded-xl p-5">
//             <ProductDetails /> {/* This component will render specifications inside it */}

//             {/* Submit button stays in the main form */}
//             <div className="mt-6 flex justify-end">
//               <button
//                 type="submit"
//                 className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-white text-sm transition"
//               >
//                 Create Product
//               </button>
//             </div>
//           </div>
//         </form>
//       </FormProvider>
//     </div>
//   );
// }