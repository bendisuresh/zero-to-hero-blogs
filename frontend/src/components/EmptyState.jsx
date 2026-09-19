function EmptyState({
    title = "Nothing found",
    message = "There is no content to display."
}) {
    return (
        <div className="empty-state">

            <h2>
                {title}
            </h2>

            <p>
                {message}
            </p>

        </div>
    );
}

export default EmptyState;