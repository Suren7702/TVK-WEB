export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-inner">
        <div className="hero-text">
          <p className="hero-tag">மக்களுடன் – மக்களுக்காக</p>
          <h1 className="hero-title">
            மாவட்ட வளர்ச்சியை
            <span className="hero-title-highlight"> மாற்றும் அரசியல் குரல்</span>
          </h1>
          <p className="hero-desc">
            உங்கள் பகுதி மக்கள் சந்திக்கும் உண்மை பிரச்சினைகள், அரசு திட்டங்கள்,
            கட்சி செயற்பாடுகள் அனைத்தையும் ஒரே இடத்தில் கொண்டு வரும்
            டிஜிட்டல் அரசியல் தளம்.
          </p>

          <div className="hero-actions">
            <a href="#programs" className="btn btn-primary">
              திட்டங்களை பார்க்க
            </a>
            <a href="#contact" className="btn btn-outline">
              தொடர்பு கொள்ள
            </a>
          </div>

          <div className="hero-meta">
            <span>📍 உங்கள் மாவட்டம்</span>
            <span>•</span>
            <span>நேரடி மக்கள் இணைப்பு</span>
          </div>
        </div>

        <div className="hero-photo-card">
          <div className="hero-photo-wrapper">
            <img
              src="/leader.jfif"
              alt="Leader"
              className="hero-photo"
            />
            <div className="hero-photo-border" />
          </div>
          <div className="hero-photo-caption">
            <p className="hero-leader-name">திரு. உங்கள் தலைவர் பெயர்</p>
            <p className="hero-leader-role">மாவட்ட செயற்குழு தலைவர்</p>
          </div>
        </div>
      </div>
    </section>
  );
}
