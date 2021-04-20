import middy from '@middy/core'
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import 'source-map-support/register'
import { errorToHttp } from '../../businessLogic/errors'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

const deleteTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  logger.info('Deleting todo', { todoId, userId })

  try {
    await deleteTodo(userId, todoId)
    return {
      statusCode: StatusCodes.NO_CONTENT,
      body: ''
    }
  } catch (error) {
    return errorToHttp(error)
  }
}

export const handler = middy(deleteTodoHandler)
  .use(cors({
    credentials: true
  }))
