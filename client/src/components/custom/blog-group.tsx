import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const BlogGroup = ({ data }: { data: Blog[]}) => {
    return (
        <section className="bg-white dark:bg-gray-900 w-full mb-8">
            <div className="container w-[95%] lg:w-[85%] px-2 md:px-6 lg:px-16 py-10 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {data.map((item, index) => (
                        <Link to={`/blogs/blog?id=${item._id}`} className='group' key={index}>
                            <img width={500} height={500} className="object-cover object-center w-full rounded-lg h-72 transition-transform duration-300 transform group-hover:scale-105" src={item.image} alt={item.author.name} />
                            <div className="mt-8">
                                <div className="group text-gray-800 transition-all duration-300 ease-in-out dark:text-gray-200">
                                    <span className="bg-left-bottom bottom-[-2px] text-xl font-semibold bg-gradient-to-r from-purple-300 dark:from-purple-700 to-purple-300 dark:to-purple-700 bg-[length:0%_12px] bg-no-repeat group-hover:bg-[length:100%_11px] transition-all duration-500 ease-out">
                                        {item.title}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    {item.description}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <div className='flex items-center justify-evenly space-x-1.5'>
                                        <Avatar className='h-7 w-7'>
                                            <AvatarImage src={item.author.avatar} alt={item.author.name} />
                                            <AvatarFallback>{item.author.name.split(' ').map(word => word[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.author.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">•</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{String(new Date(item.createdAt).toDateString())}</p>
                                    </div>
                                    
                                    <div className="inline-block px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">Technology</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BlogGroup;