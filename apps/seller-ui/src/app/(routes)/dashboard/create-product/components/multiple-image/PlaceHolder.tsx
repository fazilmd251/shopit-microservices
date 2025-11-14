import { Pencil, Plus, Trash2, WandSparkles } from 'lucide-react'
import React, { ChangeEvent } from 'react'

const PlaceHolder = (
    { small, images, onImageChange, onRemove, uploadingIndex, index = 0, setOpenImageModal, setSelectedImage }: {
        small?: boolean
        onImageChange: (file: File | null, index: number) => void
        onRemove?: (index: number) => void
        setOpenImageModal: (openImageModal: boolean) => void
        setSelectedImage: (e: string) => void
        index: number
        images: ({ file_url: string, fileId: string } | null)[]
        uploadingIndex: number | null
    }) => {

    // 1. Removed local 'imagePreview' state.
    // We derive everything from props.

    // 2. Get the image data for THIS specific index.
    const currentImage = images[index];
    
    // 3. Check if THIS specific index is the one loading.
    const isLoading = uploadingIndex === index;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // 4. No more 'setImagePreview'. Just call the parent's upload function.
            onImageChange(file, index)
        }
    }

    return (
        <div className={`${small ? 'relative w-20 h-20 flex-shrink-0 rounded-md border border-gray-700 bg-gray-800' : 'w-full h-60 sm:h-72 flex items-center justify-center bg-gray-800 rounded-md mb-3 relative z-10 overflow-x-auto space-x-3'}`}>
            
            <input
                type="file"
                accept='image/*'
                className='hidden'
                id={`image-upload-${index}`}
                onChange={handleFileChange}
                disabled={isLoading} // Disable input while this index is loading
            />

            {/* 5. Show a loading spinner if this index is uploading */}
            {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-900 bg-opacity-70 rounded-md">
                    {/* You can put a real spinner here */}
                    <p className="text-xs text-white animate-pulse">Uploading...</p>
                </div>
            )}

            {/* 6. If 'currentImage' exists (i.e., it's uploaded), show it. */}
            {currentImage ? (
                <>
                    <button
                        type="button"
                        onClick={() => onRemove?.(index)}
                        className="absolute top-1 right-2 bg-red-800 hover:bg-red-900 p-1 rounded-full text-white shadow z-20"
                        title="Delete Image" 
                        disabled={isLoading} // Disable all buttons while loading
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        type="button" 
                        disabled={isLoading}
                        onClick={() => { setOpenImageModal(true); setSelectedImage(currentImage.file_url) }}
                        className="absolute top-10 right-2 z-20 w-6 h-6 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full shadow text-white"
                        title="Enhance Image"
                    >
                        <WandSparkles size={13} />
                    </button>
                    <img
                        src={currentImage.file_url} // Use the URL from the prop
                        alt="Uploaded"
                        className="w-full h-full object-contain rounded-lg"
                        draggable={false}
                    />
                </>
            ) : (
                // 7. If no image and not loading, show the upload UI.
                <label 
                    htmlFor={`image-upload-${index}`}
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                    <Plus size={small ? 16 : 24} /> {/* Changed from Pencil */}
                    {!small && <p className='mt-2 text-xs'>Upload Image</p>}
                </label>
            )}
        </div>
    )
}

export default PlaceHolder