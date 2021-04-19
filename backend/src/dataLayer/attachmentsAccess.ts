import * as S3 from 'aws-sdk/clients/s3'

import { createLogger } from '../utils/logger'
const logger = createLogger('AttachmentsAccess')

import { createS3Client, getS3Endpoint } from '../utils/s3Client'

export class AttachmentsAccess {
    constructor(
        private readonly s3Client: S3 = createS3Client(),
        private readonly bucket = process.env.ATTACHMENTS_BUCKET,
        private readonly endpoint = getS3Endpoint(),
        private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
    ) {}

    getReadUrl(key): string {
        return `${this.endpoint}/${key}`       
    };

    getWriteUrl(id: string) {        
        return this.s3Client.getSignedUrl('putObject', {
          Bucket: this.bucket,
          Key: id,
          Expires: this.urlExpiration
        })
    }

    async deleteAttachment(id: string) {
        return this.s3Client.deleteObject({
            Bucket: this.bucket,
            Key: id
          }).promise()
    }
}