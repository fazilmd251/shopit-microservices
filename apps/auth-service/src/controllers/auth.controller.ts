import { NextFunction, Request, Response } from 'express'
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequest, validateRegistrationData, verifyForgotPaswordOtp, verifyOtp } from '../utils/auth.helper'
import prisma from '@packages/libs/prisma/prisma'
import { AuthError, ValidationError } from '@packages/errorHandler/errorHandler'
import asyncError from '@packages/middlewares/asyncError'
import bcrypt from 'bcryptjs'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { setCookie } from '../utils/cookies/setCookies'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-09-30.clover" })

//Register a new user
export const userRegistaration = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    validateRegistrationData(req.body, "user")
    const { email, name } = req.body

    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser)
        throw new AuthError(`User already exists with this email!`)

    await checkOtpRestrictions(email, next)
    await trackOtpRequest(email, next)
    await sendOtp(name, email, "user-activation-mail")

    res.status(200).json({
        message: 'OTP sent to your Email. Please verify your account.'
    })
})

//Verify user
export const verifyUser = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, password, name } = req.body

    if (!email || !otp || !password || !name)
        return next(new ValidationError("All fields are required!."))

    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser)
        return next(new AuthError("User already exists with this email!"))

    await verifyOtp(email, otp, next)
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.users.create({ data: { name, email, password: hashedPassword } })

    res.status(201).json({
        success: true,
        message: "User registered succesfully",
    })
})

//Login user
export const loginUser = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password)
        return next(new ValidationError("Email and Password are required!"))

    const user = await prisma.users.findUnique({ where: { email } })

    if (!user) return next(new AuthError("User does not exist!"))

    const isMatch = await bcrypt.compare(password, user.password!)

    if (!isMatch) return next(new AuthError("Invalid Email or Password!"))

    res.clearCookie("seller_refresh_token")
    res.clearCookie("seller_access_token")

    //setting jwt token
    const accessToken = jwt.sign({ id: user.id, role: "user" }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "2d" })
    const refreshToken = jwt.sign({ id: user.id, role: "user" }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" })


    setCookie(res, "refresh_token", refreshToken)
    setCookie(res, "access_token", accessToken)

    res.status(200).json({
        success: true,
        message: "Login succesfull",
        user: { id: user.id, email: user.email, name: user.name }
    })

})

//Refresh token conrtroller
export const refreshToken = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies["refresh_token"] || req.cookies["seller_refresh_token"]
    if (!refreshToken)
        throw new ValidationError("Unauthorized! No refresh token.")

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string, role: string }
    if (!decoded || !decoded.id || !decoded.role)
        throw new JsonWebTokenError("Forbidden! invalid refresh token")
    let account;
    let cookieName = ""

    if (decoded.role === 'user') {
        account = await prisma.users.findUnique({ where: { id: decoded.id } })
        cookieName = "access_token"
    }
    else if (decoded.role === 'seller') {
        account = await prisma.seller.findUnique({ where: { id: decoded.id }, include: { shop: true } })
        cookieName = 'seller_access_token'
    }


    if (!account)
        throw new AuthError("forbidden! , user/seller not found")

    const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '15m' }
    )

    req.role != decoded.role

    setCookie(res, cookieName, newAccessToken)
    res.status(201).json({ success: true })
})

//get loggedin user
export const getUser = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    return res.status(201).json({ success: true, user })
})

//user forgot password
export const userForgotPassword = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, "user")
})

//verify forgot password otp
export const verifyUserForgotPassword = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { otp, email } = req.body
    if (!email || !otp) return next(new ValidationError("Email and OTP fields are required!."))
    await verifyForgotPaswordOtp(req, res, next, 'user')
})


