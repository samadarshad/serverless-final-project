Generate Json Schemas by running this:

```
typescript-json-schema "src/requests/CreateTodoRequest.ts" CreateTodoRequest  --out models/create-todo-request.json --required

typescript-json-schema "src/requests/UpdateTodoRequest.ts" UpdateTodoRequest --out models/update-todo-request.json --required
```