import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
const logger = createLogger('todos')

export async function getTodos(
    userId: string
): Promise<TodoItem[]> {
    logger.info('getTodos', {
        userId
    })

    const todos = await todoAccess.getTodos(userId)

    return todos
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    const todoId = uuid.v4()

    const todo: TodoItem = {
        todoId,
        userId,
        ...createTodoRequest,
        done: false,
        createdAt: new Date().toISOString()
    }

    return await todoAccess.createTodo(todo)
}