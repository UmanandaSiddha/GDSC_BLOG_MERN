import { Link } from "react-router-dom";

const navigation = [
    { name: 'Home', to: '/' },
    { name: 'Blogs', to: '/blogs' },
    { name: 'About Us', to: 'https://gdsc-features.vercel.app/' },
    { name: 'Author', to: '/authors' },
];

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t-2">
            <div className="container mx-auto max-w-7xl flex flex-col items-center justify-between px-6 py-8 lg:flex-row">
                <Link to="/" className='flex justify-center items-center gap-4'>
                    <img height={80} width={80} className="w-auto h-7" src="/gdsc_color.png" alt="" />
                    <span>GDSC Blog</span>
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-6 lg:gap-6 lg:mt-0">
                    {navigation.map((item, index) => (
                        <Link key={index} to={item.to} className="text-md text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
                            {item.name}
                        </Link>
                    ))}
                </div>

                <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">© Copyright 2024 GDSC Blog. </p>
            </div>
        </footer>
    )
}

export default Footer;