import HomeBlog from '@/components/custom/home-blog';
import { MdArrowOutward } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center bg-white dark:bg-gray-900'>
            <div className="relative isolate px-6 py-32 lg:px-24">
                <div className='flex flex-col justify-center items-center gap-8'>
                    <img className='w-auto h-20' src="/gdsc_color.png" alt='gdsc-logo' />
                    <h1 className='text-7xl text-gray-500 font-normal text-center' style={{ transform: 'scaleY(0.9)' }}>Google Developer Student Clubs</h1>
                </div>
            </div>

            <HomeBlog />

            <div className='w-[85%] mx-auto px-16'>
                <div className='flex justify-between items-center m-4'>
                    <p className='text-3xl font-semibold'>Top Authors</p>
                    <Link to="/author" className='flex justify-center items-center gap-2 text-md'>
                        all authors
                        <span><MdArrowOutward /></span>
                    </Link>
                </div>
                <hr className="rounded-full border" />
                <div className='flex flex-wrap justify-center items-center w-full my-8 gap-8'>
                    {
                        [1, 2, 3].map(item => (
                            <Link to="/author/34" key={item} className="flex flex-col lg:flex-row justify-center items-center gap-8 px-6 py-4 border border-gray-300 dark:border-gray-600 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 dark:shadow-gray-800 hover:shadow-xl rounded-2xl transform transition-transform duration-100 hover:-translate-y-2">
                                <img height={100} width={100} className="object-cover rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt="" />
                                <div className='flex flex-col justify-center mr-6'>
                                    <h1 className="text-xl font-semibold text-gray-700 dark:text-white">John Doe</h1>
                                    <p className="text-gray-500 dark:text-gray-300">Design Director</p>
                                    <p className="text-gray-500 dark:text-gray-300">03 published post</p>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Home;