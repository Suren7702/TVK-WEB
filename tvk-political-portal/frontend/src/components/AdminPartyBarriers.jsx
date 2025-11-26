// src/components/AdminPartyBarriers.jsx
import { useEffect, useState } from "react";
import API from "../api.js";

export default function AdminPartyBarriers() {
  const [unions, setUnions] = useState([]);
  const [villages, setVillages] = useState([]);
  const [wards, setWards] = useState([]);
  const [booths, setBooths] = useState([]);

  const [selectedUnionId, setSelectedUnionId] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [selectedBoothId, setSelectedBoothId] = useState("");

  const [unionForm, setUnionForm] = useState({
    nameTa: "",
    roleTa: "யூனியன் செயலாளர்",
    person: "",
    phone: ""
  });

  const [villageForm, setVillageForm] = useState({
    nameTa: "",
    roleTa: "கிராம செயலாளர்",
    person: "",
    phone: ""
  });

  const [wardForm, setWardForm] = useState({
    nameTa: "",
    roleTa: "வார்டு தலைவர்",
    person: "",
    phone: ""
  });

  const [boothForm, setBoothForm] = useState({
    nameTa: "",
    roleTa: "பூத் முகவர்",
    person: "",
    phone: ""
  });

  const [wardBearerForm, setWardBearerForm] = useState({
    nameTa: "",
    roleTa: "துணை பொறுப்பாளர்",
    phone: ""
  });

  const [boothBearerForm, setBoothBearerForm] = useState({
    nameTa: "",
    roleTa: "பூத் துணை பொறுப்பாளர்",
    phone: ""
  });

  useEffect(() => {
    loadUnions();
  }, []);

  const loadUnions = async () => {
    try {
      const { data } = await API.get("/party/unions");
      setUnions(data);
    } catch (err) {
      console.error("Error loading unions", err);
    }
  };

  const loadVillages = async (unionId) => {
    if (!unionId) return setVillages([]);
    try {
      const { data } = await API.get(`/party/unions/${unionId}/villages`);
      setVillages(data);
    } catch (err) {
      console.error("Error loading villages", err);
    }
  };

  const loadWards = async (villageId) => {
    if (!villageId) return setWards([]);
    try {
      const { data } = await API.get(`/party/villages/${villageId}/wards`);
      setWards(data);
    } catch (err) {
      console.error("Error loading wards", err);
    }
  };

  const loadBooths = async (wardId) => {
    if (!wardId) return setBooths([]);
    try {
      const { data } = await API.get(`/party/wards/${wardId}/booths`);
      setBooths(data);
    } catch (err) {
      console.error("Error loading booths", err);
    }
  };

  /* --- CRUD HANDLERS (same logic, cleaned) --- */

  const handleChange = (setter) => (e) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (url, data, resetFn, reloadFn) => async (e) => {
    e.preventDefault();
    try {
      await API.post(url, data());
      resetFn();
      reloadFn();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  /* --- DELETE HANDLERS --- */

  const handleDelete = async (url, afterFn) => {
    if (!confirm("நீக்கவா?")) return;
    try {
      await API.delete(url);
      afterFn();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  /* --- EXTRA BEARERS --- */

  const addBearer = async (type) => {
    const isWard = type === "ward";
    const id = isWard ? selectedWardId : selectedBoothId;
    const data = isWard ? wardBearerForm : boothBearerForm;

    if (!id) return alert("முதலில் தேர்வு செய்யவும்");

    try {
      await API.post(
        `/party/${isWard ? "wards" : "booths"}/${id}/bearers`,
        data
      );

      if (isWard) {
        setWardBearerForm({ nameTa: "", roleTa: "துணை பொறுப்பாளர்", phone: "" });
        loadWards(selectedVillageId);
      } else {
        setBoothBearerForm({
          nameTa: "",
          roleTa: "பூத் துணை பொறுப்பாளர்",
          phone: ""
        });
        loadBooths(selectedWardId);
      }
    } catch (err) {
      console.error("Error adding bearer", err);
    }
  };

  const deleteBearer = async (type, bearerId) => {
    const isWard = type === "ward";
    const id = isWard ? selectedWardId : selectedBoothId;
    if (!id) return;

    if (!confirm("இந்த பொறுப்பாளரை நீக்கவா?")) return;
    try {
      await API.delete(
        `/party/${isWard ? "wards" : "booths"}/${id}/bearers/${bearerId}`
      );
      isWard ? loadWards(selectedVillageId) : loadBooths(selectedWardId);
    } catch (err) {
      console.error("Error deleting bearer", err);
    }
  };

  return (
    <div className="admin-news-list" style={{ marginTop: "1.5rem" }}>
      <h2 className="form-title-ta">கட்சிப் பொறுப்பாளர்கள் மேலாண்மை</h2>

      {/* SELECTORS */}
      <div className="auth-form">
        <select
          className="input"
          value={selectedUnionId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedUnionId(id);
            setSelectedVillageId("");
            setSelectedWardId("");
            setSelectedBoothId("");
            loadVillages(id);
          }}
        >
          <option value="">யூனியன் தேர்வு</option>
          {unions.map((u) => (
            <option key={u._id} value={u._id}>{u.nameTa}</option>
          ))}
        </select>

        <select
          className="input"
          disabled={!selectedUnionId}
          value={selectedVillageId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedVillageId(id);
            setSelectedWardId("");
            setSelectedBoothId("");
            loadWards(id);
          }}
        >
          <option value="">கிராமம் தேர்வு</option>
          {villages.map((v) => (
            <option key={v._id} value={v._id}>{v.nameTa}</option>
          ))}
        </select>

        <select
          className="input"
          disabled={!selectedVillageId}
          value={selectedWardId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedWardId(id);
            loadBooths(id);
          }}
        >
          <option value="">வார்டு தேர்வு</option>
          {wards.map((w) => (
            <option key={w._id} value={w._id}>{w.nameTa}</option>
          ))}
        </select>

        <select
          className="input"
          disabled={!selectedWardId}
          value={selectedBoothId}
          onChange={(e) => setSelectedBoothId(e.target.value)}
        >
          <option value="">பூத் தேர்வு</option>
          {booths.map((b) => (
            <option key={b._id} value={b._id}>{b.nameTa}</option>
          ))}
        </select>
      </div>

      {/* FORMS REMOVED FOR BREVITY - Your original CRUD forms remain same */}

      {/* EXTRA BEARERS UI */}
      {selectedWardId && (
        <div className="admin-form">
          <h3>வார்டுக்கு கூடுதல் பொறுப்பாளர்</h3>
          <input
            className="input"
            placeholder="பெயர்"
            value={wardBearerForm.nameTa}
            onChange={(e) =>
              setWardBearerForm({ ...wardBearerForm, nameTa: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="பதவி"
            value={wardBearerForm.roleTa}
            onChange={(e) =>
              setWardBearerForm({ ...wardBearerForm, roleTa: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="தொலைபேசி"
            value={wardBearerForm.phone}
            onChange={(e) =>
              setWardBearerForm({ ...wardBearerForm, phone: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={() => addBearer("ward")}>
            சேர்க்க
          </button>
        </div>
      )}

      {selectedBoothId && (
        <div className="admin-form">
          <h3>பூத்திற்கு கூடுதல் பொறுப்பாளர்</h3>
          <input
            className="input"
            placeholder="பெயர்"
            value={boothBearerForm.nameTa}
            onChange={(e) =>
              setBoothBearerForm({ ...boothBearerForm, nameTa: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="பதவி"
            value={boothBearerForm.roleTa}
            onChange={(e) =>
              setBoothBearerForm({ ...boothBearerForm, roleTa: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="தொலைபேசி"
            value={boothBearerForm.phone}
            onChange={(e) =>
              setBoothBearerForm({ ...boothBearerForm, phone: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={() => addBearer("booth")}>
            சேர்க்க
          </button>
        </div>
      )}
    </div>
  );
}
