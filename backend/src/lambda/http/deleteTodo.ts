import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { deleteTodo,  } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { errorToHttp } from '../../businessLogic/errors'

const deleteTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  logger.info('Deleting todo', { todoId, userId })

  try {
    await deleteTodo(userId, todoId)
  } catch (error) {
    return errorToHttp(error)
  }

  return {
    statusCode: StatusCodes.NO_CONTENT,
    body: ''
  }

}

export const handler = middy(deleteTodoHandler)
.use(cors({
      credentials: true
  }))
