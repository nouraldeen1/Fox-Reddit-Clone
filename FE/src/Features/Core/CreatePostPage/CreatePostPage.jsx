import React, { useState, useEffect } from 'react'
import TypingArea from './TypingArea'
import ChooseCommunity from './ChooseCommunity'
import "./QuillStyle.css"
import { toast } from 'react-toastify'
import { userAxios } from "@/Utils/UserAxios";
import 'react-toastify/dist/ReactToastify.css';
import { userStore } from '../../../hooks/UserRedux/UserStore';
import { ChevronUp, ChevronDown } from "lucide-react"

function CreatePostPage(props) {
    const store = userStore.getState().user.user;
    const [SelectedCom, setSelectedCom] = useState({ name: "Choose Community", id: "-1" }); //
    const [ComHasRules, setComHasRules] = useState(false);
    const [ShowComCard, setShowComCard] = useState(false);
    //poll options to be one array before sent to back 
    const [Poll1, setPoll1] = useState("");
    const [Poll2, setPoll2] = useState("");
    const [Poll3, setPoll3] = useState([]);

    const [TitleValue, setTitleValue] = useState('');
    const [PostText, setPostText] = useState('');
    const [PostURL, setPostURL] = useState('');
    const [NSFW, setNSFW] = useState(false);
    const [Spoiler, setSpoiler] = useState(false);
    const [PostNotifications, setPostNotifications] = useState(false);
    const [VideoOrImageSrc, setVideoOrImageSrc] = useState([]);
    const [PollOptions, setPollOptions] = useState([]);
    const [VoteLength, setVoteLength] = useState(1);
    const [imageOrVideo, setimageOrVideo] = useState(null);
    const [height, setHeight] = useState(window.innerHeight);
    const [imageFile, setimageFile] = useState(null);
    const [load, setload] = useState(false);
    const [Rules, setRules] = useState([]);
    const [ShowExpand, setShowExpand] = useState(Array(Rules.length).fill(false));
    // Call update function when any of the state variables change
    useEffect(() => {
        updatePollOptions();
    }, [Poll1, Poll2, Poll3]);

    useEffect(() => {
        getRules();
        if (SelectedCom.rules)
            setComHasRules(true)
        else
            setComHasRules(false);

        if (SelectedCom.name === "Choose Community")
            setShowComCard(false);
        else
            setShowComCard(true);

    }, [SelectedCom])

    const updatePollOptions = () => {
        let newOptions = [];
        if (Poll1) newOptions.push(Poll1);
        if (Poll2) newOptions.push(Poll2);
        Poll3.forEach(option => {
            if (option.value) newOptions.push(option.value);
        });
        setPollOptions(newOptions);
    };

    const getRules = async () => {
        if (SelectedCom && SelectedCom.name !== store.name &&
            SelectedCom.name !== "Choose Community") {
            try {
                const res = await userAxios.get(`${SelectedCom.name}/api/rules`)
                console.log(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        else setRules([]);
    }

    const uploadImage = async (file) => {
        let imageOrVideo;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'postImageOrVideo');
        if (file.startsWith('data:image/')) {
            imageOrVideo = 'image'
        } else if (file.startsWith('data:video/')) {
            imageOrVideo = 'video'
        }
        if (imageOrVideo) {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dtl7z245k/${imageOrVideo}/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data.secure_url; // This will be the shorter URL
        }
        else
            return '';

    };

    const Post = async () => {
        setload(true);
        if (PostNotifications === "on")
            setPostNotifications(true);

        let imageUrl = [];
        for (let index = 0; index < VideoOrImageSrc.length; index++) {
            imageUrl.push(await uploadImage(VideoOrImageSrc[index]));
        }
        let NewPost;

        if (SelectedCom.name === store.username) {
            NewPost = {
                title: TitleValue,
                text: PostText + '' + PostURL, spoiler: Spoiler,
                nsfw: NSFW, poll: PollOptions, attachments: imageUrl,
                createdAt: new Date()
            }
        }
        else {
            NewPost = {
                title: TitleValue,
                text: PostText + '' + PostURL, spoiler: Spoiler,
                nsfw: NSFW, poll: PollOptions, attachments: imageUrl,
                Communityname: SelectedCom.name,
                createdAt: new Date()
            }
        }
        console.log(NewPost)
        try {
            const res = userAxios.post('api/submit', NewPost)
            console.log(res)
            setload(false);
            toast.success("Post created successfully \u{1F60A}");
        } catch (error) {
            if (ex.issues != null && ex.issues.length != 0) {
                toast.error(ex.issues[0].message);
                setload(false);
            }
        }
    }

    const toggleExpand = (index) => {
        setShowExpand(prevState => {
            let newState = [...prevState];
            newState[index] = !newState[index];
            console.log(newState);
            return newState;
        });
    };


    return (
        <div className='bg-gray-300 min-h-[100vh] h-max ' id="parentElement"  >
            <div className='flex'>
                <div className='lg:w-[60%] w-full md:ml-40  '>
                    <div className='h-12'></div>
                    <p className='text-xl m-1 '>Create a post</p>
                    <hr className='lg:my-4' />
                    <ChooseCommunity
                        Selected={SelectedCom} setSelected={setSelectedCom}
                        id="ChooseCom" />
                    <TypingArea load={load} setimageFile={setimageFile}
                        PostFunc={Post} imageOrVideo={setimageOrVideo}
                        Poll3={Poll3} SetPoll3={setPoll3}
                        VoteLength={VoteLength} SetVoteLength={setVoteLength}
                        Poll1={Poll1} SetPoll1={setPoll1} Poll2={Poll2} SetPoll2={setPoll2}
                        VideoOrImageSrc={VideoOrImageSrc} SetVideoOrImageSrc={setVideoOrImageSrc}
                        PostNotifications={PostNotifications} SetPostNotifications={setPostNotifications}
                        Spoiler={Spoiler} SetSpoiler={setSpoiler}
                        NFSW={NSFW} SetNFSW={setNSFW}
                        PostURL={PostURL} SetPostURL={setPostURL}
                        PostTitle={TitleValue} SetPostTitle={setTitleValue}
                        PostText={PostText} SetPostText={setPostText} SelectedCom={SelectedCom}
                        className="h-96" id="TypeArea" />
                </div>
                <div className=' LeSS:hidden mt-16 m-2 w-0 md:block md:w-80'>
                    <div className='bg-white rounded my-2'>

                        {Rules.length > 0 &&
                            <>
                                <div className='bg-orange-700 px-4 my-1 rounded text-white w-full h-max'>
                                    {SelectedCom.name} Rules
                                </div>
                                {Rules.map((item, index) => (
                                    <div key={index} className='px-2'>
                                        <div className='flex'>
                                            <p className='my-1 text-lg min-w-max 
                           '>{index + 1} . {item.title}</p>
                                            <div className='w-[100%]'></div>
                                            {ShowExpand[index] && <><ChevronUp onClick={() => {
                                                toggleExpand(index)
                                            }}
                                                strokeWidth={1}
                                                size={20}
                                                className='mr-4 my-2 hover:cursor-pointer' />
                                            </>}
                                            {!ShowExpand[index] && <ChevronDown onClick={() => {
                                                toggleExpand(index)
                                            }}
                                                strokeWidth={1}
                                                size={20}
                                                className='mr-4 my-2' />}
                                        </div>
                                        {ShowExpand[index] && <div className=' text-sm px-3 p-1'>
                                            {item.description}
                                        </div>}
                                        <hr className='w-[90%] mx-4 mb-1' />
                                    </div>
                                ))} </>}
                    </div>
                    <div className='bg-white p-4 h-max rounded '>
                        <div className='flex'>

                            <img src="logo.png" alt='logo' className='h-8 w-8 mx-2' />
                            <p className='my-1 text-lg font-bold
                            '> Posting to Fox</p>
                        </div>
                        <hr className='w-[90%] mx-4' />
                        <p className='my-1 text-lg 
                            '> 1. Remember the human</p>
                        <hr className='w-[90%] mx-4' />
                        <p className='my-1 text-lg 
                           '> 2. Behave like you would in real life</p>
                        <hr className='w-[90%] mx-4' />
                        <p className='my-1 text-lg 
                            '> 3. Look for the original source of content</p>
                        <hr className='w-[90%] mx-4' />
                        <p className='my-1 text-lg 
                           '> 4. Search for duplicates before posting</p>
                        <hr className='w-[90%] mx-4' />
                        <p className='my-1 text-lg 
                           '> 5. Read the community’s rules</p>
                        <hr className='w-[90%] mx-4' />
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CreatePostPage