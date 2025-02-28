import React from 'react'
import { useQuery,useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const UseFollow = () => {
    const queryClient = useQuery({})
    const {mutate: follow,isPending} = useMutation({
        mutationFn: async (userId) =>{
            try{
                const res = await fetch(`/api/users/follow/${userId}`,{method:"POST"})
                const data = res.json()
                if(!res.ok){
                    throw new Error(error.message || "Something went wrong");
                }
                return;
            }catch(error){
                throw new Error(error.message);
            }
        },
        onSuccess: () =>{
            Promise.all([])
        },
        onError: (error) =>{
            toast.error(error.message);
        }
    })

  return { follow, isPending}
}

export default UseFollow
