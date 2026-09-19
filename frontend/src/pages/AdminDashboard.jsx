import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import apiFetch from "../services/api";
import useAuth from "../hooks/useAuth";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
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
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("latest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    /*
    ============================================================
    LOAD DASHBOARD
    ============================================================
    */
   useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => {
        clearTimeout(timer);
    };
}, [searchTerm]);

    useEffect(() => {
        const getDashboard = async () => {
            if (!isAuthenticated) {
                navigate("/admin/login");
                return;
            }

            setLoading(true);
            setError("");

            try {
                /*
                ------------------------------------------------
                CHECK ADMIN AUTHENTICATION
                ------------------------------------------------
                */

                const dashboardData =
                    await apiFetch(
                        "/api/admin/dashboard"
                    );

                setMessage(
                    dashboardData.message
                );

                setAdmin(
                    dashboardData.admin
                );

                /*
                ------------------------------------------------
                DASHBOARD SUMMARY
                ------------------------------------------------
                */

                const summaryData =
                    await apiFetch(
                        "/api/admin/summary"
                    );

                setSummary(summaryData);

                /*
                ------------------------------------------------
                ADMIN STORIES
                ------------------------------------------------
                */

                const params = new URLSearchParams({
                    page: page,
                    limit: 10,
                    sort: sort,
                });

                if (debouncedSearchTerm) {
    params.set(
        "search",
        debouncedSearchTerm
    );
}

                if (category) {
                    params.set(
                        "category",
                        category
                    );
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

                /*
                ------------------------------------------------
                COMMENT MODERATION
                ------------------------------------------------
                */

                const commentsData =
                    await apiFetch(
                        "/api/admin/comments"
                    );

                setComments(
                    commentsData.comments || []
                );

            } catch (error) {

                /*
                ------------------------------------------------
                AUTH FAILURE
                ------------------------------------------------
                */

                if (
                    error.status === 401 ||
                    error.status === 422 ||
                    error.status === 403
                ) {
                    logout();
                    navigate("/admin/login");
                    return;
                }

                setError(
                    "Unable to connect to the server. Please try again."
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
        debouncedSearchTerm,
        category,
        sort,
        retryCount,
    ]);

    /*
    ============================================================
    RETRY
    ============================================================
    */

    const handleRetry = () => {
        setRetryCount(
            (current) => current + 1
        );
    };

    /*
    ============================================================
    LOGOUT
    ============================================================
    */

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    /*
    ============================================================
    CREATE STORY
    ============================================================
    */

    const handleCreateStory = () => {
        navigate("/admin/create-story");
    };

    /*
    ============================================================
    VIEW STORY
    ============================================================
    */

    const handleViewStory = (id) => {
        navigate(`/post/${id}`);
    };

    /*
    ============================================================
    ADDITIONAL STORY
    ============================================================
    */

    const handleAddStory = (id) => {
        navigate(
            `/admin/posts/${id}/additional-story`
        );
    };

    /*
    ============================================================
    EDIT STORY
    ============================================================
    */

    const handleEditStory = (id) => {
        navigate(
            `/admin/posts/${id}/edit`
        );
    };

    /*
    ============================================================
    DELETE STORY
    ============================================================
    */

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

            /*
            ------------------------------------------------
            REMOVE STORY FROM SCREEN
            ------------------------------------------------
            */

            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== id
                )
            );

            /*
            ------------------------------------------------
            UPDATE STORY COUNT
            ------------------------------------------------
            */

            setSummary((currentSummary) => ({
                ...currentSummary,
                total_stories:
                    Math.max(
                        0,
                        currentSummary.total_stories - 1
                    ),
            }));

        } catch (error) {

            if (
                error.status === 401 ||
                error.status === 422 ||
                error.status === 403
            ) {
                logout();
                navigate("/admin/login");
                return;
            }

            setError(
                "Unable to delete the story."
            );
        }
    };

    /*
    ============================================================
    CHANGE COMMENT STATUS
    ============================================================
    */

    const handleChangeCommentStatus = async (
        commentId,
        status
    ) => {
        if (!isAuthenticated) {
            navigate("/admin/login");
            return;
        }

        try {
            const data = await apiFetch(
    `/api/admin/comments/${commentId}/status`,
    {
        method: "PATCH",
        body: {
            status,
        },
    }
);

            setComments((currentComments) =>
                currentComments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            status: data.status,
                        };
                    }

                    return comment;
                })
            );

        } catch (error) {

            if (
                error.status === 401 ||
                error.status === 422 ||
                error.status === 403
            ) {
                logout();
                navigate("/admin/login");
                return;
            }

            setError(
                "Unable to update comment status."
            );
        }
    };

    /*
    ============================================================
    DELETE COMMENT
    ============================================================
    */

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

            /*
            ------------------------------------------------
            REMOVE COMMENT FROM SCREEN
            ------------------------------------------------
            */

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment.id !== commentId
                )
            );

            /*
            ------------------------------------------------
            UPDATE COMMENT COUNT
            ------------------------------------------------
            */

            setSummary((currentSummary) => ({
                ...currentSummary,
                total_comments:
                    Math.max(
                        0,
                        currentSummary.total_comments - 1
                    ),
            }));

        } catch (error) {

            if (
                error.status === 401 ||
                error.status === 422 ||
                error.status === 403
            ) {
                logout();
                navigate("/admin/login");
                return;
            }

            setError(
                "Unable to delete the comment."
            );
        }
    };

    /*
    ============================================================
    LOADING STATE
    ============================================================
    */

    if (loading) {
        return (
            <main className="admin-page">
                <LoadingState
                    message="Loading dashboard..."
                />
            </main>
        );
    }

    /*
    ============================================================
    ERROR STATE
    ============================================================
    */

    if (error) {
        return (
            <main className="admin-page">
                <ErrorState
                    title="Something went wrong"
                    message={error}
                    onRetry={handleRetry}
                />
            </main>
        );
    }

    /*
    ============================================================
    DASHBOARD
    ============================================================
    */

    return (
        <main className="admin-page">

            {/* =================================================
                DASHBOARD HEADER
               ================================================= */}

            <section className="admin-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        {message}
                    </p>

                    <p>
                        Logged in as:{" "}
                        <strong>
                            {admin}
                        </strong>
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

            {/* =================================================
                DASHBOARD SUMMARY
               ================================================= */}

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

            {/* =================================================
                STORIES
               ================================================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <h2>
                        All Stories
                    </h2>

                    <span>
                        {posts.length}{" "}
                        {posts.length === 1
                            ? "Story"
                            : "Stories"}
                    </span>

                </div>

                {/* =================================================
                    FILTERS
                   ================================================= */}

                <div className="admin-filters">

                    <input
                        type="text"
                        placeholder="Search stories..."
                        aria-label="Search stories"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(
                                event.target.value
                            );

                            setPage(1);
                        }}
                    />

                    <select
                    aria-label="Filter by category"
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
                        aria-label="Sort stories"
                        onChange={(event) => {
                            setSort(
                                event.target.value
                            );

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

            {/* =================================================
                COMMENT MODERATION
               ================================================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <h2>
                        Comment Moderation
                    </h2>

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
                    onChangeStatus={
                        handleChangeCommentStatus
                    }
                />

            </section>

        </main>
    );
}

export default AdminDashboard;