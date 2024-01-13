import { TErrorSource, TGenericErrorResponse } from "../interface/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseDuplicateError = (err:any): TGenericErrorResponse => {
    const statusCode = 400
    const message = 'Duplicate data error'
    const errorSource: TErrorSource = [{
        path: Object.keys(err.keyValue)[0],
        message: `${Object.values(err.keyValue)[0] as string} is already exist!`
    }]

    return {
        statusCode, message, errorSource
    }
};

export default handleMongooseDuplicateError;