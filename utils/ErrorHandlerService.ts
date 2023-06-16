export type ErrorType = Error | unknown

export type ErrorHandler = (error?: ErrorType) => string | null

export default class HandleErrorService {
    static isNoNetworkError(error?: ErrorType): boolean {
        if (!error) {
            return false
        }
        return false
    }

    static sendDefault(error?: ErrorType, errorHandler?: ErrorHandler) {
        const defaultMessage = "An error occurred"

        if (!errorHandler) {
            return defaultMessage
        }

        const errorMessage = errorHandler(error)

        if (!errorMessage) {
            return defaultMessage
        }

        return errorMessage
    }

    static getErrorMessage(error?: ErrorType, errorHandler?: ErrorHandler) {
        if (HandleErrorService.isNoNetworkError(error)) {
            return "No network"
        }

        return HandleErrorService.sendDefault(error, errorHandler)
    }
}
