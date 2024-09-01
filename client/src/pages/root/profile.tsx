import BlogGroup from '@/components/custom/blog-group';
import { useUser } from '@/context/user_context';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCamera } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {

    const userContext = useUser();
    const [open, setOpen] = useState(false);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [updateProfile, setUpdateProfile] = useState({
        name: userContext?.user?.name || "",
        bio: userContext?.user?.bio || "",
        socials: {
            facebook: userContext?.user?.socials?.find(social => social.platform === "facebook")?.url || "",
            instagram: userContext?.user?.socials?.find(social => social.platform === "instagram")?.url || "",
            twitter: userContext?.user?.socials?.find(social => social.platform === "twitter")?.url || "",
            linkedin: userContext?.user?.socials?.find(social => social.platform === "linkedin")?.url || "",
        }
    });
    const [resetPassword, setResetPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const fetchBlogs = async () => {
        try {
            setIsFetching(true);
            const { data }: { data: AllBlogResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/blog/user/all?page=${currentPage}`, { withCredentials: true });
            if (currentPage === 1) {
                setBlogs(data.blogs);
            } else {
                setBlogs(prevBlogs => [...prevBlogs, ...data.blogs]);
            }
            setIsFetching(false);
        } catch (error: any) {
            setIsFetching(false);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBlogs();
    }, [currentPage]);

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!userContext?.user?.account.includes("email")) {
                if (!resetPassword.newPassword || !resetPassword.confirmPassword) {
                    toast.warning("All fields are required");
                    return;
                }
                await axios.put(`${import.meta.env.VITE_BASE_URL}/user/set/password`, resetPassword, { withCredentials: true });
                toast.success("Password set successfully");
                setOpenReset(false);
                setResetPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                if (!resetPassword.oldPassword || !resetPassword.newPassword || !resetPassword.confirmPassword) {
                    toast.warning("All fields are required");
                    return;
                }
                await axios.put(`${import.meta.env.VITE_BASE_URL}/user/update/password`, resetPassword, { withCredentials: true });
                toast.success("Password reset successfully");
                setOpenReset(false);
                setResetPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error: any) {
            setOpenReset(false);
            setResetPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
            toast.error(error.response.data.message);
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(URL.createObjectURL(file));
            await handleAvatarUpload(file);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/upload/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
            userContext?.setUser(data.user);
            toast.success("Uploaded avatar");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/update/profile`, updateProfile, { withCredentials: true });
            userContext?.setUser(data.user);
            toast.success("Profile Updated");
            setOpen(false);
        } catch (error: any) {
            setOpen(false);
            toast.error(error.response.data.message);
        }
    }

    const handleCreatorRequest = async () => {
        if (userContext?.user?.request === "pending") {
            toast.warning("You already requested to become a creator");
            return;
        }
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/request/creator`, { withCredentials: true });
            userContext?.setUser(data.user);
            toast.success("Request sent successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex flex-col items-center mt-12 justify-center bg-white dark:bg-gray-900'>

            {open && (
                <div className="mt-16 fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[650px]">
                        <div className='flex justify-between items-center'>
                            <h1 className='text-3xl font-semibold'>Update Profile</h1>
                            <button className='border-2 rounded-lg px-3 py-1 text-lg' onClick={() => setOpen(false)}>Close</button>
                        </div>
                        <form className='mt-8 flex flex-col justify-center space-y-2' onSubmit={handleUpdateProfile}>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="role" className="text-lg font-semibold">Name</label>
                                <input type="text" value={updateProfile.name} onChange={(e) => setUpdateProfile({ ...updateProfile, name: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="role" className="text-lg font-semibold">Bio</label>
                                <textarea value={updateProfile.bio} onChange={(e) => setUpdateProfile({ ...updateProfile, bio: e.target.value })} className='text-md border px-2 py-1 rounded-md' placeholder='Enter Bio'></textarea>
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="role" className="text-lg font-semibold">Socials</label>
                                <div className='flex gap-2 w-full'>
                                    <input type="text" value={updateProfile.socials.facebook} onChange={(e) => setUpdateProfile({ ...updateProfile, socials: { ...updateProfile.socials, facebook: e.target.value } })} className='w-1/2 border text-md px-2 py-1 rounded-md' placeholder='Enter Facebook URL' />
                                    <input type="text" value={updateProfile.socials.instagram} onChange={(e) => setUpdateProfile({ ...updateProfile, socials: { ...updateProfile.socials, instagram: e.target.value } })} className='w-1/2 border text-md px-2 py-1 rounded-md' placeholder='Enter Instagram URL' />
                                </div>
                                <div className='flex gap-2 w-full'>
                                    <input type="text" value={updateProfile.socials.twitter} onChange={(e) => setUpdateProfile({ ...updateProfile, socials: { ...updateProfile.socials, twitter: e.target.value } })} className='w-1/2 border text-md px-2 py-1 rounded-md' placeholder='Enter Twitter URL' />
                                    <input type="text" value={updateProfile.socials.linkedin} onChange={(e) => setUpdateProfile({ ...updateProfile, socials: { ...updateProfile.socials, linkedin: e.target.value } })} className='w-1/2 border text-md px-2 py-1 rounded-md' placeholder='Enter LinkedIn URL' />
                                </div>
                            </div>
                            <button type='submit' className='bg-blue-500 px-3 py-2 rounded-lg text-white'>Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {openReset && (
                <div className="mt-16 fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-20">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-[650px]">
                        <div className='flex justify-between items-center'>
                            <h1 className='text-3xl font-semibold'>{!userContext?.user?.account.includes("email") ? "S" : "Res"}et Password</h1>
                            <button className='border-2 rounded-lg px-3 py-1 text-lg' onClick={() => setOpenReset(false)}>Close</button>
                        </div>
                        <form className='mt-8 flex flex-col justify-center space-y-2' onSubmit={handleResetPassword}>
                            {userContext?.user?.account.includes("email") && (
                                <div className="flex flex-col gap-4">
                                    <label htmlFor="role" className="text-lg font-semibold">Old Password</label>
                                    <input type="text" value={resetPassword.oldPassword} onChange={(e) => setResetPassword({ ...resetPassword, oldPassword: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
                                </div>
                            )}
                            <div className="flex flex-col gap-4">
                                <label htmlFor="role" className="text-lg font-semibold">New Password</label>
                                <input type="text" value={resetPassword.newPassword} onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="role" className="text-lg font-semibold">Confirm Password</label>
                                <input type="text" value={resetPassword.confirmPassword} onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })} className='text-md border px-2 py-2 rounded-md' placeholder='Enter Name' />
                            </div>
                            <button type='submit' className='bg-blue-500 px-3 py-2 rounded-lg text-white'>Submit</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col justify-center items-center mt-16 gap-5">
                <div className='relative h-32 w-32 rounded-full border-2 flex justify-center items-center'>
                    {userContext?.user?.avatar ? (
                        <img height={100} width={100} className="object-cover h-24 w-24 text-center rounded-full" src={selectedFile || userContext?.user?.avatar} alt="" />
                    ) : (
                        <div className='flex h-24 w-24 justify-center items-center bg-gray-300 rounded-full'>
                            <p className='text-center text-3xl font-semibold'>{userContext?.user?.name.split(' ').map(word => word[0]).join('')}</p>
                        </div>
                    )}
                    <div onClick={handleIconClick} className="absolute border border-slate-300 bottom-0 right-0 bg-slate-200 text-black rounded-full p-2">
                        <FaCamera size={20} />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex gap-2 justify-center items-center'>
                        <div>
                            <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white lg:text-3xl">{userContext?.user?.name}</h1>
                            <div className="flex justify-center mx-auto mt-2">
                                <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
                                <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
                                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className='border border-slate-300 bg-slate-100 rounded-full p-2'>
                                    <FiEdit3 size={20} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                                <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpen(true)}>Edit Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOpenReset(true)}>{!userContext?.user?.account.includes("email") ? "S" : "Res"}et Password</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="mt-4 text-center max-w-[70%] text-gray-500 dark:text-gray-300">{userContext?.user?.bio}</p>

                    {userContext?.user?.socials && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                            {userContext.user.socials.map((item, index) => (
                                <Link key={index} target='blank' to={item.url} className="dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500">
                                    {item.url && (
                                        <>
                                            {item.platform === "twitter" ? (
                                                <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18.6668 6.67334C18.0002 7.00001 17.3468 7.13268 16.6668 7.33334C15.9195 6.49001 14.8115 6.44334 13.7468 6.84201C12.6822 7.24068 11.9848 8.21534 12.0002 9.33334V10C9.83683 10.0553 7.91016 9.07001 6.66683 7.33334C6.66683 7.33334 3.87883 12.2887 9.3335 14.6667C8.0855 15.498 6.84083 16.0587 5.3335 16C7.53883 17.202 9.94216 17.6153 12.0228 17.0113C14.4095 16.318 16.3708 14.5293 17.1235 11.85C17.348 11.0351 17.4595 10.1932 17.4548 9.34801C17.4535 9.18201 18.4615 7.50001 18.6668 6.67268V6.67334Z" />
                                                </svg>
                                            ) : item.platform === "linkedin" ? (
                                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.2 8.80005C16.4731 8.80005 17.694 9.30576 18.5941 10.2059C19.4943 11.1061 20 12.327 20 13.6V19.2H16.8V13.6C16.8 13.1757 16.6315 12.7687 16.3314 12.4687C16.0313 12.1686 15.6244 12 15.2 12C14.7757 12 14.3687 12.1686 14.0687 12.4687C13.7686 12.7687 13.6 13.1757 13.6 13.6V19.2H10.4V13.6C10.4 12.327 10.9057 11.1061 11.8059 10.2059C12.7061 9.30576 13.927 8.80005 15.2 8.80005Z" fill="currentColor" />
                                                    <path d="M7.2 9.6001H4V19.2001H7.2V9.6001Z" fill="currentColor" />
                                                    <path d="M5.6 7.2C6.48366 7.2 7.2 6.48366 7.2 5.6C7.2 4.71634 6.48366 4 5.6 4C4.71634 4 4 4.71634 4 5.6C4 6.48366 4.71634 7.2 5.6 7.2Z" fill="currentColor" />
                                                </svg>
                                            ) : item.platform === "facebook" ? (
                                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 10.2222V13.7778H9.66667V20H13.2222V13.7778H15.8889L16.7778 10.2222H13.2222V8.44444C13.2222 8.2087 13.3159 7.9826 13.4826 7.81591C13.6493 7.64921 13.8754 7.55556 14.1111 7.55556H16.7778V4H14.1111C12.9324 4 11.8019 4.46825 10.9684 5.30175C10.1349 6.13524 9.66667 7.2657 9.66667 8.44444V10.2222H7Z" fill="currentColor" />
                                                </svg>
                                            ) : (
                                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.9294 7.72275C9.65868 7.72275 7.82715 9.55428 7.82715 11.825C7.82715 14.0956 9.65868 15.9271 11.9294 15.9271C14.2 15.9271 16.0316 14.0956 16.0316 11.825C16.0316 9.55428 14.2 7.72275 11.9294 7.72275ZM11.9294 14.4919C10.462 14.4919 9.26239 13.2959 9.26239 11.825C9.26239 10.354 10.4584 9.15799 11.9294 9.15799C13.4003 9.15799 14.5963 10.354 14.5963 11.825C14.5963 13.2959 13.3967 14.4919 11.9294 14.4919ZM17.1562 7.55495C17.1562 8.08692 16.7277 8.51178 16.1994 8.51178C15.6674 8.51178 15.2425 8.08335 15.2425 7.55495C15.2425 7.02656 15.671 6.59813 16.1994 6.59813C16.7277 6.59813 17.1562 7.02656 17.1562 7.55495ZM19.8731 8.52606C19.8124 7.24434 19.5197 6.10901 18.5807 5.17361C17.6453 4.23821 16.51 3.94545 15.2282 3.88118C13.9073 3.80621 9.94787 3.80621 8.62689 3.88118C7.34874 3.94188 6.21341 4.23464 5.27444 5.17004C4.33547 6.10544 4.04628 7.24077 3.98201 8.52249C3.90704 9.84347 3.90704 13.8029 3.98201 15.1238C4.04271 16.4056 4.33547 17.5409 5.27444 18.4763C6.21341 19.4117 7.34517 19.7045 8.62689 19.7687C9.94787 19.8437 13.9073 19.8437 15.2282 19.7687C16.51 19.708 17.6453 19.4153 18.5807 18.4763C19.5161 17.5409 19.8089 16.4056 19.8731 15.1238C19.9481 13.8029 19.9481 9.84704 19.8731 8.52606ZM18.1665 16.5412C17.8881 17.241 17.349 17.7801 16.6456 18.0621C15.5924 18.4799 13.0932 18.3835 11.9294 18.3835C10.7655 18.3835 8.26272 18.4763 7.21307 18.0621C6.51331 17.7837 5.9742 17.2446 5.69215 16.5412C5.27444 15.488 5.37083 12.9888 5.37083 11.825C5.37083 10.6611 5.27801 8.15832 5.69215 7.10867C5.97063 6.40891 6.50974 5.8698 7.21307 5.58775C8.26629 5.17004 10.7655 5.26643 11.9294 5.26643C13.0932 5.26643 15.596 5.17361 16.6456 5.58775C17.3454 5.86623 17.8845 6.40534 18.1665 7.10867C18.5843 8.16189 18.4879 10.6611 18.4879 11.825C18.4879 12.9888 18.5843 15.4916 18.1665 16.5412Z" fill="currentColor" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {userContext?.user?.role === "user" && userContext.user.request !== "rejected" && (
                <div className='mt-8'>
                    <button onClick={handleCreatorRequest} className={`px-4 py-3 text-xl ${userContext.user?.request === "pending" ? "text-indigo-500 border-2 border-indigo-500" : "bg-indigo-500 text-white"} rounded-md`}>{userContext.user?.request === "pending" ? "Request Pending" : "Request To Be Creator"}</button>
                </div>
            )}

            <BlogGroup data={blogs} />

            {isFetching && <p>Loading...</p>}
            {!isFetching && (
                <button onClick={() => setCurrentPage(prev => prev + 1)} className="relative inline-block text-lg group mb-12">
                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                        <span className="relative">Load More</span>
                    </span>
                    <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
                </button>
            )}
        </div>
    )
}

export default Profile;