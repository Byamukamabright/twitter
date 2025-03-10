import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import XSvg from '../../../components/svgs/X';
import { MdDriveFileRenameOutline, MdEmail,MdPassword } from "react-icons/md";
import { FaUser }  from 'react-icons/fa'
import { Link } from "react-router-dom"
import { use } from 'react';

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password:""
	});
    let [verifyDetails, setVerifyDetails] = useState(true)
    let [myDetails, setMyDetails] = useState('');
    const [otp, setOtp] = useState("")
    let isverified = true
    
	const {mutate,isError,isPending,error} = useMutation({
		mutationFn: async ({email,username,fullName,password}) => {
			try{
				const res = await fetch("/api/auth/signup",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({ email,username,fullName,password })
                })
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || "SomeThing went wrong");
                
                
                setMyDetails(data.data);
                setVerifyDetails(false)
                setVerifyDetails(myDetails.verified)
                
                
                if(data.error) throw new Error(data.error);
                
                return data;
			} catch(error){
                throw error
            }
		},
        onSuccess: () => {
            toast.success("OTP sent successfully")
        }
	})
    const {mutate:verifyaccount, isPending:verifypending,error:verifyerror}= useMutation({
        mutationFn: async(myDetails) => {
            try{
                const res = await fetch("/api/auth/signup",{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(myDetails)
                })
                const data = await res.json()
                
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong")
                
                }
                if(data.followers){
                    toast.success("Account Verified")
                    location.reload()
                }
            }catch(error){

            }  
        },
        onSuccess:()=>{
            
        }
    })

	const handleSubmit = (e) =>{
		e.preventDefault(); //page wont reload
		mutate(formData);
    

	};
	const handleInputChange = (e) => {
		setFormData({...formData,[e.target.name]:e.target.value})
	};
    const handleOtpchange = (e) => {
        setOtp(e.target.value);
    };
    const verifyAccount = (e)=>{
        e.preventDefault()
        myDetails.otp = otp
        verifyaccount(myDetails);
        isverified = myDetails.verified
    }

  return (
	 <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
        { verifyDetails &&
        <>
        <div className='flex-1 hidden lg:flex items-center justify-center'>
			<XSvg className="lg:w-2/3 fill-white" /> 
		</div>
		<div className='flex-1 flex flex-col justify-center items-center'>
			<form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
				<XSvg className='w-24 lg:hidden fill-white'/>
				<h1 className='text-4xl font-extrabold text-white'>Join Today</h1>
				<label className='input input-bordered rounded flex items-center gap-2'>
					<MdEmail />
					<input
					type='email'
					className='grow'
					placeholder='Email'
					name='email'
					onChange={handleInputChange}
					value={formData.email}
					/>

				</label>
                <div className='flex gap-4 flex-wrap'>
                    <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                        <FaUser />
                        <input 
                        type='text'
                        className='grow'
                        placeholder='username'
                        name='username'
                        onChange={handleInputChange}
                        value={formData.username}
                        />
                    </label>
                    <label className='input input-bordered rounded flex items-center gap-2' >
                        <MdDriveFileRenameOutline />
                        <input 
                        type='text'
                        className='grow'
                        name='fullName'
                        placeholder='Full Name'
                        onChange={handleInputChange}
                        value={formData.fullName}
                        />
                    </label>
                </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                        type='password'
                        placeholder='password'
                        className='grow'
                        name='password'
                        value={formData.password}
						onChange={handleInputChange}
                        />
                    </label>
                    <button className='btn  rounded-full btn-primary text-white'>
                        {isPending? "Loading...": "SignUp"}
                    </button>
                    {isError && <p className='text-red-500'>{error.message}</p>}
			</form>
            <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
            <p className='text-white text-lg '>Already have an account</p>
            <Link to='/login'>
                <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
                    {isPending? "Loading...":"SignIn"}
                </button>
            </Link>
            </div>
            
		</div>

        </>}
        {!verifyDetails &&<>
        <div className='flex flex-col justify-center items-center mx-auto h-screen max-w-screen-xl'>
            <form className='flex flex-col' onSubmit={verifyAccount}>
                <h3 >Enter OTP sent to your Email</h3>
                <label className='input rounded-md p-2 my-1'>
                    <input type='text' name='otp' className='grow' placeholder='Enter 4-Digit OTP' inputMode='numeric' onChange={handleOtpchange}/>
                </label>
                { !isverified?<p className='text-red-500'>Invalid OTP </p>:""}
            <button id='verify'className='btn btn-primary rounded-full hover:bg-blue-900'>Verify</button>
            </form>
        </div>
        </>}

		
        
	  
	</div>
  )
};

export default SignUpPage;
