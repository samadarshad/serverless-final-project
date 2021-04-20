import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
const logger = createLogger('TodoAccess')

import { createDynamoDBClient } from '../utils/dynamoDbClient'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

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

    async deleteTodo(todo: TodoItem) {
        logger.info('deleteTodo', {
            todo
        })

        return await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: todo.userId,
                todoId: todo.todoId
            }
        }).promise()
    }

    async updateTodo(todo: TodoItem) {
        logger.info('updateTodo', {
            todo
        })

        // TODO The below code is too hard-coded - what is a way to do database updates in a less hardcoded way and with optional nullable attributes? 
        return await this.docClient.update({
            TableName: this.todosTable,
            Key: {
               userId: todo.userId,
               todoId: todo.todoId 
            },
            ExpressionAttributeNames: {
                '#todo_name': 'name'
            },
            UpdateExpression: "set #todo_name = :name, dueDate = :dueDate, done = :done, attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":name": todo.name,
                ":dueDate": todo.dueDate,
                ":done": todo.done,
                ":attachmentUrl": (todo.attachmentUrl || '')
            }
        }).promise()
    }
}