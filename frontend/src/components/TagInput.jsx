function TagInput({
    value,
    onChange,
}) {
    return (
        <div className="form-group">

            <label htmlFor="tags">
                Tags
            </label>

            <input
                id="tags"
                type="text"
                name="tags"
                placeholder="business, startup, success"
                value={value}
                onChange={onChange}
            />

        </div>
    );
}

export default TagInput;