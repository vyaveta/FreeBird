import axios from 'axios'
import Cookies from 'js-cookie'
import { getUserAuthHeader } from './authUser'
import catchErrors from './catchErrors'
import { routeForThePost } from './userRoutes'

const headers = getUserAuthHeader()


export const deleteComment = async (commentId,postId,showToastMessage,commentRef,length,setAllPosts) => {
    try{
        const {data} = await axios.delete(`${routeForThePost}/${commentId}/${postId}`,{headers}) 
        if(!data.status) return handleError(data.msg)
        commentRef.current.style.display='none'
        setAllPosts(length)
        showToastMessage(null,data.msg)
    }catch(e){
        showToastMessage(false,'Oops something went wrong!')
        console.log(e,'is the error occured in the deleteComments function in the postActions.js file ')
        return {status:false,msg:'Something went wrong'}
    }
}