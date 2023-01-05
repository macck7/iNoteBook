const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const fetchUser = require('../middleware/fetchUser');
const { findById } = require('../models/User');

const JWT_SECRET = 'Harryisagoodb$oy';

// ROUTE 1:Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success= false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" })
        }

        // encrpting password
        var salt = await bcrypt.genSaltSync(10);
        var encypPass = await bcrypt.hashSync(req.body.password, salt);

        // Create a new user
        success = true
        user = await User.create({
            name: req.body.name,
            password: encypPass,
            email: req.body.email,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        // console.log({authToken})
        res.json({success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})




// ROUTE 2: Logging user: POST "/api/auth/login".  NO Login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({email:email})
        if (!user) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({success, error: "Please try to login with correct credentials" })
        }
        success = true;
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        // console.log({authToken})
        res.json({success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
});




// ROUTE 3: Get user details user: POST "/api/auth/getuser".  Login required
router.post('/getuser', fetchUser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

module.exports = router