import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import "./Home.css";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/posts`
);

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();

                setPosts(data);
            } catch {
                setError("Unable to load latest stories.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Show only the latest 6 stories on the Home page
    const latestPosts = posts.slice(0, 6);

    return (
        <main className="home-page">

            {/* Hero section */}
            <section className="home-hero">
                <h1>Zero to Hero Blogs</h1>

                <p>
                    Everyone starts from zero.
                    Discover real stories of people who struggled,
                    took action, and changed their lives.
                </p>

                <Link
                    to="/business"
                    className="home-explore-button"
                >
                    Explore Stories
                </Link>
            </section>


            {/* Categories section */}
            <section className="home-categories">
                <h2>Explore Stories</h2>

                <div className="category-container">

                    <Link
                        to="/business"
                        className="category-card"
                    >
                        <h3>Business</h3>

                        <p>
                            Learn from people who started businesses
                            and built their journey from scratch.
                        </p>
                    </Link>


                    <Link
                        to="/job"
                        className="category-card"
                    >
                        <h3>Job</h3>

                        <p>
                            Discover career journeys, struggles,
                            growth, and professional success.
                        </p>
                    </Link>


                    <Link
                        to="/investment"
                        className="category-card"
                    >
                        <h3>Investment</h3>

                        <p>
                            Learn about investment journeys,
                            mistakes, strategies, and lessons.
                        </p>
                    </Link>


                    <Link
                        to="/other"
                        className="category-card"
                    >
                        <h3>Other</h3>

                        <p>
                            Explore inspiring stories that don't
                            fit into the other categories.
                        </p>
                    </Link>

                </div>
            </section>


            {/* Latest stories from database */}
            <section className="home-latest-stories">

                <h2>Latest Stories</h2>

                <p className="home-section-description">
                    Read the latest journeys added to Zero to Hero Blogs.
                </p>

                {loading && (
                    <p className="home-message">
                        Loading stories...
                    </p>
                )}

                {error && (
                    <p className="home-message home-error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="home-posts">

                        {latestPosts.length > 0 ? (
                            latestPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                />
                            ))
                        ) : (
                            <p className="home-message">
                                No stories available.
                            </p>
                        )}

                    </div>
                )}

            </section>


            {/* Journey section */}
            <section className="home-journey">

                <h2>From Zero to Hero</h2>

                <p>
                    Every successful person has a journey.
                    We share the struggles, failures, decisions,
                    approaches, and lessons behind their success.
                </p>

                <div className="journey-steps">

                    <div>
                        <span>01</span>
                        <h3>Start</h3>
                        <p>Where the journey began.</p>
                    </div>

                    <div>
                        <span>02</span>
                        <h3>Struggle</h3>
                        <p>The problems and failures faced.</p>
                    </div>

                    <div>
                        <span>03</span>
                        <h3>Action</h3>
                        <p>The approach and decisions taken.</p>
                    </div>

                    <div>
                        <span>04</span>
                        <h3>Success</h3>
                        <p>What changed and what was learned.</p>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;