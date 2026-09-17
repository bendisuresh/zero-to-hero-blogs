import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import "./CategoryPage.css";


function CategoryPage({
    category,
    title,
    description
}) {
    const [searchParams] = useSearchParams();

    const tag = searchParams.get("tag") || "";

    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("latest");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);


    /*
    ============================================================
    FETCH STORIES
    ============================================================
    */

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    search: searchTerm,
                    sort: sort,
                    page: page,
                    limit: 9
                });


                /*
                ------------------------------------------------
                CATEGORY FILTER
                ------------------------------------------------
                */

                if (category) {
                    params.set(
                        "category",
                        category
                    );
                }


                /*
                ------------------------------------------------
                TAG FILTER
                ------------------------------------------------
                */

                if (tag) {
                    params.set(
                        "tag",
                        tag
                    );
                }


                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/posts?${params.toString()}`
                );

                const data = await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch stories"
                    );
                }


                setPosts(
                    data.posts || []
                );

                setTotalPages(
                    data.total_pages || 1
                );

            } catch {
                setPosts([]);

                setError(
                    "Unable to load stories. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };


        fetchPosts();

    }, [
        category,
        searchTerm,
        sort,
        page,
        retryCount,
        tag
    ]);


    /*
    ============================================================
    SEARCH
    ============================================================
    */

    const handleSearchChange = (event) => {
        setSearchTerm(
            event.target.value
        );

        setPage(1);
    };


    /*
    ============================================================
    CLEAR SEARCH
    ============================================================
    */

    const handleClearSearch = () => {
        setSearchTerm("");
        setPage(1);
    };


    /*
    ============================================================
    SORT
    ============================================================
    */

    const handleSortChange = (event) => {
        setSort(
            event.target.value
        );

        setPage(1);
    };


    /*
    ============================================================
    PREVIOUS PAGE
    ============================================================
    */

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(
                page - 1
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };


    /*
    ============================================================
    NEXT PAGE
    ============================================================
    */

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(
                page + 1
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };


    /*
    ============================================================
    DIRECT PAGE CHANGE
    ============================================================
    */

    const handlePageChange = (nextPage) => {
        if (
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage === page
        ) {
            return;
        }

        setPage(nextPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    /*
    ============================================================
    PAGINATION NUMBERS
    ============================================================
    */

    const getPageNumbers = () => {
        const pages = [];


        if (totalPages <= 5) {
            for (
                let number = 1;
                number <= totalPages;
                number += 1
            ) {
                pages.push(number);
            }

            return pages;
        }


        pages.push(1);


        if (page > 3) {
            pages.push("...");
        }


        let start = Math.max(
            2,
            page - 1
        );

        let end = Math.min(
            totalPages - 1,
            page + 1
        );


        if (page <= 2) {
            start = 2;
            end = 3;
        }


        if (page >= totalPages - 1) {
            start = totalPages - 2;
            end = totalPages - 1;
        }


        for (
            let number = start;
            number <= end;
            number += 1
        ) {
            pages.push(number);
        }


        if (page < totalPages - 2) {
            pages.push("...");
        }


        pages.push(totalPages);

        return pages;
    };


    /*
    ============================================================
    PAGE
    ============================================================
    */

    return (
        <main className="category-page">


            {/* =================================================
                CATEGORY HERO
               ================================================= */}

            <section className="category-hero">

                <div className="category-hero-inner">

                    <span className="category-eyebrow">
                        ZERO TO HERO
                    </span>


                    <h1>
    {tag
        ? `Stories tagged #${tag}`
        : title}
