import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";


const handleMongooseCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode = 400
    const message = 'Invalid Id!'
    const errorSource: TErrorSource = [{
        path: err.path,
        message: err.message
    }]

    return {
        statusCode, message, errorSource
    }
};

export default handleMongooseCastError;