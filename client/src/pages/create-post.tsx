import React, { useContext, useEffect, useState } from "react";
import Tiptap from "@/components/custom/editor";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { TiptapContext } from "@/context/tiptap_context";

const CreatePost = () => {

    const [isEditable, setIsEditable] = useState(true);
    const { editor, setContent } = useContext(TiptapContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [postData, setPostData] = useState<Blog>();
    const [title, setTitle] = useState(postData?.title || "");
    const [description, setDescription] = useState(postData?.description || "");

    const fetchBlog = async () => {
        try {
            if (id) {
                const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/${id}`, { withCredentials: true });
                setPostData(data.blog);
                setTitle(data.blog.title);
                setDescription(data.blog.description);
                setContent(data.blog.content);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlog();
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
            <h1 className="text-3xl mt-8 font-bold pb-4">Blog Images</h1>
            <div className="border-2 mt-8 bg-white px-6 py-4 rounded-lg">
                <div className="flex flex-wrap justify-center items-center p-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(item => (
                        <div key={item} className="relative">
                            <img
                                className="h-24 w-24 rounded-md"
                                src="https://via.placeholder.com/400x400"
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
            <button onClick={() => setIsEditable(isEditable => !isEditable)}>toggle</button>
            <section className="flex w-full border-black bg-white border-4 rounded-xl">
                <Tiptap isEditable={isEditable} />
            </section>
            <button onClick={() => onSubmit()} className="px-6 py-3 mt-8 bg-indigo-500 text-white rounded-lg border-2 text-lg font-semibold">Publish</button>
        </main>
    )
}

export default CreatePost;