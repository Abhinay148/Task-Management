const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/Fetchuser');

const jwt_secret = "thisisasecret"

router.post('/signup', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(), 
    body('password').isLength({ min: 5 })
]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ "email": req.body.email })
            if (user) {
                return res.status(400).json({ error: "User with this email already exists" });
            }            
            const salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            })
            const data = {
                user: {
                    id: user.id,
                    
                }
            }

            var token = jwt.sign(data, jwt_secret);
            res.json(token)
        }
        catch (error) {
            console.log(error.message)
            res.status(500).json('Some error occurred')
        }
    })

router.post('/login', [
    body('email', 'Minimum 3 characters required').isEmail(),
    body('password').exists(),
]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body
            let user = await User.findOne({ "email": email })
            if (!user) {
                return res.status(401).json("Invalid credentials")
            }
            const passwordCompare = await bcrypt.compare(password, user.password)
            if (!passwordCompare) {
                return res.status(401).json("Invalid credentials")
            }
            // const admincompare = await bcrypt.compare("admin", user.access)

            const data = {
                user: {
                    "id": user.id,
                    "access":user.access
                }
            }
            console.log(user.access);
            var token = jwt.sign(data, jwt_secret);
            var result={"user":user,"token":token}
            res.json(result)
        }
        catch (error) {
            console.log(error.message)
            res.status(500).json('Some error occurred')
        }
    })

//get user details:login required
router.get('/getdata', fetchuser, async (req, res) => {
    try {
        const user = await User.find({access:'user'}).select("-password")
        res.json(user)

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json('Some error occurred')
    }
})

module.exports = router
