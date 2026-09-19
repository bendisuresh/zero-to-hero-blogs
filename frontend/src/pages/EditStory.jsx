import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StoryForm from "../components/StoryForm";

import apiFetch from "../services/api";
import useAuth from "../hooks/useAuth";

import "./CreateStory.css";

function EditStory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        logout,
    } = useAuth();

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
        status: "published",
        image_url: "",
    });

    // ============================================================
    // PAGE STATE
    // ============================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = () => {
        setError("");
        setLoading(true);
        setRetryCount((count) => count + 1);
    };

    // ============================================================
    // RICH TEXT EDITOR
    // ============================================================

    const [editor, setEditor] = useState(null);

    // ============================================================
    // IMAGE STATE
    // ============================================================

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    // ============================================================
    // LOAD EXISTING STORY
    // ============================================================

    useEffect(() => {
        const getPost = async () => {
            if (!isAuthenticated) {
                navigate("/admin/login");
                return;
            }

            setLoading(true);
            setError("");

            try {
                const data = await apiFetch(
                    `/api/admin/posts/${id}`
                );

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    category: data.category || "Business",
                    storyteller: data.storyteller || "",
                    storyteller_email: data.storyteller_email || "",
                    starting_point: data.starting_point || "",
                    how_started: data.how_started || "",
                    financial_info: data.financial_info || "",
                    approach: data.approach || "",
                    life_changed: data.life_changed || "",
                    failures: data.failures || "",
                    lessons: data.lessons || "",
                    tags: data.tags || "",
                    image_url: data.image_url || "",
                    status: data.status || "published",
                });

                setImageUrl(data.image_url || "");
            } catch (error) {
                if (
                    error.status === 401 ||
                    error.status === 422
                ) {
                    logout();
                    navigate("/admin/login");
                    return;
                }

                setError(
                    error.message ||
                    "Unable to load story"
                );
            } finally {
                setLoading(false);
            }
        };

        getPost();
    }, [
        id,
        navigate,
        isAuthenticated,
        logout,
        retryCount,
    ]);

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
    // SELECT NEW IMAGE
    // ============================================================

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setSelectedImage(file);
        setError("");
        setMessage("");
    };

    // ============================================================
    // UPLOAD NEW IMAGE
    // ============================================================

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setError(
                "Please select an image first"
            );

            return;
        }

        if (!isAuthenticated) {
            navigate("/admin/login");
            return;
        }

        setError("");
        setMessage("");
        setUploadingImage(true);

        const uploadData = new FormData();

        uploadData.append(
            "image",
            selectedImage
        );

        try {
            const data = await apiFetch(
                "/api/admin/upload",
                {
                    method: "POST",
                    body: uploadData,
                }
            );

            setImageUrl(data.image_url);

            setFormData((currentData) => ({
                ...currentData,
                image_url: data.image_url,
            }));

            setSelectedImage(null);

            setMessage(
                "New image uploaded successfully!"
            );
        } catch (error) {
            if (
                error.status === 401 ||
                error.status === 422
            ) {
                logout();
                navigate("/admin/login");
                return;
            }

            setError(
                error.message ||
                "Failed to upload image"
            );
        } finally {
            setUploadingImage(false);
        }
    };

    // ============================================================
    // ADD LINK
    // ============================================================

    const handleAddLink = () => {
        const url = window.prompt(
            "Enter URL:"
        );

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

        if (!isAuthenticated) {
            navigate("/admin/login");
            return;
        }

        const status =
            event.nativeEvent.submitter?.value ||
            formData.status ||
            "published";

        // ========================================================
        // VALIDATION
        // ========================================================

        if (!formData.financial_info.trim()) {
            setError(
                "Financial Information is required"
            );

            return;
        }

        if (!editor || editor.isEmpty) {
            setError(
                "Lessons field is required"
            );

            return;
        }

        setSaving(true);

        try {
            await apiFetch(
                `/api/admin/posts/${id}`,
                {
                    method: "PUT",
                    body: {
                        ...formData,
                        status,
                    },
                }
            );

            setMessage(
                "Story updated successfully!"
            );
        } catch (error) {
            if (
                error.status === 401 ||
                error.status === 422
            ) {
                logout();
                navigate("/admin/login");
                return;
            }

            setError(
                error.message ||
                "Failed to update story"
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
                    <LoadingState message="Loading story..." />
                </section>
            </main>
        );
    }

    // ============================================================
    // ERROR SCREEN
    // ============================================================

    if (error && !formData.title) {
        return (
            <main className="create-story-page">
                <section className="create-story-container">
                    <ErrorState
                        title="Unable to load story"
                        message={error}
                        onRetry={handleRetry}
                    />
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
                        STORY IMAGE
                    ==================================================== */}

                    <div className="form-group edit-story-image">

                        <label htmlFor="edit-story-image">
                            Story Image
                        </label>

                        {/* Current image */}

                        {imageUrl && (
                            <div className="existing-image-preview">

                                <p>
                                    Current Story Image
                                </p>

                                <img
                                    src={imageUrl}
                                    alt="Current story"
                                />

                            </div>
                        )}

                        {/* Select new image */}

                        <input
                            id="edit-story-image"
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            onChange={handleImageChange}
                        />

                        {/* Upload replacement */}

                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={
                                !selectedImage ||
                                uploadingImage
                            }
                            className="upload-image-button"
                        >
                            {uploadingImage
                                ? "Uploading..."
                                : "Replace Image"}
                        </button>

                    </div>

                    {/* ====================================================
                        SAVE / CANCEL
                    ==================================================== */}

                    <div className="form-group edit-story-actions">

                        <button
                            type="submit"
                            name="status"
                            value="draft"
                            className="save-draft-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Draft"}
                        </button>

                        <button
                            type="submit"
                            name="status"
                            value="published"
                            className="create-story-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Publish"}
                        </button>

                    </div>

                </form>

            </section>
        </main>
    );
}

export default EditStory;