import { Response } from "express"
type TResponse<T> = {
    statusCode?: number,
    success?: boolean,
    message?: string,
    data: T
}
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    const { statusCode, success, message } = data
    res.status(statusCode || 200).json({
        success: success || true,
        message: message || "responded successfully",
        data: data.data
    })
}

export default sendResponse