export class AppError extends Error {

    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly details?: any

    constructor(message: string, statusCode: number, isOperational = true, details?: any) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.details = details
        Error.captureStackTrace(this)
    }
}

//Not found error
export class NotFoundError extends AppError {
    constructor(message = "Resource Not Found") {
        super(message, 404)
    }
}

//Validatio Error  (Form Validation and others.)
export class ValidationError extends AppError {
    constructor(message = "Invalid Request Data", details?: any) {
        super(message, 400, true, details)
    }
}


//Authentication Error
export class AuthError extends AppError {
    constructor(message = "Unauthorize") {
        super(message, 401)
    }
}


//Forbidden Access Error
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden Access") {
        super(message, 403)
    }
}

//Database  Error
export class DatabaseError extends AppError {
    constructor(message = "Database Error",details?:any) {
        super(message, 500,true,details)
    }
}

//Database  Error
export class RateLimitError extends AppError {
    constructor(message = "Too many requets , Please try again later.") {
        super(message,429)
    }
}





