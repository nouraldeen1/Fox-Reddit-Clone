/**
 * Renders the PeopleSearchPage component.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.searched - The search query.
 * @returns {JSX.Element} The rendered PeopleSearchPage component.
 */
import React from "react";
import { useState, useEffect, useRef } from "react";
import UserComponent from "@/GeneralComponents/userContainer/userContainer";
import axios from 'axios';
import {userAxios} from "@/Utils/UserAxios";

export default function PeopleSearchPage({ searched = "filler" }) {

  const [users, setUsers] = useState([]);     // array of users to show
  const [loading, setLoading] = useState(true);   // loading state for fetching
  const [callingposts, setCallingPosts] = useState(false);
  const loadMoreButtonRef = useRef(null);
  const [pagedone, setpagedone] = useState(false);
  const [currentpage,setcurrentpage] = useState(2);
  const limitpage = 5;

  useEffect(() => {
    userAxios.get(`r/search/?q=${searched}&type=user&page=1&limit=${limitpage}`)  //fetch users and organize into users array for mapping
      .then(response => {
        let newUsers = response.data.users.map(user => ({
          id: user._id,
          name: user.username,
          avatar: user.avatar,
          about: user.about,
          karma: user.karma,
        }));

        if (newUsers.length < limitpage) {
          setpagedone(true);
        }
        setUsers(newUsers);
        setLoading(false);  //set loading to false after fetching to load body
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  const fetchMoreUsers = () => {
    setCallingPosts(true);
    userAxios.get(`r/search/?q=${searched}&type=user&page=${currentpage}&limit=${limitpage}`)  //fetch users and organize into users array for mapping
      .then(response => {
        let newUsers = response.data.users.map(user => ({
          id: user._id,
          name: user.username,
          avatar: user.avatar,
          about: user.about,
          karma: user.karma,
        }));

            setUsers(prevUsers => [...prevUsers, ...newUsers]);
            setCallingPosts(false);
            setcurrentpage(1+currentpage);

        })
        .catch(error => {
            console.error('Error:', error);
            setCallingPosts(false);
        });
};

  // loading spinner to wait until fetch then load
  if (loading) {
    return (
      <div role="peoplestab" className="w-100 h-100 flex flex-col items-center justify-center">
        <img src={'/logo.png'} className="h-12 w-12 mt-10 mx-auto animate-ping" alt="Logo" />
      </div>
    )
  }

  //main body of the page
  return (
    <div role="peoplestab" className="flex flex-col w-full max-w[756px] h-fit my-4 p-1">
            {/* if there are no posts, show no results */}
            {users.length > 0 ? (
                <>
                    {users.map((user, index) => (
                        <UserComponent key={index} user={user} />
                    ))}
                    {!pagedone && !callingposts && (<button id="loadMoreButton" ref={loadMoreButtonRef} type="button" onClick={fetchMoreUsers} className="w-fit mx-auto h-fit my-2 px-3 py-2 bg-gray-200 shadow-inner rounded-full transition transform hover:scale-110">Load more</button>)}
                    {callingposts && (<img src={'/logo.png'} className="h-6 w-6 mx-auto animate-ping" alt="Logo" />)}
                </>
            ) : (
                <>
          {/*no results view*/}
          <img src={'/nosearch.svg'} className="w-16 h-24 mb-2" alt="Confused Snoo"></img>
          <p className="text-lg">Hm... We couldn't find any results for<br />"{searched}"</p>
                </>
            )}
    </div>
  );
}