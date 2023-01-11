import axios from 'axios'
import React, { useEffect, useState } from 'react'
import css from '../../styles/components/LikesList.module.css'
import { getUserAuthHeader } from '../../utils/authUser'
import { routeForThePost } from '../../utils/userRoutes'

// icons
import {IoMdCloseCircle} from 'react-icons/io'

const LikesList = ({ post, handleError , setShowLikeList}) => {

  const [likeList, setLikeList] = useState([])
  const [loading, setLoading] = useState(false)

  const headers = getUserAuthHeader()

  const getAllLikes = async (postId = post._id) => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${routeForThePost}/like/${postId}`, { headers })
      if (!data.status) return handleError(data.msg)
      setLikeList(data.likes)
      console.log(data.likes, 'is the all likes data data')
    } catch (e) {
      handleError('Oops something went wrong')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllLikes(post._id)
  }, [])

  useEffect(() => {
    console.log(likeList, 'is the like lists')
  }, [likeList])

  return (
    <div className={css.container}>
      {
        loading ? <img src='/loader.gif' className={css.loader} /> : (
          <>
            <div className={css.heading}>
              <p className='margin-0 color-blue'> also liked by...</p>
              <IoMdCloseCircle className={css.icon} 
              onClick={() => setShowLikeList(false)}
              />
            </div>
            {
              likeList.map((likeDetails, index) => {
                return <>
                  <div className={css.box} key={index}>
                    <img className={css.image} src={likeDetails.user.profilePicUrl} />
                    <p className={css.username}>{likeDetails.user.username}</p>
                    <button className={css.button}>Follow</button>
                  </div>
                </>
              })
            }
          </>
        )
      }
    </div>
  )
}

export default LikesList