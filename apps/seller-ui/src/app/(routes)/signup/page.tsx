'use client'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import countries from '../../utils/countries'
import OtpInput from '../../shared/otp/OtpInput'
import CreateShop from '../../shared/modules/auth/CreateShop'


const Signup = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [timer, setTimer] = useState(60)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [showOtp, setShowOtp] = useState(false)
  const [sellerData, setSellerData] = useState<any | null>(null)
  const [sellerId, setSellerID] = useState("")



  const { register, handleSubmit, formState: { errors } } = useForm()

   // ✅ 1. Restore from localStorage on mount
  useEffect(() => {
    const storedStep = localStorage.getItem("signupStep")
    const storedSellerData = localStorage.getItem("sellerData")
    const storedSellerId = localStorage.getItem("sellerId")

    if (storedStep) setActiveStep(Number(storedStep))
    if (storedSellerData) setSellerData(JSON.parse(storedSellerData))
    if (storedSellerId) setSellerID(storedSellerId)
  }, [])

  // ✅ 2. Persist changes
  useEffect(() => {
    localStorage.setItem("signupStep", String(activeStep))
  }, [activeStep])

  useEffect(() => {
    if (sellerData) {
      localStorage.setItem("sellerData", JSON.stringify(sellerData))
    }
  }, [sellerData])

  useEffect(() => {
    if (sellerId) {
      localStorage.setItem("sellerId", sellerId)
    }
  }, [sellerId])

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/seller-registration`, data);
      return response.data
    },
    onSuccess: (_, formData) => {
      setSellerData(formData)
      setShowOtp(true)
      setCanResend(false)
      setTimer(60)
      startResetTimer()
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/verify-seller`,
        { ...sellerData, otp: otp.join("") }
      );
      return response.data
    },
    onSuccess: (data) => {
      setSellerID(data?.seller?.id)
      setActiveStep(2)
    },
  });

  const startResetTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const onSubmit = (data: any) => signupMutation.mutate(data)
  const resendOtp = () => sellerData && signupMutation.mutate(sellerData)

  const connectStripe = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/create-stripe-link`, {sellerId});
      if (response.data.url) window.location.href = response.data.url
    } catch (error) {
      console.log("stripe error : ", error)
    }
  };

  // 🧹 Optional: Clear localStorage on final completion (step 3)
  useEffect(() => {
    if (activeStep === 3) {
      localStorage.removeItem("signupStep")
      localStorage.removeItem("sellerData")
      localStorage.removeItem("sellerId")
    }
  }, [activeStep])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 overflow-hidden">
      {/* Stepper */}
      <div className="bg-white rounded-lg shadow-md sm:max-w-[90vw] sm:w-96 max-w-fit  mb-4 px-4 py-2 flex items-center justify-between relative">
        {/* Stepper line (background) */}
        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-gray-300 -z-10" />

        {/* Step circles */}
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center text-center">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-semibold
            ${activeStep === step
                  ? "bg-blue-600 border-blue-600 text-white"
                  : activeStep > step
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-400 text-gray-600"
                }`}
            >
              {step}
            </div>
            <span className="mt-1 text-[10px] text-gray-700 font-medium">
              {step === 1 ? "create Account" : step === 2 ? "Setup shop" : "Connect Bank"}
            </span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[80vh] sm:max-w-fit h-2/3 flex flex-col justify-between p-2.5 overflow-y-auto transition-all duration-300">
        {/* Step 1 */}
        {activeStep === 1 && (<>
          {
            !showOtp ? (<div className="flex flex-col flex-grow justify-center gap-2 overflow-y-auto">
              {/* Heading */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Create Account
              </h3>

              {/* Form starts here */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-2 px-1"
              >
                {/* Name input */}
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-700 "
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="yourname"
                  className="w-full rounded-md mb-0.5 border border-gray-300 px-2 py-1 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-[11px]">
                    {String(errors.name.message)}
                  </p>
                )}

                {/* Email input */}
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 "
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md mb-0.5 border border-gray-300 px-2 py-1 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-[11px]">
                    {String(errors.email.message)}
                  </p>
                )}
                {/* Phone input */}
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-700 "
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+91 0000000000"
                  className="w-full rounded-md border border-gray-300 mb-0.5 px-2 py-1 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\s?\d{10}$/,
                      message: "Enter a valid Indian number in +91 0000000000 format"
                    },
                    minLength: {
                      value: 10,
                      message: 'phone number must be atleast 10 characters'
                    },
                    maxLength: {
                      value: 11,
                      message: "Phone number cannot exceed 11 characters"
                    }
                  })}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-[11px]">
                    {String(errors.phone_number.message)}
                  </p>
                )}
                {/* Country input */}
                <label
                  htmlFor="country"
                  className="block text-xs font-medium text-gray-700 "
                >
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 mb-0.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white hover:border-blue-400 transition-all duration-150 ease-in-out appearance-none"
                    {...register("country", { required: "Country is required" })}
                  >
                    <option value="" className="text-gray-400">Select your country</option>
                    {countries.map((c, i) => (
                      <option key={i + 1} value={c.code}>{c.name}</option>
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
                {errors.country && (
                  <p className="text-red-500 text-[11px]">
                    {String(errors.country.message)}
                  </p>
                )}
                {/* Password input */}
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 "
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="w-full rounded-md border mb-0.5 border-gray-300 px-2 py-1 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-[2px] focus:ring-offset-white"
                    {...register("password", {
                      required: "password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400"
                  >
                    {passwordVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[11px]">
                    {String(errors.password.message)}
                  </p>
                )}


                {/* Signup button */}
                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full rounded-md mt-1 bg-blue-600 py-1 text-xs text-white font-medium hover:bg-blue-700 transition"
                >
                  {signupMutation.isPending ? "Signing up..." : "Signup"}
                </button>
                {
                  signupMutation.isError && signupMutation.error instanceof AxiosError && (
                    <p className='text-red-500 text-sm'>{
                      signupMutation.error.response?.data?.message || signupMutation.error.message
                    }</p>
                  )
                }
              </form>
              {/* Signup link */}
              <p className="mt-1 text-center text-[11px] text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
              </p>
            </div>) : (<OtpInput
              otp={otp} setOtp={setOtp} canResend={canResend}
              timer={timer} mutation={verifyOtpMutation}
              resendOtp={resendOtp} />)
          }
        </>)}
        {/* Step 2 */}
        {activeStep === 2 && (<CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />)}
        {/* <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-gray-300 -z-10" />
            <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} /> */}
        {activeStep === 3 && (
          <div className="flex flex-col items-center justify-center w-full px-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Withdraw Method
            </h2>

            <button
              type="button" onClick={connectStripe}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition w-full max-w-xs shadow-md"
            >
              Connect to
              {/* Simple Stripe SVG Logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 12"
                className="w-12 h-auto"
              >
                <text
                  x="0"
                  y="9"
                  fill="white"
                  fontSize="9"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                >
                  stripe
                </text>
              </svg>
            </button>

            <p className="text-[11px] text-gray-500 mt-3 text-center">
              Securely connect your Stripe account to withdraw payments.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Signup


