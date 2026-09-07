import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddAdditionalStory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("admin_token");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/posts/${id}/additional-stories`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        content,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to add story");
                return;
            }

            setMessage("Additional story added successfully!");

            setTitle("");
            setContent("");

        } catch {
            setError("Unable to connect to the server");
        }
    };

    return (
        <div>
            <h1>Add Additional Story</h1>

            <p>
                Adding story to Post #{id}
            </p>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Additional story title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />

                <textarea
                    name="content"
                    placeholder="Write the additional story..."
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                />

                <button type="submit">
                    Add Story
                </button>
            </form>

            <button onClick={() => navigate("/admin/dashboard")}>
                Back to Dashboard
            </button>
        </div>
    );
}

export default AddAdditionalStory;