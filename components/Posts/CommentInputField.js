import React, { useEffect, useState } from 'react'
import css from '../../styles/components/CommentInputField.module.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import EmojiPicker from 'emoji-picker-react';
import _ from 'lodash';

// Icons
import {GrSend} from 'react-icons/gr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { routeForPostComment } from '../../utils/userRoutes'
import { getUserAuthHeader } from '../../utils/authUser'
import {MdOutlineEmojiEmotions} from 'react-icons/md'

const CommentInputField = ({postId,user,setAllPosts}) => {

    const headers = getUserAuthHeader()

    const [text,setText] = useState('')
    const [loading,setLoading] = useState(false)
    const [showEmojiBox,setShowEmojiBox] = useState(false)

    const handleDocumentClick = something => {
      setShowEmojiBox(false)
    }

    const debouncedHandleDocumentClick = _.debounce(handleDocumentClick,200)

    useEffect(() => {
      document.addEventListener("click",debouncedHandleDocumentClick)
    },[])

    const handleError = msg => {
      toast.error(msg)
    }

    const handleEmojiClick = e => {
      console.log('hellosjflksj')
     try{
      console.log(e.emoji)
      let message = text + e.emoji
      setText(message)
     }catch(e){
      toast.error("something went wrong")
     }
    }

    const handlePostComment = async e => {
      try{
        if(text.trim()==='') return handleError("Enter a valid comment")
        const {data} = await axios.post(`${routeForPostComment}/${postId}`,{text},{headers})
        console.log(data,'from axios')
        if(!data.status) return handleError(data.msg)
        setAllPosts()
        setText('')
      }catch(e){
        console.log(e,'isth error in comment')
        handleError('Oops something went wrong')
      }
    }

  return (
    <div className={css.container}>
        <img src={user.profilePicUrl} />
        <MdOutlineEmojiEmotions className={css.icon2} onClick={(e) => {
          e.stopPropagation()
          setShowEmojiBox(!showEmojiBox)
        }} />
        <div className={css.emojiBoxDiv} >
        {
          showEmojiBox && <EmojiPicker width={'400px'} height={'400px'} theme={'dark'} className={css.emojiBox} onEmojiClick={handleEmojiClick} />
        }
        </div>
        <input type='text' placeholder='Comment this post' name='text' autoComplete='off' 
         value={text} 
         onChange={ e => setText(e.target.value)}
        />
        <FontAwesomeIcon className={css.icon} icon={faPaperPlane} 
        onClick={handlePostComment}
        />
    </div>
  )
}

export default CommentInputField