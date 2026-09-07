import { Link } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
    return (
        <article className="post-card">

            <h3>{post.title}</h3>

            <p className="post-card-description">
                {post.description}
            </p>

            <div className="post-card-info">
                <span>
                    Category: {post.category}
                </span>

                <span>
                    Views: {post.views}
                </span>
            </div>

            <Link
                className="post-card-button"
                to={`/post/${post.id}`}
            >
                Read Story
            </Link>

        </article>
    );
}

export default PostCard;