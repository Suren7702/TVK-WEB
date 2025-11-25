import './index.css';
import React, { useState } from 'react';
import { 
  Users, Calendar, Shield, Search, Menu, X, 
  LogOut, LayoutDashboard, Plus, Trash2, Phone, MessageCircle 
} from 'lucide-react';

// --- MOCK DATA (Simulating Database) ---
const initialEvents = [
  { id: 1, title: "மாபெரும் உறுப்பினர் சேர்க்கை", date: "20 Oct 2024", loc: "உறையூர்", desc: "5000+ இளைஞர்கள் இணைந்தனர்.", category: "Membership" },
  { id: 2, title: "குடிநீர் பிரச்சனை ஆர்ப்பாட்டம்", date: "18 Oct 2024", loc: "தில்லை நகர்", desc: "வார்டு 45 மக்களுக்கான போராட்டம்.", category: "Protest" },
  { id: 3, title: "கல்வி உதவித் தொகை", date: "15 Oct 2024", loc: "மணிகண்டம்", desc: "100 மாணவர்களுக்கு உதவி.", category: "Welfare" }
];

const initialMembers = [
  { id: 1, name: "திரு. வேலு", role: "Booth President", phone: "9876543210", booth: "101", ward: "Ward 1" },
  { id: 2, name: "திருமதி. கீதா", role: "Women Wing", phone: "9876543212", booth: "101", ward: "Ward 1" },
  { id: 3, name: "திரு. ரவி", role: "Secretary", phone: "9988776655", booth: "105", ward: "Ward 2" },
  { id: 4, name: "திரு. டேவிட்", role: "Volunteer", phone: "8877665544", booth: "201", ward: "Ward 5" },
];

// --- COMPONENTS ---

