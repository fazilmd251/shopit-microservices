import { ForbiddenError } from "@packages/errorHandler/errorHandler"
import { NextFunction, Request, Response } from "express"

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
if(req.role!=='seller')
    throw new ForbiddenError("Acces denied: Seller only")
next()
}

export const isUser = (req: Request, res: Response, next: NextFunction) => {
if(req.role!=='user')
    throw new ForbiddenError("Acces denied: User only")
next()
}

