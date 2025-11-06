"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import ProductBasicInfo from "./components/ProductBasicInfo";
import ProductDetails from "./components/ProductDetails";


// Your interfaces remain the same
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
  discountCode: string;
  cashOnDelivery: boolean;
  specifications: Specification[];
  images: FileList; // Note: Your MultipleImageUpload component doesn't seem to use this.
}

export default function CreateProduct() {
  // 1. Initialize all form methods
  const methods = useForm<ProductFormValues>({
    defaultValues: { specifications: [] },
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 2. This logic stays in the parent
  const onSubmit = (data: ProductFormValues) => {
    console.log("React Hook Form Data:", data);
    //console.log("Uploaded Files State:", uploadedFiles);
    // You'll likely want to combine these for your API call
    // const finalData = { ...data, images: uploadedFiles };
    // console.log("Final Data to Submit:", finalData);
  };

  const handleImagesChange = (files: File[]) => {
    console.log("Updated images in parent:", files);
    setUploadedFiles(files);
  };

  return (
    <div className="p-6 text-gray-200">
      {/* 3. Wrap your form in FormProvider */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)} // Use methods.handleSubmit
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* 4. Render the new child components */}
          <div className="flex flex-col bg-gray-900/60 border border-gray-700 rounded-xl p-4 space-y-4 h-fit">
            <ProductBasicInfo onImagesChange={handleImagesChange} />
          </div>

          <div className="lg:col-span-2 bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <ProductDetails /> {/* This component will render specifications inside it */}

            {/* Submit button stays in the main form */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-white text-sm transition"
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