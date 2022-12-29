var express = require('express');
const User = require('../model/User');
var bcrypt = require('bcryptjs');
const { generateToken } = require('../authentication');
var router = express.Router();

/* GET users listing. */
router.get('/', async(req, res) => {
    User.find((err, data) => {
    if(err){
      res.status(404).send(err)
    }else{
      res.status(201).send(data);
    }
  })
});

router.post("/create", async (req, res) => {
  // const user = req.body;
  const user = await User.findOne({user_id: req.body.user_id});
  if(user){
    res.status(400).send({msg: "user already registered"})
  }else{
    const newUser = new User({
      user_id: req.body.user_id,
      password: bcrypt.hashSync(req.body.password, 8),
      amount: req.body.amount
    })

    const createdUser = await newUser.save();
        res.status(200).send({
            _id : createdUser._id,
            user_id: createdUser.user_id,
            amount: createdUser.amount
        });
  }
});

router.post("/signin", async (req, res) => {
  // const user = req.body;
  const user = await User.findOne({user_id: req.body.user_id});
  if(!user){
    res.status(400).send({msg: "user not already registered"})
  }else{
    if(bcrypt.compareSync(req.body.password, user.password)){
      res.send({
          _id : user._id,
          user_id: user.user_id,
          
          token: generateToken(user)
      });
      
  } else{
      res.status(400).send({msg: "wrong password"})
  }
  }
});

module.exports = router;
