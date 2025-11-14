"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import ProductBasicInfo from "./components/product-basic/ProductBasicInfo";
import ProductDetails from "./components/product-details/ProductDetails";
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct";
import convertFileToBase64 from "../../../utils/convertToBase64";
import PlaceHolder from "./components/multiple-image/PlaceHolder";


export default function CreateProduct() {
  const {
    register,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    getValues,
  } = useForm();

  useEffect(() => {
    register("images", { required: "At least one image is required" });
    register("sizes", { required: "At least one size is required" });
  }, [register]);
  const methods = useForm({ defaultValues: { /* ... */ } });
  const onSubmit = (data: any) => { console.log(data); };

  const [openImageModal, setOpenImageModal] = useState<boolean>(false)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [images, setImages] = useState<(File | null)[]>([null])
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const convertBasse64=(file:File)=>{
return new Promise((resolve,reject)=>{
  const reader=new FileReader()
  reader.readAsDataURL(file)
  reader.onload=()=>resolve(reader.result)
  reader.onerror=(err)=>reject(err)
})
  }

  const handleImageChange = async(file: File | null, index: number) => {
    if(!file)return
    try {
      const base64=await convertFileToBase64(file)
      const res=await axiosInstanceForProducts.post('/api/upload-product-image',{fileName:base64})
       const updatedImages=[...images]
       updatedImages[index]=res.data?.file_url
       if(index===images.length-1&&updatedImages.length<8){
        updatedImages.push(null)
       }
       setImages(updatedImages)
       setValue('images',updatedImages)
       console.log(res.data?.file_url)
       console.log(res.data?.file_name)
    } catch (error) {
      console.log(error)
    }
  }
  const handleRemoveChange = (index: number) => {
    try {
      const updatedImages=[...images]
      const imageToDelete=updatedImages[index]
      if(imageToDelete&&typeof imageToDelete==='string'){
        //delete our pic
      }
      updatedImages.slice(index,1)

      //add null placeholder
      if(!updatedImages.includes(null)&&updatedImages.length<8){
        updatedImages.push(null)
      }
      setImages(updatedImages)
      setValue('images',updatedImages)
    } catch (error) {
      console.log(error)
    }
  }
  //const handleImagesChange = (files: File) => setUploadedFiles(files);



  return (
    <div className="p-6 text-gray-200 min-h-screen bg-gray-950">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-96 bg-gray-900/60 border border-gray-700 rounded-xl p-4 flex flex-col space-y-4">
   <div className="relative w-full max-w-full bg-gray-900 rounded-lg border border-gray-700 p-4">
    <div>
      <label className="font-semibold text-sm">Product Images</label>
           {images.length>0&& (<PlaceHolder
              setOpenImageModal={setOpenImageModal}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveChange}
            />)}
    </div>
      <div className=" w-full  flex-shrink-0 grid  grid-cols-3 gap-2  rounded-md  p-1">   
       {
       images.slice(1).map((_:any,index:number)=>(
        <PlaceHolder small key={index}
        setOpenImageModal={setOpenImageModal}
              index={index+1}
              onImageChange={handleImageChange}
              onRemove={handleRemoveChange}

        />
        ))
       }
      </div> 
    </div>     
     
            {/* {errors.images && (
        <p className="text-xs text-red-500">{String(errors.images.message)}</p>
      )} */}
            <ProductBasicInfo />
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

// // Upload a single file as base64 to backend, get URL in response
// const uploadImageToBackend = async (base64: string): Promise<string> => {
//   try {
//     const response = await axiosInstanceForProducts.post("/api/upload-product-image", { data: base64 });
//     return response.data.url; // backend returns image URL (adjust as needed)
//   } catch (error) {
//     console.error("Upload failed", error);
//     throw error;
//   }
// };

// // Delete image on backend via URL or ID
// const deleteImageOnBackend = async (imageUrl: string): Promise<void> => {
//   try {
//     await axiosInstanceForProducts.post("/api/delete-image", { url: imageUrl });
//   } catch (error) {
//     console.error("Delete failed", error);
//     throw error;
//   }
// };

// // Called by MultipleImageUpload when user selects files
// const handleFilesSelected = async (files: File[]) => {
//   for (const file of files) {
//     try {
//       const base64 = await convertFileToBase64(file);
//       const uploadedUrl = await uploadImageToBackend(base64);
//       setImages((prev) => [...prev, uploadedUrl]);
//     } catch (error) {
//       // Handle upload error, e.g., show toast
//     }
//   }
// };

// // Called by remove button with URL to delete
// const handleRemoveImage = async (urlToRemove: string) => {
//   try {
//     await deleteImageOnBackend(urlToRemove);
//     setImages((prev) => prev.filter((url) => url !== urlToRemove));
//   } catch (error) {
//     // Handle delete error, e.g., show toast
//   }
// };
