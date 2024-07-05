/**
 * This file represents the CommunityPage component.
 * It displays a community page with posts, sorting options, and community information.
 * The component uses React Router for routing and axios for making HTTP requests.
 * It also utilizes React Query for data fetching and state management.
 * The component is wrapped in a CommunityProvider component that provides the selected sorting and period values.
 * @file FILEPATH
 */
import React, { useContext, createContext, useState, useRef, useCallback, useEffect } from "react";
import Sortmenu from "@/GeneralComponents/sortmenu/sortmenu";
import PeriodSelect from "@/GeneralComponents/PeriodSelect/PeriodSelect";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import UserPostComponent from "@/Features/Core/ProfilePages/pages/extras/userPost";
import { Plus, Pen } from 'lucide-react';
import OptionsMenu from "./accessories/optionsmenu";
import MainFooter from "./footers/mainFooter";
import LoginFirtstModal from "./accessories/loginFirstModal";
import BackToTop from "@/GeneralComponents/backToTop/backToTop";
import { useQuery } from "react-query";
import { userAxios } from "../../../Utils/UserAxios";
import { toast } from 'react-toastify';
import EditModal from "./accessories/editBanner";
import KickOutModal from "./accessories/kickOutModal";
import { useSelector } from "react-redux";
import ModCard from "./ModCard/ModCard";
import { set } from "zod";
import Spinner from '@/GeneralElements/Spinner/Spinner';


//helping functions for the notifications frequency and options menu

export const CommunityContext = createContext({
  selected: "New",
  setselected: (selected) => { },
  period: "All time",
  setperiod: (period) => { },
});

// Create a provider component that holds the state
export function CommunityProvider({ children }) {
  const [selected, setselected] = useState("New");
  const [period, setperiod] = useState("All time");

  return (
    <CommunityContext.Provider value={{ selected, setselected, period, setperiod }}>
      {children}
    </CommunityContext.Provider>
  );
}


