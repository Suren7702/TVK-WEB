// src/pages/AdminDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api.js";
import { getToken, clearAuth } from "../auth.js";

// --- DEFAULT FORM STATE FOR BARRIERS ---
const INITIAL_BARRIER_FORM = {
  nameTa: "",
  personName: "",
  roleTa: "",
  phone: "",
  photoUrl: ""
};

export default function AdminDashboard() {
  // --- AUTH & USER STATE ---
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- NEWS STATE ---
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: "", content: "", imageUrl: "", category: "district" });
  
  // --- EVENTS STATE ---
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title: "", description: "", imageUrl: "", date: "", location: "" });

  // --- PARTY BARRIER STATE ---
  const [partyNetwork, setPartyNetwork] = useState([]); 
  const [barrierStatus, setBarrierStatus] = useState("");
  
  // Selection State for Hierarchy
  const [selUnionId, setSelUnionId] = useState("");
  const [selVillageId, setSelVillageId] = useState("");
  const [selWardId, setSelWardId] = useState("");
  const [selBoothId, setSelBoothId] = useState("");

  // CRUD State
  const [barrierForm, setBarrierForm] = useState(INITIAL_BARRIER_FORM);
  const [targetLevel, setTargetLevel] = useState("");
  const [targetParentId, setTargetParentId] = useState(""); 
  
  // ✅ STATES FOR EDIT & VIEW
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewNode, setViewNode] = useState(null); 

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) { 
        clearAuth();
        navigate("/admin/login");
        return;
      }

      // ensure axios has the token before any request
      setAuthToken(token);

      try {
        // NOTE: make sure this matches your backend mount -> /api/auth/me
        const { data } = await API.get("/api/auth/me");
        if (!data || data.role !== "admin") {
          clearAuth();
          navigate("/admin/login");
          return;
        }

        setUser(data);
        setLoadingUser(false);

        // load dashboard data
        await Promise.all([loadNews(), loadEvents(), loadPartyNetwork()]);
      } catch (err) {
        console.error("Failed to init admin:", err.response?.data || err.message);
        clearAuth();
        navigate("/admin/login");
      }
    };
    init();
  }, [navigate]);

  // --- DATA LOADERS ---
  const loadNews = async () => { 
    try { 
      // backend route is /api/news
      const { data } = await API.get("/api/news");
      setNewsList(data || []);
    } catch (err) {
      console.error("loadNews failed", err?.response?.data || err?.message);
      setNewsList([]);
    } 
  };

  const loadEvents = async () => { 
    try { 
      const { data } = await API.get("/api/events");
      setEvents(data || []);
    } catch (err) {
      console.error("loadEvents failed", err?.response?.data || err?.message);
      setEvents([]);
    } 
  };

  const loadPartyNetwork = async () => {
    try {
      // backend route is /api/party-network
      const { data } = await API.get("/api/party-network"); 
      setPartyNetwork(data || []); 
    } catch (err) {
      console.error("Failed to load party network", err?.response?.data || err?.message);
      setPartyNetwork([]);
    }
  };

  // --- NEWS HANDLERS ---
  const handleNewsChange = (e) => setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    try { 
      await API.post("/api/news", newsForm);
      setNewsForm({ title: "", content: "", imageUrl: "", category: "district" });
      await loadNews();
    } catch (err) { 
      console.error("Error adding news", err?.response?.data || err?.message);
      alert("Error adding news"); 
    }
  };
  const handleNewsDelete = async (id) => {
    if (!confirm("Delete this news?")) return;
    try { await API.delete(`/api/news/${id}`); await loadNews(); } catch (err) { console.error(err); }
  };

  // --- EVENTS HANDLERS ---
  const handleEventChange = (e) => setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try { await API.post("/api/events", eventForm); setEventForm({ title: "", description: "", imageUrl: "", date: "", location: "" }); await loadEvents(); }
    catch (err) { console.error("Error adding event", err?.response?.data || err?.message); alert("Error adding event"); }
  };
  const handleEventDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try { await API.delete(`/api/events/${id}`); await loadEvents(); } catch (err) { console.error(err); }
  };

  // ==========================================
  // --- PARTY BARRIER LOGIC (HIERARCHY) ---
  // ==========================================

  const selectedUnion = useMemo(() => partyNetwork.find(u => u.id === selUnionId), [partyNetwork, selUnionId]);
  const selectedVillage = useMemo(() => selectedUnion?.villages?.find(v => v.id === selVillageId), [selectedUnion, selVillageId]);
  const selectedWard = useMemo(() => selectedVillage?.wards?.find(w => w.id === selWardId), [selectedVillage, selWardId]);
  const selectedBooth = useMemo(() => selectedWard?.booths?.find(b => b.id === selBoothId), [selectedWard, selBoothId]);

  const handleBarrierChange = (e) => setBarrierForm({ ...barrierForm, [e.target.name]: e.target.value });

  // ✅ NEW: HANDLE FILE UPLOAD (Convert to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large! Please select an image under 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setBarrierForm({ ...barrierForm, photoUrl: reader.result });
        };
        reader.readAsDataURL(file);
    }
  };

  // 1. OPEN ADD FORM
  const openAddForm = (level, parentId = null) => {
    setIsEditing(false);
    setEditId(null);
    setTargetLevel(level);
    setTargetParentId(parentId); 
    setBarrierForm(INITIAL_BARRIER_FORM);
    setBarrierStatus(`Adding new ${level}...`);
  };

  // 2. OPEN EDIT FORM
  const openEditForm = (node, level, parentId) => {
    setIsEditing(true);
    setEditId(node.id);
    setTargetLevel(level);
    setTargetParentId(parentId);
    setBarrierForm({
      nameTa: node.nameTa,
      personName: node.person || "",
      roleTa: node.roleTa || "",
      phone: node.phone || "",
      photoUrl: node.photo || ""
    });
    setBarrierStatus(`Editing ${level}...`);
  };

  // 3. SUBMIT (Handles Add AND Edit)
  const handleBarrierSubmit = async (e) => {
    e.preventDefault();
    setBarrierStatus(isEditing ? "Updating..." : "Saving...");
    
    const payload = {
        type: targetLevel,                       
        parentId: targetParentId ? targetParentId : null, 
        nameTa: barrierForm.nameTa,
        personName: barrierForm.personName,     
        roleTa: barrierForm.roleTa,
        phone: barrierForm.phone,
        photoUrl: barrierForm.photoUrl
    };

    try {
        if (isEditing) {
            await API.put(`/api/party-network/${editId}`, payload);
            setBarrierStatus("Updated Successfully! ✅");
        } else {
            await API.post("/api/party-network/add", payload);
            setBarrierStatus("Saved Successfully! ✅");
        }

        setBarrierForm(INITIAL_BARRIER_FORM);
        setTargetLevel(""); 
        setIsEditing(false);
        setEditId(null);
        await loadPartyNetwork(); 
        
    } catch (err) {
        console.error("FULL ERROR DETAILS:", err?.response?.data || err?.message);
        const serverMessage = err.response?.data?.message || err.message;
        setBarrierStatus(`Error: ${serverMessage}`);
    }
  };

  const handleBarrierDelete = async (nodeId, level) => {
      if(!confirm(`Are you sure you want to delete this ${level}?`)) return;
      try {
          await API.delete(`/api/party-network/${nodeId}`, { data: { level } });
          await loadPartyNetwork();
      } catch (err) {
          console.error("Delete error:", err?.response?.data || err?.message);
          alert("Error deleting node.");
      }
  };

  const ActionButtons = ({ node, level, parentId }) => {
    if (!node) {
        return <button className="btn btn-primary" onClick={() => openAddForm(level, parentId)}>Add {level}</button>;
    }
    return (
        <div style={{display:'flex', gap:'5px'}}>
            <button className="btn btn-outline-small" style={{backgroundColor: '#17a2b8', color:'white', borderColor:'#17a2b8'}} onClick={() => setViewNode(node)}>View</button>
            <button className="btn btn-outline-small" style={{backgroundColor: '#ffc107', color:'black', borderColor:'#ffc107'}} onClick={() => openEditForm(node, level, parentId)}>Edit</button>
            <button className="btn btn-outline-small" onClick={() => handleBarrierDelete(node.id, level)}>Delete</button>
        </div>
    );
  };

  if (loadingUser) return <div className="page-wrap"><p>Loading Admin...</p></div>;

  return (
    <section className="page-wrap admin-page">
      <header className="page-header">
        <h1 className="section-heading-ta">நிர்வாக – செய்தி, நிகழ்வு & கட்சிப் பொறுப்பாளர்கள்</h1>
        {user && <p className="status-text">உள்நுழைந்தவர்: {user.name}</p>}
      </header>

      {/* ... rest of your JSX remains unchanged ... */}
      {/* (all JSX below is identical to your original file; omitted here to keep snippet concise) */}

      {/* place the unchanged JSX from your original file here (no changes needed) */}

    </section>
  );
}
