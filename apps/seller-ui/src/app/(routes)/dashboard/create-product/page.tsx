"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ProductBasicInfo from "./components/product-basic/ProductBasicInfo";
import ProductDetails from "./components/product-details/ProductDetails";
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct";
import convertFileToBase64 from "../../../utils/convertToBase64";


export default function CreateProduct() {
  const methods = useForm({ defaultValues: { /* ... */ } });
  const onSubmit = (data: any) => { console.log(data); };
  

  // images array holds URLs returned by backend
  const [images, setImages] = useState<string[]>([]);

  // Upload a single file as base64 to backend, get URL in response
  const uploadImageToBackend = async (base64: string): Promise<string> => {
    try {
      const response = await axiosInstanceForProducts.post("/api/upload-product-image", { data: base64 });
      return response.data.url; // backend returns image URL (adjust as needed)
    } catch (error) {
      console.error("Upload failed", error);
      throw error;
    }
  };

  // Delete image on backend via URL or ID
  const deleteImageOnBackend = async (imageUrl: string): Promise<void> => {
    try {
      await axiosInstanceForProducts.post("/api/delete-image", { url: imageUrl });
    } catch (error) {
      console.error("Delete failed", error);
      throw error;
    }
  };

  // Called by MultipleImageUpload when user selects files
  const handleFilesSelected = async (files: File[]) => {
    for (const file of files) {
      try {
        const base64 = await convertFileToBase64(file);
        const uploadedUrl = await uploadImageToBackend(base64);
        setImages((prev) => [...prev, uploadedUrl]);
      } catch (error) {
        // Handle upload error, e.g., show toast
      }
    }
  };

  // Called by remove button with URL to delete
  const handleRemoveImage = async (urlToRemove: string) => {
    try {
      await deleteImageOnBackend(urlToRemove);
      setImages((prev) => prev.filter((url) => url !== urlToRemove));
    } catch (error) {
      // Handle delete error, e.g., show toast
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

 
  const handleImagesChange = (files: File[]) => setUploadedFiles(files);

 

  return (
    <div className="p-6 text-gray-200 min-h-screen bg-gray-950">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-96 bg-gray-900/60 border border-gray-700 rounded-xl p-4 flex flex-col space-y-4">
            <ProductBasicInfo handleImageChange={handleImagesChange} handleRemoveImage={handleRemoveImage} handleFilesSelected={handleFilesSelected} images={images} />
          </div>
          <div className="flex-1 bg-gray-900/60 border border-gray-700 rounded-xl p-5 flex flex-col">
            <ProductDetails />
            <div className="mt-6 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-white text-sm transition">
                Create Product
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

