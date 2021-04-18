import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { getTodo, updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { DomainErrors } from '../../businessLogic/errors'
import { TodoItem } from '../../models/TodoItem'
import * as createError from 'http-errors' 

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const updateTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info('Updating todo', { todoId })

  let todo: TodoItem
  try {
    todo = await getTodo(todoId)
  } catch (error) {
    if (error.message = DomainErrors.NotFound) {
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
    await updateTodo(todoId, updatedTodo)
  } catch (error) {
    throw createError(500, error, { expose: true })
  }

  return {
    statusCode: 204,
    body: ''
  }
}

export const handler = middy(updateTodoHandler)
.use(cors({
      credentials: true
  }))
.use(httpErrorHandler())
