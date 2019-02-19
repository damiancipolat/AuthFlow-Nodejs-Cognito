//Load aws module.
const AWS = require('aws-sdk');
const AmazonCognitoId = require('amazon-cognito-identity-js');

AWS.config.loadFromPath('./config.json');

//Set fetch, because aws cognito lib was created for browsers.
global.fetch = require('node-fetch');

//Set user pool credentials.
const poolData = {    
  UserPoolId : "us-west-2_YIfJuSDiu",
  ClientId : "383do5dd65ef57ksa3317qk5um"
};

//Get user pool.
const CognitoUserPool = AmazonCognitoId.CognitoUserPool;
const userPool = new AmazonCognitoId.CognitoUserPool(poolData);

//Register a new user, and return the data in a promise.
const signUp = (name,email,password)=>{

  return new Promise((result,reject)=>{

    try{

      //Create an attribute list.
      const attributeList = [];

      //Set user an email.
      attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"name",Value:name}));
      attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"email",Value:email}));

      //Register new user in cognito.
      userPool.signUp(email,password, attributeList, null,(err,data)=>{

        if (err)
          reject(err);
        else
          result(data);

      });     

    } catch(err){

      reject(err);
    }

  });

}

module.exports.signUp = signUp;