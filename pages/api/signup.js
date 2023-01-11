const express = require('express')
const router = express.Router()
const UserModel = require('../../models/UserModel')
const ProfileModel = require('../../models/ProfileModel')
const FollowerModel = require('../../models/FollowerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')

const userPng = "https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png"; // This is the default profile pic for the user i.e if the user does not upload profile pic this image will be used
const USER_NAME_REGEX = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get('/:username' ,async (req,res) => {
    console.log(req.params,'is the params')
    const {username} = req.params
    try{
       if(username.length < 1) return res.status(401).json({status: false, msg: 'Invalid Username'})
       if(!USER_NAME_REGEX.test(username)) return res.status(401).json({status: false, msg: 'Invalid username'})

       const user = await UserModel.findOne({username:username.toLowerCase()})
       if(user) return res.status(401).json({status: false, msg: 'Username already Taken'})

       return res.status(200).json({status: true, msg: 'Available'})

    }catch(err){
        console.log(`${err} , is the error that occured in the /:username route in the signup .js api`)
        res.status(500).json({status: false, msg: 'Internal Server Error :('})
    }
})

router.post('/' , async(req,res) => {
    try{
        const {username , name , email , password } = req.body
        if(!isEmail(email)) return res.status(401).json({status: false, msg: 'Enter a valid email'})
        if(password.length < 6) return res.status(401).json({status: false, msg: 'Password must be atleast 6 characters'})

        let user = await UserModel.findOne({email:email.toLowerCase()})
        if(user) return res.status(401).json({status: false, msg: 'Account already exists'})

        user = await UserModel.findOne({username:username.toLowerCase()})
        if(user) return res.status(401).json({status: false, msg: 'Username already taken'})

        user = new UserModel({name,email:email.toLowerCase(), 
            username: username.toLowerCase(), 
            password , 
            profilePicUrl: req.body.profilePicUrl || userPng
        })
        user.password = await bcrypt.hash(password, 10)
        await user.save()

        let profileFields = {}
        profileFields.user = user._id
        profileFields.bio = ''

        await new ProfileModel(profileFields).save()
        await new FollowerModel({ user: user._id, followers: [], following: []}).save()

        const payload = {userId: user._id}
        jwt.sign(payload,process.env.USER_SECRET,{expiresIn:'365d'},(err, token) => {
            if(err) throw err
            res.status(200).json({status: true, token})
        })

    }catch(err){
        console.log(`${err} , is the error that occured in while creating the user`)
        return res.status(500).json({status: false, msg: 'Internal Server Error'})
    }
})

module.exports = router