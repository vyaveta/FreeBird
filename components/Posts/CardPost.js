import React, { useEffect, useRef, useState } from 'react'
import css from '../../styles/components/CardPost.module.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify'
import _ from 'lodash';

//Components
import CommentInputField from './CommentInputField'
import PostComments from './PostComments'

//Icons
import {FcLike} from 'react-icons/fc'
import {AiOutlineComment} from 'react-icons/ai'
import {FcLikePlaceholder} from 'react-icons/fc'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdEdit} from 'react-icons/md'
import {MdDelete} from 'react-icons/md'
import {IoIosFlag} from 'react-icons/io'
import {FaSort} from 'react-icons/fa'

//Local Functions
import { getUserAuthHeader } from '../../utils/authUser'
import { calculateTime } from '../../utils/calculateTime'
import { getAllPostsRoute, RouteForLikingAPost, routeForThePost, RouteForUnLikingAPost } from '../../utils/userRoutes'
import LikesList from './LikesList'



const CardPost = ({post,user,setPosts}) => {

  const reversedComments = post.comments.slice().reverse()

  const [sortCommentsInOldFirst,setSortCommentsInOldFirst] = useState(false)

  const [likes, setLikes] = useState(post.likes);
  const headers = getUserAuthHeader()

  const [postLiked,setPostLiked] = useState(false)
  const [postLikesCount,setPostLikesCount] = useState(0)
  const [postCommentsCount,setPostCommentsCount] = useState(0)
  const [showComments,setShowComments] = useState(false)
  const [showPostActions,setShowPostActions] = useState(false)
  const [showLikeAnimation,setShowLikeAnimation] = useState(false)
  const [showLikeList,setShowLikeList] = useState(false)

  const isDarkMode = useSelector(state=>state.darkmode.value)
  const [darkmode,setDarkmode] = useState(false)
  const [userCookie,setUserCookie] = useState('')

  // Some refs
  const postActionBoxRef = useRef(null)

  const handleError = msg => {
    toast.error(msg)
  }

  const handleLikePost = async (postId,doubleTap=false) => {
    try{
      console.log(userCookie,'is the user cookie')
    const {data} = await axios.post(`${RouteForLikingAPost}/${postId}`,{
      headers: { freebirdusertoken: userCookie }
    })
    if(data.status) {
      setLikes(prev => [...prev,{user:user._id}]) 
      setPostLikesCount(postLikesCount+1)
      setAllPosts()
      const imageDiv = document.getElementById(postId)
      if(imageDiv) console.log(imageDiv.styles,'is the image div')
    }else if(!doubleTap) handleError(data.msg)
    else {
      setShowLikeAnimation(true)
      setTimeout(() => {
        setShowLikeAnimation(false)
      },1000)
    }
    }catch(e){
      console.log(e)
      handleError('Oops something went wrong')
    }
  }

  const handleUnlikePost = async(postId = post._id.toString())  => {
    try{
      const {data} = await axios.post(`${RouteForUnLikingAPost}/${postId}`,{
        Headers: {freebirdusertoken: userCookie}
      })
      console.log(data,'is the unlike post data from axios')
      if(data.status){
        setLikes(prev => prev.filter(like => like.user!==user._id))
        setPostLikesCount(postLikesCount-1)
        setPostLiked(false)
        setAllPosts()
      } 
    }catch(e){
      handleError('Oops Something went wrong')
    }
  }

  const setAllPosts = async () => {
    const {data} = await axios.get(getAllPostsRoute,{headers})
    if(!data.status) handleError(postsRes.data.msg)
    else setPosts(data.posts)
    if(showLikeAnimation) setShowLikeAnimation(false)
  }

  const deletePost = async postId => {
    try{
      const {data} = await axios.delete(`${routeForThePost}/${postId}`,{headers})
      if(!data.status) return handleError(data.msg)
      toast.info('Post deleted')
      setAllPosts()
    }catch(e){
      console.log(e,'is the error')
      handleError('Oops Something went wrong')
    }
  }

  const toggleSetPostActions = event => {
    event.stopPropagation();
    setShowPostActions(!showPostActions)
  }
  
  
  const handleDocumentClick = (event) => {
    // toast.info('clicked')
    // if (postActionBoxRef.current && postActionBoxRef.current.contains(event.target)) {
      setShowPostActions(false);
      setShowLikeList(false)
    // }
  };
  
  const debouncedHandleDocumentClick = _.debounce(handleDocumentClick, 200);

  useEffect(() => {
    document.addEventListener('click', debouncedHandleDocumentClick);
    return () => {
      document.removeEventListener('click', debouncedHandleDocumentClick);
    };
  }, []);

  useEffect(() => {
    
    if(likes.length > 0 && likes.filter(like => like.user === user._id).length > 0) setPostLiked(true)
    else setPostLiked(false)
    setPostLikesCount(likes.length)
  },[likes])

  useEffect(() => {
    if(likes.length > 0 && likes.filter(like => like.user === user._id).length > 0) setPostLiked(true)
    else setPostLiked(false)
    setPostLikesCount(likes.length)
  },[post])

  

  useEffect(() => {
    setDarkmode(isDarkMode)
  },[isDarkMode])

  useEffect(()=> {
    setLikes(post.likes)
    if(likes.filter(like => like.user.toString()===user._id).length > 0) setPostLiked(true)
    else setPostLiked(false)
    setDarkmode(isDarkMode)
    const cookie = Cookies.get('FreeBirdUserToken')
    setUserCookie(cookie)
    setPostLikesCount(likes.length)
    setPostCommentsCount(post.comments.length)
  },[post])


  return (
    <div className={darkmode ? `${css.container} ${css.dark}`: css.container}
    onDoubleClick={() => {
      setShowLikeAnimation(true)
      handleLikePost(post._id,true)
    } }
    >
      <div className={`${css.box} position-relative`} >
        <div className={css.postMetaLeft}>
          <div className={css.userDetails}>
            <img className={css.userProfileImg} src={post.user.profilePicUrl} />
          </div>
          <div className = {css.userDetails}>
            <h4 >{post.user.username}</h4>
            <h5>{post.location && post.location}</h5>
          </div>
        </div>
        <div className={css.postMetaRight}>
          <div className={`${css.timediv}`}> {calculateTime(post.createdAt)} </div>
          {
            (user._id === post.user._id || user.role === 'root') &&
            <BsThreeDotsVertical  onClick={toggleSetPostActions} 
            className={`cursor-pointer`}
            />
          }
        </div>
        {
          showPostActions && 
          <div className={css.threeDotActionBox}  ref={postActionBoxRef} >
            <ul>
              <li>Edit <MdEdit /> </li>
              <li onClick={() => deletePost(post._id)}>Delete <MdDelete /> </li>
              {/* <li>Report  <IoIosFlag /> </li> */}
            </ul>
          </div>
        }
      </div>
      <div className={css.box}>
        <h4>{post.text}
        </h4>
      </div>
     {
      post.picUrl &&
      <div className={`${css.imageBox} cursor-pointer`} 
      onDoubleClick={() => {
        setShowLikeAnimation(true)
        handleLikePost(post._id,true)
      } } >
          <img src={post.picUrl} alt=""  />
          <div className={showLikeAnimation ? css.likeAnimation : css.displayNone} id={post._id}> <FcLike /> </div>
      </div>
     }
          {/* <div className={css.line} /> */}
       <div className={css.box}>
        <div className={css.actions}>
         <div className={css.actionBox}>
         {
            postLiked ? <FcLike className={css.icon} onClick={() => handleUnlikePost(post._id)} /> : <FcLikePlaceholder onClick={() => handleLikePost(post._id)} className={css.icon} />
          }
          &nbsp;
          <p className={`margin-0 cursor-pointer ${css.likesCount}`}
          onClick={(e) => {
            e.stopPropagation()
            setShowLikeList(!showLikeList)
          }}
          >{` ${postLikesCount} likes` }</p>
         </div>
         {
          showLikeList &&
          <LikesList post={post} handleError={handleError} setShowLikeList={setShowLikeList} /> 
         } 
         <div className={css.actionBox} style={{cursor:'pointer'}}>
          {
            <AiOutlineComment className={css.icon} onClick= {() => setShowComments(!showComments)}/>
          }
          &nbsp;
          
            <p className='margin-0' onClick= {() => setShowComments(!showComments)}>{`${postCommentsCount} Comments`}</p>
          
          &nbsp;
          <FaSort onClick={() => setSortCommentsInOldFirst(!sortCommentsInOldFirst)} />
         </div>
        </div>
      </div>
     
      {
        showComments && 
        <div className={css.commentContainer} >
          {
            sortCommentsInOldFirst ? 
            reversedComments.map((comment,index) => {
              if(index < 4) return <PostComments key={index} user={user} post={post} comment={comment} setAllPosts={setAllPosts} darkmode={darkmode} />
             }) : post.comments.map((comment,index) => {
              if(index < 4) return <PostComments key={index} user={user} post={post} comment={comment} setAllPosts={setAllPosts} darkmode={darkmode} />
             })
          }
        </div>
      }
      {
        showComments && reversedComments.length > 5 &&
        <div className={css.buttonDiv}>
         <button className={css.viewMoreButton}>View More</button>
        </div>
      }
      <CommentInputField user={user} postId={post._id} setAllPosts={setAllPosts} />
    </div>
  )
}

export default CardPost



