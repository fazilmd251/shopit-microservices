import { Pencil, Plus, Trash2, WandSparkles } from 'lucide-react'
import React, { ChangeEvent, useState } from 'react'

const PlaceHolder = (
    { size, small, onImageChange, onRemove, defaultImage = null, index = null, setOpenImageModal }: {
        size?: string
        small?: boolean
        onImageChange: (file: File | null, index: number) => void
        onRemove?: (inex: number) => void
        defaultImage?: string | null
        setOpenImageModal: (openImageModal: boolean) => void
        index?: any
    }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(defaultImage)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImagePreview(URL.createObjectURL(file))
            onImageChange(file, index)
        }
    }


    return (
        <div className={`${small ? 'relative w-20 h-20 flex-shrink-0 rounded-md border border-gray-700 bg-gray-800' : 'w-full h-60 sm:h-72 flex items-center justify-center bg-gray-800 rounded-md mb-3 relative z-10 overflow-x-auto space-x-3'}`}>
           
                {/* <img
              //src={url}
              alt="Uploaded"
              className="w-full h-full object-contain rounded-md"
              draggable={false}
            /> */}
                <input
                    type="file"
                    accept='image/*'
                    className='hidden'
                    id={`image-upload-${index}`}
                    onChange={handleFileChange}
                />
                {
                    imagePreview ? (<>    <button
                        type="button"
                        onClick={() => onRemove?.(index)}
                        className="absolute top-1 right-2 bg-red-800 hover:bg-red-900 p-1 rounded-full text-white shadow z-20"
                        title="Delete Image"
                    >
                        <Trash2 size={16} />
                    </button>
                        <button
                            type="button"
                            onClick={() => ''}
                            className="absolute top-10 right-2 z-20 w-6 h-6 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full shadow text-white"
                            title="Add / Edit Images"
                        >
                            <WandSparkles size={13} />
                        </button>
                    </>) : (<label htmlFor={`image-upload-${index}`}
                        className="absolute top-1 right-2 z-20 w-6 h-6 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 rounded-full shadow text-white"
                    >
                        <Pencil size={16} />
                    </label>)}
                {
                    imagePreview ? (<img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-full object-contain rounded-lg"
                        draggable={false}
                    />) : (<>
                    <p>upload image</p></>)
                }
        </div>
    )
}

export default PlaceHolder