export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div>
          <h4 className="footer-title-ta">தமிழ் மக்கள் முன்னணி – மாவட்டம்</h4>
          <p className="footer-text-ta">
            இந்த தளம் ஒரு டிஜிட்டல் அரசியல் முயற்சி. மக்கள் – நிர்வாகம் – தலைவர்
            என மூன்றையும் இணைக்கும் பாலம்.
          </p>
        </div>

        <div className="footer-columns">
          <div>
            <p className="footer-label-ta">கட்சியாளர் அலுவலகம்</p>
            <p className="footer-text-ta">உங்கள் முகவரி, உங்கள் மாவட்டம்</p>
            <p className="footer-text-ta">📞 +91-98765 43210</p>
          </div>
          <div>
            <p className="footer-label-ta">தொடர்பு மின்னஞ்சல்</p>
            <p className="footer-text-ta">info@tvkportal.in</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TVK Digital District Portal</span>
        <span>வடிவமைப்பு • Suren</span>
      </div>
    </footer>
  );
}
