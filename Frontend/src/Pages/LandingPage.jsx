export default function LandingPage() {
  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        {/* Left Panel */}
        <div
          className="flex flex-col justify-center items-start h-full px-16"
          style={{ minWidth: "360px", maxWidth: "600px", width: "480px" }}
        >
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Welcome to NotesApp</h1>
          <p className="text-xl text-gray-600 mb-10">
            Take notes anywhere, anytime.<br />
            Organize your thoughts and boost productivity.
          </p>
          <div className="flex gap-6">
            <a
              href="/SignUp"
              className="px-8 py-3 bg-indigo-600 text-white rounded font-semibold text-lg hover:bg-indigo-700 transition"
            >
              Sign Up
            </a>
            <a
              href="/LoginPage"
              className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded font-semibold text-lg hover:bg-indigo-50 transition"
            >
              Login
            </a>
          </div>
        </div>
        {/* Right Panel: Full-Height Image */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden">
          <img
            src="https://res.cloudinary.com/djzrwjuyo/image/upload/v1751856975/Windows-11-Bloom-Screensaver-Dark-scaled_1_zw0dho.jpg"
            alt="Landing visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="flex flex-1 flex-col md:hidden items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome to NotesApp</h1>
        <p className="text-base text-gray-600 mb-8 text-center">
          Take notes anywhere, anytime.<br />
          Organize your thoughts and boost productivity.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a
            href="/SignUp"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded font-semibold text-center hover:bg-indigo-700 transition"
          >
            Sign Up
          </a>
          <a
            href="/LoginPage"
            className="w-full px-6 py-3 border border-indigo-600 text-indigo-600 rounded font-semibold text-center hover:bg-indigo-50 transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
