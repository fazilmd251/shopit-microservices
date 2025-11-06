import { NextFunction, Request, Response } from "express"
import { AppError } from '../errorHandler/errorHandler'

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        console.log(`Error ${req.method} ${req.url}  -  ${err.message}`)

        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.details && { details: err.details })
        })
    }

    console.log("Unhandled Error:", err.message)
    console.log("Unhandled Error Stack...:", err.stack)

     return res.status(500).json({
        status: "error",message:err.message
        // message: process.env.NODE_ENV=='production'?
        // "Something went wrong, please try again":err.message,
    });
};
