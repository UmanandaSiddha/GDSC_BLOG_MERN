import HomeBlog from '@/components/custom/home-blog';
import { LuMouse } from "react-icons/lu";
import { Helmet } from 'react-helmet-async';
// import { MdArrowOutward } from 'react-icons/md';
// import { Link } from 'react-router-dom';

const Home = () => {

    const handleScroll = () => {
        window.scrollBy({
            top: window.innerHeight - 100,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <Helmet>
                <title>GDSC BLOG | Home</title>
                <meta name="description" content="This is the home page of Google Developers Students Club" />
                <meta name="keywords" content="home, react, blog, gdsc, google, tezpur" />
            </Helmet>

            <div className='flex flex-col items-center justify-center bg-white dark:bg-gray-900'>

                <div className="mt-48 md:mt-32 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                    <header className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center md:text-left">
                        <img
                            src="/gdsc_color.png"
                            alt="GDSC Logo"
                            className="w-[70%] md:w-[80%] h-auto max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm drop-shadow-2xl"
                        />
                        <div className='mt-8 flex flex-col justify-center items-center'>
                            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold font-gdg text-gray-500 mb-4 md:mb-6 leading-tight">
                                Google Developer Groups
                            </h1>
                            <h3 className='sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-gray-500 font-normal font-gdg'><span className='text-blue-400 font-semibold'>On Campus</span> • TEZPUR UNIVERSITY</h3>
                        </div>
                    </header>

                    <button onClick={handleScroll} className='mt-12 mb-16 flex flex-col justify-center items-center'>
                        <LuMouse size={30} className='text-gray-500 ' />
                        <span className='text-gray-500 font-semibold'>Scroll Down</span>
                    </button>
                </div>

                <HomeBlog />

                {/* <div className='w-full lg:w-[85%] mx-auto px-4 md:px-16'>
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
                </div> */}
            </div>
        </>
    )
}

export default Home;