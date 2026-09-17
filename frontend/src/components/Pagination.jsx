function Pagination({
    page,
    totalPages,
    onPrevious,
    onNext,
}) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="admin-pagination">

            <button
                type="button"
                disabled={page === 1}
                onClick={onPrevious}
            >
                Previous
            </button>

            <span>
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                disabled={page === totalPages}
                onClick={onNext}
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;