const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
//using this we generate a json web token while we login on the page
const jwt = require("jsonwebtoken");
// bcrypt hashing algorithms 
const bcrypt = require("bcryptjs");
//here we are creating secret
const jwtSecret = "Mynameisankitiamfromjammu"
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 5}),
    body("password", "incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
// this will your password in secured way in backend
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password,salt);

    try {
      await User.create({
        /*
            name :"Ankit Sharma",
            password :"123456",
            email :"ankky204@gmail.com",
            location : "Jammu"*/

        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "incorrect Password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;

    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ errors: "invalid credentials" });
      }
      // here we are comparing the hash password for login
      const pwdCompare = await bcrypt.compare(req.body.password,userData.password);
      if (!pwdCompare) {
        return res.status(400).json({ errors: "invalid credentials" });
      }
      // now we will send a authorization token to local storage
     
      const data = {
        user:{
          id: userData.id
        }
      }
      const authToken = jwt.sign(data,jwtSecret);
      return res.json({ success: true,authToken:authToken });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);
module.exports = router;
