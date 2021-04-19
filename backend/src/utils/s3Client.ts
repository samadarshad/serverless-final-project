import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const localEndpoint = 'http://localhost:4569'

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

export function getUrl(bucket, key){
    if (process.env.IS_OFFLINE) {
        return `${localEndpoint}/${bucket}/${key}`
    }
    return `https://${bucket}.s3.amazonaws.com/${key}`
};