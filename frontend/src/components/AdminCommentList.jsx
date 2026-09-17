function AdminCommentList({
    comments,
    onDeleteComment,
}) {
    if (comments.length === 0) {
        return (
            <div className="admin-empty">
                <h3>
                    No comments found
                </h3>

                <p>
                    New comments will appear here
                    for moderation.
                </p>
            </div>
        );
    }

    return (
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
                                {comment.post_title}
                            </strong>
                        </p>

                        <p>
                            {comment.content}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                            onDeleteComment(comment.id)
                        }
                    >
                        Delete Comment
                    </button>

                </article>
            ))}

        </div>
    );
}

export default AdminCommentList;