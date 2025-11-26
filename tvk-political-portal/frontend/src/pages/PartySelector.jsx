// src/pages/PartySelector.jsx
import { useState, useMemo } from "react";
import PARTY_NETWORK from "../data/partyNetwork.js";

export default function PartySelector() {
  const [selectedUnionId, setSelectedUnionId] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [selectedBoothId, setSelectedBoothId] = useState("");

  const selectedUnion = useMemo(
    () => PARTY_NETWORK.find((u) => u.id === selectedUnionId) || null,
    [selectedUnionId]
  );

  const villageOptions = selectedUnion?.villages || [];
  const selectedVillage = useMemo(
    () => villageOptions.find((v) => v.id === selectedVillageId) || null,
    [villageOptions, selectedVillageId]
  );

  const wardOptions = selectedVillage?.wards || [];
  const selectedWard = useMemo(
    () => wardOptions.find((w) => w.id === selectedWardId) || null,
    [wardOptions, selectedWardId]
  );

  const boothOptions = selectedWard?.booths || [];
  const selectedBooth = useMemo(
    () => boothOptions.find((b) => b.id === selectedBoothId) || null,
    [boothOptions, selectedBoothId]
  );

  // whichever level is selected last becomes "current details"
  const currentNode = selectedBooth || selectedWard || selectedVillage || selectedUnion;

  const pathText = useMemo(() => {
    if (!selectedUnion) return "இப்போது எந்த பகுதியும் தேர்வு செய்யப்படவில்லை.";
    const parts = [];
    if (selectedUnion) parts.push(`யூனியன்: ${selectedUnion.nameTa}`);
    if (selectedVillage) parts.push(`கிராமம்: ${selectedVillage.nameTa}`);
    if (selectedWard) parts.push(`வார்டு: ${selectedWard.nameTa}`);
    if (selectedBooth) parts.push(`பூத்: ${selectedBooth.nameTa}`);
    return parts.join(" ➝ ");
  }, [selectedUnion, selectedVillage, selectedWard, selectedBooth]);

  return (
    <section className="page-wrap selector-page">
      <header className="page-header">
        <h1 className="section-heading-ta">கட்சிப் பொறுப்பாளர்கள் – தொடர்பு தேடல்</h1>
        <p className="section-subheading-ta">
          கீழே உள்ள தேர்வுகளைப் பயன்படுத்தி யூனியன், கிராமம், வார்டு, பூத் வரை
          சென்று அந்தப் பகுதியின் கட்சிப் பொறுப்பாளரின் தொடர்பு விபரங்களை மட்டும்
          தெளிவாக பார்க்கலாம்.
        </p>
      </header>

      <div className="selector-layout">
        {/* LEFT: Selection controls */}
        <div className="selector-panel">
          <h2 className="form-title-ta">பகுதி தேர்வு</h2>

          {/* UNION SELECT */}
          <label className="form-label-ta">
            யூனியன் தேர்வு
            <select
              className="input"
              value={selectedUnionId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedUnionId(id);
                setSelectedVillageId("");
                setSelectedWardId("");
                setSelectedBoothId("");
              }}
            >
              <option value="">— யூனியனைத் தேர்வு செய்யவும் —</option>
              {PARTY_NETWORK.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameTa}
                </option>
              ))}
            </select>
          </label>

          {/* VILLAGE SELECT */}
          <label className="form-label-ta">
            கிராமம் தேர்வு
            <select
              className="input"
              value={selectedVillageId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedVillageId(id);
                setSelectedWardId("");
                setSelectedBoothId("");
              }}
              disabled={!selectedUnion}
            >
              <option value="">
                {selectedUnion
                  ? "— கிராமத்தைத் தேர்வு செய்யவும் —"
                  : "முதலில் யூனியனைத் தேர்வு செய்யவும்"}
              </option>
              {villageOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nameTa}
                </option>
              ))}
            </select>
          </label>

          {/* WARD SELECT */}
          <label className="form-label-ta">
            வார்டு தேர்வு
            <select
              className="input"
              value={selectedWardId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedWardId(id);
                setSelectedBoothId("");
              }}
              disabled={!selectedVillage}
            >
              <option value="">
                {selectedVillage
                  ? "— வார்டைத் தேர்வு செய்யவும் —"
                  : "முதலில் கிராமத்தைத் தேர்வு செய்யவும்"}
              </option>
              {wardOptions.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nameTa}
                </option>
              ))}
            </select>
          </label>

          {/* BOOTH SELECT */}
          <label className="form-label-ta">
            பூத் தேர்வு
            <select
              className="input"
              value={selectedBoothId}
              onChange={(e) => setSelectedBoothId(e.target.value)}
              disabled={!selectedWard || boothOptions.length === 0}
            >
              <option value="">
                {selectedWard
                  ? boothOptions.length
                    ? "— பூத்தைத் தேர்வு செய்யவும் —"
                    : "இந்த வார்டுக்கு பூத் தரவு சேர்க்கப்படவில்லை"
                  : "முதலில் வார்டைத் தேர்வு செய்யவும்"}
              </option>
              {boothOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nameTa}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* RIGHT: Details Card */}
        <div className="selector-details">
          <h2 className="form-title-ta">தேர்ந்தெடுக்கப்பட்ட பகுதி விவரம்</h2>

          <div className="selector-path">
            <span className="selector-path-label">பகுதி:</span>
            <span className="selector-path-text">{pathText}</span>
          </div>

          {!currentNode ? (
            <p className="status-text">
              யூனியன் / கிராமம் / வார்டு / பூத் தேர்வு செய்து விபரங்களைப் பார்க்கவும்.
            </p>
          ) : (
            <div className="selector-card">
              <p className="selector-node-type">
                {currentNode.type === "union"
                  ? "யூனியன் பொறுப்பாளர்"
                  : currentNode.type === "village"
                  ? "கிராமம் பொறுப்பாளர்"
                  : currentNode.type === "ward"
                  ? "வார்டு பொறுப்பாளர்"
                  : "பூத் பொறுப்பாளர்"}
              </p>

              <h3 className="selector-node-name">{currentNode.nameTa}</h3>

              <div className="selector-node-row">
                <span className="selector-node-label">பெயர்</span>
                <span className="selector-node-value">
                  {currentNode.person || "—"}
                </span>
              </div>

              <div className="selector-node-row">
                <span className="selector-node-label">பதவி</span>
                <span className="selector-node-value">
                  {currentNode.roleTa || "—"}
                </span>
              </div>

              <div className="selector-node-row">
                <span className="selector-node-label">தொலைபேசி</span>
                <span className="selector-node-value">
                  {currentNode.phone ? (
                    <a
                      href={`tel:${currentNode.phone}`}
                      className="selector-phone-link"
                    >
                      {currentNode.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <p className="selector-note">
                * இத்தகவல் பொதுமக்கள் பயன்பாட்டிற்காக; நிர்வாகப் புதுப்பிப்புகளின்
                அடிப்படையில் மாற்றம் ஏற்படலாம்.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
