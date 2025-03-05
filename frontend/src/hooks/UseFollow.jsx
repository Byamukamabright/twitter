import React from 'react'
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const UseFollow = () => {
    const queryClient = useQueryClient()
    const {mutate: follow, isPending} = useMutation({
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
            toast.success("Follow successful")
        },
        onError: (error) =>{
            toast.error(error.message);
        }
    })

  return { follow, isPending }
}

export default UseFollow
