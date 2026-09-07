import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Toast from "../components/Toast";
import "./Post.css";


function Post() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [additionalStories, setAdditionalStories] = useState([]);
    const [comments, setComments] = useState([]);

    const [name, setName] = useState("");
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [toast, setToast] = useState({
        show: false,
        message: ""
    });


    // ============================================================
    // API BASE URL
    // ============================================================

    const API_URL = import.meta.env.VITE_API_URL;


    // ============================================================
    // TOAST
    // ============================================================

    const showToast = (message) => {
        setToast({
            show: true,
            message
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: ""
            });
        }, 2500);
    };


    // ============================================================
    // LOAD POST DATA
    // ============================================================

    useEffect(() => {

        const loadPost = async () => {

            setLoading(true);
            setError("");


            // ----------------------------------------------------
            // FETCH POST
            // ----------------------------------------------------

            try {
                const response = await fetch(
                    `${API_URL}/api/posts/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Failed to load story"
                    );
                } else {
                    setPost(data);
                }

            } catch {
                setError(
                    "Unable to connect to the server"
                );
            }


            // ----------------------------------------------------
            // FETCH ADDITIONAL STORIES
            // ----------------------------------------------------

            try {
                const response = await fetch(
                    `${API_URL}/api/posts/${id}/additional-stories`
                );

                const data = await response.json();

                if (response.ok) {
                    setAdditionalStories(data);
                }

            } catch (error) {
                console.error(
                    "Failed to fetch additional stories",
                    error
                );
            }


            // ----------------------------------------------------
            // FETCH COMMENTS
            // ----------------------------------------------------

            try {
                const response = await fetch(
                    `${API_URL}/api/posts/${id}/comments`
                );

                const data = await response.json();

                if (response.ok) {
                    setComments(data);
                }

            } catch (error) {
                console.error(
                    "Failed to fetch comments",
                    error
                );
            }


            // ----------------------------------------------------
            // RECORD VIEW
            // ----------------------------------------------------

            try {
                await fetch(
                    `${API_URL}/api/posts/${id}/view`,
                    {
                        method: "POST"
                    }
                );

            } catch (error) {
                console.error(
                    "Failed to record view",
                    error
                );
            }


            setLoading(false);
        };


        loadPost();

    }, [id, API_URL]);


    // ============================================================
    // LIKE
    // ============================================================

    const handleLike = async () => {

        try {
            const response = await fetch(
                `${API_URL}/api/posts/${id}/like`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showToast(
                    data.message || "Unable to like story"
                );
                return;
            }

            setPost((currentPost) => ({
                ...currentPost,
                likes: data.likes
            }));

            showToast("Story liked!");

        } catch {
            showToast(
                "Unable to connect to the server"
            );
        }
    };


    // ============================================================
    // DISLIKE
    // ============================================================

    const handleDislike = async () => {

        try {
            const response = await fetch(
                `${API_URL}/api/posts/${id}/dislike`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showToast(
                    data.message || "Unable to dislike story"
                );
                return;
            }

            setPost((currentPost) => ({
                ...currentPost,
                dislikes: data.dislikes
            }));

            showToast("Feedback recorded");

        } catch {
            showToast(
                "Unable to connect to the server"
            );
        }
    };


    // ============================================================
    // SUBMIT COMMENT
    // ============================================================

    const handleCommentSubmit = async (event) => {

        event.preventDefault();

        if (!name.trim() || !comment.trim()) {
            showToast(
                "Name and comment are required"
            );
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/posts/${id}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        content: comment
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showToast(
                    data.message || "Failed to add comment"
                );
                return;
            }

            setName("");
            setComment("");


            // Refresh comments after submitting
            try {
                const commentsResponse = await fetch(
                    `${API_URL}/api/posts/${id}/comments`
                );

                const commentsData =
                    await commentsResponse.json();

                if (commentsResponse.ok) {
                    setComments(commentsData);
                }

            } catch (error) {
                console.error(
                    "Failed to refresh comments",
                    error
                );
            }


            showToast("Comment added!");

        } catch {
            showToast(
                "Unable to connect to the server"
            );
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="post-page">

                <p className="post-status">
                    Loading story...
                </p>

            </main>
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <main className="post-page">

                <p className="post-error">
                    {error}
                </p>

            </main>
        );
    }


    // ============================================================
    // POST NOT FOUND
    // ============================================================

    if (!post) {
        return (
            <main className="post-page">

                <p className="post-status">
                    Story not found.
                </p>

            </main>
        );
    }


    // ============================================================
    // MAIN PAGE
    // ============================================================

    return (
        <main className="post-page">


            {/* ====================================================
                POST HEADER
            ==================================================== */}

            <header className="post-header">

                <span className="post-category">
                    {post.category}
                </span>

                <h1>
                    {post.title}
                </h1>

                <p className="post-description">
                    {post.description}
                </p>

                <div className="post-meta">

                    <span>
                        By {post.storyteller}
                    </span>

                    <span>
                        👁 {post.views}
                    </span>

                </div>

            </header>


            {/* ====================================================
                70 / 30 CONTENT LAYOUT
            ==================================================== */}

            <div className="post-layout">


                {/* =================================================
                    MAIN STORY - 70%
                    
                    ONLY the main story is shown here.
                ================================================= */}

                <article className="main-story">

                    <div className="main-story-label">
                        Main Story
                    </div>

                    <div className="main-story-content">

                        <p>
                            {post.description}
                        </p>

                    </div>

                </article>


                {/* =================================================
                    SIDEBAR - 30%

                    All supporting/sub topics are here.
                ================================================= */}

                <aside className="post-sidebar">


                    {/* ------------------------------------------------
                        STORYTELLER
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            👤 Storyteller
                        </h3>

                        <p>
                            {post.storyteller}
                        </p>


                        {/* Contact Storyteller */}

                        {post.storyteller_email && (
                            <div className="storyteller-contact">

                                <a
                                    href={`mailto:${post.storyteller_email}`}
                                    className="contact-storyteller-btn"
                                >
                                    📧 Contact Storyteller
                                </a>

                            </div>
                        )}

                    </div>


                    {/* ------------------------------------------------
                        STARTING POINT
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            🚀 Starting Point
                        </h3>

                        <p>
                            {post.starting_point}
                        </p>

                    </div>


                    {/* ------------------------------------------------
                        HOW IT STARTED
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            💡 How It Started
                        </h3>

                        <p>
                            {post.how_started}
                        </p>

                    </div>


                    {/* ------------------------------------------------
                        FINANCIAL INFORMATION
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            💰 Income / Net Worth
                        </h3>

                        <p>
                            {post.financial_info}
                        </p>

                    </div>


                    {/* ------------------------------------------------
                        APPROACH
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            🎯 Approach
                        </h3>

                        <p>
                            {post.approach}
                        </p>

                    </div>


                    {/* ------------------------------------------------
                        LIFE CHANGED
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            🌱 How Life Changed
                        </h3>

                        <p>
                            {post.life_changed}
                        </p>

                    </div>


                    {/* ------------------------------------------------
                        FAILURES
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            ⚠️ Failures
                        </h3>

                        <p>
                            {post.failures}
                        </p>

                    </div>


                    {/* ------------------------------------------------
                        LESSONS
                    ------------------------------------------------ */}

                    <div className="side-card lessons-card">

                        <h3>
                            🧠 Lessons
                        </h3>

                        <div
                            className="sidebar-lessons"
                            dangerouslySetInnerHTML={{
                                __html: post.lessons
                            }}
                        />

                    </div>


                    {/* ------------------------------------------------
                        ADDITIONAL STORIES
                    ------------------------------------------------ */}

                    {additionalStories.length > 0 && (

                        <div className="side-card additional-stories">

                            <h3>
                                📖 Additional Stories
                            </h3>

                            {additionalStories.map(
                                (story) => (

                                    <article
                                        className="additional-story"
                                        key={story.id}
                                    >

                                        <h4>
                                            {story.title}
                                        </h4>

                                        <p>
                                            {story.content}
                                        </p>

                                    </article>

                                )
                            )}

                        </div>

                    )}


                    {/* ------------------------------------------------
                        TAGS
                    ------------------------------------------------ */}

                    {post.tags && (

                        <div className="side-card">

                            <h3>
                                🏷 Tags
                            </h3>

                            <div className="post-tags">

                                {post.tags
                                    .split(",")
                                    .map((tag) => (

                                        <span
                                            key={tag}
                                            className="post-tag"
                                        >
                                            #{tag.trim()}
                                        </span>

                                    ))}

                            </div>

                        </div>

                    )}


                    {/* ------------------------------------------------
                        ENGAGEMENT
                    ------------------------------------------------ */}

                    <div className="side-card">

                        <h3>
                            Your Feedback
                        </h3>

                        <div className="post-actions">

                            <button
                                onClick={handleLike}
                            >
                                ❤️ {post.likes}
                            </button>

                            <button
                                onClick={handleDislike}
                            >
                                👎 {post.dislikes}
                            </button>

                        </div>

                    </div>


                </aside>

            </div>


            {/* ====================================================
                COMMENTS
            ==================================================== */}

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>


                <form
                    className="comment-form"
                    onSubmit={handleCommentSubmit}
                >

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <textarea
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(event) =>
                            setComment(event.target.value)
                        }
                    />

                    <button type="submit">
                        Post Comment
                    </button>

                </form>


                <div className="comments-list">

                    {comments.length === 0 ? (

                        <p className="empty-comments">
                            Be the first to comment.
                        </p>

                    ) : (

                        comments.map((item) => (

                            <article
                                className="comment-card"
                                key={item.id}
                            >

                                <strong>
                                    {item.name}
                                </strong>

                                <p>
                                    {item.content}
                                </p>

                            </article>

                        ))

                    )}

                </div>

            </section>


            {/* ====================================================
                TOAST
            ==================================================== */}

            <Toast
                show={toast.show}
                message={toast.message}
            />

        </main>
    );
}


export default Post;