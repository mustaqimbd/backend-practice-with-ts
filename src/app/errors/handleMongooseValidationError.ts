import mongoose from "mongoose"
import { TErrorSource, TGenericErrorResponse } from "../interface/error"

const handleMongooseValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    console.log(err)
    const statusCode = 400
    const message = 'Validation error!'

    const errorSource: TErrorSource = Object.values(err.errors).map(value => {
        return {
            path: value.path,
            message: value.message
        }
    })
    return {
        statusCode, message, errorSource
    }
}

export default handleMongooseValidationError;