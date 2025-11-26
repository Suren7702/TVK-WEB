import Hero from "../components/Hero.jsx";
import FeatureGrid from "../components/FeatureGrid.jsx";
import EventsGallery from "../components/EventsGallery.jsx"; // ✅ Added

export default function Home() {
  return (
    <main>
      {/* 1. Hero Section (Leader & Admins) */}
      <Hero />

      {/* 2. Features Grid (Cards) */}
      <FeatureGrid />

      {/* 3. Events Gallery (New Section) */}
      <EventsGallery />

      {/* 4. Call to Action (CTA) Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="section-heading-ta">உங்கள் குரல், எங்கள் பொறுப்பு</h2>
          <p className="section-subheading-ta">
            உங்கள் பகுதி பிரச்சினையை சில கிளிக்குகளில் பதிவு செய்யுங்கள்.
            நிர்வாக நடவடிக்கைகள் டிராக் செய்யுங்கள். அரசியலை சுத்தமாகவும்
            வெளிப்படையாகவும் மாற்றுவோம்.
          </p>
          
          <div style={{ marginTop: "1.5rem" }}>
            <a href="/news" className="btn btn-primary">
              மாவட்ட செய்திகள் பார்க்க
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}