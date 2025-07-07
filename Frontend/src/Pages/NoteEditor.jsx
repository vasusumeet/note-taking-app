import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function NoteEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const note = location.state?.note;
  const userId = location.state?.userId || user?.id;
  const isEdit = !!note;

  const [title, setTitle] = useState(note ? note.noteTitle : "");
  const [content, setContent] = useState(note ? note.note : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.noteTitle);
      setContent(note.note);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = user?.token || localStorage.getItem("token");
      if (!userId || !token) {
        setError("Authentication error. Please log in again.");
        setLoading(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/LoginPage");
        return;
      }
      const url = isEdit
        ? `https://note-taking-app-production-e93d.up.railway.app/api/notes/${userId}/edit/${note._id}`
        : `https://note-taking-app-production-e93d.up.railway.app/api/notes/${userId}/create`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteTitle: title,
          note: content,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        setError("Session expired. Please log in again.");
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
        setTimeout(() => navigate("/LoginPage"), 1000);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save note.");
      } else {
        setSuccess(isEdit ? "Note updated successfully!" : "Note created successfully!");
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

  // Optional: Guard rendering for unauthenticated users
  if (!user || !user.id || !user.token) {
    navigate("/LoginPage");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            className="w-2/3 md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-semibold"
            placeholder="Note Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save changes" : "Create note")}
          </button>
        </div>
        <textarea
          className="w-full min-h-[220px] md:min-h-[300px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          placeholder="Note Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        {error && <div aria-live="polite" className="mt-4 text-red-600 font-medium">{error}</div>}
        {success && <div aria-live="polite" className="mt-4 text-green-600 font-medium">{success}</div>}
      </div>
    </div>
  );
}
