import { useState, useMemo, useEffect } from "react";
import API from "../api.js"; // ✅ Import your API helper

// A simple default placeholder image URL
const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export default function PartySelector() {
  // --- 1. STATE FOR DATA & SELECTION ---
  const [partyNetwork, setPartyNetwork] = useState([]); // ✅ Stores live data from DB
  const [loading, setLoading] = useState(true);

  const [selectedUnionId, setSelectedUnionId] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [selectedBoothId, setSelectedBoothId] = useState("");

  // --- 2. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchPartyNetwork = async () => {
      try {
        // Calls the Controller: getPartyNetwork
        const { data } = await API.get("/api/party-network"); 
        setPartyNetwork(data); // Update state with live DB data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching party network:", err);
        setLoading(false);
      }
    };

    fetchPartyNetwork();
  }, []);

  const handleReset = () => {
    setSelectedUnionId("");
    setSelectedVillageId("");
    setSelectedWardId("");
    setSelectedBoothId("");
  };

  // --- 3. HIERARCHY LOGIC (Same as before, but uses partyNetwork state) ---
  
  // Find the selected Union
  const selectedUnion = useMemo(
    () => partyNetwork.find((u) => u.id === selectedUnionId) || null,
    [partyNetwork, selectedUnionId]
  );

  // Find the selected Village
  const villageOptions = selectedUnion?.villages || [];
  const selectedVillage = useMemo(
    () => villageOptions.find((v) => v.id === selectedVillageId) || null,
    [villageOptions, selectedVillageId]
  );

  // Find the selected Ward
  const wardOptions = selectedVillage?.wards || [];
  const selectedWard = useMemo(
    () => wardOptions.find((w) => w.id === selectedWardId) || null,
    [wardOptions, selectedWardId]
  );

  // Find the selected Booth
  const boothOptions = selectedWard?.booths || [];
  const selectedBooth = useMemo(
    () => boothOptions.find((b) => b.id === selectedBoothId) || null,
    [boothOptions, selectedBoothId]
  );

  // Construct Hierarchy Path
  const hierarchyPath = useMemo(() => {
    const path = [];
    if (selectedUnion) path.push({ ...selectedUnion, labelTa: "யூனியன் பொறுப்பாளர்" });
    if (selectedVillage) path.push({ ...selectedVillage, labelTa: "கிளை / கிராம பொறுப்பாளர்" });
    if (selectedWard) path.push({ ...selectedWard, labelTa: "வார்டு பொறுப்பாளர்" });
    if (selectedBooth) path.push({ ...selectedBooth, labelTa: "பூத் கமிட்டி பொறுப்பாளர்" });
    return path;
  }, [selectedUnion, selectedVillage, selectedWard, selectedBooth]);

  // --- 4. RENDER ---
  if (loading) {
    return (
      <section className="page-wrap selector-page">
        <p className="status-text" style={{textAlign: 'center', marginTop: '50px'}}>
          தரவுகள் ஏற்றப்படுகின்றன... (Loading Data...)
        </p>
      </section>
    );
  }

  return (
    <section className="page-wrap selector-page">
      <header className="page-header">
        <h1 className="section-heading-ta">கட்சிப் பொறுப்பாளர்கள் – நிர்வாக அமைப்பு</h1>
        <p className="section-subheading-ta">
          கீழே உள்ள தேர்வுகளைப் பயன்படுத்தி யூனியன் முதல் பூத் வரை உள்ள 
          அனைத்து நிர்வாகிகளின் விபரங்களையும் வரிசையாகப் பார்க்கலாம்.
        </p>
      </header>

      <div className="selector-layout">
        {/* LEFT: Selection Controls */}
        <div className="selector-panel">
          <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="form-title-ta" style={{ margin: 0 }}>பகுதி தேர்வு</h2>
            {selectedUnionId && (
              <button 
                onClick={handleReset} 
                className="reset-btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.9rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            )}
          </div>

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
              {partyNetwork.map((u) => (
                <option key={u.id} value={u.id}>{u.nameTa}</option>
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
                {selectedUnion ? "— கிராமத்தைத் தேர்வு செய்யவும் —" : "முதலில் யூனியனைத் தேர்வு செய்யவும்"}
              </option>
              {villageOptions.map((v) => (
                <option key={v.id} value={v.id}>{v.nameTa}</option>
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
                {selectedVillage ? "— வார்டைத் தேர்வு செய்யவும் —" : "முதலில் கிராமத்தைத் தேர்வு செய்யவும்"}
              </option>
              {wardOptions.map((w) => (
                <option key={w.id} value={w.id}>{w.nameTa}</option>
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
                  ? boothOptions.length ? "— பூத்தைத் தேர்வு செய்யவும் —" : "தரவு இல்லை" 
                  : "முதலில் வார்டைத் தேர்வு செய்யவும்"}
              </option>
              {boothOptions.map((b) => (
                <option key={b.id} value={b.id}>{b.nameTa}</option>
              ))}
            </select>
          </label>
        </div>

        {/* RIGHT: Details List with Photos */}
        <div className="selector-details">
          <h2 className="form-title-ta">நிர்வாகிகள் பட்டியல் (Hierarchy)</h2>

          {hierarchyPath.length === 0 ? (
            <div className="empty-state">
              <p className="status-text">
                இடதுபுறத்தில் உள்ள யூனியன் / கிராமம் / வார்டு ஆகியவற்றைத் தேர்வு செய்து பொறுப்பாளர்களின் புகைப்படங்களை பார்க்கவும்.
              </p>
            </div>
          ) : (
            <div className="hierarchy-list">
              {hierarchyPath.map((node, index) => (
                <div key={node.id || index} className="selector-card hierarchy-card" style={{position: 'relative'}}>
                  
                  {/* Badge Number */}
                  <span className="level-badge">{index + 1}</span>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    
                    {/* PHOTO COLUMN */}
                    <div className="card-photo-col" style={{ flexShrink: 0 }}>
                      <img 
                        src={node.photo || DEFAULT_PHOTO} 
                        alt={node.person}
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #e0e0e0',
                          backgroundColor: '#f9f9f9'
                        }}
                      />
                    </div>

                    {/* TEXT DETAILS COLUMN */}
                    <div className="card-info-col" style={{ flexGrow: 1 }}>
                      <p className="selector-node-type" style={{ marginBottom: '4px' }}>{node.labelTa}</p>
                      <h3 className="selector-node-name" style={{ marginTop: '0', fontSize: '1.2rem' }}>{node.nameTa}</h3>

                      <div className="selector-node-row">
                        <span className="selector-node-label">பொறுப்பாளர்:</span>
                        <span className="selector-node-value" style={{ fontWeight: 'bold' }}>
                          {node.person || "—"}
                        </span>
                      </div>

                      <div className="selector-node-row">
                        <span className="selector-node-label">பதவி:</span>
                        <span className="selector-node-value">
                          {node.roleTa || "—"}
                        </span>
                      </div>

                      <div className="selector-node-row">
                        <span className="selector-node-label">தொடர்புக்கு:</span>
                        <span className="selector-node-value">
                          {node.phone ? (
                            <a href={`tel:${node.phone}`} className="selector-phone-link">
                              {node.phone}
                            </a>
                          ) : (
                            "—"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
              
              <p className="selector-note" style={{marginTop: '20px'}}>
                * புகைப்படங்கள் கிடைக்கவில்லை எனில் பொதுவான சின்னம் காட்டப்படும்.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}