import { Link, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileSettings from '../../Features/Core/Settings/PofileSettings';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userAxios } from '../../Utils/UserAxios';


export default function Card (){
    const username = useSelector(state => state.user.user.username);
    const [numOfPosts, setNumOfPosts] = useState(0);
    const [numOfComments, setNumOfComments] = useState(0);
    const [communities, setCommunities] = useState([]);
  
    useEffect(() => { 
        const getCommunities = async () => {
      try {
        const response = await userAxios.get(`/subreddits/mine/creator`);
        console.log("creator");
        console.log(response.data.communities.map(comm => ({ name: comm.name, memberCount: comm.memberCount, icon: comm.icon })));
        setCommunities(response.data.communities.map(comm => ({ name: comm.name, memberCount: comm.memberCount, icon: comm.icon })));
      } catch (error) {
        console.log(error);
      }
    };

    getCommunities();
  }, []);
 
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userAxios.get(`/api/user/${username}/number_posts_comments`);
        console.log(response.data.comment);
        console.log(response.data.post);
        setNumOfComments(response.data.comment ?? 0);
        setNumOfPosts(response.data.post ?? 0);
       
      } catch (error) {
        console.log(error);
      }
    };
  
      fetchData();
    }, []);


    const navigator=useNavigate();
    const handleNavigate=()=>{
       navigator('/setting/profile');
    }

    const navigate = useNavigate();

    const handleClick = (communityName) => {
      navigate(`/r/${communityName}`);
    };
  
    return(
        <div className="relative border border-slate-200 bg-slate-50 min-h-fit h-fit mr-5 rounded-2xl pb-3 hidden md:block overflow-y-auto">
        
        <div className='w-[100%] h-[124px] rounded-t-2xl mb-2 bg-gradient-to-b from-blue-900 to-black'>
            <button onClick={handleNavigate} className="absolute right-4 top-[74px] pl-[6px] bg-gray-200 rounded-full h-8 w-8 hover:bg-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
            </button>
        </div>
    
        <span id='username' className='font-bold ml-5 '>{username}</span>
        
        <button
              className="flex items-center py-1.5 px-3 ml-5 mt-4 text-xs font-medium text-black focus:outline-none
               bg-gray-200 rounded-xl border border-gray-200 hover:bg-gray-300"> 
               <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="13" viewBox="0 0 16 16">
               <path d="M 12.5 1 C 11.125 1 10 2.125 10 3.5 C 10 3.671875 10.019531 3.835938 10.050781 4 L 5.519531 6.039063 C 5.0625 5.414063 4.328125 5 3.5 5 C 2.125 5 1 6.125 1 7.5 C 1 8.875 2.125 10 3.5 10 C 4.332031 10 5.074219 9.582031 5.527344 8.949219 L 10.0625 10.964844 C 10.023438 11.136719 10 11.316406 10 11.5 C 10 12.875 11.125 14 12.5 14 C 13.875 14 15 12.875 15 11.5 C 15 10.125 13.875 9 12.5 9 C 11.667969 9 10.925781 9.417969 10.472656 10.050781 L 5.9375 8.039063 C 5.976563 7.863281 6 7.683594 6 7.5 C 6 7.3125 5.976563 7.128906 5.9375 6.953125 L 10.445313 4.914063 C 10.898438 5.570313 11.652344 6 12.5 6 C 13.875 6 15 4.875 15 3.5 C 15 2.125 13.875 1 12.5 1 Z M 12.5 2 C 13.335938 2 14 2.664063 14 3.5 C 14 4.335938 13.335938 5 12.5 5 C 11.664063 5 11 4.335938 11 3.5 C 11 2.664063 11.664063 2 12.5 2 Z M 3.5 6 C 4.335938 6 5 6.664063 5 7.5 C 5 8.335938 4.335938 9 3.5 9 C 2.664063 9 2 8.335938 2 7.5 C 2 6.664063 2.664063 6 3.5 6 Z M 12.5 10 C 13.335938 10 14 10.664063 14 11.5 C 14 12.335938 13.335938 13 12.5 13 C 11.664063 13 11 12.335938 11 11.5 C 11 10.664063 11.664063 10 12.5 10 Z"></path>
               </svg>
             
              <span className=' ml-1 text-xs'>share</span>
        </button>
    
        
        <div className=' flex flex-col mt-6'>
              <div className='  flex flex-row mb-7'> <div className=' w-1/2 flex-col ml-6'>
              <p className=' text-xs md:text-sm font-semibold'> 
                {numOfPosts}
              </p>
              <p className=' text-xs text-slate-500'> 
                Post Karma
              </p>
            </div>
        <div className=' w-1/2 flex-col'>
           <p className=' text-xs md:text-sm font-semibold'> 
             {numOfComments}
           </p>
           <p className=' text-xs text-slate-500'> 
             Comment Karma
           </p>
        </div>   
              </div>
             <div className='  flex flex-row'>
        <div className=' w-1/2 flex-col ml-6'>
            <p className=' text-xs md:text-sm font-semibold'> 
             Feb 29, 2024
           </p>
          <p className=' text-xs text-slate-500'> 
            Cake day
          </p>
        </div>
        <div className=' w-1/2 flex-col'>
           <p className=' text-xs md:text-sm font-semibold'> 
              0
           </p>
           <p className=' text-xs text-slate-500'> 
             Gold Received
           </p>
         </div>   
             </div>
        </div>
      

        <hr className="h-px m-3 mb-5 bg-gray-200 border-0 dark:bg-gray-700"/>
       
        <h1 className="text-xs text-gray-600 ml-6"> SETTINGS </h1>
        <br/>

        <div className='flex flex-col pr-2'>
          
           <div className='flex flex-row'>
               
               <div className=' ml-4'>
                  <svg
               version={1.0}
               xmlns="http://www.w3.org/2000/svg"
               width="30pt"
               height="25pt"
               viewBox="0 0 380.000000 466.000000"
               preserveAspectRatio="xMidYMid meet"
             >
               <metadata>
                 Created by potrace 1.16, written by Peter Selinger 2001-2019
               </metadata>
               <g
                 transform="translate(0.000000,466.000000) scale(0.100000,-0.100000)"
                 fill="#FF5711"
                 stroke="none"
               >
                 <path
                     d="M1580 4641 c-114 -37 -203 -98 -266 -184 -48 -65 -84 -164 -84 -232
             0 -27 -5 -45 -14 -48 -14 -5 -26 48 -26 115 0 19 -4 28 -12 26 -17 -6 -26 -42
             -27 -113 l-1 -60 -88 -54 c-55 -35 -117 -86 -170 -140 -45 -48 -86 -89 -90
             -93 -276 -256 -303 -304 -306 -552 -1 -141 15 -216 54 -251 11 -10 27 -43 36
             -73 23 -80 47 -123 96 -173 24 -24 59 -70 78 -103 77 -129 208 -245 368 -325
             85 -43 275 -111 307 -111 10 0 -20 -25 -67 -55 -91 -59 -102 -74 -113 -155
             -10 -72 -55 -222 -79 -260 -17 -29 -21 -52 -23 -135 -1 -55 -4 -119 -8 -143
             -5 -31 -3 -49 9 -67 9 -13 16 -39 16 -58 0 -18 4 -37 9 -42 4 -6 18 -42 29
             -81 35 -116 93 -181 171 -191 28 -4 42 -12 46 -24 8 -23 -1 -39 -21 -39 -16 0
             -18 -23 -4 -50 6 -11 7 -43 4 -75 l-7 -55 -60 -32 c-75 -40 -150 -107 -183
             -164 -70 -119 -24 -280 110 -383 174 -134 410 -188 709 -163 429 35 718 203
             718 417 0 118 -70 203 -255 310 -17 9 -16 13 3 62 11 29 30 62 41 73 11 11 23
             33 26 48 3 16 21 38 45 55 54 39 71 76 77 173 l5 82 31 -4 c40 -6 94 22 122
             63 12 18 27 63 34 100 13 78 5 247 -15 309 -11 31 -11 51 -4 79 8 26 7 51 -1
             87 -13 50 -52 108 -74 108 -7 0 -21 19 -32 42 -10 22 -32 59 -48 81 -18 26
             -31 58 -34 86 -2 27 -13 55 -25 68 -11 13 -19 24 -16 26 2 1 24 13 49 26 83
             44 168 111 236 185 l68 73 39 -28 c62 -45 142 -71 237 -76 236 -14 390 117
             366 311 -6 48 -67 196 -80 196 -3 0 -27 -13 -53 -30 -26 -16 -59 -30 -74 -30
             -56 0 -106 106 -116 249 l-6 83 24 -7 c37 -11 81 -40 118 -79 19 -20 38 -36
             42 -36 4 0 17 26 30 58 79 193 -62 402 -256 377 l-53 -6 -17 58 c-25 87 -72
             167 -129 221 -40 38 -55 62 -70 108 -73 236 -271 424 -497 474 -81 18 -213 9
             -265 -18 l-41 -21 -29 40 c-44 61 -136 126 -211 149 -84 26 -225 27 -303 1z
             m199 -51 c107 -18 201 -77 260 -164 24 -36 26 -45 18 -74 -10 -31 -13 -33 -41
             -28 -17 4 -90 9 -162 12 -149 7 -263 -10 -349 -51 -27 -13 -51 -22 -53 -20 -8
             8 48 94 75 114 14 12 38 24 52 27 14 3 35 9 46 14 16 7 12 9 -18 9 -72 2 -135
             -45 -179 -133 -23 -44 -30 -50 -97 -76 l-74 -29 7 46 c18 135 143 277 286 328
             37 13 109 29 155 34 6 0 39 -4 74 -9z m706 -194 c134 -51 266 -169 329 -294
             57 -113 56 -121 -3 -74 -45 36 -142 82 -172 82 -6 0 -31 14 -55 31 -70 48
             -203 107 -300 132 -84 23 -90 26 -107 61 -22 46 -14 60 52 81 63 20 172 12
             256 -19z m-498 -144 c28 -11 97 -49 152 -85 104 -68 130 -100 144 -174 8 -43
             -3 -42 -44 5 -162 186 -369 266 -561 216 -33 -8 -62 -13 -65 -10 -8 8 78 48
             132 63 65 17 177 10 242 -15z m478 -172 c156 -62 236 -117 308 -211 49 -65 56
             -80 63 -142 9 -73 -8 -82 -40 -20 -65 130 -204 276 -331 350 -50 29 -87 53
             -83 53 4 0 42 -14 83 -30z m-1255 -455 c108 -56 58 -345 -61 -345 -39 0 -42
             11 -6 29 69 35 102 175 57 248 -20 33 -57 50 -87 39 -11 -4 -7 4 10 19 32 29
             47 31 87 10z m-45 -70 c21 -20 25 -34 25 -83 0 -141 -115 -183 -136 -50 -4 21
             -10 35 -15 32 -5 -3 -9 0 -9 5 0 6 4 11 8 11 4 0 14 16 21 35 11 32 53 75 73
             75 5 0 20 -11 33 -25z m2133 1 c34 -18 75 -62 96 -103 15 -29 23 -143 11 -143
             -3 0 -22 11 -43 25 -46 30 -115 55 -153 55 l-29 0 0 -92 c0 -166 46 -308 113
             -348 38 -23 101 -25 137 -5 35 20 38 19 55 -21 78 -188 -49 -335 -279 -322
             -49 3 -104 14 -138 27 -74 28 -156 103 -187 169 l-24 50 36 31 c52 47 95 119
             115 197 9 38 27 85 39 105 24 37 53 136 53 179 1 14 9 50 20 80 11 30 19 72
             20 93 l0 37 65 0 c37 0 78 -6 93 -14z m-498 -36 c22 0 67 -71 101 -160 28 -70
             30 -196 6 -254 -11 -24 -15 -51 -11 -75 5 -29 2 -40 -15 -55 -20 -18 -20 -17
             -36 38 -14 46 -22 58 -48 70 -139 61 -235 98 -312 121 -49 15 -100 31 -113 36
             -13 5 -32 9 -42 9 -18 0 -18 -5 11 -87 17 -49 48 -125 69 -171 l39 -83 -48 7
             c-69 9 -251 -13 -343 -42 -43 -14 -123 -45 -176 -69 -141 -64 -205 -78 -326
             -73 -72 3 -117 11 -157 27 -67 26 -142 89 -169 141 l-19 38 29 81 c18 48 32
             111 35 154 6 69 22 184 31 218 4 15 11 15 67 4 186 -39 295 -49 517 -50 145 0
             250 5 295 13 64 12 70 12 82 -4 12 -17 18 -17 111 5 122 30 242 72 310 112 44
             25 52 33 46 51 -9 29 16 42 34 17 7 -10 22 -19 32 -19z m-1551 -277 c-5 -21
             -26 -93 -48 -161 -45 -137 -87 -220 -104 -203 -6 6 -25 11 -43 11 -27 0 -32 4
             -38 31 -4 24 2 48 29 103 20 39 41 100 48 136 l12 65 42 1 c29 0 52 9 75 27
             18 14 34 26 34 27 1 0 -2 -17 -7 -37z m34 -487 c88 -61 147 -78 277 -84 138
             -5 185 5 359 78 185 78 250 92 416 92 98 0 156 -5 195 -17 116 -34 131 -36
             184 -25 28 5 62 12 76 15 22 4 28 -2 56 -59 l32 -65 -52 -59 c-148 -172 -332
             -264 -650 -323 -144 -27 -408 -36 -543 -19 -288 36 -555 146 -710 293 -52 49
             -130 145 -122 150 2 2 29 1 60 -1 56 -4 57 -5 75 -45 61 -136 369 -337 517
             -337 51 0 62 4 88 29 72 73 -2 211 -113 211 -37 0 -78 -27 -78 -50 0 -18 -16
             -11 -93 39 -110 72 -221 191 -178 191 5 0 27 25 51 56 l42 55 29 -44 c16 -25
             53 -61 82 -81z m-213 -36 c26 -64 233 -230 286 -230 16 0 25 9 33 30 11 34 43
             40 90 16 47 -25 67 -99 35 -130 -81 -81 -487 168 -538 329 -5 18 -2 20 38 17
             38 -3 46 -8 56 -32z m1094 -620 c9 -22 37 -60 62 -85 24 -25 44 -50 44 -54 0
             -12 -37 -21 -82 -21 -33 0 -38 3 -44 28 -6 28 -36 123 -49 155 -6 14 -2 17 22
             17 24 0 32 -7 47 -40z m-794 -386 c0 -6 -9 -19 -20 -29 -11 -10 -26 -38 -32
             -62 -11 -47 -22 -52 -69 -27 -20 10 -38 32 -51 61 -21 47 -19 79 8 120 l14 23
             75 -37 c41 -21 75 -42 75 -49z m1390 -230 c-20 -96 -78 -131 -137 -80 -24 21
             -26 26 -15 50 6 14 20 26 30 26 10 0 42 15 72 33 30 19 57 32 58 31 2 -1 -2
             -28 -8 -60z m-1340 -111 c42 3 92 12 113 20 40 17 42 16 27 -13 -13 -24 -125
             -60 -184 -60 -86 0 -176 41 -176 80 0 15 8 14 73 -8 60 -20 85 -23 147 -19z
             m258 -84 c100 -37 193 -50 333 -50 76 0 153 3 174 7 36 6 36 6 33 -22 -3 -25
             -9 -30 -48 -37 -78 -16 -318 -12 -391 6 -66 16 -163 50 -187 65 -20 13 -4 65
             17 56 9 -3 40 -15 69 -25z m-268 4 c41 2 83 8 93 12 16 7 17 4 11 -21 -11 -48
             -42 -101 -71 -124 -60 -47 -142 12 -177 127 -7 21 -5 21 31 11 21 -6 72 -8
             113 -5z m1141 -69 c6 -24 15 -41 20 -38 5 3 9 -5 9 -17 0 -22 -78 -109 -99
             -109 -18 0 -2 202 18 217 23 16 39 -1 52 -53z m-904 -19 c35 -14 99 -33 142
             -42 l79 -15 -5 -97 c-5 -88 -8 -98 -33 -124 l-27 -29 -64 16 c-35 9 -111 40
             -169 68 -87 44 -106 58 -112 81 -10 43 13 44 100 4 82 -37 154 -61 213 -71
             l37 -6 -2 54 c-1 40 4 59 18 75 27 30 1 27 -29 -4 -22 -21 -31 -49 -26 -77 0
             -5 -3 -8 -7 -8 -24 0 -130 34 -190 61 l-71 31 30 41 c16 22 29 46 29 54 0 19
             15 17 87 -12z m757 -112 l29 21 -6 -44 c-8 -64 -40 -90 -116 -97 l-61 -6 0
             101 c0 71 4 102 13 105 6 3 35 -18 62 -48 l50 -53 29 21z m-316 -289 c44 -6
             52 -10 52 -28 0 -43 21 -94 56 -134 19 -23 33 -46 30 -51 -4 -5 -2 -12 3 -15
             5 -4 13 -2 16 4 4 6 32 23 63 39 31 16 67 41 79 55 13 14 27 26 31 26 12 0 52
             -87 52 -113 0 -59 -95 -137 -168 -137 -33 0 -102 24 -102 35 0 3 6 21 14 40 9
             21 11 37 5 40 -10 7 -29 -36 -29 -66 0 -19 0 -19 -37 0 -56 29 -160 108 -177
             133 -15 24 -21 66 -18 130 3 47 24 54 130 42z m-605 -71 c19 -17 51 -36 71
             -43 32 -10 36 -16 36 -44 0 -18 7 -55 15 -82 8 -27 15 -50 15 -51 0 -1 -14
             -10 -31 -18 -17 -9 -36 -30 -44 -47 l-13 -31 -15 24 c-32 48 -59 124 -73 198
             -15 86 -18 179 -4 145 4 -11 24 -34 43 -51z m312 -9 c-20 -31 -53 -44 -110
             -44 -60 0 -75 8 -75 39 0 45 10 50 105 53 99 3 110 -3 80 -48z m109 -220 c19
             -7 22 -84 6 -131 -14 -40 -49 -55 -140 -61 -88 -5 -147 9 -190 44 -38 32 -39
             67 -3 100 25 23 31 24 107 19 69 -5 86 -3 116 13 36 20 77 26 104 16z"
                    />
                 <path                   d="M1757 3324 c-3 -3 -87 -7 -185 -7 -99 -1 -184 -6 -188 -10 -11 -11
                    15 -27 43 -27 29 0 35 -13 23 -46 -18 -47 -4 -79 43 -100 49 -22 201 -116 223
                      -138 22 -22 28 -20 70 17 52 44 72 97 75 191 3 75 2 79 -24 102 -26 23 -66 31
                     -80 18z"
                   />
                 <path
                   d="M2528 2789 c-15 -4 -75 -12 -132 -18 -160 -18 -266 -37 -359 -65
             -158 -48 -116 -59 105 -26 73 11 178 20 233 20 107 0 151 15 175 60 16 30 9
             38 -22 29z"
                 />
               </g>
                  </svg>    
               </div>
               <div className='justify-between gap-5 flex'>
               <div className='flex flex-col ml-1'>
                  <p className=' text-sm text-gray-700'>
                     Profile
                  </p>
                  <p className=' text-xs text-gray-500'>
                      Customize your profile
                  </p>
               </div>
               <div>
                     
                         <button onClick={handleNavigate} className=' text-xs bg-gray-200 rounded-full text-gray-700 font-semibold py-2 px-3 hover:bg-gray-300 hover:underline'> 
                            Edit Profile
                          </button>
                  
               </div>
               </div>
           </div>
           <br></br>
           <div className='flex flex-row'>
               
               <div className=' ml-7 mt-2'>
                  <svg
               
               fill="currentColor"
               height={20}
               
               viewBox="0 0 20 20"
               width={20}
               xmlns="http://www.w3.org/2000/svg"
             >
               <path d="m19.683 5.252-3.87-3.92a1.128 1.128 0 0 0-.8-.332h-1.55a1.093 1.093 0 0 0-1.1.91 1.9 1.9 0 0 1-3.744 0A1.094 1.094 0 0 0 7.533 1h-1.55c-.3 0-.588.12-.8.332L1.317 5.253a1.1 1.1 0 0 0 .014 1.557l1.87 1.829a1.121 1.121 0 0 0 1.48.076l.32-.24v1.936c.344-.31.786-.49 1.25-.511V5.977L3.993 7.668l-1.68-1.646L6.036 2.25H7.42a3.156 3.156 0 0 0 6.16 0h1.383l3.723 3.772-1.7 1.668-2.236-1.749v8.138c.501.337.927.774 1.25 1.284V8.509l.338.264a1.117 1.117 0 0 0 1.436-.109l1.894-1.853a1.101 1.101 0 0 0 .015-1.559ZM13.691 20H1.31A1.325 1.325 0 0 1 0 18.663v-4.916a1.03 1.03 0 0 1 .5-.884.988.988 0 0 1 .98-.014 3 3 0 0 0 3.3-.266c.334-.342.649-.702.944-1.078a.624.624 0 0 1 .775-.163l6.75 3.5A2.945 2.945 0 0 1 15 17.584v1.079A1.325 1.325 0 0 1 13.691 20Zm-12.44-5.873v4.536c0 .054.033.087.058.087h12.382c.025 0 .06-.033.06-.087v-1.079a1.72 1.72 0 0 0-1.035-1.609l-6.349-3.29a9.24 9.24 0 0 1-.76.831 4.235 4.235 0 0 1-4.357.611Zm4.022 4.042-.9-.862 3.138-3.3.9.862-3.138 3.3Zm3.04 0-.913-.857 2.09-2.219.91.857-2.088 2.219Z" />
                  </svg>
               </div>
               <div className='flex justify-between gap-7'>
               <div className='flex flex-col ml-3'>
                  <p className=' text-sm text-gray-700'>
                  Avatar
                  </p>
                  <p className=' text-xs text-gray-500'>
                  Customize and style
                  </p>
               </div>
               <div>
                 <Link to={'/settings/profile'}> 
                   <button className=' text-xs bg-gray-200 rounded-full text-gray-700 font-semibold py-2 px-3  hover:bg-gray-300 hover:underline'> 
                      Style Avatar
                    </button>
                  </Link>
               </div>
                </div>
           </div>
           <br/>
           <div className='flex flex-row'>
               
               <div className=' ml-6 mt-1'>
               <svg
                  className="w-8 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                 height={24}
                 viewBox="0 0 24 24"
                 strokeWidth={1}
                 stroke="currentColor"
                 fill="none"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                >
                  {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
                </svg>
               </div>
               <div className='flex justify-between gap-2 xl:gap-10'>
               <div className='flex flex-col ml-2 '>
                  <p className=' text-sm text-gray-700'>
                  Moderation
                  </p>
                  <p className=' text-xs text-gray-500'>
                  Moderation Tools
                  </p>
               </div>
               <div>
                <Link to={'/settings/profile'}>    
                   <button className=' text-xs bg-gray-200 rounded-full text-gray-700 font-semibold p-2 hover:bg-gray-300 hover:underline'> 
                      Mod Settings
                   </button> 
                 </Link>
            
               </div>
              </div>

          
           </div>

        </div>
        
        <hr className="h-px m-3 mb-5 bg-gray-200 border-0 dark:bg-gray-700"/>
        <h1 className=" ml-6 mb-4 text-xs text-gray-600 "> LINKS </h1>  
        <div className='ml-6 '>
                     
            <button onClick={handleNavigate} className='flex flex-row text-xs bg-gray-200 rounded-full text-gray-700 font-semibold py-2 px-3 hover:bg-gray-300 hover:underline'> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
               <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
               </svg>
              <p> Add social link </p>
            </button>
 
        </div>
        <hr className="h-px m-3 mb-5 bg-gray-200 border-0 dark:bg-gray-700"/>
        <div className='ml-6 '>
         <h1 className="mx-3 mb-4 text-xs text-gray-500 font-semibold">YOU'RE A MODERATOR OF THESE COMMUNITIES</h1>
        </div> 
        <div className='flex flex-col hover:bg-gray-100 h-12'>
      {communities.map((community, index) => (
        <a
          key={index}
          onClick={() => handleClick(community.name)}
          className='flex flex-row w-full justify-between hover:bg-gray-100'
        >
          <div className='flex flex-row space-x-3 ml-6 my-3'>
            <img src={community.icon} alt={community.name} className="w-7 h-7" />
            <div className='flex flex-col'>
              <div className='flex flex-row'>
                <div className='flex flex-row'>
                  <span className='text-xs'>r/{community.name}</span>
                </div>
              </div>
              <span className='text-xs text-gray-400'>{community.memberCount} members</span>
            </div>
          </div>
          <div>
            <button className='py-1 my-3 mr-6 border border-gray-300 rounded-2xl flex flex-row bg-gray-300 w-[55px] h-7 px-2 text-black text-xs font-semibold'>Joined</button>
          </div>
        </a>
      ))}
    </div>

     </div>
    )
}
 