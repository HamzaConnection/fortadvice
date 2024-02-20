export enum ErrorDisplay {
    DIALOG = "DIALOG",
    SNACKBAR = "SNACKBAR",
    ROUTE = "ROUTE",
    NONE = "NONE",
}

export class AppError extends Error {
    readonly title: string
    readonly displayMessage: string
    readonly cause?: Error

    constructor(title: string, message: string, cause?: Error) {
        super(`App error: ${message}`)

        // Prettier logging
        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
            configurable: true,
        })

        this.title = title
        this.displayMessage = message
        this.cause = cause

        // Fix up prototype chain
        // See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export class ApiError extends AppError {
    readonly status?: number
    readonly statusText?: string

    constructor(title: string, message: string, status?: number, statusText?: string, cause?: Error) {
        super(title, message, cause)

        // Prettier logging
        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
            configurable: true,
        })

        this.status = status
        this.statusText = statusText

        // Fix up prototype chain
        // See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export class NoDataError extends AppError {
    constructor() {
        super("No data", "No data available")

        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
            configurable: true,
        })

        // Fix up prototype chain
        // See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
