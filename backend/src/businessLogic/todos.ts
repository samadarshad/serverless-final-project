import * as uuid from 'uuid'
import { AttachmentsAccess } from '../dataLayer/attachmentsAccess'
import { TodoAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { DomainErrors } from './errors'

const todoAccess = new TodoAccess()
const attachmentsAccess = new AttachmentsAccess()
const logger = createLogger('todos')

export async function isUserAuthenticatedToModifyItem(userId: string, todoId: string): Promise<boolean> {
    const todo = await getTodo(todoId)
    return (userId === todo.userId)
}

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
        throw new Error(DomainErrors.NotFound)
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

export async function deleteTodo(userId: string,
    todoId: string
) {

    if (! await isUserAuthenticatedToModifyItem(userId, todoId)) {
        throw new Error(DomainErrors.Unauthorized)
    }

    const todo = await getTodo(todoId)
    await attachmentsAccess.deleteAttachment(todoId)

    return await todoAccess.deleteTodo(todo)
}

export async function updateTodo(userId: string,
    todoId: string,
    updateTodoRequest: UpdateTodoRequest
) {
    if (! await isUserAuthenticatedToModifyItem(userId, todoId)) {
        throw new Error(DomainErrors.Unauthorized)
    }

    let todo = await getTodo(todoId)
    todo = {
        ...todo,
        ...updateTodoRequest
    }

    return await todoAccess.updateTodo(todo)
}

export async function updateTodoWithAttachment(
    todoId: string
) {
    const attachmentUrl = attachmentsAccess.getReadUrl(todoId)
    let todo = await getTodo(todoId)
    todo = {
        ...todo,
        attachmentUrl
    }

    return await todoAccess.updateTodo(todo)
}