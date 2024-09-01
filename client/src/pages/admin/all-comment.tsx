import axios from "axios";
import { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminNavigation from "@/components/custom/admin-navigation";
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { HiMiniArrowSmallLeft } from "react-icons/hi2";

const AllComment = () => {

    const [comments, setComments] = useState<Comments[]>([]);
    const [comment, setComment] = useState<Comments>();
    const [openView, setOpenView] = useState(false);
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredComments: 1,
        totalUsers: 1
    });

    const fetchComments = async () => {
        try {
            const { data }: { data: CommentResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/comment/all?page=${counts.currentPage}`, { withCredentials: true });
            setComments(data.comments);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredComments: data.filteredComment,
                totalUsers: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchComments();
    }, [counts.currentPage]);

    return (
        <div className='bg-white'>
            <div className="container mt-16 pt-12 w-full lg:w-[85%] md:w-[95%] mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">

                    <div className="w-full md:w-2/6 h-[80vh] hidden md:flex justify-center items-center mx-auto">
                        <AdminNavigation />
                    </div>

                    <div className="w-full md:w-4/6 h-[80vh] mx-auto overflow-auto hide-scrollbar">

                        {openView && (
                            <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold mb-4 flex justify-center">Comment Details</h2>
                                        <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenView(false)}>Close</button>
                                    </div>

                                    {comment?.user?.avatar ? (
                                        <img height={100} width={100} className="object-cover h-12 w-12 text-center rounded-full" src={comment?.user?.avatar} alt="" />
                                    ) : (
                                        <div className='flex h-12 w-12 justify-center items-center bg-gray-300 rounded-full'>
                                            <p className='text-center text-3xl font-semibold'>{comment?.user?.name.split(' ').map(word => word[0]).join('')}</p>
                                        </div>
                                    )}
                                    <p>Comment: {comment?.comment}</p>
                                    <p>User: {comment?.user.name}</p>
                                    <p>Post: {`http://localhost:5173/blogs/blog?id=${comment?.post}`}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="w-full mx-auto">
                            <div className="mb-6 px-6 lg:px-10 py-8 rounded-xl">
                                <h2 className="text-3xl text-center font-bold mb-8">All Comments</h2>

                                <div className='mt-8 flex justify-center items-center gap-6'>
                                    <button 
                                        onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                        disabled={counts.currentPage === 1}
                                        className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8"
                                    >
                                        <HiMiniArrowSmallLeft size={25} />
                                    </button>
                                    <p className="text-lg font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredComments / counts.resultPerPage)}</p>
                                    <button 
                                        onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                        disabled={counts.currentPage === Math.ceil(counts.filteredComments / counts.resultPerPage)}
                                        className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8"
                                    >
                                        <HiMiniArrowSmallRight size={25} />
                                    </button>
                                </div>

                                <div className="mt-6 w-full py-2 flex flex-col gap-4">
                                    {comments?.map((comment, index) => (
                                        <div key={index} className={`flex flex-col gap-4 bg-gray-100 p-4 rounded-full`}>
                                            <div className="w-full flex items-center justify-between">
                                                <div>
                                                    {comment.user.avatar ? (
                                                        <img src={comment.user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                                                    ) : (
                                                        <div className='flex h-10 w-10 justify-center items-center bg-gray-300 rounded-full'>
                                                            <p className='text-center text-lg font-semibold'>{comment.user?.name.split(' ').map(word => word[0]).join('')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-[85%] text-md font-semibold truncate">
                                                    <p>{comment.comment}</p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="p-2"><CiMenuKebab size={20} /></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => { }}
                                                        >
                                                            Update Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setOpenView(true)
                                                                setComment(comment)
                                                            }}
                                                        >
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => { }}
                                                        >
                                                            Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllComment;