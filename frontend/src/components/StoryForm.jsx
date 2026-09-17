import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";
import ImageUploader from "./ImageUploader";

function StoryForm({
    formData,
    handleChange,
    editor,
    setEditor,
    handleAddLink,
    handleEditLink,
    handleRemoveLink,
    selectedImage,
    imageUrl,
    uploadingImage,
    onImageChange,
    onImageUpload,
}) {
    return (
        <>
            {/* ============================================================
                STORY TITLE
            ============================================================ */}

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

            {/* ============================================================
                DESCRIPTION
            ============================================================ */}

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

            {/* ============================================================
                CATEGORY
            ============================================================ */}

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

            {/* ============================================================
                STORYTELLER
            ============================================================ */}

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

            {/* ============================================================
                STORYTELLER EMAIL
            ============================================================ */}

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

            {/* ============================================================
                STARTING POINT
            ============================================================ */}

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

            {/* ============================================================
                HOW THEY STARTED
            ============================================================ */}

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

            {/* ============================================================
                FINANCIAL INFORMATION
            ============================================================ */}

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

            {/* ============================================================
                APPROACH
            ============================================================ */}

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

            {/* ============================================================
                LIFE CHANGED
            ============================================================ */}

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

            {/* ============================================================
                FAILURES
            ============================================================ */}

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

            {/* ============================================================
                TAGS
            ============================================================ */}

            <TagInput
                value={formData.tags}
                onChange={handleChange}
            />

            {/* ============================================================
                IMAGE UPLOAD
            ============================================================ */}

            {onImageChange && onImageUpload && (
                <ImageUploader
                    selectedImage={selectedImage}
                    imageUrl={imageUrl}
                    uploadingImage={uploadingImage}
                    onImageChange={onImageChange}
                    onImageUpload={onImageUpload}
                />
            )}

            {/* ============================================================
                LESSONS / RICH TEXT EDITOR
            ============================================================ */}

            <div className="form-group">
                <label>
                    Lessons Learned
                </label>

                {/* Editor toolbar */}

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

                <RichTextEditor
                    value={formData.lessons}
                    onChange={(value) => {
                        handleChange({
                            target: {
                                name: "lessons",
                                value,
                            },
                        });
                    }}
                    onEditorReady={setEditor}
                />

            </div>
        </>
    );
}

export default StoryForm;