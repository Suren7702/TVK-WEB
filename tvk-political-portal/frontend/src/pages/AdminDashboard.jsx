import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api.js";
import { getToken, clearAuth } from "../auth.js";
import AdminPartyBarriers from "../components/AdminPartyBarriers.jsx";

export default function AdminDashboard() {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "district"
  });
  const [status, setStatus] = useState("");

  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);

  // events state
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    date: "",
    location: ""
  });

  const navigate = useNavigate();

  // ✅ validate admin on mount
  useEffect(() => {
    const init = async () => {
      const token = getToken();

      if (!token) {
        clearAuth();
        navigate("/admin/login");
        return;
      }

      setAuthToken(token);

      try {
        const { data } = await API.get("/auth/me");
        if (data.role !== "admin") {
          clearAuth();
          navigate("/admin/login");
          return;
        }
        setUser(data);
        setLoadingUser(false);

        // after admin validation, load data
        loadNews();
        loadEvents();
      } catch (err) {
        clearAuth();
        navigate("/admin/login");
      }
    };

    init();
  }, [navigate]);

  const loadNews = async () => {
    try {
      const { data } = await API.get("/news");
      setNewsList(data);
    } catch {
      setStatus("செய்திகளை ஏற்றும்போது பிழை ஏற்பட்டது.");
    }
  };

  const loadEvents = async () => {
    try {
      const { data } = await API.get("/events");
      setEvents(data);
    } catch (err) {
      console.error("நிகழ்வுகளை ஏற்றும்போது பிழை ஏற்பட்டது.", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await API.post("/news", form);
      setForm({ title: "", content: "", imageUrl: "", category: "district" });
      setStatus("செய்தி வெற்றிகரமாக சேர்க்கப்பட்டது ✅");
      loadNews();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearAuth();
        navigate("/admin/login");
      } else {
        setStatus("செய்தி சேர்க்கும்போது பிழை ஏற்பட்டது.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("இந்த செய்தியை நிச்சயமாக நீக்க விரும்புகிறீர்களா?")) return;
    try {
      await API.delete(`/news/${id}`);
      loadNews();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearAuth();
        navigate("/admin/login");
      }
    }
  };

  // events handlers
  const handleEventChange = (e) =>
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events", {
        ...eventForm,
        date: eventForm.date ? new Date(eventForm.date) : null
      });
      setEventForm({
        title: "",
        description: "",
        imageUrl: "",
        date: "",
        location: ""
      });
      loadEvents();
    } catch (err) {
      console.error("நிகழ்வு சேர்க்கும்போது பிழை ஏற்பட்டது.", err);
    }
  };

  const handleEventDelete = async (id) => {
    if (!confirm("இந்த நிகழ்வை நிச்சயமாக நீக்க விரும்புகிறீர்களா?")) return;
    try {
      await API.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      console.error("நிகழ்வு நீக்கும்போது பிழை ஏற்பட்டது.", err);
    }
  };

  if (loadingUser) {
    return (
      <section className="page-wrap admin-page">
        <p className="status-text">நிர்வாக அங்கீகாரம் சரிபார்க்கப்படுகிறது…</p>
      </section>
    );
  }

  return (
    <section className="page-wrap admin-page">
      <header className="page-header">
        <h1 className="section-heading-ta">
          நிர்வாக – செய்தி, நிகழ்வு & கட்சிப் பொறுப்பாளர்கள் மேலாண்மை
        </h1>
        <p className="section-subheading-ta">
          கட்சியின் அதிகாரப்பூர்வ மாவட்ட செய்திகள், மக்கள் தொடர்பு நிகழ்வுகள் மற்றும்
          யூனியன்–கிராமம்–வார்டு–பூத் பொறுப்பாளர்களை இங்கிருந்து மேலாண்மை செய்யலாம்.
        </p>
        {user && (
          <p className="status-text">
            உள்நுழைந்தவர்: {user.name} ({user.email})
          </p>
        )}
      </header>

      {/* 1️⃣ NEWS + EVENTS BLOCK */}
      <div className="admin-layout">
        {/* NEWS FORM */}
        <form onSubmit={handleSubmit} className="admin-form">
          <h2 className="form-title-ta">புதிய செய்தி சேர்க்க</h2>

          <label className="form-label-ta">
            தலைப்பு
            <input
              name="title"
              className="input"
              placeholder="செய்தி தலைப்பு"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label-ta">
            செய்தி விவரம்
            <textarea
              name="content"
              className="textarea"
              placeholder="முழு செய்தியை இங்கே எழுதவும்…"
              value={form.content}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label-ta">
            படம் URL (Optional)
            <input
              name="imageUrl"
              className="input"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </label>

          <label className="form-label-ta">
            வகை
            <select
              name="category"
              className="input"
              value={form.category}
              onChange={handleChange}
            >
              <option value="district">மாவட்டம்</option>
              <option value="state">மாநிலம்</option>
              <option value="national">தேசியம்</option>
            </select>
          </label>

          {status && <p className="status-text">{status}</p>}

          <button type="submit" className="btn btn-primary btn-full">
            செய்தி சேர்க்க
          </button>
        </form>

        {/* NEWS LIST + EVENTS ADMIN */}
        <div className="admin-news-list">
          {/* NEWS LIST */}
          <h2 className="form-title-ta">சேர்க்கப்பட்ட செய்திகள்</h2>
          {newsList.length === 0 ? (
            <p className="status-text">இப்போது செய்திகள் எதுவும் இல்லை.</p>
          ) : (
            <ul className="admin-news-items">
              {newsList.map((n) => (
                <li key={n._id} className="admin-news-item">
                  <div>
                    <p className="admin-news-title">{n.title}</p>
                    <p className="admin-news-meta">
                      {n.category === "district"
                        ? "மாவட்டம்"
                        : n.category === "state"
                        ? "மாநிலம்"
                        : "தேசியம்"}
                      {" • "}
                      {new Date(n.publishedAt).toLocaleDateString("ta-IN")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-small"
                    onClick={() => handleDelete(n._id)}
                  >
                    நீக்கு
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* EVENTS ADMIN BLOCK */}
          <div style={{ marginTop: "1.5rem" }}>
            <h2 className="form-title-ta">நிகழ்வுகள் & புகைப்படங்கள் மேலாண்மை</h2>

            <form
              onSubmit={handleEventSubmit}
              className="auth-form"
              style={{ marginTop: "0.75rem" }}
            >
              <label className="form-label-ta">
                நிகழ்வு தலைப்பு
                <input
                  name="title"
                  className="input"
                  placeholder="எ.கா. மாவட்ட மக்கள் சந்திப்பு – மேற்கு பகுதி"
                  value={eventForm.title}
                  onChange={handleEventChange}
                  required
                />
              </label>

              <label className="form-label-ta">
                நிகழ்வு தேதி
                <input
                  type="date"
                  name="date"
                  className="input"
                  value={eventForm.date}
                  onChange={handleEventChange}
                />
              </label>

              <label className="form-label-ta">
                இடம்
                <input
                  name="location"
                  className="input"
                  placeholder="எ.கா. திருச்சி – அண்ணா நகர் மைதானம்"
                  value={eventForm.location}
                  onChange={handleEventChange}
                />
              </label>

              <label className="form-label-ta">
                படம் URL
                <input
                  name="imageUrl"
                  className="input"
                  placeholder="https://example.com/event-photo.jpg"
                  value={eventForm.imageUrl}
                  onChange={handleEventChange}
                  required
                />
              </label>

              <label className="form-label-ta">
                சுருக்க விளக்கம்
                <textarea
                  name="description"
                  className="textarea"
                  placeholder="இந்த நிகழ்வின் சிறிய விவரத்தை இங்கே எழுதுங்கள்…"
                  value={eventForm.description}
                  onChange={handleEventChange}
                />
              </label>

              <button type="submit" className="btn btn-primary btn-full">
                நிகழ்வு சேர்க்க
              </button>
            </form>

            <ul className="admin-news-items" style={{ marginTop: "0.75rem" }}>
              {events.length === 0 ? (
                <p className="status-text">
                  இப்போது எந்த நிகழ்வு புகைப்படமும் இல்லை.
                </p>
              ) : (
                events.map((ev) => (
                  <li key={ev._id} className="admin-news-item">
                    <div>
                      <p className="admin-news-title">{ev.title}</p>
                      <p className="admin-news-meta">
                        {ev.date
                          ? new Date(ev.date).toLocaleDateString("ta-IN")
                          : "தேதி குறிப்பிடவில்லை"}
                        {ev.location ? ` • ${ev.location}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-small"
                      onClick={() => handleEventDelete(ev._id)}
                    >
                      நீக்கு
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 2️⃣ PARTY BARRIERS CRUD BLOCK */}
      <AdminPartyBarriers />
    </section>
  );
}
