const express = require('express')
const router = express.Router()
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const { insertUser, verifyJWT, loginUser } = require('../database/models/User')

router.use((req, res, next) => {
    console.log('Time: ', Date.now()) //Time log
    next()
})
router.post('/registerUser', async (req, res) =>{
	let {name, email, password} = req.body
    try {
        await insertUser(name, email, password)
	  	res.json({
	  		result: 'ok',
	  		message: 'Đăng ký user thành công.'
	  	})		
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Không thể đăng ký thêm user. Lỗi : ${error}`
        })
	}
})

router.post('/loginUser', async (req, res) =>{	
	let {email, password} = req.body
    try {
		let tokenKey = await loginUser(email, password)
		res.json({
			result: 'ok',
			message: 'Đăng nhập user thành công',
			tokenKey
	  	})
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Không thể đăng nhập user. Lỗi : ${error}`
        })
	}
})

router.get('/jwtTest', async (req, res) => {		
	let tokenKey = req.headers['x-access-token']
    try {
		//Verify token
		var verify = await verifyJWT(tokenKey)
		res.json({
			result: 'ok',
			message: 'Verify Json Web Token thành công',
			verify	  		
	  	})	
	} catch(error) {
		res.json({
            result: 'failed',
            message: `Lỗi kiểm tra token : ${error}`
        })
	}
})


module.exports = router