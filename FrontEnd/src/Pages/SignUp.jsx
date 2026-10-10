import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import messageHandler from "../utils.jsx";
import { API_BASE_URL } from "../config.js";

export default function SignUpPage({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [signupInfo, setSignUpInfo] = useState({
        userName: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUpInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { userName, email, password } = signupInfo;
        if (!userName || !email || !password) {
            return messageHandler.handleError("Username, Email and Password are required");
        }

        try {
            setLoading(true);
            const url = `${API_BASE_URL}/api/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signupInfo)
            });

            const result = await response.json();
            const { success, token, userName: returnedUserName, message } = result;

            if (success && token) {
                localStorage.setItem("token", token);
                localStorage.setItem("loggedInUser", returnedUserName || userName);
                if (setIsAuthenticated) {
                    setIsAuthenticated(true);
                }
                messageHandler.handleSuccess("Account registered successfully!");
                setTimeout(() => {
                    navigate("/home");
                }, 700);
            } else {
                messageHandler.handleError(message || "Registration failed");
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
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Create an Account
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Get started with your free secure profile
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                            Username
                        </label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            required
                            autoComplete="username"
                            placeholder="johndoe"
                            value={signupInfo.userName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

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
                            value={signupInfo.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Minimum 4 characters"
                            value={signupInfo.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : "Sign Up"}
                    </button>

                    <div className="text-center pt-2">
                        <span className="text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}