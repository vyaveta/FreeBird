const express = require('express')
const router = express.Router()
// const UserModel = require('../../models/UserModel')
const mongoose = require('mongoose')
const UserModel = mongoose.model('User')
// const FollowerModel = require('../../models/FollowerModel')
const FollowerModel = mongoose.model('Follower')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const userAuthMiddleware = require('../../middlewares/userAuthMiddleware')

router.post('/' ,userAuthMiddleware,async (req,res) => {
    try{
        // console.log(req,'is the req')
        const {userId} = req
        console.log(req.userId,'is the req')
        const user = await UserModel.findById(userId)
        const userFollowStats = await FollowerModel.findOne({user:userId})
        // console.log(user,'is the user')
        return res.status(200).json({status: true,user , userFollowStats})
    }catch(er){
        console.log(`${er} is the error that has occured in the get method of the auth fil`)
    }
})

module.exports = router