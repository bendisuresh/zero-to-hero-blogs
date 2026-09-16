import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import "./CategoryPage.css";

function CategoryPage({ category, title, description }) {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams({
                    category: category,
                    search: searchTerm,
                    page: page,
                    limit: 10
                });

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/posts?${params.toString()}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();

                setPosts(data.posts);
                setTotalPages(data.total_pages);
            } catch {
                setError("Unable to load stories.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category, searchTerm, page]);

    // Search by title or description


    return (
        <main className="category-page">

            {/* Category introduction */}
            <section className="category-hero">
                <h1>{title}</h1>

                <p>{description}</p>
            </section>

            {/* Stories */}
            <section className="category-content">

                <h2>{category} Journeys</h2>

                {/* Search */}
                <input
                    type="text"
                    className="category-search"
                    placeholder={`Search ${category.toLowerCase()} stories...`}
                    value={searchTerm}
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                        setPage(1);
                    }}
                />

                {/* Loading */}
                {loading && (
                    <p className="category-message">
                        Loading stories...
                    </p>
                )}

                {/* Error */}
                {!loading && error && (
                    <p className="category-message error">
                        {error}
                    </p>
                )}

                {/* Posts */}
                {!loading && !error && (
                    <div className="category-posts">

                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                />
                            ))
                        ) : (
                            <p className="category-message">
                                No stories found.
                            </p>
                        )}

                    </div>
                )}
                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="category-pagination">

                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>

                    </div>
                )}


            </section>

        </main>
    );
}

export default CategoryPage;