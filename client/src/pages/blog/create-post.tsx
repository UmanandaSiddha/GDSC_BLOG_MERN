import React, { useContext, useEffect, useState } from "react";
import Tiptap from "@/components/custom/editor";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { TiptapContext } from "@/context/tiptap_context";

const CreatePost = () => {

    const [isEditable, setIsEditable] = useState(true);
    const { editor } = useContext(TiptapContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [postData, setPostData] = useState<Blog>();
    const [title, setTitle] = useState(postData?.title || "");
    const [description, setDescription] = useState(postData?.description || "");
    const [blogCategory, setBlogCategory] = useState("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [disableComments, setDisableComments] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchBlog = async () => {
        try {
            if (id) {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/${id}`, { withCredentials: true });
                setPostData(data.blog);
                setTitle(data.blog.title);
                setDescription(data.blog.description);
                setBlogCategory(data.blog.category);
                setIsPrivate(data.blog?.isPrivate);
                setDisableComments(data.blog?.disableComments);
                editor?.commands.setContent(data.blog.content);
            }
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
        fetchBlog();
        fetchCategory();
    }, [id])

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const onFileUpload = async () => {
        if (!selectedFile) return;

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('blogs', selectedFile);
        if (title) formData.append("title", title);
        if (description) formData.append("description", description);
        if (blogCategory) formData.append("category", blogCategory);
        const content = editor.getHTML();
        if (content) formData.append("content", content);

        try {
            const id = searchParams.get("id");
            const link = id ? `${import.meta.env.VITE_BASE_URL}/blog/upload/cover?id=${id}` : `${import.meta.env.VITE_BASE_URL}/blog/upload/cover`
            const { data } = await axios.post(link, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
            setSearchParams({ type: 'edit', id: data.data.blogId }, { replace: true });
            toast.success('File uploaded successfully');
        } catch (error: any) {
            setUploadLoading(false);
            toast.error(error.response.data.message);
        }
        setUploadLoading(false);
    };

    const onSubmit = async () => {
        if (!id) {
            toast.warning("Invalid route");
            return;
        }
        const content = editor.getHTML();
        const formData = {
            title,
            description,
            content,
            category: blogCategory,
            isPrivate,
            disableComments,
        }
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/blog/edit/${id}`, formData, { withCredentials: true });
            toast.success('Blog updated successfully');
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <main className='mt-32 px-8 md:px-20 lg:px-40 mb-8'>

            <h1 className="text-3xl font-bold pb-4">Blog Title</h1>
            <div className="flex justify-center items-center w-full">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg px-2 py-4 pl-12 text-gray-700 bg-white border-2 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 focus:outline-none" placeholder="Enter Blog Title" />
            </div>

            <h1 className="text-3xl mt-8 font-bold pb-4">Blog Cover Image</h1>
            <img src={postData ? postData.image : "https://via.placeholder.com/800x400"} alt="Cover" className="w-auto h-64 object-cover rounded-lg" />
            <div className="flex justify-center items-center w-full gap-4">
                <input type="file" accept="image/*" onChange={onFileChange} className="block w-full px-3 py-4 mt-2 pl-4 lg:pl-12 text-lg text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-black focus:outline-none focus:ring focus:ring-black focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-black" />
                <button disabled={uploadLoading} onClick={onFileUpload} className="px-6 py-4 mt-2 bg-green-500 text-white rounded-lg border-2 text-lg font-semibold">
                    {uploadLoading ? "Hold on..." : "Upload"}
                </button>
            </div>

            <h1 className="text-3xl mt-8 font-bold pb-4">Blog Description</h1>
            <div>
                <textarea placeholder="Describe the blog in few words" value={description} onChange={(e) => setDescription(e.target.value)} className="block pl-12 text-lg mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-4 h-24 py-2.5 text-gray-700 focus:border-black focus:outline-none focus:ring focus:ring-black focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-black"></textarea>
            </div>

            <h1 className="text-3xl mt-8 font-bold pb-4">Blog Category</h1>
            <div className="flex flex-wrap items-center justify-center space-x-2 px-2 py-1 mb-6 max-w-[85%] mx-auto gap-2">
                {categories?.map((tab) => (
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
            <div className="flex justify-center items-center w-full">
                <input type="text" value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} className="w-full text-lg px-2 py-4 pl-12 text-gray-700 bg-white border-2 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 focus:outline-none" placeholder="Enter Blog Category" />
            </div>

            <h1 className="text-3xl mt-8 font-bold pb-4">Blog Images</h1>
            <div className="border-2 mt-8 bg-white px-6 py-4 rounded-lg">
                <div className="flex flex-wrap justify-center items-center p-2 gap-4">
                    {postData?.blogImages.map(item => (
                        <div key={item} className="relative">
                            <img
                                className="h-24 w-24 rounded-md"
                                src={item}
                                alt="img"
                            />
                            <button
                                className="absolute top-0 right-0 px-1 py-1 bg-gray-400 text-white rounded-full hover:bg-gray-500"
                                onClick={() => console.log(`Remove image ${item}`)}
                            >
                                <IoMdCloseCircleOutline className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <h1 className="text-3xl mt-8 font-bold pb-4">Blog Content</h1>
            <div className="inline-flex items-center">
                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
                    <input type="checkbox" checked={isEditable} onClick={() => setIsEditable(isEditable => !isEditable)}
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                        id="check" />
                    <span
                        className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                            stroke="currentColor" stroke-width="1">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </span>
                </label>
                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
                    {isEditable ? "Editable" : "Read-only"}
                </label>
            </div>

            <section className="flex w-full border-black bg-white border-4 rounded-xl">
                <Tiptap isEditable={isEditable} />
            </section>

            <div className="flex justify-start items-center mt-8 gap-4">
                
                <div className="flex justify-center items-center gap-4">
                    <h1 className="text-xl font-bold pb-2">Private</h1>
                    <div className="relative w-14 h-8 cursor-pointer" onClick={() => setIsPrivate(isPrivate => !isPrivate)} >
                        <input id="toggle" type="checkbox" className="sr-only" checked={isPrivate} onChange={() => setIsPrivate(isPrivate => !isPrivate)} />
                        <div className={`w-14 h-8 rounded-full transition-colors duration-300 ${isPrivate ? 'bg-green-500' : 'bg-gray-600'}`} >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} ></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                    <h1 className="text-xl font-bold pb-2">Disable Comments</h1>
                    <div className="relative w-14 h-8 cursor-pointer" onClick={() => setDisableComments(disableComments => !disableComments)} >
                        <input id="toggle" type="checkbox" className="sr-only" checked={disableComments} onChange={() => setDisableComments(disableComments => !disableComments)} />
                        <div className={`w-14 h-8 rounded-full transition-colors duration-300 ${disableComments ? 'bg-green-500' : 'bg-gray-600'}`} >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${disableComments ? 'translate-x-6' : 'translate-x-0'}`} ></div>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => onSubmit()} className="px-6 py-3 mt-8 bg-indigo-500 text-white rounded-lg border-2 text-lg font-semibold">Publish Blog</button>
        </main>
    )
}

export default CreatePost;