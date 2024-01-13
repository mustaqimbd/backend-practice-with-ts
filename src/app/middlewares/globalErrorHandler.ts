import { ErrorRequestHandler } from "express"
import { ZodError } from "zod"
import { TErrorSource } from "../interface/error"
import config from "../config/config"
import zodErrorHandler from "../errors/handleZodError"
import handleMongooseValidationError from "../errors/handleMongooseValidationError"
import handleMongooseCastError from "../errors/handleMongooseCastError"
import handleMongooseDuplicateError from "../errors/handleMongooseDuplicateError"
import AppError from "../errors/appError"
import handleJoyValidationError from "../errors/handleJoyValidationError"


// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

    let statusCode = 500
    let message = "something went wrong!"
    let errorSource: TErrorSource = [
        {
            path: '',
            message: 'something went wrong!'
        }
    ]


    if (err instanceof ZodError) {
        const simplifiedError = zodErrorHandler(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSource = simplifiedError.errorSource
    }
    else if (err.isJoi) {
        const simplifiedError = handleJoyValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSource = simplifiedError.errorSource
    }
    else if (err?.name === "ValidationError" && !err.isJoi) {
        const simplifiedError = handleMongooseValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSource = simplifiedError.errorSource
    }
    else if (err?.name === "CastError") {
        const simplifiedError = handleMongooseCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSource = simplifiedError.errorSource
    }
    else if (err?.code === 11000) {
        const simplifiedError = handleMongooseDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSource = simplifiedError.errorSource
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
        errorSource = [{
            path: '',
            message: err?.message
        }]
    }
    else if (err instanceof Error) {
        message = err.message
        errorSource = [{
            path: '',
            message: err?.message
        }]
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err,
        stack: config.NODE_ENV === "development" ? err?.stack : null
    })
}

export default globalErrorHandler