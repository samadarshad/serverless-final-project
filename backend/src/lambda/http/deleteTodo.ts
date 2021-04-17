import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { deleteTodo, getTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { CustomErrors } from '../../businessLogic/errors'
import { TodoItem } from '../../models/TodoItem'
import * as createError from 'http-errors' 

const deleteTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  let todo: TodoItem
  try {
    todo = await getTodo(todoId)
    logger.info('Found todo', todo)
  } catch (error) {
    if (error.message = CustomErrors.NotFound) {
      throw new createError.NotFound()
    } else {
      throw createError(500, error, { expose: true })
    }    
  }

  const userId = getUserId(event)
  if (userId !== todo.userId) {
    throw new createError.Unauthorized()
  }

  try {
    await deleteTodo(todoId)
  } catch (error) {
    throw createError(500, error, { expose: true })
  }

  return {
    statusCode: 204,
    body: ''
  }
}

export const handler = middy(deleteTodoHandler)
.use(cors({
      credentials: true
  }))
.use(httpErrorHandler())
