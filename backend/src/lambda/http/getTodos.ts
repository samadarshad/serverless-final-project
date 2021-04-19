import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

import middy from '@middy/core'
import cors from '@middy/http-cors'

import { getTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { errorToHttp } from '../../businessLogic/errors'
import { StatusCodes } from 'http-status-codes'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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


})

handler.use(
    cors({
        credentials: true
    })
)
