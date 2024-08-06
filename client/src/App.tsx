import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/custom/error-boundary";
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";

import Navbar from "./components/custom/navbar";
import Footer from "./components/custom/footer";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ProtectedRoute from "./components/custom/protected-routes";
import { useUser } from "./context/user_context";
import Loader from "./components/custom/loader";
import ResetPassword from "./pages/auth/reset-password";
import Verify from "./pages/auth/verify";

const Home = lazy(() => import("./pages/home"));
const Profile = lazy(() => import("./pages/profile"));
const CreatePost = lazy(() => import("./pages/create-post"));
const BlogPost = lazy(() => import("./pages/blog"));
const BlogPage = lazy(() => import("./pages/all-post"));

const App = () => {

    const location = useLocation();
    const userContext = useUser();

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
                        <Route path="/verify" element={<Verify />} />

                        <Route
                            element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/sign-in" />}
                        >
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/create" element={<CreatePost />} />
                        </Route>
                    </Routes>
                </Suspense>
                {!["/sign-in", "/sign-up"].includes(location.pathname) && (<Footer />)}
            </ErrorBoundary>
        </div>
    )
}

export default App;