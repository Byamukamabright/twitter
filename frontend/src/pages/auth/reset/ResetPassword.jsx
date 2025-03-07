import { useMutation } from '@tanstack/react-query';
import React, { useState,Link } from 'react'
import toast from 'react-hot-toast';
import { FaUser } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";
import { MdOutlinePassword } from "react-icons/md";
const ResetPassword = () => {
    const [formData, setFormData] = useState(
        {
            username:"",
            email:"",
            newpassword:""
        }
    ) 
    const { mutate: resetPassword, isSuccess,isError,error,isPending} = useMutation({
        mutationFn: async(formData) =>{
            try{
                if((formData.email.replace(" ","").length != 0)&& (formData.username.length != 0)&& (formData.newpassword.length !=0 )){
                    const res = await fetch("/api/auth/reset",{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify(formData)
                    })
                    const data = await res.json()
                    if(!res.ok){
                        toast.error(data.error)
                    } else{
                        toast.success(data.message)
                    }
                } else{
                    toast.error("Enter full Details")
                }
                
            }catch(error){
                 throw new Error(error)
                
            }
            
        },
        onSuccess: () =>{
            
        },
    })
    const handleFormData = (e)=>{
        e.preventDefault()
        resetPassword(formData) 
    }
    const handleInputChange =(e) =>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
  return (
    <div className='flex justify-center items-center mx-auto h-screen w-2/3'>
        <div className='flex items-center flex-col'>
            <form onSubmit={handleFormData}>
                <h2 className='p-1 text-xl'>Enter Details to Reset your password</h2>
                <label className='flex my-2 input'>
                    <FaUser className='w-5 h-5 fill-gray-700' />
                    <input type='text' placeholder='username' name="username" className='grow text-md' onChange={handleInputChange}/>
                </label>
                <label className='flex my-2 input'>
                    <MdMarkEmailUnread className='w-5 h-5 fill-gray-700'/>
                    <input type='email' name="email" placeholder='email' className='grow text-md' onChange={handleInputChange}/>
                </label>
                <label className='flex my-2 input'>
                    <MdOutlinePassword className='w-5 h-5 fill-gray-700'/>  
                    <input
                     type='password' placeholder='New password'name="newpassword" className='grow text-mds' onChange={handleInputChange}>
                       
                     </input>
                </label>
                <button className='btn btn-primary rounded-full'>{isPending? "Reseting...": "Reset Password"}</button>
             </form>
             
        </div>        

    </div>
  )
}

export default ResetPassword
