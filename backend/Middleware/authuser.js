var jwt = require('jsonwebtoken');

const jwt_secret = "thisisasecret"


const authuser = (req, res, next) => {
    // get the user from jwt token
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).json('can not authenticate user')
    }
    try {
        const data = jwt.verify(token, jwt_secret)
        data.user.access="user"
        req.user = data.user
        next()

    } catch (error) {
        res.status(401).json('can not authenticate user')

    }

}


module.exports = authuser