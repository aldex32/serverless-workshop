# Serverless workshop notes

## What is Serverless Framework?

Serverless Framework is an open-source framework designed to help developers build applications
without worrying about the underlying infrastructure. It simplifies the process of deploying and managing
serverless architectures on cloud platforms such as AWS, Microsoft Azure, Google Cloud Platform (GCP).

Read more: https://www.serverless.com/

## Setup

### Install serverless

```shell
npm install -g serverless
```

### Create a hello world project in typescript

```shell
serverless create --template aws-nodejs-typescript
```

Do you prefer another type of project, then have a look to the templates:
https://www.serverless.com/framework/docs/providers/aws/cli-reference/create
