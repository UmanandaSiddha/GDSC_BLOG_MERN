import AdminNavigation from '@/components/custom/admin-navigation';
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { HiMiniArrowSmallLeft } from "react-icons/hi2";

const Stats = () => {
    return (
        <div className='bg-white'>
            <div className="container mt-16 pt-12 w-full lg:w-[85%] md:w-[95%] mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">

                    <div className="w-full md:w-2/6 h-[80vh] hidden md:flex justify-center items-center mx-4">
                        <AdminNavigation />
                    </div>

                    <div className="w-full md:w-4/6 h-[80vh] mx-auto overflow-auto hide-scrollbar">
                        <div className="w-full mx-auto">
                            <div className="mb-6 px-6 lg:px-10 py-8 rounded-xl">
                                <h2 className="text-3xl text-center font-bold mb-8">Blog Stats</h2>
                                <div className='flex justify-center items-center gap-6'>
                                    <button onClick={() => { }} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                        <HiMiniArrowSmallLeft size={25} />
                                    </button>
                                    <p className="text-lg font-semibold">1 / 10</p>
                                    <button onClick={() => { }} className="flex justify-center items-center bg-slate-300 rounded-full h-8 w-8">
                                        <HiMiniArrowSmallRight size={25} />
                                    </button>
                                </div>
                                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Users</h1>
                                        <p>Count - 10</p>
                                    </div>
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Admins</h1>
                                        <p>Count - 10</p>
                                    </div>
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Creators</h1>
                                        <p>Count - 10</p>
                                    </div>
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Blocked</h1>
                                        <p>Count - 10</p>
                                    </div>
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Blogs</h1>
                                        <p>Count - 10</p>
                                    </div>
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Comments</h1>
                                        <p>Count - 10</p>
                                    </div>
                                    <div className='border bg-gray-50 rounded-lg p-4'>
                                        <h1 className='text-2xl font-semibold'>Likes</h1>
                                        <p>Count - 10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats;