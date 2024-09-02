import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/custom/error-boundary";
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

import Navbar from "./components/custom/navbar";
import Footer from "./components/custom/footer";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ProtectedRoute from "./components/custom/protected-routes";
import { useUser } from "./context/user_context";
import Loader from "./components/custom/loader";
import ResetPassword from "./pages/auth/reset-password";
import Verify from "./pages/auth/verify";
import NotFound from "./pages/root/not-found";
import AuthorsPage from "./pages/author/all-author";
import AuthorPage from "./pages/author/author";

const Home = lazy(() => import("./pages/root/home"));
const Profile = lazy(() => import("./pages/root/profile"));
const CreatePost = lazy(() => import("./pages/blog/create-post"));
const BlogPost = lazy(() => import("./pages/blog/blog"));
const BlogPage = lazy(() => import("./pages/blog/all-post"));
const Dashboard = lazy(() => import("./pages/root/dashboard"));
const AllUser = lazy(() => import("./pages/admin/all-user"));
const AllComment = lazy(() => import("./pages/admin/all-comment"));
const Stats = lazy(() => import("./pages/admin/stats"));

const App = () => {

    const location = useLocation();
    const userContext = useUser();

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return userContext?.loading ? <Loader /> : (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-gray-900 text-white p-2 rounded-md"
                >
                    <IoIosArrowUp size={24} />
                </button>
            )}
            <ErrorBoundary>
                {!["/sign-in", "/sign-up"].includes(location.pathname) && (<Navbar />)}
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/blogs/blog" element={<BlogPost />} />
                        <Route path="/blogs" element={<BlogPage />} />
                        <Route path="/reset" element={<ResetPassword />} />
                        <Route path="/authors" element={<AuthorsPage />} />
                        <Route path="/authors/author" element={<AuthorPage />} />

                        <Route
                            element={<ProtectedRoute isAuthenticated={userContext?.user && userContext.user.role === "admin" ? true : false} redirect="/sign-in" />}
                        >
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/dashboard/user" element={<AllUser />} />
                            <Route path="/dashboard/comment" element={<AllComment />} />
                            <Route path="/dashboard/stats" element={<Stats />} />
                        </Route>

                        <Route
                            element={<ProtectedRoute isAuthenticated={userContext?.user && ["creator", "admin"].includes(userContext.user.role) ? true : false} redirect="/sign-in" />}
                        >
                            <Route path="/create" element={<CreatePost />} />
                        </Route>

                        <Route
                            element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/sign-in" />}
                        >
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/create" element={<CreatePost />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
                {!["/sign-in", "/sign-up"].includes(location.pathname) && (<Footer />)}
            </ErrorBoundary>
        </div>
    )
}

export default App;