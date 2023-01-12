const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
const userAuthMiddleware = require('../../middlewares/userAuthMiddleware')
const userAuthMiddlewareViaHeaders = require('../../middlewares/userAuthMiddlewareViaHeaders')
let UserModel
let PostModel 
// const FollowerModel = require('../../models/FollowerModel') 
const uuid = require('uuid').v4

try{
    UserModel = require('../../models/UserModel')
    PostModel = require('../../models/PostModel') 
}catch(e){
    UserModel = mongoose.model('User')
    PostModel =mongoose.model('Post')
}

//For creating a Post

router.post('/',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        console.log(req.body,'is the reqbody')
        const {text,location,picUrl} = req.body
        if(text.length < 1) return res.json({status: false,msg: 'Enter a valid title for the Post'})

        const newPost = {
            user: req.userId, // we will get this information from the middleware.
            text
        }
        if(location) newPost.location = location
        if(picUrl) newPost.picUrl = picUrl

        const post = await new PostModel(newPost).save()
        return res.json({status: true, msg: 'Succesfully Created your Post', post:post})
    }catch(e){
        console.log(`${e} is the error occured while creating the post`)
        return res.json({status: false, msg: 'Internal Server Error!!'})
    }
})

//Get all Posts
router.get('/',userAuthMiddlewareViaHeaders, async(req,res) => {
    try{
        console.log(req.query,'is the req qry')
        const {pageNumber} = req.query
        const number = Number(pageNumber)
        const size = 8
        let posts
        if(req.query.length){
            posts = await PostModel.find().sort({createdAt: -1}).limit(req.query.length).populate('user').populate('comments.user')
        }
       else if(number === 1)  posts = await PostModel.find().sort({createdAt: -1}).limit(size).populate('user').populate('comments.user')
        else {
            const skips = size * (number-1)
            posts = await PostModel.find()
            .skip(skips)
            .limit(size)
            .sort({ createdAt: -1 })
            .populate("user")
            .populate("comments.user");
        }
        return res.json({status: true, posts})
    }catch(err){
        console.log(err,'is the error that occured while fetching all posts')
        return res.json({status: false,msg: 'Internal Server Error'})
    }
})

//Get post by Id
router.get('/:postId',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const post = await PostModel.findById(req.params.postId).populate('user').populate('comments.user')
        if(!post) return res.json({status: false,msg: 'Post not Found!'})
        return res.json({status: true, post})
    }catch(e){
        console.log(e,'is the error that occured while fetching the post with post id')
        return({status: false,msg: 'Internal Server Error'})
    }
})

//Delete Post
router.delete('/:postId',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const {userId} = req
        const {postId} = req.params
        const post = await PostModel.findById(postId).populate('user')
        if(!post) return res.json({status: false,msg: 'No Post Found!'})

        const user = await UserModel.findById(userId)
        if(post.user._id.toString()!==userId) {
            if(user.role==='root'){
                await post.remove()
                return res.json({status: true,msg: `Successfully deleted ${post.user.username}'s post`})
            } return res.json({status: false,msg: `You do not have the authority to delete ${post.user.username}'s post!`})
        }
        await post.remove()
        return res.json({status: true,msg: `Successfully deleted the post`})
    }catch(er){
        console.log(er,'is the error that occured while deleting the post in backend')
        return res.json({status: false,msg: 'Internal Server Error'})
    }
})

//Like a Post
router.post('/like/:postId',userAuthMiddleware,async(req,res) => {
    try{
        const {postId} = req.params
        const {userId} = req
        const post = await PostModel.findById(postId)
        if(!post) return res.json({status: false,msg: 'Post not Found!'})
        const isLiked = post.likes.filter(like => like.user.toString()===userId).length > 0
        if(isLiked) return res.json({status: false,msg: 'Post already Liked'})
        await post.likes.unshift({user: userId})
        await post.save()
        return res.json({status: true, msg: 'Post Liked',post})
    }catch(e){
        console.log(e,'is the error that occured in while running the code for liking the post in backend')
        return res.json({status: false,msg: 'Internal Server Error'})
    }
})

//Unlike a post
router.post('/unlike/:postId',userAuthMiddleware,async(req,res) => {
    try{
        const {postId} = req.params
        const {userId} = req
        const post = await PostModel.findById(postId)
        if(!post) return res.json({status: false,msg: 'Post not Found!'})
        const isLiked = post.likes.filter(like => like.user.toString() === userId).length > 0
        if(!isLiked) return res.json({status: false,msg: 'Post not liked'})

        const index = post.likes.map((like=> like.user.toString())).indexOf(userId)
        await post.likes.splice(index,1)
        await post.save()
        return res.json({status: true,msg:'Post unliked!',post})
    }catch(e){
        console.log(e,'is the error occured while running the backend code for unliking the post')
    }
})

//Get all likes
router.get('/like/:postId',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const { postId } = req.params
        const post = await PostModel.findById(postId).populate('likes.user')
        if(!post) return res.json({status: false,msg: 'Post not Found!'})
        return res.json({status: true,msg: 'Done' , likes: post.likes})
    }catch(e){
        console.log(e,'is the error occured while running the get all likes of a post function  in the backend')
        return res.json({status: false,msg: 'Internal server error'})
    }
})

//Comment on a Post
router.post('/comment/:postId',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const {postId} = req.params
        const {userId} = req
        const {text} = req.body
        if(text.length < 1) return res.json({status: false,msg: 'Invalid Comment format'})
        const post = await PostModel.findById(postId)
        if(!post) return res.json({status: false,msg: 'Post not Found'})
        const newComment ={
            _id: uuid(),
            text,
            user: userId,
            date: Date.now()
        }
        await post.comments.unshift(newComment)
        post.save()
        return res.json({status: true,msg: 'Done',comment:newComment,post})
    }catch(e){
        console.log(e,'is the error that occured in while running the code of commenting the post on backend')
        return res.json({status: false,msg: 'Internal Server Error'})
    }
})

//Delete a Comment
router.delete('/:commentId/:postId',userAuthMiddlewareViaHeaders,async(req,res) => {
    try{
        const {postId,commentId} = req.params
        const {userId} = req
        const post = await PostModel.findById(postId)
        if(!post) return res.json({status: false,msg: 'Post not found!'})
        
        const comment = post.comments.find(comment => comment._id===commentId)
        //const comment = post.comment.filter(comment => comment._id===commentId)
        if(!comment) return res.json({status: false,msg: 'No comment Found'})

        const user = await UserModel.findById(userId)

        const deleteComment = async() => {
            const index = post.comments.map(comment => comment._id).indexOf(commentId)
            await post.comments.splice(index,1)
            await post.save()
            return res.json({status: true,msg: 'Comment deleted!'})
        }

        if(comment.user.toString()!==userId){
            if(user.role==='root'){
                await deleteComment()
            }return res.json({status: false, msg: 'You dont have the authority to delete comments'})
        }
        await deleteComment()
    }catch(e){
        console.log(e,'is the error that occured while running the code for deleting a comment in the backend')
        return res.json({status: false,msg: 'Internal Server Error'})
    }
})

module.exports = router