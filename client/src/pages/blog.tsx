import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import '@/styles/styles.scss';
import { EditorContent } from '@tiptap/react';
import EmojiPicker from 'emoji-picker-react';
import { useContext, useEffect, useState } from 'react';
import { BsEmojiGrin } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import { LuEye } from "react-icons/lu";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import Loader from '@/components/custom/loader';
import { TiptapContext } from '@/context/tiptap_context';

const BlogPost = () => {

    const [comment, setComment] = useState("");
    const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [post, setPost] = useState<Blog>();
    const { editor } = useContext(TiptapContext);
    const [content, setContent] = useState("<p></p>");

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

    const onsubmit = () => {
        console.log(comment);
    }

    const recentPosts = [
        {
            title: 'The Most Beautiful Green Field on Earth',
            author: 'Rhiel Madsen',
            date: 'Sep 10, 2025',
            image: 'https://via.placeholder.com/150',
        },
        {
            title: 'Facts About Business That Will Help You Succeed',
            author: 'Jordyn Culhne',
            date: 'Mar 12, 2025',
            image: 'https://via.placeholder.com/150',
        },
        {
            title: '5 Easy Ways You Can Turn Future into Success',
            author: 'Ane Madsen',
            date: 'Nov 25, 2025',
            image: 'https://via.placeholder.com/150',
        },
    ];

    const fetchBlog = async () => {
        try {
            if (id) {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/${id}`, { withCredentials: true });
                setPost(data.blog);
                setContent(data.blog.content);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlog();
    }, [id])

    useEffect(() => {
        // editor?.chain().focus().insertContent(content).run();
        editor?.setEditable(false);
    }, [content, editor]);

    return !post ? <Loader /> : (
        <div className='bg-white'>
            <div className="container mt-16 pt-12 w-full lg:w-[85%] md:w-[95%] mx-auto p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Blog Section */}
                    <div className="w-full lg:w-4/6">
                        <img src={post ? post.image : "https://via.placeholder.com/800x400"} alt="Cover" className="w-full h-84 object-cover rounded-lg" />
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-6">Give Your Space a Parisian - Inspired Makeover</h1>
                        <div className='mt-8 mb-8 flex flex-wrap items-center gap-2 md:gap-0 space-x-2'>
                            <Avatar className='h-8 w-8'>
                                <AvatarImage src={post?.author.avatar} alt="" />
                                <AvatarFallback>US</AvatarFallback>
                            </Avatar>
                            <p className="text-md text-gray-600 dark:text-gray-400">{post?.author.name}</p>
                            <p className="text-md text-gray-600 dark:text-gray-400">•</p>
                            <p className="text-md text-gray-600 dark:text-gray-400">{String(new Date(post?.createdAt).toDateString())}</p>
                            <p className="text-md text-gray-600 dark:text-gray-400">•</p>
                            <p className="text-md text-gray-600 dark:text-gray-400">12 min read</p>
                            <div className="inline-block px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">Technology</div>
                        </div>
                        <div className="mt-4 text-gray-600">
                            <EditorContent
                                className="w-full p-3"
                                editor={editor}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-2/6">
                        <div className="mb-6 border border-gray-300 px-6 lg:px-10 py-8 rounded-xl">
                            <h2 className="text-xl font-bold mb-8">Recent Posts</h2>
                            <div className="space-y-6">
                                {recentPosts.map((post, index) => (
                                    <div key={index} className="flex items-center space-x-4 gap-2">
                                        <img src={post.image} alt={post.title} className="w-16 h-16 rounded-full object-cover" />
                                        <div>
                                            <h3 className="text-sm lg:text-md font-normal">{post.title}</h3>
                                            <p className="text-xs text-gray-500">{post.author} • {post.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6 mt-12 border border-gray-300 px-10 py-8 rounded-xl">
                            <div className='flex justify-evenly items-center space-x-8'>
                                <div className='flex flex-col justify-center items-center'>
                                    <FaRegHeart className='h-8 w-8' />
                                    <p className='text-md text-center'>20 likes</p>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <BiComment className='h-8 w-8' />
                                    <p className='text-md text-center'>20 comments</p>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <LuEye className='h-8 w-8' />
                                    <p className='text-md text-center'>20 views</p>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mb-6 mt-12 border border-gray-300 px-6 lg:px-10 py-8 max-h-screen rounded-xl">
                            <h2 className="text-xl font-bold mb-4">88 Comments</h2>
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
                                    <button onClick={onsubmit} className="mt-2 bg-blue-400 py-2 px-4 text-sm font-normal text-black rounded-full">Comment</button>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
                                <div className='flex gap-2'>
                                    <Avatar className='h-8 w-8'>
                                        <AvatarImage src="https://via.placeholder.com/150" alt="" />
                                        <AvatarFallback>US</AvatarFallback>
                                    </Avatar>
                                    <div className="p-4 w-full bg-gray-100 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-500">John Doe • Jan 1, 2024</p>
                                        <p className="text-sm text-gray-800">This Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, reiciendis. is a sample comment. Great blog post!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogPost;