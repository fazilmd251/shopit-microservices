import express, { Router } from 'express'
import { createDiscountCode, deleteDiscountCodes, deleteProductImage, getCategories, getDiscountCodes, uploadProductImage } from '../controller/product.controller'
import isAuthenticated from '@packages/middlewares/isAuthenticated'
import { isSeller } from '@packages/middlewares/authourizeRole'

const route: Router = express.Router()

route.get('/get-categories', getCategories)
route.post('/create-discount-code', isAuthenticated, isSeller, createDiscountCode)
route.get('/get-discount-codes', isAuthenticated, isSeller, getDiscountCodes)
route.delete('/delete-discount-code/:id', isAuthenticated, isSeller, deleteDiscountCodes)
route.delete('/delete-product-image', isAuthenticated, isSeller, deleteProductImage)
route.post('/upload-product-image', isAuthenticated, isSeller, uploadProductImage)


export default route



