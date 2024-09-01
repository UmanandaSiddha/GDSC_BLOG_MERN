import { useNavigate } from "react-router-dom";

const AdminNavigation = () => {

    const navigate = useNavigate();

    return (
        <div className="w-full mb-6 border border-gray-300 px-6 lg:px-10 py-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Admin Navigation</h2>
            <hr className="mb-4 border" />
            <div className="mt-6 flex flex-col space-y-6">
                <button className="border px-4 py-2 rounded-lg text-md text-left hover:bg-gray-50" onClick={() => navigate("/dashboard/stats")}>Stats</button>
                <button className="border px-4 py-2 rounded-lg text-md text-left hover:bg-gray-50" onClick={() => navigate("/dashboard/user")}>All Users</button>
                <button className="border px-4 py-2 rounded-lg text-md text-left hover:bg-gray-50" onClick={() => navigate("/blogs")}>All Blogs</button>
                <button className="border px-4 py-2 rounded-lg text-md text-left hover:bg-gray-50" onClick={() => navigate("/dashboard/comment")}>All Comments</button>
            </div>
        </div>
    )
}

export default AdminNavigation;