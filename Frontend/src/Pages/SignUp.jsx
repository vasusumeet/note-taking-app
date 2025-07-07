import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
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
      
      const response = await fetch("http://localhost:5555/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
      } else {
        setSuccess("Registration successful! Redirecting...");
        setName("");
        setEmail("");
        setPassword("");
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

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        <div className="flex flex-col justify-center items-start h-full px-16 w-[480px] min-w-[360px] max-w-[600px]">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Sign Up</h1>
          <p className="text-lg text-gray-600 mb-8">Create your NotesApp account</p>
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your Name"
              />
            </div>
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
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
            <button
              type="button"
              className="w-full py-3 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              {/* Google Icon SVG */}
              <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block">
                <g>
                  <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.6 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.1 4.9 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
                  <path fill="#34A853" d="M6.3 14.1l6.7 4.9C14.8 16.2 19 13 24 13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.1 4.9 29.3 3 24 3 16.1 3 9.1 7.9 6.3 14.1z"/>
                  <path fill="#FBBC05" d="M24 43c5.5 0 10.4-1.8 14.2-4.8l-6.6-5.4C29.9 34.5 27.1 35.5 24 35.5c-5.7 0-10.5-3.7-12.2-8.8l-6.7 5.2C9.1 39.1 16.1 43 24 43z"/>
                  <path fill="#EA4335" d="M44.5 20H24v8.5h11.7C34.6 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.1 4.9 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
                </g>
              </svg>
              Sign up with Google
            </button>
            <div className="mt-6 text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <a href="/LoginPage" className="text-indigo-600 hover:underline font-medium">
                Login
              </a>
            </div>
          </form>
        </div>
        {/* Right Panel: Image */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden">
          <img
            src="https://res.cloudinary.com/djzrwjuyo/image/upload/v1751856975/Windows-11-Bloom-Screensaver-Dark-scaled_1_zw0dho.jpg"
            alt="Sign up visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="flex flex-1 flex-col md:hidden items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Sign Up</h1>
        <p className="text-base text-gray-600 mb-8 text-center">
          Create your NotesApp account
        </p>
        <form className="w-full max-w-xs" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name-mobile">
              Name
            </label>
            <input
              id="name-mobile"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your Name"
            />
          </div>
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <button
            type="button"
            className="w-full py-3 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block">
              <g>
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.6 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.1 4.9 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
                <path fill="#34A853" d="M6.3 14.1l6.7 4.9C14.8 16.2 19 13 24 13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.1 4.9 29.3 3 24 3 16.1 3 9.1 7.9 6.3 14.1z"/>
                <path fill="#FBBC05" d="M24 43c5.5 0 10.4-1.8 14.2-4.8l-6.6-5.4C29.9 34.5 27.1 35.5 24 35.5c-5.7 0-10.5-3.7-12.2-8.8l-6.7 5.2C9.1 39.1 16.1 43 24 43z"/>
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.7C34.6 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.1 4.9 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
              </g>
            </svg>
            Sign up with Google
          </button>
          <div className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/LoginPage" className="text-indigo-600 hover:underline font-medium">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
