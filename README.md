# Auth flow using cognito

- Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily.
- How to use?: we can use cognito throw the aws-sdk.
- I used this link: https://medium.com/@prasadjay/amazon-cognito-user-pools-in-nodejs-as-fast-as-possible-22d586c5c8ec as reference.

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

1) The user make a signup request to the server.
2) Cognito receives the user data, and sent to them an activation link, depends the setup that we choose, you can handle by differents ways.
3) The use click the action link in the email.
4) The browser go to the activarion url and cognito, set
as verified the user.
