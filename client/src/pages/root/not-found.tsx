import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col bg-white justify-center items-center space-y-6 mt-16 pb-16">
            <img src="/404.svg" alt="404" className="h-84 w-auto" />
            <h1 className="text-4xl lg:text-4xl font-bold">Oops! Page Not Found.</h1>
            <p className="text-lg max-w-[80%] px-2 md:max-w-[70%] lg:max-w-[50%] text-center text-gray-500">The page you are looking for is not available or has been moved. Try a different page or go to homepage with the button below.</p>
            <Button onClick={() => navigate("/")} className="text-md px-6 py-6">Go To Home</Button>
        </div>
    )
}

export default NotFound;