import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import "./CreateStory.css";


function CreateStory() {

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
        tags: ""
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

    const editor = useEditor({

        extensions: [
            StarterKit,

            Link.configure({
                openOnClick: false,
            }),

            Image,
        ],

        content: "",

        onUpdate: ({ editor }) => {

            setFormData((currentData) => ({
                ...currentData,
                lessons: editor.getHTML(),
            }));

        },

    });


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


        const token = localStorage.getItem("admin_token");


        if (!token) {

            navigate("/admin/login");

            return;
        }


        setError("");
        setMessage("");
        setUploadingImage(true);


        const uploadData = new FormData();

        uploadData.append("image", selectedImage);


        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/upload`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                    body: uploadData,
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to upload image"
                );

                return;
            }


            setImageUrl(data.image_url);


            // Insert uploaded image into editor.
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

        } catch {

            setError(
                "Unable to connect to the server"
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


        const token = localStorage.getItem("admin_token");


        if (!token) {

            navigate("/admin/login");

            return;
        }


        // Make sure the editor contains content.
        if (!editor || editor.isEmpty) {

            setError("Lessons field is required");

            return;
        }


        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/posts`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(formData),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to create story"
                );

                return;
            }


            setMessage(
                "Story created successfully!"
            );


            // Clear form.
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
                tags: ""
            });


            // Clear editor.
            editor.commands.clearContent();


            // Clear image state.
            setSelectedImage(null);
            setImageUrl("");

        } catch {

            setError(
                "Unable to connect to the server"
            );

        }

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <main className="create-story-page">

            <section className="create-story-container">

                <h1>Create Story</h1>


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


                    {/* Story title */}

                    <div className="form-group">

                        <label htmlFor="title">
                            Story Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Story title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Description */}

                    <div className="form-group">

                        <label htmlFor="description">
                            Short Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="Short description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Category */}

                    <div className="form-group">

                        <label htmlFor="category">
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >

                            <option value="Business">
                                Business
                            </option>

                            <option value="Job">
                                Job
                            </option>

                            <option value="Investment">
                                Investment
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* Storyteller */}

                    <div className="form-group">

                        <label htmlFor="storyteller">
                            Storyteller
                        </label>

                        <input
                            id="storyteller"
                            type="text"
                            name="storyteller"
                            placeholder="Storyteller name"
                            value={formData.storyteller}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Storyteller email */}

                    <div className="form-group">

                        <label htmlFor="storyteller_email">
                            Storyteller Email
                        </label>

                        <input
                            id="storyteller_email"
                            type="email"
                            name="storyteller_email"
                            placeholder="storyteller@example.com"
                            value={formData.storyteller_email}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Starting point */}

                    <div className="form-group">

                        <label htmlFor="starting_point">
                            Where did the journey start?
                        </label>

                        <textarea
                            id="starting_point"
                            name="starting_point"
                            placeholder="Where did the journey start?"
                            value={formData.starting_point}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* How they started */}

                    <div className="form-group">

                        <label htmlFor="how_started">
                            How did they start?
                        </label>

                        <textarea
                            id="how_started"
                            name="how_started"
                            placeholder="How did they start?"
                            value={formData.how_started}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Financial information */}

                    <div className="form-group">

                        <label htmlFor="financial_info">
                            Financial Information
                        </label>

                        <textarea
                            id="financial_info"
                            name="financial_info"
                            placeholder="Financial information"
                            value={formData.financial_info}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Approach */}

                    <div className="form-group">

                        <label htmlFor="approach">
                            Approach Used
                        </label>

                        <textarea
                            id="approach"
                            name="approach"
                            placeholder="What approach did they use?"
                            value={formData.approach}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Life changed */}

                    <div className="form-group">

                        <label htmlFor="life_changed">
                            What Changed Their Life?
                        </label>

                        <textarea
                            id="life_changed"
                            name="life_changed"
                            placeholder="What changed their life?"
                            value={formData.life_changed}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Failures */}

                    <div className="form-group">

                        <label htmlFor="failures">
                            Failures
                        </label>

                        <textarea
                            id="failures"
                            name="failures"
                            placeholder="Failures"
                            value={formData.failures}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Rich text lessons */}

                    <div className="form-group">

                        <label>
                            Lessons Learned
                        </label>


                        <div className="editor-toolbar">


                            {/* Bold */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBold()
                                        .run()
                                }
                                className={
                                    editor?.isActive("bold")
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Bold
                            </button>


                            {/* Italic */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleItalic()
                                        .run()
                                }
                                className={
                                    editor?.isActive("italic")
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Italic
                            </button>


                            {/* Add link */}

                            <button
                                type="button"
                                onClick={handleAddLink}
                                className={
                                    editor?.isActive("link")
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Link
                            </button>


                            {/* Edit link */}

                            <button
                                type="button"
                                onClick={handleEditLink}
                                className="editor-button"
                            >
                                Edit Link
                            </button>


                            {/* Remove link */}

                            <button
                                type="button"
                                onClick={handleRemoveLink}
                                className="editor-button"
                            >
                                Remove Link
                            </button>


                            {/* H2 */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({
                                            level: 2,
                                        })
                                        .run()
                                }
                                className={
                                    editor?.isActive("heading", {
                                        level: 2,
                                    })
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                H2
                            </button>


                            {/* Bullet list */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className={
                                    editor?.isActive("bulletList")
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Bullet List
                            </button>


                            {/* Numbered list */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                                className={
                                    editor?.isActive("orderedList")
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Numbered List
                            </button>

                        </div>


                        <EditorContent
                            editor={editor}
                            className="rich-text-editor"
                        />

                    </div>


                    {/* Image upload */}

                    <div className="form-group">

                        <label htmlFor="story-image">
                            Story Image
                        </label>


                        <input
                            id="story-image"
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp"
                            onChange={handleImageChange}
                        />


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
                                : "Upload Image"}
                        </button>


                        {imageUrl && (

                            <div className="uploaded-image-preview">

                                <p>
                                    Image uploaded successfully:
                                </p>


                                <img
                                    src={imageUrl}
                                    alt="Uploaded story"
                                />


                                <p className="image-url">
                                    {imageUrl}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* Submit */}

                    <button
                        type="submit"
                        className="create-story-button"
                    >
                        Create Story
                    </button>

                </form>

            </section>

        </main>

    );

}


export default CreateStory;