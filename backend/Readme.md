1. Generate Json Schemas by running this:

```
typescript-json-schema "src/requests/CreateTodoRequest.ts" CreateTodoRequest --out models/create-todo-request.json --required --noExtraProps

typescript-json-schema "src/requests/UpdateTodoRequest.ts" UpdateTodoRequest --out models/update-todo-request.json --required --noExtraProps
```

2. Local Development:

Prerequesites:

- AWS CLI with credentials/IAM role
- `npm i -g serverless`
- `npm ci`

2.1 `sls dynamodb start --seed=test`

2.2 `sls offline`

3. Deploying to AWS

3.1 `sls deploy -v`