import Joi from 'joi';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleJoyValidationError = (err: Joi.ValidationError): TGenericErrorResponse => {
    const statusCode = 400
    const message = 'Validation error!'
    const errorSource: TErrorSource = err.details.map(value => {
        return {
            path: value?.path[value?.path.length - 1],
            message: value.message
        }
    })
    return {
        statusCode, message, errorSource
    }
};

export default handleJoyValidationError;