// 1. PUBLIC: ANIMATED HERO HEADER
const BlobHeader = ({ onLoginClick }) => (
  <div className="relative w-full bg-[#620000] overflow-hidden pb-20">
    {/* Animated Background Blobs */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#F4C430] rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-600 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
    </div>

    {/* Navbar */}
    <nav className="relative z-20 flex justify-between items-center px-6 py-5 text-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center text-[#800000] font-bold border-2 border-white shadow-lg">TVK</div>
        <div>
          <h1 className="text-xl font-extrabold tracking-wide leading-none">திருச்சி மேற்கு</h1>
          <p className="text-[10px] text-yellow-300 font-bold tracking-widest uppercase">அதிகாரப்பூர்வ தளம்</p>
        </div>
      </div>
      <button onClick={onLoginClick} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-[#800000] transition">
        <Shield size={16} /> <span className="text-sm font-bold">Admin Login</span>
      </button>
    </nav>

    {/* Hero Content */}
    <div className="relative z-10 container mx-auto px-6 mt-10 flex flex-col md:flex-row items-center gap-10">
      <div className="md:w-1/2 text-center md:text-left text-white">
        <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1 rounded-full text-xs font-bold text-[#F4C430] mb-4 uppercase tracking-wider">
          வெற்றி நிச்சயம்
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-xl">
          பிறப்பொக்கும் <br/> <span className="text-[#F4C430]">எல்லா உயிர்க்கும்</span>
        </h1>
        <p className="text-lg text-gray-200 mb-8 max-w-lg leading-relaxed">
          சமத்துவ சமுதாயம் படைக்க வாரீர். தளபதி அவர்களின் வழியில் திருச்சி மேற்கு தொகுதியை வெல்வோம்.
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          <button className="bg-[#F4C430] text-[#800000] px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition">
            உறுப்பினர் அட்டை
          </button>
          <button className="bg-transparent border-2 border-white/30 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
            எங்களை பற்றி
          </button>
        </div>
      </div>
      {/* Image Placeholder */}
      <div className="md:w-1/2 flex justify-center">
        <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-b from-[#F4C430] to-[#800000] rounded-full p-2 shadow-2xl border-4 border-white/20">
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Vijay_at_the_Nadigar_Sangam_Protest.jpg" 
             alt="Leader" 
             className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition duration-500"
           />
        </div>
      </div>
    </div>
  </div>
);

// 2. PUBLIC: STATS & EVENTS
const PublicContent = ({ events }) => (
  <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-blue-500 flex flex-col items-center">
        <span className="text-4xl font-black text-gray-800">2.65 L</span>
        <span className="text-xs font-bold text-gray-400 uppercase mt-1">மொத்த வாக்காளர்கள்</span>
      </div>
      <div className="bg-[#800000] p-6 rounded-2xl shadow-xl border-b-4 border-[#F4C430] flex flex-col items-center scale-105">
        <span className="text-5xl font-black text-[#F4C430]">85K+</span>
        <span className="text-xs font-bold text-white/80 uppercase mt-1">உறுப்பினர்கள்</span>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-green-500 flex flex-col items-center">
        <span className="text-4xl font-black text-gray-800">245</span>
        <span className="text-xs font-bold text-gray-400 uppercase mt-1">செயல்படும் பூத்கள்</span>
      </div>
    </div>

    {/* Events Section */}
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 bg-[#800000]"></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">களப் பணிகள்</h2>
          <p className="text-sm text-gray-500">சமீபத்திய நிகழ்வுகள்</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 group">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
               <img src={`https://via.placeholder.com/400x300?text=${ev.category}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Event" />
               <span className="absolute bottom-3 left-3 z-20 bg-[#F4C430] text-[#800000] text-xs font-bold px-2 py-1 rounded">
                 {ev.date}
               </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#800000] uppercase">
                <span className="w-2 h-2 bg-[#800000] rounded-full"></span> {ev.loc}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{ev.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{ev.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 3. ADMIN: LOGIN PAGE
const LoginPage = ({ onLogin, onBack }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock Authentication
    if(user === 'admin' && pass === 'admin') {
      onLogin();
    } else {
      setErr('Invalid Credentials (Try: admin/admin)');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#800000]"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#F4C430] rounded-full flex items-center justify-center text-[#800000] font-bold text-xl mx-auto mb-4 shadow-lg border-4 border-white">TVK</div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
          <p className="text-sm text-gray-500">Trichy West IT Wing</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {err && <div className="bg-red-50 text-red-600 p-3 rounded text-xs text-center border border-red-100">{err}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#800000] outline-none transition" value={user} onChange={e=>setUser(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#800000] outline-none transition" value={pass} onChange={e=>setPass(e.target.value)} />
          </div>
          <button className="w-full bg-[#800000] text-white py-3 rounded-lg font-bold hover:bg-[#600000] transition shadow-lg mt-2">
            Secure Login
          </button>
        </form>
        <button onClick={onBack} className="w-full text-center text-xs text-gray-400 mt-6 hover:text-[#800000]">
          &larr; Back to Public Website
        </button>
      </div>
    </div>
  );
};

// 4. ADMIN: DASHBOARD
const Dashboard = ({ onLogout, events, setEvents, members }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newEvent, setNewEvent] = useState({ title: '', date: '', loc: '', desc: '' });

  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = { id: Date.now(), ...newEvent, category: 'General' };
    setEvents([event, ...events]);
    setNewEvent({ title: '', date: '', loc: '', desc: '' });
    alert('Event Published Successfully!');
  };

  const deleteEvent = (id) => {
    if(window.confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-8 h-8 bg-[#F4C430] rounded-full flex items-center justify-center text-[#800000] font-bold">A</div>
          <span className="font-bold tracking-wider">ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${activeTab === 'overview' ? 'bg-[#800000]' : 'hover:bg-gray-800'}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${activeTab === 'events' ? 'bg-[#800000]' : 'hover:bg-gray-800'}`}>
            <Calendar size={18} /> Manage Events
          </button>
          <button onClick={() => setActiveTab('members')} className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${activeTab === 'members' ? 'bg-[#800000]' : 'hover:bg-gray-800'}`}>
            <Users size={18} /> Members DB
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 px-4">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">{activeTab}</h2>
          <div className="bg-white px-4 py-2 rounded-full shadow text-sm font-bold text-[#800000]">
            Welcome, Admin
          </div>
        </header>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#800000]">
              <p className="text-gray-500 text-xs font-bold uppercase">Total Members</p>
              <p className="text-3xl font-bold text-gray-800">85,240</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#F4C430]">
              <p className="text-gray-500 text-xs font-bold uppercase">Active Events</p>
              <p className="text-3xl font-bold text-gray-800">{events.length}</p>
            </div>
          </div>
        )}

        {/* TAB: EVENTS CRUD */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus size={18} /> Add New Event</h3>
              <form onSubmit={handleAddEvent} className="space-y-3">
                <input placeholder="Title" className="w-full p-2 border rounded" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                <input type="date" className="w-full p-2 border rounded" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                <input placeholder="Location" className="w-full p-2 border rounded" required value={newEvent.loc} onChange={e => setNewEvent({...newEvent, loc: e.target.value})} />
                <textarea placeholder="Description" className="w-full p-2 border rounded" rows="3" required value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})}></textarea>
                <button className="w-full bg-[#800000] text-white py-2 rounded font-bold hover:bg-[#600000]">Publish</button>
              </form>
            </div>
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {events.map(ev => (
                <div key={ev.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-800">{ev.title}</h4>
                    <p className="text-xs text-gray-500">{ev.date} | {ev.loc}</p>
                  </div>
                  <button onClick={() => deleteEvent(ev.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MEMBERS */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-800 uppercase text-xs">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Ward/Booth</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-[#800000]">{m.name}</td>
                    <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{m.role}</span></td>
                    <td className="p-4">{m.ward} / {m.booth}</td>
                    <td className="p-4 flex gap-2">
                      <button className="text-green-600 hover:bg-green-50 p-1 rounded"><Phone size={16}/></button>
                      <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><MessageCircle size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

// --- MAIN APP CONTROLLER ---
function App() {
  const [view, setView] = useState('public'); // 'public', 'login', 'dashboard'
  const [events, setEvents] = useState(initialEvents);
  const [members, setMembers] = useState(initialMembers);

  return (
    <div className="font-sans text-gray-800">
      {view === 'public' && (
        <>
          <BlobHeader onLoginClick={() => setView('login')} />
          <PublicContent events={events} />
          <footer className="bg-[#1a1a1a] text-white text-center py-8 text-xs mt-12">
            &copy; 2025 TVK Trichy West. Powered by IT Wing.
          </footer>
        </>
      )}

      {view === 'login' && (
        <LoginPage onLogin={() => setView('dashboard')} onBack={() => setView('public')} />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          onLogout={() => setView('public')} 
          events={events} 
          setEvents={setEvents} 
          members={members}
        />
      )}
    </div>
  );
}

export default App;