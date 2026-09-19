function ErrorState({
    title = "Something went wrong",
    message = "Unable to load the requested content.",
    onRetry,
}) {
    return (
        <div
    className="error-state"
    role="alert"
>

            <h2>
                {title}
            </h2>

            <p>
                {message}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="error-retry-button"
                >
                    Try Again
                </button>
            )}

        </div>
    );
}

export default ErrorState;