import express, { Router } from 'express'
import { createDiscountCode, createProduct, deleteDiscountCodes, deleteProduct, deleteProductImage, getCategories, getDiscountCodes, getProducts, restoreProduct, uploadProductImage } from '../controller/product.controller'
import isAuthenticated from '@packages/middlewares/isAuthenticated'
import { isSeller } from '@packages/middlewares/authourizeRole'

const route: Router = express.Router()

route.get('/get-categories', getCategories)
route.post('/create-discount-code', isAuthenticated, isSeller, createDiscountCode)
route.get('/get-discount-codes', isAuthenticated, isSeller, getDiscountCodes)
route.delete('/delete-discount-code/:id', isAuthenticated, isSeller, deleteDiscountCodes)
route.delete('/delete-product-image', isAuthenticated, isSeller, deleteProductImage)
route.post('/upload-product-image', isAuthenticated, isSeller, uploadProductImage)
route.post('/create-product', isAuthenticated, isSeller, createProduct)
route.get('/get-all-products', isAuthenticated, isSeller, getProducts)
route.delete('/delete-product/:productId', isAuthenticated, isSeller, deleteProduct)
route.put('/restore-product/:productId', isAuthenticated, isSeller, restoreProduct)

export default route



