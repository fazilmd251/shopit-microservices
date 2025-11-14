import { Plus, Trash2 } from 'lucide-react'
import React from 'react'

const ImagePlaceHolder = ({url}:{url?:String}) => {
  return (
<>
       <div className="w-full h-60  flex items-center justify-center bg-gray-800 rounded-md mb-3 relative z-10 overflow-x-auto space-x-3">
        <div
           // key={url}
            className="relative w-24 h-24 flex-shrink-0 rounded-md border border-gray-700 bg-gray-800"
          >
            <img
              //src={url}
              alt="Uploaded"
              className="w-full h-full object-contain rounded-md"
              draggable={false}
            />
          </div>
       </div>
    </>
  )
}

export default ImagePlaceHolder