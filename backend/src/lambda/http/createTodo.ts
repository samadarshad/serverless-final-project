import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import middy from '@middy/core'
import cors from '@middy/http-cors'

import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { errorToHttp } from '../../businessLogic/errors'
import { StatusCodes } from 'http-status-codes'
const logger = createLogger('createTodo')

const createTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  logger.info('Creating todo', { newTodo, userId })

  try {
    const todo = await createTodo(newTodo, userId)  
    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify({
          item: todo
      })
    }
  } catch (error) {
    return errorToHttp(error)
  }
}

export const handler = middy(createTodoHandler)
.use(cors({
      credentials: true
  }))
