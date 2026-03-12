import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ── FIREBASE CONFIG ───────────────────────────────────────────────────────────
const FB_CONFIG = {
  apiKey: "AIzaSyB0JUy2yMKgjkHtbEtpugtdkSACEEgqqHA",
  authDomain: "mediconline-15d7f.firebaseapp.com",
  projectId: "mediconline-15d7f",
  storageBucket: "mediconline-15d7f.firebasestorage.app",
  messagingSenderId: "602466647832",
  appId: "1:602466647832:web:9a7246868bd1a4638e686d",
  databaseURL: "https://mediconline-15d7f-default-rtdb.firebaseio.com",
};

// ── CHARGEMENT CDN ───────────────────────────────────────────────────────────
let fbAuth = null;
let fbDB = null;
let fbInitialized = false;
let fbCallbacks = [];

function getAuth() { return fbAuth; }
function getDB() { return fbDB; }

function onFirebaseReady(cb) {
  if (fbInitialized) { cb(); return; }
  fbCallbacks.push(cb);
}

function loadScript(src, id) {
  return new Promise(resolve => {
    if (document.getElementById(id)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.id = id; s.onload = resolve;
    document.head.appendChild(s);
  });
}

(async function setupFirebase() {
  await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js", "fb-app");
  await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js", "fb-auth");
  await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js", "fb-db");

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(FB_CONFIG);
  }
  fbAuth = window.firebase.auth();
  fbDB   = window.firebase.database();
  fbInitialized = true;
  fbCallbacks.forEach(cb => cb());
  fbCallbacks = [];
})();

function useFirebaseReady() {
  const [ready, setReady] = useState(fbInitialized);
  useEffect(() => { if (!fbInitialized) onFirebaseReady(() => setReady(true)); }, []);
  return ready;
}

// ── LEAFLET ──────────────────────────────────────────────────────────────────
function loadCSS(href, id) {
  if (document.getElementById(id)) return;
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = href; l.id = id;
  document.head.appendChild(l);
}

