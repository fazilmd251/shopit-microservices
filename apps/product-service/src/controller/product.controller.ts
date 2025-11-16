import { NotFoundError, ValidationError } from '@packages/errorHandler/errorHandler'
import imageKit from '@packages/libs/imagekit/imageKit'
import prisma from '@packages/libs/prisma/prisma'
import asyncError from '@packages/middlewares/asyncError'
import { NextFunction, Request, response, Response } from 'express'

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
    if (!discount_codes || discount_codes.length < 1)
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

    await prisma.discount_codes.delete({ where: { id } })

    return res.status(200).json({
        success: true,
        message: "Discount code deleted succesfully "
    })
})


// Create product controller with validation
export const createProduct = asyncError(async (req: any, res: Response, next: NextFunction) => {
    const {
        title, category, subCategory, regularPrice, salesPrice, stock,
        shortDescription, description, tags, warranty, slug, brand, videoUrl,
        cashOnDelivery, color, sizes, specifications, images,
        properties, discountCodes
    } = req.body;
    const shopId = req.seller?.shop?.id;

    if (!title || !slug || !category || !stock || !tags || !images || !sizes ||
        !subCategory || !regularPrice || !salesPrice || !description || !shopId) {
        throw new ValidationError("All fields are required");
    }

    const newProduct = await prisma.product.create({
        data: {
            title,
            slug,
            category,
            stock: parseInt(stock),
            sizes: sizes || [],
            tags: Array.isArray(tags) ? tags : tags.split(","),
            description,
            videoUrl,
            color: color || [],
            shopId,
            subCategory,
            discountCodes: discountCodes ? discountCodes.map((c: any) => c) : [],
            cashOnDelivery,
            regularPrice: parseFloat(regularPrice),
            salesPrice: parseFloat(salesPrice),
            shortDescription,
            brand,
            warranty,
            customProperties: properties || {},
            customSpecifications: specifications || [],
            images: images && Array.isArray(images) && images.length > 0
                ? {
                    create: images.filter((img: any) => img && img.fileId && img.file_url)
                        .map((i: any) => ({
                            file_id: i.fileId,
                            file_url: i.file_url
                        }))
                }
                : undefined,
        },
        include: { images: true }
    });

    if (!newProduct) throw new NotFoundError("Product creation failed");

    res.status(200).json({ success: true, newProduct });
});

export const getProducts = asyncError(async (req: any, res: Response, next: NextFunction) => {
    const products: any = await prisma.product.findMany({
        where: { shopId: req.seller?.shop.id }, include: { images: true }
    })
    if (!products && products.length < 1) throw new NotFoundError("Products Not found ");

    res.status(200).json({ success: true, products });
});


//upload product image
export const uploadProductImage = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { fileName } = req.body
    const response = await imageKit.upload({
        file: fileName,
        fileName: `product-${Date.now()}.jpg`,
        folder: '/products'
    })

    if (!response) return
    res.status(201).json({ success: true, file_url: response.url, fileId: response.fileId })

})

//delete product image
export const deleteProductImage = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { fileId } = req.body
    const response = await imageKit.deleteFile(fileId)

    if (!response) return
    res.status(201).json({ success: true, response })

})

//delete product
export const deleteProduct = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params
    const sellerId = (req.seller as any)?.shop?.id
    const product = await prisma.product.findUnique({
        where: { id: productId }, select: { id: true, shopId: true, isDeleted: true }
    })

    if (!product) throw new ValidationError("Product not found")

    if (product.shopId != sellerId) throw new ValidationError("Unauthourized actions")

    if (product.isDeleted) throw new ValidationError("Product is already deleted")

    const deletedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            isDeleted: true,
            deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    })

    res.status(201).json({
        message:"product is scheduled for deletion in 24 hours.you can restore it within this",
        deletedAt:deletedProduct.deletedAt
     })

})

//delete product
export const restoreProduct = asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params
    const sellerId = (req.seller as any)?.shop?.id
    const product = await prisma.product.findUnique({
        where: { id: productId }, select: { id: true, shopId: true, isDeleted: true }
    })

    if (!product) throw new ValidationError("Product not found")

    if (product.shopId != sellerId) throw new ValidationError("Unauthourized actions")

    if (!product.isDeleted) return res.status(400).json({message:"Product is not in deleted state"})

    const restoredProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            isDeleted: false,
            deletedAt: null
        }
    })

    if(!restoredProduct)return res.status(400).json({message:"product restoration failde"})

    res.status(201).json({
        message:"product succesflly restored",
     })

})