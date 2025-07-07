import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user || !user.id || !user.token) {
      navigate("/LoginPage");
    }
  }, [user, navigate]);

  // Fetch notes on mount and when user changes
  useEffect(() => {
    const fetchNotes = async () => {
      const token = user?.token || localStorage.getItem("token");
      const userId = user?.id;
      if (!userId || !token) return;
      setLoading(true);
      try {
        const response = await fetch(`https://note-taking-app-production-e93d.up.railway.app/api/notes/${userId}/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await response.json();
        if (response.ok) {
          setNotes(data.notes || []);
        }
      } catch (err) {
        // Optionally log or display error
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user, setUser, navigate]);

  const handleCreateNote = () => {
    if (!user || !user.id) {
      navigate("/LoginPage");
      return;
    }
    navigate("/noteeditor", { state: { userId: user.id } });
  };

  const handleEditNote = (note) => {
    if (!user || !user.id) {
      navigate("/LoginPage");
      return;
    }
    navigate("/noteeditor", { state: { note, userId: user.id } });
  };

  const handleDeleteNote = async (noteId) => {
    const token = user?.token || localStorage.getItem("token");
    const userId = user?.id;
    if (!userId || !token) return;
    setLoading(true);
    try {
      const response = await fetch(`https://note-taking-app-production-e93d.up.railway.app/api/notes/${userId}/delete/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== noteId));
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      <main className="flex-1 flex flex-col items-center justify-center py-6 md:py-0 md:h-screen">
        <header className="w-full max-w-2xl flex justify-between items-center mb-8 px-4 md:px-0">
          <div className="text-lg font-semibold text-indigo-600">Dashboard</div>
          <a href="/login" onClick={handleSignOut} className="text-sm text-indigo-600 hover:underline font-medium">
            Sign Out
          </a>
        </header>
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 md:p-10 flex flex-col items-center justify-center"
             style={{ minHeight: "60vh" }}>
          <div className="mb-6 w-full">
            <div className="font-semibold text-gray-800 mb-1 text-xl">
              Welcome, {user?.name || "User"}!
            </div>
            <div className="text-sm text-gray-500">Email: {user?.email || "—"}</div>
          </div>
          <button
            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition mb-6"
            onClick={handleCreateNote}
          >
            Create Note
          </button>
          <div className="w-full">
            <div className="font-medium text-gray-700 mb-2">Notes</div>
            {loading ? (
              <div className="text-gray-400">Loading notes...</div>
            ) : (
              <ul className="space-y-2">
                {notes.length === 0 ? (
                  <li className="text-gray-400">No notes yet.</li>
                ) : (
                  notes.map((note) => (
                    <li
                      key={note._id}
                      className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                    >
                      <span
                        className="text-gray-800 cursor-pointer hover:underline"
                        onClick={() => handleEditNote(note)}
                      >
                        {note.noteTitle}
                      </span>
                      <button
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Delete"
                        onClick={() => handleDeleteNote(note._id)}
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
