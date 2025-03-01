import React, { useRef, useState } from 'react'
import {MdOutlineClose, MdOutlineImage} from 'react-icons/md'
import {MdEmojiEmotions} from 'react-icons/md'
import { useMutation } from '@tanstack/react-query'

const CreatePost = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const imgRef = useRef(null);
    /* useQuerry and useMutation functions*/


const handleImgChange = (e) => {
    const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
}
const handleSubmit = (e) =>{
    e.preventDefault();
    /*creatPost({ text,img }) */
}
    
  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
        <div className='avatar'>
            <div className='w-8 rounded-full'>
                <img src=""/>
            </div>
        </div>
        <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
            <textarea className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800
            ' placeholder='what is happening' value={text} onChange={(e)=>{setText(e.target.value)}} />

            {img && (<div className='relate w-72 mx-auto'>
                <MdOutlineClose className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 cursor-pointer'
                onClick={()=>{
                    setImg(null)
                    imgRef.current.value = null
                }}
                />
                <img src={img} className='w-full mx-auto h-72 object-contain rounded'/>
            </div>)}
            <div className='flex justify-between border-t py-2 border-t-gray-700'>
                <div className='flex gap-1 items-center'>
                    <MdOutlineImage className='fill-primary w-6 h-6 cursor-pointer'
                    onClink={()=>{imgRef.current.click()}} />
                    <MdEmojiEmotions className='fill-primary w-5 h-5 cursor-pointer'/>
                </div>
                <input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange}/>
                <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                    {/* isPending? "posting...": "Post" */}
                </button>
            </div>
            {/* {isError && <div className='text-red-500'>{error.message || "something Went wrong"}</div>} */}

        </form>
      
    </div>
  )
}

export default CreatePost
