import React, { useEffect, useState } from 'react'
import NavOfNotification from './NavOfNotification'
import { useNavigate } from 'react-router-dom';
import { appFirestore } from '../../Utils/firebase';
import { collection, doc, getDocs, query, setDoc, where, onSnapshot } from "@firebase/firestore";

async function getDate() {

  console.log(doc.docs.map(e => e.data()));
}

function useNotification() {
  const [notification, setnotification] = useState([]);
  useEffect(() => {
    const collRef = collection(appFirestore, "notifications");
    const doc = onSnapshot(query(collRef, where('userId', '==', 'id')), (snap) => {
      setnotification(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [])
  return notification;
}


const NotificationPage = () => {
  const not = useNotification();
  console.log(not);
  const navigator = useNavigate();
  const handleNavigate = () => {
    navigator('/setting/notifications');
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold mt-3 mb-8'>Notifications </h1>
      <NavOfNotification ></NavOfNotification>
      <div className=' mt-4 w-3/5'>
        <div className='flex justify-end items-center space-x-3'>
          <button >
            Mark All as read
          </button>

          <button onClick={handleNavigate}  >
            <svg className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />  <circle cx="12" cy="12" r="3" /></svg>

          </button>
        </div>
        {
          not.map((e, idx) => <p key={idx}>{e.body}</p>)
        }
      </div>

    </div>
  )
}

export default NotificationPage