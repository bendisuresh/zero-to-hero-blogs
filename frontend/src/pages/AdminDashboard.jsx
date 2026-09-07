import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState("");
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getDashboard = async () => {
            const token = localStorage.getItem("admin_token");

            if (!token) {
                navigate("/admin/login");
                return;
            }

            try {
                // Check whether the admin token is valid
                const dashboardResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const dashboardData =
                    await dashboardResponse.json();

                if (!dashboardResponse.ok) {
                    localStorage.removeItem("admin_token");
                    navigate("/admin/login");
                    return;
                }

                setMessage(dashboardData.message);
                setAdmin(dashboardData.admin);

                // Get all stories
                const postsResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/posts`
                );

                const postsData =
                    await postsResponse.json();

                if (!postsResponse.ok) {
                    setError("Unable to load stories");
                    return;
                }

                setPosts(postsData);

                // Get comments from every story
                const allComments = [];

                for (const post of postsData) {
                    const commentsResponse = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/posts/${post.id}/comments`
                    );

                    if (!commentsResponse.ok) {
                        continue;
                    }

                    const commentsData =
                        await commentsResponse.json();

                    commentsData.forEach((comment) => {
                        allComments.push({
                            ...comment,
                            post_id: post.id,
                            post_title: post.title,
                        });
                    });
                }

                setComments(allComments);
            } catch {
                setError(
                    "Unable to connect to the server"
                );
            } finally {
                setLoading(false);
            }
        };

        getDashboard();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
    };

    const handleCreateStory = () => {
        navigate("/admin/create-story");
    };

    const handleViewStory = (id) => {
        navigate(`/post/${id}`);
    };

    const handleDeleteStory = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this story?"
        );

        if (!confirmed) {
            return;
        }

        const token =
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/posts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to delete story"
                );
                return;
            }

            // Remove deleted story from the screen
            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post.id !== id
                )
            );
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

        const token =
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/comments/${commentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to delete comment"
                );
                return;
            }

            // Remove deleted comment from the screen
            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment.id !== commentId
                )
            );
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
                        onClick={handleCreateStory}
                        className="admin-primary-button"
                    >
                        Create Story
                    </button>

                    <button
                        onClick={handleLogout}
                        className="admin-secondary-button"
                    >
                        Logout
                    </button>
                </div>
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

                {posts.length === 0 ? (
                    <div className="admin-empty">
                        <h3>No stories found</h3>

                        <p>
                            Create your first story to
                            see it here.
                        </p>
                    </div>
                ) : (
                    <div className="admin-story-grid">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="admin-story-card"
                            >
                                <h3>{post.title}</h3>

                                <p className="admin-story-description">
                                    {post.description}
                                </p>

                                <div className="admin-story-info">
                                    <span>
                                        Category:{" "}
                                        {post.category}
                                    </span>

                                    <span>
                                        Storyteller:{" "}
                                        {post.storyteller}
                                    </span>

                                    <span>
                                        Views:{" "}
                                        {post.views}
                                    </span>
                                </div>

                                <div className="admin-story-actions">
                                    <button
                                        onClick={() =>
                                            handleViewStory(
                                                post.id
                                            )
                                        }
                                    >
                                        View Story
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/posts/${post.id}/additional-story`
                                            )
                                        }
                                    >
                                        Add Story
                                    </button>
                                    <button
    onClick={() =>
        navigate(
            `/admin/posts/${post.id}/edit`
        )
    }
>
    Edit Story
</button>

                                    <button
                                        className="admin-delete-button"
                                        onClick={() =>
                                            handleDeleteStory(
                                                post.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
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

                {comments.length === 0 ? (
                    <div className="admin-empty">
                        <h3>No comments found</h3>

                        <p>
                            New comments will appear here
                            for moderation.
                        </p>
                    </div>
                ) : (
                    <div className="admin-comment-list">
                        {comments.map((comment) => (
                            <article
                                key={comment.id}
                                className="admin-comment-card"
                            >
                                <div>
                                    <h3>
                                        {comment.name}
                                    </h3>

                                    <p className="admin-comment-story">
                                        Story:{" "}
                                        <strong>
                                            {
                                                comment.post_title
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        {
                                            comment.content
                                        }
                                    </p>
                                </div>

                                <button
                                    className="admin-delete-button"
                                    onClick={() =>
                                        handleDeleteComment(
                                            comment.id
                                        )
                                    }
                                >
                                    Delete Comment
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminDashboard;