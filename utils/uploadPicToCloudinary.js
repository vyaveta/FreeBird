import axios from "axios";

const uploadUserProfilePic = async (media) => {
    try{
        const form = new FormData()
        form.append('file' , media)
        form.append('upload_preset' , 'free_bird')
        form.append('cloud_name' , 'dua226fzw')

        const res = await axios.post(process.env.CLOUDINARY_URL, form)
        return res.data.url
    }catch(er){
        console.log(`${er}, is the error that occured in the uploadPicToCloudinary file in the utils folder`)
        return false
    }
}

export default uploadUserProfilePic