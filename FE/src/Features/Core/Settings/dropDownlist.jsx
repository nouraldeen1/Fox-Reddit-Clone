/**
 * 
 * dropDownList is a functional component that renders the drop down list. 
 * 
 */


import React from "react";
import {AiOutlineDown,AiOutlineUp} from "react-icons/ai"
import react, { useState , useEffect , useRef } from "react";
import { toast } from 'react-toastify';
import { ArrowsUpFromLine, BadgePlus, CircleArrowOutUpLeft, Flame, GalleryThumbnails, Rows2, Rows4 } from "lucide-react";

export default function Dropdown({secondOrFirst}){
    const [open, setOpen] = useState(false);
    const [item,setItem] = useState(secondOrFirst == 1 ? "Hot" : "card");

    function useOnClickOutside(ref, handler) {
        useEffect(() => {
            const listener = event => {
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
    
            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);
    
            return () => {
                document.removeEventListener('mousedown', listener);
                document.removeEventListener('touchstart', listener);
            };
        }, [ref, handler]);
    }
    
    // In your component
    const ref = useRef();
    
    useOnClickOutside(ref, () => setOpen(false));
    
    
if(secondOrFirst == 1){
    return(
        <div ref={ref} className="item-center text-center">
            <button
                onClick={() => setOpen(!open)}
                id="dropdownDefaultButtonForSorting"
                data-dropdown-toggle="dropdown"
                className="text-blue-500 dark:text-blue-500 mr-2 w-auto font-medium rounded-lg text-sm px-7 py-1.5 justify-between
                bg-transparent dark:bg-transparent mb-2" // Added mb-2 for a small gap
                type="button">
                    {/** `${changeButtonVal(obj,true)}`*/}
                    {`${item}`}
                    {!open ? <AiOutlineDown/> : <AiOutlineUp/>} 
            </button>
            {open && (
               <div className="relative mr-2 text-blue-500 z-60 dark:text-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
               items-center bg-transparent dark:bg-transparent rounded-3xl inline-block">
                   <ul className="">
                        <li onClick={()=>{
                                toast.success("changes saved.");
                                setItem("Hot");
                            }} className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="hotOption"><Flame /><span>Hot</span></li>
                        <li onClick={
                            ()=>{
                                    toast.success("changes saved.");
                                    setItem("New");
                                }} className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="NewOption"><BadgePlus /><span>New</span></li>
                        <li onClick={()=>{
                                toast.success("changes saved.");
                                setItem("Rising");
                            }} className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="RisingOption"><CircleArrowOutUpLeft /><span>Rising</span></li>
                        <li onClick={
                            ()=>{
                                toast.success("changes saved.");
                                setItem("Top");
                            }
                            } className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="TopOption"><ArrowsUpFromLine /><span>Top</span></li>
                    </ul>
               </div>
            )}
        </div>
    )
}else{
    return(
        <div ref={ref} className="item-center text-center">
            <button
                onClick={() => setOpen(!open)}
                id="dropdownDefaultButtonForThemeView"
                data-dropdown-toggle="dropdown"
                className="text-blue-500 dark:text-blue-500 mr-2 w-auto font-medium rounded-lg text-sm px-7 py-1.5
                bg-transparent dark:bg-transparent mb-2" // Added mb-2 for a small gap
                type="button">
                    {/** `${changeButtonVal(obj,true)}`*/}
                    {`${item}`}
                    {!open ? <AiOutlineDown/> : <AiOutlineUp/>} 
            </button>
            {open && (
               <div className="relative mr-2 text-blue-500 z-60 dark:text-blue-500 w-auto font-medium rounded-lg text-sm px-5 py-2.5 text-center 
               items-center bg-transparent dark:bg-transparent rounded-3xl inline-block">
                   <ul className="">
                        <li onClick={()=>{
                                toast.success("changes saved. \u{1F60A}");
                                setItem("Card");
                            }} className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="cardOption"><GalleryThumbnails /><span>card</span></li>
                        <li onClick={()=>{
                                toast.success("changes saved. \u{1F60A}");
                                setItem("Classic");
                            }} className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="classicOption"><Rows2 /><span>classic</span></li>
                        <li onClick={()=>{
                                toast.success("changes saved. \u{1F60A}");
                                setItem("Compact");
                            }} className="flex flex-col hover:bg-blue-100 items-center cursor-pointer border border-block px-4 py-2" id="compactOption"><Rows4 /><span>compact</span></li>
                    </ul>
               </div>
            )}
        </div>
    )
}
    
}