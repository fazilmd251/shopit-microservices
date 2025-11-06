import express from 'express'
import { createShop, createStripeConnectLink, getSeller, getUser, loginSeller, loginUser, refreshToken, registerSeller, resetPasswordUser, userForgotPassword, userRegistaration, verifySeller, verifyUser, verifyUserForgotPassword } from '../controllers/auth.controller'
import isAuthenticated from '@packages/middlewares/isAuthenticated'
import { isSeller } from '@packages/middlewares/authourizeRole'
const router = express.Router()


router.post('/user-registration', userRegistaration)
router.post('/verify-user', verifyUser)
router.post('/login-user', loginUser)
router.post("/refresh-token",refreshToken)
router.get("/logged-in-user",isAuthenticated,getUser)
router.post('/forgot-password-user', userForgotPassword)
router.post('/verify-forgot-password-user', verifyUserForgotPassword)
router.post('/reset-password-user', resetPasswordUser)
router.post('/seller-registration',registerSeller)
router.post('/verify-seller',verifySeller)
router.post('/create-shop',createShop)
router.post('/create-stripe-link',createStripeConnectLink)
router.post('/login-seller',loginSeller)
router.get('/logged-in-seller',isAuthenticated,isSeller,getSeller)


export default router