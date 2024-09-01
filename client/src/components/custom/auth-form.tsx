import { useUser } from "@/context/user_context";
import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "@/config/firebase";

const AuthForm = ({ type }: { type: string }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useUser();

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const from = location.state?.from?.pathname || "/profile";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginLoading(true);
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };
        if (type === "sign-in") {
            if (!userData.email || !userData.password) {
                toast.warning("All fields are required");
                return;
            }
            try {
                const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, userData, config);
                userContext?.setUser(data.user);
                toast.success("Logged In!");
                navigate(from, { replace: true });
            } catch (error: any) {
                userContext?.setUser(null);
                toast.error(error.response.data.message);
                setLoginLoading(false);
            }
        } else {
            if (!userData.name || !userData.email || !userData.password) {
                toast.warning("All fields are required");
                return;
            }
            try {
                const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, userData, config);
                userContext?.setUser(data.user);
                toast.success("Logged In!");
                navigate("/verify");
            } catch (error: any) {
                userContext?.setUser(null);
                toast.error(error.response.data.message);
                setLoginLoading(false);
            }
        }
        setLoginLoading(false);
    };

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);

    const onForgot = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setForgotLoading(true);
        if (!userData.email) {
            toast.warning("Email is required");
            return;
        }
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };
        try {
            const { data }: { data: any } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/password/forgot`, { email: userData.email }, config);
            setIsOpen(false);
            toast.success(data.message);
        } catch (error: any) {
            setIsOpen(false);
            toast.error(error.response.data.message);
        }
        setForgotLoading(false);
    };

    function handleOnClose(e: React.MouseEvent<HTMLInputElement>) {
        if ((e.target as Element).id === "popupform") {
            setIsOpen(false);
        }
    }

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const { data }: { data: UserResponse } = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/google/login`, { token: token }, { withCredentials: true });
            userContext?.setUser(data.user);
            toast.success("Logged In!");
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="w-full max-w-md px-12 p-4 m-auto mx-auto mt-8 mb-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center space-y-2 mt-4 mx-auto">
                <h1 className='text-5xl font-bold'>{type === "sign-in" ? "Sign in" : "Sign up"}</h1>
                <p className='text-md'>{type === "sign-in" ? "Sign in" : "Sign up"} to your account</p>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
                    id="popupform"
                    onClick={handleOnClose}
                >
                    <div className="w-full max-w-md">
                        <form onSubmit={onForgot} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                            <div className="text-center">
                                <p className="m-3 text-3xl font-semibold text-gray-700 dark:text-gray-300">Request Reset Password</p>
                            </div>
                            <div className="mt-8 mb-8">
                                <label htmlFor="email" className="block mb-2 text-md font-semibold text-gray-600 dark:text-gray-200">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="example@example.com"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                    type="submit"
                                    disabled={forgotLoading}
                                >
                                    {forgotLoading ? "Sending..." : "Send Email"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className='mt-8'>
                <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <svg className="w-6 h-6 mx-2" viewBox="0 0 40 40">
                        <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                        <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                        <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                        <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                    </svg>
                    <span className="mx-2">{type === "sign-in" ? "Sign in" : "Sign up"} with Google</span>
                </button>

                <Link to="#" className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <svg className="w-6 h-6 mx-2" width="20" height="20" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#1B1F23" />
                    </svg>
                    <span className="mx-2">{type === "sign-in" ? "Sign in" : "Sign up"} with Github</span>
                </Link>
            </div>

            <div className="flex items-center justify-between mt-6">
                <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">OR {type === "sign-in" ? "sign in" : "sign up"} with email</p>
                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
            </div>

            <form className="mt-8" onSubmit={handleSubmit}>
                {type === "sign-up" && (
                    <div className='my-2'>
                        <label htmlFor="name" className="block text-md text-gray-800 dark:text-gray-200">Name</label>
                        <input
                            type="text"
                            name='name'
                            placeholder='Enter full name'
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                )}

                <div className='my-2'>
                    <label htmlFor="email" className="block text-md text-gray-800 dark:text-gray-200">Email</label>
                    <input
                        type="text"
                        name='email'
                        placeholder='Enter email'
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </div>

                {type === "sign-up" ? (
                    <div className='my-2'>
                        <label htmlFor="password" className="block text-md text-gray-800 dark:text-gray-200">Password</label>
                        <input
                            type="text"
                            name='password'
                            placeholder='Enter password'
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-md text-gray-800 dark:text-gray-200">Password</label>
                            <button type="button" onClick={() => setIsOpen(true)} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">Forget Password?</button>
                        </div>

                        <input
                            type="text"
                            name='password'
                            placeholder='Enter password'
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                )}

                <div className="mt-6">
                    <button disabled={loginLoading} type='submit' className="w-full px-6 py-2.5 text-md font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                        {type === "sign-in" ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </form>

            <p className="mt-8 mb-4 text-md font-light text-center text-gray-400"> {type === "sign-in" ? "Don't have an account?" : "Already have an account?"} <Link to={type === "sign-in" ? "/sign-up" : "/sign-in"} className="font-medium text-gray-700 dark:text-gray-200 hover:underline">{type === "sign-up" ? "Sign In" : "Sign Up"}</Link></p>
        </div>
    )
}

export default AuthForm;