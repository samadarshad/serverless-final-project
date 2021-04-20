import middy from '@middy/core'
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import 'source-map-support/register'
import { errorToHttp } from '../../businessLogic/errors'
import { AttachmentsAccess } from '../../dataLayer/attachmentsAccess'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

const attachmentsAccess = new AttachmentsAccess()

const generateUploadUrlHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('Generating upload Url', { todoId })

  try {
    const uploadUrl = attachmentsAccess.getWriteUrl(todoId)
    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (error) {
    return errorToHttp(error)
  }
}

export const handler = middy(generateUploadUrlHandler)
  .use(cors({
    credentials: true
  }))


