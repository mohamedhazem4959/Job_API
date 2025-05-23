const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide a vaild email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 8,
    }

})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        //payload
        {
            userId: this._id,
            name: this.name
        },
        //secret signature
        process.env.JWT_SECRET,
        // options -> expires time
        {
            expiresIn: process.env.JWT_LIFETIME
        })
}

UserSchema.methods.comparePassword = async function (Password) {
    const isMatch = await bcrypt.compare(Password , this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema);