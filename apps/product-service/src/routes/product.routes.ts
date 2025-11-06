import express, { Router } from 'express'
import { createDiscountCode, deleteDiscountCodes, getCategories, getDiscountCodes } from '../controller/product.controller'
import isAuthenticated from '@packages/middlewares/isAuthenticated'
import { isSeller } from '@packages/middlewares/authourizeRole'

const route: Router = express.Router()

route.get('/get-categories', getCategories)
route.post('/create-discount-code', isAuthenticated, isSeller, createDiscountCode)
route.get('/get-discount-codes', isAuthenticated, isSeller, getDiscountCodes)
route.delete('/delete-discount-code/:id', isAuthenticated, isSeller, deleteDiscountCodes)


export default route



