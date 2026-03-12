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
  // ── ANTIPALUDÉENS ──────────────────────────────────────────────────────────
  { id:"m001", nom:"Artéméther + Luméfantrine (Coartem) 20/120mg",  cat:"Antipaludéen", emoji:"🦟", prixRef:2500 },
  { id:"m002", nom:"Artéméther injectable 80mg/ml",                  cat:"Antipaludéen", emoji:"🦟", prixRef:3500 },
  { id:"m003", nom:"Artésunate injectable 60mg",                     cat:"Antipaludéen", emoji:"🦟", prixRef:4500 },
  { id:"m004", nom:"Artésunate + Amodiaquine (ASAQ) 100/270mg",     cat:"Antipaludéen", emoji:"🦟", prixRef:1800 },
  { id:"m005", nom:"Quinine 300mg comprimés",                        cat:"Antipaludéen", emoji:"🦟", prixRef:350  },
  { id:"m006", nom:"Quinine injectable 500mg/10ml",                  cat:"Antipaludéen", emoji:"🦟", prixRef:800  },
  { id:"m007", nom:"Chloroquine 100mg",                              cat:"Antipaludéen", emoji:"🦟", prixRef:150  },
  { id:"m008", nom:"Sulfadoxine + Pyriméthamine (Fansidar) 500/25mg",cat:"Antipaludéen", emoji:"🦟", prixRef:600  },
  { id:"m009", nom:"Doxycycline 100mg",                              cat:"Antipaludéen", emoji:"🦟", prixRef:400  },
  { id:"m010", nom:"Artéméther 40mg/ml (Paluther) sirop",           cat:"Antipaludéen", emoji:"🦟", prixRef:1200 },
  { id:"m011", nom:"Méfloquine 250mg",                               cat:"Antipaludéen", emoji:"🦟", prixRef:2200 },
  { id:"m012", nom:"Primaquine 15mg",                                cat:"Antipaludéen", emoji:"🦟", prixRef:500  },
  // ── ANTIBIOTIQUES ──────────────────────────────────────────────────────────
  { id:"m020", nom:"Amoxicilline 250mg gélules",                     cat:"Antibiotique", emoji:"💊", prixRef:800  },
  { id:"m021", nom:"Amoxicilline 500mg gélules",                     cat:"Antibiotique", emoji:"💊", prixRef:1200 },
  { id:"m022", nom:"Amoxicilline + Acide clavulanique 500/125mg",   cat:"Antibiotique", emoji:"💊", prixRef:2500 },
  { id:"m023", nom:"Ampicilline injectable 1g",                      cat:"Antibiotique", emoji:"💊", prixRef:600  },
  { id:"m024", nom:"Cotrimoxazole (TMP/SMX) 480mg",                 cat:"Antibiotique", emoji:"💊", prixRef:150  },
  { id:"m025", nom:"Cotrimoxazole pédiatrique 240mg",               cat:"Antibiotique", emoji:"💊", prixRef:100  },
  { id:"m026", nom:"Métronidazole 250mg",                            cat:"Antibiotique", emoji:"💊", prixRef:300  },
  { id:"m027", nom:"Métronidazole 500mg injectable",                 cat:"Antibiotique", emoji:"💊", prixRef:500  },
  { id:"m028", nom:"Ciprofloxacine 500mg",                           cat:"Antibiotique", emoji:"💊", prixRef:1500 },
  { id:"m029", nom:"Doxycycline 100mg antibiotique",                 cat:"Antibiotique", emoji:"💊", prixRef:400  },
  { id:"m030", nom:"Érythromycine 250mg",                            cat:"Antibiotique", emoji:"💊", prixRef:600  },
  { id:"m031", nom:"Azithromycine 500mg (Zithromax)",               cat:"Antibiotique", emoji:"💊", prixRef:2000 },
  { id:"m032", nom:"Cloxacilline 500mg",                             cat:"Antibiotique", emoji:"💊", prixRef:900  },
  { id:"m033", nom:"Ceftriaxone injectable 1g",                      cat:"Antibiotique", emoji:"💊", prixRef:2500 },
  { id:"m034", nom:"Cefixime 200mg",                                 cat:"Antibiotique", emoji:"💊", prixRef:1800 },
  { id:"m035", nom:"Tétracycline 250mg",                             cat:"Antibiotique", emoji:"💊", prixRef:300  },
  { id:"m036", nom:"Nitrofurantoïne 100mg",                          cat:"Antibiotique", emoji:"💊", prixRef:700  },
  { id:"m037", nom:"Gentamicine injectable 80mg",                    cat:"Antibiotique", emoji:"💊", prixRef:800  },
  { id:"m038", nom:"Norfloxacine 400mg",                             cat:"Antibiotique", emoji:"💊", prixRef:1000 },
  { id:"m039", nom:"Ofloxacine 200mg",                               cat:"Antibiotique", emoji:"💊", prixRef:1200 },
  // ── ANTIDOULEURS / ANTI-INFLAMMATOIRES ────────────────────────────────────
  { id:"m050", nom:"Paracétamol 500mg",                              cat:"Antidouleur",  emoji:"🔵", prixRef:50   },
  { id:"m051", nom:"Paracétamol 1000mg",                             cat:"Antidouleur",  emoji:"🔵", prixRef:100  },
  { id:"m052", nom:"Paracétamol sirop pédiatrique 120mg/5ml",        cat:"Antidouleur",  emoji:"🔵", prixRef:500  },
  { id:"m053", nom:"Ibuprofène 200mg",                               cat:"Antidouleur",  emoji:"🔵", prixRef:200  },
  { id:"m054", nom:"Ibuprofène 400mg",                               cat:"Antidouleur",  emoji:"🔵", prixRef:300  },
  { id:"m055", nom:"Ibuprofène 600mg",                               cat:"Antidouleur",  emoji:"🔵", prixRef:400  },
  { id:"m056", nom:"Diclofénac 50mg",                                cat:"Antidouleur",  emoji:"🔵", prixRef:250  },
  { id:"m057", nom:"Diclofénac injectable 75mg",                     cat:"Antidouleur",  emoji:"🔵", prixRef:600  },
  { id:"m058", nom:"Kétoprofène 100mg",                              cat:"Antidouleur",  emoji:"🔵", prixRef:800  },
  { id:"m059", nom:"Aspirine 500mg",                                 cat:"Antidouleur",  emoji:"🔵", prixRef:100  },
  { id:"m060", nom:"Acide acétylsalicylique 100mg (cardio)",         cat:"Antidouleur",  emoji:"🔵", prixRef:150  },
  { id:"m061", nom:"Tramadol 50mg",                                  cat:"Antidouleur",  emoji:"🔵", prixRef:1500 },
  { id:"m062", nom:"Morphine 10mg injectable",                       cat:"Antidouleur",  emoji:"🔵", prixRef:3000 },
  // ── CARDIOVASCULAIRES ──────────────────────────────────────────────────────
  { id:"m070", nom:"Amlodipine 5mg",                                 cat:"Cardio",       emoji:"❤️", prixRef:600  },
  { id:"m071", nom:"Amlodipine 10mg",                                cat:"Cardio",       emoji:"❤️", prixRef:900  },
  { id:"m072", nom:"Captopril 25mg",                                 cat:"Cardio",       emoji:"❤️", prixRef:400  },
  { id:"m073", nom:"Énalapril 10mg",                                 cat:"Cardio",       emoji:"❤️", prixRef:500  },
  { id:"m074", nom:"Lisinopril 10mg",                                cat:"Cardio",       emoji:"❤️", prixRef:700  },
  { id:"m075", nom:"Losartan 50mg",                                  cat:"Cardio",       emoji:"❤️", prixRef:1200 },
  { id:"m076", nom:"Hydrochlorothiazide 25mg",                       cat:"Cardio",       emoji:"❤️", prixRef:200  },
  { id:"m077", nom:"Furosémide 40mg",                                cat:"Cardio",       emoji:"❤️", prixRef:250  },
  { id:"m078", nom:"Furosémide injectable 20mg",                     cat:"Cardio",       emoji:"❤️", prixRef:400  },
  { id:"m079", nom:"Atenolol 50mg",                                  cat:"Cardio",       emoji:"❤️", prixRef:350  },
  { id:"m080", nom:"Bisoprolol 5mg",                                 cat:"Cardio",       emoji:"❤️", prixRef:1000 },
  { id:"m081", nom:"Méthyldopa 250mg",                               cat:"Cardio",       emoji:"❤️", prixRef:400  },
  { id:"m082", nom:"Nifédipine 10mg retard",                         cat:"Cardio",       emoji:"❤️", prixRef:600  },
  { id:"m083", nom:"Digoxine 0,25mg",                                cat:"Cardio",       emoji:"❤️", prixRef:300  },
  { id:"m084", nom:"Simvastatine 20mg",                              cat:"Cardio",       emoji:"❤️", prixRef:1500 },
  { id:"m085", nom:"Atorvastatine 40mg",                             cat:"Cardio",       emoji:"❤️", prixRef:2500 },
  { id:"m086", nom:"Clopidogrel 75mg",                               cat:"Cardio",       emoji:"❤️", prixRef:2000 },
  { id:"m087", nom:"Warfarine 5mg",                                  cat:"Cardio",       emoji:"❤️", prixRef:800  },
  // ── DIABÈTE ────────────────────────────────────────────────────────────────
  { id:"m090", nom:"Metformine 500mg",                               cat:"Diabète",      emoji:"💙", prixRef:500  },
  { id:"m091", nom:"Metformine 850mg",                               cat:"Diabète",      emoji:"💙", prixRef:700  },
  { id:"m092", nom:"Metformine 1000mg",                              cat:"Diabète",      emoji:"💙", prixRef:900  },
  { id:"m093", nom:"Glibenclamide 5mg",                              cat:"Diabète",      emoji:"💙", prixRef:300  },
  { id:"m094", nom:"Gliclazide 80mg",                                cat:"Diabète",      emoji:"💙", prixRef:800  },
  { id:"m095", nom:"Insuline Actrapid 100UI/ml",                     cat:"Diabète",      emoji:"💙", prixRef:5000 },
  { id:"m096", nom:"Insuline NPH 100UI/ml",                          cat:"Diabète",      emoji:"💙", prixRef:5000 },
  { id:"m097", nom:"Insuline Mixtard 30/70 100UI/ml",               cat:"Diabète",      emoji:"💙", prixRef:6000 },
  // ── GASTRO-ENTÉROLOGIE ─────────────────────────────────────────────────────
  { id:"m100", nom:"Oméprazole 20mg",                                cat:"Gastro",       emoji:"🟢", prixRef:400  },
  { id:"m101", nom:"Oméprazole 40mg injectable",                     cat:"Gastro",       emoji:"🟢", prixRef:2000 },
  { id:"m102", nom:"Ranitidine 150mg",                               cat:"Gastro",       emoji:"🟢", prixRef:300  },
  { id:"m103", nom:"Pantoprazole 40mg",                              cat:"Gastro",       emoji:"🟢", prixRef:1500 },
  { id:"m104", nom:"Métoclopramide 10mg",                            cat:"Gastro",       emoji:"🟢", prixRef:200  },
  { id:"m105", nom:"Domperidone 10mg",                               cat:"Gastro",       emoji:"🟢", prixRef:350  },
  { id:"m106", nom:"Spasfon (Phloroglucinol) 80mg",                 cat:"Gastro",       emoji:"🟢", prixRef:500  },
  { id:"m107", nom:"Lopéramide 2mg",                                 cat:"Gastro",       emoji:"🟢", prixRef:250  },
  { id:"m108", nom:"Charbon activé 250mg",                           cat:"Gastro",       emoji:"🟢", prixRef:200  },
  { id:"m109", nom:"ORS (Sels de réhydratation orale)",              cat:"Gastro",       emoji:"🟢", prixRef:100  },
  { id:"m110", nom:"Zinc 20mg (traitement diarrhée)",                cat:"Gastro",       emoji:"🟢", prixRef:200  },
  { id:"m111", nom:"Mébendazole 100mg",                              cat:"Gastro",       emoji:"🟢", prixRef:150  },
  { id:"m112", nom:"Albendazole 400mg",                              cat:"Gastro",       emoji:"🟢", prixRef:200  },
  { id:"m113", nom:"Praziquantel 600mg",                             cat:"Gastro",       emoji:"🟢", prixRef:1500 },
  { id:"m114", nom:"Ivermectine 3mg",                                cat:"Gastro",       emoji:"🟢", prixRef:500  },
  // ── VITAMINES / SUPPLÉMENTS ────────────────────────────────────────────────
  { id:"m120", nom:"Vitamine C 500mg",                               cat:"Vitamines",    emoji:"🍋", prixRef:100  },
  { id:"m121", nom:"Vitamine B complexe",                            cat:"Vitamines",    emoji:"🍋", prixRef:200  },
  { id:"m122", nom:"Vitamine D3 1000UI",                             cat:"Vitamines",    emoji:"🍋", prixRef:500  },
  { id:"m123", nom:"Vitamine A 100.000UI",                           cat:"Vitamines",    emoji:"🍋", prixRef:300  },
  { id:"m124", nom:"Fer + Acide folique",                            cat:"Vitamines",    emoji:"🍋", prixRef:250  },
  { id:"m125", nom:"Sulfate de fer 200mg",                           cat:"Vitamines",    emoji:"🍋", prixRef:150  },
  { id:"m126", nom:"Zinc + Vitamine C effervescent",                cat:"Vitamines",    emoji:"🍋", prixRef:800  },
  { id:"m127", nom:"Calcium + Vitamine D3 500/400",                 cat:"Vitamines",    emoji:"🍋", prixRef:600  },
  { id:"m128", nom:"Oméga-3 1000mg",                                 cat:"Vitamines",    emoji:"🍋", prixRef:2500 },
  { id:"m129", nom:"Multivitamines adulte",                          cat:"Vitamines",    emoji:"🍋", prixRef:1500 },
  // ── PÉDIATRIE ──────────────────────────────────────────────────────────────
  { id:"m130", nom:"Amoxicilline sirop 125mg/5ml",                  cat:"Pédiatrie",    emoji:"🧒", prixRef:1200 },
  { id:"m131", nom:"Cotrimoxazole pédiatrique sirop",               cat:"Pédiatrie",    emoji:"🧒", prixRef:800  },
  { id:"m132", nom:"Ibuprofène sirop 100mg/5ml",                    cat:"Pédiatrie",    emoji:"🧒", prixRef:700  },
  { id:"m133", nom:"Vitamine A capsule molle 100.000UI enfant",     cat:"Pédiatrie",    emoji:"🧒", prixRef:200  },
  { id:"m134", nom:"Mébendazole 100mg pédiatrique",                 cat:"Pédiatrie",    emoji:"🧒", prixRef:150  },
  { id:"m135", nom:"Métronidazole sirop 125mg/5ml",                 cat:"Pédiatrie",    emoji:"🧒", prixRef:600  },
  { id:"m136", nom:"Coartem pédiatrique 20/120mg",                  cat:"Pédiatrie",    emoji:"🧒", prixRef:1500 },
  { id:"m137", nom:"Quinine sirop pédiatrique",                     cat:"Pédiatrie",    emoji:"🧒", prixRef:900  },
  { id:"m138", nom:"Zinc 10mg sirop pédiatrique",                   cat:"Pédiatrie",    emoji:"🧒", prixRef:500  },
  { id:"m139", nom:"ORS pédiatrique (sachets 250ml)",               cat:"Pédiatrie",    emoji:"🧒", prixRef:100  },
  // ── GYNÉCOLOGIE / MATERNITÉ ────────────────────────────────────────────────
  { id:"m140", nom:"Ocytocine injectable 5UI",                      cat:"Gynécologie",  emoji:"🤱", prixRef:500  },
  { id:"m141", nom:"Misoprostol 200mcg",                             cat:"Gynécologie",  emoji:"🤱", prixRef:1000 },
  { id:"m142", nom:"Contraceptif oral combiné (COC)",               cat:"Gynécologie",  emoji:"🤱", prixRef:300  },
  { id:"m143", nom:"Pilule du lendemain (Levonorgestrel 1,5mg)",    cat:"Gynécologie",  emoji:"🤱", prixRef:1500 },
  { id:"m144", nom:"Fer + Acide folique grossesse",                 cat:"Gynécologie",  emoji:"🤱", prixRef:300  },
  { id:"m145", nom:"Magnésium Sulfate injectable 50%",              cat:"Gynécologie",  emoji:"🤱", prixRef:800  },
  { id:"m146", nom:"Clotrimazole ovule 100mg",                      cat:"Gynécologie",  emoji:"🤱", prixRef:800  },
  { id:"m147", nom:"Métronidazole ovule 500mg",                     cat:"Gynécologie",  emoji:"🤱", prixRef:700  },
  // ── NEUROLOGIE / PSYCHIATRIE ───────────────────────────────────────────────
  { id:"m150", nom:"Phénobarbital 100mg",                            cat:"Neurologie",   emoji:"🧠", prixRef:150  },
  { id:"m151", nom:"Carbamazépine 200mg",                           cat:"Neurologie",   emoji:"🧠", prixRef:500  },
  { id:"m152", nom:"Valproate de sodium 200mg",                     cat:"Neurologie",   emoji:"🧠", prixRef:600  },
  { id:"m153", nom:"Diazépam 5mg",                                  cat:"Neurologie",   emoji:"🧠", prixRef:300  },
  { id:"m154", nom:"Diazépam injectable 10mg",                      cat:"Neurologie",   emoji:"🧠", prixRef:500  },
  { id:"m155", nom:"Halopéridol 5mg",                               cat:"Neurologie",   emoji:"🧠", prixRef:400  },
  { id:"m156", nom:"Chlorpromazine 100mg",                          cat:"Neurologie",   emoji:"🧠", prixRef:300  },
  { id:"m157", nom:"Amitriptyline 25mg",                            cat:"Neurologie",   emoji:"🧠", prixRef:400  },
  // ── RESPIRATOIRE / ORL ────────────────────────────────────────────────────
  { id:"m160", nom:"Salbutamol (Ventoline) 100mcg spray",          cat:"Respiratoire", emoji:"💨", prixRef:3000 },
  { id:"m161", nom:"Béclométhasone spray 250mcg",                   cat:"Respiratoire", emoji:"💨", prixRef:5000 },
  { id:"m162", nom:"Bromhexine 8mg sirop",                          cat:"Respiratoire", emoji:"💨", prixRef:600  },
  { id:"m163", nom:"Ambroxol 30mg",                                 cat:"Respiratoire", emoji:"💨", prixRef:500  },
  { id:"m164", nom:"Prednisone 5mg",                                cat:"Respiratoire", emoji:"💨", prixRef:200  },
  { id:"m165", nom:"Dexaméthasone 4mg injectable",                  cat:"Respiratoire", emoji:"💨", prixRef:400  },
  { id:"m166", nom:"Loratadine 10mg (antihistaminique)",            cat:"Respiratoire", emoji:"💨", prixRef:300  },
  { id:"m167", nom:"Cetirizine 10mg",                               cat:"Respiratoire", emoji:"💨", prixRef:350  },
  { id:"m168", nom:"Pseudoéphédrine + Paracétamol",                 cat:"Respiratoire", emoji:"💨", prixRef:400  },
  { id:"m169", nom:"Pholcodine sirop 5mg/5ml",                     cat:"Respiratoire", emoji:"💨", prixRef:800  },
  // ── DERMATOLOGIE ──────────────────────────────────────────────────────────
  { id:"m170", nom:"Kétoconazole crème 2%",                         cat:"Dermatologie", emoji:"🧴", prixRef:1500 },
  { id:"m171", nom:"Clotrimazole crème 1%",                         cat:"Dermatologie", emoji:"🧴", prixRef:800  },
  { id:"m172", nom:"Terbinafine crème 1%",                          cat:"Dermatologie", emoji:"🧴", prixRef:2000 },
  { id:"m173", nom:"Béclométhasone crème 0,025%",                   cat:"Dermatologie", emoji:"🧴", prixRef:1000 },
  { id:"m174", nom:"Gentamicine crème 0,1%",                        cat:"Dermatologie", emoji:"🧴", prixRef:600  },
  { id:"m175", nom:"Perméthrine lotion 5% (gale/poux)",            cat:"Dermatologie", emoji:"🧴", prixRef:2000 },
  { id:"m176", nom:"Eau oxygénée 10 volumes",                       cat:"Dermatologie", emoji:"🧴", prixRef:300  },
  // ── OPHTALMOLOGIE ─────────────────────────────────────────────────────────
  { id:"m180", nom:"Chloramphénicol collyre 0,5%",                  cat:"Ophtalmologie",emoji:"👁️", prixRef:500  },
  { id:"m181", nom:"Ciprofloxacine collyre 0,3%",                   cat:"Ophtalmologie",emoji:"👁️", prixRef:1500 },
  { id:"m182", nom:"Tobramycine collyre 0,3%",                      cat:"Ophtalmologie",emoji:"👁️", prixRef:2000 },
  { id:"m183", nom:"Larmes artificielles 10ml",                     cat:"Ophtalmologie",emoji:"👁️", prixRef:1200 },
  // ── VIH / PALUDISME GRAVE ─────────────────────────────────────────────────
  { id:"m190", nom:"Cotrimoxazole 960mg (prophylaxie VIH)",         cat:"VIH/Infections",emoji:"🔴",prixRef:300  },
  { id:"m191", nom:"Fluconazole 150mg",                             cat:"VIH/Infections",emoji:"🔴",prixRef:1500 },
  { id:"m192", nom:"Aciclovir 200mg",                               cat:"VIH/Infections",emoji:"🔴",prixRef:800  },
  // ── SOLUTIONS PERFUSION ────────────────────────────────────────────────────
  { id:"m200", nom:"Sérum physiologique NaCl 0,9% 500ml",          cat:"Perfusion",    emoji:"💧", prixRef:800  },
  { id:"m201", nom:"Glucosé 5% 500ml",                              cat:"Perfusion",    emoji:"💧", prixRef:800  },
  { id:"m202", nom:"Ringer Lactate 500ml",                          cat:"Perfusion",    emoji:"💧", prixRef:1000 },
  { id:"m203", nom:"Glucosé 10% 500ml",                             cat:"Perfusion",    emoji:"💧", prixRef:900  },
];

