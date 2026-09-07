import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

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


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


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


                // Put existing lessons into Tiptap.
                if (editor) {

                    editor.commands.setContent(
                        data.lessons || ""
                    );

                }

            } catch {

                setError(
                    "Unable to connect to the server"
                );

            } finally {

                setLoading(false);

            }

        };


        getPost();

    }, [id, navigate, editor]);


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


                    {/* Story Title */}

                    <div className="form-group">

                        <label htmlFor="title">
                            Story Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            name="title"
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
                            value={formData.storyteller}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Storyteller Email */}

                    <div className="form-group">

                        <label htmlFor="storyteller_email">
                            Storyteller Email
                        </label>

                        <input
                            id="storyteller_email"
                            type="email"
                            name="storyteller_email"
                            value={
                                formData.storyteller_email
                            }
                            onChange={handleChange}
                            placeholder="storyteller@example.com"
                        />

                    </div>


                    {/* Starting Point */}

                    <div className="form-group">

                        <label htmlFor="starting_point">
                            Where did the journey start?
                        </label>

                        <textarea
                            id="starting_point"
                            name="starting_point"
                            value={
                                formData.starting_point
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* How Started */}

                    <div className="form-group">

                        <label htmlFor="how_started">
                            How did they start?
                        </label>

                        <textarea
                            id="how_started"
                            name="how_started"
                            value={
                                formData.how_started
                            }
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Financial Information */}

                    <div className="form-group">

                        <label htmlFor="financial_info">
                            Financial Information
                        </label>

                        <textarea
                            id="financial_info"
                            name="financial_info"
                            value={
                                formData.financial_info
                            }
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
                            value={formData.approach}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Life Changed */}

                    <div className="form-group">

                        <label htmlFor="life_changed">
                            What Changed Their Life?
                        </label>

                        <textarea
                            id="life_changed"
                            name="life_changed"
                            value={
                                formData.life_changed
                            }
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
                            value={formData.failures}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Tags */}

                    <div className="form-group">

                        <label htmlFor="tags">
                            Tags
                        </label>

                        <input
                            id="tags"
                            type="text"
                            name="tags"
                            placeholder="business, startup, success"
                            value={formData.tags}
                            onChange={handleChange}
                        />

                    </div>


                    {/* Rich Text Editor */}

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


                            {/* Add Link */}

                            <button
                                type="button"
                                onClick={() => {

                                    const url =
                                        window.prompt(
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

                                }}
                                className={
                                    editor?.isActive("link")
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Link
                            </button>


                            {/* Edit Link */}

                            <button
                                type="button"
                                onClick={() => {

                                    const currentUrl =
                                        editor?.getAttributes(
                                            "link"
                                        ).href;


                                    const url =
                                        window.prompt(
                                            "Enter new URL:",
                                            currentUrl || ""
                                        );


                                    if (!url) {
                                        return;
                                    }


                                    editor
                                        ?.chain()
                                        .focus()
                                        .extendMarkRange(
                                            "link"
                                        )
                                        .setLink({
                                            href: url,
                                        })
                                        .run();

                                }}
                                className="editor-button"
                            >
                                Edit Link
                            </button>


                            {/* Remove Link */}

                            <button
                                type="button"
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .unsetLink()
                                        .run()
                                }
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
                                    editor?.isActive(
                                        "heading",
                                        {
                                            level: 2,
                                        }
                                    )
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                H2
                            </button>


                            {/* Bullet List */}

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
                                    editor?.isActive(
                                        "bulletList"
                                    )
                                        ? "editor-button active"
                                        : "editor-button"
                                }
                            >
                                Bullet List
                            </button>


                            {/* Numbered List */}

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
                                    editor?.isActive(
                                        "orderedList"
                                    )
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


                    {/* Save and Cancel */}

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