function AdminStoryList({
    posts,
    onViewStory,
    onAddStory,
    onEditStory,
    onDeleteStory,
}) {
    if (posts.length === 0) {
        return (
            <div className="admin-empty">
                <h3>No stories found</h3>
                <p>
                    Try changing your search or category filter.
                </p>
            </div>
        );
    }

    return (
        <div className="admin-story-table-wrapper">
            <table className="admin-story-table">
                <thead>
                    <tr>
                        <th>Story</th>
                        <th>Category</th>
                        <th>Storyteller</th>
                        <th>Views</th>
                        <th>Likes</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>
                                <div className="admin-table-story">
                                    <strong>{post.title}</strong>
                                    <span>
                                        {post.description}
                                    </span>
                                </div>
                            </td>

                            <td>
                                <span className="admin-category-badge">
                                    {post.category}
                                </span>
                            </td>

                            <td>
                                {post.storyteller}
                            </td>

                            <td>
                                {post.views}
                            </td>

                            <td>
                                {post.likes}
                            </td>

                            <td>
                                <span
                                    className={
                                        post.status === "draft"
                                            ? "story-status story-status-draft"
                                            : "story-status story-status-published"
                                    }
                                >
                                    {post.status === "draft"
                                        ? "Draft"
                                        : "Published"}
                                </span>
                            </td>

                            <td>
                                <div className="admin-table-actions">
                                    {post.status !== "draft" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onViewStory(post.id)
                                            }
                                        >
                                            View
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onAddStory(post.id)
                                        }
                                    >
                                        Add Story
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onEditStory(post.id)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() =>
                                            onDeleteStory(post.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminStoryList;