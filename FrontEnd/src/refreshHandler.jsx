import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RefreshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null") {
            setIsAuthenticated(true);
            const currentPath = location.pathname.toLowerCase();
            if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
                navigate("/home", { replace: true });
            }
        }
    }, [location, navigate, setIsAuthenticated]);

    return null;
}