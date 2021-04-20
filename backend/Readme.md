# Serverless Project

Endpoint URL: https://vrcrzzx032.execute-api.eu-west-2.amazonaws.com/dev

Frontend URL: https://serverless-project-samadarshad.netlify.app/

View the frontend to interact with the application.

## Development
Prerequisites
- Node v14
- Java JDK/JRE (for running dynamodb locally):

```
sudo apt update

sudo apt install default-jre

sudo apt install default-jdk

npm install serverless-dynamodb-local@0.2.30 --save-dev

npm install serverless-offline --save-dev

sls dynamodb install
```

- AWS Account, with an IAM role for profile `serverless` with `AdministratorAccess` policy attached
- `npm i -g serverless`
- `sls config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY --profile serverless`

### How to run the frontend locally
Change /client/src/config.ts to use the local endpoint and url.
Then start the server:
``` 
cd client
npm run start
```
Go to localhost:3000

### How to run the backend locally

0. If not done already, generate apiGateway validation Json Schemas by running this:
`npm i -g typescript-json-schema`

```
typescript-json-schema "src/requests/CreateTodoRequest.ts" CreateTodoRequest --out models/create-todo-request.json --required --noExtraProps

typescript-json-schema "src/requests/UpdateTodoRequest.ts" UpdateTodoRequest --out models/update-todo-request.json --required --noExtraProps
```

0.2 Uncomment in serverless.yml 
```
    DISABLE_XRAY_TRACING: true # for local only
    _X_AMZN_TRACE_ID: 0        # for local only
```

1. `npm i`

2. `sls dynamodb start --seed=test`

3. `sls offline`

Endpoint is localhost:3003
Dynamodb can be viewed at localhost:8000/shell

### Deploying Backend to AWS

Comment in serverless.yml 
```
    #DISABLE_XRAY_TRACING: true # for local only
    #_X_AMZN_TRACE_ID: 0        # for local only
```

`npm i`

`sls deploy -v` or `sls deploy -v --aws-profile serverless`

Endpoint is given in console. 

Note: pushing to the `main` branch triggers serverless.app to build and deploy to AWS.