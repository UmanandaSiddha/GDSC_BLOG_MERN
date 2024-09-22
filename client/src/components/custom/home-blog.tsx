import { useEffect, useState } from 'react'
import BlogGroup from './blog-group';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const HomeBlog = () => {

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [blogCategory, setBlogCategory] = useState("all");

    const fetchCategory = async () => {
        try {
            const { data }: { data: AllCategoriesResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/cate/all`);
            setCategories(data.category);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchBlogs = async () => {
        try {
            let link = `${import.meta.env.VITE_BASE_URL}/blog/all?page=1`;
            if (blogCategory && blogCategory != "all") {
                link += `&category=${blogCategory}`;
            }
            const { data } = await axios.get(link, { withCredentials: true });
            setBlogs(data.blogs);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [blogCategory]);

    return (
        <>
            <div className="container px-6 py-8 mx-auto text-center max-w-[85%]">
                <h1 className="text-3xl font-gdg font-bold text-gray-800 dark:text-white lg:text-4xl">Browse by Category</h1>
                {/* <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}
            </div>
            <div className="flex flex-wrap items-center justify-center space-x-2 px-2 py-1 max-w-[85%] mx-auto gap-2">
                <button
                    onClick={() => setBlogCategory("all")}
                    className={`px-4 py-2 text-lg rounded-full border transition-all duration-300 ${blogCategory === "all"
                        ? 'bg-black border-black text-white'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-black hover:text-gray-200'
                        }`}
                >
                    All
                </button>
                {categories.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setBlogCategory(tab.name)}
                        className={`px-4 py-2 text-lg rounded-full border transition-all duration-300 ${blogCategory === tab.name
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