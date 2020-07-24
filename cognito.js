//Load aws module.
const AmazonCognitoId = require('amazon-cognito-identity-js');
const AWS       = require('aws-sdk');
const request   = require('request');
const jwkToPem  = require('jwk-to-pem');
const jwt       = require('jsonwebtoken');

//Set fetch, because aws cognito lib was created for browsers.
global.fetch = require('node-fetch');

//Set user pool credentials.
const poolData = {
  UserPoolId : "us-east-1_OJcW1odYa",
  ClientId : "1n2rvcfj25s0sfhimk7vtiue22"
};

const aws_region = 'us-west-2';

//Get user pool.
const CognitoUserPool = AmazonCognitoId.CognitoUserPool;
const userPool = new AmazonCognitoId.CognitoUserPool(poolData);

//Very the registration code.
const verifyCode = (username, code)=>{

  return new Promise((resolve,reject)=>{

    const userPool = new AmazonCognitoId.CognitoUserPool(poolData);  
    const userData = {
        Username: username,
        Pool: userPool
    };
     
    const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (error, result)=>{
        if (error){
          reject(error);
        } else{
          resolve(result);
        }
    });

  });

}

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

//Auth in cognito
const login = (name,password)=>{

  return new Promise((resolve,reject)=>{

    try{

      const authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
          Username : name,
          Password : password,
      });

      const userData = {
          Username : name,
          Pool : userPool
      };
      
      const cognitoUser = new AmazonCognitoId.CognitoUser(userData);      

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result)=>{

            resolve({
              accesToken: result.getAccessToken().getJwtToken(),
              idToken: result.getIdToken().getJwtToken(),
              refreshToken: result.getRefreshToken().getToken()
            });

          },
          onFailure: (err)=>{
            reject(err);
          }
      });

    } catch(err){
      reject(err);
    }

  });

}

//Download jwsk.
const downloadJwk = (token)=>{

  const urlJwk = `https://cognito-idp.${aws_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`;

  return new Promise((resolve,reject)=>{

    request({url: urlJwk,json: true}, (error, response, body)=>{

      if (!error && response.statusCode === 200) {

        resolve(body);

      } else {
        reject(error);
      }

    });

  });

}

//Verify token.
const verify = (token)=>{

  return new Promise((resolve,reject)=>{

    //Download jwkt from aws.
    downloadJwk(token).then((body)=>{
    
      let pems = {};
      let keys = body['keys'];

      for(let i = 0; i < keys.length; i++) {

        //Convert each key to PEM
        let key_id   = keys[i].kid;
        let modulus  = keys[i].n;
        let exponent = keys[i].e;
        let key_type = keys[i].kty;
        let jwk = { kty: key_type, n: modulus, e: exponent};
        let pem = jwkToPem(jwk);

        pems[key_id] = pem;

      }

      //validate the token
      let decodedJwt = jwt.decode(token, {complete: true});

      //If is not valid.
      if (!decodedJwt)
        reject({"error":"Not a valid JWT token"});

      let kid = decodedJwt.header.kid;
      let pem = pems[kid];
      
      if (!pem)
        reject({"error":"Invalid token"});

      jwt.verify(token, pem, (err, payload)=>{
        
        if(err)
          reject({"error":"Invalid token"});
        else
          resolve(payload);

      });

    }).catch((err)=>{
      reject(err);
    })

  });

}

//Renew token.
const renew = (token,name)=>{

  return new Promise((resolve,reject)=>{

    const RefreshToken = new AmazonCognitoId.CognitoRefreshToken({RefreshToken: token});
    const userPool     = new AmazonCognitoId.CognitoUserPool(poolData);

    const userData = {
      Username: name,
      Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoId.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {

      if (err)
        reject(err);
      else {

        let retObj = {
          "access_token": session.accessToken.jwtToken,
          "id_token": session.idToken.jwtToken,
          "refresh_token": session.refreshToken.token,
        }

        resolve(retObj);

      }

    });

  });

}

//Change password.
const change = (username, password, newpassword)=>{

  return new Promise((resolve,reject)=>{

    const authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
        Username: username,
        Password: password,
    });

    const userData = {
        Username: username,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoId.CognitoUser(userData);

    //Validate if the login is correct to make the password change.
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) =>{

        cognitoUser.changePassword(password, newpassword, (err, result) => {

            if (err)
              reject(err);
            else
              resolve(result);

        });

      },
      onFailure: (err)=>{
        reject(err);
      }
    });   

  });

}

module.exports.verifyCode = verifyCode;
module.exports.signUp = signUp;
module.exports.logIn  = login;
module.exports.verify = verify;
module.exports.reNew  = renew;
module.exports.changePwd = change;