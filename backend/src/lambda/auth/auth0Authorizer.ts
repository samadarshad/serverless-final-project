import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const jwksClient = require('jwks-rsa');

const logger = createLogger('auth')

const jwksUrl = process.env.JWKS_URL

const keyClient = jwksClient({
  jwksUri: jwksUrl
})

export const handler = async (
  event: APIGatewayAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  logger.info('Authorizing a user', { authorizationToken: event.authorizationToken })
  
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)
    return allowAllIamPolicyStatement(jwtToken.sub)  
  } catch (e) {
    logger.error('User not authorized', { error: e.message })
    return denyAllIamPolicyStatement
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  const key = await keyClient.getSigningKey(jwt.header.kid)
  const certificate = key.getPublicKey()

  return verify(token, certificate) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

const allowAllIamPolicyStatement = (userId) => {
  return {
      principalId: userId,
      policyDocument: {
          Version: '2012-10-17',
          Statement: [
              {
                  Action: 'execute-api:Invoke',
                  Effect: 'Allow',
                  Resource: '*'
              }
          ]
      }
  }
}

const denyAllIamPolicyStatement = {
  principalId: 'user',
  policyDocument: {
      Version: '2012-10-17',
      Statement: [
          {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: '*'
          }
      ]
  }
}