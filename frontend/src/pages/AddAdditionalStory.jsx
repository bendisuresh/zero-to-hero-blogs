import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import apiFetch from "../services/api";
import useAuth from "../hooks/useAuth";

import "./AddAdditionalStory.css";

function AddAdditionalStory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        logout,
    } = useAuth();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (
            !title.trim() ||
            !content.trim()
        ) {
            setError(
                "Please enter both a title and story content."
            );
            return;
        }

        if (!isAuthenticated) {
            navigate("/admin/login");
            return;
        }

        setSubmitting(true);

        try {
            await apiFetch(
                `/api/admin/posts/${id}/additional-stories`,
                {
                    method: "POST",
                    body: {
                        title: title.trim(),
                        content: content.trim(),
                    },
                }
            );

            setMessage(
                "Additional story added successfully!"
            );

            setTitle("");
            setContent("");
        } catch (error) {
            if (
                error.status === 401 ||
                error.status === 422 ||
                error.status === 403
            ) {
                logout();
                navigate("/admin/login");
                return;
            }

            setError(
                error.message ||
                "Failed to add additional story."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="additional-story-page">
            <section className="additional-story-container">

                <button
                    type="button"
                    className="additional-story-back-button"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

                <header className="additional-story-header">
                    <div>
                        <span className="additional-story-eyebrow">
                            STORY UPDATE
                        </span>

                        <h1>
                            Add Additional Story
                        </h1>

                        <p>
                            Continue the journey by adding
                            a new update to this story.
                        </p>
                    </div>

                    <div className="additional-story-post-badge">
                        Post #{id}
                    </div>
                </header>

                <div className="additional-story-layout">

                    <aside className="additional-story-info-card">
                        <div className="additional-story-info-icon">
                            +
                        </div>

                        <h2>
                            Continue the Story
                        </h2>

                        <p>
                            Use this section to add a new
                            chapter, milestone, update, or
                            development to the existing story.
                        </p>

                        <div className="additional-story-tip">
                            <strong>Tip</strong>

                            <span>
                                Keep the title short and make
                                the content easy to read.
                            </span>
                        </div>
                    </aside>

                    <section className="additional-story-form-card">

                        <div className="additional-story-form-header">
                            <div>
                                <h2>
                                    New Story Update
                                </h2>

                                <p>
                                    Add the next part of the
                                    storyteller's journey.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="additional-story-form"
                        >

                            {message && (
                                <div className="additional-story-success">
                                    <span>✓</span>

                                    <p>
                                        {message}
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="additional-story-error">
                                    <span>!</span>

                                    <p>
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="additional-story-form-group">
                                <label htmlFor="additional-story-title">
                                    Story Update Title
                                </label>

                                <input
                                    id="additional-story-title"
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Example: A new milestone in the journey"
                                    maxLength={200}
                                />

                                <span className="additional-story-helper">
                                    Give this update a clear,
                                    meaningful title.
                                </span>
                            </div>

                            <div className="additional-story-form-group">
                                <label htmlFor="additional-story-content">
                                    Story Content
                                </label>

                                <textarea
                                    id="additional-story-content"
                                    value={content}
                                    onChange={(event) =>
                                        setContent(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Write the next part of the story..."
                                    rows={12}
                                />

                                <div className="additional-story-content-footer">
                                    <span>
                                        Share the next important
                                        update or milestone.
                                    </span>

                                    <span>
                                        {content.length} characters
                                    </span>
                                </div>
                            </div>

                            <div className="additional-story-actions">
                                <button
                                    type="button"
                                    className="additional-story-cancel-button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/dashboard"
                                        )
                                    }
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="additional-story-submit-button"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Adding Story..."
                                        : "Add Story"}
                                </button>
                            </div>

                        </form>
                    </section>

                </div>
            </section>
        </main>
    );
}

export default AddAdditionalStory;