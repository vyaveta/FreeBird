import moment from 'moment'
import Moment from 'react-moment'

export const calculateTime = createdAt => {
    const today = moment(Date.now())
    const postDate = moment(createdAt)
    const differenceInHours = today.diff(postDate,'hours')
    const differenceInDays = today.diff(postDate,'d')
    const differenceInMinutes = today.diff(postDate,'minutes')
  
 
    
    if(differenceInHours <= 12 && differenceInHours >=1) return <>  {differenceInHours} hours ago </>
    else if(differenceInHours < 1) return <> {differenceInMinutes}mins ago </>
    else if(postDate < today && differenceInHours < 36) return <> Yesterday <Moment format='hh:mm a'>{createdAt}</Moment> </>
    else if(differenceInHours > 36) return <> <Moment format='DD/MM/YYYY hh:mm a'>{createdAt}</Moment>  </>
}