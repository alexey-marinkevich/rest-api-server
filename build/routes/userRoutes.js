const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/checkAuth');
const jwtKey = process.env.JWT_KEY;
router.post('/registration', body('email').isEmail(), body('password').isLength({ min: 6 }), async (req, res, next) => {
    try {
        const errors = validationResult(req);
        //validate input fields
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //check if user already exists in our DB
        const isUserExists = await User.findOne({ email: req.body.email });
        if (isUserExists) {
            return res.json({
                "errors": [
                    {
                        "msg": "User with this email already exists",
                    }
                ]
            });
        }
        ;
        // crypt user password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // create new user
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        });
        // save user in DB
        const savedUser = await user.save();
        // create jwt token 
        const token = jwt.sign({ id: savedUser._id }, jwtKey, { expiresIn: '1h' });
        // set token inside header
        res.set('x-auth-token', token);
        return res.end();
    }
    catch (err) {
        console.log(err);
    }
});
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), async (req, res) => {
    try {
        const errors = validationResult(req);
        const { email, password } = req.body;
        // validate inputs
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // if user existed
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                "errors": [
                    {
                        "msg": "Provided data is incorrect. Please try again",
                    }
                ]
            });
        }
        ;
        // compare passwords
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.json({
                "errors": [
                    {
                        "msg": "Provided data is incorrect. Please try again",
                    }
                ]
            });
        }
        ;
        // create token & send it back to user
        const token = jwt.sign({ id: user._id }, jwtKey, { expiresIn: '1h' });
        // set token inside header
        res.set('x-auth-token', token);
        return res.end();
    }
    catch (err) {
        console.log(err);
    }
});
router.get('/logout', (req, res) => {
    try {
        const userToken = req.header('x-auth-token');
        if (!userToken) {
            res.json({
                "errors": [
                    {
                        "msg": "Something went wrong",
                    }
                ]
            });
        }
        ;
        // verify user token 
        jwt.verify(userToken, jwtKey, (err, decoded) => {
            if (err) {
                res.json({
                    "errors": [
                        {
                            "msg": err.message,
                        }
                    ]
                });
            }
            return decoded;
        });
        // create new token with minimal expiration time
        const newToken = jwt.sign({}, jwtKey, { expiresIn: '1ms' });
        //set it in header
        res.set('x-auth-token', newToken);
        return res.end();
    }
    catch (err) {
        console.log(err);
    }
    ;
});
router.get('/all', checkAuth, (req, res, next) => {
    User.find()
        .then((result) => {
        res.send(result);
    })
        .catch(next);
});
router.get('/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((result) => {
        res.send(result);
    })
        .catch(next);
});
router.delete('/:id', (req, res, next) => {
    User.findOneAndDelete({ _id: req.params.id })
        .then((result) => {
        res.send(result);
    })
        .catch(next);
});
router.put('/:id', (req, res, next) => {
    console.log(req.body);
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
    })
        .then((result) => {
        res.send(result);
    })
        .catch((err) => console.log(err));
});
module.exports = router;
