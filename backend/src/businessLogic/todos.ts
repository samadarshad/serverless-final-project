import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

import { createLogger } from '../utils/logger'
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