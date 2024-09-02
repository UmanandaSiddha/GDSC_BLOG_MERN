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
import { Helmet } from 'react-helmet-async';

const AllUser = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>();
    const [keyword, setKeyword] = useState("");
    const [role, setRole] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openCreatorRequest, setOpenCreatorRequest] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [currentUser, setCurrentUser] = useState<string>();
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredUsers: 1,
        totalUsers: 1
    });
    const [filter, setFilter] = useState({
        role: "",
        blocked: false,
        request: ""
    });

    const fetchUsers = async (link: string) => {
        try {
            const { data }: { data: AllUsersResponse } = await axios.get(link, { withCredentials: true });
            setUsers(data.users);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredUsers: data.filteredUsersCount,
                totalUsers: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        let link = `${import.meta.env.VITE_BASE_URL}/admin/all?keyword=${keyword}&page=${counts.currentPage}`;
        if (filter.role) {
            link += `&role=${filter.role}`;
        }
        if (filter.blocked) {
            link += `&isBlocked=${filter.blocked}`;
        }
        if (filter.request) {
            link += `&request=${filter.request}`;
        }
        fetchUsers(link);
    }, [keyword, filter, counts.currentPage]);

    const updateRole = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!currentUser) {
            toast.warning("Invalid user");
            return;
        }

        if (!role) {
            toast.warning("Role is required");
            return;
        }

        try {
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/byId/${currentUser}`, { role }, { withCredentials: true });
            setUsers(users.map(user => user._id === currentUser ? { ...user, role: data.user.role } : user));
            toast.success("Roles updated successfully");
            setOpen(false);
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message);
            setOpen(false);
        }
    }

    const handleBlocked = async (id: string) => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/block/${id}`, { withCredentials: true });
            setUsers(users.map(user => user._id === currentUser ? { ...user, isBlocked: data.user.isBlocked } : user));
            toast.success("User Blocked successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDelete = async () => {
        if (!currentUser) {
            toast.warning("Invalid user");
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/byId/${currentUser}`, { withCredentials: true });
            setUsers(users.filter(user => user._id !== currentUser));
            toast.success("User Deleted successfully");
            setOpenDelete(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setOpenDelete(false);
        }
    }

    const handleAcceptCreatorRequest = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/request/accept/${currentUser}`, { withCredentials: true });
            toast.success("Creator Request Accepted successfully");
            setOpenCreatorRequest(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setOpenCreatorRequest(false);
        }
    }

    const handleRejectCreatorRequest = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/request/reject/${currentUser}`, { withCredentials: true });
            toast.success("Creator Request Rejected successfully");
            setOpenCreatorRequest(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
            setOpenCreatorRequest(false);
        }
    }

    const handleRejectAllCreatorRequest = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/request/rejectAll/all`, { withCredentials: true });
            toast.success("All Creator Request Rejected successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            <Helmet>
                <title>GDSC BLOG | Users Dashboard</title>
                <meta name="description" content="This is the users dashboard page of Google Developers Students Club" />
                <meta name="keywords" content="dashboard, user, react, blog, gdsc, google, tezpur" />
            </Helmet>

            <div className='bg-white'>
                <div className="container mt-16 pt-12 w-full lg:w-[85%] md:w-[95%] mx-auto p-6">
                    <div className="flex flex-col md:flex-row gap-6">

                        <div className="w-full md:w-2/6 h-[80vh] hidden md:flex justify-center items-center mx-auto">
                            <AdminNavigation />
                        </div>

                        <div className="w-full md:w-4/6 h-[80vh] mx-auto overflow-auto hide-scrollbar">
                            {open && (
                                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                    <div className="bg-white p-8 rounded-xl shadow-lg w-[425px]">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Update User Role</h2>
                                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpen(false)}>Close</button>
                                        </div>
                                        <form className="flex flex-col gap-4" onSubmit={updateRole}>
                                            <div className="flex flex-col gap-4">
                                                <label htmlFor="role" className="text-lg font-semibold">Role</label>
                                                <select value={role || users.find(user => user._id === currentUser)?.role} onChange={(e) => setRole(e.target.value)} className="border-2 px-1.5 py-1 rounded-lg">
                                                    <option value="user">USER</option>
                                                    <option value="creator">CREATOR</option>
                                                    <option value="admin">ADMIN</option>
                                                </select>
                                            </div>

                                            <button className="w-full px-3 py-2 text-white bg-blue-500 rounded-lg" type="submit">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {openView && (
                                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                    <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold mb-4 flex justify-center">User Details</h2>
                                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenView(false)}>Close</button>
                                        </div>

                                        {user?.avatar ? (
                                            <img height={100} width={100} className="object-cover h-12 w-12 text-center rounded-full" src={user?.avatar} alt="" />
                                        ) : (
                                            <div className='flex h-12 w-12 justify-center items-center bg-gray-300 rounded-full'>
                                                <p className='text-center text-3xl font-semibold'>{user?.name.split(' ').map(word => word[0]).join('')}</p>
                                            </div>
                                        )}
                                        <p>Name: {user?.name}</p>
                                        <p>Email: {user?.email}</p>
                                        <p>Blocked: {String(user?.isBlocked).toUpperCase()}</p>
                                        <p>Role: {user?.role.toUpperCase()}</p>
                                        <p>Account:
                                            {user?.account.map(item => (
                                                <span>{item.toUpperCase()}</span>
                                            ))}
                                        </p>
                                        <p>Socials:
                                            {user?.socials?.map(item => (
                                                <li>{item.platform.toUpperCase()} - {item.url}</li>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {openCreatorRequest && (
                                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                    <div className="bg-white p-8 rounded-xl shadow-lg w-[425px]">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold mb-4 flex justify-center">Creator Request</h2>
                                            <button className="px-3 py-2 border-2 rounded-lg" onClick={() => setOpenCreatorRequest(false)}>Close</button>
                                        </div>

                                        <h2 className="mt-6 text-xl font-semibold mb-4 flex justify-center">Accept or Reject Creator Request</h2>

                                        <div className="w-full flex justify-between items-center gap-4">
                                            <button className="w-1/2 px-3 py-2 border-2 rounded-lg bg-indigo-500 text-white" onClick={handleAcceptCreatorRequest}>Accept Request</button>
                                            <button className="w-1/2 px-3 py-2 border-2 rounded-lg bg-gray-500 text-white" onClick={handleRejectCreatorRequest}>Reject Request</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {openDelete && (
                                <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                                    <div className="bg-white p-8 rounded-xl shadow-lg w-[425px]">
                                        <h2 className="text-2xl font-bold mb-4 flex justify-center">Are you sure you want to delete this user?</h2>
                                        <div className="w-full flex justify-between items-center gap-4">
                                            <button className="w-1/2 px-3 py-2 border-2 rounded-lg bg-red-500 text-white" onClick={handleDelete}>Delete</button>
                                            <button className="w-1/2 px-3 py-2 border-2 rounded-lg" onClick={() => setOpenDelete(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="w-full mx-auto">
                                <div className="mb-6 px-6 lg:px-10 py-8 rounded-xl">
                                    <h2 className="text-3xl text-center font-bold mb-8">All Users</h2>
                                    <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
                                        <input type="text" value={keyword} onChange={(e) => {
                                            setKeyword(e.target.value);
                                            setCounts({ ...counts, currentPage: 1 });
                                        }} placeholder="Search email..." className="w-full text-md px-6 py-3 outline-none text-gray-700 border-2 border-gray-500 rounded-lg focus:border-black dark:focus:border-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50 focus:outline-none" />
                                    </div>

                                    <div className="w-full mx-auto mt-8 flex flex-wrap justify-center items-center gap-4">
                                        <div>
                                            <label htmlFor="">Roles</label>
                                            <select value={filter.role} onChange={(e) => {
                                                setFilter({ ...filter, role: e.target.value });
                                                setCounts({ ...counts, currentPage: 1 });
                                            }} className="border-2 px-1.5 py-1 rounded-lg">
                                                <option value="">ALL</option>
                                                <option value="user">USER</option>
                                                <option value="creator">CREATOR</option>
                                                <option value="admin">ADMIN</option>
                                            </select>
                                        </div>
                                        <div>
                                            <button onClick={() => {
                                                setFilter({ ...filter, blocked: !filter.blocked });
                                                setCounts({ ...counts, currentPage: 1 });
                                            }} className={`border-2 ${filter.blocked ? "bg-gray-500 text-white" : ""} px-3 py-1 rounded-full`}>Blocked</button>
                                        </div>
                                        <div className="">
                                            <label htmlFor="">Request</label>
                                            <select value={filter.request} onChange={(e) => {
                                                setFilter({ ...filter, request: e.target.value });
                                                setCounts({ ...counts, currentPage: 1 });
                                            }} className="border-2 px-1.5 py-1 rounded-lg">
                                                <option value="">ALL</option>
                                                <option value="pending">PENDING</option>
                                                <option value="accepted">ACCEPTED</option>
                                                <option value="rejected">REJECTED</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='mt-8 flex justify-center items-center gap-6'>
                                        <button
                                            onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                            disabled={counts.currentPage === 1}
                                            className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8"
                                        >
                                            <HiMiniArrowSmallLeft size={25} />
                                        </button>
                                        <p className="text-lg font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredUsers / counts.resultPerPage)}</p>
                                        <button
                                            onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                            disabled={counts.currentPage === Math.ceil(counts.filteredUsers / counts.resultPerPage)}
                                            className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8"
                                        >
                                            <HiMiniArrowSmallRight size={25} />
                                        </button>
                                    </div>

                                    {filter.request && filter.request === "pending" && (
                                        <div className='text-center mt-8'>
                                            <button onClick={handleRejectAllCreatorRequest} className="px-4 py-3 text-xl text-indigo-500 border-2 border-indigo-500 rounded-md">Reject All Request</button>
                                        </div>
                                    )}

                                    <div className="mt-6 w-full py-2 flex flex-col gap-4">
                                        {users?.map((user, index) => (
                                            <div key={index} className={`flex flex-col gap-4 ${user.isBlocked ? "bg-red-100" : user.role === "admin" ? "bg-green-100" : user.role === "creator" ? "bg-blue-100" : "bg-gray-100"} p-4 rounded-full`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                                                        ) : (
                                                            <div className='flex h-10 w-10 justify-center items-center bg-gray-300 rounded-full'>
                                                                <p className='text-center text-lg font-semibold'>{user?.name.split(' ').map(word => word[0]).join('')}</p>
                                                            </div>
                                                        )}
                                                        <p className="text-md font-semibold">{user.name}</p>
                                                        <p className="hidden lg:block text-gray-500 text-md">{user.email}</p>
                                                        <p className={`hidden md:block ${user.isBlocked ? "text-red-500" : user.role === "admin" ? "text-green-500" : user.role === "creator" ? "text-blue-500" : "text-gray-500"} text-md`}>{user.role.toUpperCase()}</p>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="p-2"><CiMenuKebab size={20} /></DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            {user?.request !== "pending" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setOpen(true)
                                                                        setCurrentUser(user._id)
                                                                        setRole(user.role)
                                                                    }}
                                                                >
                                                                    Update Role
                                                                </DropdownMenuItem>
                                                            )}
                                                            {user?.request === "pending" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setOpenCreatorRequest(true)
                                                                        setCurrentUser(user._id)
                                                                    }}
                                                                >
                                                                    Creator Request
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setOpenView(true)
                                                                    setUser(user)
                                                                }}
                                                            >
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleBlocked(user._id)}>{user.isBlocked ? "Un" : ""}Block User</DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setOpenDelete(true)
                                                                    setCurrentUser(user._id)
                                                                }}
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
        </>
    )
}

export default AllUser;