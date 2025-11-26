// src/components/EventsGallery.jsx
import { useEffect, useState } from "react";
import API from "../api.js";

export default function EventsGallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error loading events", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="events-section">
      <div className="page-header">
        <h2 className="section-heading-ta">செயற்பாடுகள் & நிகழ்வுகள்</h2>
        <p className="section-subheading-ta">
          மாவட்டம் முழுவதும் கட்சி மேற்கொண்ட மக்கள் தொடர்பு நிகழ்வுகள்,
          குடியுரிமை முகாம்கள், பொதுக்கூட்டங்கள், நலத்திட்ட விநியோகங்கள்
          போன்றவற்றின் புகைப்படங்கள்.
        </p>
      </div>

      {loading ? (
        <p className="status-text">நிகழ்வுகள் ஏற்றப்படுகிறது…</p>
      ) : events.length === 0 ? (
        <p className="status-text">இப்போது நிகழ்வு புகைப்படங்கள் இல்லை.</p>
      ) : (
        <div className="events-grid">
          {events.map((ev) => (
            <article key={ev._id} className="event-card">
              <div className="event-image-wrap">
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className="event-image"
                />
                <div className="event-image-overlay" />
              </div>
              <div className="event-body">
                <h3 className="event-title-ta">{ev.title}</h3>
                {ev.date && (
                  <p className="event-meta">
                    📅{" "}
                    {new Date(ev.date).toLocaleDateString("ta-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                    {ev.location ? ` • 📍 ${ev.location}` : ""}
                  </p>
                )}
                {ev.description && (
                  <p className="event-desc-ta">{ev.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
