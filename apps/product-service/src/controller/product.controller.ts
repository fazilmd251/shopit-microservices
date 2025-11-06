import { NotFoundError, ValidationError } from '@packages/errorHandler/errorHandler'
import prisma from '@packages/libs/prisma/prisma'
import asyncError from '@packages/middlewares/asyncError'
import { NextFunction, Request, Response } from 'express'

//Get categories
export const getCategories = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const config = await prisma.site_config.findFirst()

    if (!config)
        throw new NotFoundError("Categories not found")
    return res.status(200).json({
        success: true,
        categories: config.categories,
        subCategories: config.subCategories
    })
})


//create discount code
export const createDiscountCode = asyncError(async (req: any, res: Response, next: NextFunction) => {
    const { public_name, discountType, discountValue, discountCode } = req.body


    if (!public_name || !discountType || !discountValue || !discountCode)
        throw new ValidationError("All the fields are required")

    const isDiscountCodeExists = await prisma.discount_codes.findUnique({ where: { discountCode } })

    if (isDiscountCodeExists)
        throw new ValidationError("Discount code already availible Please use different one")

    const discount_code = await prisma.discount_codes.create({
        data: {
            public_name, discountType,
            discountValue: parseFloat(discountValue),
            discountCode, sellerId: req.seller?.id
        }
    })
    return res.status(200).json({
        success: true,
        discount_code
    })
})

//get discount codes
export const getDiscountCodes = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const discount_codes = await prisma.discount_codes.findMany({
        where: { sellerId: req.seller?.id }
    })
    if(!discount_codes||discount_codes.length<1)
        throw new NotFoundError("Discount code not availibe! Add discount code ")

    return res.status(200).json({
        success: true,
        discount_codes
    })
})


//delete discount codes
export const deleteDiscountCodes = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const sellerId = req.seller?.id

    const discount_code = await prisma.discount_codes.findUnique({
        where: { id }, select: { id: true, sellerId: true }
    })

    if (!discount_code)
        throw new NotFoundError("Discount code Not Found!")
    if (discount_code.sellerId !== sellerId)
        throw new ValidationError("Unauthourized access")

    await prisma.discount_codes.delete({where:{id}})

    return res.status(200).json({
        success: true,
        message:"Discount code deleted succesfully "
    })
})


//create product 
export const createProduct = asyncError(async (req: any, res: Response, next: NextFunction) => {
    const { public_name, discountType, discountValue, discountCode } = req.body


    if (!public_name || !discountType || !discountValue || !discountCode)
        throw new ValidationError("All the fields are required")

    const isDiscountCodeExists = await prisma.discount_codes.findUnique({ where: { discountCode } })

    if (isDiscountCodeExists)
        throw new ValidationError("Discount code already availible Please use different one")

    const discount_code = await prisma.discount_codes.create({
        data: {
            public_name, discountType,
            discountValue: parseFloat(discountValue),
            discountCode, sellerId: req.seller?.id
        }
    })
    return res.status(200).json({
        success: true,
        discount_code
    })
})