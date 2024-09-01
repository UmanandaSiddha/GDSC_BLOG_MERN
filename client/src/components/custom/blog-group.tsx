import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/user_context";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BlogGroup = ({ data }: { data: Blog[] }) => {
    
    const userContext = useUser();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<string>();

    const handleDeletePost = async () => {
        if (currentBlog) {
            try {
                await axios.delete(`${import.meta.env.VITE_BASE_URL}/blog/edit/${currentBlog}`, { withCredentials: true });
                toast.success("Blog Deleted successfully");
                setOpenDelete(false);
            } catch (error: any) {
                setOpenDelete(false);
                toast.error(error.response.data.message);
            }
        }
        setOpenDelete(false);
    }

    return (
        <section className="bg-white dark:bg-gray-900 w-full mb-8">
            <div className="container w-[95%] lg:w-[85%] px-2 md:px-6 lg:px-16 py-10 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {data.map((item, index) => (
                        <Link to={`/blogs/blog?id=${item._id}`} className='group' key={index}>
                            <div className="relative">
                                <img width={500} height={500} className="object-cover object-center w-full rounded-lg h-72 transition-transform duration-300 transform group-hover:scale-105" src={item.image} alt={item.author.name} />
                                {(userContext?.user?.role === "admin" || (userContext?.user?.role === "creator" && item.author._id === userContext?.user?._id)) && (
                                    <div className="absolute top-0 right-0 m-2 p-1.5 group-hover:bg-slate-300 rounded-full">
                                        {openDelete && (
                                            <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                                <div className="bg-white p-8 rounded-xl shadow-lg w-[425px]">
                                                    <h2 className="text-2xl font-bold mb-4 flex justify-center">Are you sure you want to delete this user?</h2>
                                                    <div className="w-full flex justify-between items-center gap-4">
                                                        <button className="w-1/2 px-3 py-2 border-2 rounded-lg bg-red-500 text-white" onClick={() => handleDeletePost()}>Delete</button>
                                                        <button className="w-1/2 px-3 py-2 border-2 rounded-lg" onClick={() => setOpenDelete(false)}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-1" onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                            }}><CiMenuKebab size={20} /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate(`/create?id=${item._id}`);
                                                    }}
                                                >
                                                    Edit Blog
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setCurrentBlog(item._id);
                                                    setOpenDelete(true);
                                                }}>Delete Blog</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8">
                                <div className="group text-gray-800 transition-all duration-300 ease-in-out dark:text-gray-200">
                                    <span className="bg-left-bottom bottom-[-2px] text-xl font-semibold bg-gradient-to-r from-purple-300 dark:from-purple-700 to-purple-300 dark:to-purple-700 bg-[length:0%_12px] bg-no-repeat group-hover:bg-[length:100%_11px] transition-all duration-500 ease-out">
                                        {item.title}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    {item.description.split(" ").length > 15 ? item.description.split(" ").slice(0, 15).join(" ") + "..." : item.description}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <div className='flex items-center justify-evenly space-x-1.5'>
                                        <Avatar className='h-7 w-7'>
                                            <AvatarImage src={item.author.avatar} alt={item.author.name} />
                                            <AvatarFallback>{item.author.name.split(' ').map(word => word[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.author.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">•</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>

                                    {item.category && (
                                        <div className="inline-block px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">{item.category}</div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BlogGroup;