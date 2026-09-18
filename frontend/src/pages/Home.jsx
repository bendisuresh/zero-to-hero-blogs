import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import getStoryImage from "../utils/storyImage";
import apiFetch from "../services/api";
import "./Home.css";


const categories = [
    {
        number: "01",
        name: "Business",
        description:
            "Ideas, risks, failures, and the people who built something from scratch.",
        path: "/business",
        className: "category-business",
    },
    {
        number: "02",
        name: "Jobs",
        description:
            "Career journeys, difficult decisions, growth, and professional breakthroughs.",
        path: "/job",
        className: "category-job",
    },
    {
        number: "03",
        name: "Investment",
        description:
            "Investment decisions, mistakes, lessons, and the road to better choices.",
        path: "/investment",
        className: "category-investment",
    },
    {
        number: "04",
        name: "Other",
        description:
            "Meaningful journeys that do not fit neatly into another category.",
        path: "/other",
        className: "category-other",
    },
];


const journeySteps = [
    {
        number: "01",
        title: "Start",
        description:
            "Every journey begins somewhere. Discover where the story really started.",
    },
    {
        number: "02",
        title: "Struggle",
        description:
            "Understand the problems, setbacks, failures, and uncertainty along the way.",
    },
    {
        number: "03",
        title: "Action",
        description:
            "See the decisions, risks, experiments, and choices that moved the journey forward.",
    },
    {
        number: "04",
        title: "Growth",
        description:
            "Learn what changed, what worked, and what the journey taught them.",
    },
];


