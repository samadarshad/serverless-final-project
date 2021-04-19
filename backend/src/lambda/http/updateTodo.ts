import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

import middy from '@middy/core'
import cors from '@middy/http-cors'

import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { errorToHttp } from '../../businessLogic/errors'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { StatusCodes } from 'http-status-codes'

const updateTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  logger.info('Updating todo', { todoId, updatedTodo, userId })

  try {
    await updateTodo(userId, todoId, updatedTodo)
    return {
      statusCode: StatusCodes.NO_CONTENT,
      body: ''
    }
  } catch (error) {
    return errorToHttp(error)
  }
}

export const handler = middy(updateTodoHandler)
.use(cors({
      credentials: true
  }))
