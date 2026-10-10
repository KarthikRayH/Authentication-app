import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import messageHandler from "../utils.jsx";
import { API_BASE_URL } from "../config.js";

export default function LoginPage({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return messageHandler.handleError("Email and Password are required");
        }

        try {
            setLoading(true);
            const url = `${API_BASE_URL}/api/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginInfo)
            });

            const result = await response.json();
            const { success, token, userName, message } = result;

            if (success && token) {
                localStorage.setItem("token", token);
                localStorage.setItem("loggedInUser", userName);
                if (setIsAuthenticated) {
                    setIsAuthenticated(true);
                }
                messageHandler.handleSuccess("Login successful!");
                setTimeout(() => {
                    navigate("/home");
                }, 700);
            } else {
                messageHandler.handleError(message || "Invalid email or password");
            }

        } catch (err) {
            messageHandler.handleError(err.message || "Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Sign in to access your secure dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="name@example.com"
                            value={loginInfo.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={loginInfo.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : "Sign In"}
                    </button>

                    <div className="text-center pt-2">
                        <span className="text-sm text-slate-400">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Create an account
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}