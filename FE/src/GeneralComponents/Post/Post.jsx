import parse from 'html-react-parser';
import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle, ArrowUpCircle, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { userAxios } from "@/Utils/UserAxios";
import { toast } from 'react-toastify'
import { userStore } from "../../hooks/UserRedux/UserStore";
import axios from 'axios';
function PollComponent({ polls, postId }) {
    const [poll, setPolls] = useState(polls ?? []);

    console.log({ pollsssssssssss: polls });
    if (polls?.length == 0 || polls == null) return <></>;
    const handelVote = async () => {
        const val = document.getElementById(`poll-option-${postId}`).value;

        if (val == null || val == "") return;
        const id = toast.loading("Please wait");
        try {
            const res = await userAxios.post(`/api/posts/${postId}/poll`, {
                choice: val,
            });
            setPolls(res.data)
        } catch (ex) { }
        toast.dismiss(id);
    };
    return <div className='flex border rounded-lg my-4 w-full p-4 space-y-4 flex-col'>
        {
            poll.map((e, idx) => {
                console.log({ eeeeeeee: e });
                return <div key={idx} className='flex items-center gap-1'>
                    <input name={`poll-${postId}`} id={`poll-option-${postId}`} type='radio' defaultValue={e.title} />
                    <label>{e.title} ({e.votes})</label>
                </div>;
            })
        }
        <div>
            <button id="vote-btn" onClick={handelVote} className='px-4 py-2 rounded-full bg-gray-300 '>Vote</button>
        </div>
    </div>
}

export default function PostComponent({ refetch, role, post, className, viewMode = false }) {
    const [isSpoiler, setSpoiler] = useState(post?.post?.spoiler ?? post?.spoiler ?? false);
    const user = userStore.getState().user.user;
    const params = useParams();
    const [voteType, setVotesType] = useState(null);
    useEffect(() => {
        try {
            const votesArr = post?.votes ?? [];
            for (const x of votesArr) {
                if (x.userID == user._id) {
                    setVotesType(x.type);
                    break;
                }
            }
        } catch (ex) {

        }
        console.log('object');
    }, [voteType]);
    post.votes = post.votes ?? 0;
    // const images = [post.thumbnail, ...post.images];
    const [postObj, setPost] = useState(post?.post ?? post);

    const vote = async (upvote) => {
        const id = toast.loading('Please wait');
        try {
            const res = await userAxios.post('/api/postvote', {
                postID: postObj.postId ?? params.id,
                type: upvote ? 1 : -1,
            });
            setPost(prev => { return { ...prev, votesCount: res.data.value } })
            setVotesType(upvote ? 1 : -1)
        } catch (ex) { }

        toast.dismiss(id);

        // setVotes(res.data.votesCount);
    };

    return (
        <div role={role} className={` p-4 w-full ${!viewMode ? "hover:bg-gray-50" : ""} rounded-md ${className}`}>


            {
                !viewMode ?
                    <div className="flex flex-col items-start justify-between">
                        <Link to={`/r/${postObj?.communityName}`}>
                            <div>
                                <div className="mb-4 flex items-center gap-4">
                                    <img src={postObj?.communityIcon} alt="image" className="w-9 h-9 rounded-full" />
                                    <h5 className=" text-sm ">r/{postObj.communityName}</h5>
                                </div>
                            </div>
                        </Link>
                       
                        <Link className="w-full" to={`/posts/${postObj.postId}`}>
                            <h2 className="mb-2 text-xl font-bold">{postObj.title} </h2>
                            <div className='asdasd' dangerouslySetInnerHTML={{ __html: post.textHTML }} />
                            {/* <p className=" text-gray-600 text-sm">{parse(post.textHTML)} </p> */}
                            <div

                                className=" rounded-lg my-4 w-full bg-gray-600">
                                {
                                    postObj.attachments?.length != null && postObj.attachments?.length != 0 &&
                                    <img
                                        onClick={() => {
                                            if (postObj.spoiler) {
                                                setSpoiler(!isSpoiler);
                                            }
                                        }}
                                        style={{ filter: isSpoiler ? 'blur(10px)' : "" }}
                                        className="mx-auto max-h-[600px] lg:max-w-[800px] w-full rounded-lg my-4"
                                        alt=""
                                        src={postObj.attachments[0]} />
                                }
                            </div>
                        </Link>
                        <PollComponent postId={postObj.postId ?? params.id} polls={post?.poll} />
                    </div> :

                    <div>
                        {
                            postObj.isDeleted && <p>Post is deleted</p>
                        }
                        {
                            !postObj.isDeleted && <>
                                <h2 className="mb-2 text-xl font-bold">{postObj.title} </h2>
                                <p className=" text-gray-600 text-sm mb-4">{postObj.description} </p>
                                <div className='asdasd' dangerouslySetInnerHTML={{ __html: post.textHTML }} />
                            </>
                        }
                        <PollComponent polls={postObj?.poll} postId={postObj.postId ?? params.id} />
                        {
                            postObj?.video && <div>
                                <video src={postObj.video} controls />
                            </div>
                        }
                        {(postObj?.attachments?.length != null && postObj?.attachments?.length != 0) &&
                            <div
                                onClick={() => {
                                    if (postObj.spoiler) {
                                        setSpoiler(!isSpoiler);
                                    }
                                }}
                                style={{ filter: isSpoiler ? 'blur(10px)' : "" }}
                                className=" max-w-[700px]">
                                <ImageGallery

                                    showBullets={postObj.attachments.length > 1}
                                    renderLeftNav={(onClick, disabled) => (
                                        <button id="arrow-circle-btnn" className=" absolute z-20 top-[50%] ml-4" onClick={onClick} disabled={disabled} >
                                            <ArrowLeftCircle className=" text-white" />
                                        </button>
                                    )}
                                    renderRightNav={(onClick, disabled) => (
                                        <button id="arrow-circle-btsssssssnn" className=" absolute z-20 top-[50%] right-4" onClick={onClick} disabled={disabled} >
                                            <ArrowRightCircle className=" text-white" />
                                        </button>
                                    )}
                                    showThumbnails={false} showPlayButton={false} showFullscreenButton={false} items={postObj.attachments.map((e, idx) => {
                                        return {
                                            original: e,
                                            thumbnail: e,
                                        };
                                    })} />
                            </div>
                        }
                    </div>
            }

            <div className="flex flex-row mt-4 items-center gap-4">
                <div className="flex bg-gray-100 gap-3 items-center rounded-[80px] px-3 py-2">
                    <ArrowUpCircle onClick={() => vote(true)} className={`w-5 h-5 cursor-pointer ${voteType == 1 ? " text-blue-600" : ""}`} />
                    <p>{postObj.votesCount ?? 0}</p>
                    <ArrowDownCircle onClick={() => vote(false)} className={`w-5 h-5 cursor-pointer ${voteType == -1 ? " text-blue-600" : ""}`} />
                </div>
                {!viewMode && <div className="flex bg-gray-100 gap-1 items-center rounded-[80px] px-3 py-2">
                    <Link className="flex items-center gap-2" to={viewMode ? null : `/posts/${postObj.postId}`}>
                        <MessageCircle className="w-5 h-5 cursor-pointer" />
                        <p>{postObj.commentsNum}</p>
                    </Link>
                    <p>{postObj.comments}</p>
                </div>}
            </div>
        </div>
    )
}
