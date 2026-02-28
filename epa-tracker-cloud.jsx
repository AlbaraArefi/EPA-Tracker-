import { useState, useEffect, useCallback } from "react";

const EPAS = [
  { id:"TTD-1", stage:"TTD", num:1, title:"Performing and presenting a basic history and physical examination", description:"Focuses on clinical assessment, verifying skills from medical school. Does not include correct diagnosis, management, or communication of the plan.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 4 total (≥2 by supervisor, ≥2 complete encounters)",target:4},{key:"neonate_infant",label:"Neonate or Infant",detail:"At least 1",target:1},{key:"preschool_school",label:"Preschool or School Age",detail:"At least 1",target:1},{key:"adolescent",label:"Adolescent",detail:"At least 1",target:1}]},
  { id:"TTD-2", stage:"TTD", num:2, title:"Documenting orders for pediatric patients", description:"Focuses on written documentation of orders after discussing with supervisor or senior resident.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 6 total (≥3 by supervisor)",target:6},{key:"neonate_infant",label:"Neonate/Infant order",detail:"At least 1",target:1},{key:"child_adolescent",label:"Child/Adolescent order",detail:"At least 1",target:1},{key:"medication",label:"Medication/Prescription order",detail:"At least 1",target:1},{key:"iv_fluids",label:"IV Fluids order",detail:"At least 1",target:1},{key:"diet",label:"Diet/Nutrition order",detail:"At least 1",target:1}]},
  { id:"F-1", stage:"Foundations", num:1, title:"Recognizing deteriorating and/or critically ill patients", description:"Recognizing when a patient requires timely intervention and initiating necessary interventions including BLS and ALS.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect ≥5 total (≥1 pediatrician, ≥3 different observers)",target:5},{key:"neonate",label:"Neonate observation",detail:"At least 1",target:1},{key:"infant",label:"Infant observation",detail:"At least 1",target:1},{key:"preschool_older",label:"Preschool/School Age/Adolescent",detail:"At least 1",target:1},{key:"presentations",label:"Different clinical presentations",detail:"At least 3 different",target:3}]},
  { id:"F-2", stage:"Foundations", num:2, title:"Managing low risk deliveries and initiating resuscitation", description:"Recognizing features of normal/abnormal fetal to neonatal transition, providing standard newborn care and initiating basic NRP.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≥2 different observers, ≤2 simulation)",target:5},{key:"resuscitations",label:"Initiations of resuscitation",detail:"At least 3",target:3}]},
  { id:"F-3", stage:"Foundations", num:3, title:"Providing well newborn care", description:"Care to healthy newborns, routine screening exam, and discharge counselling. Part A: newborn exam. Part B: discharge assessment.", requirements:[{key:"part_a",label:"Part A: Newborn Exam observations",detail:"Collect 5 (≥2 different observers)",target:5},{key:"part_b",label:"Part B: Discharge Assessment observations",detail:"Collect 5 (≥2 different observers)",target:5}]},
  { id:"F-4", stage:"Foundations", num:4, title:"Assessing newborns with common problems", description:"Comprehensive/targeted H&P for newborns (hyperbilirubinemia, hypoglycemia, NAS, poor weight gain, respiratory distress, sepsis risk).", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 3 total",target:3},{key:"presentations",label:"Different presentations",detail:"At least 2 different",target:2}]},
  { id:"F-5", stage:"Foundations", num:5, title:"Assessing, diagnosing, and managing common pediatric problems", description:"Comprehensive/targeted H&P for common pediatric presentations. Does not include critically ill or complex multisystem patients.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 10 total (≥5 direct, ≥5 attending, ≥5 different observers)",target:10},{key:"direct_obs",label:"Direct observations",detail:"At least 5",target:5},{key:"age_groups",label:"Age groups covered",detail:"All 5 age groups",target:5},{key:"conditions",label:"Types of conditions",detail:"At least 5 types",target:5},{key:"resp_distress",label:"Respiratory distress case",detail:"At least 1",target:1},{key:"dehydration",label:"Dehydration case",detail:"At least 1",target:1},{key:"fever",label:"Fever case",detail:"At least 1",target:1}]},
  { id:"F-6", stage:"Foundations", num:6, title:"Providing primary and secondary preventive health care", description:"Identifying opportunities and providing developmentally appropriate anticipatory guidance and preventive care.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≥1 direct, ≥2 different observers)",target:5},{key:"direct",label:"Direct observation",detail:"At least 1",target:1},{key:"age_groups",label:"Age groups",detail:"All 5 age groups",target:5},{key:"chronic_disease",label:"Chronic disease case",detail:"At least 1",target:1},{key:"vulnerable_pop",label:"Vulnerable population case",detail:"At least 1",target:1}]},
  { id:"F-7", stage:"Foundations", num:7, title:"Performing basic pediatric procedures", description:"BVM ventilation, CPR, IO injection, LP (neonates/infants), tracheostomy tube change, needle thoracostomy.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 12 total",target:12},{key:"bvm",label:"Bag valve mask ventilation",detail:"At least 4",target:4},{key:"cpr",label:"CPR*",detail:"At least 2",target:2},{key:"tracheostomy",label:"Tracheostomy tube change*",detail:"At least 1",target:1},{key:"io_injection",label:"Intraosseous injection*",detail:"At least 2",target:2},{key:"lp",label:"Lumbar puncture (neonate/infant)",detail:"At least 2",target:2},{key:"needle_thoracostomy",label:"Needle thoracostomy (neonate)*",detail:"At least 1",target:1}]},
  { id:"F-8", stage:"Foundations", num:8, title:"Communicating assessment findings to patients/families", description:"Communication skills to convey information and engage family in shared decision-making. Does not include complex disclosures.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≥2 supervisor, ≥2 different assessors)",target:5},{key:"young",label:"Neonate, Infant, or Preschool",detail:"At least 1",target:1},{key:"school_age",label:"School Age case",detail:"At least 1",target:1},{key:"adolescent",label:"Adolescent case",detail:"At least 1",target:1}]},
  { id:"F-9", stage:"Foundations", num:9, title:"Documenting clinical encounters", description:"Written communication in formats: assessment/progress notes, consult letters, discharge summaries, consult requests.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 4 total",target:4},{key:"admission_note",label:"Admission note",detail:"At least 1",target:1},{key:"discharge_summary",label:"Discharge summary",detail:"At least 1",target:1},{key:"progress_note",label:"Progress note",detail:"At least 1",target:1},{key:"consult_letter",label:"Consult letter",detail:"At least 1",target:1}]},
  { id:"F-10", stage:"Foundations", num:10, title:"Transferring clinical information during handover", description:"Communicating acute and ongoing info about patients between colleagues at transitions in physician responsibility.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 2 total",target:2}]},
  { id:"F-11", stage:"Foundations", num:11, title:"Coordinating transitions of care for non-complex patients", description:"Transferring patients from one setting to another or discharging. Does not include complex patients.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 4 total (≥2 different observers)",target:4},{key:"transfer",label:"Transfer observation",detail:"At least 1",target:1},{key:"discharge",label:"Discharge observation",detail:"At least 1",target:1}]},
  { id:"C-1", stage:"Core", num:1, title:"Resuscitating and stabilizing neonates following delivery", description:"Applying neonatal resuscitation guidelines, working effectively with the resuscitation team. Includes high-risk deliveries.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 3 total (≥2 different observers)",target:3}]},
  { id:"C-2", stage:"Core", num:2, title:"Resuscitating and stabilizing critically ill patients", description:"Resuscitation and stabilization of critically ill pediatric patients of all ages. Includes debrief after acute event.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≤1 simulation)",target:5},{key:"neonate",label:"Neonate",detail:"At least 1",target:1},{key:"infant_preschool",label:"Infant/Preschool",detail:"At least 1",target:1},{key:"school_age",label:"School Aged",detail:"At least 1",target:1},{key:"adolescent",label:"Adolescent",detail:"At least 1",target:1},{key:"presentations",label:"Presentation types (resp, hemo, fluid/met, neuro)",detail:"At least 1 of each",target:4}]},
  { id:"C-3", stage:"Core", num:3, title:"Assessing patients with medical and/or psychosocial complexity", description:"H&P for patients with complex single or multiple active competing conditions. Includes developing prioritized problem list.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 4 total (≥2 direct, ≥2 different assessors)",target:4},{key:"direct",label:"Direct observations",detail:"At least 2",target:2},{key:"conditions",label:"Types of conditions",detail:"At least 3 different",target:3}]},
  { id:"C-4", stage:"Core", num:4, title:"Diagnosing and managing pediatric patients", description:"Assessing, diagnosing and managing patients with acute presentation. Includes follow-up. Does not include resuscitation.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 8 total (≥6 direct, ≥6 supervisor, ≥3 assessors)",target:8},{key:"direct",label:"Direct observations",detail:"At least 6",target:6},{key:"age_neonate",label:"Neonate cases",detail:"At least 2",target:2},{key:"age_infant_preschool",label:"Infant/Preschool cases",detail:"At least 2",target:2},{key:"age_school",label:"School Age cases",detail:"At least 2",target:2},{key:"age_adolescent",label:"Adolescent cases",detail:"At least 2",target:2}]},
  { id:"C-5", stage:"Core", num:5, title:"Providing ongoing management for chronic conditions", description:"Comprehensive ongoing management including screening, surveillance, medication adherence. May include technology-dependent patients.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 8 total (≥3 direct, ≥5 different observers)",target:8},{key:"direct",label:"Direct observations",detail:"At least 3",target:3},{key:"conditions",label:"Different conditions covered",detail:"At least 8 different",target:8},{key:"community",label:"Community setting",detail:"At least 1",target:1}]},
  { id:"C-6", stage:"Core", num:6, title:"Assessing and managing patients with mental health issues", description:"Recognition, assessment, and management of mental health issues (ADHD, anxiety, mood disorders, eating disorders, suicidal ideation, etc.).", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≥3 different observers)",target:5},{key:"direct",label:"Direct observations",detail:"At least 2",target:2},{key:"conditions",label:"Different conditions",detail:"At least 5 different",target:5},{key:"longitudinal",label:"In longitudinal clinic",detail:"At least 1",target:1},{key:"community",label:"In community setting",detail:"At least 2",target:2}]},
  { id:"C-7", stage:"Core", num:7, title:"Assessing patients with developmental, behavioural, and school issues", description:"Recognition, assessment, and management of ASD, behaviour problems, learning difficulties, developmental disorders, sleep issues.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≥3 different observers)",target:5},{key:"direct",label:"Direct observations",detail:"At least 2",target:2},{key:"conditions",label:"Different conditions",detail:"At least 4 different",target:4},{key:"longitudinal",label:"In longitudinal clinic",detail:"At least 2",target:2},{key:"community",label:"In community setting",detail:"At least 2",target:2}]},
  { id:"C-8", stage:"Core", num:8, title:"Recognizing and managing suspected child maltreatment", description:"Recognizing and managing physical, emotional, sexual maltreatment or neglect, including mandatory reporting.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect ≥3 total",target:3},{key:"physical",label:"Physical maltreatment (incl. suspected)",detail:"At least 1",target:1},{key:"sexual",label:"Sexual maltreatment (incl. suspected)",detail:"At least 1",target:1},{key:"neglect",label:"Neglect (incl. suspected)",detail:"At least 1",target:1}]},
  { id:"C-9", stage:"Core", num:9, title:"Performing core pediatric procedures", description:"Port-a-cath, CPR (defib), chest tube, ear curettage, G-tube, immunizations, intubation, IV, LP, NG tube, phlebotomy, surfactant, UAL, UVL, urinary cath, and more.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 33 total",target:33},{key:"port_a_cath",label:"Port-a-cath access*",detail:"At least 1",target:1},{key:"cpr_defib",label:"CPR defibrillation*",detail:"At least 1",target:1},{key:"chest_tube",label:"Chest tube*",detail:"At least 2",target:2},{key:"ear_curettage",label:"Ear curettage",detail:"At least 2",target:2},{key:"g_tube",label:"G-tube reinsertion*",detail:"At least 1",target:1},{key:"immunization",label:"Immunizations (IM and SC)*",detail:"At least 2",target:2},{key:"intubation",label:"Intubation (neonate/infant)",detail:"At least 3",target:3},{key:"iv",label:"IV insertion",detail:"At least 2",target:2},{key:"lp",label:"LP ± injection (preschool/school)",detail:"At least 2",target:2},{key:"occlusion",label:"Long-term line occlusion*",detail:"At least 1",target:1},{key:"ng_tube",label:"Nasogastric tube",detail:"At least 3",target:3},{key:"np_swab",label:"Nasopharyngeal swab",detail:"At least 1",target:1},{key:"ekg",label:"EKG",detail:"At least 1",target:1},{key:"phlebotomy",label:"Phlebotomy",detail:"At least 3",target:3},{key:"surfactant",label:"Surfactant (neonate)",detail:"At least 2",target:2},{key:"throat_swab",label:"Throat swab",detail:"At least 1",target:1},{key:"ual",label:"Umbilical arterial line",detail:"At least 1",target:1},{key:"uvl",label:"Umbilical venous line",detail:"At least 2",target:2},{key:"urinary_cath",label:"Urinary catheterization (1 boy, 1 girl)",detail:"At least 2",target:2}]},
  { id:"C-10", stage:"Core", num:10, title:"Leading discussions in emotionally charged situations", description:"Advanced communication in difficult situations: managing conflict, disclosing errors, addressing non-adherence, breaking bad news.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 5 total (≥4 different supervisor observers)",target:5},{key:"comm_types",label:"Communication types",detail:"At least 3 different",target:3},{key:"settings",label:"Settings (inpatient, outpatient, ICU)",detail:"At least 1 from each",target:3},{key:"adolescent",label:"Communication with adolescent",detail:"At least 1",target:1}]},
  { id:"C-11", stage:"Core", num:11, title:"Coordinating transitions of care for complex patients", description:"Builds on Foundations, adding complex scenarios requiring coordination of multiple teams. Includes inter-facility transfer, discharge, adult care transition.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 4 total (≥2 different observers)",target:4},{key:"transfer",label:"Transfer of care",detail:"At least 1",target:1},{key:"discharge",label:"Discharge",detail:"At least 1",target:1}]},
  { id:"C-12", stage:"Core", num:12, title:"Leading the inpatient team", description:"Efficient leadership of inpatient service as senior resident. Based on at least one week of observation.", requirements:[{key:"obs_total",label:"Observations (≥1 week each)",detail:"Collect 2 observations",target:2}]},
  { id:"C-13", stage:"Core", num:13, title:"Advancing the discipline through scholarly activity", description:"Completion of a scholarly project (basic/clinical science, advocacy, medical education, patient safety, QI, knowledge translation).", requirements:[{key:"project",label:"Scholarly project completed",detail:"1 observation of achievement",target:1}]},
  { id:"C-14", stage:"Core", num:14, title:"Providing teaching and feedback", description:"Role as teacher of junior learners. Part A: providing teaching (4 obs). Part B: assessing and providing feedback (2 obs).", requirements:[{key:"part_a",label:"Part A: Teaching observations",detail:"Collect 4 (variety of events)",target:4},{key:"part_b",label:"Part B: Feedback observations",detail:"Collect 2 (≥1 challenging situation)",target:2}]},
  { id:"TTP-1", stage:"TTP", num:1, title:"Leading a general pediatric inpatient service", description:"Independent management of inpatient service as physician most responsible. Part A: patient care. Part B: interprofessional care/supervision.", requirements:[{key:"part_a",label:"Part A: Patient care observations",detail:"Collect 3 (≥1 high complexity, 2 supervisors)",target:3},{key:"part_b",label:"Part B: Interprofessional/supervision feedback",detail:"Feedback from ≥3 observers",target:3}]},
  { id:"TTP-2", stage:"TTP", num:2, title:"Managing longitudinal aspects of outpatient care", description:"Longitudinal management of general pediatric outpatient clinic as physician most responsible.", requirements:[{key:"obs_total",label:"Observations at 1-3 month intervals",detail:"At least 2 observations",target:2}]},
  { id:"TTP-3", stage:"TTP", num:3, title:"Leading discussions about goals of care", description:"Advanced communication to lead discussions about progression of illness and goals of care. Includes legal and ethical aspects.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 2 (≤1 simulation)",target:2}]},
  { id:"TTP-4", stage:"TTP", num:4, title:"Leading family and interprofessional team meetings", description:"Leading meetings to discuss clinical status, clarify expectations, set treatment goals, and facilitate discharge planning.", requirements:[{key:"obs_total",label:"Total Observations",detail:"Collect 4 (≥2 family, ≥2 team, ≥1 direct supervisor)",target:4},{key:"family_meeting",label:"Family meetings",detail:"At least 2",target:2},{key:"team_meeting",label:"Team meetings",detail:"At least 2",target:2}]},
  { id:"TTP-5", stage:"TTP", num:5, title:"Analyzing patient safety events", description:"Review and analysis of a patient safety event, identifying human and system factors. Presented at rounds or submitted as report.", requirements:[{key:"obs_total",label:"Observation of Achievement",detail:"Collect 1",target:1}]},
];

