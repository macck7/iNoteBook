const jwt = require("jsonwebtoken");

const JWT_SECRET = 'Harryisagoodb$oy';


const fetchUser = (req, res, next) => {

    //Get the user from the jwt token and add it to req object
    // we are getting token from the header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ Error: "Please authenticate using a valid token" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        // next me wo futnnion call hoga jiske phle fetchUser call hua hai
        next();

    } catch (error) {
        return res.status(401).send({ Error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchUser;