'use client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { use, useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import OtpInput from '../../shared/widgets/otp/OtpInput'
import { Eye, EyeOff } from 'lucide-react'

type FormData = {
    email: string
    password: string
}

const ForgotPassword = () => {
    const [step, setStep] = useState<"email" | "otp" | "reset">("email")
    const [otp, setotp] = useState(["", "", "", ""])
    const [userEmail, setUserEmail] = useState<string>("")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [canResend, setCanResend] = useState<boolean>(true)
    const [timer, setTimer] = useState<number>(60)

    const [serverError, setServerError] = useState<string | null>(null)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const requestOtpMutation = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/forgot-password-user`, { email })
            return response.data
        },
        onSuccess: (_, { email }) => {
            setCanResend(false)
            setStep("otp")
            setUserEmail(email)
            setServerError(null)
            startResetTimer()
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials"
            setServerError(errorMessage)
        }
    })

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!userEmail) return
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/verify-forgot-password-user`,
                { email: userEmail, otp: otp.join("") })
            return response.data
        },
        onSuccess: () => {
            setStep("reset")
            setServerError(null)
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials"
            setServerError(errorMessage)
        }
    })

    const resetpasswordMutation = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/reset-password-user`,
                { newPassword: password, email: userEmail })
            return response.data
        },
        onSuccess: () => {
            setStep("email")
            toast.success(`Password reset successfully! please login with your new password`)
            setServerError(null)
            router.push('/login')
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials"
            setServerError(errorMessage)
        }
    })

    const startResetTimer = () => {
        setCanResend(false)
        setTimer(60)
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setCanResend(true)
                }
                return prev - 1
            })
        }, 1000)
    }

    const onSubmitEmail = ({ email }: { email: string }) => {
        // Add form submit logic here
        requestOtpMutation.mutate({ email })
    }

    const onSubmitPassword = ({ password }: { password: string }) => {
        resetpasswordMutation.mutate({ password })
    }

    const resendOtp=()=>{
        if(!userEmail)return 
        requestOtpMutation.mutate({email:userEmail})
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600">
            {/* Inner card */}
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 mx-4 max-h-full overflow-y-auto">
                {step === 'email' && (<>
                    {/* Heading */}
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                        Forgot  password
                    </h2>


                    {/* Form starts here */}
                    <form onSubmit={handleSubmit(onSubmitEmail)} noValidate>
                        {/* Email input */}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className='text-red-500 text-sm'>{String(errors.email.message)}</p>
                        )}

                        {/* Login button */}
                        <button
                            type="submit" disabled={requestOtpMutation.isPending}
                            className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            {requestOtpMutation.isPending ? 'Sending OTP ...' : 'Submit'}
                        </button>

                        {serverError && (
                            <p className='text-red-500 text-sm'>{String(serverError)}</p>
                        )}
                    </form>

                    {/* Signup link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Go back to {' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Login
                        </Link>
                    </p>
                </>)}

                {step === 'otp' && (<>
                    <OtpInput otp={otp} setOtp={setotp} canResend={canResend} timer={timer} mutation={verifyOtpMutation} resendOtp={resendOtp}/>
                </>)}

                {step === 'reset' && (<>
                    <h3 className='text-xl font-semibold text-center mb-4'>
                        Reset Password
                    </h3>

                    <form onSubmit={handleSubmit(onSubmitPassword)}>
                        {/* Password input */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your new password"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"          {...register('password', {
                                    required: 'password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                            >
                                {passwordVisible ? <Eye /> : <EyeOff />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                        )}
                        <button
                            type="submit"
                            disabled={resetpasswordMutation.isPending}
                            className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            {resetpasswordMutation.isPending ? 'Resetting...' : 'Reset'}
                        </button>
                        {serverError && (
                            <p className='text-red-500 text-sm mt-1'>{String(serverError)}</p>
                        )}
                        <p className="mt-6 text-center text-sm text-gray-600">
                        Know password?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Login
                        </Link>
                    </p>
                    </form>
                </>)}
            </div>
        </div>
    )
}

export default ForgotPassword
