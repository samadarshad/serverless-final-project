import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createS3Client } from '../../utils/s3Client'

const s3 = createS3Client()

const bucketName = process.env.IMAGES_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const uploadUrl = getUploadUrl(todoId)
  return {
    statusCode: 201,
    body: JSON.stringify({
        uploadUrl
    })
}
}

function getUploadUrl(id: string) {
  console.log('bucketName', bucketName);
  
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: id,
    Expires: urlExpiration
  })
}
