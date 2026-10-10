import { useState } from "react";
import HomePage from "./Pages/Home.jsx";
import LoginPage from "./Pages/Login.jsx";
import SignUpPage from "./Pages/SignUp.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import RefreshHandler from "./refreshHandler.jsx";
import { ToastContainer } from "react-toastify";

function PrivateRoute({ isAuthenticated, element }) {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return Boolean(token && token !== "undefined" && token !== "null");
  });

  return (
    <div className="App min-h-screen bg-slate-900 text-slate-100">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUpPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/home"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<HomePage setIsAuthenticated={setIsAuthenticated} />}
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