//reset pasword
export const resetPasswordUser = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword } = req.body

    if (!email || !newPassword) return next(new ValidationError("Email and newpassword required!"))

    const user = await prisma.users.findUnique({ where: { email } })

    if (!user) return next(new ValidationError("User Not found!"))

    const isSamePassowrd = await bcrypt.compare(newPassword, user.password!)

    if (isSamePassowrd) return next(new AuthError("New password cannot be the same as the old one!"))

    const hashPass = await bcrypt.hash(newPassword, 10)

    await prisma.users.update({ where: { email }, data: { password: hashPass } })

    res.status(200).json({
        success: true,
        message: "Password has been changed."
    })
})

// register a seller 
export const registerSeller = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    validateRegistrationData(req.body, "seller")
    const { name, email } = req.body
    const existingUser = await prisma.seller.findUnique({ where: { email } })
    if (existingUser)
        throw new ValidationError("seller already exists with  this email!")
    await checkOtpRestrictions(email, next)
    await trackOtpRequest(email, next)
    await sendOtp(name, email, "seller-activation-mail")
    res.status(200).json({ message: "Otp sent to email please verify your account" })
})

//verify seller otp
export const verifySeller = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, password, name, phone_number, country } = req.body
    if (!email || !otp || !password || !name || !phone_number || !country)
        throw new ValidationError("All fields are required")

    const existingUser = await prisma.seller.findUnique({ where: { email } })
    if (existingUser)
        throw new ValidationError("seller already exists with this email")
    verifyOtp(email, otp, next)

    const hashedPassword = await bcrypt.hash(password, 10)
    const seller = await prisma.seller.create({
        data: { email, name, phone_number, country, password: hashedPassword }
    })
    res.status(200).json({ seller, message: "your seller account has been succesfully verified " })
})

//creating a shop
export const createShop = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, bio, address, opening_hours, website, category, sellerId } = req.body
    if (!name || !bio || !address || !opening_hours || !website || !category || !sellerId)
        throw new ValidationError("All fields are required")

    const shopData: any = {
        name, bio, address, sellerId,
        opening_hours, category,
    }

    if (website && website.trim() === "")
        shopData.website = website

    const shop = await prisma.shops.create({ data: shopData })

    res.status(200).json({ success: true, shop })
})

//create a stripe connect link
export const createStripeConnectLink = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { sellerId } = req.body
    if (!sellerId)
        throw new ValidationError("Seler id is required")

    const seller = await prisma.seller.findUnique({ where: { id: sellerId } })

    if (!seller) throw new ValidationError("Seller is not availible with  this id")

    const account = await stripe.accounts.create({
        type: "express",
        email: seller?.email,
        country: 'US',
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true }
        }
    })

    await prisma.seller.update({
        where: { id: sellerId },
        data: { stripeId: account.id }
    })

    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:3333/success',
        return_url: 'http://localhost:3333/success',
        type: 'account_onboarding'
    })

    res.json({ url: accountLink.url })

    res.status(200).json({ success: true })
})

//Login seller
export const loginSeller = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password)
        return next(new ValidationError("Email and Password are required!"))

    const seller = await prisma.seller.findUnique({ where: { email } })

    if (!seller) return next(new AuthError("User does not exist!"))

    const isMatch = await bcrypt.compare(password, seller.password!)

    if (!isMatch) return next(new AuthError("Invalid Email or Password!"))

    res.clearCookie("refresh_token")
    res.clearCookie("access_token")

    //setting jwt token
    const accessToken = jwt.sign({ id: seller.id, role: "seller" }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "2d" })
    const refreshToken = jwt.sign({ id: seller.id, role: "seller" }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" })



    setCookie(res, "seller_refresh_token", refreshToken)
    setCookie(res, "seller_access_token", accessToken)

    res.status(200).json({
        success: true,
        message: "Login succesfull",
        // user: { id: seller.id, email: seller.email, name: seller.name }
        seller
    })

})

//get loggedin seller
export const getSeller = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    // const seller = req.seller
    return res.status(201).json({ success: true, seller:req.seller })
})