function useLeaflet() {
  const [ready, setReady] = useState(!!window.L);
  useEffect(() => {
    loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "leaflet-css");
    if (window.L) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.id = "leaflet-js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ── DONNÉES ──────────────────────────────────────────────────────────────────
const PHARMACIES_YAOUNDE = [
  { id: 1,  nom: "Pharmacie Bastos",         quartier: "Bastos",          tel: "+237 222 20 94 93", lat: 3.8845, lng: 11.5174, ouvert: true  },
  { id: 2,  nom: "Pharmacie du Centre",       quartier: "Centre-ville",    tel: "+237 222 22 20 21", lat: 3.8667, lng: 11.5174, ouvert: true  },
  { id: 3,  nom: "Pharmacie Obili Chapelle",  quartier: "Obili",           tel: "+237 222 31 41 22", lat: 3.8603, lng: 11.4989, ouvert: true  },
  { id: 4,  nom: "Pharmacie Notre Dame",      quartier: "Tsinga",          tel: "+237 242 08 37 52", lat: 3.8780, lng: 11.5050, ouvert: false },
  { id: 5,  nom: "Pharmacie Ketchy",          quartier: "Madagascar",      tel: "+237 222 22 00 60", lat: 3.8720, lng: 11.5290, ouvert: true  },
  { id: 6,  nom: "Pharmacie de Cana",         quartier: "Carrefour Jamot", tel: "+237 222 20 97 51", lat: 3.8640, lng: 11.5220, ouvert: true  },
  { id: 7,  nom: "Pharmacie des Acacias",     quartier: "Biyem-Assi",      tel: "+237 222 31 70 19", lat: 3.8452, lng: 11.4950, ouvert: true  },
  { id: 8,  nom: "Pharmacie des 7 Collines",  quartier: "Melen",           tel: "+237 222 22 65 71", lat: 3.8810, lng: 11.5400, ouvert: false },
  { id: 9,  nom: "Pharmacie Populaire",       quartier: "Essos",           tel: "+237 222 23 23 41", lat: 3.8750, lng: 11.5350, ouvert: true  },
  { id: 10, nom: "Pharmacie Provinciale",     quartier: "Nlongkak",        tel: "+237 222 20 94 93", lat: 3.8900, lng: 11.5100, ouvert: true  },
  { id: 11, nom: "Pharmacie Queens",          quartier: "Cité Verte",      tel: "+237 242 12 91 13", lat: 3.8530, lng: 11.5050, ouvert: true  },
  { id: 12, nom: "Pharmacie de la Foi",       quartier: "Odza",            tel: "+237 655 43 96 62", lat: 3.8320, lng: 11.5600, ouvert: false },
  { id: 13, nom: "Pharmacie Le Cygne",        quartier: "Centre-ville",    tel: "+237 222 22 29 68", lat: 3.8680, lng: 11.5200, ouvert: true  },
  { id: 14, nom: "Pharmacie Mvog-Mbi",        quartier: "Mvog-Mbi",        tel: "+237 222 30 67 85", lat: 3.8480, lng: 11.5300, ouvert: true  },
  { id: 15, nom: "Pharmacie de Mendong",      quartier: "Mendong",         tel: "+237 222 31 48 62", lat: 3.8280, lng: 11.4880, ouvert: true  },
];

const MEDICAMENTS_POPULAIRES = [
  { id: 1,  nom: "Paracétamol 500mg",        cat: "Antidouleur",        emoji: "💊", bg: "#EBF4FF", prixMin: 50   },
  { id: 2,  nom: "Amoxicilline 250mg",       cat: "Antibiotique",       emoji: "🌿", bg: "#E6FAF0", prixMin: 800  },
  { id: 3,  nom: "Quinine 300mg",            cat: "Antipaludéen",       emoji: "🔬", bg: "#FFF4E6", prixMin: 350  },
  { id: 4,  nom: "Artéméther 20mg",          cat: "Antipaludéen",       emoji: "🦟", bg: "#FFF4E6", prixMin: 1500 },
  { id: 5,  nom: "Coartem 20/120mg",         cat: "Antipaludéen",       emoji: "💉", bg: "#FFF4E6", prixMin: 2500 },
  { id: 6,  nom: "Métronidazole 250mg",      cat: "Antibiotique",       emoji: "🔵", bg: "#F3E8FF", prixMin: 300  },
  { id: 7,  nom: "Ibuprofène 400mg",         cat: "Anti-inflammatoire", emoji: "🔶", bg: "#FFF8E6", prixMin: 200  },
  { id: 8,  nom: "Cotrimoxazole 480mg",      cat: "Antibiotique",       emoji: "🟢", bg: "#E6FAF0", prixMin: 150  },
  { id: 9,  nom: "Vitamines C 500mg",        cat: "Vitamines",          emoji: "🍋", bg: "#FFFCE6", prixMin: 100  },
  { id: 10, nom: "Fer + Acide folique",      cat: "Vitamines",          emoji: "🩸", bg: "#FDECEA", prixMin: 250  },
  { id: 11, nom: "ORS (Sels réhydratation)", cat: "Pédiatrie",          emoji: "🧒", bg: "#EBF4FF", prixMin: 100  },
  { id: 12, nom: "Albendazole 400mg",        cat: "Antiparasitaire",    emoji: "🐛", bg: "#F3E8FF", prixMin: 200  },
  { id: 13, nom: "Oméprazole 20mg",          cat: "Gastro",             emoji: "🏥", bg: "#E6FAF0", prixMin: 400  },
  { id: 14, nom: "Amlodipine 5mg",           cat: "Cardio",             emoji: "❤️", bg: "#FDECEA", prixMin: 600  },
  { id: 15, nom: "Metformine 500mg",         cat: "Diabète",            emoji: "💙", bg: "#EBF4FF", prixMin: 500  },
];

const CATEGORIES = ["Tous","Antipaludéen","Antibiotique","Antidouleur","Vitamines","Cardio","Gastro","Diabète","Pédiatrie"];

const STOCK_DEMO = [
  { nom: "Paracétamol 500mg",        cat: "Antidouleur",        prix: 50,   qte: 120, exp: "2027-06-01" },
  { nom: "Amoxicilline 250mg",       cat: "Antibiotique",       prix: 850,  qte: 3,   exp: "2026-08-15" },
  { nom: "Quinine 300mg",            cat: "Antipaludéen",       prix: 350,  qte: 45,  exp: "2026-12-10" },
  { nom: "Coartem 20/120mg",         cat: "Antipaludéen",       prix: 2500, qte: 18,  exp: "2027-01-20" },
  { nom: "Métronidazole 250mg",      cat: "Antibiotique",       prix: 300,  qte: 7,   exp: "2026-09-05" },
  { nom: "Ibuprofène 400mg",         cat: "Anti-inflammatoire", prix: 200,  qte: 60,  exp: "2027-03-01" },
  { nom: "Cotrimoxazole 480mg",      cat: "Antibiotique",       prix: 150,  qte: 80,  exp: "2027-02-14" },
  { nom: "Vitamines C 500mg",        cat: "Vitamines",          prix: 100,  qte: 200, exp: "2027-05-01" },
  { nom: "ORS (Sels réhydratation)", cat: "Pédiatrie",          prix: 100,  qte: 0,   exp: "2027-01-01" },
  { nom: "Artéméther 20mg",          cat: "Antipaludéen",       prix: 1500, qte: 12,  exp: "2026-11-30" },
];

// ── CARTE LEAFLET ─────────────────────────────────────────────────────────────
function CartePharmacies({ pharmacies, userPos, selectedId, onSelect, height = "400px" }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const leafletReady = useLeaflet();

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstance.current) return;
    const L = window.L;
    const map = L.map(mapRef.current).setView([3.8667, 11.5167], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
    mapInstance.current = map;
  }, [leafletReady]);

  useEffect(() => {
    if (!leafletReady || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    if (userPos) {
      const icon = L.divIcon({
        html: `<div style="background:#0A7B6C;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
        iconSize: [14,14], iconAnchor: [7,7], className: "",
      });
      L.marker(userPos, { icon }).addTo(map).bindPopup("<b>📍 Votre position</b>");
      map.setView(userPos, 14);
    }

    pharmacies.forEach(ph => {
      if (!ph.lat || !ph.lng) return;
      const sel = ph.id === selectedId || ph.uid === selectedId;
      const color = sel ? "#0A7B6C" : (ph.ouvert !== false ? "#1A4A6B" : "#9CA3AF");
      const size = sel ? 44 : 34;
      const icon = L.divIcon({
        html: `<div style="background:${color};color:white;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${sel?"1.2":"0.9"}rem;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);cursor:pointer">🏥</div>`,
        iconSize: [size,size], iconAnchor: [size/2,size/2], className: "",
      });
      const m = L.marker([ph.lat, ph.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;min-width:160px"><b style="color:#0D2B3E">${ph.nom}</b><br/><small style="color:#6B7C93">📍 ${ph.quartier}</small><br/><span style="background:${ph.ouvert!==false?"#E6FAF0":"#FDECEA"};color:${ph.ouvert!==false?"#1A8A45":"#E63946"};padding:2px 8px;border-radius:99px;font-size:0.7rem;font-weight:600">${ph.ouvert!==false?"✓ Ouverte":"✗ Fermée"}</span>${ph.tel?`<br/><small style="color:#0A7B6C">📞 ${ph.tel}</small>`:""}</div>`)
        .on("click", () => onSelect && onSelect(ph));
      markersRef.current.push(m);
    });
  }, [leafletReady, pharmacies, selectedId, userPos]);

  if (!leafletReady) return (
    <div style={{ height, display:"flex", alignItems:"center", justifyContent:"center", background:"#f4f6f8", borderRadius:14 }}>
      <div className="loading"><div className="spinner"></div> Chargement de la carte...</div>
    </div>
  );

  return <div ref={mapRef} style={{ height, width:"100%", borderRadius:14, overflow:"hidden" }} />;
}

// ── PAGE CARTE ────────────────────────────────────────────────────────────────
function PageCarte() {
  const fbReady = useFirebaseReady();
  const [userPos, setUserPos] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [selectedPh, setSelectedPh] = useState(null);
  const [extraPharma, setExtraPharma] = useState([]);

  useEffect(() => {
    if (!fbReady) return;
    const ref = getDB().ref("pharmacies");
    ref.on("value", snap => {
      if (snap.exists()) {
        setExtraPharma(Object.entries(snap.val()).map(([uid, ph]) => ({
          uid, ...ph,
          lat: ph.lat || 3.8667 + (Math.random()-0.5)*0.08,
          lng: ph.lng || 11.5167 + (Math.random()-0.5)*0.08,
        })));
      }
    });
    return () => ref.off();
  }, [fbReady]);

  const localiser = () => {
    setLocLoading(true);
    if (!navigator.geolocation) { alert("Géolocalisation non supportée."); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setUserPos([pos.coords.latitude, pos.coords.longitude]); setLocLoading(false); },
      () => { setUserPos([3.8667, 11.5167]); setLocLoading(false); }
    );
  };

  const allPh = [...PHARMACIES_YAOUNDE, ...extraPharma];

  return (
    <div className="main">
      <div className="page-toprow mb20">
        <div>
          <div className="page-title">🗺 Carte des Pharmacies</div>
          <div className="page-sub">{allPh.length} pharmacies · Yaoundé</div>
        </div>
        <button className="btn btn-primary" onClick={localiser} disabled={locLoading}>
          {locLoading ? "⏳..." : "📍 Me localiser"}
        </button>
      </div>

      {userPos && <div className="alert alert-success mb16"><span className="alert-ico">📍</span><span>Position détectée !</span></div>}

      <div className="card mb20" style={{ padding:0, overflow:"hidden" }}>
        <CartePharmacies pharmacies={allPh} userPos={userPos} selectedId={selectedPh?.id||selectedPh?.uid} onSelect={setSelectedPh} height="420px" />
      </div>

      {selectedPh && (
        <div className="card mb20" style={{ border:"2px solid var(--teal)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="ph-ico" style={{ width:48, height:48, fontSize:"1.4rem" }}>🏥</div>
            <div style={{ flex:1 }}>
              <div className="ph-name" style={{ fontSize:"1rem" }}>{selectedPh.nom}</div>
              <div className="ph-dist">📍 {selectedPh.quartier} · {selectedPh.tel}</div>
            </div>
            <span className={"stock-tag "+(selectedPh.ouvert!==false?"stock-ok":"stock-out")}>
              {selectedPh.ouvert!==false?"Ouverte":"Fermée"}
            </span>
          </div>
          <div className="btn-row" style={{ marginTop:14 }}>
            <button className="btn btn-primary btn-sm"
              onClick={() => window.open(`https://www.google.com/maps/dir//${selectedPh.lat},${selectedPh.lng}`,"_blank")}>
              🗺 Itinéraire Google Maps
            </button>
            {selectedPh.tel && <button className="btn btn-secondary btn-sm" onClick={() => window.open("tel:"+selectedPh.tel)}>📞 Appeler</button>}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Toutes les pharmacies</div>
          <span className="tag tag-green">{allPh.filter(p=>p.ouvert!==false).length} ouvertes</span>
        </div>
        <div className="ph-list">
          {allPh.map((ph,i) => (
            <div key={ph.uid||ph.id||i}
              className={"ph-row"+(selectedPh?.id===ph.id||selectedPh?.uid===ph.uid?" ph-row-active":"")}
              onClick={() => setSelectedPh(ph)} style={{ cursor:"pointer" }}>
              <div className="ph-ico">🏥</div>
              <div className="ph-info">
                <div className="ph-name">{ph.nom}</div>
                <div className="ph-dist">📍 {ph.quartier} · {ph.tel}</div>
              </div>
              <span className={"stock-tag "+(ph.ouvert!==false?"stock-ok":"stock-out")}>
                {ph.ouvert!==false?"Ouverte":"Fermée"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("pharmacie");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomPharmacie, setNomPharmacie] = useState("");
  const [quartier, setQuartier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const cred = await getAuth().signInWithEmailAndPassword(email, password);
        const snap = await getDB().ref("users/"+cred.user.uid).get();
        const d = snap.val() || {};
        onAuth({ uid: cred.user.uid, email, role: d.role||"pharmacie", nomPharmacie: d.nom });
      } else {
        const cred = await getAuth().createUserWithEmailAndPassword(email, password);
        const uid = cred.user.uid;
        await getDB().ref("users/"+uid).set({ email, role, nom: nomPharmacie||email.split("@")[0], createdAt: Date.now() });
        if (role === "pharmacie") {
          await getDB().ref("pharmacies/"+uid).set({
            nom: nomPharmacie, quartier: quartier||"Yaoundé",
            adresse: (quartier||"Yaoundé")+", Yaoundé",
            tel: "", ouvert: true, adminUid: uid, createdAt: Date.now(),
            lat: 3.8667+(Math.random()-0.5)*0.08,
            lng: 11.5167+(Math.random()-0.5)*0.08,
          });
          for (const med of STOCK_DEMO) {
            await getDB().ref("stock/"+uid).push({ ...med, pharmacieId: uid, pharmacieNom: nomPharmacie, updatedAt: Date.now() });
          }
        }
        onAuth({ uid, email, role, nomPharmacie });
      }
    } catch(e) {
      const msgs = {
        "auth/email-already-in-use": "Email déjà utilisé.",
        "auth/weak-password": "Mot de passe trop court (min. 6).",
        "auth/invalid-credential": "Email ou mot de passe incorrect.",
        "auth/user-not-found": "Compte introuvable.",
        "auth/wrong-password": "Mot de passe incorrect.",
      };
      setError(msgs[e.code] || "Erreur : "+e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">Medic<span>online</span></div>
        <div className="auth-sub">📍 Yaoundé — Espace Pharmacie</div>
        <div className="auth-tabs">
          <div className={"auth-tab"+(mode==="login"?" active":"")} onClick={()=>{setMode("login");setError("");}}>Connexion</div>
          <div className={"auth-tab"+(mode==="register"?" active":"")} onClick={()=>{setMode("register");setError("");}}>Inscription</div>
        </div>
        {error && <div className="alert alert-error mb16"><span className="alert-ico">⚠️</span><span>{error}</span></div>}
        {mode==="register" && (
          <>
            <div className="form-group"><label className="form-label">Nom de la pharmacie *</label><input className="form-input" placeholder="ex: Pharmacie Bastos" value={nomPharmacie} onChange={e=>setNomPharmacie(e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Quartier</label>
              <select className="form-input" value={quartier} onChange={e=>setQuartier(e.target.value)}>
                <option value="">Sélectionner...</option>
                {["Bastos","Centre-ville","Obili","Tsinga","Madagascar","Biyem-Assi","Melen","Essos","Nlongkak","Cité Verte","Odza","Mvog-Mbi","Mendong","Ekounou","Nkomo"].map(q=><option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </>
        )}
        <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="votre@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Mot de passe *</label><input className="form-input" type="password" placeholder="Min. 6 caractères" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Chargement..." : mode==="login" ? "🔐 Se connecter" : "✅ Créer mon compte"}
        </button>
        <div className="auth-footer">
          {mode==="login"
            ? <span>Pas de compte ? <b style={{cursor:"pointer",color:"var(--teal)"}} onClick={()=>setMode("register")}>S'inscrire</b></span>
            : <span>Déjà un compte ? <b style={{cursor:"pointer",color:"var(--teal)"}} onClick={()=>setMode("login")}>Se connecter</b></span>}
        </div>
      </div>
    </div>
  );
}

// ── TOPBAR ────────────────────────────────────────────────────────────────────
function Topbar({ role, setRole, setPage, user, onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar-logo">Medic<span>online</span>
        <span style={{fontSize:"0.62rem",color:"rgba(255,255,255,0.4)",fontFamily:"Mulish",fontWeight:400,marginLeft:8}}>📍 Yaoundé</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {!user && (
          <div className="role-switch">
            <button className={"role-btn"+(role==="patient"?" active":"")} onClick={()=>{setRole("patient");setPage("accueil");}}>👤 Patient</button>
            <button className={"role-btn"+(role==="pharmacie"?" active":"")} onClick={()=>{setRole("pharmacie");setPage("dashboard");}}>🏥 Pharmacie</button>
          </div>
        )}
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.78rem"}}>🏥 {user.nomPharmacie||user.email}</span>
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>Déconnexion</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ACCUEIL PATIENT ───────────────────────────────────────────────────────────
function AccueilPatient({ setPage, setRecherche }) {
  const fbReady = useFirebaseReady();
  const [query, setQuery] = useState("");
  const [catActive, setCatActive] = useState("Tous");
  const [suggestions, setSuggestions] = useState([]);
  const [extraPharma, setExtraPharma] = useState([]);

  useEffect(() => {
    if (!fbReady) return;
    const ref = getDB().ref("pharmacies");
    ref.on("value", snap => {
      if (snap.exists()) setExtraPharma(Object.entries(snap.val()).map(([uid,ph])=>({uid,...ph})));
    });
    return () => ref.off();
  }, [fbReady]);

  const handleInput = v => {
    setQuery(v);
    setSuggestions(v.length>1 ? MEDICAMENTS_POPULAIRES.filter(m=>m.nom.toLowerCase().includes(v.toLowerCase())).slice(0,5) : []);
  };
  const rechercher = nom => { const q=nom||query; if(!q.trim())return; setRecherche(q); setPage("resultats"); setSuggestions([]); };
  const filtered = catActive==="Tous" ? MEDICAMENTS_POPULAIRES : MEDICAMENTS_POPULAIRES.filter(m=>m.cat===catActive);
  const allPh = [...PHARMACIES_YAOUNDE, ...extraPharma];

  return (
    <div className="main">
      <div className="hero">
        <h1>Médicaments à Yaoundé<br/><span>au meilleur prix</span></h1>
        <p>Comparez les prix dans les pharmacies de Yaoundé · Stocks en temps réel</p>
        <div className="search-row">
          <div className="search-input-wrap">
            <span className="search-ico">🔍</span>
            <input value={query} onChange={e=>handleInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&rechercher()} placeholder="Ex: Paracétamol, Quinine, Coartem..."/>
          </div>
          <button className="btn-search" onClick={()=>rechercher()}>Rechercher</button>
          {suggestions.length>0 && (
            <div className="suggestions">
              {suggestions.map(s=>(
                <div key={s.id} className="suggestion-item" onClick={()=>rechercher(s.nom)}>
                  <span>{s.emoji}</span><span style={{flex:1}}>{s.nom}</span>
                  <span className="tag tag-blue">{s.cat}</span>
                  <span style={{fontSize:"0.72rem",color:"var(--teal)",fontWeight:700,marginLeft:8}}>dès {s.prixMin} F</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid-4 mb24">
        {[
          {ico:"🏥",num:allPh.length,lbl:"Pharmacies connectées",bg:"#EBF4FF"},
          {ico:"💊",num:"15+",lbl:"Médicaments référencés",bg:"#E6FAF0"},
          {ico:"🗺",num:"Carte",lbl:"Localisation en temps réel",bg:"#FFF4E6",click:()=>setPage("carte")},
          {ico:"⚡",num:"Live",lbl:"Stocks synchronisés",bg:"#F3E8FF"},
        ].map((s,i)=>(
          <div key={i} className="stat-card" style={{cursor:s.click?"pointer":"default"}} onClick={s.click}>
            <div className="stat-icon" style={{background:s.bg}}>{s.ico}</div>
            <div className="stat-num" style={{fontSize:["Carte","Live"].includes(s.num)?"1rem":undefined}}>{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card mb24" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="card-title">🗺 Pharmacies sur la carte</div>
          <button className="btn btn-primary btn-sm" onClick={()=>setPage("carte")}>Voir la carte complète</button>
        </div>
        <CartePharmacies pharmacies={PHARMACIES_YAOUNDE.slice(0,8)} userPos={null} selectedId={null} onSelect={()=>setPage("carte")} height="280px"/>
      </div>

      <div className="card mb24">
        <div className="card-header">
          <div className="card-title">Pharmacies de Yaoundé</div>
          <span className="tag tag-green">{allPh.filter(p=>p.ouvert!==false).length} ouvertes</span>
        </div>
        <div className="ph-list">
          {allPh.slice(0,6).map((ph,i)=>(
            <div key={ph.uid||ph.id||i} className="ph-row">
              <div className="ph-ico">🏥</div>
              <div className="ph-info"><div className="ph-name">{ph.nom}</div><div className="ph-dist">📍 {ph.quartier} · {ph.tel}</div></div>
              <span className={"stock-tag "+(ph.ouvert!==false?"stock-ok":"stock-out")}>{ph.ouvert!==false?"Ouverte":"Fermée"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Médicaments courants</div></div>
        <div className="chips">{CATEGORIES.map(c=><span key={c} className={"chip"+(catActive===c?" active":"")} onClick={()=>setCatActive(c)}>{c}</span>)}</div>
        <div className="grid-2">
          {filtered.map(m=>(
            <div key={m.id} className="med-card" onClick={()=>rechercher(m.nom)}>
              <div className="med-icon" style={{background:m.bg}}>{m.emoji}</div>
              <div className="med-info"><div className="med-name">{m.nom}</div><div className="med-cat">{m.cat}</div></div>
              <div className="med-price"><div className="price-from">à partir de</div><div className="price-val">{m.prixMin} F</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RÉSULTATS ─────────────────────────────────────────────────────────────────
function ResultatsPatient({ recherche, setPage }) {
  const fbReady = useFirebaseReady();
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fbReady) return;
    const ref = getDB().ref("stock");
    ref.on("value", snap => {
      const found = [];
      if (snap.exists()) {
        Object.entries(snap.val()).forEach(([uid,items]) => {
          Object.entries(items).forEach(([itemId,item]) => {
            if (item.nom?.toLowerCase().includes(recherche.toLowerCase()) && item.qte>0)
              found.push({...item, itemId, pharmacieUid:uid});
          });
        });
      }
      found.sort((a,b)=>a.prix-b.prix);
      setResultats(found);
      setLoading(false);
    });
    return () => ref.off();
  }, [fbReady, recherche]);

  if (loading) return <div className="main"><div className="loading"><div className="spinner"></div> Recherche dans les pharmacies de Yaoundé...</div></div>;

  return (
    <div className="main">
      <div className="result-toprow">
        <button className="btn btn-secondary btn-sm" onClick={()=>setPage("accueil")}>← Retour</button>
        <div><div className="result-title">{recherche}</div><div className="result-sub">{resultats.length} résultat(s) · Yaoundé · Triés par prix</div></div>
      </div>
      {resultats.length>0 && <div className="alert alert-success mb16"><span className="alert-ico">💡</span><span>Meilleur prix : <strong>{resultats[0].pharmacieNom}</strong> à <strong>{resultats[0].prix} FCFA</strong></span></div>}
      {resultats.length===0 && <div className="empty"><div className="empty-ico">😔</div><h3>Non disponible</h3><p>Aucune pharmacie connectée n'a ce médicament en stock.</p><button className="btn btn-secondary" style={{marginTop:16}} onClick={()=>setPage("accueil")}>← Retour</button></div>}
      <div className="results-list">
        {resultats.map((r,i)=>(
          <div key={r.itemId} className={"result-card"+(i===0?" best":"")} style={{animationDelay:(i*0.08)+"s"}}>
            <div className={"result-header"+(i===0?" best":"")}>
              <div className="ph-ico">🏥</div>
              <div className="ph-info"><div className="ph-name">{r.pharmacieNom||"Pharmacie"}</div><div className="ph-dist">📍 {r.quartier||"Yaoundé"}</div></div>
              {i===0 && <span className="best-badge">🏆 Meilleur prix</span>}
            </div>
            <div className="result-body">
              <div>
                <div className={"price-big"+(i!==0?" not-best":"")}>{r.prix} FCFA</div>
                <div className="mt6"><span className={"stock-tag "+(r.qte<=10?"stock-low":"stock-ok")}>{r.qte<=10?"⚠ Stock faible ("+r.qte+")":"✓ En stock ("+r.qte+")"}</span></div>
              </div>
              <button className={"btn btn-sm "+(i===0?"btn-primary":"btn-secondary")} onClick={()=>setPage("carte")}>🗺 Voir sur carte</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ stock, setPage, user }) {
  const alertes = stock.filter(s=>s.qte<=10&&s.qte>0);
  const ruptures = stock.filter(s=>s.qte===0);
  return (
    <div className="main">
      <div className="dash-header"><h2>🏥 {user?.nomPharmacie||"Mon Dashboard"}</h2><p><span className="status-dot online"></span>Connecté · Firebase sync 🔥</p></div>
      {alertes.length>0 && <div className="alert alert-warn mb16"><span className="alert-ico">⚠️</span><span><strong>Stock bas :</strong> {alertes.map(a=>a.nom).join(", ")}</span></div>}
      {ruptures.length>0 && <div className="alert mb16" style={{background:"#FDECEA",border:"1px solid #F5C6CB",color:"var(--red)"}}><span className="alert-ico">🚫</span><span><strong>Rupture :</strong> {ruptures.map(a=>a.nom).join(", ")}</span></div>}
      <div className="grid-4 mb24">
        {[{ico:"💊",num:stock.length,lbl:"Médicaments",bg:"#EBF4FF"},{ico:"⚠️",num:alertes.length,lbl:"Stocks bas",bg:"#FFF4E6"},{ico:"🚫",num:ruptures.length,lbl:"Ruptures",bg:"#FDECEA"},{ico:"🔥",num:"Live",lbl:"Firebase sync",bg:"#E6FAF0"}].map((s,i)=>(
          <div key={i} className="stat-card"><div className="stat-icon" style={{background:s.bg}}>{s.ico}</div><div className="stat-num" style={{fontSize:s.num==="Live"?"1rem":undefined}}>{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
        ))}
      </div>
      <div className="section-title">Actions rapides</div>
      <div className="grid-4">
        {[{ico:"➕",lbl:"Ajouter",page:"ajouter"},{ico:"📦",lbl:"Gérer le stock",page:"stock"},{ico:"🗺",lbl:"Voir sur la carte",page:"carte"},{ico:"⚙️",lbl:"Ma pharmacie",page:"profil"}].map((a,i)=>(
          <div key={i} className="action-card" onClick={()=>a.page&&setPage(a.page)}><div className="action-ico">{a.ico}</div><div className="action-lbl">{a.lbl}</div></div>
        ))}
      </div>
    </div>
  );
}

// ── GESTION STOCK ─────────────────────────────────────────────────────────────
function GestionStock({ stock, user, setPage }) {
  const [query, setQuery] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editPrix, setEditPrix] = useState("");
  const [editQte, setEditQte] = useState("");
  const filtered = stock.filter(s=>s.nom.toLowerCase().includes(query.toLowerCase()));
  const supprimer = async id => { if(!window.confirm("Supprimer ?"))return; await getDB().ref("stock/"+user.uid+"/"+id).remove(); };
  const sauvegarder = async () => { await getDB().ref("stock/"+user.uid+"/"+editItem.itemId).update({prix:Number(editPrix),qte:Number(editQte),updatedAt:Date.now()}); setEditItem(null); };
  return (
    <div className="main">
      <div className="page-toprow"><div><div className="page-title">Gestion du stock</div><div className="page-sub">{stock.length} médicaments · 🔥 Live</div></div><button className="btn btn-primary" onClick={()=>setPage("ajouter")}>➕ Ajouter</button></div>
      <div className="card">
        <div className="search-wrap mb16"><span className="search-ico2">🔍</span><input className="form-input search-field" placeholder="Rechercher..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
        <div className="table-wrap"><table><thead><tr><th>Médicament</th><th>Catégorie</th><th>Prix (FCFA)</th><th>Qté</th><th>Expiration</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(s=>(
          <tr key={s.itemId}>
            <td className="td-name">{s.nom}</td><td><span className="tag tag-blue">{s.cat}</span></td>
            <td className="td-price">{s.prix} F</td>
            <td style={{fontWeight:600,color:s.qte===0?"var(--red)":s.qte<=10?"#F4A261":"#2DC653"}}>{s.qte}{s.qte===0?" 🚫":s.qte<=10?" ⚠":""}</td>
            <td className="td-exp">{s.exp}</td>
            <td><span className={"stock-tag "+(s.qte===0?"stock-out":s.qte<=10?"stock-low":"stock-ok")}>{s.qte===0?"Rupture":s.qte<=10?"Stock bas":"Disponible"}</span></td>
            <td><div className="btn-row"><button className="btn btn-secondary btn-sm" onClick={()=>{setEditItem(s);setEditPrix(String(s.prix));setEditQte(String(s.qte));}}>✏️</button><button className="btn btn-danger btn-sm" onClick={()=>supprimer(s.itemId)}>🗑</button></div></td>
          </tr>
        ))}</tbody></table></div>
      </div>
      {editItem && <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setEditItem(null)}><div className="modal"><div className="modal-title">Modifier — {editItem.nom}</div><div className="grid-2"><div className="form-group"><label className="form-label">Prix (FCFA)</label><input className="form-input" type="number" value={editPrix} onChange={e=>setEditPrix(e.target.value)}/></div><div className="form-group"><label className="form-label">Quantité</label><input className="form-input" type="number" value={editQte} onChange={e=>setEditQte(e.target.value)}/></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setEditItem(null)}>Annuler</button><button className="btn btn-primary" onClick={sauvegarder}>✅ Enregistrer</button></div></div></div>}
    </div>
  );
}

// ── AJOUTER MÉDICAMENT ────────────────────────────────────────────────────────
function AjouterMedicament({ user, setPage }) {
  const [form, setForm] = useState({nom:"",cat:"",prix:"",qte:"",exp:""});
  const [success, setSuccess] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const enregistrer = async () => {
    if(!form.nom||!form.prix||!form.qte){alert("Champs obligatoires manquants.");return;}
    await getDB().ref("stock/"+user.uid).push({nom:form.nom,cat:form.cat||"Autre",prix:Number(form.prix),qte:Number(form.qte),exp:form.exp||"N/A",pharmacieId:user.uid,pharmacieNom:user.nomPharmacie||"Ma Pharmacie",updatedAt:Date.now()});
    setSuccess(true); setTimeout(()=>{setSuccess(false);setPage("stock");},1500);
  };
  return (
    <div className="main">
      <div className="page-toprow mb20"><button className="btn btn-secondary btn-sm" onClick={()=>setPage("stock")}>← Retour</button><div className="page-title">Ajouter un médicament</div></div>
      {success && <div className="alert alert-success mb16"><span className="alert-ico">✅</span><span>Ajouté sur Firebase !</span></div>}
      <div className="card form-card">
        <div className="form-group"><label className="form-label">Nom *</label><input className="form-input" placeholder="ex: Coartem 20/120mg" value={form.nom} onChange={e=>set("nom",e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Catégorie</label><select className="form-input" value={form.cat} onChange={e=>set("cat",e.target.value)}><option value="">Sélectionner...</option>{["Antidouleur","Antibiotique","Antipaludéen","Anti-inflammatoire","Cardio","Vitamines","Gastro","Diabète","Pédiatrie","Antiparasitaire","Autre"].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Prix (FCFA) *</label><input className="form-input" type="number" value={form.prix} onChange={e=>set("prix",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Quantité *</label><input className="form-input" type="number" value={form.qte} onChange={e=>set("qte",e.target.value)}/></div>
        </div>
        <div className="form-group"><label className="form-label">Date d'expiration</label><input className="form-input" type="date" value={form.exp} onChange={e=>set("exp",e.target.value)}/></div>
        <hr className="divider"/>
        <button className="btn btn-primary btn-full" onClick={enregistrer}>✅ Enregistrer</button>
      </div>
    </div>
  );
}

// ── PROFIL PHARMACIE ──────────────────────────────────────────────────────────
function ProfilPharmacie({ user }) {
  const [edit, setEdit] = useState(false);
  const [info, setInfo] = useState({nom:"",quartier:"",adresse:"",tel:"",ouverture:"08:00",fermeture:"22:00"});
  const [tmp, setTmp] = useState(info);
  useEffect(()=>{
    if(!user?.uid) return;
    getDB().ref("pharmacies/"+user.uid).once("value").then(snap=>{
      if(snap.exists()){const d=snap.val();setInfo({nom:d.nom||"",quartier:d.quartier||"",adresse:d.adresse||"",tel:d.tel||"",ouverture:d.ouverture||"08:00",fermeture:d.fermeture||"22:00"});}
    });
  },[user]);
  const sauvegarder = async()=>{ await getDB().ref("pharmacies/"+user.uid).update({...tmp,updatedAt:Date.now()}); setInfo(tmp); setEdit(false); };
  const set=(k,v)=>setTmp(f=>({...f,[k]:v}));
  return (
    <div className="main">
      <div className="page-title mb20">Ma Pharmacie</div>
      <div className="card form-card">
        <div className="profile-header">
          <div className="avatar">🏥</div>
          <div><div className="profile-name">{info.nom||"Ma Pharmacie"}</div><div className="profile-status"><span className="status-dot online"></span>Connectée · {info.quartier||"Yaoundé"}</div></div>
          <button className="btn btn-secondary btn-sm ml-auto" onClick={()=>{setEdit(!edit);setTmp(info);}}>{edit?"Annuler":"✏️ Modifier"}</button>
        </div>
        <hr className="divider"/>
        {edit ? (
          <>
            {[{k:"nom",l:"Nom"},{k:"quartier",l:"Quartier"},{k:"adresse",l:"Adresse"},{k:"tel",l:"Téléphone"}].map(({k,l})=>(
              <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" value={tmp[k]} onChange={e=>set(k,e.target.value)}/></div>
            ))}
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Ouverture</label><input className="form-input" type="time" value={tmp.ouverture} onChange={e=>set("ouverture",e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Fermeture</label><input className="form-input" type="time" value={tmp.fermeture} onChange={e=>set("fermeture",e.target.value)}/></div>
            </div>
            <button className="btn btn-primary btn-full" onClick={sauvegarder}>✅ Enregistrer</button>
          </>
        ) : (
          <>
            {[{ico:"📍",lbl:"Adresse",val:info.adresse||"—"},{ico:"🏘",lbl:"Quartier",val:info.quartier||"—"},{ico:"📞",lbl:"Téléphone",val:info.tel||"—"},{ico:"🕐",lbl:"Horaires",val:info.ouverture+" – "+info.fermeture}].map((r,i)=>(
              <div key={i} className="info-row"><span className="info-lbl">{r.ico} {r.lbl}</span><span className="info-val">{r.val}</span></div>
            ))}
            <div className="mt16"><div className="alert alert-success"><span className="alert-ico">🔥</span><span><strong>Firebase sync</strong> — Visible par les patients de Yaoundé</span></div></div>
          </>
        )}
      </div>
    </div>
  );
}

// ── APP PRINCIPALE ────────────────────────────────────────────────────────────
export default function App() {
  const fbReady = useFirebaseReady();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [role, setRole] = useState("patient");
  const [page, setPage] = useState("accueil");
  const [recherche, setRecherche] = useState("");
  const [stock, setStock] = useState([]);

  useEffect(() => {
    if (!fbReady) return;
    const unsub = getAuth().onAuthStateChanged(async fu => {
      if (fu) {
        const snap = await getDB().ref("users/"+fu.uid).get();
        const d = snap.val() || {};
        const u = {uid:fu.uid, email:fu.email, role:d.role||"patient", nomPharmacie:d.nom};
        setUser(u); setRole(u.role); setPage(u.role==="pharmacie"?"dashboard":"accueil");
      } else { setUser(null); }
      setAuthChecked(true);
    });
    return () => unsub();
  }, [fbReady]);

  useEffect(() => {
    if (!fbReady || !user || user.role!=="pharmacie") return;
    const ref = getDB().ref("stock/"+user.uid);
    ref.on("value", snap => {
      setStock(snap.exists() ? Object.entries(snap.val()).map(([itemId,item])=>({itemId,...item})) : []);
    });
    return () => ref.off();
  }, [fbReady, user]);

  const handleAuth = u => { setUser(u); setRole(u.role||"pharmacie"); setPage("dashboard"); };
  const handleLogout = async () => { await getAuth().signOut(); setUser(null); setRole("patient"); setPage("accueil"); setStock([]); };

  if (!fbReady || !authChecked) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>
      <div className="loading"><div className="spinner"></div> Chargement de Mediconline...</div>
    </div>
  );

  const TABS_PATIENT   = [{id:"accueil",label:"🏠 Accueil"},{id:"carte",label:"🗺 Carte"},{id:"resultats",label:"🔍 Recherche"}];
  const TABS_PHARMACIE = [{id:"dashboard",label:"📊 Dashboard"},{id:"stock",label:"📦 Stock"},{id:"ajouter",label:"➕ Ajouter"},{id:"carte",label:"🗺 Carte"},{id:"profil",label:"⚙️ Profil"}];
  const tabs = role==="patient" ? TABS_PATIENT : TABS_PHARMACIE;

  return (
    <div className="app">
      <Topbar role={role} setRole={setRole} setPage={setPage} user={user} onLogout={handleLogout}/>
      <div className="tabs">{tabs.map(t=><div key={t.id} className={"tab"+(page===t.id?" active":"")} onClick={()=>setPage(t.id)}>{t.label}</div>)}</div>
      {role==="patient" && page==="accueil"   && <AccueilPatient setPage={setPage} setRecherche={setRecherche}/>}
      {role==="patient" && page==="carte"     && <PageCarte/>}
      {role==="patient" && page==="resultats" && <ResultatsPatient recherche={recherche||"Paracétamol"} setPage={setPage}/>}
      {role==="pharmacie" && !user            && <AuthScreen onAuth={handleAuth}/>}
      {role==="pharmacie" && user && page==="dashboard" && <Dashboard stock={stock} setPage={setPage} user={user}/>}
      {role==="pharmacie" && user && page==="stock"     && <GestionStock stock={stock} user={user} setPage={setPage}/>}
      {role==="pharmacie" && user && page==="ajouter"   && <AjouterMedicament user={user} setPage={setPage}/>}
      {role==="pharmacie" && user && page==="carte"     && <PageCarte/>}
      {role==="pharmacie" && user && page==="profil"    && <ProfilPharmacie user={user}/>}
    </div>
  );
}