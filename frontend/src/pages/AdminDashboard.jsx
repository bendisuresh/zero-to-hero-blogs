import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import apiFetch from "../services/api";
import useAuth from "../hooks/useAuth";

import AdminStoryList from "../components/AdminStoryList";
import AdminCommentList from "../components/AdminCommentList";
import Pagination from "../components/Pagination";
import AdminStatCard from "../components/AdminStatCard";


function AdminDashboard() {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        logout,
    } = useAuth();

    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState("");
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    const [summary, setSummary] = useState({
        total_stories: 0,
        total_comments: 0,
        total_views: 0,
        total_likes: 0,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("latest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const getDashboard = async () => {

        if (!isAuthenticated) {
            navigate("/admin/login");
            return;
        }

        try {
                // Check whether the admin token is valid
                const dashboardData =
                    await apiFetch("/api/admin/dashboard");

                setMessage(dashboardData.message);
                setAdmin(dashboardData.admin);


                // Get dashboard summary
                const summaryData =
                    await apiFetch("/api/admin/summary");

                setSummary(summaryData);


                // Get admin stories with search,
                // category filtering, sorting and pagination
                const params = new URLSearchParams({
                    page: page,
                    limit: 10,
                    sort: sort,
                });

                if (searchTerm) {
                    params.set("search", searchTerm);
                }

                if (category) {
                    params.set("category", category);
                }

                const postsData =
                    await apiFetch(
                        `/api/admin/posts?${params.toString()}`
                    );

                const fetchedPosts =
                    postsData.posts || [];

                setPosts(fetchedPosts);

                setTotalPages(
                    postsData.total_pages || 1
                );


                // Get comments from every story
                const allComments = [];

                for (const post of fetchedPosts) {
                    let commentsData;

try {

    commentsData =
        await apiFetch(
            `/api/posts/${post.id}/comments`
        );

} catch {

    continue;

}

                    commentsData.forEach((comment) => {
                        allComments.push({
                            ...comment,
                            post_id: post.id,
                            post_title: post.title,
                        });
                    });
                }

                setComments(allComments);
            } catch (error) {

    if (
        error.status === 401 ||
        error.status === 422
    ) {
        logout();
        navigate("/admin/login");
        return;
    }

    setError(
        "Unable to connect to the server"
    );

} finally {
                setLoading(false);
            }
        };

        getDashboard();
    }, [
        navigate,
        isAuthenticated,
        logout,
        page,
        searchTerm,
        category,
        sort,
    ]);


    const handleLogout = () => {
    logout();
    navigate("/admin/login");
};


    const handleCreateStory = () => {
        navigate("/admin/create-story");
    };


    const handleViewStory = (id) => {
        navigate(`/post/${id}`);
    };


    const handleAddStory = (id) => {
        navigate(
            `/admin/posts/${id}/additional-story`
        );
    };


    const handleEditStory = (id) => {
        navigate(`/admin/posts/${id}/edit`);
    };


    const handleDeleteStory = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this story?"
        );

        if (!confirmed) {
            return;
        }

        if (!isAuthenticated) {
    navigate("/admin/login");
    return;
}

        try {
            await apiFetch(
    `/api/admin/posts/${id}`,
    {
        method: "DELETE",
    }
);

            // Remove deleted story from the screen
            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== id
                )
            );

            // Update summary count
            setSummary((currentSummary) => ({
                ...currentSummary,
                total_stories:
                    Math.max(
                        0,
                        currentSummary.total_stories - 1
                    ),
            }));
        } catch {
            setError(
                "Unable to connect to the server"
            );
        }
    };


    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        if (!isAuthenticated) {
    navigate("/admin/login");
    return;
}

        try {
            await apiFetch(
    `/api/admin/comments/${commentId}`,
    {
        method: "DELETE",
    }
);

            // Remove deleted comment from the screen
            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment.id !== commentId
                )
            );

            // Update summary count
            setSummary((currentSummary) => ({
                ...currentSummary,
                total_comments:
                    Math.max(
                        0,
                        currentSummary.total_comments - 1
                    ),
            }));
        } catch {
            setError(
                "Unable to connect to the server"
            );
        }
    };


    if (loading) {
        return (
            <main className="admin-page">
                <div className="admin-message">
                    <h2>Loading dashboard...</h2>
                </div>
            </main>
        );
    }


    if (error) {
        return (
            <main className="admin-page">
                <div className="admin-message">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }


    return (
        <main className="admin-page">

            {/* Dashboard header */}
            <section className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>

                    <p>{message}</p>

                    <p>
                        Logged in as:{" "}
                        <strong>{admin}</strong>
                    </p>
                </div>

                <div className="admin-header-actions">
                    <button
                        type="button"
                        onClick={handleCreateStory}
                        className="admin-primary-button"
                    >
                        Create Story
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="admin-secondary-button"
                    >
                        Logout
                    </button>
                </div>
            </section>


            {/* Dashboard summary */}
            <section className="admin-stats-grid">

                <AdminStatCard
                    title="Total Stories"
                    value={summary.total_stories}
                    description="All stories"
                />

                <AdminStatCard
                    title="Total Comments"
                    value={summary.total_comments}
                    description="Across all stories"
                />

                <AdminStatCard
                    title="Total Views"
                    value={summary.total_views}
                    description="Across all stories"
                />

                <AdminStatCard
                    title="Total Likes"
                    value={summary.total_likes}
                    description="Across all stories"
                />

            </section>


            {/* Stories section */}
            <section className="admin-section">

                <div className="admin-section-header">
                    <h2>All Stories</h2>

                    <span>
                        {posts.length}{" "}
                        {posts.length === 1
                            ? "Story"
                            : "Stories"}
                    </span>
                </div>


                {/* Search, category and sort filters */}
                <div className="admin-filters">

                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(
                                event.target.value
                            );
                            setPage(1);
                        }}
                    />


                    <select
                        value={category}
                        onChange={(event) => {
                            setCategory(
                                event.target.value
                            );
                            setPage(1);
                        }}
                    >
                        <option value="">
                            All Categories
                        </option>

                        <option value="Business">
                            Business
                        </option>

                        <option value="Job">
                            Job
                        </option>

                        <option value="Investment">
                            Investment
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>


                    <select
                        value={sort}
                        onChange={(event) => {
                            setSort(event.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="latest">
                            Latest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="popular">
                            Popular
                        </option>
                    </select>

                </div>


                <AdminStoryList
                    posts={posts}
                    onViewStory={handleViewStory}
                    onAddStory={handleAddStory}
                    onEditStory={handleEditStory}
                    onDeleteStory={handleDeleteStory}
                />


                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrevious={() =>
                        setPage(page - 1)
                    }
                    onNext={() =>
                        setPage(page + 1)
                    }
                />

            </section>


            {/* Comment moderation section */}
            <section className="admin-section">

                <div className="admin-section-header">
                    <h2>Comment Moderation</h2>

                    <span>
                        {comments.length}{" "}
                        {comments.length === 1
                            ? "Comment"
                            : "Comments"}
                    </span>
                </div>


                <AdminCommentList
                    comments={comments}
                    onDeleteComment={
                        handleDeleteComment
                    }
                />

            </section>

        </main>
    );
}


export default AdminDashboard;