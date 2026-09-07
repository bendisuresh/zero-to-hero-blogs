import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateStory from "./pages/CreateStory";
import AddAdditionalStory from "./pages/AddAdditionalStory";
import EditStory from "./pages/EditStory";

import ProtectedRoute from "./components/ProtectedRoute";

import Post from "./pages/Post";
import NotFound from "./pages/NotFound";


function App() {
    return (
        <BrowserRouter>

            {/* Navbar is displayed on all pages */}
            <Navbar />

            {/* Define all website routes */}
            <Routes>

                {/* Home page */}
                <Route
                    path="/"
                    element={<Home />}
                />


                {/* =========================
                    PUBLIC CATEGORY PAGES
                   ========================= */}

                {/* Business */}
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

                {/* Job */}
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

                {/* Investment */}
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

                {/* Other */}
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


                {/* =========================
                    PUBLIC STORY PAGE
                   ========================= */}

                <Route
                    path="/post/:id"
                    element={<Post />}
                />


                {/* =========================
                    ADMIN LOGIN
                   ========================= */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />


                {/* =========================
                    PROTECTED ADMIN PAGES
                   ========================= */}

                {/* Admin Dashboard */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Create Story */}
                <Route
                    path="/admin/create-story"
                    element={
                        <ProtectedRoute>
                            <CreateStory />
                        </ProtectedRoute>
                    }
                />

                {/* Edit Story */}
                <Route
                    path="/admin/posts/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditStory />
                        </ProtectedRoute>
                    }
                />

                {/* Add Additional Story */}
                <Route
                    path="/admin/posts/:id/additional-story"
                    element={
                        <ProtectedRoute>
                            <AddAdditionalStory />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    404 PAGE
                   ========================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;