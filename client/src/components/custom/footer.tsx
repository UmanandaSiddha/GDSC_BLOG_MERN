import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t-2">
            <div className="container flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
                <Link to="/" className='flex justify-center items-center gap-4'>
                    <img height={80} width={80} className="w-auto h-7" src="/gdsc_color.png" alt="" />
                    <span>GDSC Blog</span>
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
                    <Link to="#" className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                        Overview
                    </Link>

                    <Link to="#" className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                        Features
                    </Link>

                    <Link to="#" className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                        Pricing
                    </Link>
                    <Link to="#" className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                        Careers
                    </Link>

                    <Link to="#" className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                        Help
                    </Link>

                    <Link to="#" className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                        Privacy
                    </Link>
                </div>

                <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">© Copyright 2024 GDSC Blog. </p>
            </div>
        </footer>
    )
}

export default Footer;