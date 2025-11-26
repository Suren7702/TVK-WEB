export default function SectionCard({ icon, titleTa, descTa }) {
  return (
    <div className="section-card">
      <div className="section-icon">{icon}</div>
      <h3 className="section-title-ta">{titleTa}</h3>
      <p className="section-desc-ta">{descTa}</p>
    </div>
  );
}
