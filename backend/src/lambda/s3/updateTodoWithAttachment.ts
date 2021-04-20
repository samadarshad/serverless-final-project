import { S3Event, S3Handler } from 'aws-lambda'
import 'source-map-support/register'
import { updateTodoWithAttachment } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodoWithAttachment')

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

