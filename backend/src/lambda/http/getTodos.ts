import middy from '@middy/core'
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import 'source-map-support/register'
import { errorToHttp } from '../../businessLogic/errors'
import { getTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('getTodos')

const getTodosHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info('Getting all todos', { userId })

    try {
        const todos = await getTodos(userId)
        return {
            statusCode: StatusCodes.OK,
            body: JSON.stringify({
                items: todos
            })
        }
    } catch (error) {
        return errorToHttp(error)
    }
}

export const handler = middy(getTodosHandler)
    .use(cors({
        credentials: true
    }))
