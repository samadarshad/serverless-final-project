import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
const logger = createLogger('createTodo')

const createTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', {
    event
  })

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info('newTodo', {
    newTodo
  })

  const userId = getUserId(event)
  const todo = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
        item: todo
    })
  }
}

export const handler = middy(createTodoHandler)
.use(cors({
      credentials: true
  }))
