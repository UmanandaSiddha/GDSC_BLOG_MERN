import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import '@/styles/styles.scss';
import { EditorContent } from '@tiptap/react';
import EmojiPicker from 'emoji-picker-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsEmojiGrin } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import { LuEye } from "react-icons/lu";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '@/components/custom/loader';
import { TiptapContext } from '@/context/tiptap_context';
import { useUser } from '@/context/user_context';
import { FaHeart } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Helmet } from 'react-helmet-async';

const calculateReadTimeFromHTML = (htmlContent: string, wordsPerMinute: number = 200): number => {
    const textContent = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes);
};

const BlogPost = () => {

    const [comment, setComment] = useState("");
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [post, setPost] = useState<Blog>();
    const { editor } = useContext(TiptapContext);
    const [blogContent, setBlogContent] = useState("<p></p>");
    const [blogComment, setBlogComment] = useState<Comments[]>([]);
    const [userLiked, setUserLiked] = useState(false);
    const userContext = useUser();
    const [open, setOpen] = useState(false);
    const [likes, setLikes] = useState<Like[]>([]);
    const [recentPosts, setRecentPosts] = useState<Blog[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasViewedRef = useRef(false);
    const [wpm, setWpm] = useState(0);
    const [currentComment, setCurrentComment] = useState<string>("");

    if (!editor) {
        return null;
    }

    const handleEmojiClick = (e: any) => {
        setComment((prevComment) => prevComment + e.emoji);
        setEmojiPickerVisible(false);
    };

    const toggleEmojiPicker = () => {
        setEmojiPickerVisible((prev) => !prev);
    };

    const fetchRecentBlogs = async () => {
        try {
            const { data }: { data: AllBlogResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/all?limit=3`, { withCredentials: true });
            setRecentPosts(data.blogs);
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    const fetchBlog = async () => {
        try {
            if (id) {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/byId/${id}`, { withCredentials: true });
                setPost(data.blog);
                setBlogContent(data.blog.content);
                setWpm(calculateReadTimeFromHTML(data.blog.content));
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchLike = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/like/fetch/${id}`, { withCredentials: true });
            setUserLiked(data.like);
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/comment/post/${id}`, { withCredentials: true });
            setBlogComment(data.comments);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlog();
        fetchComments();
        fetchLike();
        fetchRecentBlogs();
    }, [id])

    useEffect(() => {
        const incrementViewCount = async () => {
            if (!hasViewedRef.current) {
                try {
                    await axios.patch(`${import.meta.env.VITE_BASE_URL}/blog/update/view/${id}`, { withCredentials: true });
                    hasViewedRef.current = true;
                } catch (error) {
                    console.error('Failed to increment view count', error);
                }
            }
        };

        timerRef.current = setTimeout(incrementViewCount, 30000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [id]);

    useEffect(() => {
        editor?.commands.setContent(blogContent);
        editor?.setEditable(false);
    }, [blogContent, editor]);

    const handlePostComment = async () => {
        if (!comment) {
            toast.error("Comment field cannot be empty");
            return;
        }

        try {
            if (currentComment) {
                const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/comment/edit/${currentComment}`, { newComment: comment }, { withCredentials: true });
                const setUpData = {
                    ...data.comment,
                    user: {
                        _id: userContext?.user?._id,
                        name: userContext?.user?.name,
                        avatar: userContext?.user?.avatar
                    }
                }
                const updatedComment = blogComment.map(comment => comment._id === currentComment ? setUpData : comment);
                setBlogComment(updatedComment);
                toast.success("Comment updated successfully");
                setCurrentComment("");
            } else {
                const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/comment/create/${id}`, { comment }, { withCredentials: true });
                const setUpData = {
                    ...data.comment,
                    user: {
                        _id: userContext?.user?._id,
                        name: userContext?.user?.name,
                        avatar: userContext?.user?.avatar
                    }
                }
                setBlogComment(prevComments => [setUpData, ...prevComments]);
                toast.success("Comment created successfully");
            }
            setComment("");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleLikePost = async () => {
        try {
            if (userLiked) {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/like/undo/${id}`, { withCredentials: true });
                setUserLiked(false);
                toast.success("Like removed successfully");
            } else {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/like/do/${id}`, { withCredentials: true });
                setUserLiked(true);
                toast.success("Like added successfully");
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchLikes = async () => {
        try {
            const { data }: { data: LikeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/like/fetch/all/${id}`, { withCredentials: true });
            setLikes(data.likes);
        } catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    const handleDeleteComment = async (id: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/comment/edit/${id}`, { withCredentials: true });
            toast.success("Comment Deleted successfully");
            const newComments = blogComment.filter(comment => comment._id != id);
            setBlogComment(newComments);
            setOpenDelete(false);
            setCurrentComment("");
        } catch (error: any) {
            setOpenDelete(false);
            toast.error(error.response.data.message);
        }
    }

    return !post ? <Loader /> : (
        <>
            <Helmet>
                <title>GDSC BLOG | {post?.title}</title>
                <meta name="description" content={post?.title} />
                <meta name="keywords" content="react, blog, gdsc, google, tezpur" />
            </Helmet>

            <div className='bg-white'>
                <div className="container mt-16 pt-12 w-full lg:w-[85%] md:w-[95%] mx-auto p-6">
                    <div className="flex flex-col lg:flex-row gap-6">

                        {open && (
                            <div className="mt-16 fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
                                <div className="bg-white p-8 rounded-2xl shadow-lg w-[420px]">
                                    <div className='flex justify-between items-center'>
                                        <h1 className='text-2xl font-semibold'>Likes</h1>
                                        <button className='border-2 rounded-lg px-3 py-1 text-lg' onClick={() => setOpen(false)}>Close</button>
                                    </div>

                                    <div className='mt-8 max-h-[40vh] overflow-auto'>
                                        {likes?.map((like, index) => (
                                            <div key={index} className='flex items-center gap-2 my-2'>
                                                {like?.user?.avatar ? (
                                                    <img height={100} width={100} className="object-cover h-10 w-10 text-center rounded-full" src={like?.user?.avatar} alt="" />
                                                ) : (
                                                    <div className='flex h-10 w-10 justify-center items-center bg-gray-300 rounded-full'>
                                                        <p className='text-center text-xl font-semibold'>{like?.user?.name.split(' ').map(word => word[0]).join('')}</p>
                                                    </div>
                                                )}
                                                <p className='text-md font-normal'>{like?.user?.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-full lg:w-4/6">
                            <img src={post ? post.image : "https://via.placeholder.com/800x400"} alt="Cover" className="w-full h-84 object-cover rounded-lg" />
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-6">{post?.title}</h1>
                            <p className='mt-4 text-md italic text-gray-600'>{post?.description}</p>
                            <div className='mt-8 mb-8 flex flex-wrap items-center gap-2 md:gap-0 space-x-2'>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src={post.author?.avatar} alt="" />
                                    <AvatarFallback>{post.author.name.split(' ').map(word => word[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <Link to={`/authors/author?id=${post.author._id}`} className="text-md text-gray-600 dark:text-gray-400">{post?.author?.name}</Link>
                                <p className="text-md text-gray-600 dark:text-gray-400">•</p>
                                <p className="text-md text-gray-600 dark:text-gray-400">{String(new Date(post?.createdAt).toDateString())}</p>
                                <p className="text-md text-gray-600 dark:text-gray-400">•</p>
                                <p className="text-md text-gray-600 dark:text-gray-400">{wpm} min read</p>
                                {post.category && (
                                    <div className="inline-block px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">{post.category}</div>
                                )}
                            </div>
                            <div className="mt-4 text-gray-600 border border-gray-300 rounded-xl">
                                <EditorContent
                                    className="w-full p-3"
                                    editor={editor}
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-2/6">
                            <div className="mb-6 border border-gray-300 px-6 lg:px-10 py-8 rounded-xl">
                                <h2 className="text-xl font-bold mb-8">Recent Posts</h2>
                                <div className="space-y-6">
                                    {recentPosts.map((post, index) => (
                                        <div key={index} className="flex items-center space-x-4 gap-2">
                                            <img src={post.image} alt={post.title} className="w-16 h-16 rounded-full object-cover" />
                                            <div className='w-3/4'>
                                                <h3 className="text-sm lg:text-md font-normal">{post.title}</h3>
                                                <p className="text-xs text-gray-500">{post.author.name} • {String(new Date(post?.createdAt).toDateString())}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6 mt-12 border border-gray-300 px-10 py-8 rounded-xl">
                                <div className='flex justify-evenly items-center space-x-8'>
                                    <div onClick={handleLikePost} className='flex flex-col justify-center items-center'>
                                        {userLiked ? (
                                            <FaHeart className="h-8 w-8 text-red-500" />
                                        ) : (
                                            <FaRegHeart className="h-8 w-8" />
                                        )}
                                        <p className='text-md text-center'>{post.likes} likes</p>
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>
                                        <BiComment className='h-8 w-8' />
                                        <p className='text-md text-center'>{post.comments} comments</p>
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>
                                        <LuEye className='h-8 w-8' />
                                        <p className='text-md text-center'>{post.views} views</p>
                                    </div>
                                </div>
                            </div>

                            {(userContext?.user?.role === "admin" || (userContext?.user?.role === "creator" && userContext.user._id === post.author._id)) && (
                                <div className="mb-6 mt-12 border border-gray-300 px-10 py-8 rounded-xl">
                                    <button className='px-3 py-2 bg-indigo-500 text-white rounded-md' onClick={() => {
                                        setOpen(true)
                                        fetchLikes();
                                    }}>View Likes</button>
                                </div>
                            )}

                            {!post.disableComments && (
                                <div className="mb-6 mt-12 border border-gray-300 px-6 lg:px-10 py-8 max-h-screen rounded-xl">
                                    <h2 className="text-xl font-bold mb-4">{post.comments} Comments</h2>
                                    <div className="w-full my-4">
                                        <textarea className="w-full p-2 rounded-lg border-2 hide-scrollbar" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..."></textarea>
                                        <div className="flex justify-between items-center">
                                            <div className="relative">
                                                <button onClick={toggleEmojiPicker} className="bg-transparent border-none">
                                                    <BsEmojiGrin className="h-6 w-6" />
                                                </button>
                                                {isEmojiPickerVisible && (
                                                    <div className="absolute z-10">
                                                        <EmojiPicker
                                                            width={250}
                                                            height={300}
                                                            searchDisabled={true}
                                                            onEmojiClick={handleEmojiClick}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={handlePostComment} className="mt-2 bg-blue-400 py-2 px-4 text-sm font-normal text-black rounded-full">Comment</button>
                                        </div>
                                    </div>
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
                                        {blogComment.map((item, index) => (
                                            <div key={index} className='flex gap-2'>
                                                <Avatar className='h-8 w-8'>
                                                    <AvatarImage src={item.user?.avatar} alt="" />
                                                    <AvatarFallback>{item?.user?.name?.split(' ').map(word => word[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                {openDelete && (
                                                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                                        <div className="bg-white p-8 rounded-xl shadow-lg w-[425px]">
                                                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Are you sure you want to delete this user?</h2>
                                                            <div className="w-full flex justify-between items-center gap-4">
                                                                <button 
                                                                    className="w-1/2 px-3 py-2 border-2 rounded-lg bg-red-500 text-white" 
                                                                    onClick={() => {
                                                                        if (currentComment) {
                                                                            handleDeleteComment(currentComment)
                                                                        } else {
                                                                            toast.warning("You are not allowed to delete this")
                                                                        }
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button className="w-1/2 px-3 py-2 border-2 rounded-lg" onClick={() => setOpenDelete(false)}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="p-4 w-full bg-gray-100 rounded-lg">
                                                    <div className='flex justify-between'>
                                                        <p className="text-sm font-semibold text-gray-500">{item.user?.name} • {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                        {(userContext?.user?.role === "admin" || (item.user._id === userContext?.user?._id)) && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger className="p-1" onClick={(e) => e.stopPropagation()}><CiMenuKebab size={15} /></DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => {
                                                                            setCurrentComment(item._id);
                                                                            setComment(item.comment);
                                                                        }}
                                                                    >
                                                                        Edit Comment
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => {
                                                                            setCurrentComment(item._id);
                                                                            setOpenDelete(true);
                                                                        }}
                                                                    >
                                                                        Delete Comment
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-800">{item.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogPost;