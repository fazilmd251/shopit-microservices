'use client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, {  useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/api/login-user`, data, { withCredentials: true })
      return response.data
    },
    onSuccess: () => {
      setServerError(null)
      router.push('/')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials"
      setServerError(errorMessage)
    }
  })

  const onSubmit = (data: FormData) => {
    // Add form submit logic here
    loginMutation.mutate(data)
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600">
      {/* Inner card */}
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 mx-4 max-h-full overflow-y-auto">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Login to Shopit
        </h2>

        {/* Google login button */}
        <button
          type="button"
          className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 mb-6"
        >
          <svg
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M21.818 12.225c0-.79-.07-1.303-.218-1.868H12v3.532h5.548a4.746 4.746 0 01-2.056 3.117v2.59h3.317c1.94-1.783 3.065-4.416 3.065-7.37z"
              fill="#4285F4"
            />
            <path
              d="M12 21.5c2.7 0 4.967-.895 6.622-2.426l-3.317-2.59c-.922.62-2.098.998-3.605.998-2.77 0-5.113-1.87-5.954-4.387H2.356v2.75A9.502 9.502 0 0012 21.5z"
              fill="#34A853"
            />
            <path
              d="M6.045 13.095a5.735 5.735 0 010-3.837V6.508H2.356a9.516 9.516 0 000 10.984l3.689-2.397z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.2c1.473 0 2.787.504 3.824 1.49l2.868-2.868A9.52 9.52 0 0012 2a9.5 9.5 0 00-8.022 4.508l3.689 2.397C6.887 7.065 9.23 5.2 12 5.2z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Separator */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm text-gray-500">
            <span className="bg-white px-2">Or continue with</span>
          </div>
        </div>

        {/* Form starts here */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          {/* Password input */}
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('password', {
                required: 'password is required',
                minLength: { value: 6, message: "Password must be at least 6 characters" }
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
            <p className='text-red-500 text-sm'>{String(errors.password.message)}</p>
          )}

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2 focus:ring-blue-500"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit" disabled={loginMutation.isPending}
            className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            {loginMutation.isPending?'Logging in ...':'Login'}
          </button>

          {serverError && (
            <p className='text-red-500 text-sm'>{String(serverError)}</p>
          )}
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
