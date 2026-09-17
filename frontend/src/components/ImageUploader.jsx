function ImageUploader({
    selectedImage,
    imageUrl,
    uploadingImage,
    onImageChange,
    onImageUpload,
}) {
    return (
        <div className="form-group">

            <label htmlFor="story-image">
                Story Image
            </label>

            <input
                id="story-image"
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={onImageChange}
            />

            <button
                type="button"
                onClick={onImageUpload}
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
    );
}

export default ImageUploader;