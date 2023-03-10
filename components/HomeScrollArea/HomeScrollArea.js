import React, { Children, useEffect, useRef, useState } from 'react'
import css from './HomeScrollArea.module.css'
import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from './counterSlice'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'


const HomeScrollArea = ({children,hasMore,fetchDataOnScroll,posts}) => {
  const darkmode = useSelector((state) => state.darkmode.value)
  const [isDarkMode,setIsDarkMode] = useState(true)
  const [loading,setLoading] = useState(false)
  const [showReward,setShowReward] = useState(false)

  const scrollContainerRef = useRef(null)

  const handleScroll = () => {
    // console.log('***************************************************************************************************************')
    // console.log(scrollContainerRef.current.clientHeight,'is the scrollContainerRef.current.clientHeight')
    // console.log('scrollContainerRef.current.scrollTop :', scrollContainerRef.current.scrollTop)
    // console.log(' scrollContainerRef.current.scrollHeight : ', scrollContainerRef.current.scrollHeight)
    console.log(hasMore,'is the hasMore')
     if (hasMore && Math.floor(scrollContainerRef.current.clientHeight + scrollContainerRef.current.scrollTop) >= (scrollContainerRef.current.scrollHeight-2)) {
      // setLoading(true)
      fetchDataOnScroll(setLoading)
    }  
  
  }

  const debouncedHandleScroll = _.debounce(handleScroll,1000)

  const playVideo = e => {
    // alert('helo from playVideo')
    e.target.requestFullscreen()
  }
  useEffect(() => {
    try{
      scrollContainerRef.current.addEventListener('scroll', debouncedHandleScroll);
    }catch(e){
      console.log(e,'is the error')
    }
  },[])

  useEffect(() => {
    setIsDarkMode(darkmode)
    document.addEventListener('fullscreenchange', () => {
      if(!document.fullscreenElement) setShowReward(false)
    })
  },[])
  useEffect(() => {
    setIsDarkMode(darkmode)
  },[darkmode])
  return (
    <div className={isDarkMode ? `${css.dark}` : `${css.container}`} ref={scrollContainerRef} >
      {children}
      {
        loading ? <div className={css.loaderDiv}>
          <img src='/loader.gif' className={css.loader} />
        </div> : <div className={css.rewardDiv}>
          <button
          onClick={() => setShowReward(true)}
          >You have reached the bottom, click here to get your reward</button>
          {
              showReward &&  <video src='/reward.mp4' autoPlay onCanPlay={playVideo}/>
         }
        </div>
      }
      
    </div>
  )
}

export default HomeScrollArea