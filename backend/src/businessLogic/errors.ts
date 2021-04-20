import { APIGatewayProxyResult } from 'aws-lambda'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const DomainErrors = {
    NotFound: 'Item not found',
    Unauthorized: 'Unauthorized'
}

export function errorToHttp(error): APIGatewayProxyResult {
    switch (error.message) {
        case DomainErrors.NotFound:
            return {
                statusCode: StatusCodes.NOT_FOUND,
                body: ReasonPhrases.NOT_FOUND
            }
        case DomainErrors.Unauthorized:
            return {
                statusCode: StatusCodes.UNAUTHORIZED,
                body: ReasonPhrases.UNAUTHORIZED
            }
        default:
            return {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                body: error.message
            }
    }
}


