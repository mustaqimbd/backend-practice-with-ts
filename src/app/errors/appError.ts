class AppError extends Error {
    statusCode: number
    constructor(statusCode: number, msg: string, stuck = '') {
        super(msg)
        this.statusCode = statusCode

        if (stuck) {
            this.stack = stuck
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export default AppError