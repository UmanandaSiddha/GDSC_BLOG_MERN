import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t-2">
            <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between px-6 py-8 lg:flex-row">
                <Link to="/" className='flex justify-center items-center gap-4'>
                    <img height={80} width={80} className="w-auto h-7" src="/gdsc_color.png" alt="" />
                    <span className="text-gray-500 font-gdg font-semibold text-lg">Google Developer Groups</span>
                </Link>

                <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">© Copyright 2024 GDG Blog. </p>
            </div>
        </footer>
    )
}

export default Footer;