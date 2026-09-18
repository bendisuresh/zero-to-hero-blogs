import {
    useCallback,
    useEffect,
    useState,
} from "react";


function getStoredToken() {

    return localStorage.getItem(
        "admin_token"
    );

}


function useAuth() {

    const [token, setToken] =
        useState(getStoredToken);


    useEffect(() => {

        const handleAuthChange = () => {

            setToken(
                getStoredToken()
            );

        };


        window.addEventListener(
            "admin-auth-changed",
            handleAuthChange
        );


        return () => {

            window.removeEventListener(
                "admin-auth-changed",
                handleAuthChange
            );

        };

    }, []);


    const login = useCallback((newToken) => {

        localStorage.setItem(
            "admin_token",
            newToken
        );

        setToken(newToken);


        window.dispatchEvent(
            new Event(
                "admin-auth-changed"
            )
        );

    }, []);


    const logout = useCallback(() => {

        localStorage.removeItem(
            "admin_token"
        );

        setToken(null);


        window.dispatchEvent(
            new Event(
                "admin-auth-changed"
            )
        );

    }, []);


    return {

        token,

        isAuthenticated:
            Boolean(token),

        login,

        logout,

    };

}


export default useAuth;
