import { createDynamoDBClient } from '../utils/dynamoDbClient'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'

import { createLogger } from '../utils/logger'
const logger = createLogger('TodoAccess')

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ) {}

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('getTodos', {
            userId
        })
        return undefined
    }
}