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

    async getTodo(todoId: string): Promise<TodoItem|null> {
        logger.info('getTodo', {
            todoId
        })

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: 'TodoIdIndex',
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': todoId
            }
        }).promise()

        logger.info('result', {
            result
        })

        if (result.Count !== 0) {
            const item = result.Items[0]
            return item as TodoItem
        } else {
            return null
        }
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('createTodo', {
            todo
        })

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async deleteTodo(userId: string, todoId: string) {
        logger.info('deleteTodo', {
            todoId
        })

        return await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            }
        }).promise()
    }
}