const STAGE_COLORS = { TTD:"#2563eb", Foundations:"#059669", Core:"#7c3aed", TTP:"#dc2626" };
const STAGE_BG = { TTD:"#eff6ff", Foundations:"#ecfdf5", Core:"#f5f3ff", TTP:"#fef2f2" };

function hashPassword(pw) {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) { hash = ((hash << 5) - hash) + pw.charCodeAt(i); hash |= 0; }
  return "h" + Math.abs(hash).toString(36);
}

export default function EPATracker() {
  const [screen, setScreen] = useState("login"); // login | register | app
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [activeStage, setActiveStage] = useState("all");
  const [openCards, setOpenCards] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const session = await window.storage.get("session");
        if (session) {
          const s = JSON.parse(session.value);
          setCurrentUser(s);
          await loadProgress(s.username);
          setScreen("app");
        }
      } catch(e) {}
    })();
  }, []);

  const loadProgress = async (uname) => {
    try {
      const data = await window.storage.get(`progress:${uname}`);
      if (data) setProgress(JSON.parse(data.value));
    } catch(e) { setProgress({}); }
  };

  const saveProgress = useCallback(async (newProgress, uname) => {
    setSaving(true);
    try {
      await window.storage.set(`progress:${uname || currentUser.username}`, JSON.stringify(newProgress));
      setSaveMsg("✓ Saved");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch(e) { setSaveMsg("⚠ Save failed"); }
    setSaving(false);
  }, [currentUser]);

  const handleRegister = async () => {
    setError("");
    if (!username.trim() || !password.trim()) return setError("Please fill in all fields.");
    if (password !== confirmPw) return setError("Passwords do not match.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    setLoading(true);
    try {
      // Check if username taken
      try {
        await window.storage.get(`user:${username.toLowerCase()}`);
        setLoading(false);
        return setError("Username already taken. Please choose another.");
      } catch(e) {
        // Good — user doesn't exist
      }
      const userData = { username: username.trim(), displayName: username.trim(), pwHash: hashPassword(password) };
      await window.storage.set(`user:${username.toLowerCase()}`, JSON.stringify(userData));
      const session = { username: username.trim() };
      await window.storage.set("session", JSON.stringify(session));
      setCurrentUser(session);
      setProgress({});
      setScreen("app");
    } catch(e) { setError("Registration failed. Please try again."); }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password.trim()) return setError("Please enter your username and password.");
    setLoading(true);
    try {
      const data = await window.storage.get(`user:${username.toLowerCase()}`);
      const userData = JSON.parse(data.value);
      if (userData.pwHash !== hashPassword(password)) {
        setLoading(false);
        return setError("Incorrect password. Please try again.");
      }
      const session = { username: userData.username };
      await window.storage.set("session", JSON.stringify(session));
      setCurrentUser(session);
      await loadProgress(userData.username);
      setScreen("app");
    } catch(e) { setError("Username not found. Please check or register."); }
    setLoading(false);
  };

  const handleLogout = async () => {
    try { await window.storage.delete("session"); } catch(e) {}
    setCurrentUser(null);
    setProgress({});
    setScreen("login");
    setUsername(""); setPassword(""); setConfirmPw(""); setError("");
  };

  const getCount = (epaId, key) => (progress[epaId] && progress[epaId][key]) || 0;

  const changeCount = async (epaId, key, delta, target) => {
    const current = getCount(epaId, key);
    const newVal = Math.min(target, Math.max(0, current + delta));
    const newProgress = { ...progress, [epaId]: { ...(progress[epaId] || {}), [key]: newVal } };
    setProgress(newProgress);
    await saveProgress(newProgress, currentUser.username);
  };

  const isEPADone = (epa) => epa.requirements.every(r => getCount(epa.id, r.key) >= r.target);
  const metReqs = (epa) => epa.requirements.filter(r => getCount(epa.id, r.key) >= r.target).length;

  const completedCount = EPAS.filter(isEPADone).length;
  const overallPct = Math.round((completedCount / EPAS.length) * 100);
  const totalObs = EPAS.reduce((acc, e) => acc + e.requirements.reduce((a, r) => a + getCount(e.id, r.key), 0), 0);

  const filtered = activeStage === "all" ? EPAS : EPAS.filter(e => e.stage === activeStage);

  const toggleCard = (id) => setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));

  // ── AUTH SCREENS ──
  if (screen === "login" || screen === "register") {
    const isReg = screen === "register";
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0a2342 0%, #0d7377 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", fontFamily:"system-ui, sans-serif" }}>
        <div style={{ background:"white", borderRadius:"20px", padding:"2.5rem", maxWidth:"420px", width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,0.3)" }}>
          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <div style={{ width:"64px", height:"64px", background:"linear-gradient(135deg,#0d7377,#0a2342)", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", margin:"0 auto 1rem" }}>🩺</div>
            <h1 style={{ fontSize:"1.6rem", fontWeight:"700", color:"#0a2342", margin:"0 0 0.25rem" }}>EPA Tracker</h1>
            <p style={{ color:"#6b7280", fontSize:"0.85rem", margin:0 }}>Pediatrics Residency · Sidra Medicine</p>
          </div>

          <div style={{ display:"flex", background:"#f3f4f6", borderRadius:"10px", padding:"4px", marginBottom:"1.5rem" }}>
            {["login","register"].map(s => (
              <button key={s} onClick={() => { setScreen(s); setError(""); }} style={{ flex:1, padding:"0.5rem", borderRadius:"7px", border:"none", fontWeight:"600", fontSize:"0.85rem", cursor:"pointer", transition:"all 0.2s", background: screen===s ? "white" : "transparent", color: screen===s ? "#0a2342" : "#9ca3af", boxShadow: screen===s ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                {s === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {error && <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", color:"#b91c1c", padding:"0.75rem 1rem", borderRadius:"8px", fontSize:"0.85rem", marginBottom:"1rem" }}>{error}</div>}

          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" onKeyDown={e => e.key==="Enter" && (isReg ? handleRegister() : handleLogin())}
              style={{ padding:"0.85rem 1rem", border:"2px solid #e5e7eb", borderRadius:"10px", fontSize:"0.95rem", outline:"none", fontFamily:"inherit" }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" onKeyDown={e => e.key==="Enter" && (isReg ? handleRegister() : handleLogin())}
              style={{ padding:"0.85rem 1rem", border:"2px solid #e5e7eb", borderRadius:"10px", fontSize:"0.95rem", outline:"none", fontFamily:"inherit" }} />
            {isReg && <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm Password" onKeyDown={e => e.key==="Enter" && handleRegister()}
              style={{ padding:"0.85rem 1rem", border:"2px solid #e5e7eb", borderRadius:"10px", fontSize:"0.95rem", outline:"none", fontFamily:"inherit" }} />}
            <button onClick={isReg ? handleRegister : handleLogin} disabled={loading}
              style={{ padding:"0.9rem", background:"linear-gradient(135deg,#0d7377,#0a2342)", color:"white", border:"none", borderRadius:"10px", fontSize:"1rem", fontWeight:"700", cursor:"pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : isReg ? "Create Account" : "Sign In"}
            </button>
          </div>

          <p style={{ textAlign:"center", fontSize:"0.78rem", color:"#9ca3af", marginTop:"1.5rem", lineHeight:"1.5" }}>
            Your progress is saved to the cloud ☁️<br/>Access from any device with your username & password.
          </p>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  const stages = ["all","TTD","Foundations","Core","TTP"];
  const stageLabels = { all:"All EPAs", TTD:"Transition to Discipline", Foundations:"Foundations", Core:"Core", TTP:"Transition to Practice" };

  return (
    <div style={{ minHeight:"100vh", background:"#f4f1eb", fontFamily:"system-ui, sans-serif" }}>
      {/* HEADER */}
      <div style={{ background:"#0a2342", color:"white", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 1.5rem", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <div style={{ width:"36px", height:"36px", background:"#c9962a", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>🩺</div>
            <div>
              <div style={{ fontWeight:"700", fontSize:"1rem" }}>EPA Tracker</div>
              <div style={{ fontSize:"0.65rem", opacity:0.55, textTransform:"uppercase", letterSpacing:"0.06em" }}>Pediatrics · Sidra Medicine</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            {saveMsg && <span style={{ fontSize:"0.8rem", color:"#86efac" }}>{saveMsg}</span>}
            <span style={{ fontSize:"0.85rem", opacity:0.7 }}>Dr. {currentUser?.username}</span>
            <button onClick={handleLogout} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.3)", color:"white", padding:"0.35rem 0.9rem", borderRadius:"6px", fontSize:"0.8rem", cursor:"pointer" }}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background:"#0a2342", color:"white", padding:"1.25rem 1.5rem 0" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.25rem" }}>
            {[
              { val: totalObs, label: "Total Logged" },
              { val: completedCount, label: "EPAs Done" },
              { val: EPAS.length - completedCount, label: "Remaining" },
              { val: overallPct + "%", label: "Complete" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"1.8rem", fontWeight:"800", color:"#f0c060" }}>{s.val}</div>
                <div style={{ fontSize:"0.7rem", opacity:0.55, textTransform:"uppercase", letterSpacing:"0.07em" }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Overall progress bar */}
          <div style={{ marginBottom:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.7rem", opacity:0.5, marginBottom:"0.4rem" }}>
              <span>OVERALL PROGRESS</span><span>{overallPct}%</span>
            </div>
            <div style={{ height:"8px", background:"rgba(255,255,255,0.15)", borderRadius:"999px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${overallPct}%`, background:"linear-gradient(90deg,#14a085,#f0c060)", borderRadius:"999px", transition:"width 0.5s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"1.5rem" }}>
        {/* Stage Tabs */}
        <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
          {stages.map(s => (
            <button key={s} onClick={() => setActiveStage(s)}
              style={{ padding:"0.45rem 1.1rem", borderRadius:"999px", border:"2px solid transparent", fontSize:"0.82rem", fontWeight:"600", cursor:"pointer", transition:"all 0.2s",
                background: activeStage===s ? (STAGE_COLORS[s] || "#0a2342") : "white",
                color: activeStage===s ? "white" : "#6b7280",
                boxShadow: activeStage===s ? "0 4px 12px rgba(0,0,0,0.15)" : "none"
              }}>
              {stageLabels[s]}
            </button>
          ))}
        </div>

        {/* EPA Cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {filtered.map(epa => {
            const done = isEPADone(epa);
            const met = metReqs(epa);
            const pct = Math.round((met / epa.requirements.length) * 100);
            const isOpen = openCards[epa.id];
            const color = STAGE_COLORS[epa.stage];

            return (
              <div key={epa.id} style={{ background:"white", borderRadius:"12px", boxShadow:"0 2px 12px rgba(10,35,66,0.07)", borderLeft:`5px solid ${done ? "#c9962a" : color}`, overflow:"hidden" }}>
                {/* Card Header */}
                <div onClick={() => toggleCard(epa.id)} style={{ display:"flex", alignItems:"center", padding:"1rem 1.25rem", cursor:"pointer", gap:"0.75rem", userSelect:"none" }}>
                  <span style={{ background: color, color:"white", fontSize:"0.65rem", fontWeight:"700", padding:"0.2rem 0.55rem", borderRadius:"6px", textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap", flexShrink:0 }}>
                    {epa.stage === "Foundations" ? "F" : epa.stage} #{epa.num}
                  </span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:"600", fontSize:"0.88rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{epa.title}</div>
                    <div style={{ fontSize:"0.72rem", color:"#9ca3af", marginTop:"0.1rem" }}>{met}/{epa.requirements.length} requirements met</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", flexShrink:0 }}>
                    <div style={{ width:"70px", height:"5px", background:"#f3f4f6", borderRadius:"999px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background: done ? "#c9962a" : color, borderRadius:"999px", transition:"width 0.3s" }} />
                    </div>
                    <span style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{pct}%</span>
                    {done && <span>✅</span>}
                    <span style={{ fontSize:"0.7rem", color:"#9ca3af", transform: isOpen ? "rotate(180deg)" : "none", transition:"transform 0.3s", display:"inline-block" }}>▼</span>
                  </div>
                </div>

                {/* Card Body */}
                {isOpen && (
                  <div style={{ padding:"0 1.25rem 1.25rem", borderTop:"1px solid #f3f4f6" }}>
                    <p style={{ fontSize:"0.8rem", color:"#6b7280", lineHeight:"1.6", padding:"0.9rem 0", borderBottom:"1px solid #f3f4f6", marginBottom:"1rem" }}>{epa.description}</p>
                    <div style={{ fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af", fontWeight:"700", marginBottom:"0.65rem" }}>Requirements</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                      {epa.requirements.map(r => {
                        const count = getCount(epa.id, r.key);
                        const reqDone = count >= r.target;
                        return (
                          <div key={r.key} style={{ display:"flex", alignItems:"center", gap:"0.75rem", background: reqDone ? "#f0fdf4" : "#f9fafb", borderRadius:"8px", padding:"0.7rem 0.9rem", border:`1px solid ${reqDone ? "#bbf7d0" : "#f3f4f6"}` }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:"0.83rem", fontWeight:"600", color: reqDone ? "#065f46" : "#1a1a2e" }}>{r.label}</div>
                              <div style={{ fontSize:"0.72rem", color:"#9ca3af", marginTop:"0.1rem" }}>{r.detail}</div>
                            </div>
                            {/* Counter */}
                            <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }}>
                              <button onClick={() => changeCount(epa.id, r.key, -1, r.target)} disabled={count <= 0}
                                style={{ width:"30px", height:"30px", borderRadius:"50%", border:"none", background: count <= 0 ? "#f3f4f6" : "#fee2e2", color: count <= 0 ? "#d1d5db" : "#b91c1c", fontSize:"1.1rem", cursor: count <= 0 ? "not-allowed" : "pointer", fontWeight:"700", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>−</button>
                              <span style={{ minWidth:"2.2rem", textAlign:"center", fontWeight:"700", fontSize:"0.95rem", background:"white", border:"1px solid #e5e7eb", borderRadius:"6px", padding:"0.2rem 0.4rem" }}>{count}</span>
                              <button onClick={() => changeCount(epa.id, r.key, 1, r.target)} disabled={count >= r.target}
                                style={{ width:"30px", height:"30px", borderRadius:"50%", border:"none", background: count >= r.target ? "#f3f4f6" : "#d1fae5", color: count >= r.target ? "#d1d5db" : "#065f46", fontSize:"1.1rem", cursor: count >= r.target ? "not-allowed" : "pointer", fontWeight:"700", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>+</button>
                              <span style={{ fontSize:"0.78rem", color:"#9ca3af", whiteSpace:"nowrap" }}>/ {r.target}</span>
                              {reqDone && <span style={{ fontSize:"1rem" }}>✅</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {done && (
                      <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"white", padding:"0.4rem 0.9rem", borderRadius:"999px", fontSize:"0.75rem", fontWeight:"700", marginTop:"1rem", letterSpacing:"0.04em" }}>
                        🏅 EPA Completed
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
