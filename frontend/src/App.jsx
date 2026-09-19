import {
    lazy,
    Suspense,
} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import "./components/RouteLoading.css";
import "./components/StateComponents.css";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Post = lazy(() => import("./pages/Post"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateStory = lazy(() => import("./pages/CreateStory"));
const AddAdditionalStory = lazy(
    () => import("./pages/AddAdditionalStory")
);
const EditStory = lazy(() => import("./pages/EditStory"));

const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoading() {
    return (
        <main className="route-loading">
            <div className="route-loading-content">
                <span className="route-loading-spinner"></span>
                <p>Loading...</p>
            </div>
        </main>
    );
}

function App() {
    return (
        <BrowserRouter>
        <ScrollToTop />
            <Navbar />

            <Suspense fallback={<RouteLoading />}>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/business"
                        element={
                            <CategoryPage
                                category="Business"
                                title="Business Stories"
                                description="Learn from entrepreneurs, companies, leadership journeys, failures, and business lessons."
                            />
                        }
                    />

                    <Route
                        path="/job"
                        element={
                            <CategoryPage
                                category="Job"
                                title="Career Stories"
                                description="Learn from successful careers, career changes, challenges, and professional growth."
                            />
                        }
                    />

                    <Route
                        path="/investment"
                        element={
                            <CategoryPage
                                category="Investment"
                                title="Investment Stories"
                                description="Learn from investment journeys, strategies, mistakes, failures, and lessons."
                            />
                        }
                    />

                    <Route
                        path="/other"
                        element={
                            <CategoryPage
                                category="Other"
                                title="Other Journeys"
                                description="Explore inspiring journeys from sports, entertainment, and other fields."
                            />
                        }
                    />

                    <Route
                        path="/stories"
                        element={
                            <CategoryPage
                                category=""
                                title="All Stories"
                                description="Explore stories, journeys, lessons, and experiences from across Zero to Hero."
                            />
                        }
                    />

                    <Route
                        path="/post/:id"
                        element={<Post />}
                    />

                    <Route
                        path="/admin/login"
                        element={<AdminLogin />}
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/create-story"
                        element={
                            <ProtectedRoute>
                                <CreateStory />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/posts/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditStory />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/posts/:id/additional-story"
                        element={
                            <ProtectedRoute>
                                <AddAdditionalStory />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;