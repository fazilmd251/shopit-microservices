import { useState, useMemo } from 'react';
import { X, RotateCcw, Copy } from 'lucide-react';

/**
 * A helper component for a labeled slider.
 */
function ControlSlider({ label, value, min, max, onChange }:{ label:string, value:number, min:any, max:any, onChange :any}) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label} <span className="text-gray-400">({value})</span>
      </label>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}

/**
 * Your enhanced Image Enhancement Modal
 */
export default function ImageEnhanceModal({ selectedImage, setOpenImageModal }:{ selectedImage:any, setOpenImageModal:any}) {
  // State for ImageKit transformations
  const [brightness, setBrightness] = useState(0); // Range: -100 to 100
  const [contrast, setContrast] = useState(0);     // Range: -100 to 100
  const [saturation, setSaturation] = useState(0); // Range: -100 to 100
  const [sharpen, setSharpen] = useState(0);       // Range: 0 to 100
  
  const [isCopied, setIsCopied] = useState(false);

  // Memoized function to build the ImageKit URL
  const transformedImageUrl = useMemo(() => {
    // This assumes selectedImage is a base URL without existing transformations.
    // e.g., "https://ik.imagekit.io/your_id/image.jpg"
    
    const transformations = [];

    // Add transformations only if they are not at their default value
    if (brightness !== 0) transformations.push(`br-${brightness}`);
    if (contrast !== 0) transformations.push(`c-${contrast}`);
    if (saturation !== 0) transformations.push(`s-${saturation}`);
    if (sharpen > 0) transformations.push(`sh-${sharpen}`);

    // If no changes, return the original image
    if (transformations.length === 0) {
      return selectedImage;
    }

    // Check if the URL already has query parameters
    const separator = selectedImage.includes('?') ? '&' : '?';
    
    // Join transformations with a comma
    return `${selectedImage}${separator}tr=${transformations.join(',')}`;
    
  }, [selectedImage, brightness, contrast, saturation, sharpen]);

  // Handler to reset all adjustments
  const handleReset = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setSharpen(0);
  };

  // Handler to copy the new URL to the clipboard
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(transformedImageUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset "Copied" text after 2s
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      {/* Increased width for editor (max-w-lg) */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Enhance Product Image</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset} 
              title="Reset Changes"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={() => setOpenImageModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          
          {/* Image Preview */}
          <div className="w-full h-72 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
            <img
              // Adding a key forces React to re-render the img tag 
              // instead of just changing the src, preventing flickering.
              key={transformedImageUrl}
              src={transformedImageUrl}
              alt="Enhancement preview"
              className="object-contain max-h-full max-w-full"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <ControlSlider
              label="Brightness"
              value={brightness}
              min={-100}
              max={100}
              onChange={setBrightness}
            />
            <ControlSlider
              label="Contrast"
              value={contrast}
              min={-100}
              max={100}
              onChange={setContrast}
            />
            <ControlSlider
              label="Saturation"
              value={saturation}
              min={-100}
              max={100}
              onChange={setSaturation}
            />
            <ControlSlider
              label="Sharpen"
              value={sharpen}
              min={0}
              max={100}
              onChange={setSharpen}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleCopyUrl}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors font-medium"
            >
              <Copy size={16} />
              {isCopied ? "Copied!" : "Copy Transformed URL"}
            </button>
            <button
              onClick={() => setOpenImageModal(false)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}