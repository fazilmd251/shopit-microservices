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
          onClick={() => append({ name: "", value: "" })}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-xs text-white transition"
        >
          + Add Specification
        </button>
  
        {fields.length > 0 && (
          <div className="mt-3 space-y-2">
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-6 gap-2 items-end">
                <div className="col-span-2 flex flex-col">
                  <label htmlFor={`specifications.${index}.name`} className="text-xs mb-1">
                    Specification Name
                  </label>
                  <input
                    id={`specifications.${index}.name`}
                    {...register(`specifications.${index}.name` as const)}
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


// "use client";
// import React from "react";
// import { useFormContext, useFieldArray } from "react-hook-form";

// export default function ProductSpecifications() {
//   // 1. Get control and register from context
//   const { control, register } = useFormContext();

//   // 2. useFieldArray logic is now isolated here
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "specifications",
//   });

//   return (
//     <div className="mt-6">
//       <h3 className="text-sm font-semibold mb-2 text-white">
//         Custom Specifications
//       </h3>
//       <button
//         type="button"
//         onClick={() => append({ name: "", value: "" })}
//         className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-xs text-white transition"
//       >
//         + Add Specification
//       </button>

//       {fields.length > 0 && (
//         <div className="mt-3 space-y-2">
//           {fields.map((item, index) => (
//             <div
//               key={item.id}
//               // CHANGED: 'items-end' aligns the button with the inputs
//               className="grid grid-cols-6 gap-2 items-end"
//             >
//               {/* --- Name Input --- */}
//               {/* CHANGED: Added 'flex flex-col' to the wrapper */}
//               <div className="col-span-2 flex flex-col">
//                 <label
//                   htmlFor={`specifications.${index}.name`} // Added accessibility
//                   className="text-xs mb-1" // Added spacing
//                 >
//                   Specification Name
//                 </label>
//                 <input
//                   id={`specifications.${index}.name`} // Added accessibility
//                   {...register(`specifications.${index}.name` as const)}
//                   placeholder="e.g., Battery life, weight , Material"
//                   // CHANGED: Added 'w-full'
//                   className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
//                 />
//               </div>

//               {/* --- Value Input --- */}
//               {/* CHANGED: Fixed 'col-span-3' and added 'flex flex-col' */}
//               <div className="col-span-3 flex flex-col">
//                 <label
//                   htmlFor={`specifications.${index}.value`} // Added accessibility
//                   className="text-xs mb-1" // Added spacing
//                 >
//                   Value
//                 </label>
//                 <input
//                   id={`specifications.${index}.value`} // Added accessibility
//                   {...register(`specifications.${index}.value` as const)}
//                   placeholder="e.g., 4000mah, 1.5kg , Plastic"
//                   // CHANGED: Added 'w-full'
//                   className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
//                 />
//               </div>

//               {/* --- Remove Button --- */}
//               {/* This column takes the last grid spot (col-span-1) */}
//               <button
//                 type="button"
//                 onClick={() => remove(index)}
//                 className="text-red-400 hover:text-red-600 text-xs pb-1" // Added pb-1 to align
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }