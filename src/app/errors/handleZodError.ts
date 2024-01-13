import { ZodError } from "zod"
import { TGenericErrorResponse } from "../interface/error"

const  zodErrorHandler = (err: ZodError): TGenericErrorResponse => {
    const statusCode = 400
    const message = 'Validation error!'

    const errorSource = err.issues.map(issue => {
        return {
            path: issue?.path[issue?.path.length - 1],
            message: issue.message
        }
    })
    return {
        statusCode, message, errorSource
    }
}

export default zodErrorHandler