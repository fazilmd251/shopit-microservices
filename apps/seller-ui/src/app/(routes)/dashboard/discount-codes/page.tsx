"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosInstanceForProducts from "../../../utils/axiosInstanceForProduct";

// --- 1. Icon Components ---

/**
 * Edit Icon
 */
function IconEdit() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

/**
 * Delete/Trash Icon
 */
function IconDelete() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

/**
 * Close (X) Icon
 */
function IconClose() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// --- 2. Form Validation Type ---

type IFormInput = {
  public_name: string;
  discountValue: number;
  discountType: "percentage" | "flat";
  discountCode: string;
};

// --- 3. Create Discount Dialog Component ---

interface CreateDiscountDialogProps {
  onClose: () => void;
}

function CreateDiscountDialog({ onClose }: CreateDiscountDialogProps) {
  const {
    register,
    handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form Data:", data);
    createDiscountMutation.mutate(data)
    onClose() // Close modal on success
  }

  const createDiscountMutation = useMutation({
    mutationFn: async (data: IFormInput) => {
      const res = await axiosInstanceForProducts.post('/api/create-discount-code', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] })
      reset()
      onClose()
    }
  })


  return (
    // Backdrop
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-gray-800 p-6 text-gray-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Create Discount Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <IconClose />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="public_name" className="block text-sm font-medium">
             Public Name
            </label>
            <input
              id="public_name"
              {...register("public_name", { required: "Title is required" })}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            />
            {errors.public_name && (
              <p className="mt-1 text-xs text-red-500">
                {String(errors.public_name.message)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Discount Value */}
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium">
                Discount Value
              </label>
              <input
                id="discountValue"
                type="number"
                {...register("discountValue", {
                  required: "Value is required",
                  valueAsNumber: true,
                  min: {
                    value: 0.01,
                    message: "Value must be greater than 0",
                  },
                })}
                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
              />
              {errors.discountValue && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.discountValue.message)}
                </p>
              )}
            </div>

            {/* Discount Type */}
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium">
                Discount Type
              </label>
              <select
                id="discountType"
                {...register("discountType", {
                  required: "Type is required",
                })}
                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
              >
                <option value="">Select Type</option>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
              {errors.discountType && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.discountType.message)}
                </p>
              )}
            </div>
          </div>

          {/* Discount Code */}
          <div>
            <label htmlFor="discountCode" className="block text-sm font-medium">
              Discount Code
            </label>
            <input
              id="discountCode"
              {...register("discountCode", {
                required: "Code is required",
                minLength: {
                  value: 4,
                  message: "Code must be at least 4 characters",
                },
              })}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            />
            {errors.discountCode && (
              <p className="mt-1 text-xs text-red-500">
                {String(errors.discountCode.message)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 4. Main Page Component ---

// export default function DiscountCodes({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: any }) {

//   // Hardcoded dummy data
//   const dummyCodes = [
//     {
//       id: 1,
//       title: "Summer Sale 10%",
//       type: "Percentage",
//       value: "10%",
//       code: "SUMMER10",
//     },
//     {
//       id: 2,
//       title: "New User $5 Off",
//       type: "Flat Amount",
//       value: "$5.00",
//       code: "NEWUSER5",
//     },
//     {
//       id: 3,
//       title: "Black Friday 20%",
//       type: "Percentage",
//       value: "20%",
//       code: "BF2025",
//     },
//     {
//       id: 4,
//       title: "Holiday Special",
//       type: "Flat Amount",
//       value: "$15.00",
//       code: "HOLIDAY15",
//     },
//     {
//       id: 5,
//       title: "Flash Sale 50%",
//       type: "Percentage",
//       value: "50%",
//       code: "FLASH50",
//     },
//   ];

  
//   const {data } = useQuery({
//     queryKey: ['shop-discounts'],
//     queryFn: async () => {
//       try {
//         const res = await axiosInstanceForProducts.get('/api/get-discount-codes')
//         return res.data.discount_codes
//       } catch (error) {
//         console.log(error)
//       }

//     }
//   })


//   const handleDelete = (id: number) => {
//     alert(`Deleting code with ID: ${id} (Implement backend logic)`);
//     // In a real app: mutation.mutate(id)
//   };

//   const handleEdit = (id: number) => {
//     alert(`Editing code with ID: ${id} (Implement logic to open modal with data)`);
//     // In a real app: 
//     // 1. Fetch code data by ID
//     // 2. Open modal
//     // 3. Populate form with data
//   };

//   return (
//     <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-gray-200">
//       {/* Header */}
//       {/* <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Discount Codes</h1>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//         >
//           Create Discount Code
//         </button>
//       </div> */}

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                 Type
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                 Value
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                 Code
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             {data&&data?.map((item:any) => (
//               <tr key={item.id} className="hover:bg-gray-700">
//                 <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
//                   {item.public_name}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-sm">
//                   {item.discountType}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-sm">
//                   {item.discountValue}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-cyan-300">
//                   {item.discountCode}
//                 </td>
//                 <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
//                   <div className="flex items-center justify-end space-x-3">
//                     <button
//                       onClick={() => handleEdit(item.id)}
//                       className="p-1 text-blue-400 hover:text-blue-300"
//                       title="Edit"
//                     >
//                       <IconEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="p-1 text-red-500 hover:text-red-400"
//                       title="Delete"
//                     >
//                       <IconDelete />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//       {/* Modal */}
//       {isModalOpen && <CreateDiscountDialog onClose={() => setIsModalOpen(false)} />}
//     </div>
//   );
// }

function IconAlertTriangle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-red-500"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

// NEW: Delete Confirmation Dialog Component
function DeleteConfirmationDialog({
  item,
  onClose,
  onConfirm,
}: {
  item: any;
  onClose: () => void;
  onConfirm: (id: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-900/30">
            <IconAlertTriangle />
          </div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-white">
              Delete Discount Code
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                Are you sure you want to delete the code "
                <strong className="text-gray-200">{item.public_name}</strong>"?
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(item.id)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DiscountCodes({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: any;
}) {
  // NEW: State to manage the delete confirmation dialog
  const [itemToDelete, setItemToDelete] = React.useState<any | null>(null);

  // Hardcoded dummy data
  const dummyCodes = [
    /* ... your dummy data ... */
  ];
const queryClient=useQueryClient()

  const { data } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      try {
        const res =
          await axiosInstanceForProducts.get('/api/get-discount-codes');
        return res.data.discount_codes;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteMutation=useMutation({
    mutationFn:async (id:string)=>{
      await axiosInstanceForProducts.delete(`/api/delete-discount-code/${id}`)
    },
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] })
    }
  })

  // UPDATED: handleDelete function
  const handleDelete = (id: any) => {
    console.log(`Deleting code with ID: ${id} (Implement backend logic)`);
   deleteMutation.mutate(id)
    setItemToDelete(null); // Close the dialog after confirming

  };

  const handleEdit = (id: number) => {
    alert(
      `Editing code with ID: ${id} (Implement logic to open modal with data)`
    );
    // In a real app:
    // 1. Fetch code data by ID
    // 2. Open modal
    // 3. Populate form with data
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-6"> ... </div> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data &&
              data?.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {item.public_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {item.discountType}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {item.discountValue}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-cyan-300">
                    {item.discountCode}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <IconEdit />
                      </button>
                      <button
                        // UPDATED: onClick now sets state to open dialog
                        onClick={() => setItemToDelete(item)}
                        className="p-1 text-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        <IconDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CreateDiscountDialog onClose={() => setIsModalOpen(false)} />
      )}

      {/* NEW: Render Delete Confirmation Dialog */}
      {itemToDelete && (
        <DeleteConfirmationDialog
          item={itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}