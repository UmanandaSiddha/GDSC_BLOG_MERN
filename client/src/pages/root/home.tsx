import HomeBlog from '@/components/custom/home-blog';
import { MdArrowOutward } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center bg-white dark:bg-gray-900'>
            {/* <div className="relative isolate px-6 py-32 lg:px-24">
                <div className='flex flex-col justify-center items-center gap-8'>
                    <img className='w-auto h-20' src="/gdsc_color.png" alt='gdsc-logo' />
                    <h1 className='text-7xl text-gray-500 font-normal text-center' style={{ transform: 'scaleY(0.9)' }}>Google Developer Student Clubs</h1>
                </div>
            </div> */}

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-5xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <div className='flex justify-center items-center'>
                            <img className='w-auto h-36' src="/gdsc_color.png" alt='gdsc-logo' />
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">Google Students Developer Club</h1>
                        </div>
                        <p className="mt-6 text-xl leading-8 text-gray-600">
                            Tezpur University
                        </p>
                    </div>
                </div>
            </div>

            <HomeBlog />

            <div className='w-full lg:w-[85%] mx-auto px-4 md:px-16'>
                <div className='flex justify-between items-center m-4'>
                    <p className='text-3xl font-semibold'>Top Authors</p>
                    <Link to="/authors" className='hidden md:flex justify-center items-center gap-2 text-md'>
                        all authors
                        <span><MdArrowOutward /></span>
                    </Link>
                </div>
                <hr className="rounded-full border" />
                <div className='flex flex-wrap justify-center items-center w-full my-8 gap-4 lg:gap-8'>
                    {
                        [1, 2, 3].map(item => (
                            <Link to="/authors/author?id=34" key={item} className="w-[85%] md:w-fit flex justify-evenly items-center gap-8 px-6 py-4 border border-gray-300 dark:border-gray-600 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 dark:shadow-gray-800 hover:shadow-xl rounded-2xl transform transition-transform duration-100 hover:-translate-y-2">
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