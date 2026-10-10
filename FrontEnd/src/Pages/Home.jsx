import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import messageHandler from "../utils.jsx";
import { API_BASE_URL } from "../config.js";

export default function HomePage({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [loggedInUser] = useState(() => localStorage.getItem("loggedInUser") || "User");
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const handleLogOut = useCallback(() => {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("token");
        if (setIsAuthenticated) {
            setIsAuthenticated(false);
        }
        messageHandler.handleSuccess("Logged out successfully");
        navigate("/login");
    }, [navigate, setIsAuthenticated]);

    const loadProducts = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            handleLogOut();
            return;
        }

        try {
            setLoadingProducts(true);
            const url = `${API_BASE_URL}/product`;
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                messageHandler.handleError("Session expired. Please log in again.");
                handleLogOut();
                return;
            }

            const result = await response.json();
            setProducts(Array.isArray(result) ? result : []);
        } catch (error) {
            messageHandler.handleError(error.message || "Failed to fetch products");
        } finally {
            setLoadingProducts(false);
        }
    }, [handleLogOut]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            handleLogOut();
            return;
        }

        let isMounted = true;
        const controller = new AbortController();

        fetch(`${API_BASE_URL}/product`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            signal: controller.signal
        })
            .then(async (response) => {
                if (response.status === 401) {
                    messageHandler.handleError("Session expired. Please log in again.");
                    handleLogOut();
                    return;
                }
                const result = await response.json();
                if (isMounted) {
                    setProducts(Array.isArray(result) ? result : []);
                    setLoadingProducts(false);
                }
            })
            .catch((error) => {
                if (error.name !== "AbortError" && isMounted) {
                    messageHandler.handleError(error.message || "Failed to fetch products");
                    setLoadingProducts(false);
                }
            });

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [handleLogOut]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
                            A
                        </div>
                        <span className="font-semibold text-lg text-white">AuthPortal</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Signed in as <strong className="text-white">{loggedInUser}</strong></span>
                        </div>
                        <button
                            onClick={handleLogOut}
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
                {/* Hero Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{loggedInUser}</span>!
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                        You have successfully authenticated via JWT. Below is your protected catalog data, served securely from the protected backend route.
                    </p>
                </div>

                {/* Protected Data Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Protected Products</h2>
                        <p className="text-xs text-slate-400">Data retrieved from <code className="text-indigo-400">/product</code> endpoint</p>
                    </div>
                    <button
                        onClick={loadProducts}
                        disabled={loadingProducts}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                    >
                        {loadingProducts ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="h-44 rounded-xl bg-slate-900 border border-slate-800 animate-pulse p-5">
                                <div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-slate-800/60 rounded w-1/2 mb-6"></div>
                                <div className="h-6 bg-slate-800 rounded w-1/3 mt-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {products.map((item, idx) => (
                            <div
                                key={item.id || idx}
                                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all hover:-translate-y-1"
                            >
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                                        {item.category || "Item"}
                                    </span>
                                    <h3 className="font-semibold text-white text-base mb-1">
                                        {item.name}
                                    </h3>
                                    {item.description && (
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium">Price</span>
                                    <span className="text-lg font-bold text-emerald-400">
                                        ${Number(item.price).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <p className="text-slate-400 text-sm">No products found in the database.</p>
                    </div>
                )}
            </main>

            <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
                Production-ready Authentication System • Protected by JWT
            </footer>
        </div>
    );
}