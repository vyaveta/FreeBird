import React from 'react'
import {Form,Button,Message,Segment,TextArea,Divider,Item} from "semantic-ui-react";
import ImageDropDiv from './ImageDropDiv';

const FinalSignUpStep = () => {
  return (
   
        <Segment >
          <ImageDropDiv mediaPreview={mediaPreview} setMediaPreview={setMediaPreview} setMedia={setMedia} inputRef={inputRef} highlighted={highlighted} setHighlighted={setHighlighted} handleChange={handleChange}  />
        </Segment>
   
  )
}

export default FinalSignUpStep