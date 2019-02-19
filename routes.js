const express = require('express');
const router  = express.Router();

//Load cognito wrapper.
const cognito = require('./cognito.js');

//Receive user signup.
router.post('/signup', async (req,res)=>{

  const {body} = req;

  //Validate request format.
  if (body.email&&body.user&&body.password){

    let {email,user,password} = body;

    try{

      //Send to cognito the signup request.
      let result = await cognito.signUp(user,email,password);
      
      //Make response.
      let response = {
        username : result.user.username,
        id: result.userSub,
        sucess: true
      }

      res.status(200).json({"result":response});

    } catch(err){
      res.status(400).json({"error":err});
    }

  } else {
    res.status(400).json({"error":"bad format"});
  }

});

//Login request
router.post('/login', async (req,res)=>{

  const {body} = req;

  //Validate request format.
  if (body.email&&body.password){

    let {email,password} = body;

    try{

      //Send to cognito the signup request.
      let result = await cognito.logIn(email,password);

      res.status(200).json({"result":result});

    } catch(err){
      res.status(400).json({"error":err});
    }

  } else {
    res.status(400).json({"error":"bad format"});
  }

});

//Validate token
router.get('/verify/:token', async (req,res)=>{

  try{

    if (req.params.token){

      let {token} = req.param;

      //Verify token.
      let result = await cognito.verify(token);
      
      res.status(200).json({"result":result});

    } else {
      res.status(400).json({"error":"bad format"});
    }   

  } catch(err){
    console.log(err);
    res.status(500).json({"error":err});
  }

});

//Renew token
router.post('/renew', async (req,res)=>{

  const {body} = req;

  //Validate request format.
  if (body.email&&body.token){

    let {email,token} = body;

    try{

      //Send to cognito the renew token request.
      let result = await cognito.reNew(email,token);

      res.status(200).json({"result":result});

    } catch(err){
      console.log(err);
      res.status(400).json({"error":err});
    }

  } else {
    res.status(400).json({"error":"bad format"});
  }

});

//Change password
router.post('/changePwd', async (req,res)=>{

  const {body} = req;

  //Validate request format.
  if (body.email&&body.password&&body.newpassword){

    let {email,password,newpassword} = body;

    try{

      //Send to cognito the renew token request.
      let result = await cognito.changePwd(email,password,newpassword);

      res.status(200).json({"result":result});

    } catch(err){
      console.log(err);
      res.status(400).json({"error":err});
    }

  } else {
    res.status(400).json({"error":"bad format"});
  }

});

module.exports = router;