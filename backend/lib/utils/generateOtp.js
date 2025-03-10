export const generateOtp = () =>{
    try{
        const date = new Date()
        const now = date.getTime();
        const createdAt = now.toString()
        const expiresAt = (now + 300000).toString()
        const otpnum = (1000 + Math.floor(Math.random()*9000)).toString();
        return({otpnum,createdAt,expiresAt})
    }catch(error){
        throw new Error(error.message)
    }
   
    
}
export default generateOtp;