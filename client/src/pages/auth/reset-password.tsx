import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@/context/user_context";

const ResetPassword = () => {

    const navigate = useNavigate();
    const userContext = useUser();
    const [search] = useSearchParams();
    const token = search.get("token");
    const user = search.get("user");
    const [resetLoading, setResetLoading] = useState<boolean>(false);

    const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResetLoading(true);
        const resetData = {
            ...password,
            user,
        }
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/password/reset/${token}`, resetData, config);
            userContext?.setUser(data.user);
            toast.success("Password Reset Successfully");
            navigate("/profile");
        } catch (error: any) {
            userContext?.setUser(null);
            toast.error(error.response.data.message);
        }
        setResetLoading(false);
    }

    return (
        <div className="w-full max-w-md px-12 p-4 m-auto mx-auto mt-32 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center space-y-2 mt-4 mx-auto">
                <h1 className='text-4xl font-bold'>Reset Password</h1>
                <p className='text-md'>blah blah</p>
            </div>

            <form className="mt-8" onSubmit={handleSubmit}>
                <div className='my-2'>
                    <label htmlFor="name" className="block text-md text-gray-800 dark:text-gray-200">New Password</label>
                    <input
                        type="password"
                        name='password'
                        placeholder='Enter new password'
                        value={password.newPassword}
                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value})}
                        className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </div>

                <div className='my-2'>
                    <label htmlFor="email" className="block text-md text-gray-800 dark:text-gray-200">Confirm Password</label>
                    <input
                        type="password"
                        name='confirmPassword'
                        placeholder='Enter password again'
                        value={password.confirmPassword}
                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value})}
                        className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </div>

                <div className="mt-8 mb-6">
                    <button disabled={resetLoading} type='submit' className="w-full px-6 py-2.5 text-md font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                        {resetLoading ? "Hold on" : "Reset Password"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword;