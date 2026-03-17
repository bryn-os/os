import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ══════════════════════════════════════════════════════════════════════════════
// 🎭 MODE DÉMO OFFLINE
// Active avec le bouton "Démo" dans la barre du haut
// Fonctionne sans internet — parfait pour présenter aux pharmacies
// ══════════════════════════════════════════════════════════════════════════════
const DEMO_PHARMACIES_OFFLINE = [
  { id:"ph1", nom:"Pharmacie Bastos",      quartier:"Bastos",       adresse:"Rue 1825, Bastos",         tel:"222-209-301", ouvert:true,  lat:3.8820, lng:11.5050 },
  { id:"ph2", nom:"Pharmacie du Centre",   quartier:"Centre-ville", adresse:"Av. Kennedy, Centre-ville",tel:"222-221-450", ouvert:true,  lat:3.8667, lng:11.5167 },
  { id:"ph3", nom:"Pharmacie Obili",       quartier:"Obili",        adresse:"Carrefour Obili",           tel:"222-315-780", ouvert:true,  lat:3.8550, lng:11.5080 },
  { id:"ph4", nom:"Pharmacie Biyem-Assi",  quartier:"Biyem-Assi",   adresse:"Marché Biyem-Assi",         tel:"222-303-112", ouvert:true,  lat:3.8450, lng:11.4980 },
  { id:"ph5", nom:"Pharmacie Essos",       quartier:"Essos",        adresse:"Carrefour Essos",           tel:"222-280-654", ouvert:false, lat:3.8710, lng:11.5350 },
  { id:"ph6", nom:"Pharmacie Nlongkak",    quartier:"Nlongkak",     adresse:"Nlongkak, face école",      tel:"222-231-999", ouvert:true,  lat:3.8780, lng:11.5220 },
  { id:"ph7", nom:"Pharmacie Melen",       quartier:"Melen",        adresse:"Rue Melen, Yaoundé",        tel:"222-340-800", ouvert:true,  lat:3.8620, lng:11.5290 },
  { id:"ph8", nom:"Pharmacie Mvog-Ada",    quartier:"Mvog-Ada",     adresse:"Av. Mvog-Ada",              tel:"222-355-240", ouvert:true,  lat:3.8480, lng:11.5280 },
];

const DEMO_STOCK_OFFLINE = {
  "ph1": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:50,   qte:200, credibilite:98 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2800, qte:15,  credibilite:97 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:950,  qte:30,  credibilite:95 },
    { nom:"Quinine 300mg comprimés",                       cat:"Antipaludéen",  prix:400,  qte:60,  credibilite:96 },
    { nom:"Ibuprofène 400mg",                              cat:"Antidouleur",   prix:350,  qte:80,  credibilite:99 },
    { nom:"Metformine 500mg",                              cat:"Diabète",       prix:600,  qte:50,  credibilite:94 },
    { nom:"Amlodipine 5mg",                                cat:"Cardio",        prix:700,  qte:25,  credibilite:93 },
    { nom:"Oméprazole 20mg",                               cat:"Gastro",        prix:450,  qte:35,  credibilite:97 },
    { nom:"Insuline Actrapid 100UI/ml",                    cat:"Diabète",       prix:5500, qte:5,   credibilite:92 },
  ],
  "ph2": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:45,   qte:300, credibilite:99 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2500, qte:25,  credibilite:96 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:800,  qte:50,  credibilite:98 },
    { nom:"Quinine 300mg comprimés",                       cat:"Antipaludéen",  prix:350,  qte:100, credibilite:97 },
    { nom:"Ciprofloxacine 500mg",                          cat:"Antibiotique",  prix:1600, qte:20,  credibilite:95 },
    { nom:"Cotrimoxazole (TMP/SMX) 480mg",                 cat:"Antibiotique",  prix:150,  qte:120, credibilite:99 },
    { nom:"Amlodipine 5mg",                                cat:"Cardio",        prix:650,  qte:40,  credibilite:96 },
    { nom:"Ceftriaxone injectable 1g",                     cat:"Antibiotique",  prix:2800, qte:12,  credibilite:94 },
    { nom:"Oméprazole 20mg",                               cat:"Gastro",        prix:400,  qte:45,  credibilite:98 },
  ],
  "ph3": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:50,   qte:150, credibilite:95 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2600, qte:18,  credibilite:94 },
    { nom:"Amoxicilline 500mg gélules",                    cat:"Antibiotique",  prix:1300, qte:25,  credibilite:93 },
    { nom:"Quinine 300mg comprimés",                       cat:"Antipaludéen",  prix:300,  qte:70,  credibilite:97 },
    { nom:"Ibuprofène 200mg",                              cat:"Antidouleur",   prix:200,  qte:90,  credibilite:96 },
    { nom:"Metformine 500mg",                              cat:"Diabète",       prix:550,  qte:35,  credibilite:92 },
    { nom:"Fer + Acide folique",                           cat:"Vitamines",     prix:280,  qte:80,  credibilite:98 },
  ],
  "ph4": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:50,   qte:180, credibilite:97 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2400, qte:30,  credibilite:98 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:850,  qte:45,  credibilite:96 },
    { nom:"Ibuprofène 400mg",                              cat:"Antidouleur",   prix:280,  qte:70,  credibilite:99 },
    { nom:"Cotrimoxazole (TMP/SMX) 480mg",                 cat:"Antibiotique",  prix:140,  qte:130, credibilite:99 },
    { nom:"Métronidazole 250mg",                           cat:"Antibiotique",  prix:280,  qte:55,  credibilite:95 },
    { nom:"Phénobarbital 100mg",                           cat:"Neurologie",    prix:180,  qte:25,  credibilite:93 },
  ],
  "ph5": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:55,   qte:120, credibilite:91 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2700, qte:12,  credibilite:90 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:880,  qte:20,  credibilite:92 },
    { nom:"Ciprofloxacine 500mg",                          cat:"Antibiotique",  prix:1700, qte:15,  credibilite:94 },
  ],
  "ph6": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:50,   qte:200, credibilite:96 },
    { nom:"Quinine 300mg comprimés",                       cat:"Antipaludéen",  prix:350,  qte:80,  credibilite:95 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:900,  qte:35,  credibilite:94 },
    { nom:"Vitamine C 500mg",                              cat:"Vitamines",     prix:100,  qte:200, credibilite:99 },
    { nom:"Oméprazole 20mg",                               cat:"Gastro",        prix:420,  qte:30,  credibilite:96 },
  ],
  "ph7": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:50,   qte:160, credibilite:95 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2550, qte:22,  credibilite:96 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:870,  qte:40,  credibilite:94 },
    { nom:"Ibuprofène 400mg",                              cat:"Antidouleur",   prix:300,  qte:65,  credibilite:97 },
    { nom:"Metformine 500mg",                              cat:"Diabète",       prix:570,  qte:45,  credibilite:93 },
  ],
  "ph8": [
    { nom:"Paracétamol 500mg",                             cat:"Antidouleur",   prix:50,   qte:140, credibilite:96 },
    { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen",  prix:2650, qte:16,  credibilite:95 },
    { nom:"Quinine 300mg comprimés",                       cat:"Antipaludéen",  prix:360,  qte:55,  credibilite:96 },
    { nom:"Amoxicilline 250mg gélules",                    cat:"Antibiotique",  prix:860,  qte:28,  credibilite:93 },
    { nom:"Métronidazole 250mg",                           cat:"Antibiotique",  prix:290,  qte:60,  credibilite:97 },
  ],
};

function searchDemoOffline(terme) {
  const t = terme.toLowerCase().trim();
  const results = [];
  DEMO_PHARMACIES_OFFLINE.forEach(ph => {
    const stocks = DEMO_STOCK_OFFLINE[ph.id] || [];
    stocks.forEach(item => {
      if(item.nom.toLowerCase().includes(t) || item.cat.toLowerCase().includes(t)) {
        results.push({
          ...item,
          pharmacieId: ph.id,
          pharmacieNom: ph.nom,
          quartier: ph.quartier,
          adresse: ph.adresse,
          tel: ph.tel,
          ouvert: ph.ouvert,
          lat: ph.lat,
          lng: ph.lng,
          updatedAt: Date.now() - Math.floor(Math.random()*3600000),
        });
      }
    });
  });
  return results.sort((a,b) => a.prix - b.prix);
}


// ══════════════════════════════════════════════════════════════════════════════
// 🔍 RECHERCHE FLOUE — tolère les fautes d'orthographe
// ══════════════════════════════════════════════════════════════════════════════
function normaliser(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g,"") // enlever accents
    .replace(/[^a-z0-9 ]/g," ")                      // garder lettres/chiffres
    .replace(/\s+/g," ").trim();
}

function distanceLevenshtein(a, b) {
  // Distance d'édition — mesure combien de lettres sont différentes
  const m=a.length, n=b.length;
  if(m===0)return n; if(n===0)return m;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

function scoreFuzzy(query, medicament) {
  const q  = normaliser(query);
  const nom = normaliser(medicament.nom);
  const cat = normaliser(medicament.cat||"");
  const mots = nom.split(" ");

  // 1. Correspondance exacte au début — meilleur score
  if(nom.startsWith(q)) return 100;

  // 2. Contient le terme exact
  if(nom.includes(q)) return 90;

  // 3. Correspondance sur un mot du nom
  for(const mot of mots){
    if(mot.startsWith(q)) return 85;
    if(mot.includes(q))   return 75;
  }

  // 4. Catégorie contient le terme
  if(cat.includes(q)) return 60;

  // 5. Faute d'orthographe légère — distance Levenshtein sur chaque mot
  for(const mot of mots){
    if(mot.length<3) continue;
    const dist = distanceLevenshtein(q, mot);
    const seuil = q.length<=4?1:q.length<=7?2:3;
    if(dist<=seuil) return Math.max(20, 70 - dist*15);
  }

  // 6. Faute sur le nom complet (pour les mots courts)
  if(q.length>=3){
    const dist = distanceLevenshtein(q, nom.slice(0,q.length+2));
    if(dist<=2) return Math.max(10, 50-dist*10);
  }

  return 0;
}

function rechercherFloue(query, limite=7) {
  if(!query||query.trim().length<2) return [];
  const scored = CATALOGUE_MEDICAMENTS
    .map(m=>({ ...m, score: scoreFuzzy(query, m) }))
    .filter(m=>m.score>0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,limite);
  return scored;
}

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

let fbAuth = null, fbDB = null, fbInitialized = false, fbCallbacks = [];
function getAuth() { return fbAuth; }
function getDB()   { return fbDB;   }
function onFirebaseReady(cb) { if (fbInitialized) { cb(); return; } fbCallbacks.push(cb); }
function loadScript(src, id) {
  return new Promise(r => {
    if (document.getElementById(id)) { r(); return; }
    const s = document.createElement("script"); s.src=src; s.id=id; s.onload=r; document.head.appendChild(s);
  });
}
(async function setupFirebase() {
  await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",      "fb-app");
  await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",     "fb-auth");
  await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js", "fb-db");
  if (!window.firebase.apps.length) window.firebase.initializeApp(FB_CONFIG);
  fbAuth = window.firebase.auth();
  fbDB   = window.firebase.database();
  fbInitialized = true;
  fbCallbacks.forEach(cb=>cb()); fbCallbacks=[];
})();
function useFirebaseReady() {
  const [r,setR] = useState(fbInitialized);
  useEffect(()=>{ if(!fbInitialized) onFirebaseReady(()=>setR(true)); },[]);
  return r;
}

// ── LEAFLET ───────────────────────────────────────────────────────────────────
function loadCSS(href,id){ if(document.getElementById(id))return; const l=document.createElement("link"); l.rel="stylesheet";l.href=href;l.id=id; document.head.appendChild(l); }
function useLeaflet() {
  const [r,setR] = useState(!!window.L);
  useEffect(()=>{
    loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css","leaflet-css");
    if(window.L){setR(true);return;}
    const s=document.createElement("script"); s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; s.id="leaflet-js"; s.onload=()=>setR(true); document.head.appendChild(s);
  },[]);
  return r;
}

// ══════════════════════════════════════════════════════════════════════════════
// 📋 BASE DE DONNÉES — 200+ MÉDICAMENTS CAMEROUN
// ══════════════════════════════════════════════════════════════════════════════
const CATALOGUE_MEDICAMENTS = [
  // ══ 01 ANESTHÉSIQUES ══════════════════════════════════════════════════════
  { id:"a001", nom:"Diazépam 5mg/ml injectable",                    cat:"Anesthésie",   emoji:"💉", prixRef:500  },
  { id:"a002", nom:"Étomidate 2mg/ml injectable",                   cat:"Anesthésie",   emoji:"💉", prixRef:3500 },
  { id:"a003", nom:"Halothane inhalation",                          cat:"Anesthésie",   emoji:"💉", prixRef:5000 },
  { id:"a004", nom:"Isoflurane inhalation 250ml",                   cat:"Anesthésie",   emoji:"💉", prixRef:8000 },
  { id:"a005", nom:"Sévoflurane inhalation 2mg/ml",                 cat:"Anesthésie",   emoji:"💉", prixRef:9000 },
  { id:"a006", nom:"Kétamine 50mg/ml injectable",                   cat:"Anesthésie",   emoji:"💉", prixRef:2500 },
  { id:"a007", nom:"Propofol 10mg/ml injectable",                   cat:"Anesthésie",   emoji:"💉", prixRef:3000 },
  { id:"a008", nom:"Propofol 20mg/ml injectable",                   cat:"Anesthésie",   emoji:"💉", prixRef:4000 },
  { id:"a009", nom:"Thiopental sodique 0,5g injectable",            cat:"Anesthésie",   emoji:"💉", prixRef:2000 },
  { id:"a010", nom:"Thiopental sodique 1g injectable",              cat:"Anesthésie",   emoji:"💉", prixRef:3500 },
  { id:"a011", nom:"Bupivacaïne 0,25% injectable",                  cat:"Anesthésie",   emoji:"💉", prixRef:1500 },
  { id:"a012", nom:"Bupivacaïne 0,5% injectable",                   cat:"Anesthésie",   emoji:"💉", prixRef:1800 },
  { id:"a013", nom:"Lidocaïne 1% injectable",                       cat:"Anesthésie",   emoji:"💉", prixRef:800  },
  { id:"a014", nom:"Lidocaïne 2% injectable",                       cat:"Anesthésie",   emoji:"💉", prixRef:1000 },
  { id:"a015", nom:"Lidocaïne spray 5%",                            cat:"Anesthésie",   emoji:"💉", prixRef:3500 },
  { id:"a016", nom:"Crème EMLA lidocaïne-prilocaïne",               cat:"Anesthésie",   emoji:"💉", prixRef:5000 },
  { id:"a017", nom:"Mépivacaïne 1% injectable",                     cat:"Anesthésie",   emoji:"💉", prixRef:1200 },
  { id:"a018", nom:"Oxygène médical gaz inhalation",                cat:"Anesthésie",   emoji:"💉", prixRef:2000 },
  { id:"a019", nom:"Protoxyde d'azote gaz inhalation",              cat:"Anesthésie",   emoji:"💉", prixRef:3000 },
  { id:"a020", nom:"Atropine 1mg/ml injectable (prémédication)",    cat:"Anesthésie",   emoji:"💉", prixRef:600  },
  { id:"a021", nom:"Fentanyl 100mcg/2ml injectable",                cat:"Anesthésie",   emoji:"💉", prixRef:2500 },
  { id:"a022", nom:"Morphine 10mg/ml injectable",                   cat:"Anesthésie",   emoji:"💉", prixRef:3000 },
  { id:"a023", nom:"Vécuronium 4mg/ml injectable",                  cat:"Anesthésie",   emoji:"💉", prixRef:4000 },

  // ══ 02 ANALGÉSIQUES - ANTIPYRÉTIQUES - AINS ═══════════════════════════════
  { id:"b001", nom:"Paracétamol 500mg comprimés",                   cat:"Antidouleur",  emoji:"🔵", prixRef:50   },
  { id:"b002", nom:"Paracétamol 120mg/5ml sirop",                   cat:"Antidouleur",  emoji:"🔵", prixRef:500  },
  { id:"b003", nom:"Paracétamol 100mg suppositoire",                cat:"Antidouleur",  emoji:"🔵", prixRef:200  },
  { id:"b004", nom:"Paracétamol 150mg suppositoire",                cat:"Antidouleur",  emoji:"🔵", prixRef:250  },
  { id:"b005", nom:"Paracétamol 300mg suppositoire",                cat:"Antidouleur",  emoji:"🔵", prixRef:300  },
  { id:"b006", nom:"Paracétamol 10mg/ml perfusion",                 cat:"Antidouleur",  emoji:"🔵", prixRef:1500 },
  { id:"b007", nom:"Métamizole 2,5g/5ml injectable",               cat:"Antidouleur",  emoji:"🔵", prixRef:800  },
  { id:"b008", nom:"Néfopam 20mg injectable",                       cat:"Antidouleur",  emoji:"🔵", prixRef:1500 },
  { id:"b009", nom:"Aspirine 100mg comprimés",                      cat:"Antidouleur",  emoji:"🔵", prixRef:100  },
  { id:"b010", nom:"Aspirine 300mg comprimés",                      cat:"Antidouleur",  emoji:"🔵", prixRef:150  },
  { id:"b011", nom:"Aspirine 500mg comprimés",                      cat:"Antidouleur",  emoji:"🔵", prixRef:200  },
  { id:"b012", nom:"Acétylsalicylate de lysine 500mg injectable",   cat:"Antidouleur",  emoji:"🔵", prixRef:600  },
  { id:"b013", nom:"Acétylsalicylate de lysine 900mg injectable",   cat:"Antidouleur",  emoji:"🔵", prixRef:900  },
  { id:"b014", nom:"Diclofénac 50mg comprimés",                     cat:"Antidouleur",  emoji:"🔵", prixRef:250  },
  { id:"b015", nom:"Diclofénac 75mg/ml injectable",                 cat:"Antidouleur",  emoji:"🔵", prixRef:600  },
  { id:"b016", nom:"Ibuprofène 200mg comprimés",                    cat:"Antidouleur",  emoji:"🔵", prixRef:200  },
  { id:"b017", nom:"Ibuprofène 400mg comprimés",                    cat:"Antidouleur",  emoji:"🔵", prixRef:300  },
  { id:"b018", nom:"Ibuprofène 100mg/5ml sirop",                   cat:"Antidouleur",  emoji:"🔵", prixRef:700  },
  { id:"b019", nom:"Kétoprofène 40mg injectable",                   cat:"Antidouleur",  emoji:"🔵", prixRef:800  },
  { id:"b020", nom:"Dexaméthasone 4mg injectable",                  cat:"Antidouleur",  emoji:"🔵", prixRef:400  },
  { id:"b021", nom:"Dexaméthasone 8mg injectable",                  cat:"Antidouleur",  emoji:"🔵", prixRef:700  },
  { id:"b022", nom:"Hydrocortisone 50mg injectable",                cat:"Antidouleur",  emoji:"🔵", prixRef:600  },
  { id:"b023", nom:"Hydrocortisone 100mg injectable",               cat:"Antidouleur",  emoji:"🔵", prixRef:900  },
  { id:"b024", nom:"Prednisolone 5mg comprimés",                    cat:"Antidouleur",  emoji:"🔵", prixRef:200  },
  { id:"b025", nom:"Prednisolone 20mg comprimés",                   cat:"Antidouleur",  emoji:"🔵", prixRef:400  },
  { id:"b026", nom:"Prednisolone aérosol",                          cat:"Antidouleur",  emoji:"🔵", prixRef:3500 },
  { id:"b027", nom:"Buprénorphine 0,3mg/ml injectable",             cat:"Antidouleur",  emoji:"🔵", prixRef:2500 },
  { id:"b028", nom:"Morphine 10mg comprimés",                       cat:"Antidouleur",  emoji:"🔵", prixRef:1500 },
  { id:"b029", nom:"Morphine 30mg comprimés LP",                    cat:"Antidouleur",  emoji:"🔵", prixRef:2500 },
  { id:"b030", nom:"Morphine 60mg comprimés LP",                    cat:"Antidouleur",  emoji:"🔵", prixRef:4000 },
  { id:"b031", nom:"Tramadol 50mg injectable",                      cat:"Antidouleur",  emoji:"🔵", prixRef:1500 },
  { id:"b032", nom:"Tramadol 100mg comprimés",                      cat:"Antidouleur",  emoji:"🔵", prixRef:2000 },
  { id:"b033", nom:"Allopurinol 100mg comprimés",                   cat:"Antidouleur",  emoji:"🔵", prixRef:300  },

  // ══ 03 ANTIHISTAMINIQUES & ANTIDOTES ══════════════════════════════════════
  { id:"c001", nom:"Adrénaline 0,5mg injectable",                   cat:"Urgence",      emoji:"🚨", prixRef:800  },
  { id:"c002", nom:"Adrénaline 1mg injectable",                     cat:"Urgence",      emoji:"🚨", prixRef:1200 },
  { id:"c003", nom:"Loratadine 10mg comprimés",                     cat:"Antihistaminique", emoji:"🟡", prixRef:300 },
  { id:"c004", nom:"Loratadine sirop",                              cat:"Antihistaminique", emoji:"🟡", prixRef:800 },
  { id:"c005", nom:"Noradrénaline injectable",                      cat:"Urgence",      emoji:"🚨", prixRef:2000 },
  { id:"c006", nom:"Charbon activé 50g sachet",                     cat:"Urgence",      emoji:"🚨", prixRef:500  },
  { id:"c007", nom:"Charbon activé 125mg capsules",                 cat:"Urgence",      emoji:"🚨", prixRef:200  },
  { id:"c008", nom:"Naloxone injectable (antidote morphine)",       cat:"Urgence",      emoji:"🚨", prixRef:3000 },
  { id:"c009", nom:"Phytoménadione Vit K1 10mg injectable",        cat:"Urgence",      emoji:"🚨", prixRef:1500 },

  // ══ 05 ANTIÉPILEPTIQUES ════════════════════════════════════════════════════
  { id:"d001", nom:"Acide valproïque 200mg comprimés",              cat:"Neurologie",   emoji:"🧠", prixRef:500  },
  { id:"d002", nom:"Acide valproïque 500mg comprimés",              cat:"Neurologie",   emoji:"🧠", prixRef:900  },
  { id:"d003", nom:"Acide valproïque sirop",                        cat:"Neurologie",   emoji:"🧠", prixRef:2500 },
  { id:"d004", nom:"Carbamazépine 200mg comprimés",                 cat:"Neurologie",   emoji:"🧠", prixRef:500  },
  { id:"d005", nom:"Carbamazépine 400mg comprimés",                 cat:"Neurologie",   emoji:"🧠", prixRef:900  },
  { id:"d006", nom:"Phénobarbital 100mg comprimés",                 cat:"Neurologie",   emoji:"🧠", prixRef:150  },
  { id:"d007", nom:"Phénobarbital 200mg injectable",                cat:"Neurologie",   emoji:"🧠", prixRef:800  },
  { id:"d008", nom:"Phénobarbital 40mg/ml injectable",              cat:"Neurologie",   emoji:"🧠", prixRef:600  },
  { id:"d009", nom:"Diazépam 5mg comprimés (épilepsie)",            cat:"Neurologie",   emoji:"🧠", prixRef:300  },
  { id:"d010", nom:"Amitriptyline 25mg comprimés",                  cat:"Neurologie",   emoji:"🧠", prixRef:400  },
  { id:"d011", nom:"Halopéridol 5mg comprimés",                     cat:"Neurologie",   emoji:"🧠", prixRef:400  },
  { id:"d012", nom:"Halopéridol 10mg injectable",                   cat:"Neurologie",   emoji:"🧠", prixRef:800  },
  { id:"d013", nom:"Rispéridone 2mg comprimés",                     cat:"Neurologie",   emoji:"🧠", prixRef:1500 },
  { id:"d014", nom:"Rispéridone 4mg comprimés",                     cat:"Neurologie",   emoji:"🧠", prixRef:2500 },
  { id:"d015", nom:"Chlorpromazine 100mg comprimés",                cat:"Neurologie",   emoji:"🧠", prixRef:300  },

  // ══ 06 ANTIPARASITAIRES ════════════════════════════════════════════════════
  { id:"e001", nom:"Albendazole 400mg comprimés",                   cat:"Antiparasitaire", emoji:"🦠", prixRef:200 },
  { id:"e002", nom:"Albendazole 400mg/10ml sirop",                  cat:"Antiparasitaire", emoji:"🦠", prixRef:500 },
  { id:"e003", nom:"Ivermectine 3mg comprimés",                     cat:"Antiparasitaire", emoji:"🦠", prixRef:500 },
  { id:"e004", nom:"Mébendazole 100mg comprimés",                   cat:"Antiparasitaire", emoji:"🦠", prixRef:150 },
  { id:"e005", nom:"Mébendazole 500mg comprimés",                   cat:"Antiparasitaire", emoji:"🦠", prixRef:500 },

  // ══ 06 ANTIPALUDÉENS ══════════════════════════════════════════════════════
  { id:"f001", nom:"Artéméther 20mg/120mg (Coartem) comprimés",    cat:"Antipaludéen", emoji:"🦟", prixRef:2500 },
  { id:"f002", nom:"Artéméther injectable 20mg/ml",                 cat:"Antipaludéen", emoji:"🦟", prixRef:2000 },
  { id:"f003", nom:"Artéméther injectable 40mg/ml",                 cat:"Antipaludéen", emoji:"🦟", prixRef:3000 },
  { id:"f004", nom:"Artéméther injectable 80mg/ml",                 cat:"Antipaludéen", emoji:"🦟", prixRef:3500 },
  { id:"f005", nom:"Artésunate injectable 60mg",                    cat:"Antipaludéen", emoji:"🦟", prixRef:4000 },
  { id:"f006", nom:"Artésunate injectable 120mg",                   cat:"Antipaludéen", emoji:"🦟", prixRef:6000 },
  { id:"f007", nom:"Artésunate + Amodiaquine 100/270mg (ASAQ)",    cat:"Antipaludéen", emoji:"🦟", prixRef:1800 },
  { id:"f008", nom:"Quinine 245mg/ml injectable",                   cat:"Antipaludéen", emoji:"🦟", prixRef:1500 },
  { id:"f009", nom:"Quinine 600mg injectable",                      cat:"Antipaludéen", emoji:"🦟", prixRef:2000 },
  { id:"f010", nom:"Quinine 300mg comprimés",                       cat:"Antipaludéen", emoji:"🦟", prixRef:350  },
  { id:"f011", nom:"Sulfadoxine + Pyriméthamine 500/25mg (Fansidar)", cat:"Antipaludéen", emoji:"🦟", prixRef:600 },
  { id:"f012", nom:"Chloroquine 100mg comprimés",                   cat:"Antipaludéen", emoji:"🦟", prixRef:150  },
  { id:"f013", nom:"Doxycycline 100mg (prophylaxie paludisme)",     cat:"Antipaludéen", emoji:"🦟", prixRef:400  },

  // ══ 06 ANTIBIOTIQUES ══════════════════════════════════════════════════════
  { id:"g001", nom:"Métronidazole 250mg comprimés",                 cat:"Antibiotique", emoji:"💊", prixRef:300  },
  { id:"g002", nom:"Métronidazole 500mg comprimés",                 cat:"Antibiotique", emoji:"💊", prixRef:500  },
  { id:"g003", nom:"Métronidazole 125mg/5ml sirop",                cat:"Antibiotique", emoji:"💊", prixRef:600  },
  { id:"g004", nom:"Métronidazole 500mg/100ml perfusion",          cat:"Antibiotique", emoji:"💊", prixRef:1000 },
  { id:"g005", nom:"Tinidazole 250mg comprimés",                    cat:"Antibiotique", emoji:"💊", prixRef:400  },
  { id:"g006", nom:"Tinidazole 500mg comprimés",                    cat:"Antibiotique", emoji:"💊", prixRef:700  },
  { id:"g007", nom:"Amoxicilline 250mg comprimés/gélules",          cat:"Antibiotique", emoji:"💊", prixRef:800  },
  { id:"g008", nom:"Amoxicilline 500mg comprimés/gélules",          cat:"Antibiotique", emoji:"💊", prixRef:1200 },
  { id:"g009", nom:"Amoxicilline 1000mg comprimés",                 cat:"Antibiotique", emoji:"💊", prixRef:2000 },
  { id:"g010", nom:"Amoxicilline + Acide clavulanique 500/125mg",  cat:"Antibiotique", emoji:"💊", prixRef:2500 },
  { id:"g011", nom:"Amoxicilline injectable 1g",                    cat:"Antibiotique", emoji:"💊", prixRef:800  },
  { id:"g012", nom:"Ampicilline 1 MUI injectable",                  cat:"Antibiotique", emoji:"💊", prixRef:600  },
  { id:"g013", nom:"Ampicilline 5 MUI injectable",                  cat:"Antibiotique", emoji:"💊", prixRef:1500 },
  { id:"g014", nom:"Cloxacilline 500mg comprimés",                  cat:"Antibiotique", emoji:"💊", prixRef:900  },
  { id:"g015", nom:"Benzylpénicilline 1 MUI injectable",           cat:"Antibiotique", emoji:"💊", prixRef:500  },
  { id:"g016", nom:"Benzylpénicilline 5 MUI injectable",           cat:"Antibiotique", emoji:"💊", prixRef:1200 },
  { id:"g017", nom:"Ceftriaxone 1g injectable",                     cat:"Antibiotique", emoji:"💊", prixRef:2500 },
  { id:"g018", nom:"Ceftriaxone 2g injectable",                     cat:"Antibiotique", emoji:"💊", prixRef:4500 },
  { id:"g019", nom:"Azithromycine 250mg comprimés",                 cat:"Antibiotique", emoji:"💊", prixRef:1200 },
  { id:"g020", nom:"Azithromycine 500mg comprimés (Zithromax)",     cat:"Antibiotique", emoji:"💊", prixRef:2000 },
  { id:"g021", nom:"Ciprofloxacine 500mg comprimés",                cat:"Antibiotique", emoji:"💊", prixRef:1500 },
  { id:"g022", nom:"Ciprofloxacine 100mg injectable",               cat:"Antibiotique", emoji:"💊", prixRef:2000 },
  { id:"g023", nom:"Gentamicine 40mg injectable",                   cat:"Antibiotique", emoji:"💊", prixRef:600  },
  { id:"g024", nom:"Gentamicine 80mg injectable",                   cat:"Antibiotique", emoji:"💊", prixRef:800  },
  { id:"g025", nom:"Cotrimoxazole (TMP/SMX) 480mg comprimés",      cat:"Antibiotique", emoji:"💊", prixRef:150  },
  { id:"g026", nom:"Cotrimoxazole pédiatrique 240mg",               cat:"Antibiotique", emoji:"💊", prixRef:100  },
  { id:"g027", nom:"Doxycycline 100mg comprimés",                   cat:"Antibiotique", emoji:"💊", prixRef:400  },
  { id:"g028", nom:"Érythromycine 250mg comprimés",                 cat:"Antibiotique", emoji:"💊", prixRef:600  },
  { id:"g029", nom:"Tétracycline 250mg comprimés",                  cat:"Antibiotique", emoji:"💊", prixRef:300  },
  { id:"g030", nom:"Cefixime 200mg comprimés",                      cat:"Antibiotique", emoji:"💊", prixRef:1800 },
  { id:"g031", nom:"Norfloxacine 400mg comprimés",                  cat:"Antibiotique", emoji:"💊", prixRef:1000 },
  { id:"g032", nom:"Ofloxacine 200mg comprimés",                    cat:"Antibiotique", emoji:"💊", prixRef:1200 },
  { id:"g033", nom:"Nitrofurantoïne 100mg comprimés",               cat:"Antibiotique", emoji:"💊", prixRef:700  },
  { id:"g034", nom:"Spectinomycine 2g injectable",                  cat:"Antibiotique", emoji:"💊", prixRef:5000 },

  // ══ ANTITUBERCULEUX ════════════════════════════════════════════════════════
  { id:"h001", nom:"Rifampicine 150mg comprimés",                   cat:"Antituberculeux", emoji:"🫁", prixRef:500 },
  { id:"h002", nom:"Rifampicine 300mg comprimés",                   cat:"Antituberculeux", emoji:"🫁", prixRef:900 },
  { id:"h003", nom:"Isoniazide 100mg comprimés",                    cat:"Antituberculeux", emoji:"🫁", prixRef:200 },
  { id:"h004", nom:"Isoniazide 300mg comprimés",                    cat:"Antituberculeux", emoji:"🫁", prixRef:500 },
  { id:"h005", nom:"Isoniazide 500mg injectable",                   cat:"Antituberculeux", emoji:"🫁", prixRef:1000},
  { id:"h006", nom:"Éthambutol 400mg comprimés",                    cat:"Antituberculeux", emoji:"🫁", prixRef:600 },
  { id:"h007", nom:"Pyrazinamide 500mg comprimés",                  cat:"Antituberculeux", emoji:"🫁", prixRef:400 },
  { id:"h008", nom:"Rifampicine + Isoniazide 150/50mg",             cat:"Antituberculeux", emoji:"🫁", prixRef:800 },
  { id:"h009", nom:"Rifampicine + Isoniazide + Pyrazinamide combiné", cat:"Antituberculeux", emoji:"🫁", prixRef:1200},
  { id:"h010", nom:"Streptomycine 1g injectable",                   cat:"Antituberculeux", emoji:"🫁", prixRef:1500},
  { id:"h011", nom:"Dapsone 100mg comprimés (lèpre)",               cat:"Antituberculeux", emoji:"🫁", prixRef:300 },
  { id:"h012", nom:"Clofazimine 50mg comprimés (lèpre)",            cat:"Antituberculeux", emoji:"🫁", prixRef:800 },

  // ══ 07 ANTIFONGIQUES ══════════════════════════════════════════════════════
  { id:"i001", nom:"Fluconazole 50mg comprimés",                    cat:"Antifongique",  emoji:"🍄", prixRef:600  },
  { id:"i002", nom:"Fluconazole 100mg comprimés",                   cat:"Antifongique",  emoji:"🍄", prixRef:1000 },
  { id:"i003", nom:"Fluconazole 150mg comprimés",                   cat:"Antifongique",  emoji:"🍄", prixRef:1500 },
  { id:"i004", nom:"Fluconazole 200mg comprimés",                   cat:"Antifongique",  emoji:"🍄", prixRef:2000 },
  { id:"i005", nom:"Fluconazole 200mg injectable",                  cat:"Antifongique",  emoji:"🍄", prixRef:4000 },
  { id:"i006", nom:"Nystatine comprimés vaginaux",                  cat:"Antifongique",  emoji:"🍄", prixRef:800  },
  { id:"i007", nom:"Nystatine suspension buvable",                  cat:"Antifongique",  emoji:"🍄", prixRef:1200 },
  { id:"i008", nom:"Terbinafine 250mg comprimés",                   cat:"Antifongique",  emoji:"🍄", prixRef:2000 },
  { id:"i009", nom:"Terbinafine 500mg comprimés",                   cat:"Antifongique",  emoji:"🍄", prixRef:3500 },
  { id:"i010", nom:"Terbinafine crème 1%",                          cat:"Antifongique",  emoji:"🍄", prixRef:2000 },
  { id:"i011", nom:"Kétoconazole crème 2%",                         cat:"Antifongique",  emoji:"🍄", prixRef:1500 },
  { id:"i012", nom:"Kétoconazole 200mg comprimés",                  cat:"Antifongique",  emoji:"🍄", prixRef:1200 },
  { id:"i013", nom:"Clotrimazole crème 1%",                         cat:"Antifongique",  emoji:"🍄", prixRef:800  },
  { id:"i014", nom:"Clotrimazole ovule 100mg",                      cat:"Antifongique",  emoji:"🍄", prixRef:800  },
  { id:"i015", nom:"Griséofulvine 250mg comprimés",                 cat:"Antifongique",  emoji:"🍄", prixRef:600  },
  { id:"i016", nom:"Amphotéricine B injectable",                    cat:"Antifongique",  emoji:"🍄", prixRef:15000},

  // ══ 08 ANTIVIRAUX ═════════════════════════════════════════════════════════
  { id:"j001", nom:"Aciclovir 200mg comprimés",                     cat:"Antiviral",     emoji:"🔴", prixRef:800  },
  { id:"j002", nom:"Aciclovir 400mg comprimés",                     cat:"Antiviral",     emoji:"🔴", prixRef:1200 },
  { id:"j003", nom:"Aciclovir 500mg injectable",                    cat:"Antiviral",     emoji:"🔴", prixRef:5000 },
  { id:"j004", nom:"Aciclovir crème 5%",                            cat:"Antiviral",     emoji:"🔴", prixRef:2000 },
  { id:"j005", nom:"Valganciclovir 450mg comprimés",                cat:"Antiviral",     emoji:"🔴", prixRef:25000},
  { id:"j006", nom:"Ganciclovir injectable",                        cat:"Antiviral",     emoji:"🔴", prixRef:20000},
  { id:"j007", nom:"Valaciclovir 500mg comprimés",                  cat:"Antiviral",     emoji:"🔴", prixRef:3500 },

  // ══ 09 ARV (Antirétroviraux) ═══════════════════════════════════════════════
  { id:"k001", nom:"TDF/3TC/DTG 300/300/50mg comprimés",            cat:"ARV",           emoji:"🎗️", prixRef:3000 },
  { id:"k002", nom:"Abacavir + Lamivudine 300/150mg",               cat:"ARV",           emoji:"🎗️", prixRef:4000 },
  { id:"k003", nom:"Zidovudine (AZT) 300mg comprimés",              cat:"ARV",           emoji:"🎗️", prixRef:2000 },
  { id:"k004", nom:"Zidovudine sirop 10mg/ml (pédiatrique)",        cat:"ARV",           emoji:"🎗️", prixRef:3000 },
  { id:"k005", nom:"Névirapine 200mg comprimés",                    cat:"ARV",           emoji:"🎗️", prixRef:1500 },
  { id:"k006", nom:"Lopinavir + Ritonavir 200/50mg",                cat:"ARV",           emoji:"🎗️", prixRef:5000 },
  { id:"k007", nom:"Cotrimoxazole 960mg prophylaxie VIH",           cat:"ARV",           emoji:"🎗️", prixRef:300  },
  { id:"k008", nom:"Fluconazole 200mg (infections opportunistes)",  cat:"ARV",           emoji:"🎗️", prixRef:2500 },

  // ══ 11 ANTINÉOPLASIQUES ═══════════════════════════════════════════════════
  { id:"l001", nom:"5-Fluorouracile (5-FU) injectable",             cat:"Oncologie",     emoji:"⚗️", prixRef:15000},
  { id:"l002", nom:"Cisplatine 10mg injectable",                    cat:"Oncologie",     emoji:"⚗️", prixRef:8000 },
  { id:"l003", nom:"Cisplatine 25mg injectable",                    cat:"Oncologie",     emoji:"⚗️", prixRef:18000},
  { id:"l004", nom:"Méthotrexate 2,5mg comprimés",                  cat:"Oncologie",     emoji:"⚗️", prixRef:2000 },
  { id:"l005", nom:"Méthotrexate 50mg injectable",                  cat:"Oncologie",     emoji:"⚗️", prixRef:10000},
  { id:"l006", nom:"Oxaliplatine 100mg injectable",                 cat:"Oncologie",     emoji:"⚗️", prixRef:35000},
  { id:"l007", nom:"Tamoxifène 20mg comprimés",                     cat:"Oncologie",     emoji:"⚗️", prixRef:3000 },
  { id:"l008", nom:"Bevacizumab 400mg injectable",                  cat:"Oncologie",     emoji:"⚗️", prixRef:150000},
  { id:"l009", nom:"Érythropoïétine 2000 UI injectable",            cat:"Oncologie",     emoji:"⚗️", prixRef:8000 },
  { id:"l010", nom:"Érythropoïétine 4000 UI injectable",            cat:"Oncologie",     emoji:"⚗️", prixRef:15000},

  // ══ 13 CARDIOVASCULAIRES ══════════════════════════════════════════════════
  { id:"m001", nom:"Amlodipine 5mg comprimés",                      cat:"Cardio",        emoji:"❤️", prixRef:600  },
  { id:"m002", nom:"Amlodipine 10mg comprimés",                     cat:"Cardio",        emoji:"❤️", prixRef:900  },
  { id:"m003", nom:"Aténolol 50mg comprimés",                       cat:"Cardio",        emoji:"❤️", prixRef:350  },
  { id:"m004", nom:"Aténolol 100mg comprimés",                      cat:"Cardio",        emoji:"❤️", prixRef:600  },
  { id:"m005", nom:"Furosémide 20mg comprimés",                     cat:"Cardio",        emoji:"❤️", prixRef:200  },
  { id:"m006", nom:"Furosémide 40mg comprimés",                     cat:"Cardio",        emoji:"❤️", prixRef:250  },
  { id:"m007", nom:"Furosémide 250mg/25ml injectable",              cat:"Cardio",        emoji:"❤️", prixRef:500  },
  { id:"m008", nom:"Captopril 25mg comprimés",                      cat:"Cardio",        emoji:"❤️", prixRef:400  },
  { id:"m009", nom:"Énalapril 10mg comprimés",                      cat:"Cardio",        emoji:"❤️", prixRef:500  },
  { id:"m010", nom:"Lisinopril 10mg comprimés",                     cat:"Cardio",        emoji:"❤️", prixRef:700  },
  { id:"m011", nom:"Losartan 50mg comprimés",                       cat:"Cardio",        emoji:"❤️", prixRef:1200 },
  { id:"m012", nom:"Hydrochlorothiazide 25mg comprimés",            cat:"Cardio",        emoji:"❤️", prixRef:200  },
  { id:"m013", nom:"Méthyldopa 250mg comprimés",                    cat:"Cardio",        emoji:"❤️", prixRef:400  },
  { id:"m014", nom:"Nifédipine 10mg retard comprimés",              cat:"Cardio",        emoji:"❤️", prixRef:600  },
  { id:"m015", nom:"Digoxine 0,25mg comprimés",                     cat:"Cardio",        emoji:"❤️", prixRef:300  },
  { id:"m016", nom:"Simvastatine 20mg comprimés",                   cat:"Cardio",        emoji:"❤️", prixRef:1500 },
  { id:"m017", nom:"Atorvastatine 40mg comprimés",                  cat:"Cardio",        emoji:"❤️", prixRef:2500 },
  { id:"m018", nom:"Clopidogrel 75mg comprimés",                    cat:"Cardio",        emoji:"❤️", prixRef:2000 },
  { id:"m019", nom:"Warfarine 5mg comprimés",                       cat:"Cardio",        emoji:"❤️", prixRef:800  },
  { id:"m020", nom:"Bisoprolol 5mg comprimés",                      cat:"Cardio",        emoji:"❤️", prixRef:1000 },
  { id:"m021", nom:"Spironolactone 25mg comprimés",                 cat:"Cardio",        emoji:"❤️", prixRef:600  },
  { id:"m022", nom:"Isosorbide dinitrate 5mg (sublingual)",         cat:"Cardio",        emoji:"❤️", prixRef:800  },
  { id:"m023", nom:"Héparine sodique 5000 UI injectable",           cat:"Cardio",        emoji:"❤️", prixRef:3000 },
  { id:"m024", nom:"Streptokinase 1 500 000 UI injectable",         cat:"Cardio",        emoji:"❤️", prixRef:50000},

  // ══ DIABÈTE ══════════════════════════════════════════════════════════════
  { id:"n001", nom:"Metformine 500mg comprimés",                    cat:"Diabète",       emoji:"💙", prixRef:500  },
  { id:"n002", nom:"Metformine 850mg comprimés",                    cat:"Diabète",       emoji:"💙", prixRef:700  },
  { id:"n003", nom:"Metformine 1000mg comprimés",                   cat:"Diabète",       emoji:"💙", prixRef:900  },
  { id:"n004", nom:"Glibenclamide 5mg comprimés",                   cat:"Diabète",       emoji:"💙", prixRef:300  },
  { id:"n005", nom:"Gliclazide 80mg comprimés",                     cat:"Diabète",       emoji:"💙", prixRef:800  },
  { id:"n006", nom:"Insuline Actrapid 100 UI/ml",                   cat:"Diabète",       emoji:"💙", prixRef:5000 },
  { id:"n007", nom:"Insuline NPH 100 UI/ml",                        cat:"Diabète",       emoji:"💙", prixRef:5000 },
  { id:"n008", nom:"Insuline Mixtard 30/70 100 UI/ml",              cat:"Diabète",       emoji:"💙", prixRef:6000 },
  { id:"n009", nom:"Insuline Glargine 100 UI/ml",                   cat:"Diabète",       emoji:"💙", prixRef:12000},

  // ══ 14 DERMATOLOGIE ══════════════════════════════════════════════════════
  { id:"o001", nom:"Benzoate de benzyle lotion 25%",                cat:"Dermatologie",  emoji:"🧴", prixRef:1500 },
  { id:"o002", nom:"Polyvidone iodée solution 10%",                 cat:"Dermatologie",  emoji:"🧴", prixRef:1000 },
  { id:"o003", nom:"Perméthrine lotion 5% (gale, poux)",           cat:"Dermatologie",  emoji:"🧴", prixRef:2000 },
  { id:"o004", nom:"Gentamicine crème 0,1%",                        cat:"Dermatologie",  emoji:"🧴", prixRef:600  },
  { id:"o005", nom:"Béclométhasone crème 0,025%",                   cat:"Dermatologie",  emoji:"🧴", prixRef:1000 },
  { id:"o006", nom:"Eau oxygénée 10 volumes",                       cat:"Dermatologie",  emoji:"🧴", prixRef:300  },
  { id:"o007", nom:"Alcool éthylique 70%",                          cat:"Dermatologie",  emoji:"🧴", prixRef:500  },
  { id:"o008", nom:"Sulfure de sélénium shampooing 2,5%",           cat:"Dermatologie",  emoji:"🧴", prixRef:2500 },

  // ══ 15 GASTRO-ENTÉROLOGIE ════════════════════════════════════════════════
  { id:"p001", nom:"Oméprazole 20mg gélules",                       cat:"Gastro",        emoji:"🟢", prixRef:400  },
  { id:"p002", nom:"Oméprazole 40mg injectable",                    cat:"Gastro",        emoji:"🟢", prixRef:2000 },
  { id:"p003", nom:"Dompéridone 10mg comprimés",                    cat:"Gastro",        emoji:"🟢", prixRef:350  },
  { id:"p004", nom:"Diosmectite 3g sachet",                         cat:"Gastro",        emoji:"🟢", prixRef:300  },
  { id:"p005", nom:"Ranitidine 150mg comprimés",                    cat:"Gastro",        emoji:"🟢", prixRef:300  },
  { id:"p006", nom:"Pantoprazole 40mg comprimés",                   cat:"Gastro",        emoji:"🟢", prixRef:1500 },
  { id:"p007", nom:"Métoclopramide 10mg comprimés",                 cat:"Gastro",        emoji:"🟢", prixRef:200  },
  { id:"p008", nom:"Spasfon (Phloroglucinol) 80mg",                cat:"Gastro",        emoji:"🟢", prixRef:500  },
  { id:"p009", nom:"Lopéramide 2mg comprimés",                      cat:"Gastro",        emoji:"🟢", prixRef:250  },
  { id:"p010", nom:"ORS (Sels de réhydratation orale)",             cat:"Gastro",        emoji:"🟢", prixRef:100  },
  { id:"p011", nom:"Zinc 20mg (traitement diarrhée)",               cat:"Gastro",        emoji:"🟢", prixRef:200  },
  { id:"p012", nom:"Praziquantel 600mg (schistosomiase)",           cat:"Gastro",        emoji:"🟢", prixRef:1500 },
  { id:"p013", nom:"Misoprostol 200mcg comprimés",                  cat:"Gastro",        emoji:"🟢", prixRef:1000 },

  // ══ 16 VITAMINES & SUPPLÉMENTS ═══════════════════════════════════════════
  { id:"q001", nom:"Vitamine C 500mg comprimés",                    cat:"Vitamines",     emoji:"🍋", prixRef:100  },
  { id:"q002", nom:"Vitamine A 100 000 UI capsules",                cat:"Vitamines",     emoji:"🍋", prixRef:300  },
  { id:"q003", nom:"Vitamine B complexe comprimés",                 cat:"Vitamines",     emoji:"🍋", prixRef:200  },
  { id:"q004", nom:"Vitamine D3 1000 UI comprimés",                 cat:"Vitamines",     emoji:"🍋", prixRef:500  },
  { id:"q005", nom:"Fer + Acide folique comprimés",                 cat:"Vitamines",     emoji:"🍋", prixRef:250  },
  { id:"q006", nom:"Sulfate de fer 200mg comprimés",                cat:"Vitamines",     emoji:"🍋", prixRef:150  },
  { id:"q007", nom:"Calcium + Vitamine D3 comprimés",              cat:"Vitamines",     emoji:"🍋", prixRef:600  },
  { id:"q008", nom:"Multivitamines adulte comprimés",               cat:"Vitamines",     emoji:"🍋", prixRef:1500 },
  { id:"q009", nom:"Acide folique 5mg comprimés",                   cat:"Vitamines",     emoji:"🍋", prixRef:200  },

  // ══ 17 SOLUTIONS DE PERFUSION ════════════════════════════════════════════
  { id:"r001", nom:"Sérum physiologique NaCl 0,9% 500ml",          cat:"Perfusion",     emoji:"💧", prixRef:800  },
  { id:"r002", nom:"Glucosé 5% 500ml",                              cat:"Perfusion",     emoji:"💧", prixRef:800  },
  { id:"r003", nom:"Glucosé 10% 500ml",                             cat:"Perfusion",     emoji:"💧", prixRef:900  },
  { id:"r004", nom:"Ringer Lactate 500ml",                          cat:"Perfusion",     emoji:"💧", prixRef:1000 },
  { id:"r005", nom:"Glucosé 5% + NaCl 0,9% 500ml",                 cat:"Perfusion",     emoji:"💧", prixRef:1000 },
  { id:"r006", nom:"Bicarbonate de sodium 14‰ 500ml",               cat:"Perfusion",     emoji:"💧", prixRef:1200 },
  { id:"r007", nom:"Albumine humaine 20% 50ml",                     cat:"Perfusion",     emoji:"💧", prixRef:25000},
  { id:"r008", nom:"Dextran 40 500ml",                              cat:"Perfusion",     emoji:"💧", prixRef:3000 },

  // ══ 21 OPHTALMOLOGIE ══════════════════════════════════════════════════════
  { id:"s001", nom:"Chloramphénicol collyre 0,5%",                  cat:"Ophtalmologie", emoji:"👁️", prixRef:500  },
  { id:"s002", nom:"Ciprofloxacine collyre 0,3%",                   cat:"Ophtalmologie", emoji:"👁️", prixRef:1500 },
  { id:"s003", nom:"Tobramycine collyre 0,3%",                      cat:"Ophtalmologie", emoji:"👁️", prixRef:2000 },
  { id:"s004", nom:"Acétazolamide 250mg comprimés (glaucome)",      cat:"Ophtalmologie", emoji:"👁️", prixRef:1500 },
  { id:"s005", nom:"Timolol collyre 0,5% (glaucome)",               cat:"Ophtalmologie", emoji:"👁️", prixRef:2500 },
  { id:"s006", nom:"Pilocarpine collyre 2% (glaucome)",             cat:"Ophtalmologie", emoji:"👁️", prixRef:1800 },
  { id:"s007", nom:"Larmes artificielles 10ml",                     cat:"Ophtalmologie", emoji:"👁️", prixRef:1200 },
  { id:"s008", nom:"Gentamicine collyre 0,3%",                      cat:"Ophtalmologie", emoji:"👁️", prixRef:1000 },

  // ══ 22 ORL ═══════════════════════════════════════════════════════════════
  { id:"t001", nom:"Otylol gouttes auriculaires",                   cat:"ORL",           emoji:"👂", prixRef:800  },
  { id:"t002", nom:"Prednisolone gouttes nasales",                  cat:"ORL",           emoji:"👂", prixRef:1000 },
  { id:"t003", nom:"Cétirizine 10mg comprimés",                     cat:"ORL",           emoji:"👂", prixRef:350  },
  { id:"t004", nom:"Pseudoéphédrine + Paracétamol comprimés",       cat:"ORL",           emoji:"👂", prixRef:400  },

  // ══ 23 PSYCHIATRIE ═══════════════════════════════════════════════════════
  { id:"u001", nom:"Amitriptyline 50mg comprimés",                  cat:"Psychiatrie",   emoji:"🧘", prixRef:600  },
  { id:"u002", nom:"Halopéridol 2mg comprimés",                     cat:"Psychiatrie",   emoji:"🧘", prixRef:300  },
  { id:"u003", nom:"Halopéridol 5mg injectable",                    cat:"Psychiatrie",   emoji:"🧘", prixRef:600  },
  { id:"u004", nom:"Rispéridone 1mg comprimés",                     cat:"Psychiatrie",   emoji:"🧘", prixRef:1000 },
  { id:"u005", nom:"Diazépam 5mg comprimés (anxiolytique)",         cat:"Psychiatrie",   emoji:"🧘", prixRef:300  },
  { id:"u006", nom:"Chlorpromazine 100mg comprimés",                cat:"Psychiatrie",   emoji:"🧘", prixRef:300  },
  { id:"u007", nom:"Fluoxétine 20mg comprimés",                     cat:"Psychiatrie",   emoji:"🧘", prixRef:1500 },

  // ══ 24 RESPIRATOIRE ══════════════════════════════════════════════════════
  { id:"v001", nom:"Salbutamol 100mcg aérosol (Ventoline)",         cat:"Respiratoire",  emoji:"💨", prixRef:3000 },
  { id:"v002", nom:"Salbutamol 2mg comprimés",                      cat:"Respiratoire",  emoji:"💨", prixRef:500  },
  { id:"v003", nom:"Salbutamol 4mg comprimés",                      cat:"Respiratoire",  emoji:"💨", prixRef:800  },
  { id:"v004", nom:"Salbutamol solution nébulisation",              cat:"Respiratoire",  emoji:"💨", prixRef:2500 },
  { id:"v005", nom:"Béclométhasone 100mcg aérosol",                 cat:"Respiratoire",  emoji:"💨", prixRef:4000 },
  { id:"v006", nom:"Béclométhasone 250mcg aérosol",                 cat:"Respiratoire",  emoji:"💨", prixRef:5000 },
  { id:"v007", nom:"Théophylline 200mg comprimés",                  cat:"Respiratoire",  emoji:"💨", prixRef:600  },
  { id:"v008", nom:"Théophylline injectable",                       cat:"Respiratoire",  emoji:"💨", prixRef:1500 },
  { id:"v009", nom:"Bromhexine 8mg sirop",                          cat:"Respiratoire",  emoji:"💨", prixRef:600  },
  { id:"v010", nom:"Ambroxol 30mg comprimés",                       cat:"Respiratoire",  emoji:"💨", prixRef:500  },
  { id:"v011", nom:"Loratadine 10mg antihistaminique",              cat:"Respiratoire",  emoji:"💨", prixRef:300  },
  { id:"v012", nom:"Pholcodine sirop 5mg/5ml (antitussif)",         cat:"Respiratoire",  emoji:"💨", prixRef:800  },
  { id:"v013", nom:"Ipratropium bromure aérosol",                   cat:"Respiratoire",  emoji:"💨", prixRef:4500 },

  // ══ 25 GYNÉCOLOGIE & MATERNITÉ ═══════════════════════════════════════════
  { id:"w001", nom:"Ocytocine 5 UI injectable",                     cat:"Gynécologie",   emoji:"🤱", prixRef:500  },
  { id:"w002", nom:"Misoprostol 200mcg (gynécologie)",              cat:"Gynécologie",   emoji:"🤱", prixRef:1000 },
  { id:"w003", nom:"Contraceptif oral combiné (COC)",               cat:"Gynécologie",   emoji:"🤱", prixRef:300  },
  { id:"w004", nom:"Levonorgestrel 1,5mg (pilule du lendemain)",    cat:"Gynécologie",   emoji:"🤱", prixRef:1500 },
  { id:"w005", nom:"Sulfate de magnésium 50% injectable",           cat:"Gynécologie",   emoji:"🤱", prixRef:800  },
  { id:"w006", nom:"Clotrimazole ovule 100mg",                      cat:"Gynécologie",   emoji:"🤱", prixRef:800  },
  { id:"w007", nom:"Métronidazole ovule 500mg",                     cat:"Gynécologie",   emoji:"🤱", prixRef:700  },
  { id:"w008", nom:"Fer + Acide folique grossesse",                 cat:"Gynécologie",   emoji:"🤱", prixRef:300  },
  { id:"w009", nom:"Érythromycine 500mg (grossesse)",               cat:"Gynécologie",   emoji:"🤱", prixRef:1000 },

  // ══ 26 PÉDIATRIE ══════════════════════════════════════════════════════════
  { id:"x001", nom:"Amoxicilline sirop 125mg/5ml",                 cat:"Pédiatrie",     emoji:"🧒", prixRef:1200 },
  { id:"x002", nom:"Cotrimoxazole pédiatrique sirop",              cat:"Pédiatrie",     emoji:"🧒", prixRef:800  },
  { id:"x003", nom:"Ibuprofène sirop 100mg/5ml",                   cat:"Pédiatrie",     emoji:"🧒", prixRef:700  },
  { id:"x004", nom:"Paracétamol sirop 120mg/5ml",                  cat:"Pédiatrie",     emoji:"🧒", prixRef:500  },
  { id:"x005", nom:"Vitamine A 100 000 UI capsule enfant",         cat:"Pédiatrie",     emoji:"🧒", prixRef:200  },
  { id:"x006", nom:"Coartem pédiatrique 20/120mg",                 cat:"Pédiatrie",     emoji:"🧒", prixRef:1500 },
  { id:"x007", nom:"Quinine sirop pédiatrique",                    cat:"Pédiatrie",     emoji:"🧒", prixRef:900  },
  { id:"x008", nom:"Zinc 10mg sirop pédiatrique",                  cat:"Pédiatrie",     emoji:"🧒", prixRef:500  },
  { id:"x009", nom:"ORS pédiatrique sachets 250ml",                cat:"Pédiatrie",     emoji:"🧒", prixRef:100  },
  { id:"x010", nom:"Mébendazole 100mg pédiatrique",                cat:"Pédiatrie",     emoji:"🧒", prixRef:150  },
  { id:"x011", nom:"Métronidazole sirop 125mg/5ml",                cat:"Pédiatrie",     emoji:"🧒", prixRef:600  },
  { id:"x012", nom:"Névirapine sirop (pédiatrie VIH)",             cat:"Pédiatrie",     emoji:"🧒", prixRef:2500 },
];

const CATEGORIES_CATALOGUE = ["Tous","Antipaludéen","Antibiotique","Antidouleur","Antifongique","Antiviral","ARV","Antiparasitaire","Antituberculeux","Anesthésie","Cardio","Diabète","Gastro","Gynécologie","Neurologie","Oncologie","ORL","Ophtalmologie","Pédiatrie","Perfusion","Psychiatrie","Respiratoire","Dermatologie","Urgence","Vitamines"];

// ══════════════════════════════════════════════════════════════════════════════
// 🏥 VRAIES PHARMACIES DE YAOUNDÉ
// ══════════════════════════════════════════════════════════════════════════════
const PHARMACIES_YAOUNDE = [
  { id:1,  nom:"Pharmacie Bastos",              quartier:"Bastos",           tel:"+237 222 20 94 93", lat:3.8845, lng:11.5174, ouvert:true  },
  { id:2,  nom:"Pharmacie du Centre-Ville",     quartier:"Centre-ville",     tel:"+237 222 22 20 21", lat:3.8667, lng:11.5174, ouvert:true  },
  { id:3,  nom:"Pharmacie Obili Chapelle",      quartier:"Obili",            tel:"+237 222 31 41 22", lat:3.8603, lng:11.4989, ouvert:true  },
  { id:4,  nom:"Pharmacie Notre Dame",          quartier:"Tsinga",           tel:"+237 242 08 37 52", lat:3.8780, lng:11.5050, ouvert:false },
  { id:5,  nom:"Pharmacie Ketchy",              quartier:"Madagascar",       tel:"+237 222 22 00 60", lat:3.8720, lng:11.5290, ouvert:true  },
  { id:6,  nom:"Pharmacie de Cana",             quartier:"Carrefour Jamot",  tel:"+237 222 20 97 51", lat:3.8640, lng:11.5220, ouvert:true  },
  { id:7,  nom:"Pharmacie des Acacias",         quartier:"Biyem-Assi",       tel:"+237 222 31 70 19", lat:3.8452, lng:11.4950, ouvert:true  },
  { id:8,  nom:"Pharmacie des 7 Collines",      quartier:"Melen",            tel:"+237 222 22 65 71", lat:3.8810, lng:11.5400, ouvert:false },
  { id:9,  nom:"Pharmacie Populaire Essos",     quartier:"Essos",            tel:"+237 222 23 23 41", lat:3.8750, lng:11.5350, ouvert:true  },
  { id:10, nom:"Pharmacie Provinciale Centre",  quartier:"Nlongkak",         tel:"+237 222 20 94 93", lat:3.8900, lng:11.5100, ouvert:true  },
  { id:11, nom:"Pharmacie Queens",              quartier:"Cité Verte",       tel:"+237 242 12 91 13", lat:3.8530, lng:11.5050, ouvert:true  },
  { id:12, nom:"Pharmacie de la Foi",           quartier:"Odza",             tel:"+237 655 43 96 62", lat:3.8320, lng:11.5600, ouvert:false },
  { id:13, nom:"Pharmacie Le Cygne",            quartier:"Centre-ville",     tel:"+237 222 22 29 68", lat:3.8680, lng:11.5200, ouvert:true  },
  { id:14, nom:"Pharmacie Mvog-Mbi",            quartier:"Mvog-Mbi",         tel:"+237 222 30 67 85", lat:3.8480, lng:11.5300, ouvert:true  },
  { id:15, nom:"Pharmacie de Mendong",          quartier:"Mendong",          tel:"+237 222 31 48 62", lat:3.8280, lng:11.4880, ouvert:true  },
  { id:16, nom:"Pharmacie Saint-Luc",           quartier:"Ngousso",          tel:"+237 222 20 12 34", lat:3.8960, lng:11.5270, ouvert:true  },
  { id:17, nom:"Pharmacie de l'Hippodrome",     quartier:"Hippodrome",       tel:"+237 222 22 73 18", lat:3.8700, lng:11.5080, ouvert:true  },
  { id:18, nom:"Pharmacie du Lac",              quartier:"Lac Municipal",    tel:"+237 222 23 02 15", lat:3.8660, lng:11.5130, ouvert:true  },
  { id:19, nom:"Pharmacie Mokolo",              quartier:"Mokolo",           tel:"+237 222 20 43 27", lat:3.8800, lng:11.4920, ouvert:true  },
  { id:20, nom:"Pharmacie Santa Barbara",       quartier:"Elig-Essono",      tel:"+237 222 20 88 10", lat:3.8740, lng:11.5060, ouvert:false },
  { id:21, nom:"Pharmacie de la Victoire",      quartier:"Centre-ville",     tel:"+237 222 22 15 44", lat:3.8690, lng:11.5180, ouvert:true  },
  { id:22, nom:"Pharmacie Nkol-Eton",           quartier:"Nkol-Eton",        tel:"+237 222 21 04 92", lat:3.8600, lng:11.5400, ouvert:true  },
  { id:23, nom:"Pharmacie de Biyem-Assi Marché",quartier:"Biyem-Assi",      tel:"+237 699 12 34 56", lat:3.8420, lng:11.4980, ouvert:true  },
  { id:24, nom:"Pharmacie Ekounou",             quartier:"Ekounou",          tel:"+237 677 88 99 00", lat:3.8350, lng:11.5450, ouvert:true  },
  { id:25, nom:"Pharmacie Nsam",                quartier:"Nsam",             tel:"+237 222 31 23 45", lat:3.8400, lng:11.5200, ouvert:true  },
  { id:26, nom:"Pharmacie Mfandena",            quartier:"Mfandena",         tel:"+237 699 45 67 89", lat:3.8870, lng:11.5320, ouvert:false },
  { id:27, nom:"Pharmacie Simbock",             quartier:"Simbock",          tel:"+237 677 23 45 67", lat:3.8250, lng:11.5020, ouvert:true  },
  { id:28, nom:"Pharmacie Nkomo",               quartier:"Nkomo",            tel:"+237 699 34 56 78", lat:3.8190, lng:11.4950, ouvert:true  },
  { id:29, nom:"Pharmacie Carrière",            quartier:"Carrière",         tel:"+237 222 22 56 78", lat:3.8830, lng:11.5150, ouvert:true  },
  { id:30, nom:"Pharmacie Pharmacam",           quartier:"Nlongkak",         tel:"+237 222 20 77 32", lat:3.8920, lng:11.5080, ouvert:true  },
  { id:31, nom:"Pharmacie Omnipharm",           quartier:"Bastos",           tel:"+237 222 21 89 01", lat:3.8860, lng:11.5210, ouvert:true  },
  { id:32, nom:"Pharmacie de l'Amitié",         quartier:"Tsinga",           tel:"+237 242 05 67 89", lat:3.8760, lng:11.5020, ouvert:false },
  { id:33, nom:"Pharmacie Santa Maria",         quartier:"Biyem-Assi",       tel:"+237 699 56 78 90", lat:3.8460, lng:11.5010, ouvert:true  },
  { id:34, nom:"Pharmacie Élite",               quartier:"Bastos",           tel:"+237 222 20 34 56", lat:3.8870, lng:11.5160, ouvert:true  },
  { id:35, nom:"Pharmacie de la Paix",          quartier:"Mvog-Ada",         tel:"+237 222 22 90 12", lat:3.8570, lng:11.5270, ouvert:true  },
  { id:36, nom:"Pharmacie Nylon",               quartier:"Nylon",            tel:"+237 677 12 23 34", lat:3.8940, lng:11.5360, ouvert:true  },
  { id:37, nom:"Pharmacie Camp Yaoundé",        quartier:"Camp Yaoundé",     tel:"+237 222 23 11 22", lat:3.8730, lng:11.5380, ouvert:false },
  { id:38, nom:"Pharmacie de la Gare",          quartier:"Gare Centrale",    tel:"+237 222 22 07 89", lat:3.8655, lng:11.5156, ouvert:true  },
  { id:39, nom:"Pharmacie Omnisanté",           quartier:"Cité Verte",       tel:"+237 655 78 90 12", lat:3.8510, lng:11.5080, ouvert:true  },
  { id:40, nom:"Pharmacie Marché Central",      quartier:"Marché Central",   tel:"+237 222 22 33 44", lat:3.8672, lng:11.5167, ouvert:true  },
  { id:41, nom:"Pharmacie Emana",               quartier:"Emana",            tel:"+237 699 78 89 90", lat:3.9100, lng:11.5450, ouvert:true  },
  { id:42, nom:"Pharmacie Mimboman",            quartier:"Mimboman",         tel:"+237 677 90 01 12", lat:3.8300, lng:11.5500, ouvert:true  },
  { id:43, nom:"Pharmacie Damas",               quartier:"Damas",            tel:"+237 699 01 12 23", lat:3.8580, lng:11.4920, ouvert:false },
  { id:44, nom:"Pharmacie Ahala",               quartier:"Ahala",            tel:"+237 677 11 22 33", lat:3.8080, lng:11.4980, ouvert:true  },
  { id:45, nom:"Pharmacie Étoa-Meki",           quartier:"Étoa-Meki",        tel:"+237 699 22 33 44", lat:3.8620, lng:11.5460, ouvert:true  },
];

// Stock démo pour inscription nouvelles pharmacies
const STOCK_DEMO = [
  { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:150, exp:"2027-06-01" },
  { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:900,  qte:5,   exp:"2026-08-15" },
  { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2500, qte:20, exp:"2027-01-20" },
  { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:350,  qte:80,  exp:"2026-12-10" },
  { nom:"Cotrimoxazole (TMP/SMX) 480mg",             cat:"Antibiotique",  prix:150,  qte:100, exp:"2027-02-14" },
  { nom:"Ibuprofène 400mg",                          cat:"Antidouleur",   prix:300,  qte:60,  exp:"2027-03-01" },
  { nom:"Vitamine C 500mg",                          cat:"Vitamines",     prix:100,  qte:200, exp:"2027-05-01" },
  { nom:"ORS (Sels de réhydratation orale)",         cat:"Gastro",        prix:100,  qte:0,   exp:"2027-01-01" },
  { nom:"Métronidazole 250mg",                       cat:"Antibiotique",  prix:300,  qte:7,   exp:"2026-09-05" },
  { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:400,  qte:30,  exp:"2027-04-01" },
];

// ══════════════════════════════════════════════════════════════════════════════
// 🌱 DONNÉES DE DÉMONSTRATION — Stocks variés par pharmacie
// Chaque pharmacie a son propre prix (reflète la réalité camerounaise)
// ══════════════════════════════════════════════════════════════════════════════
const DEMO_STOCKS = [
  {
    pharmacieIdx: 0, // Pharmacie Bastos
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:200, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2800, qte:15, exp:"2027-01-20" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:950,  qte:30,  exp:"2026-08-15" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:400,  qte:60,  exp:"2026-12-10" },
      { nom:"Ibuprofène 400mg",                          cat:"Antidouleur",   prix:350,  qte:80,  exp:"2027-03-01" },
      { nom:"Métronidazole 250mg",                       cat:"Antibiotique",  prix:350,  qte:40,  exp:"2026-09-05" },
      { nom:"Amlodipine 5mg",                            cat:"Cardio",        prix:700,  qte:25,  exp:"2027-07-01" },
      { nom:"Metformine 500mg",                          cat:"Diabète",       prix:600,  qte:50,  exp:"2027-05-01" },
      { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:450,  qte:35,  exp:"2027-04-01" },
      { nom:"Azithromycine 500mg (Zithromax)",           cat:"Antibiotique",  prix:2200, qte:10,  exp:"2026-10-01" },
      { nom:"Salbutamol (Ventoline) 100mcg spray",       cat:"Respiratoire",  prix:3200, qte:8,   exp:"2027-08-01" },
      { nom:"Insuline Actrapid 100UI/ml",                cat:"Diabète",       prix:5500, qte:5,   exp:"2026-11-01" },
    ]
  },
  {
    pharmacieIdx: 1, // Pharmacie du Centre
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:45,   qte:300, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2500, qte:25, exp:"2027-01-20" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:800,  qte:50,  exp:"2026-08-15" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:350,  qte:100, exp:"2026-12-10" },
      { nom:"Ciprofloxacine 500mg",                      cat:"Antibiotique",  prix:1600, qte:20,  exp:"2027-01-15" },
      { nom:"Cotrimoxazole (TMP/SMX) 480mg",             cat:"Antibiotique",  prix:150,  qte:120, exp:"2027-02-14" },
      { nom:"Diclofénac 50mg",                           cat:"Antidouleur",   prix:280,  qte:60,  exp:"2027-03-01" },
      { nom:"Amlodipine 5mg",                            cat:"Cardio",        prix:650,  qte:40,  exp:"2027-07-01" },
      { nom:"Vitamine C 500mg",                          cat:"Vitamines",     prix:100,  qte:250, exp:"2027-05-01" },
      { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:400,  qte:45,  exp:"2027-04-01" },
      { nom:"Ceftriaxone injectable 1g",                 cat:"Antibiotique",  prix:2800, qte:12,  exp:"2026-09-01" },
      { nom:"Artésunate + Amodiaquine (ASAQ) 100/270mg", cat:"Antipaludéen", prix:1900, qte:20,  exp:"2027-02-01" },
    ]
  },
  {
    pharmacieIdx: 2, // Pharmacie Obili
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:150, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2600, qte:18, exp:"2027-01-20" },
      { nom:"Amoxicilline 500mg gélules",                cat:"Antibiotique",  prix:1300, qte:25,  exp:"2026-09-15" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:300,  qte:70,  exp:"2026-12-10" },
      { nom:"Ibuprofène 200mg",                          cat:"Antidouleur",   prix:200,  qte:90,  exp:"2027-03-01" },
      { nom:"Metformine 500mg",                          cat:"Diabète",       prix:550,  qte:35,  exp:"2027-05-01" },
      { nom:"Fer + Acide folique",                       cat:"Vitamines",     prix:280,  qte:80,  exp:"2027-06-01" },
      { nom:"Albendazole 400mg",                         cat:"Gastro",        prix:220,  qte:60,  exp:"2027-04-01" },
      { nom:"Loratadine 10mg (antihistaminique)",        cat:"Respiratoire",  prix:320,  qte:45,  exp:"2027-07-01" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:820,  qte:8,   exp:"2026-08-15" },
    ]
  },
  {
    pharmacieIdx: 6, // Pharmacie Biyem-Assi
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:180, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2400, qte:30, exp:"2027-01-20" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:850,  qte:45,  exp:"2026-08-15" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:320,  qte:90,  exp:"2026-12-10" },
      { nom:"Cotrimoxazole (TMP/SMX) 480mg",             cat:"Antibiotique",  prix:140,  qte:130, exp:"2027-02-14" },
      { nom:"Métronidazole 250mg",                       cat:"Antibiotique",  prix:280,  qte:55,  exp:"2026-09-05" },
      { nom:"Ibuprofène 400mg",                          cat:"Antidouleur",   prix:280,  qte:70,  exp:"2027-03-01" },
      { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:380,  qte:40,  exp:"2027-04-01" },
      { nom:"Vitamines B complexe",                      cat:"Vitamines",     prix:220,  qte:100, exp:"2027-05-01" },
      { nom:"Amlodipine 5mg",                            cat:"Cardio",        prix:600,  qte:30,  exp:"2027-07-01" },
      { nom:"Metformine 500mg",                          cat:"Diabète",       prix:520,  qte:40,  exp:"2027-05-01" },
      { nom:"Phénobarbital 100mg",                       cat:"Neurologie",    prix:180,  qte:25,  exp:"2027-03-01" },
    ]
  },
  {
    pharmacieIdx: 8, // Pharmacie Essos
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:55,   qte:120, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2700, qte:12, exp:"2027-01-20" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:880,  qte:20,  exp:"2026-08-15" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:380,  qte:50,  exp:"2026-12-10" },
      { nom:"Ciprofloxacine 500mg",                      cat:"Antibiotique",  prix:1700, qte:15,  exp:"2027-01-15" },
      { nom:"Ibuprofène 400mg",                          cat:"Antidouleur",   prix:320,  qte:50,  exp:"2027-03-01" },
      { nom:"Captopril 25mg",                            cat:"Cardio",        prix:450,  qte:35,  exp:"2027-06-01" },
      { nom:"Glibenclamide 5mg",                         cat:"Diabète",       prix:350,  qte:45,  exp:"2027-04-01" },
      { nom:"Vitamine C 500mg",                          cat:"Vitamines",     prix:120,  qte:180, exp:"2027-05-01" },
      { nom:"Fer + Acide folique",                       cat:"Vitamines",     prix:260,  qte:70,  exp:"2027-06-01" },
    ]
  },
  {
    pharmacieIdx: 9, // Pharmacie Nlongkak
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:220, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2500, qte:22, exp:"2027-01-20" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:900,  qte:35,  exp:"2026-08-15" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:350,  qte:80,  exp:"2026-12-10" },
      { nom:"Azithromycine 500mg (Zithromax)",           cat:"Antibiotique",  prix:2100, qte:8,   exp:"2026-10-01" },
      { nom:"Métronidazole 250mg",                       cat:"Antibiotique",  prix:300,  qte:60,  exp:"2026-09-05" },
      { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:420,  qte:30,  exp:"2027-04-01" },
      { nom:"Amlodipine 10mg",                           cat:"Cardio",        prix:1000, qte:20,  exp:"2027-07-01" },
      { nom:"Insuline NPH 100UI/ml",                     cat:"Diabète",       prix:5200, qte:4,   exp:"2026-11-01" },
      { nom:"Cotrimoxazole (TMP/SMX) 480mg",             cat:"Antibiotique",  prix:160,  qte:110, exp:"2027-02-14" },
      { nom:"Salbutamol (Ventoline) 100mcg spray",       cat:"Respiratoire",  prix:3100, qte:6,   exp:"2027-08-01" },
    ]
  },
  {
    pharmacieIdx: 10, // Pharmacie Cité Verte
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:45,   qte:250, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2450, qte:28, exp:"2027-01-20" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:820,  qte:55,  exp:"2026-08-15" },
      { nom:"Ibuprofène 400mg",                          cat:"Antidouleur",   prix:260,  qte:90,  exp:"2027-03-01" },
      { nom:"Diclofénac 50mg",                           cat:"Antidouleur",   prix:250,  qte:65,  exp:"2027-03-01" },
      { nom:"Cotrimoxazole (TMP/SMX) 480mg",             cat:"Antibiotique",  prix:145,  qte:140, exp:"2027-02-14" },
      { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:390,  qte:50,  exp:"2027-04-01" },
      { nom:"Metformine 850mg",                          cat:"Diabète",       prix:750,  qte:30,  exp:"2027-05-01" },
      { nom:"Vitamine C 500mg",                          cat:"Vitamines",     prix:100,  qte:200, exp:"2027-05-01" },
      { nom:"Kétoconazole crème 2%",                     cat:"Dermatologie",  prix:1600, qte:15,  exp:"2027-06-01" },
    ]
  },
  {
    pharmacieIdx: 13, // Pharmacie Le Cygne
    stock: [
      { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:200, exp:"2027-06-01" },
      { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2600, qte:20, exp:"2027-01-20" },
      { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:360,  qte:75,  exp:"2026-12-10" },
      { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:870,  qte:40,  exp:"2026-08-15" },
      { nom:"Ceftriaxone injectable 1g",                 cat:"Antibiotique",  prix:2600, qte:10,  exp:"2026-09-01" },
      { nom:"Losartan 50mg",                             cat:"Cardio",        prix:1300, qte:25,  exp:"2027-08-01" },
      { nom:"Insuline Actrapid 100UI/ml",                cat:"Diabète",       prix:5300, qte:6,   exp:"2026-11-01" },
      { nom:"Béclométhasone spray 250mcg",               cat:"Respiratoire",  prix:5200, qte:4,   exp:"2027-09-01" },
      { nom:"Métronidazole 250mg",                       cat:"Antibiotique",  prix:310,  qte:45,  exp:"2026-09-05" },
      { nom:"Oméprazole 40mg injectable",                cat:"Gastro",        prix:2100, qte:8,   exp:"2027-04-01" },
    ]
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// 🛡️ SYSTÈME SIGNALEMENT STOCK INCORRECT
// ══════════════════════════════════════════════════════════════════════════════
async function signalerErreurStock(pharmacieId, pharmacieNom, medicamentNom, fbReady) {
  if(!fbReady) return;
  const ref = getDB().ref("signalements/"+pharmacieId);
  const snap = await ref.once("value");
  const existing = snap.val()||{};
  // Éviter doublons : max 1 signalement par médicament par heure
  const key = medicamentNom.replace(/[^a-zA-Z0-9]/g,"_");
  const lastTime = existing[key]?.lastSignal||0;
  if(Date.now()-lastTime < 3600000) return "already";
  await ref.child(key).set({
    medicament: medicamentNom,
    pharmacie: pharmacieNom,
    pharmacieId,
    count: (existing[key]?.count||0)+1,
    lastSignal: Date.now(),
  });
  // Incrémenter score crédibilité pharmacie
  await getDB().ref("pharmacies/"+pharmacieId+"/signalements").transaction(v=>(v||0)+1);
  return "ok";
}

// ══════════════════════════════════════════════════════════════════════════════
// ⏰ NIVEAU 2 — RAPPEL AUTOMATIQUE 20H (côté pharmacie)
// ══════════════════════════════════════════════════════════════════════════════
function useRappelStock(user, stock) {
  useEffect(()=>{
    if(!user||user.role!=="pharmacie")return;
    const checkRappel = ()=>{
      const now = new Date();
      const h = now.getHours();
      // Entre 19h30 et 20h30
      if(h>=19 && h<21) {
        const lastRappel = localStorage.getItem("lastRappel_"+user.uid);
        const today = now.toDateString();
        if(lastRappel!==today) {
          localStorage.setItem("lastRappel_"+user.uid, today);
          // Afficher notification dans l'app
          if(window.Notification && Notification.permission==="granted") {
            new Notification("⏰ Mediconline — Rappel stock", {
              body: "N'oubliez pas de mettre à jour votre stock avant de fermer !",
              icon: "/favicon.ico"
            });
          }
          // Stocker dans Firebase pour affichage dans dashboard
          getDB().ref("rappels/"+user.uid).push({
            message:"Rappel : mettez à jour votre stock avant de fermer !",
            lu: false,
            date: Date.now()
          });
        }
      }
    };
    const interval = setInterval(checkRappel, 60000); // vérifier chaque minute
    checkRappel(); // vérifier immédiatement
    return ()=>clearInterval(interval);
  },[user]);
}

function useRappelNotifications(user, fbReady) {
  const [rappels, setRappels] = useState([]);
  useEffect(()=>{
    if(!user||!fbReady)return;
    // Demander permission notifications
    if(window.Notification && Notification.permission==="default") {
      Notification.requestPermission();
    }
    const r = getDB().ref("rappels/"+user.uid);
    r.orderByChild("lu").equalTo(false).on("value", snap=>{
      if(snap.exists()) {
        setRappels(Object.entries(snap.val()).map(([id,d])=>({id,...d})));
      } else setRappels([]);
    });
    return()=>r.off();
  },[user,fbReady]);
  const marquerLu = async(id)=>{
    await getDB().ref("rappels/"+user.uid+"/"+id).update({lu:true});
  };
  return {rappels, marquerLu};
}

// Calcul distance GPS (formule Haversine)
function calculerDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
    Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function formatDistance(km) {
  return km < 1 ? Math.round(km*1000)+"m" : km.toFixed(1)+"km";
}


// ══════════════════════════════════════════════════════════════════════════════
// 🕐 LOGIQUE PHARMACIE DE GARDE
// ══════════════════════════════════════════════════════════════════════════════
function isOuvertMaintenant(ouverture="08:00", fermeture="22:00") {
  const now = new Date();
  const h = now.getHours()*60 + now.getMinutes();
  const [oh,om] = ouverture.split(":").map(Number);
  const [fh,fm] = fermeture.split(":").map(Number);
  const open = oh*60+om, close = fh*60+fm;
  if(close < open) return h >= open || h < close; // nuit (ex: 20h-06h)
  return h >= open && h < close;
}

function getStatutPharmacie(ph) {
  const ouvert = ph.ouvert !== false;
  if(!ouvert) return { label:"Fermée", color:"#E63946", bg:"#FDECEA", garde:false };
  const ouvertureMaintenant = isOuvertMaintenant(ph.ouverture||"08:00", ph.fermeture||"22:00");
  const now = new Date();
  const h = now.getHours();
  if(h >= 20 || h < 6) return { label:"🌙 Garde de nuit", color:"#7B2FBE", bg:"#F3E8FF", garde:true };
  if(!ouvertureMaintenant) return { label:"Fermée maintenant", color:"#F4A261", bg:"#FFF4E6", garde:false };
  return { label:"✓ Ouverte", color:"#1A8A45", bg:"#E6FAF0", garde:false };
}

function AppelButton({ tel, size="sm" }) {
  if(!tel) return null;
  return (
    <a href={"tel:"+tel} className={"btn btn-"+(size==="lg"?"primary":"secondary")+" btn-"+size}
      style={{textDecoration:"none", display:"inline-flex", alignItems:"center", gap:6}}
      onClick={e=>e.stopPropagation()}>
      📞 {size==="lg" ? tel : "Appeler"}
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🌙 PAGE PHARMACIES DE GARDE
// ══════════════════════════════════════════════════════════════════════════════
function PageGarde({ setPage }) {
  const fbReady = useFirebaseReady();
  const [extraPharma, setExtraPharma] = useState([]);
  const [heure, setHeure] = useState(new Date());

  useEffect(()=>{ const t=setInterval(()=>setHeure(new Date()),30000); return()=>clearInterval(t); },[]);
  useEffect(()=>{
    if(!fbReady)return;
    const r=getDB().ref("pharmacies");
    r.on("value",snap=>{if(snap.exists())setExtraPharma(Object.entries(snap.val()).map(([uid,ph])=>({uid,...ph})));});
    return()=>r.off();
  },[fbReady]);

  const allPh = [...PHARMACIES_YAOUNDE, ...extraPharma];
  const gardes   = allPh.filter(ph=>{ const s=getStatutPharmacie(ph); return s.garde; });
  const ouvertes = allPh.filter(ph=>{ const s=getStatutPharmacie(ph); return !s.garde && s.label==="✓ Ouverte"; });
  const fermees  = allPh.filter(ph=>{ const s=getStatutPharmacie(ph); return s.label==="Fermée maintenant"||s.label==="Fermée"; });

  const now = heure;
  const isNuit = now.getHours()>=20||now.getHours()<6;

  return (
    <div className="main">
      <div className="page-toprow mb20">
        <div>
          <div className="page-title">🌙 Pharmacies de garde</div>
          <div className="page-sub">
            {now.toLocaleTimeString("fr-CM",{hour:"2-digit",minute:"2-digit"})} · {allPh.length} pharmacies à Yaoundé
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setPage("accueil")}>← Retour</button>
      </div>

      {isNuit && gardes.length===0 && (
        <div className="alert mb20" style={{background:"#F3E8FF",border:"1px solid #C084FC",color:"#7B2FBE"}}>
          <span className="alert-ico">🌙</span>
          <span><strong>Nuit pharmaceutique</strong> — Les pharmacies de garde ci-dessous assurent la permanence cette nuit.</span>
        </div>
      )}

      {/* GARDES DE NUIT */}
      {gardes.length > 0 && (
        <div className="card mb20" style={{border:"2px solid #7B2FBE"}}>
          <div className="card-header">
            <div className="card-title" style={{color:"#7B2FBE"}}>🌙 Gardes de nuit ({gardes.length})</div>
            <span className="tag" style={{background:"#F3E8FF",color:"#7B2FBE"}}>Ouvertes maintenant</span>
          </div>
          {gardes.map((ph,i)=>(
            <div key={ph.uid||ph.id||i} className="ph-row" style={{padding:"14px 0"}}>
              <div className="ph-ico" style={{background:"#F3E8FF"}}>🌙</div>
              <div className="ph-info">
                <div className="ph-name">{ph.nom}</div>
                <div className="ph-dist">📍 {ph.quartier}</div>
                {ph.ouverture&&<div className="ph-dist">🕐 {ph.ouverture} – {ph.fermeture||"06:00"}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                <AppelButton tel={ph.tel} size="sm"/>
                <button className="btn btn-secondary btn-sm"
                  onClick={()=>window.open(`https://www.google.com/maps/dir//${ph.lat},${ph.lng}`,"_blank")}>
                  🗺 Itinéraire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OUVERTES */}
      {ouvertes.length > 0 && (
        <div className="card mb20">
          <div className="card-header">
            <div className="card-title">✅ Ouvertes en ce moment ({ouvertes.length})</div>
            <span className="tag tag-green">Disponibles</span>
          </div>
          {ouvertes.map((ph,i)=>(
            <div key={ph.uid||ph.id||i} className="ph-row" style={{padding:"12px 0"}}>
              <div className="ph-ico">🏥</div>
              <div className="ph-info">
                <div className="ph-name">{ph.nom}</div>
                <div className="ph-dist">📍 {ph.quartier} · 🕐 {ph.ouverture||"08:00"}–{ph.fermeture||"22:00"}</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <AppelButton tel={ph.tel} size="sm"/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FERMÉES */}
      {fermees.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{color:"var(--grey-text)"}}>Fermées ({fermees.length})</div>
          </div>
          {fermees.slice(0,8).map((ph,i)=>(
            <div key={ph.uid||ph.id||i} className="ph-row" style={{padding:"10px 0",opacity:0.6}}>
              <div className="ph-ico" style={{background:"#F4F6F8"}}>🏥</div>
              <div className="ph-info">
                <div className="ph-name">{ph.nom}</div>
                <div className="ph-dist">📍 {ph.quartier} · Ouvre à {ph.ouverture||"08:00"}</div>
              </div>
              <AppelButton tel={ph.tel} size="sm"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════════
// 🗺 COMPOSANT CARTE LEAFLET
// ══════════════════════════════════════════════════════════════════════════════
function CartePharmacies({ pharmacies, userPos, selectedId, onSelect, height="400px" }) {
  const mapRef = useRef(null); const mapInstance = useRef(null); const markersRef = useRef([]);
  const leafletReady = useLeaflet();
  useEffect(()=>{
    if(!leafletReady||!mapRef.current||mapInstance.current)return;
    const L=window.L;
    const map=L.map(mapRef.current).setView([3.8667,11.5167],13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
    mapInstance.current=map;
  },[leafletReady]);
  useEffect(()=>{
    if(!leafletReady||!mapInstance.current)return;
    const L=window.L; const map=mapInstance.current;
    markersRef.current.forEach(m=>map.removeLayer(m)); markersRef.current=[];
    if(userPos){
      const icon=L.divIcon({html:`<div style="background:#0A7B6C;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,iconSize:[14,14],iconAnchor:[7,7],className:""});
      L.marker(userPos,{icon}).addTo(map).bindPopup("<b>📍 Votre position</b>"); map.setView(userPos,14);
    }
    pharmacies.forEach(ph=>{
      if(!ph.lat||!ph.lng)return;
      const sel=ph.id===selectedId||ph.uid===selectedId;
      const color=sel?"#0A7B6C":(ph.ouvert!==false?"#1A4A6B":"#9CA3AF"); const size=sel?44:34;
      const icon=L.divIcon({html:`<div style="background:${color};color:white;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${sel?"1.2":"0.9"}rem;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);cursor:pointer">🏥</div>`,iconSize:[size,size],iconAnchor:[size/2,size/2],className:""});
      const m=L.marker([ph.lat,ph.lng],{icon}).addTo(map).bindPopup(`<div style="font-family:sans-serif;min-width:160px"><b style="color:#0D2B3E">${ph.nom}</b><br/><small style="color:#6B7C93">📍 ${ph.quartier}</small><br/><span style="background:${ph.ouvert!==false?"#E6FAF0":"#FDECEA"};color:${ph.ouvert!==false?"#1A8A45":"#E63946"};padding:2px 8px;border-radius:99px;font-size:0.7rem;font-weight:600">${ph.ouvert!==false?"✓ Ouverte":"✗ Fermée"}</span>${ph.tel?`<br/><small style="color:#0A7B6C">📞 ${ph.tel}</small>`:""}</div>`).on("click",()=>onSelect&&onSelect(ph));
      markersRef.current.push(m);
    });
  },[leafletReady,pharmacies,selectedId,userPos]);
  if(!leafletReady)return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",background:"#f4f6f8",borderRadius:14}}><div className="loading"><div className="spinner"></div> Chargement carte...</div></div>;
  return <div ref={mapRef} style={{height,width:"100%",borderRadius:14,overflow:"hidden"}}/>;
}

// ══════════════════════════════════════════════════════════════════════════════
// 🗺 PAGE CARTE
// ══════════════════════════════════════════════════════════════════════════════
function PageCarte() {
  const fbReady=useFirebaseReady();
  const [userPos,setUserPos]=useState(null); const [locLoading,setLocLoading]=useState(false);
  const [selectedPh,setSelectedPh]=useState(null); const [extraPharma,setExtraPharma]=useState([]);
  useEffect(()=>{
    if(!fbReady)return;
    const r=getDB().ref("pharmacies");
    r.on("value",snap=>{if(snap.exists()){setExtraPharma(Object.entries(snap.val()).map(([uid,ph])=>({uid,...ph,lat:ph.lat||3.8667+(Math.random()-0.5)*0.08,lng:ph.lng||11.5167+(Math.random()-0.5)*0.08})));}});
    return()=>r.off();
  },[fbReady]);
  const localiser=()=>{setLocLoading(true);if(!navigator.geolocation){alert("Géolocalisation non supportée.");setLocLoading(false);return;}navigator.geolocation.getCurrentPosition(pos=>{setUserPos([pos.coords.latitude,pos.coords.longitude]);setLocLoading(false);},()=>{setUserPos([3.8667,11.5167]);setLocLoading(false);});};
  const allPh=[...PHARMACIES_YAOUNDE,...extraPharma];
  return(
    <div className="main">
      <div className="page-toprow mb20">
        <div><div className="page-title">🗺 Carte des Pharmacies</div><div className="page-sub">{allPh.length} pharmacies · Yaoundé</div></div>
        <button className="btn btn-primary" onClick={localiser} disabled={locLoading}>{locLoading?"⏳...":"📍 Me localiser"}</button>
      </div>
      {userPos&&<div className="alert alert-success mb16"><span className="alert-ico">📍</span><span>Position détectée !</span></div>}
      <div className="card mb20" style={{padding:0,overflow:"hidden"}}>
        <CartePharmacies pharmacies={allPh} userPos={userPos} selectedId={selectedPh?.id||selectedPh?.uid} onSelect={setSelectedPh} height="420px"/>
      </div>
      {selectedPh&&<div className="card mb20" style={{border:"2px solid var(--teal)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div className="ph-ico" style={{width:48,height:48,fontSize:"1.4rem"}}>🏥</div>
          <div style={{flex:1}}><div className="ph-name" style={{fontSize:"1rem"}}>{selectedPh.nom}</div><div className="ph-dist">📍 {selectedPh.quartier} · {selectedPh.tel}</div></div>
          <span className={"stock-tag "+(selectedPh.ouvert!==false?"stock-ok":"stock-out")}>{selectedPh.ouvert!==false?"Ouverte":"Fermée"}</span>
        </div>
        <div className="btn-row" style={{marginTop:14}}>
          <button className="btn btn-primary btn-sm" onClick={()=>window.open(`https://www.google.com/maps/dir//${selectedPh.lat},${selectedPh.lng}`,"_blank")}>🗺 Itinéraire Google Maps</button>
          {selectedPh.tel&&<button className="btn btn-secondary btn-sm" onClick={()=>window.open("tel:"+selectedPh.tel)}>📞 Appeler</button>}
        </div>
      </div>}
      <div className="card">
        <div className="card-header"><div className="card-title">Toutes les pharmacies ({allPh.length})</div><span className="tag tag-green">{allPh.filter(p=>p.ouvert!==false).length} ouvertes</span></div>
        <div className="ph-list">{allPh.map((ph,i)=>(
          <div key={ph.uid||ph.id||i} className={"ph-row"+(selectedPh?.id===ph.id||selectedPh?.uid===ph.uid?" ph-row-active":"")} onClick={()=>setSelectedPh(ph)} style={{cursor:"pointer"}}>
            <div className="ph-ico">🏥</div>
            <div className="ph-info"><div className="ph-name">{ph.nom}</div><div className="ph-dist">📍 {ph.quartier} · {ph.tel}</div></div>
            <span className={"stock-tag "+(ph.ouvert!==false?"stock-ok":"stock-out")}>{ph.ouvert!==false?"Ouverte":"Fermée"}</span>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🔐 AUTH SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function AuthScreen({ onAuth }) {
  const fbReady = useFirebaseReady();
  const [mode,setMode]       = useState("choix");
  const [email,setEmail]     = useState("");
  const [password,setPassword] = useState("");
  const [nom,setNom]         = useState("");
  const [tel,setTel]         = useState("");
  const [quartier,setQuartier] = useState("");
  const [adresse,setAdresse] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState("");
  const [step,setStep]       = useState(1); // étapes inscription

  const QUARTIERS = ["Bastos","Centre-ville","Obili","Tsinga","Madagascar","Biyem-Assi",
    "Melen","Essos","Nlongkak","Cité Verte","Odza","Mvog-Mbi","Mendong","Ekounou",
    "Nkomo","Emana","Mimboman","Nsam","Ngousso","Mokolo","Hippodrome","Nylon",
    "Simbock","Nkol-Eton","Mvog-Ada","Ahala","Damas","Nkol-Bisson","Mfandena"];

  const ERREURS_FR = {
    "auth/email-already-in-use": "Cet email est déjà utilisé. Connectez-vous à la place.",
    "auth/weak-password":        "Mot de passe trop court (minimum 6 caractères).",
    "auth/invalid-credential":   "Email ou mot de passe incorrect. Vérifiez et réessayez.",
    "auth/user-not-found":       "Aucun compte trouvé avec cet email.",
    "auth/wrong-password":       "Mot de passe incorrect.",
    "auth/invalid-email":        "Format d'email invalide.",
    "auth/too-many-requests":    "Trop de tentatives. Attendez quelques minutes.",
    "auth/network-request-failed":"Pas de connexion internet. Vérifiez votre réseau.",
  };

  const handleLogin = async()=>{
    if(!email||!password){setError("Email et mot de passe obligatoires.");return;}
    setError(""); setLoading(true);
    try{
      const cred = await getAuth().signInWithEmailAndPassword(email,password);
      const snap = await getDB().ref("users/"+cred.user.uid).once("value");
      const d    = snap.val()||{};
      if(d.role && d.role!=="pharmacie"){
        setError("Ce compte n'est pas un compte pharmacie.");
        setLoading(false); return;
      }
      const phSnap = await getDB().ref("pharmacies/"+cred.user.uid).once("value");
      const ph = phSnap.val()||{};
      onAuth({uid:cred.user.uid, email, role:"pharmacie", nomPharmacie:d.nom||ph.nom||"Ma Pharmacie", tel:ph.tel||""});
    }catch(e){ setError(ERREURS_FR[e.code]||"Erreur : "+e.message); }
    setLoading(false);
  };

  const handleRegister = async()=>{
    // Validations
    if(!nom.trim()){setError("Le nom de la pharmacie est obligatoire.");return;}
    if(!tel.trim()){setError("Le numéro de téléphone est obligatoire.");return;}
    if(!quartier){setError("Veuillez sélectionner votre quartier.");return;}
    if(!email.trim()){setError("L'email est obligatoire.");return;}
    if(!password||password.length<6){setError("Mot de passe minimum 6 caractères.");return;}
    setError(""); setLoading(true);
    try{
      const cred = await getAuth().createUserWithEmailAndPassword(email,password);
      const uid  = cred.user.uid;
      // Coordonnées approx selon quartier
      const coordsMap = {
        "Bastos":{lat:3.8820,lng:11.5050},"Centre-ville":{lat:3.8667,lng:11.5167},
        "Obili":{lat:3.8550,lng:11.5080},"Biyem-Assi":{lat:3.8450,lng:11.4980},
        "Essos":{lat:3.8710,lng:11.5350},"Nlongkak":{lat:3.8780,lng:11.5220},
        "Melen":{lat:3.8620,lng:11.5290},"Mvog-Ada":{lat:3.8480,lng:11.5280},
        "Tsinga":{lat:3.8750,lng:11.5100},"Madagascar":{lat:3.8600,lng:11.5200},
      };
      const coords = coordsMap[quartier]||{lat:3.8667+(Math.random()-0.5)*0.05,lng:11.5167+(Math.random()-0.5)*0.05};

      // Créer le compte utilisateur
      await getDB().ref("users/"+uid).set({
        email, role:"pharmacie", nom:nom.trim(), tel:tel.trim(), createdAt:Date.now()
      });
      // Créer la fiche pharmacie — statut "en_attente" par défaut
      await getDB().ref("pharmacies/"+uid).set({
        nom:       nom.trim(),
        quartier:  quartier,
        adresse:   adresse.trim()||(quartier+", Yaoundé"),
        tel:       tel.trim(),
        ouvert:    false,
        adminUid:  uid,
        lat:       coords.lat,
        lng:       coords.lng,
        createdAt: Date.now(),
        statut:    "en_attente",   // en_attente | verifie | suspendu
        verified:  false,
        isReal:    true,
      });
      // Notifier Bryn (admin) qu'une nouvelle pharmacie attend validation
      await getDB().ref("admin_notifications").push({
        type:      "nouvelle_pharmacie",
        pharmacieId: uid,
        nom:       nom.trim(),
        quartier:  quartier,
        tel:       tel.trim(),
        email:     email,
        date:      Date.now(),
        lu:        false,
      });
      onAuth({uid, email, role:"pharmacie", nomPharmacie:nom.trim(), tel:tel.trim(), statut:"en_attente"});
    }catch(e){ setError(ERREURS_FR[e.code]||"Erreur : "+e.message); }
    setLoading(false);
  };

  // ── Écran de choix ────────────────────────────────────────────────────────
  if(mode==="choix") return(
    <div className="auth-screen"><div className="auth-card">
      <div className="auth-logo">Medic<span>online</span></div>
      <div className="auth-sub">📍 Yaoundé — Espace Pharmacie</div>
      <div style={{textAlign:"center",margin:"24px 0 8px"}}>
        <div style={{fontSize:"2.5rem",marginBottom:8}}>🏥</div>
        <div style={{fontFamily:"Syne",fontWeight:800,fontSize:"1.1rem",color:"var(--navy)"}}>Bienvenue sur Mediconline</div>
        <div style={{color:"var(--grey-text)",fontSize:"0.83rem",marginTop:6,lineHeight:1.6}}>
          Rendez votre pharmacie visible auprès de milliers de patients à Yaoundé.<br/>
          Gratuit · Rapide · En temps réel
        </div>
      </div>
      <button className="btn btn-primary btn-full" style={{marginBottom:12}} onClick={()=>setMode("register")}>
        🏥 Inscrire ma pharmacie — Gratuit
      </button>
      <button className="btn btn-secondary btn-full" onClick={()=>setMode("login")}>
        🔐 J'ai déjà un compte
      </button>
    </div></div>
  );

  // ── Connexion ─────────────────────────────────────────────────────────────
  if(mode==="login") return(
    <div className="auth-screen"><div className="auth-card">
      <div className="auth-logo">Medic<span>online</span></div>
      <div className="auth-sub">🔐 Connexion Pharmacie</div>
      {error&&<div className="alert alert-error mb16"><span className="alert-ico">⚠️</span><span>{error}</span></div>}
      <div className="form-group">
        <label className="form-label">Email *</label>
        <input className="form-input" type="email" placeholder="votre@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
      </div>
      <div className="form-group">
        <label className="form-label">Mot de passe *</label>
        <input className="form-input" type="password" placeholder="Votre mot de passe" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
      </div>
      <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading||!fbReady}>
        {loading?"⏳ Connexion en cours...":"🔐 Se connecter"}
      </button>
      <div className="auth-footer">
        <span>Pas de compte ? <b style={{cursor:"pointer",color:"var(--teal)"}} onClick={()=>{setMode("register");setError("");}}>Inscrire ma pharmacie</b></span>
      </div>
      <div style={{textAlign:"center",marginTop:8}}>
        <span style={{fontSize:"0.75rem",color:"var(--grey-text)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setMode("choix");setError("");}}>← Retour</span>
      </div>
    </div></div>
  );

  // ── Inscription en 2 étapes ───────────────────────────────────────────────
  return(
    <div className="auth-screen"><div className="auth-card" style={{maxHeight:"90vh",overflowY:"auto"}}>
      <div className="auth-logo">Medic<span>online</span></div>
      <div className="auth-sub">🏥 Inscription Pharmacie</div>

      {/* Indicateur d'étapes */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,margin:"12px 0 20px"}}>
        {[1,2].map(s=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{
              width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",
              justifyContent:"center",fontWeight:700,fontSize:"0.8rem",
              background:step>=s?"var(--teal)":"#E5E7EB",
              color:step>=s?"white":"#9CA3AF"
            }}>{step>s?"✓":s}</div>
            {s<2&&<div style={{width:40,height:2,background:step>s?"var(--teal)":"#E5E7EB"}}/>}
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:"0.78rem",color:"var(--grey-text)",marginBottom:16}}>
        {step===1?"Informations de la pharmacie":"Accès et sécurité"}
      </div>

      {error&&<div className="alert alert-error mb16"><span className="alert-ico">⚠️</span><span>{error}</span></div>}

      {step===1&&(<>
        <div className="form-group">
          <label className="form-label">Nom de la pharmacie *</label>
          <input className="form-input" placeholder="ex: Pharmacie Bastos" value={nom} onChange={e=>setNom(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Numéro de téléphone *</label>
          <input className="form-input" type="tel" placeholder="ex: 699 123 456" value={tel} onChange={e=>setTel(e.target.value)}/>
          <div style={{fontSize:"0.72rem",color:"var(--grey-text)",marginTop:4}}>Les patients pourront vous appeler depuis l'app</div>
        </div>
        <div className="form-group">
          <label className="form-label">Quartier *</label>
          <select className="form-input" value={quartier} onChange={e=>setQuartier(e.target.value)}>
            <option value="">Sélectionner votre quartier...</option>
            {QUARTIERS.map(q=><option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Adresse précise <span style={{color:"var(--grey-text)",fontWeight:400}}>(optionnel)</span></label>
          <input className="form-input" placeholder="ex: Face au marché, Rue principale" value={adresse} onChange={e=>setAdresse(e.target.value)}/>
        </div>
        <button className="btn btn-primary btn-full" onClick={()=>{
          if(!nom.trim()){setError("Le nom de la pharmacie est obligatoire.");return;}
          if(!tel.trim()){setError("Le numéro de téléphone est obligatoire.");return;}
          if(!quartier){setError("Veuillez sélectionner votre quartier.");return;}
          setError(""); setStep(2);
        }}>Suivant →</button>
      </>)}

      {step===2&&(<>
        <div style={{background:"#F0FDF4",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:"0.8rem",color:"#065F46"}}>
          ✅ <strong>{nom}</strong> · {quartier} · {tel}
          <span style={{cursor:"pointer",color:"var(--teal)",marginLeft:8,fontSize:"0.72rem"}} onClick={()=>setStep(1)}>Modifier</span>
        </div>
        <div className="form-group">
          <label className="form-label">Email professionnel *</label>
          <input className="form-input" type="email" placeholder="pharmacie@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          <div style={{fontSize:"0.72rem",color:"var(--grey-text)",marginTop:4}}>Pour vous connecter à Mediconline</div>
        </div>
        <div className="form-group">
          <label className="form-label">Mot de passe *</label>
          <input className="form-input" type="password" placeholder="Minimum 6 caractères" value={password} onChange={e=>setPassword(e.target.value)}/>
        </div>
        <div style={{background:"#EFF6FF",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:"0.77rem",color:"#1E40AF",lineHeight:1.6}}>
          🔒 Vos données sont sécurisées avec Firebase.<br/>
          Mediconline ne partage jamais vos informations.
        </div>
        <button className="btn btn-primary btn-full" onClick={handleRegister} disabled={loading||!fbReady}>
          {loading?"⏳ Création du compte...":(fbReady?"✅ Créer mon compte et démarrer":"⏳ Connexion Firebase...")}
        </button>
        <div style={{textAlign:"center",marginTop:8}}>
          <span style={{fontSize:"0.75rem",color:"var(--grey-text)",cursor:"pointer"}} onClick={()=>setStep(1)}>← Retour</span>
        </div>
      </>)}

      <div className="auth-footer">
        <span>Déjà un compte ? <b style={{cursor:"pointer",color:"var(--teal)"}} onClick={()=>{setMode("login");setError("");}}>Se connecter</b></span>
      </div>
    </div></div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🏠 ACCUEIL PATIENT
// ══════════════════════════════════════════════════════════════════════════════
function AccueilPatient({ setPage, setRecherche, isDemoMode }) {
  const fbReady=useFirebaseReady();
  const [query,setQuery]=useState(""); const [catActive,setCatActive]=useState("Tous"); const [suggestions,setSuggestions]=useState([]); const [extraPharma,setExtraPharma]=useState([]);
  useEffect(()=>{if(!fbReady)return;const r=getDB().ref("pharmacies");r.on("value",snap=>{if(snap.exists())setExtraPharma(Object.entries(snap.val()).map(([uid,ph])=>({uid,...ph})));});return()=>r.off();},[fbReady]);
  const handleInput=v=>{setQuery(v);setSuggestions(v.length>1?rechercherFloue(v,7):[]);};
  const rechercher=nom=>{const q=nom||query;if(!q.trim())return;setRecherche(q);setPage("resultats");setSuggestions([]);};
  const filtered=catActive==="Tous"?CATALOGUE_MEDICAMENTS:CATALOGUE_MEDICAMENTS.filter(m=>m.cat===catActive);
  const allPh=[...PHARMACIES_YAOUNDE,...extraPharma];
  return(
    <div className="main">
      <div className="hero">
        <h1>Médicaments à Yaoundé<br/><span>au meilleur prix</span></h1>
        <p>Comparez les prix dans {allPh.length}+ pharmacies · {CATALOGUE_MEDICAMENTS.length}+ médicaments · Stocks en temps réel</p>
        <div className="search-row">
          <div className="search-input-wrap"><span className="search-ico">🔍</span><input value={query} onChange={e=>handleInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&rechercher()} placeholder="Ex: Coartem, Amoxicilline, Insuline..."/></div>
          <button className="btn-search" onClick={()=>rechercher()}>Rechercher</button>
          {suggestions.length>0&&(
            <div className="suggestions">
              {suggestions.map(s=>(
                <div key={s.id} className="suggestion-item" onClick={()=>rechercher(s.nom)}>
                  <span>{s.emoji}</span>
                  <span style={{flex:1,fontSize:"0.82rem"}}>
                    {s.nom}
                    {s.score<75&&<span style={{fontSize:"0.68rem",color:"#9CA3AF",marginLeft:4,fontStyle:"italic"}}> — vouliez-vous dire ?</span>}
                  </span>
                  <span className="tag tag-blue">{s.cat}</span>
                  <span style={{fontSize:"0.72rem",color:"var(--teal)",fontWeight:700,marginLeft:8,whiteSpace:"nowrap"}}>~{s.prixRef} F</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid-4 mb24">
        {[{ico:"🏥",num:allPh.length+"+",lbl:"Pharmacies à Yaoundé",bg:"#EBF4FF"},{ico:"💊",num:CATALOGUE_MEDICAMENTS.length+"+",lbl:"Médicaments référencés",bg:"#E6FAF0"},{ico:"🗺",num:"Carte",lbl:"Localisation temps réel",bg:"#FFF4E6",click:()=>setPage("carte")},{ico:"🌙",num:"Garde",lbl:"Pharmacies de garde",bg:"#F3E8FF",click:()=>setPage("garde")}].map((s,i)=>(
          <div key={i} className="stat-card" style={{cursor:s.click?"pointer":"default"}} onClick={s.click}><div className="stat-icon" style={{background:s.bg}}>{s.ico}</div><div className="stat-num" style={{fontSize:typeof s.num==="string"&&s.num.length>4?"1rem":undefined}}>{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
        ))}
      </div>
      <div className="card mb24" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div className="card-title">🗺 Pharmacies sur la carte</div><button className="btn btn-primary btn-sm" onClick={()=>setPage("carte")}>Voir la carte</button></div>
        <CartePharmacies pharmacies={PHARMACIES_YAOUNDE.slice(0,12)} userPos={null} selectedId={null} onSelect={()=>setPage("carte")} height="260px"/>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">💊 {CATALOGUE_MEDICAMENTS.length}+ Médicaments disponibles</div></div>
        <div className="chips">{CATEGORIES_CATALOGUE.map(c=><span key={c} className={"chip"+(catActive===c?" active":"")} onClick={()=>setCatActive(c)}>{c}</span>)}</div>
        <div className="grid-2">{filtered.slice(0,20).map(m=>(
          <div key={m.id} className="med-card" onClick={()=>rechercher(m.nom)}>
            <div className="med-icon" style={{background:"#F4F6F8",fontSize:"1.2rem",flexShrink:0}}>{m.emoji}</div>
            <div className="med-info"><div className="med-name" style={{fontSize:"0.82rem"}}>{m.nom}</div><div className="med-cat">{m.cat}</div></div>
            <div className="med-price"><div className="price-from">~prix réf.</div><div className="price-val">{m.prixRef} F</div></div>
          </div>
        ))}</div>
        {filtered.length>20&&<div style={{textAlign:"center",marginTop:16,color:"var(--grey-text)",fontSize:"0.82rem"}}>+ {filtered.length-20} autres médicaments — utilisez la recherche</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🔍 RÉSULTATS
// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// 👤 PROFIL PATIENT
// ══════════════════════════════════════════════════════════════════════════════
function ProfilPatient({ user, onLogout }) {
  const fbReady = useFirebaseReady();
  const [favoris, setFavoris] = useState([]);
  const [historique, setHistorique] = useState([]);

  useEffect(()=>{
    if(!fbReady||!user?.uid) return;
    getDB().ref("patients/"+user.uid+"/favoris").on("value", snap=>{
      setFavoris(snap.exists()?Object.values(snap.val()):[]);
    });
    getDB().ref("patients/"+user.uid+"/historique").orderByChild("date").limitToLast(10).on("value", snap=>{
      if(snap.exists()) {
        const items = Object.values(snap.val()).reverse();
        setHistorique(items);
      }
    });
    return()=>{
      getDB().ref("patients/"+user.uid+"/favoris").off();
      getDB().ref("patients/"+user.uid+"/historique").off();
    };
  },[fbReady, user]);

  const retirerFavori = async(nom)=>{
    const snap = await getDB().ref("patients/"+user.uid+"/favoris").once("value");
    if(!snap.exists()) return;
    const entries = Object.entries(snap.val());
    const found = entries.find(([k,v])=>v.nom===nom);
    if(found) await getDB().ref("patients/"+user.uid+"/favoris/"+found[0]).remove();
  };

  return(
    <div className="main">
      <div className="page-title mb20">👤 Mon compte</div>

      {/* Infos */}
      <div className="card mb20">
        <div className="profile-header">
          <div className="avatar" style={{background:"#EBF4FF",color:"var(--navy)"}}>👤</div>
          <div>
            <div className="profile-name">{user.nom||user.email}</div>
            <div style={{fontSize:"0.8rem",color:"var(--grey-text)"}}>{user.email}</div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{marginLeft:"auto"}} onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Favoris */}
      <div className="card mb20">
        <div className="card-header">
          <div className="card-title">⭐ Médicaments favoris</div>
          <span className="tag tag-blue">{favoris.length}</span>
        </div>
        {favoris.length===0?(
          <div style={{textAlign:"center",color:"var(--grey-text)",padding:"24px 0",fontSize:"0.85rem"}}>
            Pas encore de favoris.<br/>Ajoutez des médicaments depuis les résultats de recherche.
          </div>
        ):(
          favoris.map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--grey-border)"}}>
              <div>
                <div style={{fontWeight:600,color:"var(--navy)",fontSize:"0.85rem"}}>{f.nom}</div>
                <div style={{fontSize:"0.75rem",color:"var(--grey-text)"}}>{f.cat}</div>
              </div>
              <button onClick={()=>retirerFavori(f.nom)} style={{background:"none",border:"none",color:"var(--grey-text)",cursor:"pointer",fontSize:"1.1rem"}}>✕</button>
            </div>
          ))
        )}
      </div>

      {/* Historique */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🕐 Dernières recherches</div>
        </div>
        {historique.length===0?(
          <div style={{textAlign:"center",color:"var(--grey-text)",padding:"24px 0",fontSize:"0.85rem"}}>Aucune recherche enregistrée.</div>
        ):(
          historique.map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--grey-border)"}}>
              <span style={{fontSize:"0.85rem",color:"var(--navy)"}}>{h.terme}</span>
              <span style={{fontSize:"0.72rem",color:"var(--grey-text)"}}>{new Date(h.date).toLocaleDateString("fr-FR")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 👤 PAGE AUTH PATIENT — Connexion / Inscription
// ══════════════════════════════════════════════════════════════════════════════
function AuthPatient({ onAuth, onSkip }) {
  const fbReady = useFirebaseReady();
  const [mode, setMode] = useState("choix"); // "choix" | "login" | "register"
  const [form, setForm] = useState({ nom:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async () => {
    if(!fbReady){ setError("Connexion Firebase en cours, réessayez..."); return; }
    if(!form.email||!form.password){ setError("Email et mot de passe obligatoires."); return; }
    if(mode==="register"&&!form.nom){ setError("Votre prénom est obligatoire."); return; }
    setLoading(true); setError("");
    try {
      if(mode==="login") {
        const cred = await getAuth().signInWithEmailAndPassword(form.email, form.password);
        const snap = await getDB().ref("users/"+cred.user.uid).once("value");
        const d = snap.val()||{};
        onAuth({ uid:cred.user.uid, email:cred.user.email, role:"patient", nom:d.nom||"" });
      } else {
        if(form.password.length<6){ setError("Mot de passe minimum 6 caractères."); setLoading(false); return; }
        const cred = await getAuth().createUserWithEmailAndPassword(form.email, form.password);
        await getDB().ref("users/"+cred.user.uid).set({
          email: form.email, nom: form.nom, role:"patient", createdAt: Date.now()
        });
        onAuth({ uid:cred.user.uid, email:form.email, role:"patient", nom:form.nom });
      }
    } catch(e) {
      const msgs = {
        "auth/email-already-in-use": "Cet email est déjà utilisé. Connectez-vous.",
        "auth/wrong-password": "Mot de passe incorrect.",
        "auth/user-not-found": "Aucun compte avec cet email.",
        "auth/invalid-email": "Format d'email invalide.",
        "auth/weak-password": "Mot de passe trop faible (min. 6 caractères).",
        "auth/network-request-failed": "Pas de connexion internet.",
        "auth/too-many-requests": "Trop de tentatives. Réessayez dans quelques minutes.",
      };
      setError(msgs[e.code]||"Erreur : "+e.message);
    }
    setLoading(false);
  };

  // Écran de choix
  if(mode==="choix") return(
    <div className="main" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16}}>
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontSize:"3rem",marginBottom:8}}>👤</div>
        <div style={{fontFamily:"Syne",fontWeight:800,fontSize:"1.4rem",color:"var(--navy)"}}>Mon espace patient</div>
        <div style={{color:"var(--grey-text)",fontSize:"0.85rem",marginTop:4}}>Sauvegardez vos médicaments favoris et votre historique de recherches</div>
      </div>
      <button className="btn btn-primary btn-full" style={{maxWidth:320}} onClick={()=>setMode("register")}>
        ✨ Créer mon compte gratuit
      </button>
      <button className="btn btn-secondary btn-full" style={{maxWidth:320}} onClick={()=>setMode("login")}>
        🔑 J'ai déjà un compte
      </button>
      <button onClick={onSkip} style={{background:"none",border:"none",color:"var(--grey-text)",cursor:"pointer",fontSize:"0.82rem",marginTop:4,textDecoration:"underline"}}>
        Continuer sans compte →
      </button>
    </div>
  );

  return(
    <div className="main">
      <div className="page-toprow mb20">
        <button className="btn btn-secondary btn-sm" onClick={()=>setMode("choix")}>← Retour</button>
        <div className="page-title">{mode==="login"?"Se connecter":"Créer un compte"}</div>
      </div>
      <div className="card form-card">
        {error&&<div className="alert mb16" style={{background:"#FDECEA",border:"1px solid #F5C6CB",color:"var(--red)"}}><span className="alert-ico">⚠️</span><span>{error}</span></div>}

        {mode==="register"&&(
          <div className="form-group">
            <label className="form-label">Votre prénom *</label>
            <input className="form-input" placeholder="ex: Jean-Paul" value={form.nom} onChange={e=>setF("nom",e.target.value)}/>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input className="form-input" type="email" placeholder="votre@email.com" value={form.email} onChange={e=>setF("email",e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Mot de passe *</label>
          <input className="form-input" type="password" placeholder={mode==="register"?"Minimum 6 caractères":"Votre mot de passe"} value={form.password} onChange={e=>setF("password",e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
          {loading?"⏳ Chargement...":(mode==="login"?"🔑 Se connecter":"✨ Créer mon compte")}
        </button>
        <div style={{textAlign:"center",marginTop:12,fontSize:"0.82rem",color:"var(--grey-text)"}}>
          {mode==="login"?(
            <span>Pas encore de compte ? <span style={{color:"var(--teal)",cursor:"pointer",fontWeight:600}} onClick={()=>{setMode("register");setError("");}}>S'inscrire gratuitement</span></span>
          ):(
            <span>Déjà un compte ? <span style={{color:"var(--teal)",cursor:"pointer",fontWeight:600}} onClick={()=>{setMode("login");setError("");}}>Se connecter</span></span>
          )}
        </div>
      </div>
      <div className="card mt16" style={{textAlign:"center",background:"#F4F9F8",border:"none"}}>
        <div style={{fontSize:"0.78rem",color:"var(--grey-text)",lineHeight:1.6}}>
          🔒 Vos données sont sécurisées avec Firebase.<br/>
          Mediconline ne partage jamais vos informations.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🏥 COMPOSANT CARTE RÉSULTAT — avec signalement stock incorrect
// ══════════════════════════════════════════════════════════════════════════════
// ── Système de réservation ───────────────────────────────────────────────────
async function creerReservation(r, user, fbReady) {
  if(!fbReady && !r.isDemo) return {ok:false, msg:"Pas de connexion"};
  const uid = user?.uid || ("anon_"+Date.now());
  const resId = "res_"+uid+"_"+Date.now();
  const expiration = Date.now() + 2*60*60*1000; // 2h

  if(r.isDemo) {
    // Mode démo — simuler une réservation locale
    const resDemo = JSON.parse(localStorage.getItem("mediconline_reservations")||"{}");
    const key = r.pharmacieId+"_"+r.nom;
    resDemo[key] = { resId, expiration, nom:r.nom, pharmacieNom:r.pharmacieNom, prix:r.prix };
    localStorage.setItem("mediconline_reservations", JSON.stringify(resDemo));
    return { ok:true, resId, expiration, demo:true };
  }

  // Vérifier stock disponible = qte - reservations actives
  const resSnap = await getDB().ref("reservations/"+r.pharmacieUid+"/"+r.itemId).once("value");
  let reserved = 0;
  if(resSnap.exists()) {
    const now = Date.now();
    Object.values(resSnap.val()).forEach(res => {
      if(res.expiration > now && res.status === "active") reserved++;
    });
  }
  const dispo = (r.qte||0) - reserved;
  if(dispo <= 0) return { ok:false, msg:"Plus de stock disponible — tous les exemplaires sont réservés." };

  // Créer la réservation
  await getDB().ref("reservations/"+r.pharmacieUid+"/"+r.itemId+"/"+resId).set({
    userId: uid, userEmail: user?.email||"anonyme",
    medicament: r.nom, pharmacieId: r.pharmacieUid,
    pharmacieNom: r.pharmacieNom, prix: r.prix,
    status: "active", createdAt: Date.now(), expiration,
  });
  // Notifier la pharmacie
  await getDB().ref("rappels/"+r.pharmacieUid).push({
    message: `🔔 Réservation : ${r.nom} — Client en route (2h)`,
    lu: false, date: Date.now(), type: "reservation"
  });
  return { ok:true, resId, expiration };
}

async function getStockReel(r, fbReady) {
  if(!fbReady || r.isDemo) return r.qte;
  try {
    const resSnap = await getDB().ref("reservations/"+r.pharmacieUid+"/"+r.itemId).once("value");
    if(!resSnap.exists()) return r.qte;
    const now = Date.now();
    let reserved = 0;
    Object.values(resSnap.val()).forEach(res => {
      if(res.expiration > now && res.status === "active") reserved++;
    });
    return Math.max(0, (r.qte||0) - reserved);
  } catch(e) { return r.qte; }
}

function CarteResultat({ r, i, fbReady, setPage, recherche, user }) {
  const [signalé, setSignalé]         = useState(false);
  const [signalLoading, setSignalLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stockDispo, setStockDispo]   = useState(r.qte);
  const [reserved, setReserved]       = useState(false);
  const [resLoading, setResLoading]   = useState(false);
  const [resInfo, setResInfo]         = useState(null);
  const [showResModal, setShowResModal] = useState(false);

  // Calculer le vrai stock disponible (stock - réservations actives)
  useEffect(()=>{
    if(r.isDemo){ setStockDispo(r.qte); return; }
    getStockReel(r, fbReady).then(setStockDispo);
    // Vérifier si déjà réservé par cet utilisateur
    const resDemo = JSON.parse(localStorage.getItem("mediconline_reservations")||"{}");
    const key = (r.pharmacieUid||r.pharmacieId)+"_"+r.nom;
    if(resDemo[key] && resDemo[key].expiration > Date.now()) {
      setReserved(true); setResInfo(resDemo[key]);
    }
  },[fbReady, r.pharmacieUid, r.qte]);

  const handleSignaler = async()=>{
    if(!showConfirm){setShowConfirm(true); return;}
    setSignalLoading(true);
    const res = await signalerErreurStock(r.pharmacieUid||r.pharmacieId, r.pharmacieNom, recherche||r.nom, fbReady);
    if(res==="already") alert("Vous avez déjà signalé ce médicament récemment. Merci !");
    else setSignalé(true);
    setSignalLoading(false); setShowConfirm(false);
  };

  const handleReserver = async()=>{
    if(reserved){ setShowResModal(true); return; }
    setResLoading(true);
    const result = await creerReservation(r, user, fbReady);
    if(result.ok) {
      setReserved(true);
      setResInfo(result);
      setStockDispo(s => Math.max(0, s-1));
      // Sauvegarder en local
      const resLocal = JSON.parse(localStorage.getItem("mediconline_reservations")||"{}");
      const key = (r.pharmacieUid||r.pharmacieId)+"_"+r.nom;
      resLocal[key] = { ...result, nom:r.nom, pharmacieNom:r.pharmacieNom, prix:r.prix };
      localStorage.setItem("mediconline_reservations", JSON.stringify(resLocal));
      setShowResModal(true);
    } else {
      alert(result.msg || "Impossible de réserver. Réessayez.");
    }
    setResLoading(false);
  };

  const heuresRestantes = resInfo ? Math.max(0, Math.round((resInfo.expiration - Date.now())/3600000)) : 0;
  const minutesRestantes = resInfo ? Math.max(0, Math.round(((resInfo.expiration - Date.now())%3600000)/60000)) : 0;

  // Couleur stock
  const stockColor = stockDispo===0?"#DC2626":stockDispo<=5?"#D97706":stockDispo<=15?"#F59E0B":"#059669";
  const stockBg    = stockDispo===0?"#FEF2F2":stockDispo<=5?"#FFF7ED":stockDispo<=15?"#FFFBEB":"#F0FDF4";
  const stockLabel = stockDispo===0?"🚫 Rupture de stock":
                     stockDispo<=5?`⚠️ Presque épuisé — ${stockDispo} unité${stockDispo>1?"s":""} restante${stockDispo>1?"s":""}`:
                     stockDispo<=15?`📦 Stock limité — ${stockDispo} unités disponibles`:
                     `✅ En stock — ${stockDispo} unités disponibles`;

  return(
    <>
    {/* Modal confirmation réservation */}
    {showResModal&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:"white",borderRadius:16,padding:24,maxWidth:360,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          {reserved&&resInfo?(
            <>
              <div style={{textAlign:"center",fontSize:"2.5rem",marginBottom:8}}>🎉</div>
              <div style={{fontFamily:"Syne",fontWeight:800,fontSize:"1.1rem",color:"#0D2B3E",textAlign:"center",marginBottom:4}}>
                Réservation confirmée !
              </div>
              <div style={{textAlign:"center",color:"#0A7B6C",fontSize:"0.85rem",marginBottom:16}}>
                {r.nom}
              </div>
              <div style={{background:"#F0FDF4",borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:"0.82rem",color:"#6B7280"}}>Pharmacie</span>
                  <span style={{fontSize:"0.82rem",fontWeight:700,color:"#0D2B3E"}}>{r.pharmacieNom}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:"0.82rem",color:"#6B7280"}}>Prix</span>
                  <span style={{fontSize:"0.82rem",fontWeight:700,color:"#0A7B6C"}}>{r.prix} FCFA</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:"0.82rem",color:"#6B7280"}}>Réservé pendant</span>
                  <span style={{fontSize:"0.82rem",fontWeight:700,color:"#D97706"}}>
                    ⏱ {heuresRestantes}h{minutesRestantes>0?` ${minutesRestantes}min`:""}
                  </span>
                </div>
              </div>
              <div style={{background:"#FFF7ED",borderRadius:8,padding:12,marginBottom:16,fontSize:"0.78rem",color:"#92400E"}}>
                ⚠️ <strong>Important :</strong> Votre médicament est réservé pour <strong>2 heures</strong>. 
                Rendez-vous à la pharmacie dans ce délai. Passé ce temps, la réservation est annulée automatiquement.
              </div>
              {r.tel&&(
                <button onClick={()=>window.open("tel:"+r.tel)} style={{width:"100%",background:"#0A7B6C",color:"white",border:"none",padding:"12px",borderRadius:99,fontWeight:700,cursor:"pointer",marginBottom:8,fontFamily:"Mulish",fontSize:"0.9rem"}}>
                  📞 Appeler la pharmacie
                </button>
              )}
              {r.lat&&r.lng&&(
                <button onClick={()=>window.open("https://www.google.com/maps/dir//"+r.lat+","+r.lng,"_blank")} style={{width:"100%",background:"#0D2B3E",color:"white",border:"none",padding:"12px",borderRadius:99,fontWeight:700,cursor:"pointer",marginBottom:8,fontFamily:"Mulish",fontSize:"0.9rem"}}>
                  🗺 Y aller maintenant
                </button>
              )}
              <button onClick={()=>setShowResModal(false)} style={{width:"100%",background:"#F3F4F6",color:"#6B7280",border:"none",padding:"10px",borderRadius:99,cursor:"pointer",fontFamily:"Mulish",fontSize:"0.85rem"}}>
                Fermer
              </button>
            </>
          ):(
            <button onClick={()=>setShowResModal(false)}>Fermer</button>
          )}
        </div>
      </div>
    )}

    <div className={"result-card"+(i===0?" best":"")} style={{animationDelay:(i*0.07)+"s"}}>
      {/* En-tête */}
      <div className={"result-header"+(i===0?" best":"")}>
        <div className="ph-ico">🏥</div>
        <div className="ph-info">
          <div className="ph-name">{r.pharmacieNom||"Pharmacie"}</div>
          <div className="ph-dist">
            📍 {r.quartier||"Yaoundé"}
            {r.distance<99&&<span style={{marginLeft:6,color:"var(--teal)",fontWeight:600}}>📏 {formatDistance(r.distance)}</span>}
          </div>
        </div>
        {i===0&&<span className="best-badge">📍 La plus proche</span>}
      </div>

      {/* Prix + Stock */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--grey-border)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div className={"price-big"+(i!==0?" not-best":"")}>{r.prix} FCFA</div>
          {/* Badge stock proéminent */}
          <div style={{
            background:stockBg,color:stockColor,
            padding:"6px 14px",borderRadius:99,
            fontSize:"0.78rem",fontWeight:800,
            fontFamily:"Mulish",border:"1.5px solid "+stockColor,
            display:"flex",alignItems:"center",gap:4
          }}>
            {stockLabel}
          </div>
        </div>
        {/* Barre de stock visuelle */}
        {stockDispo>0&&(
          <div style={{marginTop:10}}>
            <div style={{height:6,background:"#E5E7EB",borderRadius:99,overflow:"hidden"}}>
              <div style={{
                height:"100%",borderRadius:99,
                background:stockColor,
                width:Math.min(100, (stockDispo/Math.max(stockDispo,50))*100)+"%",
                transition:"width 0.5s"
              }}/>
            </div>
            <div style={{fontSize:"0.7rem",color:"var(--grey-text)",marginTop:3}}>
              {stockDispo} unité{stockDispo>1?"s":""} non réservée{stockDispo>1?"s":""} · Mis à jour {r.updatedAt?Math.round((Date.now()-r.updatedAt)/3600000)+"h":"récemment"}
            </div>
          </div>
        )}
        {r.exp&&r.exp!=="N/A"&&<div style={{fontSize:"0.72rem",color:"var(--grey-text)",marginTop:4}}>📅 Expiration : {r.exp}</div>}
      </div>

      {/* Actions */}
      <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {r.lat&&r.lng&&(
            <button className={"btn btn-sm "+(i===0?"btn-primary":"btn-secondary")}
              onClick={()=>window.open("https://www.google.com/maps/dir//"+r.lat+","+r.lng,"_blank")}>
              🗺 Itinéraire
            </button>
          )}
          {r.tel&&<button className="btn btn-secondary btn-sm" onClick={()=>window.open("tel:"+r.tel)}>📞 Appeler</button>}
        </div>

        {/* Bouton RÉSERVER — le cœur de Mediconline */}
        {stockDispo>0&&(
          <button
            onClick={handleReserver}
            disabled={resLoading}
            style={{
              background: reserved?"#059669":"#0A7B6C",
              color:"white",border:"none",
              padding:"8px 18px",borderRadius:99,
              fontWeight:800,cursor:"pointer",
              fontSize:"0.82rem",fontFamily:"Mulish",
              display:"flex",alignItems:"center",gap:6,
              boxShadow: reserved?"none":"0 2px 8px rgba(10,123,108,0.3)",
              transition:"all 0.2s",
              opacity: resLoading?0.7:1,
            }}
          >
            {resLoading?"⏳ Réservation..."
              :reserved?`✅ Réservé (${heuresRestantes}h restantes)`
              :"🔒 Réserver — 2h gratuit"}
          </button>
        )}
      </div>

      {/* Signalement */}
      <div style={{padding:"4px 16px 10px",borderTop:"1px solid var(--grey-border)"}}>
        {!signalé?(
          <button
            style={{fontSize:"0.7rem",padding:"2px 8px",background:showConfirm?"#FDECEA":"transparent",
              color:showConfirm?"var(--red)":"var(--grey-text)",
              border:"1px solid "+(showConfirm?"var(--red)":"var(--grey-border)"),
              borderRadius:99,cursor:"pointer"}}
            onClick={handleSignaler} disabled={signalLoading}>
            {signalLoading?"⏳...":showConfirm?"⚠️ Confirmer le signalement":"🚩 Signaler stock incorrect"}
          </button>
        ):(
          <span style={{fontSize:"0.7rem",color:"var(--teal)"}}>✅ Signalement envoyé à la pharmacie</span>
        )}
      </div>
    </div>
    </>
  );
}

// ── Seed démo au premier chargement ─────────────────────────────────────────
function useSeedDemo(fbReady) {
  useEffect(()=>{
    if(!fbReady)return;
    getDB().ref("demo_seeded").once("value").then(snap=>{
      if(snap.exists())return; // déjà seedé
      const promises=[];
      DEMO_STOCKS.forEach(({pharmacieIdx,stock})=>{
        const ph=PHARMACIES_YAOUNDE[pharmacieIdx];
        const uid="demo_ph_"+pharmacieIdx;
        // Créer la pharmacie démo
        promises.push(getDB().ref("pharmacies/"+uid).set({
          nom:ph.nom, quartier:ph.quartier, adresse:ph.quartier+", Yaoundé",
          tel:ph.tel, ouvert:ph.ouvert, lat:ph.lat, lng:ph.lng,
          adminUid:uid, isDemo:true, createdAt:Date.now()
        }));
        // Ajouter le stock avec prix variés
        stock.forEach(med=>{
          promises.push(getDB().ref("stock/"+uid).push({
            ...med, pharmacieId:uid, pharmacieNom:ph.nom,
            quartier:ph.quartier, lat:ph.lat, lng:ph.lng, updatedAt:Date.now()
          }));
        });
      });
      promises.push(getDB().ref("demo_seeded").set(true));
      Promise.all(promises).then(()=>console.log("✅ Données démo chargées"));
    });
  },[fbReady]);
}

function ResultatsPatient({ recherche, setPage, isDemoMode, user }) {
  const fbReady=useFirebaseReady();
  useSeedDemo(fbReady);
  const [resultats,setResultats]=useState([]);
  const [loading,setLoading]=useState(true);
  const [userPos,setUserPos]=useState(null);

  // Géolocalisation silencieuse
  useEffect(()=>{
    navigator.geolocation?.getCurrentPosition(
      pos=>setUserPos([pos.coords.latitude,pos.coords.longitude]),
      ()=>setUserPos([3.8667,11.5167])
    );
  },[]);

  useEffect(()=>{
    setLoading(true);

    // ── MODE DÉMO OFFLINE ──────────────────────────────────────────────────
    if(isDemoMode) {
      setTimeout(()=>{
        const found = searchDemoOffline(recherche);
        const pos = userPos||[3.8667,11.5167];
        const withDist = found.map(item=>({
          ...item,
          itemId: item.pharmacieId+"_"+item.nom,
          pharmacieUid: item.pharmacieId,
          distance: calculerDistance(pos[0],pos[1],item.lat,item.lng),
          isDemo: true,
        }));
        withDist.sort((a,b)=>a.distance!==b.distance?a.distance-b.distance:a.prix-b.prix);
        setResultats(withDist);
        setLoading(false);
      }, 600); // petit délai réaliste
      return;
    }

    // ── MODE RÉEL (Firebase) ───────────────────────────────────────────────
    if(!fbReady)return;
    getDB().ref("stock").once("value").then(snap=>{
      const found=[];
      // Charger statuts pharmacies vérifiées
    const phSnap = await getDB().ref("pharmacies").once("value");
    const statutsVerif = {};
    if(phSnap.exists()){
      Object.entries(phSnap.val()).forEach(([uid,ph])=>{
        statutsVerif[uid] = ph.statut||"en_attente";
      });
    }

    if(snap.exists()){
        Object.entries(snap.val()).forEach(([uid,items])=>{
          // Masquer les pharmacies non vérifiées aux patients
          if(statutsVerif[uid]==="suspendu") return;
          if(statutsVerif[uid]==="en_attente" && !uid.startsWith("demo_ph_")) return;
          Object.entries(items).forEach(([itemId,item])=>{
            // Recherche floue : correspondance directe OU faute d'orthographe tolérée
            const scoreItem = scoreFuzzy(recherche, {nom:item.nom||"",cat:item.cat||""});
            if(scoreItem>0&&item.qte>0){
              const pos=userPos||[3.8667,11.5167];
              const dist=item.lat&&item.lng ? calculerDistance(pos[0],pos[1],item.lat,item.lng) : 99;
              found.push({...item,itemId,pharmacieUid:uid,distance:dist});
            }
          });
        });
      }
      found.sort((a,b)=> a.distance!==b.distance ? a.distance-b.distance : a.prix-b.prix);
      setResultats(found);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[fbReady,recherche,userPos,isDemoMode]);

  const catalogueMatch = CATALOGUE_MEDICAMENTS.filter(m=>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  );
  const hasFbResults = resultats.length > 0;

  return(
    <div className="main">
      <div className="result-toprow">
        <button className="btn btn-secondary btn-sm" onClick={()=>setPage("accueil")}>← Retour</button>
        <div><div className="result-title">{recherche}</div>
        <div className="result-sub">{hasFbResults ? resultats.length+" pharmacie(s) trouvée(s) · Triées par proximité" : "Prix de référence au Cameroun"}</div></div>
      </div>

      {/* ── RÉSULTATS PHARMACIES ── */}
      {hasFbResults && (
        <>
          <div className="alert alert-success mb16">
            <span className="alert-ico">📍</span>
            <span>Pharmacie la plus proche : <strong>{resultats[0].pharmacieNom}</strong> — <strong>{resultats[0].prix} FCFA</strong>{resultats[0].distance<99?" ("+formatDistance(resultats[0].distance)+" de vous)":""}</span>
          </div>
          <div className="results-list mb24">
            {resultats.map((r,i)=>(
              <CarteResultat key={r.itemId} r={r} i={i} fbReady={fbReady} setPage={setPage} recherche={recherche}/>
            ))}
          </div>
        </>
      )}

      {/* ── RÉSULTATS CATALOGUE (prix de référence) ── */}
      {catalogueMatch.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 {hasFbResults ? "Informations sur ce médicament" : "Prix de référence au Cameroun"}</div>
            {!hasFbResults && <span className="tag tag-blue">Aucune pharmacie connectée pour l'instant</span>}
          </div>
          {!hasFbResults && (
            <div className="alert alert-warn mb16">
              <span className="alert-ico">⏳</span>
              <span>Les pharmacies de Yaoundé rejoignent Mediconline progressivement. En attendant, voici le prix de référence national pour ce médicament.</span>
            </div>
          )}
          {catalogueMatch.map(m=>(
            <div key={m.id} className="med-card mb16" style={{border:"1.5px solid var(--grey-border)",borderRadius:12,padding:"16px"}}>
              <div className="med-icon" style={{background:"#F4F6F8",fontSize:"1.4rem",width:48,height:48,flexShrink:0}}>{m.emoji}</div>
              <div className="med-info" style={{flex:1}}>
                <div className="med-name">{m.nom}</div>
                <div className="med-cat">{m.cat}</div>
              </div>
              <div className="med-price">
                <div className="price-from">Prix réf.</div>
                <div className="price-val">{m.prixRef} FCFA</div>
              </div>
            </div>
          ))}
          {!hasFbResults && (
            <div className="alert alert-success mt16">
              <span className="alert-ico">🏥</span>
              <span>Vous êtes pharmacien ? <strong onClick={()=>setPage("dashboard")} style={{cursor:"pointer",textDecoration:"underline"}}>Inscrivez-vous gratuitement</strong> et publiez votre stock en temps réel !</span>
            </div>
          )}
        </div>
      )}

      {catalogueMatch.length===0 && !hasFbResults && (
        <div className="empty">
          <div className="empty-ico">😔</div>
          <h3>Médicament introuvable</h3>
          <p>Essayez un autre nom ou une orthographe différente.</p>
          <button className="btn btn-secondary" style={{marginTop:16}} onClick={()=>setPage("accueil")}>← Retour</button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 📊 DASHBOARD PHARMACIE
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ stock, setPage, user }) {
  const fbReady=useFirebaseReady();
  const alertes=stock.filter(s=>s.qte<=10&&s.qte>0);
  const ruptures=stock.filter(s=>s.qte===0);
  const [signalements,setSignalements]=useState([]);
  const [credibilite,setCredibilite]=useState(100);
  const {rappels,marquerLu}=useRappelNotifications(user,fbReady);
  useRappelStock(user,stock);
  const [reservations,setReservations]=useState([]);

  useEffect(()=>{
    if(!fbReady||!user?.uid)return;
    // Charger signalements
    getDB().ref("signalements/"+user.uid).on("value",snap=>{
      if(snap.exists()){
        const sigs=Object.values(snap.val());
        setSignalements(sigs);
        const score=Math.max(0,100-sigs.reduce((a,s)=>a+(s.count||1)*5,0));
        setCredibilite(score);
        // Suspension automatique si crédibilité < 40%
        if(score < 40 && fbReady && user?.uid){
          getDB().ref("pharmacies/"+user.uid+"/statut").once("value").then(snap=>{
            if(snap.val()==="verifie"){
              getDB().ref("pharmacies/"+user.uid).update({statut:"suspendu"});
              getDB().ref("admin_notifications").push({
                type:"suspension_automatique",
                pharmacieId:user.uid,
                nom:user.nomPharmacie,
                score,
                date:Date.now(),
                lu:false,
                message:"Suspension automatique — Score crédibilité : "+score+"%"
              });
            }
          });
        }
      }
    });
    // Charger réservations actives
    getDB().ref("reservations/"+user.uid).on("value",snap=>{
      if(!snap.exists()){setReservations([]);return;}
      const now=Date.now();
      const actives=[];
      Object.entries(snap.val()).forEach(([itemId,resMap])=>{
        Object.entries(resMap).forEach(([resId,res])=>{
          if(res.status==="active"&&res.expiration>now){
            actives.push({...res,resId,itemId});
          }
        });
      });
      setReservations(actives);
    });
    return()=>{
      getDB().ref("signalements/"+user.uid).off();
      getDB().ref("reservations/"+user.uid).off();
    };
  },[fbReady,user]);

  const credColor=credibilite>=80?"#2DC653":credibilite>=50?"#F4A261":"var(--red)";

  const [statutPharmacie, setStatutPharmacie] = useState("en_attente");
  useEffect(()=>{
    if(!fbReady||!user?.uid) return;
    getDB().ref("pharmacies/"+user.uid+"/statut").on("value", snap=>{
      setStatutPharmacie(snap.val()||"en_attente");
    });
    return()=>getDB().ref("pharmacies/"+user.uid+"/statut").off();
  },[fbReady,user]);

  return(
    <div className="main">
      {/* ── Bandeau statut validation ── */}
      {statutPharmacie==="en_attente"&&(
        <div style={{background:"#FFFBEB",border:"2px solid #F59E0B",borderRadius:12,padding:"16px 20px",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <span style={{fontSize:"1.8rem"}}>⏳</span>
            <div>
              <div style={{fontFamily:"Syne",fontWeight:800,fontSize:"1rem",color:"#92400E"}}>
                Compte en attente de validation
              </div>
              <div style={{fontSize:"0.83rem",color:"#78350F",marginTop:4,lineHeight:1.6}}>
                Votre pharmacie est en cours de vérification par l'équipe Mediconline.<br/>
                <strong>Votre stock n'est pas encore visible par les patients.</strong><br/>
                Délai de validation : 24 à 48 heures.<br/>
                Pour accélérer : envoyez une photo de votre façade ou votre numéro d'autorisation au <strong>+237 6XX XXX XXX</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {statutPharmacie==="suspendu"&&(
        <div style={{background:"#FEF2F2",border:"2px solid #DC2626",borderRadius:12,padding:"16px 20px",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <span style={{fontSize:"1.8rem"}}>🚫</span>
            <div>
              <div style={{fontFamily:"Syne",fontWeight:800,fontSize:"1rem",color:"#991B1B"}}>
                Compte suspendu
              </div>
              <div style={{fontSize:"0.83rem",color:"#7F1D1D",marginTop:4,lineHeight:1.6}}>
                Votre compte a été suspendu suite à des signalements de patients ou une violation des conditions d'utilisation.<br/>
                Contactez le support Mediconline pour régulariser : <strong>support@mediconline.cm</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {statutPharmacie==="verifie"&&(
        <div style={{background:"#F0FDF4",border:"1px solid #059669",borderRadius:8,padding:"8px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          <span>✅</span>
          <span style={{fontSize:"0.82rem",color:"#065F46",fontWeight:600}}>Pharmacie vérifiée — Votre stock est visible par tous les patients de Yaoundé</span>
        </div>
      )}
      <div className="dash-header">
        <h2>🏥 {user?.nomPharmacie||"Mon Dashboard"}</h2>
        <p><span className="status-dot online"></span>Connecté · Firebase 🔥 · {statutPharmacie==="verifie"?"Visible par les patients":"En attente de validation"}</p>
      </div>

      {/* ── NIVEAU 2 : Rappels non lus ── */}
      {rappels.length>0&&rappels.map(rap=>(
        <div key={rap.id} className="alert alert-warn mb16" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span><span className="alert-ico">⏰</span><strong>Rappel :</strong> {rap.message}</span>
          <button className="btn btn-secondary btn-sm" onClick={()=>marquerLu(rap.id)}>✓ Lu</button>
        </div>
      ))}

      {/* ── Alertes stock ── */}
      {alertes.length>0&&<div className="alert alert-warn mb16"><span className="alert-ico">⚠️</span><span><strong>Stock bas :</strong> {alertes.map(a=>a.nom).join(", ")}</span></div>}
      {ruptures.length>0&&<div className="alert mb16" style={{background:"#FDECEA",border:"1px solid #F5C6CB",color:"var(--red)"}}><span className="alert-ico">🚫</span><span><strong>Rupture :</strong> {ruptures.map(a=>a.nom).join(", ")}</span></div>}

      {/* ── Signalements patients ── */}
      {signalements.length>0&&(
        <div className="alert mb16" style={{background:"#FFF4E6",border:"1px solid #F4A261",color:"#8B4513"}}>
          <span className="alert-ico">🚩</span>
          <div>
            <strong>{signalements.length} signalement(s) de patients</strong> — Des patients ont signalé un écart de stock :
            {signalements.map((s,i)=>(
              <div key={i} style={{fontSize:"0.8rem",marginTop:4}}>• {s.medicament} ({s.count} signalement{s.count>1?"s":""})</div>
            ))}
            <button className="btn btn-secondary btn-sm" style={{marginTop:8}} onClick={()=>setPage("stock")}>
              📦 Mettre à jour le stock maintenant
            </button>
          </div>
        </div>
      )}

      {/* ── Réservations actives ── */}
      {reservations.length>0&&(
        <div className="alert mb16" style={{background:"#EFF6FF",border:"1.5px solid #3B82F6",color:"#1E40AF"}}>
          <span className="alert-ico">🔔</span>
          <div style={{flex:1}}>
            <strong>{reservations.length} patient{reservations.length>1?"s":""}  en route vers votre pharmacie</strong>
            <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
              {reservations.map((res,i)=>{
                const restant=Math.max(0,Math.round((res.expiration-Date.now())/60000));
                return(
                  <div key={i} style={{fontSize:"0.8rem",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.6)",borderRadius:6,padding:"4px 10px"}}>
                    <span>💊 <strong>{res.medicament}</strong></span>
                    <span style={{color:"#D97706",fontWeight:700}}>⏱ {restant<60?restant+"min":Math.round(restant/60)+"h"} restantes</span>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:"0.75rem",marginTop:6,opacity:0.8}}>
              Préparez ces médicaments — les réservations expirent dans 2h maximum.
            </div>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid-4 mb24">
        {[
          {ico:"💊",num:stock.length,lbl:"Médicaments",bg:"#EBF4FF"},
          {ico:"⚠️",num:alertes.length,lbl:"Stocks bas",bg:"#FFF4E6"},
          {ico:"🚫",num:ruptures.length,lbl:"Ruptures",bg:"#FDECEA"},
          {ico:"⭐",num:credibilite+"%",lbl:"Crédibilité",bg:"#E6FAF0",color:credColor},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.bg}}>{s.ico}</div>
            <div className="stat-num" style={{color:s.color||undefined,fontSize:typeof s.num==="string"?"1rem":undefined}}>{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Score crédibilité détail ── */}
      <div className="card mb20">
        <div className="card-header">
          <div className="card-title">⭐ Score de crédibilité : <span style={{color:credColor,fontWeight:800}}>{credibilite}%</span></div>
        </div>
        <div style={{background:"#F4F6F8",borderRadius:99,height:12,overflow:"hidden",margin:"8px 0"}}>
          <div style={{background:credColor,height:"100%",width:credibilite+"%",borderRadius:99,transition:"width 0.5s"}}/>
        </div>
        <div style={{fontSize:"0.8rem",color:"var(--grey-text)",marginTop:6}}>
          {credibilite>=80?"✅ Excellente crédibilité — Vos patients vous font confiance.":
           credibilite>=50?"⚠️ Crédibilité moyenne — Mettez votre stock à jour régulièrement.":
           "🚨 Crédibilité faible — Des patients signalent des erreurs de stock. Agissez !"}
        </div>
        <div style={{fontSize:"0.78rem",color:"var(--grey-text)",marginTop:8,padding:"8px 12px",background:"#F4F6F8",borderRadius:8}}>
          💡 <strong>Comment maintenir un score élevé :</strong> Mettez votre stock à jour chaque soir avant de fermer. Chaque signalement de patient fait baisser votre score de 5 points.
        </div>
      </div>

      {/* ── NIVEAU 3 : Connexion logiciel ── */}
      <div className="card mb20" style={{border:"1.5px dashed var(--teal)"}}>
        <div className="card-header">
          <div className="card-title">🔗 Niveau 3 — Connexion automatique</div>
          <span className="tag tag-blue">Bientôt disponible</span>
        </div>
        <div style={{fontSize:"0.85rem",color:"var(--grey-text)",lineHeight:1.6}}>
          Connectez votre logiciel de caisse à Mediconline. Chaque vente mettra automatiquement à jour votre stock sans aucune action de votre part.<br/>
          <strong style={{color:"var(--navy)"}}>Logiciels compatibles en cours d'intégration :</strong> Sage, Winpharma, Excel/CSV automatique.
        </div>
        <button className="btn btn-secondary btn-sm" style={{marginTop:12}}
          onClick={()=>alert("Fonctionnalité en développement. Nous vous contacterons dès qu'elle sera disponible.")}>
          🔔 M'avertir quand c'est disponible
        </button>
      </div>

      {/* ── Actions rapides ── */}
      <div className="section-title">Actions rapides</div>
      <div className="grid-4">
        {[{ico:"➕",lbl:"Ajouter",page:"ajouter"},{ico:"📦",lbl:"Gérer le stock",page:"stock"},{ico:"🗺",lbl:"Carte",page:"carte"},{ico:"⚙️",lbl:"Ma pharmacie",page:"profil"}].map((a,i)=>(
          <div key={i} className="action-card" onClick={()=>setPage(a.page)}>
            <div className="action-ico">{a.ico}</div>
            <div className="action-lbl">{a.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 📦 GESTION STOCK
// ══════════════════════════════════════════════════════════════════════════════
function GestionStock({ stock, user, setPage }) {
  const [query,setQuery]=useState(""); const [editItem,setEditItem]=useState(null); const [editPrix,setEditPrix]=useState(""); const [editQte,setEditQte]=useState("");
  const filtered=stock.filter(s=>s.nom.toLowerCase().includes(query.toLowerCase()));
  const supprimer=async id=>{if(!window.confirm("Supprimer ?"))return;await getDB().ref("stock/"+user.uid+"/"+id).remove();};
  const sauvegarder=async()=>{await getDB().ref("stock/"+user.uid+"/"+editItem.itemId).update({prix:Number(editPrix),qte:Number(editQte),updatedAt:Date.now()});setEditItem(null);};
  return(
    <div className="main">
      <div className="page-toprow"><div><div className="page-title">Gestion du stock</div><div className="page-sub">{stock.length} médicaments · 🔥 Live</div></div><button className="btn btn-primary" onClick={()=>setPage("ajouter")}>➕ Ajouter</button></div>
      <div className="card">
        <div className="search-wrap mb16"><span className="search-ico2">🔍</span><input className="form-input search-field" placeholder="Rechercher..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
        <div className="table-wrap"><table><thead><tr><th>Médicament</th><th>Catégorie</th><th>Prix (FCFA)</th><th>Qté</th><th>Expiration</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(s=>(
          <tr key={s.itemId}><td className="td-name">{s.nom}</td><td><span className="tag tag-blue">{s.cat}</span></td><td className="td-price">{s.prix} F</td>
          <td style={{fontWeight:600,color:s.qte===0?"var(--red)":s.qte<=10?"#F4A261":"#2DC653"}}>{s.qte}{s.qte===0?" 🚫":s.qte<=10?" ⚠":""}</td>
          <td className="td-exp">{s.exp}</td><td><span className={"stock-tag "+(s.qte===0?"stock-out":s.qte<=10?"stock-low":"stock-ok")}>{s.qte===0?"Rupture":s.qte<=10?"Stock bas":"Disponible"}</span></td>
          <td><div className="btn-row"><button className="btn btn-secondary btn-sm" onClick={()=>{setEditItem(s);setEditPrix(String(s.prix));setEditQte(String(s.qte));}}>✏️</button><button className="btn btn-danger btn-sm" onClick={()=>supprimer(s.itemId)}>🗑</button></div></td></tr>
        ))}</tbody></table></div>
      </div>
      {editItem&&<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setEditItem(null)}><div className="modal"><div className="modal-title">Modifier — {editItem.nom}</div><div className="grid-2"><div className="form-group"><label className="form-label">Prix (FCFA)</label><input className="form-input" type="number" value={editPrix} onChange={e=>setEditPrix(e.target.value)}/></div><div className="form-group"><label className="form-label">Quantité</label><input className="form-input" type="number" value={editQte} onChange={e=>setEditQte(e.target.value)}/></div></div><div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setEditItem(null)}>Annuler</button><button className="btn btn-primary" onClick={sauvegarder}>✅ Enregistrer</button></div></div></div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ➕ AJOUTER MÉDICAMENT — avec catalogue suggéré
// ══════════════════════════════════════════════════════════════════════════════
function AjouterMedicament({ user, setPage }) {
  const [onglet,setOnglet]=useState("manuel"); // "manuel" | "excel" | "catalogue"
  const [form,setForm]=useState({nom:"",cat:"",prix:"",qte:"",exp:""});
  const [suggestions,setSuggestions]=useState([]);
  const [success,setSuccess]=useState(false);
  const [importLog,setImportLog]=useState([]);
  const [importing,setImporting]=useState(false);
  const [importDone,setImportDone]=useState(false);
  const [catFilter,setCatFilter]=useState("Tous");
  const [catalogueSel,setCatalogueSel]=useState([]);
  const [catPrix,setCatPrix]=useState({});

  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleNomInput=v=>{setF("nom",v);setSuggestions(v.length>1?rechercherFloue(v,6):[]);};
  const selectSuggestion=m=>{setForm({nom:m.nom,cat:m.cat,prix:String(m.prixRef),qte:"",exp:""});setSuggestions([]);};

  // ── Ajout manuel
  const enregistrer=async()=>{
    if(!form.nom||!form.prix||!form.qte){alert("Champs obligatoires manquants.");return;}
    await getDB().ref("stock/"+user.uid).push({nom:form.nom,cat:form.cat||"Autre",prix:Number(form.prix),qte:Number(form.qte),exp:form.exp||"N/A",pharmacieId:user.uid,pharmacieNom:user.nomPharmacie||"Ma Pharmacie",updatedAt:Date.now()});
    setSuccess(true); setTimeout(()=>{setSuccess(false);setPage("stock");},1500);
  };

  // ── Import Excel/CSV
  const handleFile=async(e)=>{
    const file=e.target.files[0]; if(!file)return;
    setImporting(true); setImportLog([]); setImportDone(false);
    const ext=file.name.split(".").pop().toLowerCase();
    const reader=new FileReader();
    reader.onload=async(ev)=>{
      try{
        let rows=[];
        if(ext==="csv"){
          // Parse CSV
          const text=ev.target.result;
          const lines=text.split("\n").filter(l=>l.trim());
          const headers=lines[0].split(/[,;]/).map(h=>h.trim().toLowerCase().replace(/['"]/g,""));
          rows=lines.slice(1).map(line=>{
            const vals=line.split(/[,;]/).map(v=>v.trim().replace(/['"]/g,""));
            const obj={};
            headers.forEach((h,i)=>obj[h]=vals[i]||"");
            return obj;
          }).filter(r=>r[headers[0]]);
        } else {
          // Parse XLSX avec SheetJS (si dispo) sinon simuler
          setImportLog(["⚠️ Pour Excel .xlsx, utilisez le format CSV. Exportez depuis Excel : Fichier → Enregistrer sous → CSV"]);
          setImporting(false);
          return;
        }

        // Colonnes acceptées : nom/désignation/medicament, prix/price, quantite/qte/stock, categorie/cat
        const findCol=(obj,keys)=>{ for(const k of keys){ const found=Object.keys(obj).find(h=>keys.some(kk=>h.includes(kk))); if(found)return obj[found]; } return ""; };
        
        let ok=0, ignored=0;
        const logs=[];
        for(const row of rows){
          const keys=Object.keys(row);
          const nom=(row["nom"]||row["designation"]||row["désignation"]||row["medicament"]||row["médicament"]||row[keys[0]]||"").trim();
          const prixRaw=(row["prix"]||row["price"]||row["tarif"]||row[keys[1]]||"").toString().replace(/[^0-9]/g,"");
          const qteRaw=(row["qte"]||row["quantite"]||row["quantité"]||row["stock"]||row[keys[2]]||"").toString().replace(/[^0-9]/g,"");
          const cat=row["categorie"]||row["catégorie"]||row["cat"]||"Autre";
          const exp=row["expiration"]||row["exp"]||row["date_expiration"]||"N/A";
          
          if(!nom||!prixRaw){ignored++;logs.push("⚠️ Ignoré (données manquantes): "+JSON.stringify(row));continue;}
          
          const prix=Number(prixRaw)||0;
          const qte=Number(qteRaw)||0;

          // Matcher avec catalogue officiel
          const match=CATALOGUE_MEDICAMENTS.find(m=>m.nom.toLowerCase().includes(nom.toLowerCase())||nom.toLowerCase().includes(m.nom.toLowerCase().split(" ")[0]));
          
          await getDB().ref("stock/"+user.uid).push({
            nom: match?match.nom:nom,
            cat: match?match.cat:cat,
            prix, qte,
            exp: exp||"N/A",
            pharmacieId:user.uid,
            pharmacieNom:user.nomPharmacie||"Ma Pharmacie",
            updatedAt:Date.now()
          });
          ok++;
          logs.push("✅ Importé : "+nom+" — "+prix+" FCFA — Qté: "+qte);
        }
        logs.unshift("📊 Résultat : "+ok+" médicaments importés, "+ignored+" ignorés");
        setImportLog(logs);
        setImportDone(true);
        setImporting(false);
      }catch(err){
        setImportLog(["❌ Erreur : "+err.message]);
        setImporting(false);
      }
    };
    if(ext==="csv") reader.readAsText(file, "UTF-8");
    else reader.readAsArrayBuffer(file);
  };

  // ── Import depuis catalogue officiel (sélection multiple)
  const toggleSel=(id)=>setCatalogueSel(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const importerSelection=async()=>{
    if(catalogueSel.length===0){alert("Sélectionnez au moins un médicament.");return;}
    setImporting(true);
    for(const id of catalogueSel){
      const m=CATALOGUE_MEDICAMENTS.find(x=>x.id===id);
      if(!m)continue;
      const prix=Number(catPrix[id])||m.prixRef;
      await getDB().ref("stock/"+user.uid).push({
        nom:m.nom, cat:m.cat, prix, qte:0, exp:"N/A",
        pharmacieId:user.uid, pharmacieNom:user.nomPharmacie||"Ma Pharmacie", updatedAt:Date.now()
      });
    }
    setImporting(false);
    setImportDone(true);
    setImportLog(["✅ "+catalogueSel.length+" médicaments ajoutés ! Allez dans Gestion du Stock pour mettre à jour les quantités."]);
  };

  const catMeds=catFilter==="Tous"?CATALOGUE_MEDICAMENTS:CATALOGUE_MEDICAMENTS.filter(m=>m.cat===catFilter);

  return(
    <div className="main">
      <div className="page-toprow mb20">
        <button className="btn btn-secondary btn-sm" onClick={()=>setPage("stock")}>← Retour</button>
        <div className="page-title">Ajouter des médicaments</div>
      </div>

      {/* Onglets */}
      <div className="auth-tabs mb20" style={{marginBottom:20}}>
        <div className={"auth-tab"+(onglet==="catalogue"?" active":"")} onClick={()=>setOnglet("catalogue")}>📋 Depuis le catalogue</div>
        <div className={"auth-tab"+(onglet==="excel"?" active":"")} onClick={()=>setOnglet("excel")}>📂 Importer CSV/Excel</div>
        <div className={"auth-tab"+(onglet==="manuel"?" active":"")} onClick={()=>setOnglet("manuel")}>✏️ Manuel</div>
      </div>

      {/* ══ ONGLET CATALOGUE ══ */}
      {onglet==="catalogue"&&(
        <div className="card">
          <div className="alert mb16" style={{background:"#EBF4FF",borderColor:"#B0C8E8",color:"var(--navy)"}}>
            <span className="alert-ico">💡</span>
            <span><strong>Sélectionnez vos médicaments</strong> depuis le catalogue officiel du Cameroun ({CATALOGUE_MEDICAMENTS.length} médicaments). Entrez votre prix pour chacun.</span>
          </div>
          <div className="chips mb16">
            {["Tous",...new Set(CATALOGUE_MEDICAMENTS.map(m=>m.cat))].map(c=>(
              <span key={c} className={"chip"+(catFilter===c?" active":"")} onClick={()=>setCatFilter(c)}>{c}</span>
            ))}
          </div>
          <div style={{marginBottom:12,color:"var(--grey-text)",fontSize:"0.82rem"}}>
            {catalogueSel.length} sélectionné(s) · {catMeds.length} médicaments affichés
          </div>
          <div style={{maxHeight:"400px",overflowY:"auto",border:"1px solid var(--grey-border)",borderRadius:10}}>
            {catMeds.map(m=>{
              const sel=catalogueSel.includes(m.id);
              return(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:"1px solid var(--grey-border)",background:sel?"#E6FAF0":"white",cursor:"pointer"}}
                  onClick={()=>toggleSel(m.id)}>
                  <input type="checkbox" checked={sel} onChange={()=>toggleSel(m.id)} style={{width:16,height:16,cursor:"pointer"}}/>
                  <span style={{fontSize:"1.1rem"}}>{m.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.82rem",fontWeight:600,color:"var(--navy)"}}>{m.nom}</div>
                    <div style={{fontSize:"0.72rem",color:"var(--grey-text)"}}>{m.cat}</div>
                  </div>
                  {sel&&(
                    <input
                      type="number"
                      placeholder={"Prix (réf: "+m.prixRef+" F)"}
                      value={catPrix[m.id]||""}
                      onChange={e=>{e.stopPropagation();setCatPrix(p=>({...p,[m.id]:e.target.value}));}}
                      onClick={e=>e.stopPropagation()}
                      className="form-input"
                      style={{width:130,padding:"4px 8px",fontSize:"0.78rem"}}
                    />
                  )}
                  {!sel&&<span style={{fontSize:"0.75rem",color:"var(--teal)",fontWeight:600,whiteSpace:"nowrap"}}>~{m.prixRef} F</span>}
                </div>
              );
            })}
          </div>
          <div style={{marginTop:16,display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>setCatalogueSel(catMeds.map(m=>m.id))}>Tout sélectionner</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>setCatalogueSel([])}>Tout désélectionner</button>
            <button className="btn btn-primary" style={{marginLeft:"auto"}} onClick={importerSelection} disabled={importing||catalogueSel.length===0}>
              {importing?"⏳ Import en cours...":"✅ Ajouter les "+catalogueSel.length+" sélectionnés"}
            </button>
          </div>
          {importDone&&<div className="alert alert-success mt16"><span className="alert-ico">🎉</span><span>{importLog[0]}</span></div>}
        </div>
      )}

      {/* ══ ONGLET CSV/EXCEL ══ */}
      {onglet==="excel"&&(
        <div className="card">
          <div className="alert mb16" style={{background:"#E6FAF0",borderColor:"var(--teal)",color:"var(--navy)"}}>
            <span className="alert-ico">📊</span>
            <span><strong>Importation automatique</strong> — Téléversez votre fichier CSV. Tous vos médicaments sont importés en une seule fois !</span>
          </div>

          {/* Format attendu */}
          <div className="card mb16" style={{background:"#F4F6F8",border:"none"}}>
            <div style={{fontWeight:700,marginBottom:8,fontSize:"0.85rem",color:"var(--navy)"}}>📋 Format CSV attendu :</div>
            <div style={{fontFamily:"monospace",fontSize:"0.78rem",background:"white",padding:10,borderRadius:8,border:"1px solid var(--grey-border)",overflowX:"auto"}}>
              <div style={{color:"var(--teal)",fontWeight:700}}>nom,prix,qte,categorie,expiration</div>
              <div>Paracétamol 500mg,50,150,Antidouleur,2027-06-01</div>
              <div>Amoxicilline 250mg,900,30,Antibiotique,2026-08-15</div>
              <div>Coartem 20/120mg,2500,20,Antipaludéen,2027-01-20</div>
              <div>Metformine 500mg,500,50,Diabète,2027-05-01</div>
            </div>
            <div style={{fontSize:"0.75rem",color:"var(--grey-text)",marginTop:8}}>
              💡 Depuis Excel : <strong>Fichier → Enregistrer sous → CSV (séparateur: virgule)</strong>
            </div>
          </div>

          <div style={{border:"2px dashed var(--teal)",borderRadius:12,padding:"32px",textAlign:"center",background:"#F4FBF9"}}>
            <div style={{fontSize:"2.5rem",marginBottom:8}}>📂</div>
            <div style={{fontWeight:700,color:"var(--navy)",marginBottom:4}}>Glissez votre fichier CSV ici</div>
            <div style={{fontSize:"0.82rem",color:"var(--grey-text)",marginBottom:16}}>ou cliquez pour sélectionner</div>
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} style={{display:"none"}} id="file-input"/>
            <label htmlFor="file-input" className="btn btn-primary" style={{cursor:"pointer",display:"inline-block"}}>
              {importing?"⏳ Import en cours...":"📂 Choisir le fichier"}
            </label>
          </div>

          {importLog.length>0&&(
            <div style={{marginTop:16,maxHeight:200,overflowY:"auto",fontFamily:"monospace",fontSize:"0.75rem",background:"#F4F6F8",padding:12,borderRadius:8}}>
              {importLog.map((l,i)=>(
                <div key={i} style={{color:l.startsWith("✅")?"#2DC653":l.startsWith("⚠️")?"#F4A261":l.startsWith("❌")?"var(--red)":"var(--navy)",marginBottom:4}}>{l}</div>
              ))}
            </div>
          )}
          {importDone&&<div style={{marginTop:12,display:"flex",gap:12}}>
            <button className="btn btn-primary" onClick={()=>setPage("stock")}>📦 Voir mon stock</button>
            <button className="btn btn-secondary" onClick={()=>{setImportLog([]);setImportDone(false);}}>Importer un autre fichier</button>
          </div>}
        </div>
      )}

      {/* ══ ONGLET MANUEL ══ */}
      {onglet==="manuel"&&(
        <div className="card form-card">
          {success&&<div className="alert alert-success mb16"><span className="alert-ico">✅</span><span>Ajouté !</span></div>}
          <div className="form-group" style={{position:"relative"}}>
            <label className="form-label">Nom du médicament *</label>
            <input className="form-input" placeholder="ex: Coartem, Amoxicilline..." value={form.nom} onChange={e=>handleNomInput(e.target.value)}/>
            {suggestions.length>0&&<div className="suggestions" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:100}}>
              {suggestions.map(s=><div key={s.id} className="suggestion-item" onClick={()=>selectSuggestion(s)}>
                <span>{s.emoji}</span><span style={{flex:1,fontSize:"0.82rem"}}>{s.nom}</span><span className="tag tag-blue">{s.cat}</span><span style={{fontSize:"0.72rem",color:"var(--teal)",fontWeight:700}}>~{s.prixRef} F</span>
              </div>)}
            </div>}
          </div>
          <div className="form-group"><label className="form-label">Catégorie</label>
            <select className="form-input" value={form.cat} onChange={e=>setF("cat",e.target.value)}>
              <option value="">Sélectionner...</option>
              {CATEGORIES_CATALOGUE.filter(c=>c!=="Tous").map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Prix de vente (FCFA) *</label><input className="form-input" type="number" value={form.prix} onChange={e=>setF("prix",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Quantité en stock *</label><input className="form-input" type="number" value={form.qte} onChange={e=>setF("qte",e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Date d'expiration</label><input className="form-input" type="date" value={form.exp} onChange={e=>setF("exp",e.target.value)}/></div>
          <hr className="divider"/>
          <button className="btn btn-primary btn-full" onClick={enregistrer}>✅ Publier sur Mediconline</button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ⚙️ PROFIL PHARMACIE
// ══════════════════════════════════════════════════════════════════════════════
function ProfilPharmacie({ user }) {
  const fbReady = useFirebaseReady();
  const [edit,setEdit]     = useState(false);
  const [saving,setSaving] = useState(false);
  const [saved,setSaved]   = useState(false);
  const [info,setInfo]     = useState({nom:"",quartier:"",adresse:"",tel:"",ouverture:"08:00",fermeture:"22:00",ouvert:true});
  const [tmp,setTmp]       = useState(info);

  const QUARTIERS = ["Bastos","Centre-ville","Obili","Tsinga","Madagascar","Biyem-Assi",
    "Melen","Essos","Nlongkak","Cité Verte","Odza","Mvog-Mbi","Mendong","Ekounou",
    "Nkomo","Emana","Mimboman","Nsam","Ngousso","Mokolo","Hippodrome","Nylon",
    "Simbock","Nkol-Eton","Mvog-Ada","Ahala","Damas"];

  useEffect(()=>{
    if(!user?.uid||!fbReady)return;
    getDB().ref("pharmacies/"+user.uid).on("value",snap=>{
      if(snap.exists()){
        const d=snap.val();
        const data={nom:d.nom||"",quartier:d.quartier||"",adresse:d.adresse||"",
          tel:d.tel||"",ouverture:d.ouverture||"07:00",fermeture:d.fermeture||"22:00",
          ouvert:d.ouvert!==false};
        setInfo(data); setTmp(data);
      }
    });
    return()=>getDB().ref("pharmacies/"+user.uid).off();
  },[user,fbReady]);

  const sauvegarder = async()=>{
    setSaving(true);
    try{
      await getDB().ref("pharmacies/"+user.uid).update({...tmp,updatedAt:Date.now()});
      setInfo(tmp); setEdit(false); setSaved(true);
      setTimeout(()=>setSaved(false),3000);
    }catch(e){ alert("Erreur de sauvegarde : "+e.message); }
    setSaving(false);
  };

  const toggleOuvert = async()=>{
    const newVal=!info.ouvert;
    setInfo(i=>({...i,ouvert:newVal}));
    await getDB().ref("pharmacies/"+user.uid).update({ouvert:newVal,updatedAt:Date.now()});
  };

  const set=(k,v)=>setTmp(f=>({...f,[k]:v}));

  return(
    <div className="main">
      <div className="page-title mb20">⚙️ Ma Pharmacie</div>

      {saved&&<div className="alert alert-success mb16"><span className="alert-ico">✅</span><span>Informations mises à jour — visibles par les patients en temps réel !</span></div>}

      {/* Statut ouvert/fermé — toujours visible */}
      <div className="card mb16" style={{padding:"16px 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:700,fontSize:"0.9rem",color:"var(--navy)"}}>Statut de la pharmacie</div>
            <div style={{fontSize:"0.8rem",color:"var(--grey-text)",marginTop:2}}>
              Les patients voient ce statut en temps réel
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontWeight:700,color:info.ouvert?"#059669":"#DC2626",fontSize:"0.9rem"}}>
              {info.ouvert?"🟢 Ouverte":"🔴 Fermée"}
            </span>
            <button onClick={toggleOuvert} style={{
              background:info.ouvert?"#059669":"#DC2626",
              color:"white",border:"none",padding:"8px 18px",
              borderRadius:99,cursor:"pointer",fontWeight:700,
              fontFamily:"Mulish",fontSize:"0.82rem"
            }}>
              {info.ouvert?"Marquer Fermée":"Marquer Ouverte"}
            </button>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="card form-card">
        <div className="profile-header">
          <div className="avatar">🏥</div>
          <div>
            <div className="profile-name">{info.nom||"Ma Pharmacie"}</div>
            <div className="profile-status">
              <span className="status-dot online"></span>
              {info.quartier||"Yaoundé"} · {info.tel||"Pas de téléphone"}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{marginLeft:"auto"}}
            onClick={()=>{setEdit(!edit);setTmp(info);}}>
            {edit?"Annuler":"✏️ Modifier"}
          </button>
        </div>
        <hr className="divider"/>

        {edit?(
          <>
            <div className="form-group">
              <label className="form-label">Nom de la pharmacie</label>
              <input className="form-input" value={tmp.nom} onChange={e=>set("nom",e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Numéro de téléphone</label>
              <input className="form-input" type="tel" placeholder="699 123 456" value={tmp.tel} onChange={e=>set("tel",e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Quartier</label>
              <select className="form-input" value={tmp.quartier} onChange={e=>set("quartier",e.target.value)}>
                <option value="">Sélectionner...</option>
                {QUARTIERS.map(q=><option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Adresse précise</label>
              <input className="form-input" placeholder="ex: Face au marché central" value={tmp.adresse} onChange={e=>set("adresse",e.target.value)}/>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Heure d'ouverture</label>
                <input className="form-input" type="time" value={tmp.ouverture} onChange={e=>set("ouverture",e.target.value)}/>
              </div>
              <div className="form-group">
                <label className="form-label">Heure de fermeture</label>
                <input className="form-input" type="time" value={tmp.fermeture} onChange={e=>set("fermeture",e.target.value)}/>
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={sauvegarder} disabled={saving}>
              {saving?"⏳ Enregistrement...":"✅ Enregistrer les modifications"}
            </button>
          </>
        ):(
          <>
            {[
              {ico:"📛",lbl:"Nom",          val:info.nom||"—"},
              {ico:"📞",lbl:"Téléphone",    val:info.tel||"— (À renseigner !)"},
              {ico:"🏘",lbl:"Quartier",     val:info.quartier||"—"},
              {ico:"📍",lbl:"Adresse",      val:info.adresse||"—"},
              {ico:"🕐",lbl:"Horaires",     val:(info.ouverture||"07:00")+" – "+(info.fermeture||"22:00")},
            ].map((r,i)=>(
              <div key={i} className="info-row">
                <span className="info-lbl">{r.ico} {r.lbl}</span>
                <span className="info-val" style={{color:r.lbl==="Téléphone"&&!info.tel?"#DC2626":undefined}}>
                  {r.val}
                </span>
              </div>
            ))}
            {!info.tel&&(
              <div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,padding:"10px 14px",marginTop:12,fontSize:"0.8rem",color:"#991B1B"}}>
                ⚠️ <strong>Téléphone manquant</strong> — Les patients ne peuvent pas vous appeler. Cliquez sur "Modifier" pour l'ajouter.
              </div>
            )}
            <div className="mt16">
              <div className="alert alert-success">
                <span className="alert-ico">🔥</span>
                <span><strong>Synchronisé en temps réel</strong> — Toute modification est visible immédiatement par les patients de Yaoundé</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🔝 TOPBAR
// ══════════════════════════════════════════════════════════════════════════════
function usePWAInstall() {
  const [prompt,setPrompt]=useState(null);
  const [installed,setInstalled]=useState(
    ()=>window.matchMedia("(display-mode: standalone)").matches||
        window.navigator.standalone===true
  );
  useEffect(()=>{
    if(window.__pwaPrompt){setPrompt(window.__pwaPrompt);}
    window.__pwaPromptReady=(e)=>setPrompt(e);
    const h=(e)=>{e.preventDefault();setPrompt(e);window.__pwaPrompt=e;};
    window.addEventListener("beforeinstallprompt",h);
    window.addEventListener("appinstalled",()=>{setInstalled(true);setPrompt(null);});
    return()=>window.removeEventListener("beforeinstallprompt",h);
  },[]);
  const install=async()=>{
    const p=prompt||window.__pwaPrompt;
    if(p){p.prompt();const{outcome}=await p.userChoice;if(outcome==="accepted")setInstalled(true);setPrompt(null);}
  };
  return{prompt,installed,install};
}

function Topbar({ role, setRole, setPage, user, onLogout, onAdminOpen, isDemoMode, setIsDemoMode }) {
  const [clicks,setClicks]=useState(0);
  const {prompt,installed,install}=usePWAInstall();
  const handleLogoClick=()=>{ const n=clicks+1; setClicks(n); if(n>=5){onAdminOpen();setClicks(0);} setTimeout(()=>setClicks(0),3000); };
  const [showGuide,setShowGuide]=useState(false);
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleInstallClick=async()=>{
    if(prompt){await install();}
    else{setShowGuide(g=>!g);}
  };

  return(
    <>
    <div className="topbar">
      <div className="topbar-logo" onClick={handleLogoClick} style={{cursor:"pointer"}}>
        Medic<span>online</span>
        <span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",fontFamily:"Mulish",fontWeight:400,marginLeft:8}}>📍 Yaoundé</span>
        {clicks>0&&clicks<5&&<span style={{fontSize:"0.55rem",marginLeft:6,opacity:0.5}}>{clicks}/5</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {/* Bouton Mode Démo */}
        <button onClick={()=>setIsDemoMode(d=>!d)} style={{
          background: isDemoMode?"#F59E0B":"rgba(255,255,255,0.12)",
          border: isDemoMode?"2px solid #F59E0B":"1px solid rgba(255,255,255,0.3)",
          color:"white",padding:"5px 11px",borderRadius:99,fontSize:"0.72rem",
          cursor:"pointer",fontFamily:"Mulish",fontWeight:700,whiteSpace:"nowrap",
          display:"flex",alignItems:"center",gap:4,transition:"all 0.2s"
        }}>
          {isDemoMode?"⏹ Quitter démo":"▶ Démo"}
        </button>
        {!installed&&(
          <button onClick={handleInstallClick} style={{
            background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.35)",
            color:"white",padding:"5px 11px",borderRadius:99,fontSize:"0.72rem",
            cursor:"pointer",fontFamily:"Mulish",fontWeight:700,whiteSpace:"nowrap",
            display:"flex",alignItems:"center",gap:4
          }}>📲 Installer</button>
        )}
        {installed&&<span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)"}}>✅ Installée</span>}
        {!user&&<div className="role-switch">
          <button className={"role-btn"+(role==="patient"?" active":"")} onClick={()=>{setRole("patient");setPage("accueil");}}>👤 Patient</button>
          <button className={"role-btn"+(role==="pharmacie"?" active":"")} onClick={()=>{setRole("pharmacie");setPage("dashboard");}}>🏥 Pharmacie</button>
        </div>}
        {user&&<div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.78rem"}}>🏥 {user.nomPharmacie||user.email}</span>
          <button className="btn btn-secondary btn-sm" onClick={onLogout}>Déconnexion</button>
        </div>}
      </div>
    </div>

    {/* Bannière Mode Démo */}
    {isDemoMode&&(
      <div style={{
        background:"linear-gradient(90deg,#F59E0B,#D97706)",
        padding:"8px 16px",display:"flex",alignItems:"center",
        justifyContent:"space-between",flexWrap:"wrap",gap:8
      }}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"1.1rem"}}>🎭</span>
          <div>
            <span style={{color:"#1C1917",fontWeight:800,fontSize:"0.82rem",fontFamily:"Mulish"}}>
              MODE DÉMO ACTIVÉ
            </span>
            <span style={{color:"#44403C",fontSize:"0.75rem",fontFamily:"Mulish",marginLeft:8}}>
              Données fictives · Fonctionne sans internet · Parfait pour vos présentations
            </span>
          </div>
        </div>
        <button onClick={()=>setIsDemoMode(false)} style={{
          background:"rgba(0,0,0,0.15)",border:"none",color:"#1C1917",
          padding:"4px 12px",borderRadius:99,cursor:"pointer",
          fontSize:"0.75rem",fontFamily:"Mulish",fontWeight:700
        }}>Quitter la démo</button>
      </div>
    )}
    {/* Guide d'installation — toujours disponible */}
    {showGuide&&!installed&&(
      <div style={{background:"#0D2B3E",padding:"16px 20px",borderBottom:"3px solid #0A7B6C",position:"relative",zIndex:50}}>
        <button onClick={()=>setShowGuide(false)} style={{position:"absolute",top:10,right:14,background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"1.3rem",cursor:"pointer",lineHeight:1}}>✕</button>
        <div style={{color:"white",fontWeight:800,fontSize:"0.95rem",fontFamily:"Syne",marginBottom:12}}>📱 Installer Mediconline en 3 secondes</div>
        {isIOS?(
          <div style={{color:"rgba(255,255,255,0.9)",fontSize:"0.82rem",fontFamily:"Mulish",lineHeight:2}}>
            <div>1️⃣ Ouvre ce site dans <strong style={{color:"#4DB8FF"}}>Safari</strong> (pas Chrome)</div>
            <div>2️⃣ Appuie sur <strong style={{color:"#0A7B6C"}}>le bouton Partager ⬆️</strong> en bas</div>
            <div>3️⃣ Appuie sur <strong style={{color:"#0A7B6C"}}>"Sur l'écran d'accueil"</strong></div>
            <div>4️⃣ Appuie sur <strong style={{color:"#0A7B6C"}}>"Ajouter"</strong> ✅</div>
          </div>
        ):(
          <div style={{color:"rgba(255,255,255,0.9)",fontSize:"0.82rem",fontFamily:"Mulish",lineHeight:2}}>
            <div>1️⃣ Ouvre ce site dans <strong style={{color:"#4DB8FF"}}>Google Chrome</strong></div>
            <div>2️⃣ Appuie sur les <strong style={{color:"#0A7B6C"}}>3 points ⋮</strong> en haut à droite</div>
            <div>3️⃣ Appuie sur <strong style={{color:"#0A7B6C"}}>"Ajouter à l'écran d'accueil"</strong></div>
            <div>4️⃣ Appuie sur <strong style={{color:"#0A7B6C"}}>"Ajouter"</strong> ✅</div>
            <div style={{marginTop:8,padding:"8px 12px",background:"rgba(255,255,255,0.08)",borderRadius:8,fontSize:"0.75rem",color:"rgba(255,255,255,0.6)"}}>
              💡 Tu utilises Samsung Browser ? L'option s'appelle <strong>"Ajouter page à"</strong> → "Écran d'accueil"
            </div>
          </div>
        )}
      </div>
    )}
    </>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// 📊 PAGE ADMIN — Vue globale de toutes les pharmacies inscrites
// ══════════════════════════════════════════════════════════════════════════════
function PageAdmin({ setPage }) {
  const fbReady=useFirebaseReady();
  const [pharmacies,setPharmacies]=useState([]);
  const [stats,setStats]=useState({total:0,ouvertes:0,totalItems:0});
  const [mdp,setMdp]=useState(""); const [auth,setAuth]=useState(false);
  const [notifications,setNotifications]=useState([]);
  const [onglet,setOnglet]=useState("validation"); // "validation" | "toutes"
  const [actionLoading,setActionLoading]=useState("");

  // Charger notifications admin
  useEffect(()=>{
    if(!fbReady||!auth) return;
    getDB().ref("admin_notifications").orderByChild("lu").equalTo(false).on("value",snap=>{
      if(snap.exists()) setNotifications(Object.entries(snap.val()).map(([k,v])=>({...v,key:k})));
      else setNotifications([]);
    });
    return()=>getDB().ref("admin_notifications").off();
  },[fbReady,auth]);

  const validerPharmacie = async(pharmacieId, nom)=>{
    setActionLoading(pharmacieId);
    await getDB().ref("pharmacies/"+pharmacieId).update({
      statut:"verifie", verified:true, verifiedAt:Date.now(), ouvert:true
    });
    // Marquer notification lue
    const notif = notifications.find(n=>n.pharmacieId===pharmacieId);
    if(notif) await getDB().ref("admin_notifications/"+notif.key).update({lu:true});
    // Envoyer rappel de bienvenue à la pharmacie
    await getDB().ref("rappels/"+pharmacieId).push({
      message:"🎉 Votre pharmacie a été vérifiée et est maintenant visible par tous les patients de Yaoundé !",
      lu:false, date:Date.now(), type:"validation"
    });
    setActionLoading("");
  };

  const rejeterPharmacie = async(pharmacieId)=>{
    setActionLoading(pharmacieId);
    const raison = window.prompt("Raison du rejet (sera transmise à la pharmacie) :");
    if(!raison) { setActionLoading(""); return; }
    await getDB().ref("pharmacies/"+pharmacieId).update({
      statut:"suspendu", verifiedAt:Date.now()
    });
    await getDB().ref("rappels/"+pharmacieId).push({
      message:"⚠️ Votre compte n'a pas pu être validé : "+raison+". Contactez support@mediconline.cm",
      lu:false, date:Date.now(), type:"rejet"
    });
    const notif = notifications.find(n=>n.pharmacieId===pharmacieId);
    if(notif) await getDB().ref("admin_notifications/"+notif.key).update({lu:true});
    setActionLoading("");
  };

  const suspendre = async(pharmacieId)=>{
    if(!window.confirm("Suspendre cette pharmacie ?")) return;
    await getDB().ref("pharmacies/"+pharmacieId).update({statut:"suspendu"});
  };

  const reactiver = async(pharmacieId)=>{
    await getDB().ref("pharmacies/"+pharmacieId).update({statut:"verifie"});
  };

  const supprimerPharmacie = async(pharmacieId, nom)=>{
    const confirmation = window.prompt(
      `⚠️ SUPPRESSION DÉFINITIVE\n\nTapez le nom exact de la pharmacie pour confirmer :\n"${nom}"`
    );
    if(confirmation === null) return; // annulé
    if(confirmation.trim() !== nom.trim()){
      alert("Nom incorrect. Suppression annulée.\nVous avez tapé : \""+confirmation+"\"\nNom attendu : \""+nom+"\"");
      return;
    }
    setActionLoading(pharmacieId);

    // Suppression via Firebase REST API avec la clé secrète (contourne les règles)
    const BASE = "https://mediconline-15d7f-default-rtdb.firebaseio.com";
    const SECRET = ""; // laisser vide = utilise les règles publiques actuelles

    const supprFB = async(chemin)=>{
      const url = BASE+"/"+chemin+".json"+(SECRET?"?auth="+SECRET:"");
      try{
        await fetch(url, {method:"DELETE"});
      }catch(e){ console.warn("Erreur suppression "+chemin, e); }
    };

    try{
      await Promise.all([
        supprFB("pharmacies/"+pharmacieId),
        supprFB("stock/"+pharmacieId),
        supprFB("signalements/"+pharmacieId),
        supprFB("rappels/"+pharmacieId),
        supprFB("reservations/"+pharmacieId),
      ]);
      // Supprimer aussi via SDK Firebase (double sécurité)
      try{
        await getDB().ref("pharmacies/"+pharmacieId).remove();
        await getDB().ref("stock/"+pharmacieId).remove();
      }catch(e2){ /* ignoré si déjà supprimé */ }

      // Retirer des notifications admin
      const notif = notifications.find(n=>n.pharmacieId===pharmacieId);
      if(notif){
        await supprFB("admin_notifications/"+notif.key);
        try{ await getDB().ref("admin_notifications/"+notif.key).remove(); }catch(e){}
      }

      // Rafraîchir la liste
      setPharmacies(prev => prev.filter(p => p.uid !== pharmacieId));
      setNotifications(prev => prev.filter(n => n.pharmacieId !== pharmacieId));
      alert(`✅ Pharmacie "${nom}" supprimée définitivement.`);
    }catch(e){
      alert("Erreur lors de la suppression : "+e.message+"\n\nVérifiez votre connexion internet.");
    }
    setActionLoading("");
  };

  useEffect(()=>{
    if(!fbReady||!auth)return;
    const r=getDB().ref("pharmacies");
    r.on("value",async snap=>{
      if(!snap.exists()){setPharmacies([]);return;}
      const list=[];
      const entries=Object.entries(snap.val());
      for(const [uid,ph] of entries){
        const stockSnap=await getDB().ref("stock/"+uid).once("value");
        const nbMeds=stockSnap.exists()?Object.keys(stockSnap.val()).length:0;
        list.push({uid,...ph,nbMeds});
      }
      list.sort((a,b)=>b.createdAt-a.createdAt);
      setPharmacies(list);
      setStats({
        total:list.length,
        ouvertes:list.filter(p=>p.ouvert!==false).length,
        totalItems:list.reduce((s,p)=>s+p.nbMeds,0)
      });
    });
    return()=>r.off();
  },[fbReady,auth]);

  if(!auth) return(
    <div className="main">
      <div className="auth-card" style={{maxWidth:340,margin:"60px auto"}}>
        <div className="auth-logo">Admin</div>
        <div className="auth-sub">Accès réservé</div>
        <div className="form-group" style={{marginTop:20}}>
          <input className="form-input" type="password" placeholder="Mot de passe admin" value={mdp} onChange={e=>setMdp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mdp==="medicolotus032tribune"?setAuth(true):alert("Mauvais mot de passe"))}/>
        </div>
        <button className="btn btn-primary btn-full" onClick={()=>mdp==="medicolotus032tribune"?setAuth(true):alert("Mauvais mot de passe")}>Accéder</button>
      </div>
    </div>
  );

  return(
    <div className="main">
      <div className="page-toprow mb20">
        <div><div className="page-title">📊 Dashboard Admin</div><div className="page-sub">Vue globale Mediconline — Yaoundé</div></div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setPage("accueil")}>← Accueil</button>
      </div>
      <div className="grid-4 mb24">
        {[
          {ico:"🏥",num:stats.total,lbl:"Pharmacies inscrites",bg:"#EBF4FF"},
          {ico:"✅",num:stats.ouvertes,lbl:"Pharmacies ouvertes",bg:"#E6FAF0"},
          {ico:"💊",num:stats.totalItems,lbl:"Médicaments publiés",bg:"#FFF4E6"},
          {ico:"🌍",num:"YDE",lbl:"Ville couverte",bg:"#F3E8FF"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{background:s.bg}}>{s.ico}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      {/* ── Onglets Admin ── */}
      <div style={{display:"flex",gap:4,marginBottom:16,background:"#F3F4F6",padding:4,borderRadius:10}}>
        {[
          {id:"validation", label:"⏳ À valider", count: notifications.length},
          {id:"toutes",     label:"🏥 Toutes les pharmacies", count: pharmacies.filter(p=>!p.isDemo).length},
        ].map(t=>(
          <button key={t.id} onClick={()=>setOnglet(t.id)} style={{
            flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",
            background:onglet===t.id?"white":"transparent",
            fontWeight:700,fontSize:"0.82rem",fontFamily:"Mulish",
            color:onglet===t.id?"var(--navy)":"var(--grey-text)",
            boxShadow:onglet===t.id?"0 1px 4px rgba(0,0,0,0.1)":"none",
          }}>
            {t.label} {t.count>0&&<span style={{background:onglet===t.id?"var(--teal)":"#9CA3AF",color:"white",borderRadius:99,padding:"1px 7px",fontSize:"0.72rem",marginLeft:4}}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Onglet validation ── */}
      {onglet==="validation"&&(
        <div className="card">
          <div className="card-header">
            <div className="card-title">⏳ Pharmacies en attente de validation</div>
          </div>
          {notifications.length===0?(
            <div style={{textAlign:"center",padding:"32px 0",color:"var(--grey-text)"}}>
              ✅ Aucune pharmacie en attente — tout est à jour !
            </div>
          ):(
            notifications.map(notif=>(
              <div key={notif.key} style={{border:"1px solid #FDE68A",borderRadius:10,padding:"16px",marginBottom:12,background:"#FFFBEB"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:"0.95rem",color:"var(--navy)"}}>{notif.nom}</div>
                    <div style={{fontSize:"0.8rem",color:"var(--grey-text)",marginTop:2}}>
                      📍 {notif.quartier} · 📞 {notif.tel||"Non renseigné"} · 📧 {notif.email}
                    </div>
                    <div style={{fontSize:"0.75rem",color:"var(--grey-text)",marginTop:2}}>
                      Inscrite le {new Date(notif.date).toLocaleDateString("fr-FR")} à {new Date(notif.date).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <button
                      onClick={()=>validerPharmacie(notif.pharmacieId, notif.nom)}
                      disabled={actionLoading===notif.pharmacieId}
                      style={{background:"#059669",color:"white",border:"none",padding:"8px 16px",borderRadius:99,fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:"Mulish"}}>
                      {actionLoading===notif.pharmacieId?"⏳...":"✅ Valider"}
                    </button>
                    <button
                      onClick={()=>rejeterPharmacie(notif.pharmacieId)}
                      disabled={actionLoading===notif.pharmacieId}
                      style={{background:"#F59E0B",color:"white",border:"none",padding:"8px 16px",borderRadius:99,fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:"Mulish"}}>
                      🚫 Rejeter
                    </button>
                    <button
                      onClick={()=>supprimerPharmacie(notif.pharmacieId, notif.nom)}
                      disabled={actionLoading===notif.pharmacieId}
                      style={{background:"#DC2626",color:"white",border:"none",padding:"8px 16px",borderRadius:99,fontWeight:700,cursor:"pointer",fontSize:"0.82rem",fontFamily:"Mulish"}}>
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
                <div style={{marginTop:10,background:"rgba(0,0,0,0.04)",borderRadius:6,padding:"8px 12px",fontSize:"0.78rem",color:"#78350F"}}>
                  💡 Avant de valider : appelez le <strong>{notif.tel||"numéro non renseigné"}</strong> pour confirmer que c'est une vraie pharmacie.
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Onglet toutes pharmacies ── */}
      {onglet==="toutes"&&(
        <div className="card">
          <div className="card-header"><div className="card-title">🏥 Toutes les pharmacies inscrites</div></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pharmacie</th><th>Quartier</th><th>Téléphone</th>
                  <th>Médicaments</th><th>Statut</th><th>Inscrite le</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.filter(p=>!p.isDemo).map(ph=>(
                  <tr key={ph.uid}>
                    <td className="td-name">{ph.nom}</td>
                    <td>📍 {ph.quartier}</td>
                    <td>{ph.tel||"—"}</td>
                    <td style={{fontWeight:700,color:"var(--teal)"}}>{ph.nbMeds} méd.</td>
                    <td>
                      <span style={{
                        padding:"3px 10px",borderRadius:99,fontSize:"0.72rem",fontWeight:700,
                        background:ph.statut==="verifie"?"#D1FAE5":ph.statut==="suspendu"?"#FEE2E2":"#FEF3C7",
                        color:ph.statut==="verifie"?"#065F46":ph.statut==="suspendu"?"#991B1B":"#92400E"
                      }}>
                        {ph.statut==="verifie"?"✅ Vérifiée":ph.statut==="suspendu"?"🚫 Suspendue":"⏳ En attente"}
                      </span>
                    </td>
                    <td style={{fontSize:"0.75rem",color:"var(--grey-text)"}}>{ph.createdAt?new Date(ph.createdAt).toLocaleDateString("fr-FR"):"—"}</td>
                    <td>
                      <div style={{display:"flex",gap:4"}}>
                        {ph.statut!=="verifie"&&<button onClick={()=>validerPharmacie(ph.uid,ph.nom)} style={{background:"#059669",color:"white",border:"none",padding:"3px 8px",borderRadius:6,cursor:"pointer",fontSize:"0.72rem"}}>✅</button>}
                        {ph.statut!=="suspendu"&&<button onClick={()=>suspendre(ph.uid)} style={{background:"#F59E0B",color:"white",border:"none",padding:"3px 8px",borderRadius:6,cursor:"pointer",fontSize:"0.72rem"}}>🚫</button>}
                        {ph.statut==="suspendu"&&<button onClick={()=>reactiver(ph.uid)} style={{background:"#0A7B6C",color:"white",border:"none",padding:"3px 8px",borderRadius:6,cursor:"pointer",fontSize:"0.72rem"}}>↺</button>}
                        <button
                          onClick={()=>supprimerPharmacie(ph.uid, ph.nom)}
                          disabled={actionLoading===ph.uid}
                          title="Supprimer définitivement"
                          style={{background:"#DC2626",color:"white",border:"none",padding:"3px 8px",borderRadius:6,cursor:"pointer",fontSize:"0.72rem"}}>
                          {actionLoading===ph.uid?"⏳":"🗑"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pharmacies.filter(p=>!p.isDemo).length===0&&(
                  <tr><td colSpan={7} style={{textAlign:"center",padding:24,color:"var(--grey-text)"}}>Aucune pharmacie inscrite pour l'instant</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 📱 PAGE QR CODE — À afficher/imprimer en pharmacie
// ══════════════════════════════════════════════════════════════════════════════
function PageQRCode() {
  return(
    <div className="main" style={{maxWidth:500,margin:"0 auto"}}>
      <div className="card" style={{textAlign:"center",padding:"40px 30px"}}>
        <div style={{fontSize:"3rem",marginBottom:12}}>📱</div>
        <div style={{fontSize:"1.4rem",fontWeight:800,color:"var(--navy)",marginBottom:6}}>Scannez pour trouver<br/>vos médicaments</div>
        <div style={{color:"var(--grey-text)",fontSize:"0.9rem",marginBottom:24}}>Comparez les prix dans les pharmacies de Yaoundé</div>
        
        {/* QR Code SVG généré inline */}
        <div style={{background:"white",border:"3px solid var(--teal)",borderRadius:12,padding:16,display:"inline-block",marginBottom:20}}>
          <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
            {/* QR Code simplifié pour mediconline.netlify.app */}
            <rect width="180" height="180" fill="white"/>
            {/* Coin haut-gauche */}
            <rect x="10" y="10" width="50" height="50" fill="none" stroke="#0D2B3E" strokeWidth="6"/>
            <rect x="22" y="22" width="26" height="26" fill="#0D2B3E"/>
            {/* Coin haut-droite */}
            <rect x="120" y="10" width="50" height="50" fill="none" stroke="#0D2B3E" strokeWidth="6"/>
            <rect x="132" y="22" width="26" height="26" fill="#0D2B3E"/>
            {/* Coin bas-gauche */}
            <rect x="10" y="120" width="50" height="50" fill="none" stroke="#0D2B3E" strokeWidth="6"/>
            <rect x="22" y="132" width="26" height="26" fill="#0D2B3E"/>
            {/* Data modules */}
            {[
              [70,10],[80,10],[90,10],[100,10],[70,20],[90,20],[100,20],
              [70,30],[80,30],[100,30],[70,40],[90,40],[80,50],[90,50],[100,50],
              [70,70],[80,70],[70,80],[90,80],[100,80],[110,80],[70,90],[100,90],
              [70,100],[80,100],[90,100],[110,100],[80,110],[100,110],[110,110],
              [120,70],[130,70],[150,70],[160,70],[120,80],[140,80],[160,80],
              [120,90],[130,90],[150,90],[120,100],[140,100],[160,100],
              [130,110],[150,110],[160,110],[120,120],[140,120],
            ].map(([x,y],i)=><rect key={i} x={x} y={y} width="8" height="8" fill="#0D2B3E"/>)}
            {/* Logo centre */}
            <rect x="76" y="76" width="28" height="28" rx="4" fill="#0A7B6C"/>
            <text x="90" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">M</text>
          </svg>
        </div>

        <div style={{background:"var(--light-bg)",borderRadius:10,padding:"12px 20px",marginBottom:20}}>
          <div style={{fontSize:"0.8rem",color:"var(--grey-text)",marginBottom:4}}>Ou tapez l'adresse :</div>
          <div style={{fontSize:"1.1rem",fontWeight:800,color:"var(--teal)"}}>mediconline.netlify.app</div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
          {["💊 200+ médicaments","🏥 45+ pharmacies","📍 Yaoundé","🆓 Gratuit"].map((t,i)=>(
            <span key={i} className="chip active" style={{fontSize:"0.78rem"}}>{t}</span>
          ))}
        </div>

        <div style={{background:"#E6FAF0",borderRadius:8,padding:"10px 16px",fontSize:"0.82rem",color:"var(--navy)"}}>
          <strong>Vous êtes pharmacien ?</strong><br/>
          Inscrivez votre pharmacie gratuitement et publiez vos stocks en temps réel !
        </div>

        <button className="btn btn-primary btn-full" style={{marginTop:20}} onClick={()=>window.print()}>
          🖨️ Imprimer ce QR Code
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🚀 APP PRINCIPALE
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const fbReady=useFirebaseReady();
  const [user,setUser]=useState(null); const [authChecked,setAuthChecked]=useState(false);
  const [role,setRole]=useState("patient"); const [page,setPage]=useState("accueil");
  const [isDemoMode,setIsDemoMode]=useState(false);
  const [recherche,setRecherche]=useState(""); const [stock,setStock]=useState([]);
  const [adminOpen,setAdminOpen]=useState(false);
  useEffect(()=>{
    if(!fbReady)return;
    const unsub=getAuth().onAuthStateChanged(async fu=>{
      if(fu){const snap=await getDB().ref("users/"+fu.uid).get();const d=snap.val()||{};const u={uid:fu.uid,email:fu.email,role:d.role||"patient",nomPharmacie:d.nom};setUser(u);setRole(u.role);setPage(u.role==="pharmacie"?"dashboard":"accueil");}
      else{setUser(null);}setAuthChecked(true);
    });
    return()=>unsub();
  },[fbReady]);
  useEffect(()=>{
    if(!fbReady||!user||user.role!=="pharmacie")return;
    const r=getDB().ref("stock/"+user.uid);
    r.on("value",snap=>{setStock(snap.exists()?Object.entries(snap.val()).map(([itemId,item])=>({itemId,...item})):[]); });
    return()=>r.off();
  },[fbReady,user]);
  const handleAuth=u=>{setUser(u);setRole("pharmacie");setPage("dashboard");};
  const handleLogout=async()=>{await getAuth().signOut();setUser(null);setRole("patient");setPage("accueil");setStock([]);};
  if(!fbReady||!authChecked)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div className="loading"><div className="spinner"></div> Chargement Mediconline...</div></div>;
  const TABS_PATIENT=[{id:"accueil",label:"🏠 Accueil"},{id:"carte",label:"🗺 Carte"},{id:"garde",label:"🌙 Garde"},{id:"resultats",label:"🔍 Chercher"},{id:"compte",label:"👤 Compte"}];
  const TABS_PH=[{id:"dashboard",label:"📊 Dashboard"},{id:"stock",label:"📦 Stock"},{id:"ajouter",label:"➕ Ajouter"},{id:"carte",label:"🗺 Carte"},{id:"garde",label:"🌙 Garde"},{id:"profil",label:"⚙️ Profil"}];
  const tabs=role==="patient"?TABS_PATIENT:TABS_PH;
  return(
    <div className="app">
      <Topbar role={role} setRole={setRole} setPage={setPage} user={user} onLogout={handleLogout} onAdminOpen={()=>setAdminOpen(true)} isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode}/>
      {adminOpen&&<PageAdmin onClose={()=>setAdminOpen(false)}/>}
      <div style={{
        display:"flex",background:"white",
        borderBottom:"2px solid #E8EDF2",
        overflowX:"auto",scrollbarWidth:"none",
        position:"sticky",top:0,zIndex:40,
        WebkitOverflowScrolling:"touch"
      }}>
        {tabs.map(t=>(
          <div key={t.id}
            onClick={()=>setPage(t.id)}
            style={{
              flex:"1 1 0",minWidth:0,
              padding:"13px 4px",
              fontSize:"0.72rem",fontWeight:700,
              fontFamily:"Mulish",
              textAlign:"center",
              cursor:"pointer",
              whiteSpace:"nowrap",
              overflow:"hidden",
              textOverflow:"ellipsis",
              color: page===t.id?"#0A7B6C":"#8899AA",
              borderBottom: page===t.id?"3px solid #0A7B6C":"3px solid transparent",
              background: page===t.id?"#F4FBF9":"white",
              transition:"all 0.15s"
            }}>
            {t.label}
          </div>
        ))}
      </div>
      {role==="patient"&&page==="accueil"   &&<AccueilPatient setPage={setPage} setRecherche={setRecherche} isDemoMode={isDemoMode}/>}
      {role==="patient"&&page==="carte"     &&<PageCarte/>}
      {role==="patient"&&page==="garde"     &&<PageGarde setPage={setPage}/>}
      {role==="patient"&&page==="resultats" &&<ResultatsPatient recherche={recherche||"Paracétamol"} setPage={setPage} isDemoMode={isDemoMode} user={user}/>}
      {role==="patient"&&page==="compte"&&!user&&<AuthPatient onAuth={u=>{setUser(u);setRole("patient");setPage("accueil");}} onSkip={()=>setPage("accueil")}/>}
      {role==="patient"&&page==="compte"&&user&&user.role==="patient"&&<ProfilPatient user={user} onLogout={()=>{getAuth().signOut();setUser(null);setRole("patient");setPage("accueil");}}/>}
      {role==="pharmacie"&&!user            &&<AuthScreen onAuth={handleAuth}/>}
      {role==="pharmacie"&&user&&page==="dashboard"&&<Dashboard stock={stock} setPage={setPage} user={user}/>}
      {role==="pharmacie"&&user&&page==="stock"    &&<GestionStock stock={stock} user={user} setPage={setPage}/>}
      {role==="pharmacie"&&user&&page==="ajouter"  &&<AjouterMedicament user={user} setPage={setPage}/>}
      {role==="pharmacie"&&user&&page==="carte"    &&<PageCarte/>}
      {role==="pharmacie"&&user&&page==="garde"    &&<PageGarde setPage={setPage}/>}
      {role==="pharmacie"&&user&&page==="profil"   &&<ProfilPharmacie user={user}/>}
      {page==="admin"  &&<PageAdmin setPage={setPage}/>}
      {page==="qrcode" &&<PageQRCode/>}
    </div>
  );
}
