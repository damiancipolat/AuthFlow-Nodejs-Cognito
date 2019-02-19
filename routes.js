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

module.exports = router;