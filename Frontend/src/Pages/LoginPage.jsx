import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://note-taking-app-production-e93d.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
      } else {
        setSuccess("Login successful! Redirecting...");
        setEmail("");
        setPassword("");

        setUser({ ...data.user, token: data.token });
        localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.token }));
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("https://note-taking-app-production-e93d.up.railway.app/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Google login failed.");
      } else {
        setSuccess("Google login successful! Redirecting...");
        setUser({ ...data.user, token: data.token });
        localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.token }));
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
      }
    } catch (err) {
      setError("Google login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        <div className="flex flex-col justify-center items-start h-full px-16 w-[480px] min-w-[360px] max-w-[600px]">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Login</h1>
          <p className="text-lg text-gray-600 mb-8">Sign in to your NotesApp account</p>
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded font-semibold text-lg hover:bg-indigo-700 transition mb-4"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign In failed")}
              width="100%"
            />
            <div className="mt-6 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <a href="/SignUp" className="text-indigo-600 hover:underline font-medium">
                Sign Up
              </a>
            </div>
          </form>
        </div>
        {/* Right Panel: Image */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden">
          <img
            src="https://res.cloudinary.com/djzrwjuyo/image/upload/v1751856975/Windows-11-Bloom-Screensaver-Dark-scaled_1_zw0dho.jpg"
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="flex flex-1 flex-col md:hidden items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Login</h1>
        <p className="text-base text-gray-600 mb-8 text-center">
          Sign in to your NotesApp account
        </p>
        <form className="w-full max-w-xs" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email-mobile">
              Email
            </label>
            <input
              id="email-mobile"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@email.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password-mobile">
              Password
            </label>
            <input
              id="password-mobile"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded font-semibold text-center text-lg hover:bg-indigo-700 transition mb-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Sign In failed")}
            width="100%"
          />
          <div className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <a href="/SignUp" className="text-indigo-600 hover:underline font-medium">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
