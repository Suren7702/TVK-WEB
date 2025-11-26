import { useEffect, useState } from "react";
import API from "../api.js";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/news")
      .then((res) => setNews(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-wrap">
      <header className="page-header">
        <h1 className="section-heading-ta">மாவட்ட அரசியல் & பொதுச் செய்திகள்</h1>
        <p className="section-subheading-ta">
          கட்சியின் அதிகாரப்பூர்வ தகவல்கள், நிகழ்வுகள், அறிவிப்புகள் அனைத்தையும்
          இங்கே ஒருங்கிணைத்து பார்க்கலாம்.
        </p>
      </header>

      {loading ? (
        <p className="status-text">செய்திகளை ஏற்றுகிறது...</p>
      ) : news.length === 0 ? (
        <p className="status-text">இப்போது செய்தி எதுவும் இல்லை.</p>
      ) : (
        <div className="news-list">
          {news.map((item) => (
            <article key={item._id} className="news-card">
              <div className="news-header">
                <h2 className="news-title-ta">{item.title}</h2>
                <span className="news-chip">
                  {item.category === "district"
                    ? "மாவட்டம்"
                    : item.category === "state"
                    ? "மாநிலம்"
                    : "தேசியம்"}
                </span>
              </div>

              {item.imageUrl && (
                <div className="news-image-wrapper">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="news-image"
                  />
                </div>
              )}

              <p className="news-body-ta">{item.content}</p>

              <div className="news-meta">
                <span>
                  வெளியான தேதி:{" "}
                  {new Date(item.publishedAt).toLocaleString("ta-IN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
