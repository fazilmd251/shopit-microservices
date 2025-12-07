'use client'
import Breadcrumb from "apps/user-ui/src/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import VerifyOtp from 'apps/user-ui/src/components/Common/VerifyOtp';

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [timer, setTimer] = useState(60)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [showOtp, setShowOtp] = useState(false)
  const [userData, setUserData] = useState<FormData | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
  const password = watch('password')

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/user-registration`, data)
      return response.data
    },
    onSuccess: (_, formData) => {
      setUserData(formData)
      setShowOtp(true)
      setCanResend(false)
      setTimer(60)
      setServerError(null)
      startResetTimer()
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || "Signup failed"
      setServerError(errorMessage)
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/verify-user`,
        { ...userData, otp: otp.join("") }
      )
      return response.data
    },
    onSuccess: () => {
      router.push('/signin')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid OTP"
      setServerError(errorMessage)
    }
  })

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

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data)
  }

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData)
    }
  }

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== '' && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }
  }

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }


  return (
    <>
    {
        showOtp?
        ( <VerifyOtp
    otp={otp}
    inputsRef={inputsRef}
    handleOtpChange={handleOtpChange}
    handleOtpKeyDown={handleOtpKeyDown}
    verifyOtpMutation={verifyOtpMutation}
    signupMutation={signupMutation as any}
    canResend={canResend}
    timer={timer}
    resendOtp={resendOtp}
    serverError={serverError}
  />):
  ( <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your details below</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {serverError && (
                  <p className='text-red text-sm mb-5 text-center'>{serverError}</p>
                )}

                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Full Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    {...register('name', {
                      required: 'Full name is required'
                    })}
                  />
                  {errors.name && (
                    <p className='text-red text-sm mt-1'>{String(errors.name.message)}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className='text-red text-sm mt-1'>{String(errors.email.message)}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={"password"}
                      id="password"
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 pr-12"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                    />
                    {/* <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {!passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button> */}
                  </div>
                  {errors.password && (
                    <p className='text-red text-sm mt-1'>{String(errors.password.message)}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Re-type your password"
                      autoComplete="new-password"
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 pr-12"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {!confirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className='text-red text-sm mt-1'>{String(errors.confirmPassword.message)}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>)
    }
   </>
  );
};

export default Signup;



