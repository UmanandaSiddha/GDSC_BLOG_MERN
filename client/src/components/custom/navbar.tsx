import { HiMenuAlt3 } from 'react-icons/hi';
import { Button } from '../ui/button';
import { IoIosLogOut } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/user_context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from 'axios';
import { toast } from 'react-toastify';

const navigation = [
    { name: 'Home', to: '/' },
    { name: 'Blogs', to: '/blogs' },
    { name: 'About Us', to: 'https://gdsc-features.vercel.app/' },
    { name: 'Author', to: '/authors' },
];

const Navbar = () => {

    const userContext = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [mobileMenuOpen]);

    const handleLogOut = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, { withCredentials: true });
            userContext?.setUser(null);
            navigate("/sign-in");
            toast.success("Logged Out");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b-2 dark:border-gray-500 bg-white dark:bg-gray-900">
            <nav aria-label="Global" className="mx-auto max-w-7xl flex items-center justify-between p-5 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="flex justify-center items-center space-x-2 -m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            height={80}
                            width={80}
                            alt="gdsc-logo"
                            src="/gdsc_black.png"
                            className="h-6 w-auto"
                        />
                        <p className='text-lg text-gray-900 font-semibold dark:text-white'>GDSC</p>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        <HiMenuAlt3 className='h-6 w-6' />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.to} className="text-md font-semibold leading-6 text-gray-900 dark:text-white">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="cursor-pointer hidden lg:flex lg:flex-1 lg:justify-end gap-4">
                    {/* <ModeToggle /> */}
                    {userContext?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className='flex justify-center items-center gap-2'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='text-md font-semibold'>{userContext.user.name.split(" ")[0]}</p>
                                        <p className='text-sm'>{userContext.user.role.toUpperCase()}</p>
                                    </div>
                                    <div className='h-12 w-12'>
                                        {userContext.user.avatar ? (
                                            <img className="object-cover h-full w-full text-center rounded-full" src={userContext.user.avatar} alt="" />
                                        ) : (
                                            <div className='flex h-full w-full justify-center items-center bg-gray-300 rounded-full'>
                                                <p className='text-center text-lg font-semibold'>{userContext?.user?.name.split(' ').map(word => word[0]).join('')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {location.pathname !== "/profile" && (
                                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                                            Profile
                                        </DropdownMenuItem>
                                    )}
                                    {location.pathname !== "/create" && userContext.user.role !== "user" && (
                                        <DropdownMenuItem onClick={() => navigate("/create")}>
                                            Create New Blog
                                        </DropdownMenuItem>
                                    )}
                                    {location.pathname !== "/dashboard" && userContext.user.role === "admin" && (
                                        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                                            Dashboard
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogOut}>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline" className='mt-0' onClick={() => navigate("/sign-in")}>Sign in</Button>
                    )}
                </div>
            </nav>

            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="hide-scrollbar lg:hidden fixed inset-0 bg-opacity-30 backdrop-blur z-10"
                >
                    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white dark:bg-gray-900 border-r rtl:border-r-0 rtl:border-l">
                        <Link to='/' className="flex items-center space-x-2">
                            <img className="w-auto h-6 sm:h-6" src="/gdsc_black.png" alt="" />
                            <p className='text-lg text-gray-900 font-semibold dark:text-white'>GDSC</p>
                        </Link>

                        <div className="flex flex-col justify-between flex-1 mt-6">
                            <nav>
                                <hr className="my-4 border-gray-200 dark:border-gray-800" />


                                {navigation.map((item) => (
                                    <Link key={item.name} to={item.to} className={`flex items-center px-4 py-2 mt-3 rounded-md ${location.pathname === item.to ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                        <span className="mx-4 font-medium">{item.name}</span>
                                    </Link>
                                ))}

                                {userContext?.user && (
                                    <>
                                        <hr className="my-6 border-gray-200 dark:border-gray-600" />
                                        <Link to="/profile" className={`flex items-center px-4 py-2 mt-3 rounded-md ${location.pathname === "/profile" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                            <span className="mx-4 font-medium">Profile</span>
                                        </Link>
                                        {userContext.user.role !== "user" && (
                                            <Link to="/create" className={`flex items-center px-4 py-2 mt-3 rounded-md ${location.pathname === "/create" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                                <span className="mx-4 font-medium">Create New Blog</span>
                                            </Link>
                                        )}
                                        {userContext.user.role === "admin" && (
                                            <Link to="/dashboard" className={`flex items-center px-4 py-2 mt-3 rounded-md ${location.pathname === "/dashboard" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                                <span className="mx-4 font-medium">Dashboard</span>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>

                            {userContext?.user ? (
                                <div className="cursor-pointer flex items-center justify-between px-4 -mx-2">
                                    <Link to="/profile" className='flex items-center'>
                                        <img className='rounded-full h-10 w-10' src={userContext.user.avatar} alt="avatar" />
                                        <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">{userContext.user.name}</span>
                                    </Link>
                                    <IoIosLogOut onClick={handleLogOut} className="object-cover mx-2 rounded-full h-6 w-6" />
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center px-4 py-2 rounded-md bg-gray-800 text-gray-200">
                                    Login
                                </Link>
                            )}
                        </div>
                    </aside>
                </div>
            )}
        </header>
    )
}

export default Navbar