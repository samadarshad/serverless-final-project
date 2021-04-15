import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todos'
const logger = createLogger('createTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', {
    event
  })

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info('newTodo', {
    newTodo
  })

  // const userId = getUserId(event)
  const todo = await createTodo(newTodo, "1")

  return {
    statusCode: 201,
    body: JSON.stringify({
        item: todo
    })
  }
})

handler.use(
  cors({
      credentials: true
  })
)
