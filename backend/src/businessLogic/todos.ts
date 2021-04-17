import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { CustomErrors } from './errors'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
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

export async function getTodo(
    todoId: string
): Promise<TodoItem> {
    logger.info('getTodo', {
        todoId
    })

    const todo = await todoAccess.getTodo(todoId)

    logger.info('todo', todo)
    if (!todo) {
        throw new Error(CustomErrors.NotFound)
    }

    return todo
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

export async function deleteTodo(
    todoId: string
) {
    const todo = await getTodo(todoId)
    
    return await todoAccess.deleteTodo(todo)
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest
) {
    let todo = await getTodo(todoId)
    todo = {
        ...todo,
        ...updateTodoRequest
    }

    return await todoAccess.updateTodo(todo)
}