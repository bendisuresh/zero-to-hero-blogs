import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import getStoryImage from "../utils/storyImage";
import apiFetch from "../services/api";
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
    const [retryCount, setRetryCount] = useState(0);

    const [toast, setToast] = useState({
        show: false,
        message: ""
    });

    /*
    ============================================================
    TOAST
    ============================================================
    */

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
                const data = await apiFetch(
                    `/api/posts/${id}`
                );

                setPost(data);
            } catch (error) {
                setPost(null);

                setError(
                    error.message ||
                    "Unable to connect to the server"
                );
            }

            /*
            ----------------------------------------------------
            ADDITIONAL STORIES
            ----------------------------------------------------
            */

            try {
                const data = await apiFetch(
                    `/api/posts/${id}/additional-stories`
                );

                setAdditionalStories(data);
            } catch (error) {
                setAdditionalStories([]);

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
                const data = await apiFetch(
                    `/api/posts/${id}/comments`
                );

                setComments(data);
            } catch (error) {
                setComments([]);

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
                await apiFetch(
                    `/api/posts/${id}/view`,
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
    }, [id, retryCount]);

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
    LIKE
    ============================================================
    */

    const handleLike = async () => {
        try {
            const data = await apiFetch(
                `/api/posts/${id}/like`,
                {
                    method: "POST"
                }
            );

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
            const data = await apiFetch(
                `/api/posts/${id}/dislike`,
                {
                    method: "POST"
                }
            );

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
    const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
        try {
            await navigator.share({
                title: post.title,
                text: post.description,
                url: shareUrl
            });
        } catch (error) {
            if (error.name !== "AbortError") {
                showToast("Unable to share this story");
            }
        }

        return;
    }

    try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Story link copied");
    } catch {
        showToast("Unable to copy story link");
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
            await apiFetch(
                `/api/posts/${id}/comments`,
                {
                    method: "POST",
                    body: {
                        name: name.trim(),
                        content: comment.trim()
                    }
                }
            );

            setName("");
            setComment("");

            /*
            ----------------------------------------------------
            REFRESH COMMENTS
            ----------------------------------------------------
            */

            try {
                const commentsData = await apiFetch(
                    `/api/posts/${id}/comments`
                );

                setComments(commentsData);
            } catch (error) {
                console.error(
                    "Failed to refresh comments",
                    error
                );
            }

            showToast(
                "Comment submitted for moderation"
            );
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
                <LoadingState
                    message="Loading story..."
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
            <main className="post-page">
                <ErrorState
                    title="Unable to load this story"
                    message={error}
                    onRetry={handleRetry}
                />

                <div className="post-error-navigation">
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
                <EmptyState
                    title="Story not found"
                    message="The story you are looking for does not exist or is no longer available."
                />

                <div className="post-error-navigation">
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

    <nav className="post-breadcrumbs" aria-label="Breadcrumb">

        <Link to="/">
            Home
        </Link>

        <span aria-hidden="true">
            /
        </span>

        <Link
            to={`/stories?category=${encodeURIComponent(post.category)}`}
        >
            {post.category}
        </Link>

        <span aria-hidden="true">
            /
        </span>

        <span className="post-breadcrumb-current">
            {post.title}
        </span>

    </nav>

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
                                        const cleanTag =
                                            tag.trim();

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
                    <section className="sidebar-section share-section">

    <span className="sidebar-label">
        SHARE STORY
    </span>

    <div className="post-share-actions">

        <button
            type="button"
            onClick={handleShare}
        >
            Share
        </button>

        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    showToast("Story link copied");
                } catch {
                    showToast("Unable to copy story link");
                }
            }}
        >
            Copy Link
        </button>

        <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            LinkedIn
        </a>

        <a
            href={`https://wa.me/?text=${encodeURIComponent(
                `${post.title} ${window.location.href}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            WhatsApp
        </a>

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

                        <EmptyState
                            title="No approved comments yet"
                            message="Be the first to share your thoughts on this story."
                        />

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