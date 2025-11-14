// ProductSpecifications file code (Corrected)
import { useFormContext, useFieldArray } from "react-hook-form";

function ProductSpecifications() {
  const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
      control,
      name: "specifications",
    });
  
    return (
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2 text-white">Custom Specifications</h3>
        <button
          type="button"
          // --- FIXED: Use 'key' to match IProductForm ---
          onClick={() => append({ key: "", value: "" })}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-xs text-white transition"
        >
          + Add Specification
        </button>
  
        {fields.length > 0 && (
          <div className="mt-3 space-y-2">
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-6 gap-2 items-end">
                <div className="col-span-2 flex flex-col">
                  <label htmlFor={`specifications.${index}.key`} className="text-xs mb-1">
                    Specification Name
                  </label>
                  <input
                    id={`specifications.${index}.key`}
                    // --- FIXED: Register 'key' ---
                    {...register(`specifications.${index}.key` as const)}
                    placeholder="e.g., Battery life, weight , Material"
                    className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
                  />
                </div>
  
                <div className="col-span-3 flex flex-col">
                  <label htmlFor={`specifications.${index}.value`} className="text-xs mb-1">
                    Value
                  </label>
                  <input
                    id={`specifications.${index}.value`}
                    // --- This was already correct ---
                    {...register(`specifications.${index}.value` as const)}
                    placeholder="e.g., 4000mah, 1.5kg , Plastic"
                    className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
                  />
                </div>
  
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-600 text-xs pb-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}
export default ProductSpecifications;