import React, { useEffect, useRef, useState } from "react";
import css from "../../styles/components/CreatePost.module.css";
import { useSelector } from "react-redux";
import {TiImage} from 'react-icons/ti'
import uploadUserProfilePic from "../../utils/uploadPicToCloudinary";
import axios from "axios";
import { routeForThePost } from "../../utils/userRoutes";
import { getUserAuthHeader } from "../../utils/authUser";
import { toast } from 'react-toastify'

const CreatePost = ({user,posts,setPosts}) => {

  let thePicUrl
  let theNewPost

  const darkmode = useSelector((state) => state.darkmode.value);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [newPost,setNewPost] = useState({
    text:'',
    location:'',
    user,
    picUrl:'',
    likes:[],
    comments: [],
  })


  const [loading,setLoading] = useState(false)
  const inputRef = useRef()
  const [error,setError] = useState(false)
  const [highlighted,setHighlighted] = useState(false)

  const [media,setMedia] = useState(null)
  const [mediaPreview,setMediaPreview] = useState(null)
  const [showImagePreview,setShowImagePreview] = useState(false) 

  const handleError = msg => {
    toast.error(msg)
  }

  const handleCreateNewPost = e => {
    console.log('function called')
    const {name,value,files} = e.target
    if(name==='media'){
      setMedia(files[0])
      setMediaPreview(URL.createObjectURL(files[0]))
      console.log('image url created')
      setNewPost({
        ...newPost,
        picUrl: URL.createObjectURL(files[0])
      });
    }
    setNewPost(prev => ({...prev,[name]: value}))
  }

  const handleDroppedImage = e => {
    try{
      const droppedFile=Array.from(e.dataTransfer.files) 
      setMedia(droppedFile[0])
      setMediaPreview(URL.createObjectURL((droppedFile[0])))
      setNewPost({
        ...newPost,
        picUrl: URL.createObjectURL(droppedFile[0])
      });
    }catch(e){
      handleError('Enter a valid Image')
    }
  }

  const uploadPicToCloudinary = async() => {
     thePicUrl =  await uploadUserProfilePic(media)
     theNewPost.picUrl = thePicUrl
    setNewPost({
      ...newPost,
      picUrl: thePicUrl
    });
    console.log(thePicUrl,'is the pic url')
  }

  const handleUploadNewPost = async () => {
    try{
      setLoading(true)
      if(newPost.text.trim()==='') return handleError('Enter your Thoughts')
      const headers = getUserAuthHeader()
      console.log(newPost,'is the newPost')
      if(media!==null){
       await uploadPicToCloudinary()
      }
      const {data} = await axios.post(routeForThePost,theNewPost,{headers})
      console.log(data.status,'from the axios post create post function')
      if(data.status) {
        data.post.user= user
        setPosts(prev => [data.post,...prev])
        setNewPost({text:'',location:'',user,picUrl:'',likes:[],comments: []})
        setShowImagePreview(false)
        setMediaPreview(null)
      }
    }catch(e){
      console.log(e,'is the error that occured in the handleUploadNewPost function in the CreatePost.js')
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsDarkMode(darkmode);
  }, [darkmode]);

  useEffect(() => {
    setIsDarkMode(darkmode);
  }, []);

  useEffect(() => {
    theNewPost = newPost
  },[newPost])



  return (
    <div
      className={isDarkMode ? `${css.container} ${css.dark}` : css.container}
      onDrop={handleDroppedImage}
    >
      <div className={css.box}>
        <h3>Share your thoughts</h3>
      </div>
      <div className={css.createDiv}>
        <div className={css.ProfilePicDiv}>
          <img src={user.profilePicUrl} className={css.profilePic} />
        </div>
      <div className = {css.box} >  
        <textarea className={css.input} onChange={handleCreateNewPost}
         value={newPost.text} 
         name='text' 
         type="text" 
         placeholder="Write your thoughts here"
         autoComplete="off"
         />
      </div>
      </div>
      <div className={css.box2} >
        <TiImage className={css.icon} onClick={() => {
          setShowImagePreview(!showImagePreview)
          inputRef.current.click()
        }} />
        <input type='file' name='media' style={{display:'none'}} onChange={handleCreateNewPost} ref={inputRef} />
        <div className={css.inputCover}>
          <input className={css.input}
           type='text' 
           placeholder='Location'
           autoComplete="off"
           value={newPost.location}
           onChange={handleCreateNewPost}
           name='location'
           />
        </div>
        <div>
          <button className="dark__button"
          onClick={handleUploadNewPost}
          >Upload</button>
        </div>
      </div>
      {
        (showImagePreview || mediaPreview !== null ) && 
        <div className={css.box3}>
          <div className={css.postImagePreviewBox}>
            <img src={mediaPreview} />
          </div>
        </div>
      }
      {
        loading && 
        <div className={css.loadingDiv}>
          <img src="/loader.gif" />
        </div>
      }
    </div>
  );
};

export default CreatePost;
