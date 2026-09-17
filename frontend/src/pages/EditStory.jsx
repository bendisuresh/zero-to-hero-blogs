import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import StoryForm from "../components/StoryForm";

import "./CreateStory.css";

function EditStory() {
    const { id } = useParams();
    const navigate = useNavigate();

    // ============================================================
    // FORM DATA
    // ============================================================

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Business",
        storyteller: "",
        storyteller_email: "",
        starting_point: "",
        how_started: "",
        financial_info: "",
        approach: "",
        life_changed: "",
        failures: "",
        lessons: "",
        tags: "",
    });

    // ============================================================
    // PAGE STATE
    // ============================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ============================================================
    // RICH TEXT EDITOR
    // ============================================================

    const [editor, setEditor] = useState(null);

    // ============================================================
    // LOAD EXISTING STORY
    // ============================================================

    useEffect(() => {
        const getPost = async () => {
            const token =
                localStorage.getItem("admin_token");

            if (!token) {
                navigate("/admin/login");
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/posts/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load story"
                    );

                    return;
                }

                setFormData({
                    title: data.title || "",

                    description:
                        data.description || "",

                    category:
                        data.category || "Business",

                    storyteller:
                        data.storyteller || "",

                    storyteller_email:
                        data.storyteller_email || "",

                    starting_point:
                        data.starting_point || "",

                    how_started:
                        data.how_started || "",

                    financial_info:
                        data.financial_info || "",

                    approach:
                        data.approach || "",

                    life_changed:
                        data.life_changed || "",

                    failures:
                        data.failures || "",

                    lessons:
                        data.lessons || "",

                    tags:
                        data.tags || "",
                });
            } catch {
                setError(
                    "Unable to connect to the server"
                );
            } finally {
                setLoading(false);
            }
        };

        getPost();
    }, [id, navigate]);

    // ============================================================
    // HANDLE INPUT CHANGES
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    // ============================================================
    // ADD LINK
    // ============================================================

    const handleAddLink = () => {
        const url = window.prompt("Enter URL:");

        if (!url) {
            return;
        }

        editor
            ?.chain()
            .focus()
            .setLink({
                href: url,
            })
            .run();
    };

    // ============================================================
    // EDIT LINK
    // ============================================================

    const handleEditLink = () => {
        const currentUrl =
            editor?.getAttributes("link").href;

        const url = window.prompt(
            "Enter new URL:",
            currentUrl || ""
        );

        if (!url) {
            return;
        }

        editor
            ?.chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
                href: url,
            })
            .run();
    };

    // ============================================================
    // REMOVE LINK
    // ============================================================

    const handleRemoveLink = () => {
        editor
            ?.chain()
            .focus()
            .unsetLink()
            .run();
    };

    // ============================================================
    // SUBMIT UPDATED STORY
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const token =
            localStorage.getItem("admin_token");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        // Financial information validation.

        if (!formData.financial_info.trim()) {
            setError(
                "Financial Information is required"
            );

            return;
        }

        // Lessons validation.

        if (!editor || editor.isEmpty) {
            setError(
                "Lessons field is required"
            );

            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/posts/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to update story"
                );

                return;
            }

            setMessage(
                "Story updated successfully!"
            );
        } catch {
            setError(
                "Unable to connect to the server"
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // LOADING SCREEN
    // ============================================================

    if (loading) {
        return (
            <main className="create-story-page">
                <section className="create-story-container">
                    <h1>
                        Loading Story...
                    </h1>
                </section>
            </main>
        );
    }

    // ============================================================
    // EDIT FORM
    // ============================================================

    return (
        <main className="create-story-page">
            <section className="create-story-container">

                <h1>
                    Edit Story
                </h1>

                {/* ====================================================
                    SUCCESS MESSAGE
                ==================================================== */}

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {/* ====================================================
                    ERROR MESSAGE
                ==================================================== */}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    {/* ====================================================
                        REUSABLE STORY FORM
                    ==================================================== */}

                    <StoryForm
                        formData={formData}
                        handleChange={handleChange}
                        editor={editor}
                        setEditor={setEditor}
                        handleAddLink={handleAddLink}
                        handleEditLink={handleEditLink}
                        handleRemoveLink={handleRemoveLink}
                    />

                    {/* ====================================================
                        SAVE / CANCEL
                    ==================================================== */}

                    <div className="form-group edit-story-actions">

                        <button
                            type="submit"
                            className="create-story-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            className="cancel-story-button"
                            onClick={() =>
                                navigate(
                                    "/admin/dashboard"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </section>
        </main>
    );
}

export default EditStory;