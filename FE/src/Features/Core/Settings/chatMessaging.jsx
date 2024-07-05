import { ChevronDown } from "lucide-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate, } from 'react-router-dom';
import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { userAxios } from "../../../Utils/UserAxios";
import { toast } from 'react-toastify';


/**
 * @file chatMessaging is a functional component that has mark all as read option .
 * @module ChatMessaging
 */

export default function ChatMessaging() {

    let id = 3;
    const [markAllAsRead, setMarkAllAsRead] = useState(false);

    //connecting to mock
    // const handleReadAll = async () => {
    //     try{axios.patch(`http://localhost:3002/users/${id}`, { 
    //         markAllAsRead: true,
    //     })
    //     }catch(error){
    //         console.error(error);
    //     }
    //     //setMarkAllAsRead(true);
    //    toast.success('All messages marked as read');
    // }

        const handleUnReadmessages = async () => {
            try {
               const response = await userAxios.post(`message/markReadAllMessages/`, { markAllAsRead: true });
               toast.success('All messages marked as read');
            } catch (error) {
               console.error('Error fetching user info:', error);
            }

        }

    return (
        <div className="w-[75%]">
            <div className="flex justify-between flex-wrap">
                <div>
                    <div role="TextOfButtons">Mark all as read</div>
                    <h4 className="text-gray-400" role="TextOfButtons">Mark all conversations and invites as read.</h4>
                </div>
                <div className="w-auto" role="TextOfButtons">
                    <button id="markAllMessagesAsRead" data-dropdown-toggle="dropdown"
                        className="text-black dark:text-blue-500 w-auto focus:ring-blue-300 font-medium border-solid border-2 border-sky-500 rounded-lg text-sm px-5 py-2.5 text-center 
                        inline-flex gap-5 items-center bg-transparent dark:bg-transparent dark:hover:bg-blue-200 dark:focus:ring-blue-800 rounded-3xl" type="button"
                        role="markButton" onClick={handleUnReadmessages}>
                        Mark as Read
                    </button>
                </div>
            </div>
        </div>

    );
}