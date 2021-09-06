const express = require("express");
const router = express.Router();
const bcrypt = require ('bcrypt');
const jwt = require("jsonwebtoken")

const {encrypt, decrypt} = require("../helpers/functions")





router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
});

router.post("/signup", (req, res) => {

    // const saltRounds = 10;  //  Data processing speed
    // var password = req.body.password;
    // bcrypt.hash(password, saltRounds, function(err, hash) { // Salt + Hash
        
    // });
    // const random = ""
    // const userPwKey = jwt.sign()
    const encryptedData = encrypt(req.body.password)

    res.send({ data: encryptedData
    }).status(206);

})

router.post("/debug", (req, res) => {

    const decryptedData = decrypt(req.body.password)

    res.send({decrypt: decryptedData}).status(200)
})

module.exports = router;