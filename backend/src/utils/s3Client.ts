import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const localEndpoint = `http://${process.env.LOCAL_S3_HOST}:${process.env.LOCAL_S3_PORT}`
const bucket = process.env.ATTACHMENTS_BUCKET

export function getS3Endpoint() {
    if (process.env.IS_OFFLINE) {
        return `${localEndpoint}/${bucket}`
    }
    return `https://${bucket}.s3.amazonaws.com`
}

export function createS3Client() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating local S3 instance')
        return new XAWS.S3({
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: new AWS.Endpoint(localEndpoint),
        })
    }
    return new XAWS.S3({
        signatureVersion: 'v4'
    })
}

