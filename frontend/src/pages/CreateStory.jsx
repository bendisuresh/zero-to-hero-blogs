import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StoryForm from "../components/StoryForm";
import apiFetch from "../services/api";
import useAuth from "../hooks/useAuth";
import "./CreateStory.css";

function CreateStory() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

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

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ============================================================
    // IMAGE STATE
    // ============================================================

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    // ============================================================
    // RICH TEXT EDITOR
    // ============================================================

    const [editor, setEditor] = useState(null);

    // ============================================================
    // HANDLE NORMAL INPUT CHANGES
    // ============================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    // ============================================================
    // SELECT IMAGE
    // ============================================================

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setSelectedImage(file);
        setImageUrl("");
        setError("");
    };

    // ============================================================
    // UPLOAD IMAGE
    // ============================================================

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setError("Please select an image first");
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

        uploadData.append("image", selectedImage);

        try {
            const data = await apiFetch(
                "/api/admin/upload",
                {
                    method: "POST",
                    body: uploadData,
                }
            );

            setImageUrl(data.image_url);

            // Insert uploaded image into the editor.
            editor
                ?.chain()
                .focus()
                .setImage({
                    src: data.image_url,
                })
                .run();

            setMessage(
                "Image uploaded successfully!"
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
    // URL VALIDATION
    // ============================================================

    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);

            return (
                parsedUrl.protocol === "http:" ||
                parsedUrl.protocol === "https:"
            );
        } catch {
            return false;
        }
    };

    // ============================================================
    // ADD LINK
    // ============================================================

    const handleAddLink = () => {
        const url = window.prompt("Enter URL:");

        if (!url) {
            return;
        }

        if (!isValidUrl(url)) {
            setError(
                "Please enter a valid URL starting with http:// or https://"
            );

            return;
        }

        setError("");

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

        if (!isValidUrl(url)) {
            setError(
                "Please enter a valid URL starting with http:// or https://"
            );

            return;
        }

        setError("");

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
    // CREATE STORY
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!isAuthenticated) {
            navigate("/admin/login");
            return;
        }

        if (!editor || editor.isEmpty) {
            setError("Lessons field is required");
            return;
        }
        const status =
            event.nativeEvent.submitter?.value ||
            "published";

        try {
            await apiFetch(
                "/api/admin/posts",
                {
                    method: "POST",
                    body: {
                        ...formData,
                        status,
                    },
                }
            );

            setMessage(
                "Story created successfully!"
            );

            // ========================================================
            // CLEAR FORM
            // ========================================================

            setFormData({
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

            editor.commands.clearContent();

            setSelectedImage(null);
            setImageUrl("");

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
                "Failed to create story"
            );
        }
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <main className="create-story-page">

            <section className="create-story-container">

                <h1>
                    Create Story
                </h1>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <StoryForm
                        formData={formData}
                        handleChange={handleChange}
                        editor={editor}
                        setEditor={setEditor}
                        handleAddLink={handleAddLink}
                        handleEditLink={handleEditLink}
                        handleRemoveLink={handleRemoveLink}
                        selectedImage={selectedImage}
                        imageUrl={imageUrl}
                        uploadingImage={uploadingImage}
                        onImageChange={handleImageChange}
                        onImageUpload={handleImageUpload}
                    />

                    <div className="story-action-buttons">

                        <button
                            type="submit"
                            name="status"
                            value="draft"
                            className="save-draft-button"
                        >
                            Save Draft
                        </button>

                        <button
                            type="submit"
                            name="status"
                            value="published"
                            className="create-story-button"
                        >
                            Publish
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default CreateStory;