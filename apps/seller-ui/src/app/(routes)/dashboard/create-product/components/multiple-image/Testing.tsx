import React, { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

interface MultipleImageUploadProps {
  onFilesChange: (files: File[]) => void;
  imageUrls: string[];          // array of uploaded image URLs from parent
  onRemoveImage: (url: string) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onFilesChange,
  imageUrls,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 8 - imageUrls.length); // limit max 8
      if (files.length > 0) {
        onFilesChange(files);
      }
      e.target.value = "";
    }
  };

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

      <div className="w-full h-60 sm:h-72 flex items-center justify-center bg-gray-800 rounded-md mb-3 relative z-10 overflow-x-auto space-x-3">
        {imageUrls.length === 0 && (
          <div className="text-center text-gray-400 select-none">
            <p>Upload Images</p>
            <p className="text-xs text-gray-500">(Max 8)</p>
          </div>
        )}
        {imageUrls.map((url) => (
          <div
            key={url}
            className="relative w-24 h-24 flex-shrink-0 rounded-md border border-gray-700 bg-gray-800"
          >
            <img
              src={url}
              alt="Uploaded"
              className="w-full h-full object-contain rounded-md"
              draggable={false}
            />
            <button
              type="button"
              onClick={() => onRemoveImage(url)}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 p-1 rounded-full text-white shadow z-20"
              title="Delete Image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
    </div>
  );
};
