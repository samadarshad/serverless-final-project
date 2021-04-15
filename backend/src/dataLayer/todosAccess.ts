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

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }
}