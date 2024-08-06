import { useEffect, useState } from 'react'
import BlogGroup from './blog-group';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const HomeBlog = () => {

    const [activeTab, setActiveTab] = useState('All');
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const tabs = [
        { name: 'All', count: 20 },
        { name: 'Technology', count: 3 },
        { name: 'Lifestyle', count: 2 },
        { name: 'Travel', count: 5 },
        { name: 'Health', count: 9 },
        { name: 'Culture', count: 1 },
    ];

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/all?page=1`, { withCredentials: true });
            setBlogs(data.blogs);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <>
            <div className="container px-6 py-8 mx-auto text-center max-w-[85%]">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white lg:text-4xl">Browse by Category</h1>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center space-x-2 px-2 py-1 max-w-[85%] mx-auto gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`px-4 py-2 text-lg rounded-full border transition-all duration-300 ${activeTab === tab.name
                            ? 'bg-black border-black text-white'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-black hover:text-gray-200'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            <BlogGroup data={blogs} />
            <Link to="/blogs" className="relative mt-8 mb-8 inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black dark:text-white transition duration-300 ease-out border-2 border-black dark:border-white rounded-full shadow-md group">
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white dark:text-black duration-300 -translate-x-full bg-black dark:bg-white group-hover:translate-x-0 ease">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-black dark:text-white transition-all duration-300 transform group-hover:translate-x-full ease">Browse All Blogs</span>
                <span className="relative invisible">Browse All Blogs</span>
            </Link>
        </>
    )
}

export default HomeBlog;