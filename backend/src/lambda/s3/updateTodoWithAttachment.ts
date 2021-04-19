import 'source-map-support/register'

import { S3Event, S3Handler } from 'aws-lambda'
import { getUrl } from '../../utils/s3Client'
import { updateTodoWithAttachmentUrl } from '../../businessLogic/todos'

export const handler: S3Handler = async (event: S3Event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    try {
        const url = getUrl(bucket, key)
        await updateTodoWithAttachmentUrl(key, url)        
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
}

