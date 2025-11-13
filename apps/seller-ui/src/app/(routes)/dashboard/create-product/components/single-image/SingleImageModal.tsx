import React, { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

interface SingleImageUploadProps {
  onFileChange: (file: File | null) => void; // Returns a single file or null
  imageUrl: string | null; // A single image URL from parent, or null
  onRemoveImage: () => void; // No argument needed for single image removal
}

export const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  onFileChange,
  imageUrl,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0] || null; // Get only the first file
      onFileChange(file);
      e.target.value = ""; // Clear the input
    }
  };

  return (
    <div className="relative w-full max-w-full bg-gray-900 rounded-lg border border-gray-700 p-4">
      {/* --- Add / Edit Button --- */}
      {/* This button stays the same, its job is to open the file input */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full shadow text-white"
        title="Add / Edit Image"
      >
        <Plus size={20} />
      </button>

      {/* --- Preview Area --- */}
      {/* This container keeps the exact same styles (h-60, etc.) */}
      <div className="w-full h-60 sm:h-72 flex items-center justify-center bg-gray-800 rounded-md mb-3 relative z-10 overflow-x-auto space-x-3">
        {/* Show placeholder only if there is no imageUrl */}
        {!imageUrl && (
          <div className="text-center text-gray-400 select-none">
            <p>Upload Image</p>
          </div>
        )}

        {/* Show the single image thumbnail if imageUrl exists */}
        {imageUrl && (
          <div
            key={imageUrl}
            className="relative w-24 h-24 flex-shrink-0 rounded-md border border-gray-700 bg-gray-800"
          >
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-contain rounded-md"
              draggable={false}
            />
            {/* Remove button now calls onRemoveImage without args */}
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 p-1 rounded-full text-white shadow z-20"
              title="Delete Image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* --- Hidden File Input --- */}
      <input
        type="file"
        // 'multiple' attribute is removed
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
    </div>
  );
};