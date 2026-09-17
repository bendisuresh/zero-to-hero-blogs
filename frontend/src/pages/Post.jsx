import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import getStoryImage from "../utils/storyImage";
import "./Post.css";


function StorySection({ title, children }) {
    if (!children) {
        return null;
    }

    return (
        <section className="story-section">
            <h2>{title}</h2>

            <div className="story-section-content">
                <p>{children}</p>
            </div>
        </section>
    );
}


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

    const API_URL = import.meta.env.VITE_API_URL;


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


    /*
    ============================================================
    LOAD STORY
    ============================================================
    */

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${API_URL}/api/posts/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Failed to load story"
                    );
                } else {
                    setPost(data);
                }

            } catch {
                setError(
                    "Unable to connect to the server"
                );
            }


            /*
            ----------------------------------------------------
            ADDITIONAL STORIES
            ----------------------------------------------------
            */

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


            /*
            ----------------------------------------------------
            COMMENTS
            ----------------------------------------------------
            */

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


            /*
            ----------------------------------------------------
            RECORD VIEW
            ----------------------------------------------------
            */

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


    /*
    ============================================================
    LIKE
    ============================================================
    */

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
                    data.message ||
                    "Unable to like story"
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


    /*
    ============================================================
    DISLIKE
    ============================================================
    */

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
                    data.message ||
                    "Unable to dislike story"
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


    /*
    ============================================================
    COMMENT SUBMISSION
    ============================================================
    */

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
                        name: name.trim(),
                        content: comment.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showToast(
                    data.message ||
                    "Failed to add comment"
                );

                return;
            }

            setName("");
            setComment("");


            /*
            ----------------------------------------------------
            REFRESH COMMENTS
            ----------------------------------------------------
            */

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


    /*
    ============================================================
    LOADING STATE
    ============================================================
    */

    if (loading) {
        return (
            <main className="post-page">

                <div className="post-status-card">

                    <span className="status-spinner"></span>

                    <p>
                        Loading story...
                    </p>

                </div>

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
            <main className="post-page">

                <div className="post-status-card post-error-card">

                    <h2>
                        Unable to load this story
                    </h2>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/"
                        className="post-back-link"
                    >
                        ← Back to Home
                    </Link>

                </div>

            </main>
        );
    }


    /*
    ============================================================
    STORY NOT FOUND
    ============================================================
    */

    if (!post) {
        return (
            <main className="post-page">

                <div className="post-status-card">

                    <h2>
                        Story not found
                    </h2>

                    <Link
                        to="/"
                        className="post-back-link"
                    >
                        ← Back to Home
                    </Link>

                </div>

            </main>
        );
    }


    /*
    ============================================================
    STORY DATA
    ============================================================
    */

    const imageUrl = getStoryImage(post);

    const storyParts = [
        post.description,
        post.starting_point,
        post.how_started,
        post.financial_info,
        post.approach,
        post.life_changed,
        post.failures,
        post.lessons
    ];


    const totalWords = storyParts
        .filter(Boolean)
        .join(" ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;


    const readingTime = Math.max(
        1,
        Math.ceil(totalWords / 200)
    );


    const formattedDate = post.created_at
        ? new Date(
            post.created_at
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
        : "";


    /*
    ============================================================
    PAGE
    ============================================================
    */

    return (
        <main className="post-page">


            {/* =================================================
                BACK NAVIGATION
               ================================================= */}

            <div className="post-navigation">

                <Link
                    to="/"
                    className="post-back-link"
                >
                    ← Back to Stories
                </Link>

            </div>


            {/* =================================================
                ARTICLE HEADER
               ================================================= */}

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
                        By{" "}

                        <strong>
                            {post.storyteller}
                        </strong>
                    </span>


                    {formattedDate && (
                        <span>
                            {formattedDate}
                        </span>
                    )}


                    <span>
                        {readingTime} min read
                    </span>


                    <span>
                        {post.views || 0} views
                    </span>

                </div>

            </header>


            {/* =================================================
                HERO IMAGE
               ================================================= */}

            <figure className="post-hero-image">

                <img
                    src={imageUrl}
                    alt={post.title}
                />

            </figure>


            {/* =================================================
                ARTICLE + SIDEBAR
               ================================================= */}

            <div className="post-content-layout">


                {/* =================================================
                    MAIN ARTICLE
                   ================================================= */}

                <article className="main-story">


                    <div className="story-introduction">

                        <span>
                            THE JOURNEY
                        </span>

                        <p>
                            Every journey begins somewhere.
                            This is the story behind the
                            starting point, challenges,
                            decisions and lessons that
                            shaped this journey.
                        </p>

                    </div>


                    <StorySection title="Starting Point">
                        {post.starting_point}
                    </StorySection>


                    <StorySection title="How It Started">
                        {post.how_started}
                    </StorySection>


                    <StorySection title="The Approach">
                        {post.approach}
                    </StorySection>


                    <StorySection title="How Life Changed">
                        {post.life_changed}
                    </StorySection>


                    <StorySection title="Challenges & Failures">
                        {post.failures}
                    </StorySection>


                    <StorySection title="Financial Context">
                        {post.financial_info}
                    </StorySection>


                    {/* =================================================
                        LESSONS
                       ================================================= */}

                    {post.lessons && (

                        <section className="lessons-section">

                            <div className="lessons-heading">

                                <span>
                                    KEY TAKEAWAYS
                                </span>

                                <h2>
                                    Lessons Learned
                                </h2>

                            </div>


                            <div
                                className="story-rich-content"
                                dangerouslySetInnerHTML={{
                                    __html: post.lessons
                                }}
                            />

                        </section>

                    )}


                    {/* =================================================
                        ADDITIONAL STORIES
                       ================================================= */}

                    {additionalStories.length > 0 && (

                        <section className="additional-stories-section">

                            <div className="section-heading">

                                <span>
                                    MORE FROM THIS STORY
                                </span>

                                <h2>
                                    Additional Stories
                                </h2>

                            </div>


                            <div className="additional-stories-list">

                                {additionalStories.map(
                                    (story) => (

                                        <article
                                            className="additional-story"
                                            key={story.id}
                                        >

                                            <h3>
                                                {story.title}
                                            </h3>

                                            <p>
                                                {story.content}
                                            </p>

                                        </article>

                                    )
                                )}

                            </div>

                        </section>

                    )}

                </article>


                {/* =================================================
                    SIDEBAR
                   ================================================= */}

                <aside className="post-sidebar">


                    {/* =================================================
                        STORYTELLER
                       ================================================= */}

                    <section className="sidebar-section">

                        <span className="sidebar-label">
                            STORYTELLER
                        </span>

                        <h3>
                            {post.storyteller}
                        </h3>


                        {post.storyteller_email && (

                            <a
                                href={`mailto:${post.storyteller_email}`}
                                className="contact-storyteller-btn"
                            >
                                Contact Storyteller
                            </a>

                        )}

                    </section>


                    {/* =================================================
                        STORY DETAILS
                       ================================================= */}

                    <section className="sidebar-section">

                        <span className="sidebar-label">
                            STORY DETAILS
                        </span>


                        <div className="story-detail">

                            <span>
                                Category
                            </span>

                            <strong>
                                {post.category}
                            </strong>

                        </div>


                        <div className="story-detail">

                            <span>
                                Reading time
                            </span>

                            <strong>
                                {readingTime} min
                            </strong>

                        </div>


                        <div className="story-detail">

                            <span>
                                Views
                            </span>

                            <strong>
                                {post.views || 0}
                            </strong>

                        </div>


                        {formattedDate && (

                            <div className="story-detail">

                                <span>
                                    Published
                                </span>

                                <strong>
                                    {formattedDate}
                                </strong>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        CLICKABLE TAGS
                       ================================================= */}

                    {post.tags && (
    <section className="sidebar-section">
        <span className="sidebar-label">
            TOPICS
        </span>

        <div className="post-tags">
            {post.tags
                .split(",")
                .map((tag) => {
                    const cleanTag = tag.trim();

                    return (
                        <Link
                            key={cleanTag}
                            to={`/stories?tag=${encodeURIComponent(cleanTag)}`}
                            className="post-tag"
                        >
                            #{cleanTag}
                        </Link>
                    );
                })}
        </div>
    </section>
)}


                    {/* =================================================
                        FEEDBACK
                       ================================================= */}

                    <section className="sidebar-section feedback-section">

                        <span className="sidebar-label">
                            YOUR FEEDBACK
                        </span>


                        <div className="post-actions">


                            <button
                                type="button"
                                onClick={handleLike}
                                aria-label="Like story"
                            >

                                <span>
                                    👍
                                </span>

                                <strong>
                                    {post.likes || 0}
                                </strong>

                            </button>


                            <button
                                type="button"
                                onClick={handleDislike}
                                aria-label="Dislike story"
                            >

                                <span>
                                    👎
                                </span>

                                <strong>
                                    {post.dislikes || 0}
                                </strong>

                            </button>

                        </div>

                    </section>

                </aside>

            </div>


            {/* =====================================================
                COMMENTS
               ===================================================== */}

            <section className="comments-section">


                <div className="comments-heading">

                    <span>
                        JOIN THE CONVERSATION
                    </span>

                    <h2>
                        Comments ({comments.length})
                    </h2>

                </div>


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
                        placeholder="Share your thoughts..."
                        value={comment}
                        onChange={(event) =>
                            setComment(event.target.value)
                        }
                    />


                    <button type="submit">
                        Post Comment →
                    </button>

                </form>


                <div className="comments-list">

                    {comments.length === 0 ? (

                        <div className="empty-comments">

                            <p>
                                Be the first to share your
                                thoughts on this story.
                            </p>

                        </div>

                    ) : (

                        comments.map((item) => (

                            <article
                                className="comment-card"
                                key={item.id}
                            >

                                <div className="comment-avatar">

                                    {item.name
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div className="comment-content">

                                    <strong>
                                        {item.name}
                                    </strong>

                                    <p>
                                        {item.content}
                                    </p>

                                </div>

                            </article>

                        ))

                    )}

                </div>

            </section>


            <Toast
                show={toast.show}
                message={toast.message}
            />

        </main>
    );
}


export default Post;