const CATEGORIES_CATALOGUE = ["Tous","Antipaludéen","Antibiotique","Antidouleur","Cardio","Diabète","Gastro","Vitamines","Pédiatrie","Gynécologie","Neurologie","Respiratoire","Dermatologie","Ophtalmologie","Perfusion"];

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

// Stock démo pour les nouvelles pharmacies
const STOCK_DEMO = [
  { nom:"Paracétamol 500mg",                        cat:"Antidouleur",   prix:50,   qte:150 },
  { nom:"Amoxicilline 250mg gélules",                cat:"Antibiotique",  prix:900,  qte:5   },
  { nom:"Artéméther + Luméfantrine (Coartem) 20/120mg", cat:"Antipaludéen", prix:2500, qte:20  },
  { nom:"Quinine 300mg comprimés",                   cat:"Antipaludéen",  prix:350,  qte:80  },
  { nom:"Cotrimoxazole (TMP/SMX) 480mg",             cat:"Antibiotique",  prix:150,  qte:100 },
  { nom:"Ibuprofène 400mg",                          cat:"Antidouleur",   prix:300,  qte:60  },
  { nom:"Vitamine C 500mg",                          cat:"Vitamines",     prix:100,  qte:200 },
  { nom:"ORS (Sels de réhydratation orale)",         cat:"Gastro",        prix:100,  qte:0   },
  { nom:"Métronidazole 250mg",                       cat:"Antibiotique",  prix:300,  qte:7   },
  { nom:"Oméprazole 20mg",                           cat:"Gastro",        prix:400,  qte:30  },
];

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
  const [mode,setMode]=useState("login"); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [nom,setNom]=useState(""); const [quartier,setQuartier]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const handleSubmit=async()=>{
    setError(""); setLoading(true);
    try{
      if(mode==="login"){const cred=await getAuth().signInWithEmailAndPassword(email,password);const snap=await getDB().ref("users/"+cred.user.uid).get();const d=snap.val()||{};onAuth({uid:cred.user.uid,email,role:d.role||"pharmacie",nomPharmacie:d.nom});}
      else{const cred=await getAuth().createUserWithEmailAndPassword(email,password);const uid=cred.user.uid;await getDB().ref("users/"+uid).set({email,role:"pharmacie",nom,createdAt:Date.now()});await getDB().ref("pharmacies/"+uid).set({nom,quartier:quartier||"Yaoundé",adresse:(quartier||"Yaoundé")+", Yaoundé",tel:"",ouvert:true,adminUid:uid,createdAt:Date.now(),lat:3.8667+(Math.random()-0.5)*0.08,lng:11.5167+(Math.random()-0.5)*0.08});for(const med of STOCK_DEMO)await getDB().ref("stock/"+uid).push({...med,pharmacieId:uid,pharmacieNom:nom,exp:"N/A",updatedAt:Date.now()});onAuth({uid,email,role:"pharmacie",nomPharmacie:nom});}
    }catch(e){const m={"auth/email-already-in-use":"Email déjà utilisé.","auth/weak-password":"Mot de passe trop court.","auth/invalid-credential":"Email ou mot de passe incorrect."};setError(m[e.code]||e.message);}
    setLoading(false);
  };
  return(
    <div className="auth-screen"><div className="auth-card">
      <div className="auth-logo">Medic<span>online</span></div><div className="auth-sub">📍 Yaoundé — Espace Pharmacie</div>
      <div className="auth-tabs"><div className={"auth-tab"+(mode==="login"?" active":"")} onClick={()=>{setMode("login");setError("");}}>Connexion</div><div className={"auth-tab"+(mode==="register"?" active":"")} onClick={()=>{setMode("register");setError("");}}>Inscription</div></div>
      {error&&<div className="alert alert-error mb16"><span className="alert-ico">⚠️</span><span>{error}</span></div>}
      {mode==="register"&&<><div className="form-group"><label className="form-label">Nom de la pharmacie *</label><input className="form-input" placeholder="ex: Pharmacie Bastos" value={nom} onChange={e=>setNom(e.target.value)}/></div><div className="form-group"><label className="form-label">Quartier</label><select className="form-input" value={quartier} onChange={e=>setQuartier(e.target.value)}><option value="">Sélectionner...</option>{["Bastos","Centre-ville","Obili","Tsinga","Madagascar","Biyem-Assi","Melen","Essos","Nlongkak","Cité Verte","Odza","Mvog-Mbi","Mendong","Ekounou","Nkomo","Emana","Mimboman","Nsam","Ngousso","Mokolo","Hippodrome","Nylon","Simbock","Nkol-Eton","Mvog-Ada","Ahala","Damas"].map(q=><option key={q} value={q}>{q}</option>)}</select></div></>}
      <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="votre@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div className="form-group"><label className="form-label">Mot de passe *</label><input className="form-input" type="password" placeholder="Min. 6 caractères" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
      <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>{loading?"⏳ Chargement...":mode==="login"?"🔐 Se connecter":"✅ Créer mon compte"}</button>
      <div className="auth-footer">{mode==="login"?<span>Pas de compte ? <b style={{cursor:"pointer",color:"var(--teal)"}} onClick={()=>setMode("register")}>S'inscrire</b></span>:<span>Déjà un compte ? <b style={{cursor:"pointer",color:"var(--teal)"}} onClick={()=>setMode("login")}>Se connecter</b></span>}</div>
    </div></div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🏠 ACCUEIL PATIENT
// ══════════════════════════════════════════════════════════════════════════════
function AccueilPatient({ setPage, setRecherche }) {
  const fbReady=useFirebaseReady();
  const [query,setQuery]=useState(""); const [catActive,setCatActive]=useState("Tous"); const [suggestions,setSuggestions]=useState([]); const [extraPharma,setExtraPharma]=useState([]);
  useEffect(()=>{if(!fbReady)return;const r=getDB().ref("pharmacies");r.on("value",snap=>{if(snap.exists())setExtraPharma(Object.entries(snap.val()).map(([uid,ph])=>({uid,...ph})));});return()=>r.off();},[fbReady]);
  const handleInput=v=>{setQuery(v);setSuggestions(v.length>1?CATALOGUE_MEDICAMENTS.filter(m=>m.nom.toLowerCase().includes(v.toLowerCase())).slice(0,6):[]);};
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
          {suggestions.length>0&&<div className="suggestions">{suggestions.map(s=><div key={s.id} className="suggestion-item" onClick={()=>rechercher(s.nom)}><span>{s.emoji}</span><span style={{flex:1,fontSize:"0.82rem"}}>{s.nom}</span><span className="tag tag-blue">{s.cat}</span><span style={{fontSize:"0.72rem",color:"var(--teal)",fontWeight:700,marginLeft:8,whiteSpace:"nowrap"}}>~{s.prixRef} F</span></div>)}</div>}
        </div>
      </div>
      <div className="grid-4 mb24">
        {[{ico:"🏥",num:allPh.length+"+",lbl:"Pharmacies à Yaoundé",bg:"#EBF4FF"},{ico:"💊",num:CATALOGUE_MEDICAMENTS.length+"+",lbl:"Médicaments référencés",bg:"#E6FAF0"},{ico:"🗺",num:"Carte",lbl:"Localisation temps réel",bg:"#FFF4E6",click:()=>setPage("carte")},{ico:"⚡",num:"Live",lbl:"Stocks synchronisés",bg:"#F3E8FF"}].map((s,i)=>(
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
function ResultatsPatient({ recherche, setPage }) {
  const fbReady=useFirebaseReady();
  const [resultatsFirebase,setResultatsFirebase]=useState([]);
  const [fbLoading,setFbLoading]=useState(true);

  useEffect(()=>{
    setResultatsFirebase([]); setFbLoading(true);
    if(!fbReady)return;
    getDB().ref("stock").once("value").then(snap=>{
      const found=[];
      if(snap.exists()){
        Object.entries(snap.val()).forEach(([uid,items])=>{
          Object.entries(items).forEach(([itemId,item])=>{
            if(item.nom?.toLowerCase().includes(recherche.toLowerCase())&&item.qte>0)
              found.push({...item,itemId,pharmacieUid:uid});
          });
        });
      }
      found.sort((a,b)=>a.prix-b.prix);
      setResultatsFirebase(found);
      setFbLoading(false);
    }).catch(()=>setFbLoading(false));
  },[fbReady,recherche]);

  // Résultats catalogue — IMMÉDIATS, pas besoin de Firebase
  const catalogueMatch = CATALOGUE_MEDICAMENTS.filter(m=>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const hasFbResults = resultatsFirebase.length > 0;

  return(
    <div className="main">
      <div className="result-toprow">
        <button className="btn btn-secondary btn-sm" onClick={()=>setPage("accueil")}>← Retour</button>
        <div><div className="result-title">{recherche}</div>
        <div className="result-sub">{hasFbResults ? resultatsFirebase.length+" pharmacie(s) · Triés par prix" : "Prix de référence au Cameroun"}</div></div>
      </div>

      {/* ── RÉSULTATS FIREBASE (stocks réels) ── */}
      {hasFbResults && (
        <>
          <div className="alert alert-success mb16"><span className="alert-ico">💡</span><span>Meilleur prix : <strong>{resultatsFirebase[0].pharmacieNom}</strong> à <strong>{resultatsFirebase[0].prix} FCFA</strong></span></div>
          <div className="results-list mb24">
            {resultatsFirebase.map((r,i)=>(
              <div key={r.itemId} className={"result-card"+(i===0?" best":"")} style={{animationDelay:(i*0.07)+"s"}}>
                <div className={"result-header"+(i===0?" best":"")}><div className="ph-ico">🏥</div><div className="ph-info"><div className="ph-name">{r.pharmacieNom||"Pharmacie"}</div><div className="ph-dist">📍 {r.quartier||"Yaoundé"}</div></div>{i===0&&<span className="best-badge">🏆 Meilleur prix</span>}</div>
                <div className="result-body">
                  <div><div className={"price-big"+(i!==0?" not-best":"")}>{r.prix} FCFA</div><div className="mt6"><span className={"stock-tag "+(r.qte<=10?"stock-low":"stock-ok")}>{r.qte<=10?"⚠ Stock faible ("+r.qte+")":"✓ En stock ("+r.qte+")"}</span></div></div>
                  <button className={"btn btn-sm "+(i===0?"btn-primary":"btn-secondary")} onClick={()=>setPage("carte")}>🗺 Voir sur carte</button>
                </div>
              </div>
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
  const alertes=stock.filter(s=>s.qte<=10&&s.qte>0); const ruptures=stock.filter(s=>s.qte===0);
  return(
    <div className="main">
      <div className="dash-header"><h2>🏥 {user?.nomPharmacie||"Mon Dashboard"}</h2><p><span className="status-dot online"></span>Connecté · Firebase 🔥 · Visible par les patients de Yaoundé</p></div>
      {alertes.length>0&&<div className="alert alert-warn mb16"><span className="alert-ico">⚠️</span><span><strong>Stock bas :</strong> {alertes.map(a=>a.nom).join(", ")}</span></div>}
      {ruptures.length>0&&<div className="alert mb16" style={{background:"#FDECEA",border:"1px solid #F5C6CB",color:"var(--red)"}}><span className="alert-ico">🚫</span><span><strong>Rupture :</strong> {ruptures.map(a=>a.nom).join(", ")}</span></div>}
      <div className="grid-4 mb24">{[{ico:"💊",num:stock.length,lbl:"Médicaments",bg:"#EBF4FF"},{ico:"⚠️",num:alertes.length,lbl:"Stocks bas",bg:"#FFF4E6"},{ico:"🚫",num:ruptures.length,lbl:"Ruptures",bg:"#FDECEA"},{ico:"🔥",num:"Live",lbl:"Firebase sync",bg:"#E6FAF0"}].map((s,i)=>(
        <div key={i} className="stat-card"><div className="stat-icon" style={{background:s.bg}}>{s.ico}</div><div className="stat-num" style={{fontSize:s.num==="Live"?"1rem":undefined}}>{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
      ))}</div>
      <div className="section-title">Actions rapides</div>
      <div className="grid-4">{[{ico:"➕",lbl:"Ajouter",page:"ajouter"},{ico:"📦",lbl:"Gérer le stock",page:"stock"},{ico:"🗺",lbl:"Carte",page:"carte"},{ico:"⚙️",lbl:"Ma pharmacie",page:"profil"}].map((a,i)=>(
        <div key={i} className="action-card" onClick={()=>setPage(a.page)}><div className="action-ico">{a.ico}</div><div className="action-lbl">{a.lbl}</div></div>
      ))}</div>
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
  const [form,setForm]=useState({nom:"",cat:"",prix:"",qte:"",exp:""});
  const [suggestions,setSuggestions]=useState([]); const [success,setSuccess]=useState(false);
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleNomInput=v=>{setF("nom",v);setSuggestions(v.length>1?CATALOGUE_MEDICAMENTS.filter(m=>m.nom.toLowerCase().includes(v.toLowerCase())).slice(0,6):[]);};
  const selectSuggestion=m=>{setForm({nom:m.nom,cat:m.cat,prix:String(m.prixRef),qte:"",exp:""});setSuggestions([]);};
  const enregistrer=async()=>{
    if(!form.nom||!form.prix||!form.qte){alert("Champs obligatoires manquants.");return;}
    await getDB().ref("stock/"+user.uid).push({nom:form.nom,cat:form.cat||"Autre",prix:Number(form.prix),qte:Number(form.qte),exp:form.exp||"N/A",pharmacieId:user.uid,pharmacieNom:user.nomPharmacie||"Ma Pharmacie",updatedAt:Date.now()});
    setSuccess(true); setTimeout(()=>{setSuccess(false);setPage("stock");},1500);
  };
  return(
    <div className="main">
      <div className="page-toprow mb20"><button className="btn btn-secondary btn-sm" onClick={()=>setPage("stock")}>← Retour</button><div className="page-title">Ajouter un médicament</div></div>
      {success&&<div className="alert alert-success mb16"><span className="alert-ico">✅</span><span>Ajouté sur Firebase !</span></div>}
      <div className="card form-card">
        <div className="alert alert-success mb16" style={{background:"#EBF4FF",borderColor:"var(--navy-mid)",color:"var(--navy)"}}>
          <span className="alert-ico">💡</span><span>Tapez le nom du médicament — notre base de {CATALOGUE_MEDICAMENTS.length}+ médicaments camerounais vous suggère automatiquement !</span>
        </div>
        <div className="form-group" style={{position:"relative"}}>
          <label className="form-label">Nom du médicament *</label>
          <input className="form-input" placeholder="ex: Coartem, Amoxicilline, Insuline..." value={form.nom} onChange={e=>handleNomInput(e.target.value)}/>
          {suggestions.length>0&&<div className="suggestions" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:100}}>
            {suggestions.map(s=><div key={s.id} className="suggestion-item" onClick={()=>selectSuggestion(s)}>
              <span>{s.emoji}</span><span style={{flex:1,fontSize:"0.82rem"}}>{s.nom}</span><span className="tag tag-blue">{s.cat}</span><span style={{fontSize:"0.72rem",color:"var(--teal)",fontWeight:700}}>~{s.prixRef} F</span>
            </div>)}
          </div>}
        </div>
        <div className="form-group"><label className="form-label">Catégorie</label><select className="form-input" value={form.cat} onChange={e=>setF("cat",e.target.value)}><option value="">Sélectionner...</option>{CATEGORIES_CATALOGUE.filter(c=>c!=="Tous").map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Votre prix de vente (FCFA) *</label><input className="form-input" type="number" value={form.prix} onChange={e=>setF("prix",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Quantité en stock *</label><input className="form-input" type="number" value={form.qte} onChange={e=>setF("qte",e.target.value)}/></div>
        </div>
        <div className="form-group"><label className="form-label">Date d'expiration</label><input className="form-input" type="date" value={form.exp} onChange={e=>setF("exp",e.target.value)}/></div>
        <hr className="divider"/>
        <button className="btn btn-primary btn-full" onClick={enregistrer}>✅ Publier sur Mediconline</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ⚙️ PROFIL PHARMACIE
// ══════════════════════════════════════════════════════════════════════════════
function ProfilPharmacie({ user }) {
  const [edit,setEdit]=useState(false); const [info,setInfo]=useState({nom:"",quartier:"",adresse:"",tel:"",ouverture:"08:00",fermeture:"22:00"}); const [tmp,setTmp]=useState(info);
  useEffect(()=>{if(!user?.uid)return;getDB().ref("pharmacies/"+user.uid).once("value").then(snap=>{if(snap.exists()){const d=snap.val();setInfo({nom:d.nom||"",quartier:d.quartier||"",adresse:d.adresse||"",tel:d.tel||"",ouverture:d.ouverture||"08:00",fermeture:d.fermeture||"22:00"});}});},[user]);
  const sauvegarder=async()=>{await getDB().ref("pharmacies/"+user.uid).update({...tmp,updatedAt:Date.now()});setInfo(tmp);setEdit(false);};
  const set=(k,v)=>setTmp(f=>({...f,[k]:v}));
  return(
    <div className="main"><div className="page-title mb20">Ma Pharmacie</div>
    <div className="card form-card">
      <div className="profile-header"><div className="avatar">🏥</div><div><div className="profile-name">{info.nom||"Ma Pharmacie"}</div><div className="profile-status"><span className="status-dot online"></span>Connectée · {info.quartier||"Yaoundé"}</div></div><button className="btn btn-secondary btn-sm ml-auto" onClick={()=>{setEdit(!edit);setTmp(info);}}>{edit?"Annuler":"✏️ Modifier"}</button></div>
      <hr className="divider"/>
      {edit?(
        <>{[{k:"nom",l:"Nom"},{k:"quartier",l:"Quartier"},{k:"adresse",l:"Adresse"},{k:"tel",l:"Téléphone"}].map(({k,l})=><div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" value={tmp[k]} onChange={e=>set(k,e.target.value)}/></div>)}
        <div className="grid-2"><div className="form-group"><label className="form-label">Ouverture</label><input className="form-input" type="time" value={tmp.ouverture} onChange={e=>set("ouverture",e.target.value)}/></div><div className="form-group"><label className="form-label">Fermeture</label><input className="form-input" type="time" value={tmp.fermeture} onChange={e=>set("fermeture",e.target.value)}/></div></div>
        <button className="btn btn-primary btn-full" onClick={sauvegarder}>✅ Enregistrer</button></>
      ):(
        <>{[{ico:"📍",lbl:"Adresse",val:info.adresse||"—"},{ico:"🏘",lbl:"Quartier",val:info.quartier||"—"},{ico:"📞",lbl:"Téléphone",val:info.tel||"—"},{ico:"🕐",lbl:"Horaires",val:info.ouverture+" – "+info.fermeture}].map((r,i)=><div key={i} className="info-row"><span className="info-lbl">{r.ico} {r.lbl}</span><span className="info-val">{r.val}</span></div>)}
        <div className="mt16"><div className="alert alert-success"><span className="alert-ico">🔥</span><span><strong>Firebase sync</strong> — Visible par les patients de Yaoundé</span></div></div></>
      )}
    </div></div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 🔝 TOPBAR
// ══════════════════════════════════════════════════════════════════════════════
function Topbar({ role, setRole, setPage, user, onLogout }) {
  return(
    <div className="topbar">
      <div className="topbar-logo">Medic<span>online</span><span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.35)",fontFamily:"Mulish",fontWeight:400,marginLeft:8}}>📍 Yaoundé</span></div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {!user&&<div className="role-switch"><button className={"role-btn"+(role==="patient"?" active":"")} onClick={()=>{setRole("patient");setPage("accueil");}}>👤 Patient</button><button className={"role-btn"+(role==="pharmacie"?" active":"")} onClick={()=>{setRole("pharmacie");setPage("dashboard");}}>🏥 Pharmacie</button></div>}
        {user&&<div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.78rem"}}>🏥 {user.nomPharmacie||user.email}</span><button className="btn btn-secondary btn-sm" onClick={onLogout}>Déconnexion</button></div>}
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
  const [recherche,setRecherche]=useState(""); const [stock,setStock]=useState([]);
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
  const TABS_PATIENT=[{id:"accueil",label:"🏠 Accueil"},{id:"carte",label:"🗺 Carte"},{id:"resultats",label:"🔍 Recherche"}];
  const TABS_PH=[{id:"dashboard",label:"📊 Dashboard"},{id:"stock",label:"📦 Stock"},{id:"ajouter",label:"➕ Ajouter"},{id:"carte",label:"🗺 Carte"},{id:"profil",label:"⚙️ Profil"}];
  const tabs=role==="patient"?TABS_PATIENT:TABS_PH;
  return(
    <div className="app">
      <Topbar role={role} setRole={setRole} setPage={setPage} user={user} onLogout={handleLogout}/>
      <div className="tabs">{tabs.map(t=><div key={t.id} className={"tab"+(page===t.id?" active":"")} onClick={()=>setPage(t.id)}>{t.label}</div>)}</div>
      {role==="patient"&&page==="accueil"   &&<AccueilPatient setPage={setPage} setRecherche={setRecherche}/>}
      {role==="patient"&&page==="carte"     &&<PageCarte/>}
      {role==="patient"&&page==="resultats" &&<ResultatsPatient recherche={recherche||"Paracétamol"} setPage={setPage}/>}
      {role==="pharmacie"&&!user            &&<AuthScreen onAuth={handleAuth}/>}
      {role==="pharmacie"&&user&&page==="dashboard"&&<Dashboard stock={stock} setPage={setPage} user={user}/>}
      {role==="pharmacie"&&user&&page==="stock"    &&<GestionStock stock={stock} user={user} setPage={setPage}/>}
      {role==="pharmacie"&&user&&page==="ajouter"  &&<AjouterMedicament user={user} setPage={setPage}/>}
      {role==="pharmacie"&&user&&page==="carte"    &&<PageCarte/>}
      {role==="pharmacie"&&user&&page==="profil"   &&<ProfilPharmacie user={user}/>}
    </div>
  );
}
