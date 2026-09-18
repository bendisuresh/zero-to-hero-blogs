const API_URL = import.meta.env.VITE_API_URL;


async function apiFetch(endpoint, options = {}) {

    const token =
        localStorage.getItem("admin_token");

    const headers = {
        ...(options.headers || {}),
    };


    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }


    let body = options.body;


    if (
        body &&
        !(body instanceof FormData) &&
        typeof body !== "string"
    ) {
        headers["Content-Type"] =
            "application/json";

        body = JSON.stringify(body);
    }


    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers,
            body,
        }
    );


    let data = null;


    if (response.status !== 204) {

        data = await response
            .json()
            .catch(() => null);

    }


    if (!response.ok) {

        const error = new Error(
            data?.message ||
            "Something went wrong"
        );

        error.status =
            response.status;

        error.data = data;

        throw error;
    }


    return data;
}


export default apiFetch;