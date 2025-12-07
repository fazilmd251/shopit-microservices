import React, { useRef, ChangeEvent, KeyboardEvent } from 'react'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import Link from 'next/link'
import Breadcrumb from "./Breadcrumb";

interface VerifyOtpProps {
  otp: string[]
  inputsRef: React.RefObject<(HTMLInputElement | null)[]>
  handleOtpChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void
  handleOtpKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void
  verifyOtpMutation: UseMutationResult<any, unknown, void, unknown>
  signupMutation: UseMutationResult<any, unknown, FormData, unknown>
  canResend: boolean
  timer: number
  resendOtp: () => void
  serverError?: string | null
}

const VerifyOtp = ({
  otp,
  inputsRef,
  handleOtpChange,
  handleOtpKeyDown,
  verifyOtpMutation,
  signupMutation,
  canResend,
  timer,
  resendOtp,
  serverError
}: VerifyOtpProps) => {
  return (
    <>
      <Breadcrumb title={"Verify OTP"} pages={["Signup", "Verify OTP"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Verify Your Account
              </h2>
              <p>Enter the 4-digit code sent to your email</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="flex space-x-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    ref={(el) => { inputsRef.current[i] = el }}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-14 h-14 text-center text-xl font-semibold text-dark bg-gray-1 border-2 border-gray-3 rounded-lg focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none shadow-input transition-all duration-200"
                  />
                ))}
              </div>

              <button
                onClick={() => verifyOtpMutation.mutate()}
                disabled={verifyOtpMutation.isPending}
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>

              <p className='text-center text-sm text-dark-5'>
                {canResend ? (
                  <button 
                    onClick={resendOtp} 
                    disabled={signupMutation.isPending}
                    className='text-blue font-medium hover:text-blue-dark cursor-pointer'
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>

              {verifyOtpMutation.isError && serverError && (
                <p className='text-red-500 text-sm text-center'>{serverError}</p>
              )}
            </div>

            <p className="text-center mt-6">
              Already have an account?
              <Link href="/signin" className="text-dark ease-out duration-200 hover:text-blue pl-2">
                Sign in Now
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default VerifyOtp
