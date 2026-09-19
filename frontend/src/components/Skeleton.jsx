import "./Skeleton.css";

function Skeleton({
    variant = "text",
    width,
    height,
    className = "",
}) {
    const style = {};

    if (width) {
        style.width = width;
    }

    if (height) {
        style.height = height;
    }

    return (
        <span
            className={`skeleton skeleton-${variant} ${className}`.trim()}
            style={style}
            aria-hidden="true"
        />
    );
}

export default Skeleton;