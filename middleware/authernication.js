const User = require('../models/auth-Schema')
const jwt = require('jsonwebtoken')
const authError = require('../errors/unauthrized')

const auth = async (req , res , next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new authError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token , process.env.JWT_SECRET)
        req.user = {userId : payload.userId , name : payload.name}
        next()
    } catch (error) {
        throw new authError('Authentication invalid')
    }
}

module.exports = auth;