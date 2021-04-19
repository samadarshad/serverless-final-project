import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { AttachmentsAccess } from '../../dataLayer/attachmentsAccess'
const attachmentsAccess = new AttachmentsAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const uploadUrl = attachmentsAccess.getWriteUrl(todoId)
  return {
    statusCode: 201,
    body: JSON.stringify({
        uploadUrl
    })
}
}

