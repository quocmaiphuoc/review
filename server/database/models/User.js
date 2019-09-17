const {mongoose} = require('../database')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar');
const secretString = "secret string"
const jwt = require('jsonwebtoken')
const {Schema} = mongoose

const UserSchema = new Schema({
    name: {
        type: String, 
        default: 'unknown', 
        unique: true
    },    
    email: {
        type: String, 
        match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    avatar: {
        type: String, 
        default : gravatar.url({
            s: '200',
            r: 'pg',
            d: 'mm'
    })},
    date: {
        type: Date,
        default: Date.now
    },
    rule: {
        type: String,
    }
})
const User = mongoose.model('User', UserSchema)
const insertUser = async (name, email, password) => {
    try {
	    const encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword    
        await newUser.save()
    } catch(error) {
        throw `Lỗi đăng ký tài khoản`
    }
}

const loginUser = async (email, password) => {
    try {
        let foundUser = await User.findOne({email: email.trim()})
                            .exec()
        if(!foundUser) {
            throw "User không tồn tại"
        }
        if(foundUser.active === 0) {
            throw "User chưa kích hoạt, bạn phải mở mail kích hoạt trước"               
        }
        let encryptedPassword = foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)
        if (checkPassword === true) {
            let jsonObject = {
                id: foundUser._id,
                email: foundUser.email,
                name: foundUser.name,
                rule: foundUser.rule
            }
            let tokenKey = await jwt.sign(jsonObject, 
                                secretString, {
                                    expiresIn: 86400
                                })
            return tokenKey
        }
    } catch(error) {
        throw error
    }
}

const verifyJWT = async (tokenKey) => {
    try {          
        let decodedJson = await jwt.verify(tokenKey, secretString)
        if(Date.now() / 1000 >  decodedJson.exp) {
            throw "Token hết hạn, mời bạn login lại"
        }
        let foundUser = await User.findById(decodedJson.id)
        if (!foundUser) {
            throw "Ko tìm thấy user với token này"
        }
        return decodedJson
    } catch(error) {
        throw error
    }                 
}
module.exports = {User, insertUser, loginUser, verifyJWT}