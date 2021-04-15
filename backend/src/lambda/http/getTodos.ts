import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    logger.info('Processing event', {
        event
    })
  
  return {
    statusCode: 200,
    body: JSON.stringify({
        message: "getTodos endpoint"
    })
}
})

handler.use(
    cors({
        credentials: true
    })
)
