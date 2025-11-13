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

  const lastImage = previewUrls[previewUrls.length - 1];
  const otherImages = previewUrls.slice(0, -1);

  return (
    <label className="block cursor-pointer w-full">
      <div
        className="
          flex flex-col items-center justify-center
          rounded-lg border-2 border-dashed border-gray-600
          hover:border-indigo-500 transition-colors
          p-4 w-full
          max-w-full overflow-hidden
        "
      >
        {previewUrls.length > 0 ? (
          <div className="w-full flex flex-col items-center space-y-4">
            {/* Large Preview */}
            <div
              className="
                w-full sm:w-96 h-60 sm:h-72
                flex items-center justify-center
                bg-gray-900 rounded-lg border border-gray-700 shadow-lg
              "
            >
              <img
                src={lastImage}
                alt="Main Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Thumbnails Grid */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                {otherImages.map((url, index) => (
                  <div
                    key={url}
                    className="
                      w-full h-24 flex items-center justify-center
                      bg-gray-900 rounded-md border border-gray-700 shadow-sm
                    "
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="max-w-full max-h-full object-contain rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center px-2 py-10">
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
