import BlogGroup from '@/components/custom/blog-group';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const BlogPage = () => {

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [keyword, setKeyword] = useState("");
    const [blogCategory, setBlogCategory] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchBlogs = async () => {
        try {
            let link = `${import.meta.env.VITE_BASE_URL}/blog/all?keyword=${keyword}&page=1`;
            if (blogCategory && blogCategory != "all") {
                link += `&category=${blogCategory}`;
            }
            const { data } = await axios.get(link, { withCredentials: true });
            setBlogs(data.blogs);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const fetchCategory = async () => {
        try {
            const { data }: { data: AllCategoriesResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/blog/cat`);
            setCategories(data.category);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlogs();
        fetchCategory();
    }, [keyword, blogCategory])

    return (
        <div className='flex flex-col mt-8 items-center justify-center'>
            <div className="container mt-16 px-6 pt-8 mx-auto text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white lg:text-4xl">{keyword ? `Search for "${keyword}"` : "All Blog Post"}</h1>
                <p className="mt-4 text-ld text-gray-500 dark:text-gray-300">40 Post</p>
            </div>
            <div className="relative mt-4 mb-12 w-full md:w-3/5 lg:w-2/5 p-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-8">
                    <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </span>

                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full text-md px-2 py-4 pl-16 pr-4 text-gray-700 bg-white border-2 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 focus:outline-none" placeholder="Search posts ..." />
            </div>

            <div className="flex flex-wrap items-center justify-center space-x-2 px-2 py-1 mb-16 max-w-[85%] mx-auto gap-2">
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
            <button className="relative inline-block text-lg group mb-12">
                <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                    <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                    <span className="relative">Load More</span>
                </span>
                <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
            </button>
        </div>
    )
}

export default BlogPage;