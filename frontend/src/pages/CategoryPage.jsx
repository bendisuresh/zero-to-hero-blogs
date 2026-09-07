import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import "./CategoryPage.css";

function CategoryPage({ category, title, description }) {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/posts?category=${encodeURIComponent(category)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();

                setPosts(data);
            } catch {
                setError("Unable to load stories.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category]);

    // Search by title or description
    const filteredPosts = posts.filter((post) => {
        const search = searchTerm.toLowerCase();

        return (
            post.title.toLowerCase().includes(search) ||
            post.description.toLowerCase().includes(search)
        );
    });

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
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
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

                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
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

            </section>

        </main>
    );
}

export default CategoryPage;