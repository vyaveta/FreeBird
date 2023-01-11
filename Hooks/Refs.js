import { useRef, useState } from "react";

const Refs = () => {
    const refsObj = {}
    const [refs,setRefs] = useState({})
    
    const addRef = elementId => {
      //  refsObj[elementId] = useRef(null)
    }
    setRefs(refsObj)

    return {refsObj,refs}
}