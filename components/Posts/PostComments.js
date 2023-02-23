import React, { useEffect, useRef, useState } from 'react'
import css from '../../styles/components/PostComments.module.css'
import { toast } from 'react-toastify'
// Icons
import {BsThreeDotsVertical} from 'react-icons/bs'
import {MdEdit} from 'react-icons/md'
import {MdDelete} from 'react-icons/md'
import {IoIosFlag} from 'react-icons/io'
import {BsDot} from 'react-icons/bs'

// Local functions
import { calculateTime } from '../../utils/calculateTime'
import { deleteComment } from '../../utils/postActions'

const PostComments = ({post,comment,user,darkmode,posts,setAllPosts,setPostCommentsCount}) => {

  const commentRef = useRef(null)

  const showToastMessage = (flag,msg) => {
    if(flag===false) return toast.error(msg)
    if(flag===true) return toast.success(msg)
    toast.info(msg)
  }

  useEffect(() => {
    console.log(comment,'ist e comment')
  },[])

  const [showCommentActionBox,setShowCommentActionBox] = useState(false)

  return (
    <div className={darkmode ? `${css.dark} ${css.container}` : `${css.conterner}`} ref={commentRef} > 
        <div className={css.commentBox}>
        <div className={css.metaData}>
        {/* <div> */}
        <img src={comment.user.profilePicUrl} className={css.commentProfileImage} />
        {/* </div> */}
        {/* <div> */}
        <p className={`margin-0 color-primaryLight fontweight-600 ${css.profileName}`}>{comment?.user?.username}</p>
        
        {/* <BsDot /> */}
        {/* </div> */}
        </div>
        <div className={`width-100 ${css.metaData} ${css.commentTextDiv}`}>
        <p className={`${css.commentText} margin-0`} >{comment.text}</p>
        </div>
        <div className={`${css.metaDataWithAction} ${css.noWrap}`}>
         <p className = {`margin-0 ${css.w}`}> {calculateTime(comment.date)} </p>
         <div className={css.threeDotAction}>
         {
          user._id === comment.user._id &&
          <BsThreeDotsVertical onClick={() => setShowCommentActionBox(!showCommentActionBox)} />
         }
          {
           showCommentActionBox && <div className={css.threeDotActionBox}>
             <ul>
               <li>Edit <MdEdit /></li>
               <li
               onClick={() => deleteComment(comment._id,post._id,showToastMessage,commentRef,posts.length,setAllPosts,setPostCommentsCount)} 
               >Delete <MdDelete /></li>
               {/* <li>Report  <IoIosFlag /></li> */}
             </ul>
           </div>
          }
         </div>
        </div>
       </div>
      
    </div>
  )
}

export default PostComments