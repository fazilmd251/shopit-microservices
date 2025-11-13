"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import convertFileToBase64 from "apps/seller-ui/src/app/utils/convertToBase64";
import axiosInstanceForProducts from "apps/seller-ui/src/app/utils/axiosInstanceForProduct";
import { AxiosResponse } from "axios";

interface Testing {
  onImagesChange: (files: File[]) => void;
}

export const Testing: React.FC<Testing> = ({
  onImagesChange,
}) => {
  const { register, setValue } = useForm<{ images: File[] }>({
    defaultValues: { images: [] },
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrls = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
    [selectedFiles]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const updateFiles = (files: File[]) => {
    setSelectedFiles(files);
    setValue("images", files, { shouldValidate: true });
    onImagesChange(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
      try {
        const fileName=await convertFileToBase64(e.target.files[0])
        const res=await axiosInstanceForProducts.post('/api/upload-product-image',fileName)
         const incomingFiles = Array.from(res.data.url)||e.target.files;
          
      const newFiles = [...selectedFiles, ...incomingFiles].slice(0, 8);
    
      updateFiles(newFiles);
      e.target.value = "";
      } catch (error) {
        
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
            {/* <button
              type="button"
              onClick={() => handleDelete(previewUrls.length - 1)}
              className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full shadow text-white z-20"
              title="Delete Image"
            >
              <Trash2 size={16} />
            </button> */}
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
              {/* <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 p-1 rounded-full text-white shadow z-20"
                title="Delete Image"
              >
                <Trash2 size={12} />
              </button> */}
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