</h1>


                    <p>
                        {description}
                    </p>


                    <div className="category-hero-line"></div>

                </div>

            </section>


            {/* =================================================
                CONTENT
               ================================================= */}

            <section className="category-content">


                {/* =================================================
                    SECTION HEADING
                   ================================================= */}

                <div className="category-heading">

                    <div>

                        <span className="category-section-label">
                            EXPLORE STORIES
                        </span>


                        <h2>
                            {tag
                                ? `Stories tagged "${tag}"`
                                : category
                                    ? `${category} Journeys`
                                    : "All Stories"
                            }
                        </h2>

                    </div>


                    {!loading &&
                        !error && (
                            <span className="story-count">

                                {posts.length}{" "}

                                {posts.length === 1
                                    ? "story"
                                    : "stories"
                                }{" "}

                                on this page

                            </span>
                        )}

                </div>


                {/* =================================================
                    ACTIVE TAG
                   ================================================= */}

                {tag && (

                    <div className="category-active-tag">

                        <span>
                            Showing stories with tag:
                        </span>

                        <strong>
                            #{tag}
                        </strong>

                    </div>

                )}


                {/* =================================================
                    TOOLBAR
                   ================================================= */}

                <div className="category-toolbar">


                    {/* SEARCH */}

                    <div className="category-search-wrapper">

                        <span
                            className="category-search-icon"
                            aria-hidden="true"
                        >
                            ⌕
                        </span>


                        <input
                            type="search"
                            className="category-search"
                            placeholder={
                                category
                                    ? `Search ${category.toLowerCase()} stories...`
                                    : "Search stories..."
                            }
                            value={searchTerm}
                            onChange={
                                handleSearchChange
                            }
                            aria-label={
                                category
                                    ? `Search ${category} stories`
                                    : "Search stories"
                            }
                        />


                        {searchTerm && (

                            <button
                                type="button"
                                className="category-clear-search"
                                onClick={
                                    handleClearSearch
                                }
                                aria-label="Clear search"
                            >
                                ×
                            </button>

                        )}

                    </div>


                    {/* SORT */}

                    <div className="category-sort-wrapper">

                        <label
                            htmlFor="category-sort"
                        >
                            Sort
                        </label>


                        <select
                            id="category-sort"
                            value={sort}
                            onChange={
                                handleSortChange
                            }
                        >

                            <option value="latest">
                                Latest
                            </option>


                            <option value="popular">
                                Popular
                            </option>


                            <option value="oldest">
                                Oldest
                            </option>

                        </select>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                   ================================================= */}

                {loading && (

                    <div className="category-loading">

                        <div className="category-spinner"></div>


                        <h3>
                            Loading stories
                        </h3>


                        <p>
                            Finding journeys for you...
                        </p>

                    </div>

                )}


                {/* =================================================
                    ERROR
                   ================================================= */}

                {!loading &&
                    error && (

                        <div className="category-empty-state category-error-state">

                            <div className="category-empty-icon">
                                !
                            </div>


                            <h3>
                                Something went wrong
                            </h3>


                            <p>
                                {error}
                            </p>


                            <button
                                type="button"
                                onClick={() => {
                                    setRetryCount(
                                        (current) =>
                                            current + 1
                                    );
                                }}
                                className="category-retry-button"
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                {/* =================================================
                    STORIES
                   ================================================= */}

                {!loading &&
                    !error &&
                    posts.length > 0 && (

                        <div className="category-posts">

                            {posts.map((post) => (

                                <PostCard
                                    key={post.id}
                                    post={post}
                                />

                            ))}

                        </div>

                    )}


                {/* =================================================
                    EMPTY RESULT
                   ================================================= */}

                {!loading &&
                    !error &&
                    posts.length === 0 && (

                        <div className="category-empty-state">

                            <div className="category-empty-icon">
                                ?
                            </div>


                            <h3>
                                No stories found
                            </h3>


                            <p>

                                We couldn't find any{" "}

                                {tag
                                    ? `stories tagged "${tag}"`
                                    : category
                                        ? `${category.toLowerCase()} stories`
                                        : "stories"
                                }{" "}

                                {searchTerm
                                    ? "matching your search."
                                    : "matching your selection."
                                }

                            </p>


                            {searchTerm && (

                                <button
                                    type="button"
                                    className="category-clear-button"
                                    onClick={
                                        handleClearSearch
                                    }
                                >
                                    Clear Search
                                </button>

                            )}

                        </div>

                    )}


                {/* =================================================
                    PAGINATION
                   ================================================= */}

                {!loading &&
                    !error &&
                    totalPages > 1 && (

                        <nav
                            className="category-pagination"
                            aria-label="Story pagination"
                        >


                            {/* PREVIOUS */}

                            <button
                                type="button"
                                className="pagination-arrow"
                                disabled={page === 1}
                                onClick={
                                    handlePreviousPage
                                }
                            >

                                ←

                                <span>
                                    Previous
                                </span>

                            </button>


                            {/* PAGE NUMBERS */}

                            <div className="pagination-numbers">

                                {getPageNumbers().map(
                                    (item, index) => {

                                        if (
                                            item === "..."
                                        ) {

                                            return (

                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="pagination-ellipsis"
                                                >
                                                    …
                                                </span>

                                            );
                                        }


                                        return (

                                            <button
                                                type="button"
                                                key={item}
                                                className={
                                                    page === item
                                                        ? "pagination-number active"
                                                        : "pagination-number"
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        item
                                                    )
                                                }
                                                aria-current={
                                                    page === item
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {item}
                                            </button>

                                        );
                                    }
                                )}

                            </div>


                            {/* NEXT */}

                            <button
                                type="button"
                                className="pagination-arrow"
                                disabled={
                                    page === totalPages
                                }
                                onClick={
                                    handleNextPage
                                }
                            >

                                <span>
                                    Next
                                </span>

                                →

                            </button>

                        </nav>

                    )}

            </section>

        </main>
    );
}


export default CategoryPage;