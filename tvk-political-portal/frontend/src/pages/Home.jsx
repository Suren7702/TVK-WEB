import Hero from "../components/Hero.jsx";
import FeatureGrid from "../components/FeatureGrid.jsx";
import EventsGallery from "../components/EventsGallery.jsx"; // 👈 add

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />

      {/* 👇 NEW – events & activities photos section */}
      <EventsGallery />

      <section className="cta-section">
        <div className="cta-card">
          <h2 className="section-heading-ta">உங்கள் குரல், எங்கள் பொறுப்பு</h2>
          <p className="section-subheading-ta">
            உங்கள் பகுதி பிரச்சினையை சில கிளிக்குகளில் பதிவு செய்யுங்கள்.
            நிர்வாக நடவடிக்கைகள் டிராக் செய்யுங்கள். அரசியலை சுத்தமாகவும்
            வெளிப்படையாகவும் மாற்றுவோம்.
          </p>
          <a href="/news" className="btn btn-primary">
            மாவட்ட செய்திகள் பார்க்க
          </a>
        </div>
      </section>
    </>
  );
}
