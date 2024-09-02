import AdminNavigation from "@/components/custom/admin-navigation";
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
    return (
        <>
            <Helmet>
                <title>GDSC BLOG | Dashboard</title>
                <meta name="description" content="This is the dashboard page of Google Developers Students Club" />
                <meta name="keywords" content="dashboard, react, blog, gdsc, google, tezpur" />
            </Helmet>

            <div className='bg-white'>
                <div className="container mt-16 pt-12 w-full lg:w-[85%] md:w-[95%] mx-auto p-6">
                    <div className="flex flex-col md:flex-row gap-6">

                        <div className="w-full md:w-2/6 h-[80vh] flex justify-center items-center mx-auto">
                            <AdminNavigation />
                        </div>

                        <div className="hidden md:block w-full md:w-4/6">
                            <div className="w-full mx-auto">
                                <div className="mb-6 px-6 lg:px-10 py-8 rounded-xl">
                                    <h1 className="text-3xl font-semibold text-center">Admin Dashboard</h1>
                                    <p className="text-xl text-center font-normal my-8">Navigate to all routes</p>

                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;