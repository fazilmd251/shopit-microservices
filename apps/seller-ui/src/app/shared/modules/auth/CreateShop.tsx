'use client'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import shopCategories from '../../../utils/shopCategories'


const CreateShop = ({ sellerId, setActiveStep }:
    {
        sellerId: string, setActiveStep: (step: number) => void
    }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const createShopMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/create-shop`, data)
            return response.data
        },
        onSuccess: () => setActiveStep(3)
    })

    const onSubmit=(data:any)=>createShopMutation.mutate({...data,sellerId})

    return  (
    <div className="flex flex-col flex-grow justify-center gap-2 overflow-y-auto">
      {/* Heading */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Setup Your Shop
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4 px-1 md:w-[500px]  w-[80vh] mx-auto"
      >
        {/* Row 1: Shop Name + Website */}
        <div className="flex flex-col md:flex-row md:gap-3 gap-2">
          {/* Shop Name */}
          <div className="flex-1">
            <label htmlFor="shop_name" className="block text-xs font-medium text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              id="shop_name"
              placeholder="My Furniture Store"
              className="w-full rounded-md border border-gray-300 px-2 py-1 mb-0.5 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
              {...register("name", { required: "Shop name is required" })}
            />
            {errors.shop_name && (
              <p className="text-red-500 text-[11px]">{String(errors.shop_name.message)}</p>
            )}
          </div>

          {/* Website */}
          <div className="flex-1">
            <label htmlFor="website" className="block text-xs font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              placeholder="https://www.myshop.com"
              className="w-full rounded-md border border-gray-300 px-2 py-1 mb-0.5 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
              {...register("website", {
                required: "Website is required",
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/,
                  message: "Enter a valid website URL (e.g., https://example.com)",
                },
              })}
            />
            {errors.website && (
              <p className="text-red-500 text-[11px]">{String(errors.website.message)}</p>
            )}
          </div>
        </div>

        {/* Row 2+: Two-column layout on desktop */}
        <div className="flex flex-col md:flex-row md:gap-4">
          {/* Left Side Inputs */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                placeholder="123 Main Street, City, Country"
                rows={2}
                className="w-full rounded-md border border-gray-300 px-2 py-1 mb-0.5 text-xs placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-red-500 text-[11px]">{String(errors.address.message)}</p>
              )}
            </div>

            {/* Opening Hours */}
            <div>
              <label htmlFor="opening_hours" className="block text-xs font-medium text-gray-700">
                Opening Hours
              </label>
              <input
                type="text"
                id="opening_hours"
                placeholder="Mon - Sat: 9 AM - 8 PM"
                className="w-full rounded-md border border-gray-300 px-2 py-1 mb-0.5 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
                {...register("opening_hours", { required: "Opening hours are required" })}
              />
              {errors.opening_hours && (
                <p className="text-red-500 text-[11px]">{String(errors.opening_hours.message)}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 mb-0.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white hover:border-blue-400 transition-all duration-150 ease-in-out appearance-none"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="" className="text-gray-400">Select category</option>
                  {shopCategories.map((c, i) => (
                    <option key={i + 1} value={c.value || c.label}>{c.label}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.category && (
                <p className="text-red-500 text-[11px]">{String(errors.category.message)}</p>
              )}
            </div>
          </div>

          {/* Right Side Textarea */}
          <div className="flex-1">
            <label htmlFor="bio" className="block text-xs font-medium text-gray-700">
              Shop Bio (max 100 words)
            </label>
            <textarea
              id="bio"
              placeholder="Tell us about your shop..."
              maxLength={600}
              rows={8}
              className="w-full rounded-md border border-gray-300 px-2 py-1 mb-0.5 text-xs placeholder-gray-400 resize-none h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
              {...register("bio", {
                required: "Bio is required",
                validate: (value) =>
                  value.split(/\s+/).length <= 100 || "Bio must not exceed 100 words",
              })}
            />
            {errors.bio && (
              <p className="text-red-500 text-[11px]">{String(errors.bio.message)}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={createShopMutation.isPending}
          className="w-full rounded-md mt-1 bg-blue-600 py-1 text-xs text-white font-medium hover:bg-blue-700 transition"
        >
          {createShopMutation.isPending ? "Creating..." : "Create Shop"}
        </button>

        {createShopMutation.isError && createShopMutation.error instanceof AxiosError && (
          <p className="text-red-500 text-[11px] mt-1">
            {createShopMutation.error.response?.data?.message || createShopMutation.error.message}
          </p>
        )}
      </form>
    </div>
  )
}

export default CreateShop