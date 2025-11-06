import crypto from 'crypto'
import { ValidationError } from '@packages/errorHandler/errorHandler';
import redis from '@packages/libs/redis/redis';
import { sendEmail } from './sendEmail/sendEmail';
import { NextFunction, Request, Response } from 'express';
import prisma from '@packages/libs/prisma/prisma';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data
    if (!name || !email || !password || (userType === 'seller' && (!phone_number || !country)))
        throw new ValidationError(`Missing required fields!`)

    if (!emailRegex.test(email))
        throw new ValidationError(`Invalid Email format!`)
}

export const checkOtpRestrictions = async (email: String, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`))
        throw new ValidationError(`Account locked due to multiple Attempts! Try again after 30 minutes`)

    if (await redis.get(`otp_spam_lock:${email}`))
        throw new ValidationError(`Too many OTP requests! Please wait 1 hour before sending request again`)

    if (await redis.get(`otp_cooldown:${email}`))
        throw new ValidationError(`Please wait 1 minute before requesting a new OTP!`)
}


export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString()
    await sendEmail(email, "Verify your Email", template, { name, otp })
    await redis.set(`otp:${email}`, otp, 'EX', 300)
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60)
}

export const trackOtpRequest = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0")

    if (otpRequests >= 3) {
        await redis.set(`otp_spam_lock:${email}`, "locked", 'EX', 3600)
        throw new ValidationError(`Too many OTP requests! Please wait 1 hour before sending request again`)
    }

    await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600)//Track requests for 1 hour

}


export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`)
    if (!storedOtp)
        throw new ValidationError('Invali or expired OTP!')

    const failedAttemptskey = `otp_attempts:${email}`
    const failedAttempts = parseInt((await redis.get(failedAttemptskey)) || "0")

    if (storedOtp !== otp) {
        if (failedAttempts >= 3) {
            await redis.set(`otp_lock:${email}`, 'locked', 'EX', 300)//Lock for 30 min
            await redis.del(`otp:${email}`, failedAttemptskey)
            throw new ValidationError("Too many failed attempts. your account is locked for 30 mins.")
        }
        await redis.set(failedAttemptskey, failedAttemptskey + 1, 'EX', 300)
        throw new ValidationError(`Incorrect OTP. ${3 - failedAttempts} attempts left.`)
    }

}

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction, userType: 'user' | 'seller') => {
    const { email } = req.body
    if (!email) throw new ValidationError("Email is required!")

    const user = userType === 'user' ?
        await prisma.users.findUnique({ where: { email } }) :
        await prisma.seller.findUnique({ where: { email } })

    if (!user) throw new ValidationError(`${userType} not found!`)

    //check otp restrictions
    await checkOtpRestrictions(email, next)
    await trackOtpRequest(email, next)

    //generat and send otp 
    await sendOtp(user.name, email, userType === 'user' ? 'forgot-password-user' : 'forgot-password-seller')

    res.status(200).json({
        success: true,
        message: "OTP sent to email, Please verify your account!"
    })
}

export const verifyForgotPaswordOtp = async (req: Request, res: Response, next: NextFunction, userType: 'user' | 'seller') => {
    const { email, otp } = req.body
    if (!email || !otp) throw new ValidationError("Email and Otp are required fields.")

    await verifyOtp(email, otp, next)
    res.status(200).json({
        success: true,
        message: "OTP verified. You can now reset your password."
    })
}