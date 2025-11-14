"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ProductBasicInfo from "./components/product-basic/ProductBasicInfo";
import ProductDetails from "./components/product-details/ProductDetails";
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct";
import convertFileToBase64 from "../../../utils/convertToBase64"; // Using the imported version
import PlaceHolder from "./components/multiple-image/PlaceHolder";
import { Wand, X } from "lucide-react";
import enhancements from "../../../utils/ai-enhancements/aiEnhancements";

interface UploadedImage {
  file_url: string;
  fileId: string;
}
interface IProductForm {
  images: UploadedImage[];
  sizes: string[];
  title: string;
  category: string;
  subCategory: string;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  shortDescription: string;
  description: string;
  tags?: string;
  warranty?: string;
  slug: string;
  brand?: string;
  videoUrl?: string;
  cashOnDelivery: string; // Assuming "true" or "false" string
  colors: { name: string; hex: string }[];
  specifications: { key: string; value: string }[];
  customProperties: { key: string; value: string }[];
  discountCodes?: string[];
}

export default function CreateProduct() {
  // 1. Use 'useForm' ONCE and store all methods in a single object.
  const methods = useForm<IProductForm>({
    defaultValues: {
     defaultValues: {
      images: [],
      sizes: [],
      title: "",
      category: "",
      subCategory: "",
      regularPrice: 0,
      salePrice: undefined,
      stock: 0,
      shortDescription: "",
      description: "",
      tags: "",
      warranty: "",
      slug: "",
      brand: "",
      videoUrl: "",
      cashOnDelivery: "true",
      colors: [],
      specifications: [],
      customProperties: [],
      discountCodes: [],
    },
    },
  });

  // 2. Destructure all necessary methods from the 'methods' object.
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = methods;

  // 3. Register only the fields managed by THIS component.
  // 'sizes' is now registered in ProductBasicInfo.
  useEffect(() => {
    register("images", { 
     validate: (value) => (value && value.length > 0) || "At least one image is required"
    });
  }, [register]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]); // This local state drives the UI
  const [selectedImage, setSelectedImage] = useState("");
  
  // 4. Changed 'pictureUploadingLoader' to 'uploadingIndex' for better control
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  
  const [processing, setProcessing] = useState<boolean>(false);
  const [activeEffect, setActiveEffect] = useState<string>("");

  // 5. Removed the duplicate 'convertFileToBase64' function.

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setUploadingIndex(index); // Set loading for specific index
    try {
      const base64 = await convertFileToBase64(file);
      const res = await axiosInstanceForProducts.post(
        "/api/upload-product-image",
        { fileName: base64 }
      );
      const updatedImages = [...images];
      const uploadedImage = {
        fileId: res.data.fileId,
        file_url: res.data.file_url,
      };
      updatedImages[index] = uploadedImage;
      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      // 6. Update the form value with the non-null images
      setValue("images", updatedImages.filter(Boolean), { shouldValidate: true });
    } catch (error) {
      console.log(error);
    } finally {
      setUploadingIndex(null); // Clear loading state
    }
  };

  const handleRemoveChange = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];
      if (imageToDelete && typeof imageToDelete === "object") {
        await axiosInstanceForProducts.delete("/api/delete-product-image", {
          data: { fileId: imageToDelete.fileId },
        });
      }
      updatedImages.splice(index, 1);

      //add null placeholder
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);

      // 7. Update the form value
      setValue("images", updatedImages.filter(Boolean), { shouldValidate: true });
    } catch (error) {
      console.log(error);
    }
  };

  const applyTransformations = (transformation: string) => {
    // ... (This function looks fine, no changes needed)
    if (!selectedImage || processing) return;
    setProcessing(true);
    setActiveEffect(transformation);
    try {
      const base = selectedImage;
      const withoutPathTr = base.replace(/\/tr:[^\/]+/g, "");
      let transformedUrl: string;
      try {
        const url = new URL(withoutPathTr);
        url.searchParams.set("tr", transformation);
        if (url.searchParams.has("ik-s") || url.searchParams.has("ik-t") || /ik-?s=|ik-?t=/.test(withoutPathTr)) {
          console.warn(
            "ImageKit URL appears signed. Modifying query/path may invalidate the signature. If you use signed URLs, generate a new signed URL server-side."
          );
        }
        transformedUrl = url.toString();
      } catch (err) {
        const hasQuery = withoutPathTr.includes("?");
        const cleaned = withoutPathTr.replace(/([?&])tr=[^&]*(&?)/, (_, p1, p2) => (p2 ? p1 : ""));
        const sep = cleaned.includes("?") ? "&" : "?";
        transformedUrl = `${cleaned}${sep}tr=${encodeURIComponent(transformation)}`;
      }
      setSelectedImage(transformedUrl);
    } catch (error) {
      console.error("applyTransformations error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 text-gray-200 min-h-screen bg-gray-950">
      {/* 8. Pass the SINGLE 'methods' object to the FormProvider */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row gap-6"
        >
          <div className="w-full lg:w-96 bg-gray-900/60 border border-gray-700 rounded-xl p-4 flex flex-col space-y-4">
            <div className="relative w-full max-w-full bg-gray-900 rounded-lg border border-gray-700 p-4">
              <div>
                <label className="font-semibold text-sm">Product Images</label>
                {images.length > 0 && (
                  <PlaceHolder
                    setOpenImageModal={setOpenImageModal}
                    index={0}
                    setSelectedImage={setSelectedImage}
                    onImageChange={handleImageChange}
                    images={images}
                    onRemove={handleRemoveChange}
                    uploadingIndex={uploadingIndex} // Pass index instead of boolean
                  />
                )}
              </div>
              <div className=" w-full  flex-shrink-0 grid  grid-cols-3 gap-2  rounded-md  p-1">
                {images.slice(1).map((_: any, index: number) => (
                  <PlaceHolder
                    small
                    key={index}
                    setSelectedImage={setSelectedImage}
                    setOpenImageModal={setOpenImageModal}
                    index={index + 1}
                    images={images}
                    uploadingIndex={uploadingIndex} // Pass index
                    onImageChange={handleImageChange}
                    onRemove={handleRemoveChange}
                  />
                ))}
              </div>
            </div>

            {/* Display error for images */}
            {errors.images && (
             <p className="text-xs text-red-500">{String(errors.images.message)}</p>
            )}
            <ProductBasicInfo />
          </div>
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
      
      {openImageModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h2 className="text-lg font-semibold">enhance product image</h2>
              <button onClick={() => setOpenImageModal(false)}>
                <X size={16} />
              </button>
            </div>
            <img src={selectedImage} alt="" className="object-contain w-full max-h-80" />
            <div>
              {selectedImage && (
                <>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-white text-sm font-semibold">AI enhancement</h3>
                    <div className="grid grid-cols-2 gap-3 min-h-fit overflow-y-auto">
                      {enhancements &&
                        enhancements.map(({ label, effect }) => {
                          return (
                            <button
                              key={effect}
                              className={`p-2 rounded-md flex items-center gap-2 ${activeEffect === effect ? "bg-blue-600 text-white" : "bg-gray-600 hover:bg-gray-700"}`}
                              onClick={() => applyTransformations(effect)}
                              disabled={processing}
                            >
                              <Wand size={15} />
                              {label}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


 