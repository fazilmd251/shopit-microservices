'use client'
import { UseMutationResult } from '@tanstack/react-query'
import React, { useRef, ChangeEvent, KeyboardEvent } from 'react'
import { AxiosError } from 'axios'

interface OtpInputProps {
  otp: string[]
  setOtp: React.Dispatch<React.SetStateAction<string[]>>
  canResend: boolean
  timer: number
  mutation: UseMutationResult<any, unknown, void, unknown>
  resendOtp: () => void
}

export default function OtpInput({ otp, setOtp, canResend, timer, mutation ,resendOtp}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Enter your OTP</h1>

      <div className="flex space-x-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputsRef.current[i] = el
            }}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-14 h-14 text-center text-2xl font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm transition-all duration-200"
          />
        ))}
      </div>

      <button
        onClick={() => mutation.mutate()} disabled={mutation.isPending}
        className=" mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
      >
        {mutation.isPending ? 'Verifying OTP ...' : 'Verify OTP'}
      </button>
      <p className='text-center text-sm mt-4'>
        {
          canResend ? (
            <button onClick={()=>resendOtp()} className='text-sm text-blue-500 cursor-pointer'>
              Resend otp
            </button>
          ) :
            (`Resend otp in ${timer}'s second`)
        }
      </p>
      {mutation.isError && mutation.error instanceof AxiosError && (
        <p className='text-red-500 text-sm mt-2'>{mutation.error.response?.data?.message || mutation.error.message || 'Something went wrong!'}</p>
      )}
    </div>
  )
}
