# Auth flow using cognito

- Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily.
- How to use?: we can use cognito throw the aws-sdk.

## Server & serverless
We can use cognito in a full serverless architecture (using lambda functions) or using a server in this example, we will work with an api rest server created with NODEJS.

### With classic server:

![N|Solid](https://github.com/damiancipolat/AuthFlow-Nodejs-Cognito/blob/master/doc/using-server.png?raw=true)

### Serverless:

![N|Solid](https://github.com/damiancipolat/AuthFlow-Nodejs-Cognito/blob/master/doc/using-serverless.png?raw=true)


## Using Node.js:
In this repository you can download a nodejs server that allows as to communicate with aws cognito, allowing as to implement a authentication workflow.

**To install:**
```sh
$ npm install
```

**To run:**
```sh
$ npm start
```

**To test:**
Load in Post man the JSON file "Auth flow.postman_collection.json" to test the server.

Server functionalities:

- Login
- Signup user
- Verify tokens
- Renew token
- Change password

The signup workflow is very interesting, I attach a diagram of how function:

![N|Solid](https://github.com/damiancipolat/AuthFlow-Nodejs-Cognito/blob/master/doc/signup-flow.png?raw=true)

