import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  images: File[];
};

interface MultipleImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
}) => {
  const { register, setValue } = useForm<FormInputs>({
    defaultValues: { images: [] },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
    onImagesChange(selectedFiles);

    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles, onImagesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...filesArray];
      const limitedFiles = newFiles.slice(0, 8);

      setSelectedFiles(limitedFiles);
      setValue("images", limitedFiles, { shouldValidate: true });

      e.target.value = "";
    }
  };

  return (
    <label className="block cursor-pointer w-full">
      <div
        className="
          relative flex flex-col items-center justify-center
          rounded-lg border-2 border-dashed border-gray-600
          hover:border-indigo-500 transition-colors
          p-3 sm:p-4
          w-full h-40 sm:h-48 md:h-56
          max-w-full overflow-hidden
        "
      >
        {previewUrls.length > 0 ? (
          previewUrls.map((url, index) => {
            const zIndex = previewUrls.length - index;
            const translate = index * 5; // smaller offset for mobile

            return (
              <img
                key={url}
                src={url}
                alt={`Preview ${index + 1}`}
                className="
                  object-cover rounded-lg border border-gray-700 absolute shadow-md
                  w-[70%] sm:w-40 md:w-44 lg:w-48
                  h-[70%] sm:h-40 md:h-44 lg:h-48
                "
                style={{
                  transform: `translate(${translate}px, ${translate}px)`,
                  zIndex: zIndex,
                }}
              />
            );
          })
        ) : (
          <div className="text-center px-2">
            <span className="text-sm sm:text-base text-gray-400">
              Upload Images
            </span>
            <span className="text-xs text-gray-500 block">(Max 8)</span>
          </div>
        )}
      </div>

      <input
        type="file"
        multiple
        {...register("images")}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </label>
  );
};
