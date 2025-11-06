import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "@packages/libs/prisma/prisma"

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["access_token"] || 
                     req.cookies["seller_access_token"] || 
                     req.headers.authorization?.split(" ")[1];
       
        if (!token) {
            return res.status(401).json({ 
                message: "Unauthorized! No token provided" 
            })
        }
        const decoded =  jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET!
        ) as { id: string, role: "seller" | "user" }

        let account

        if (decoded.role === "user") {
            account = await prisma.users.findUnique({ 
                where: { id: decoded.id } 
            })
            req.user = account;
        } else if (decoded.role === "seller") {
            account = await prisma.seller.findUnique({ 
                where: { id: decoded.id }, 
                include: { shop: true } 
            });
            req.seller = account;
        }

        if (!account) {
            return res.status(404).json({ 
                message: "Account not found!" 
            });
        }

        req.role = decoded.role;
        return next();

    } catch (err:any) {
        return res.status(401).json({
            // message: "Unauthorized! Token expired or invalid"
             message: err.message
        });
    }
}

export default isAuthenticated;