export default function CommunityPage() {
  const { community } = useParams();                  // get the community name from the url
  const path = useLocation();                          // get the current path
  const { period, selected } = useContext(CommunityContext);  // get the selected sorting and period
  const [Posts, setPosts] = useState([]);              // store the Posts data
  const user = useSelector(state => state.user.user);            // get the user data
  const [showModal, setShowModal] = useState(false);
  const navigator = useNavigate();
  const loadMoreButtonRef = useRef(null);
  const [callingposts, setCallingPosts] = useState(false);
  const [pagedone, setpagedone] = useState(false);
  const limitpage = 5;
  const [currentpage, setcurrentpage] = useState(2);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState(false);
  const [commObj, setComm] = useState(null);
  const [editIcon, setEditIcon] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editComponent, setEditComponent] = useState("Banner");
  const [showKickOut, setShowKickOut] = useState(false);
  const [joining, setJoining] = useState(false);
  const searchRedux = useSelector(state => state.search);
  const [firstDone, setFirstDone] = useState(false);
  //to fetch the community data from the server and use them
  useEffect(() => {
    const fetchCommunity = async () => {
      let tempIcon;
      setLoading(true);
      setFirstDone(false);
      if (user == null) {
        await userAxios.get(`/${community}`)
          .then((response) => {

            let recent = JSON.parse(localStorage.getItem('recentCommunities')) ?? [];
            if (!(recent.includes(community))) {
              if (recent.length < 5) {
                recent = [...recent, community];
              } else {
                recent = [...recent.slice(1), community];
              }
            }
            localStorage.setItem('recentCommunities', JSON.stringify(recent));

            const newcomm = {
              id: response.data.community._id,
              name: response.data.community.name,
              icon: response.data.community.icon,
              backimage: response.data.community.banner,
              rules: response.data.community.communityRules,
              membersCount: response.data.community.membersCnt,
              onlineMembers: 0,
              joined: false,
              modded: false,
              favourited: false,
              type: response.data.community.privacyType
            }
            tempIcon = response.data.community.icon;
            setComm(newcomm);
            if (newcomm.type == "private") {
              setShowKickOut(true);
            }
            localStorage.setItem(`comm${community}Storage`, JSON.stringify({ data: newcomm, loggedIn: false }));
          })
          .catch(error => {

            console.error('There was an error!', error);
            toast.error("this community doesn't seem to exist, try again");
            navigator("/404");
          })
      }
      else {
        let joinedComms = 0;
        await userAxios.get(`/subreddits/mine/member`)
          .then((response) => {
            let recent = JSON.parse(localStorage.getItem('recentCommunities')) ?? [];
            if (!(recent.includes(community))) {
              if (recent.length < 5) {
                recent = [...recent, community];
              } else {
                recent = [...recent.slice(1), community];
              }
            }
            localStorage.setItem('recentCommunities', JSON.stringify(recent));
            const joins = response?.data?.communities?.map((join) => join.name);
            joinedComms = joins;
          })
          .catch(error => {
            console.error("cant fetch communitites", error);
          })

        let moddedComms = 0;
        await userAxios.get(`/subreddits/mine/moderator`)
          .then((response) => {
            const mods = response?.data?.communities?.map((mod) => mod.name);
            moddedComms = mods;
          })
          .catch(error => {
            console.error("can't fetch modded", error)
          })

        let favComms = 0;
        await userAxios.get('/subreddits/mine/favorite')
          .then((response) => {
            const favs = response?.data?.communties?.map((fav) => fav.name);
            favComms = favs;
          })
          .catch(error => {
            console.error("can't fetch favs", error);
          })


        await userAxios.get(`/${community}`)
          .then((response) => {
            const newcomm = {
              id: response.data.community._id,
              name: response.data.community.name,
              icon: response.data.community.icon,
              backimage: response.data.community.banner,
              rules: response.data.community.communityRules,
              membersCount: response.data.community.membersCnt,
              onlineMembers: 0,
              joined: joinedComms.includes(response.data.community.name),
              modded: moddedComms.includes(response.data.community.name),
              favourited: favComms.includes(response.data.community.name),
              type: response.data.community.privacyType,
              muted: response.data.community.muted
            }
            tempIcon = response.data.community.icon;
            setComm(newcomm);
            if (newcomm.type == "Private" && !joinedComms.includes(newcomm.name)) {
              setShowKickOut(true);
            }
            localStorage.setItem(`comm${community}Storage`, JSON.stringify({ data: newcomm, loggedIn: true }));
          })
          .catch(error => {
            console.error('There was an error!', error);
            toast.error("this community doesn't seem to exist, try again");
            navigator("/404");
          })
      }
      let link = `api/listing/posts/r/${community}/best?page=1&limit=${limitpage}&count=0&startDate=1970-01-01T00%3A00%3A00Z&endDate=2099-12-31T23%3A59%3A59Z`;
      if (selected == 'Top') {
        link = link + `&t=${period}`;
      }
      await userAxios.get(link)
        .then((response) => {
          if (response.data.length > 0) {
            setpagedone(true);
          }
          const newPosts = response.data.map(post => ({
            communityName: post.username,
            communityIcon: tempIcon,
            images: post.attachments,
            postId: post._id,
            title: post.title,
            textHTML: post.textHTML,
            votesCount: post.votesCount,
            comments: post.commentsCount,
            thumbnail: post.thumbnail,
            video: null,
            type: "post",
            spoiler: post.spoiler,
            NSFW: post.nsfw,
            poll: post.poll ? post.poll : []
          }));
          setcurrentpage(2);
          setPosts(newPosts);
        })
        .catch(error => {
          console.error('There was an error!', error);
        })
      setFeed(false);
      setFirstDone(true);
      setLoading(false);
    };
    fetchCommunity();
  }, [community]);

  useEffect(() => {
    fetchInitialPosts();
  }, [selected, period, searchRedux]);

  const fetchInitialPosts = async () => {
    if (searchRedux == "") { return}
    setFeed(true);
      await userAxios.get(`r/${commObj.name}/search/?q=${searchRedux}&type=link&sort=${selected}&page=1&limit=${limitpage}`)
        .then((response) => {
          if (response.data.subredditSearchPosts.length < limitpage) {
            setpagedone(true);
          }
          const newPosts = response.data.subredditSearchPosts.map(post => ({
            communityName: post.username,
            communityIcon: commObj.icon,
            images: post.attachments,
            postId: post.postId,
            title: post.title,
            textHTML: post.textHTML,
            votesCount: post.votesCount,
            commentsNum: post.commentsNum,
            thumbnail: post.attachments[0],
            video: null,
            type: "post",
            spoiler: post.spoiler,
            NSFW: post.nsfw,
            poll: post.poll ? post.poll : []
          }));
          setPosts(newPosts);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      setFeed(false);
  };

  const swtichJoinState = async () => {
    setJoining(true);
    if (user == null) {
      setShowModal(true);
      return;
    }
    const subStatus = commObj.joined ? "unsubscribe" : "subscribe";
    await userAxios.post(`/${commObj.name}/api/${subStatus}`)
      .then(() => {
        setComm({ ...commObj, joined: !commObj.joined });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    setJoining(false);
  }

  const CreatePostHandle = () => {
    if (user == null) {
      setShowModal(true);
      return;
    }
    navigator('/submit');
  }

  const fetchMorePosts = () => {
    setCallingPosts(true);
    if (searchRedux == "") {
      let link = `api/listing/posts/r/${commObj.name}/${selected.toLocaleLowerCase()}?page=${currentpage}&limit=${limitpage}&count=0&start=0&startDate=1970-01-01T00%3A00%3A00Z&endDate=2099-12-31T23%3A59%3A59Z`;
      if (selected == 'Top') {
        link = link + `&t=${period}`;
      }
      userAxios.get(link)
        .then(response => {
          if (response.data.length < limitpage) {
            setpagedone(true);
          }
          const newPosts = response.data.posts.map(post => ({
            communityName: post.coummunityName,
            communityIcon: commObj.icon,
            images: post.attachments,
            postId: post._id,
            title: post.title,
            textHTML: post.textHTML,
            votesCount: post.votesCount,
            comments: post.commentsCount,
            thumbnail: post.thumbnail,
            video: null,
            type: "post",
            spoiler: post.spoiler,
            NSFW: post.nsfw,
            poll: post.poll ? post.poll : []
          }));

          setPosts(prevPosts => [...prevPosts, ...newPosts]);
          setCallingPosts(false);
          setcurrentpage(1 + currentpage);

        })
        .catch(error => {
          console.error('Error:', error);
          setCallingPosts(false);
        });
    }
    else {
      userAxios.get(`r/${commObj.name}/search/?q=${searchRedux}&type=link&sort=${selected}&page=${currentpage}&limit=${limitpage}`)
        .then((response) => {
          if (response.data.subredditSearchPosts.length < limitpage) {
            setpagedone(true);
          }
          const newPosts = response.data.subredditSearchPosts.map(post => ({
            communityName: post.username,
            communityIcon: commObj.icon,
            images: post.attachments,
            postId: post.postId,
            title: post.title,
            textHTML: post.textHTML,
            votesCount: post.votesCount,
            commentsNum: post.commentsNum,
            thumbnail: post.attachments[0],
            video: null,
            type: "post",
            spoiler: post.spoiler,
            NSFW: post.nsfw,
            poll: post.poll ? post.poll : []
          }));
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
          setCallingPosts(false);
          setcurrentpage(1 + currentpage);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  };

  const handleEditComponents = (value) => {
    setEditComponent(value);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div role="communitypage" className="w-full h-full flex flex-col items-center ">
        <img src={'/logo.png'} className="h-20 w-20 mt-48 mx-auto animate-ping" alt="Logo" />
      </div>
    )
  }

  if (path.pathname.includes(`/info`)) {
    return (
      <div role="communitypage" className={`flex-initial mx-0 -mt-4 md:w-[80%] w-full md:mx-auto relative`}>
        {commObj.modded ? <ModCard></ModCard> : <MainFooter comm={commObj} />}
      </div>
    )
  }


  return (
    <div role="communitypage" className={`flex-initial mx-0 -mt-4 md:w-[80%] w-full md:mx-auto relative`}>
      {showModal && <LoginFirtstModal onClose={setShowModal} />}
      {showEditModal && <EditModal onClose={setShowEditModal} optionheader={editComponent} />}
      {showKickOut && <KickOutModal></KickOutModal>}
      <BackToTop />
      {/* background image of the community */}
      <img src={commObj.backimage} alt='community' className={`w-full md:mx-auto h-20 md:h-36 object-cover rounded-lg`} />
      {commObj.modded && <button id="bannerEditPen" className={`absolute md:right-6 right-3 hover:bg-gray-700 p-2 rounded-full text-white top-12 md:top-[100px]`} onClick={() => handleEditComponents("Banner")}>
        <Pen className={`md:w-5 md:h-5 w-3 h-3`} />
      </button>}
      {/* community name and (members count in mobile mode)*/}
      <div className='w-full relative flex justify-between items-center md:m-3'>
        <div>
          <img id="iconEditPen" src={commObj.icon} alt='community' className={`${commObj.modded ? 'hover:brightness-50' : ''} object-cover absolute object-fit md:-top-16 -top-2 md:w-24 w-12 md:h-24 h-12 rounded-full`} onMouseEnter={() => setEditIcon(true)} onMouseLeave={() => setEditIcon(false)} onClick={commObj.modded ? () => handleEditComponents("Avatar") : undefined} />
          {editIcon && commObj.modded ? <Pen className={`absolute md:-top-5 md:left-10 text-white left-8 top-5 md:w-4 md:h-4 w-2 h-2`} /> : <></>}
          <span className='absolute  md:top-10 top-0 md:left-0 left-16 md:text-3xl text-lg font-bold'>r/{commObj.name}</span>
          <div className='absolute md:top-10 top-[28px] md:left-28 left-16 md:hidden text-xs font-semibold text-gray-500 flex flex-wrap gap-x-3'>
            <div>{commObj.membersCount} members</div>
            <div>{commObj.onlineMembers} online</div>
          </div>
        </div>

        {/* create post, bell and options menu in desktop mode */}
        <div className='hidden mr-6 md:flex md:gap-2 md:justify-between'>
          <button id="commCreatePost" role="createPostButton" className={`rounded-full flex gap-1 justify-center border border-gray-600 w-fit px-4 h-10 items-center hover:border-black`} onClick={CreatePostHandle}>
            <Plus className="w-4 h-4" />
            <span className='inline font-bold text-sm'>Create a post</span>
          </button>
          {commObj.modded ? (
            <Link to={`./about/rules`} id="modTools" role="modToolsButton" className={`rounded-full w-fit px-4 py-2 h-fit items-center hover:bg-blue-700 bg-blue-600`}>
              <span className={`inline font-bold text-sm text-white`}>Mod tools</span>
            </Link>
          ) : (
            <button id="joinComm" role="joinButton" className={`rounded-full w-fit px-4 h-10 items-center  ${commObj.joined ? 'border-gray-700 border-[1px] hover:border-black' : 'hover:bg-blue-600 bg-blue-700'}`} onClick={() => swtichJoinState()}>
              {joining ? <Spinner></Spinner> : <span className={`inline font-bold text-sm ${commObj.joined ? 'text-black' : 'text-white'}`}>{commObj.joined ? 'Joined' : 'Join'}</span>}
            </button>)}
          <OptionsMenu comm={commObj} setComm={setComm} />
        </div>
      </div>

      {/* create post, bell and options menu in mobile mode */}
      <div className='flex gap-2 md:justify-between ml-3 mr-6 md:hidden mt-[62px]'>
        <button id="commCreatePost" role="createPostButton" className={`rounded-full flex gap-1 justify-center border border-gray-600 w-fit px-4 h-10 items-center hover:border-black`} onClick={CreatePostHandle}>
          <Plus className="w-4 h-4" />
          <span className='inline font-bold text-sm'>Create a post</span>
        </button>
        {commObj.modded ? (
          <Link to={`./about/rules`} id="modTools" role="modToolsButton" className={`rounded-full w-fit px-4 py-2 items-center hover:bg-blue-700 bg-blue-600`}>
            <span className={`inline font-bold text-sm text-white`}>Mod tools</span>
          </Link>
        ) : (
          <button id="joinComm" role="joinButton" className={`rounded-full w-fit px-4 h-10 items-center  ${commObj.joined ? 'border-gray-700 border-[1px] hover:border-black' : 'hover:bg-blue-600 bg-blue-700'}`} onClick={() => swtichJoinState()}>
            {joining ? <Spinner></Spinner> : <span className={`inline font-bold text-sm ${commObj.joined ? 'text-black' : 'text-white'}`}>{commObj.joined ? 'Joined' : 'Join'}</span>}
          </button>)}
        <OptionsMenu comm={commObj} setComm={setComm} />
      </div>

      {/* the feed with its sort elements and the community description and rules and other tools on the right*/}
      <div className='gap-3 flex'>

        {/* the feed and the sort elements (buttons for feed and about page traversal in mobile mode)*/}
        <div className='min-w-[70%] w-screen md:w-[75%] flex-initial gap-3'>
          <br />
          <div className='flex justify-between md:justify-end'>

            {/* page buttons for mobile mode*/}
            <div className='flex gap-2 md:hidden'>
              <Link id="toCommFeed" to={`/r/${commObj.name}`} className={`rounded-full font-sans text-sm font-semibold w-fit px-4 py-2 h-fit ${path.pathname == `/r/${encodeURIComponent(community)}` ? "bg-gray-300" : "bg-white"}`} >feed</Link>
              <Link id="toCommAbout" to={`/r/${commObj.name}/info`} className={`rounded-full font-sans text-sm font-semibold w-fit px-4 py-2 h-fit ${path.pathname == `/r/${encodeURIComponent(community)}/info` ? "bg-gray-300" : "bg-white"}`} >about</Link>
            </div>

            {/* sort elements for the feed*/}
            <div className='flex gap-2'>
              <Sortmenu context={CommunityContext} />
              <PeriodSelect appearance={selected} context={CommunityContext} />
            </div>
          </div>
          <hr className="w-full border-1 border-gray-300 mt-2" />

          {/* the feed of the community*/}
          {!feed ? (<div role="communityFeed" className="flex flex-col md:w-full w-full h-fit my-4 items-center">
            {/* if there are no Posts, show no results */}
            {Posts.length > 0 ? (
              <>
                {Posts.map((post, index) => (
                  <UserPostComponent key={index} post={post} />
                ))}
                {!pagedone && !callingposts && (<button id="loadMoreButton" ref={loadMoreButtonRef} type="button" onClick={fetchMorePosts} className="w-fit h-fit my-2 px-3 py-2 bg-gray-200 shadow-inner rounded-full transition transform hover:scale-110">Load more</button>)}
                {callingposts && (<img src={'/logo.png'} className="h-6 w-6 mx-auto animate-ping" alt="Logo" />)}
              </>
            ) : (
              <>{/*no results view*/}
                <p className="text-xl font-bold text-center mt-2">This community doesn't have any Posts yet</p>
                <p className="text-md font-semibold text-center mb-3">Make one and get this feed started.</p>
                <button id="noDataCreatePost" role="createPostButton" className={`rounded-full text-white flex gap-1 justify-center bg-blue-600 w-fit px-4 h-10 items-center hover:bg-blue-700`} onClick={CreatePostHandle}>
                  <Plus className="w-4 h-4" />
                  <span className='inline font-bold text-sm'>Create a post</span>
                </button>
              </>
            )}</div>
          ) : (
            <div className="w-100 h-100 flex flex-col items-center justify-center">
              <img src={'/logo.png'} className="h-12 mt-24 w-12 mx-auto animate-ping" alt="Logo" />
            </div>
          )}
        </div>
        {commObj.modded ? <ModCard></ModCard> : <MainFooter comm={commObj} />}
      </div>
    </div>
  )
}