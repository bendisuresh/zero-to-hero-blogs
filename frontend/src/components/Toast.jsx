import "./Toast.css";

function Toast({ message, type = "success" }) {
    // Don't render anything when there is no message
    if (!message) {
        return null;
    }

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
}

export default Toast;