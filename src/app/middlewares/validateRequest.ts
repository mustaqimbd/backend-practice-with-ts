import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { AnySchema } from "joi";
import catchAsync from "../utils/catchAsync";

// validation with zod
const validateRequest = (schema: AnyZodObject) => {
    return catchAsync(async (req, res, next) => {
        await schema.parseAsync({
            body: req.body,
            cookies: req.cookies
        })
        next()
    })
}

//validation with joi
const validateRequestWithJoi = (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body)
        if (error) return next(error)
        next()
    }
}

export { validateRequest, validateRequestWithJoi } 