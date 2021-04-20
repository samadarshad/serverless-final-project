import middy from '@middy/core'
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import 'source-map-support/register'
import { errorToHttp } from '../../businessLogic/errors'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

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