function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await apiFetch(
                    "/api/posts?limit=6&sort=latest"
                );

                setPosts(data.posts || []);
            } catch {
                setError("Unable to load latest stories.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    const featuredPosts = posts.slice(0, 3);
    const latestPosts = posts.slice(3, 6);


    return (
        <main className="home-page">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="home-hero">

                <div className="home-hero-glow home-hero-glow-one"></div>

                <div className="home-hero-glow home-hero-glow-two"></div>


                <div className="home-hero-content">

                    <div className="home-hero-label">
                        <span className="home-hero-dot"></span>
                        REAL STORIES. REAL JOURNEYS.
                    </div>


                    <h1>
                        Everyone starts
                        <span> from zero.</span>
                    </h1>


                    <p className="home-hero-description">
                        Read real stories of people who started with
                        uncertainty, took risks, faced failure, learned
                        from the journey, and built something meaningful.
                    </p>


                    <div className="home-hero-actions">

                        <a
                            href="#featured-stories"
                            className="home-primary-button"
                        >
                            Explore Stories
                            <span>→</span>
                        </a>


                        <a
                            href="#categories"
                            className="home-secondary-button"
                        >
                            Browse Categories
                        </a>

                    </div>


                    <div className="home-hero-note">
                        <span></span>
                        Stories about the journey, not just the destination.
                    </div>

                </div>


                <div className="home-hero-bottom">
                    <span>SCROLL TO EXPLORE</span>

                    <div className="home-scroll-line"></div>
                </div>

            </section>


            {/* =========================================
                INTRO
            ========================================= */}

            <section className="home-intro">

                <div className="home-intro-number">
                    01
                </div>


                <div className="home-intro-content">

                    <span className="home-section-kicker">
                        THE IDEA
                    </span>


                    <h2>
                        Behind every success story
                        <em> is a beginning.</em>
                    </h2>


                    <p>
                        Zero to Hero Blogs is a collection of real
                        journeys — the starting points, struggles,
                        decisions, failures, and lessons that usually
                        stay behind the final success story.
                    </p>

                </div>

            </section>


            {/* =========================================
                CATEGORIES
            ========================================= */}

            <section
                className="home-categories"
                id="categories"
            >

                <div className="home-section-heading home-section-heading-left">

                    <div>

                        <span className="home-section-kicker">
                            EXPLORE
                        </span>


                        <h2>
                            Choose a journey.
                        </h2>

                    </div>


                    <p>
                        Different paths. Different challenges.
                        One thing in common — everyone started somewhere.
                    </p>

                </div>


                <div className="category-container">

                    {categories.map((category) => (

                        <Link
                            key={category.name}
                            to={category.path}
                            className={`category-card ${category.className}`}
                        >

                            <div className="category-card-top">

                                <span className="category-number">
                                    {category.number}
                                </span>


                                <span className="category-arrow">
                                    ↗
                                </span>

                            </div>


                            <div className="category-card-content">

                                <h3>
                                    {category.name}
                                </h3>


                                <p>
                                    {category.description}
                                </p>

                            </div>


                            <span className="category-explore">
                                Explore {category.name}
                            </span>

                        </Link>

                    ))}

                </div>

            </section>


            {/* =========================================
                FEATURED STORIES
            ========================================= */}

            <section
                className="home-featured"
                id="featured-stories"
            >

                <div className="home-featured-heading">

                    <div>

                        <span className="home-section-kicker">
                            FEATURED STORIES
                        </span>


                        <h2>
                            Stories worth
                            <br />
                            spending time with.
                        </h2>

                    </div>


                    <Link
                        to="/business"
                        className="home-view-all"
                    >
                        View all stories
                        <span>→</span>
                    </Link>

                </div>


                {loading && (

                    <div className="home-state">

                        <div className="home-loading-dot"></div>

                        <p>
                            Discovering stories...
                        </p>

                    </div>

                )}


                {error && (

                    <div className="home-state home-error">

                        <h3>
                            Stories are taking a moment.
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {!loading && !error && (

                    <>

                        {featuredPosts.length > 0 ? (

                            <div className="featured-story-grid">

                                {featuredPosts.map((post, index) => (

                                    <article
                                        key={post.id}
                                        className={`featured-story-card featured-story-card-${index + 1}`}
                                    >

                                        <Link
                                            to={`/post/${post.id}`}
                                            className="featured-story-image"
                                        >

                                            <img
                                                src={getStoryImage(post)}
                                                alt={post.title}
                                                loading={
                                                    index === 0
                                                        ? "eager"
                                                        : "lazy"
                                                }
                                            />


                                            <span className="featured-story-category">
                                                {post.category}
                                            </span>

                                        </Link>


                                        <div className="featured-story-content">

                                            <div className="featured-story-meta">

                                                <span>
                                                    {post.storyteller}
                                                </span>


                                                {post.created_at && (

                                                    <>

                                                        <span>
                                                            •
                                                        </span>


                                                        <span>
                                                            {new Date(
                                                                post.created_at
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </span>

                                                    </>

                                                )}

                                            </div>


                                            <Link
                                                to={`/post/${post.id}`}
                                                className="featured-story-title"
                                            >
                                                {post.title}
                                            </Link>


                                            <p>
                                                {post.description}
                                            </p>


                                            <div className="featured-story-footer">

                                                <span>
                                                    ♡ {post.likes || 0}
                                                </span>


                                                <span>
                                                    ◉ {post.views || 0}
                                                </span>


                                                <Link
                                                    to={`/post/${post.id}`}
                                                >
                                                    Read story →
                                                </Link>

                                            </div>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        ) : (

                            <div className="home-state">

                                <h3>
                                    No stories available yet.
                                </h3>

                                <p>
                                    New journeys will appear here soon.
                                </p>

                            </div>

                        )}


                        {latestPosts.length > 0 && (

                            <div className="home-latest-strip">

                                <div className="home-latest-strip-heading">

                                    <span className="home-section-kicker">
                                        MORE TO EXPLORE
                                    </span>


                                    <h3>
                                        Latest journeys
                                    </h3>

                                </div>


                                <div className="home-latest-posts">

                                    {latestPosts.map((post) => (

                                        <PostCard
                                            key={post.id}
                                            post={post}
                                        />

                                    ))}

                                </div>

                            </div>

                        )}

                    </>

                )}

            </section>


            {/* =========================================
                WHY ZERO TO HERO
            ========================================= */}

            <section className="home-why">

                <div className="home-why-intro">

                    <span className="home-section-kicker">
                        WHY ZERO TO HERO?
                    </span>


                    <h2>
                        Don't just see
                        <br />
                        the <em>result.</em>
                    </h2>


                    <p>
                        Understand what happened before the success,
                        because that's where the most useful lessons live.
                    </p>

                </div>


                <div className="home-why-grid">

                    <div className="why-card">

                        <span>
                            01
                        </span>

                        <h3>
                            Real Stories
                        </h3>

                        <p>
                            Go beyond headlines and discover the
                            experiences behind the outcome.
                        </p>

                    </div>


                    <div className="why-card">

                        <span>
                            02
                        </span>

                        <h3>
                            Learn From Failure
                        </h3>

                        <p>
                            Understand mistakes and setbacks instead
                            of only hearing about success.
                        </p>

                    </div>


                    <div className="why-card">

                        <span>
                            03
                        </span>

                        <h3>
                            Understand the Journey
                        </h3>

                        <p>
                            Follow the decisions, challenges, and
                            turning points along the way.
                        </p>

                    </div>


                    <div className="why-card">

                        <span>
                            04
                        </span>

                        <h3>
                            Get Inspired
                        </h3>

                        <p>
                            Real journeys can make difficult beginnings
                            feel possible.
                        </p>

                    </div>


                    <div className="why-card why-card-wide">

                        <span>
                            05
                        </span>


                        <div>

                            <h3>
                                Build Your Own Path
                            </h3>

                            <p>
                                Take the lessons that resonate with you
                                and create a journey that is your own.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                JOURNEY
            ========================================= */}

            <section className="home-journey">

                <div className="home-journey-heading">

                    <span className="home-section-kicker">
                        THE JOURNEY
                    </span>


                    <h2>
                        From zero
                        <span> to hero.</span>
                    </h2>


                    <p>
                        Success is only one chapter.
                        The real story is everything that came before it.
                    </p>

                </div>


                <div className="journey-steps">

                    {journeySteps.map((step) => (

                        <div
                            key={step.number}
                            className="journey-step"
                        >

                            <span className="journey-step-number">
                                {step.number}
                            </span>


                            <div className="journey-step-line"></div>


                            <h3>
                                {step.title}
                            </h3>


                            <p>
                                {step.description}
                            </p>

                        </div>

                    ))}

                </div>

            </section>


            {/* =========================================
                FINAL CTA
            ========================================= */}

            <section className="home-cta">

                <div className="home-cta-number">
                    02
                </div>


                <div className="home-cta-content">

                    <span className="home-section-kicker">
                        START EXPLORING
                    </span>


                    <h2>
                        Your next
                        <br />
                        <em>inspiration</em>
                        {" "}could be one story away.
                    </h2>


                    <p>
                        Explore the journeys. Learn from the failures.
                        Take something useful with you.
                    </p>


                    <a
                        href="#featured-stories"
                        className="home-cta-button"
                    >
                        Explore Stories
                        <span>→</span>
                    </a>

                </div>

            </section>

        </main>
    );
}


export default Home;