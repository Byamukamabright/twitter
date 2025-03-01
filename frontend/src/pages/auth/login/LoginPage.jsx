import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import XSvg from '../../../components/svgs/X'
import { MdMail, MdPassword } from 'react-icons/md'


const LoginPage = () => {
  const queryClient = useQuery({});
  const [formData,setFormData] = useState({
    username:"",
    password:""
  });
  const {
          mutate:loginMutation,
          isPending,
          isError,
          error
        } = useMutation({
          mutationFn: async ({username,password}) => {
            try{
              const res = await fetch("/api/auth/login",{
                method:"POST",
                headers: {
                  "content-Type":"application/json",
                },
                body: JSON.stringify({username,password})
              });
              const data = await res.json();
              if(!res.ok){
                throw new error(data.error || "something went wrong")
              }
              
            } catch(error){
              throw new Error(error);
            }
          },
          onSuccess: () => {

          }
        });
const handleSubmit = (e) =>{
    e.preventDefault()
      console.log(formData)
 }
const handleInputChange = (e) =>{
  setFormData({...formData,[e.target.name]:e.target.value})
}
        
  return (
    <div className='max-w-screen-xl mx-auto flex h-screen'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3  fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='flex gap-4 flecx-col' onSubmit={handleSubmit}>
            <XSvg className='w-24 lg:hidden fill-white'/>
            <h1 className='text-4xl font-extrabold text-white'>let's go</h1>
            <label className='input input-bordered rounded flex items-center gap-2'>
              <MdMail />
              <input type='text'
              className='grow'
              placeholder='username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
              />
            </label>
            <label className='input input-bordered rounded flex items-center gap-2'>
              <MdPassword />
              <input 
              type='password'
              placeholder='password'
              name='password'
              className='grow'
              onChange={handleInputChange}
              value={formData.password}/>
            </label>
            <button className='btn rounded-full btn-primary text-white'>
              {isPending?"Loading...":"Login"}
            </button>
            {isError && <p className='text-red-500'>Something Went Wrong</p>}
        </form>
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>Dont have an account?</p>
          <Link to='/signup'>
          <button className='btn rounded-full btn-primary text-white btn-outline w-full'>SignUp</button>
          </Link>
        </div>
      </div>
      
    </div>
  )
}

export default LoginPage
