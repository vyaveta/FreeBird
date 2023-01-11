import React from 'react'
import { Form, Segment, Icon , Header } from 'semantic-ui-react'
import css from '../styles/components/imageDropDiv.module.css'
import { toast } from 'react-toastify'
import Image from 'next/image'
import {BsFillImageFill} from 'react-icons/bs'


const ImageDropDiv = ({highlighted,setHighlighted,inputRef,handleChange,mediaPreview,setMediaPreview,setMedia}) => {

    const handleDroppedImage = (e) => {
        try{
            e.preventDefault()
            setHighlighted(true)
            const droppedFile=Array.from(e.dataTransfer.files) 
            setMedia(droppedFile[0])
            setMediaPreview(URL.createObjectURL((droppedFile[0])))
        }catch(err){
            setHighlighted(false)
            toast.error('Select a valid Image')
        }
    }

  return (
             <div className={css.container}>
                <div className={highlighted ? css.greenLine : css.noGreenLine}></div>
                <input style={{display:'none'}} type='file' name='media' accept='image/' onChange={handleChange} ref={inputRef} />
                <div className={css.imageDiv}
                onDragOver={(e) => {
                    e.preventDefault()
                    setHighlighted(true)
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    setHighlighted(false)
                }}
                onDrop={handleDroppedImage}
                >
                    {
                        mediaPreview===null? (
                        <>
                            <BsFillImageFill className={css.imageIcon} onClick={() => inputRef.current.click()} />
                            <p onClick={() => inputRef.current.click()}> Drag n drop or Select from files. </p>
                        </>
                        ) : (
                            <>
                            <div >
                                <Image className='borderRadius50' width='140' height='140' alt='' src={mediaPreview}   style={{cursor:'pointer', objectFit:'cover'}} onClick={() => inputRef.current.click()} />
                            </div>
                        </>
                        )
                    }
                </div>
            </div>
  )
}

export default ImageDropDiv