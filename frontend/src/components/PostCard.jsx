import { Link } from "react-router-dom";
import getStoryImage from "../utils/storyImage";
import "./PostCard.css";

function PostCard({ post }) {
    const imageUrl = getStoryImage(post);

    const formattedDate = post.created_at
        ? new Date(
            post.created_at
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )
        : "";

    const description = post.description || "";

    const truncatedDescription =
        description.length > 125
            ? `${description.slice(0, 125)}...`
            : description;

    const getReadingTime = () => {
        const content = [
            post.description,
            post.starting_point,
            post.how_started,
            post.approach,
            post.life_changed,
            post.failures,
            post.financial_info,
            post.lessons
        ]
            .filter(Boolean)
            .join(" ");

        const wordCount = content
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;

        return Math.max(
            1,
            Math.ceil(wordCount / 200)
        );
    };

    const readingTime = getReadingTime();

    return (
        <article className="post-card">

            {/* =================================================
                IMAGE
                ================================================= */}

            <Link
                to={`/post/${post.id}`}
                className="post-card-image-link"
                aria-label={`Read ${post.title}`}
            >

                <img
                    src={imageUrl}
                    alt={post.title}
                    className="post-card-image"
                    loading="lazy"
                />

                <span className="post-card-image-overlay">
                    Read story →
                </span>

            </Link>


            {/* =================================================
                CONTENT
                ================================================= */}

            <div className="post-card-content">

                <div className="post-card-top">

                    <span className="post-card-category">
                        {post.category}
                    </span>

                    {formattedDate && (
                        <span className="post-card-date">
                            {formattedDate}
                        </span>
                    )}

                </div>


                <Link
                    to={`/post/${post.id}`}
                    className="post-card-title-link"
                >

                    <h3>
                        {post.title}
                    </h3>

                </Link>


                <p className="post-card-description">
                    {truncatedDescription}
                </p>


                {/* =================================================
                    META
                    ================================================= */}

                <div className="post-card-meta">

                    <div className="post-card-storyteller">

                        <span className="storyteller-avatar">
                            {(post.storyteller || "S")
                                .charAt(0)
                                .toUpperCase()}
                        </span>

                        <span className="storyteller-name">
                            {post.storyteller}
                        </span>

                    </div>


                    <span className="post-card-reading-time">
                        {readingTime} min read
                    </span>

                </div>


                {/* =================================================
                    FOOTER
                    ================================================= */}

                <div className="post-card-footer">

                    <div className="post-card-stats">

                        <span>
                            ♡ {post.likes || 0}
                        </span>

                        <span>
                            ◉ {post.views || 0}
                        </span>

                    </div>


                    <Link
                        className="post-card-button"
                        to={`/post/${post.id}`}
                    >
                        Read Story
                        <span aria-hidden="true">
                            →
                        </span>
                    </Link>

                </div>

            </div>

        </article>
    );
}

export default PostCard;