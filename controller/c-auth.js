const User = require('../models/auth-Schema')
const { StatusCodes } = require('http-status-codes')
const BadReq = require('../errors/BadReq')
const unauth = require('../errors/unauthrized')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const user = await User.create({ ...req.body }); // when mongoose create it go to the middleware after create then hach the password
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        throw new BadReq('please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new unauth('Invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new unauth('Invalid credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}


module.exports = {
    register,
    login
}