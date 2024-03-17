import React from "react";

export default function CommentsSearchPage({searched = ""}) { 
    return (
      <div role="commentstab" className="flex gap-4 items-center">
      <img src={'/nosearch.svg'} className="w-16 h-24 mb-2" alt="Confused Snoo"></img>
      <p className="text-lg">Hm... We couldn't find any results for<br/>"{searched}"</p>
  </div>
    );
  }