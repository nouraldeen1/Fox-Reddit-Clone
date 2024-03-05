import ProfileSnoo from './images/mySnoo.png';
import EmptySnoo from './images/confusedSnoo.png';
import ProfileMenuButton from './profilemenubutton';

function ProfileDownvoted ({userName}) {
    return (
        <div className="flex-initial w-5/12 min-h-screen mx-28 my-4">
        <div className='relative flex mb-8'>
            <img src={ProfileSnoo} className='p-1 w-20 h-24 rounded-full z-0' alt=""></img>
            <span className='text-black font-bold text-2xl absolute top-10 left-24'>{userName}</span>
            <span className='text-gray-500 font-semibold absolute top-3/4 left-24'>u/{userName}</span>
        </div>
        <ul className='flex gap-3 overflow-x-auto mb-14'>
        <li><ProfileMenuButton text="overview" path='overview'/></li>
            <li><ProfileMenuButton text="posts" path='post'/></li>
            <li><ProfileMenuButton text="comments" path='comment'/></li>
            <li><ProfileMenuButton text="saved" path='saved'/></li>
            <li><ProfileMenuButton text="hidden" path='hidden'/></li>
            <li><ProfileMenuButton text="upvoted" path='upvote'/></li>
            <li><ProfileMenuButton text="downvoted" clicked={true} path='downvote'/></li>
        </ul>

                <hr />

                <div className="flex flex-col items-center">
                    <img src={EmptySnoo} className="w-16 h-24 mb-2" alt="Confused Snoo"></img>
                    <p className="text-lg font-bold">looks like you haven't downvoted anything</p>
                </div>
            </div>
    )
}

export default ProfileDownvoted;