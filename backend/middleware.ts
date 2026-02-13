import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        req.user = decode.id;

        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}