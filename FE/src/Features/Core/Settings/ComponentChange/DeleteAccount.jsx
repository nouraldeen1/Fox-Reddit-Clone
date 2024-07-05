import React, { useEffect } from 'react'
import axios from 'axios'
import { userAxios } from '../../../../Utils/UserAxios';
const DeleteAccount = ({setDelete}) => {
  
  const handleDelete=async()=>{
    try{
        const serverEndpoint = "/api/users/delete_user";
        await userAxios.delete(serverEndpoint);
        console.log('User deleted successfully.');
        localStorage.removeItem('authorization');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        console.log('token deleted successfully.');
       } 

      catch (error) {
      console.error('Error deleting user:', error);
    }
  
  };
  return (
      <div className=' w-screen h-screen bg-slate-950 bg-opacity-30 fixed top-0 right-0 flex justify-center items-center '>
       
    <div className=' bg-white flex-col shadow-md rounded-md w-[420px] h-[250px]'>
      <div className=' flex w-full justify-end '> 
         <button onClick={()=>setDelete(false)} className=' mt-3 mr-4'>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
           </svg>
         </button>
  
      </div>

      <div className=' flex flex-row ml-7 '>
          
            <p className=' font-semibold text-xl ml-3 mt-2'> Delete account</p>
      </div>


      <div className=' mx-9 mt-2 text-sm text-slate-900 font-normal'>
         <p> Once you delete your account, your profile and username are permanently removed from Reddit and your posts, comments, and messages are disassociated (not deleted) from your account unless you delete them beforehand    </p>
      </div>
     

   
      
      <div className='flex justify-end flex-row  mt-2'>
      <button onClick={()=>setDelete(false)} className=" mr-3 text-sky-600 bg-white border border-sky-600 rounded-full font-semibold text-base w-24 h-8 hover:bg-sky-50 ">Cancel</button>
      
       <button  onClick={handleDelete} className=" mr-8 text-white bg-sky-600 border-sky-600 rounded-full font-semibold text-base w-24 h-8 hover:bg-sky-600">
         Delete
      </button>   
      </div>

 
   

   </div>
   

   </div>
    
   
  )
}

export default DeleteAccount