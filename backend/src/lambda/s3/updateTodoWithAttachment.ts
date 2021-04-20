import 'source-map-support/register'

import { S3Event, S3Handler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodoWithAttachment')

import { updateTodoWithAttachment } from '../../businessLogic/todos'

export const handler: S3Handler = async (event: S3Event) => {
    logger.info('Received event:', JSON.stringify(event, null, 2));
    const key = event.Records[0].s3.object.key;
    try {        
        await updateTodoWithAttachment(key)        
    } catch (error) {
        const bucket = event.Records[0].s3.bucket;
        logger.info(error);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        logger.info(message);
        throw new Error(message);
    }
}

