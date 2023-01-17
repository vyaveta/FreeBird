const express = require('express')
const { default: mongoose } = require('mongoose')
const userAuthMiddlewareViaHeaders = require('../../middlewares/userAuthMiddlewareViaHeaders')
const router = express.Router()

// Models
let UserModel
try{
     UserModel = require('../../models/UserModel')
}catch(e){
     UserModel = mongoose.model('User')
}

let ProfileModel
try{
    ProfileModel = require('../../models/ProfileModel')
}catch(e){
    ProfileModel = mongoose.model('Profile')
}

let FollowerModel
try{
    FollowerModel = require('../../models/FollowerModel')
}catch(e){
    FollowerModel = mongoose.model('Follower')
}

let PostModel
try{
    PostModel = require('../../models/PostModel')
}catch(e){
    PostModel = mongoose.model('Post')
}

//Get profile info
router.get('/:username',userAuthMiddlewareViaHeaders,async (req,res) => {
    try{
        const {username} = req.params
        const user = await UserModel.findOne({username:username.toLowerCase()})
        console.log(user,'is the user')
        if(!user) return res.json({status: false,msg: 'No user Found'})
        console.log(user._id,'is the id')
        const profile = await ProfileModel.findOne({user:user._id}).populate('user')
        const profileFollowStats = await FollowerModel.findOne({user:user._id})
        console.log(profile,'is the profile and ')
        console.log(profileFollowStats,'is the profileFollowStats')
        return res.json({status: true,
             profile,
             followersCount: profileFollowStats.followers.length > 0 ? profileFollowStats.followers.length : 0,
             followingCount: profileFollowStats.following.length > 0 ? profileFollowStats.following.length : 0,
        })
    }catch(e){
        console.log(e,'is the error that occured in the get method in profile.js')
        return res.json({status: false, msg: 'Internal Server Error'})
    }
})

//get posts of the user
router.get('/posts/:username',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const {username} = req.params
        const user = await UserModel.findOne({username:username.toLowerCase()})
        if(!user) return res.json({status: false,msg: 'No user found'})
        const posts = await PostModel.find({user:user._id}).populate('comments.user')
        return res.json({status: true, posts, user, })
    }catch(e){
        console.log(`${e} is the error that occured while fetching the user posts`)
        return res.json({status: false,msg: 'Internal Server Error'})
    }
})

// get followers
router.get('/followers/:userId',userAuthMiddlewareViaHeaders, async(req,res) => {
    try{
        const {userId} = req.params
        const followStats = await FollowerModel.findOne({user:userId}).populate('followers.user')
        return res.json({status: true, followers: followStats.followers})
    }catch(e){
        console.log(`${e} is the error that occured in while collecting followes data of the user`)
        return res.json({status: false, msg: 'Internal Server Error'})
    }
})

// get following
router.get('/following/:userId',userAuthMiddlewareViaHeaders, async(req,res) => {
    try{
        const {userId} = req.params
        console.log(userId,'is the userId')
        const followStats = await FollowerModel.findOne({user:userId}).populate('following.user')
        if(!followStats) return res.json({status: null, msg: 'Nothing Found'})
        return res.json({status: true, following: followStats.following})
    }catch(e){
        console.log(`${e} is the error occured while collecting the user following data`)
        return res.json({status: false, msg: 'Internal Server Error'})
    }
})

// follow a user
router.put('/follow/:userToFollowId',userAuthMiddlewareViaHeaders, async (req,res) => {
    try{
        const {userToFollowId} = req.params
        const {userId} = req
        const loggedInUserFollowStats = await FollowerModel.findOne({user:userId})
        const userToFollowStats = await FollowerModel.findOne({user:userToFollowId})
        if(!loggedInUserFollowStats || !userToFollowStats) return res.json({status: null, msg: 'Some data is missing in the backend'})
        const isFollowing = userToFollowStats.followers.filter(followers => followers.user.toString() === userId).length > 0
        if(isFollowing) return res.json({status: false, msg: 'Already Following the user'})
        await userToFollowStats.followers.unshift({user:userId})
        await loggedInUserFollowStats.following.unshift({user: userToFollowId})
        if(userToFollowId == userId) return res.json({status: null, msg: 'Nice try but You cannot follow yourself!'})
        await userToFollowStats.save().then( async() => {
            await loggedInUserFollowStats.save()
        }).catch((e) => {
            console.log(e,'is why that is not getting saved')
        })
        return res.json({status: true, msg: 'Done'})
    }catch(e){
        console.log(e,'is the error that occured while running the code for following the user')
        return res.json({status: false, msg: 'Internal Server Error'})
    }
})

router.put('/unfollow/:userToUnfollowId',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const {userToUnfollowId} = req.params
        const {userId} = req
        if(userToUnfollowId == userId) return res.json({status: null, msg: 'Bruh,think about it... How can you unfollow yourself'})
        const loggedInUserFollowStats = await FollowerModel.findOne({user:userId})
        const userToUnfollowStats = await FollowerModel.findOne({user:userToUnfollowId})
        if(!loggedInUserFollowStats || !userToUnfollowStats) return res.json({status: false, msg: 'Some data is missing in the backend'})
        if(loggedInUserFollowStats.following.filter(following => following.user.toString() == userToUnfollowId).length <= 0) return res.json({status: null, msg:'Bruh....Think about it bro, think about it..How can you unfollow someone without following them....think about it bruh, think about it ....'})
        await loggedInUserFollowStats.following.splice(loggedInUserFollowStats.following.findIndex(following => following.user.toString() == userToUnfollowId),1)
        if(userToUnfollowStats.followers.filter(followers => followers.user.toString() == userId ).length <= 0) return res.json({status: null, msg: 'Bruh....Think about it bro, think about it..How can you unfollow someone without following them....think about it bruh, think about it ....'})
        await userToUnfollowStats.followers.splice(userToUnfollowStats.followers.findIndex(followers => followers.user.toString() == userId),1)
        await loggedInUserFollowStats.save()
        await userToUnfollowStats.save()
        return res.json({status: true, msg: 'Done'})
    }catch(e){
        console.log(e,'is the error that occured in while running the code for unfollowing a user')
        return res.json({status: false, msg: 'Internal Server Error'})
    }
})

module.exports = router