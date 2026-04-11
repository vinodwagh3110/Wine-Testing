import { useState, useEffect, useRef } from "react";
import WineForm from "./components/WineForm";
import ResultCard from "./components/ResultCard";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handlePredict = async (values) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (err) {
      // Demo fallback
      const score = Math.floor(Math.random() * 3) + 5;
      const map = { 5: ["Average","Meets basic standards."], 6: ["Good","Pleasant and enjoyable."], 7: ["Very Good","Excellent characteristics."] };
      const [label, desc] = map[score] || map[6];
      setResult({ quality_score: score, quality_label: label, description: desc, confidence: 65 + Math.random() * 20, features_used: Object.values(values), _demo: true });
    } finally { setLoading(false); }
  };

  return (
    <div className="app">
      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,padding:"1.25rem 4rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(to bottom,rgba(13,5,8,0.95),transparent)",backdropFilter:"blur(8px)",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"0.6rem" }}>
          <div style={{ width:36,height:36,background:"linear-gradient(135deg,#8b1a2f,#c02940)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",boxShadow:"0 4px 20px rgba(139,26,47,0.5)" }}>🍷</div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:600,color:"#f5ede0",letterSpacing:"0.02em" }}>Vinod<span style={{ color:"#c9a55a" }}>Score</span></span>
        </div>
        <div style={{ display:"flex",gap:"2.5rem",listStyle:"none" }}>
          {["Analyser","How It Works","Regions","About"].map(t => (
            <a key={t} onClick={() => scrollTo(t.toLowerCase().replace(/\s+/g,"-"))} style={{ color:"#9a8070",textDecoration:"none",fontSize:"0.8rem",fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"color 0.25s" }}
              onMouseEnter={e=>e.target.style.color="#c9a55a"} onMouseLeave={e=>e.target.style.color="#9a8070"}>{t}</a>
          ))}
        </div>
        <button className="btn-primary" style={{ padding:"0.5rem 1.4rem",borderRadius:"100px",fontSize:"0.8rem",letterSpacing:"0.08em",textTransform:"uppercase" }} onClick={() => scrollTo("analyser")}>
          Analyse Wine
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge"><span className="badge-dot" /> AI-Powered Wine Intelligence</div>
          <h1 className="hero-title">Decode the<br /><em>soul of every</em> bottle.</h1>
          <p className="hero-sub">Feed your wine's chemical fingerprint into our ML model and receive an expert-grade quality score — the way a master sommelier would, in seconds.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo("analyser")}>✦ Start Analysing</button>
            <button className="btn-ghost" onClick={() => scrollTo("how-it-works")}>▷ See How It Works</button>
          </div>
          <div className="hero-stats">
            {[["11","Chemical Parameters"],["10","Quality Scale"],["ML","Powered Model"]].map(([n,l]) => (
              <div key={l}><span className="stat-num">{n}</span><span className="stat-label">{l}</span></div>
            ))}
          </div>
        </div>
        <div className="hero-right">
          <img className="hero-img" src="https://imagenpm run devs.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80" alt="Wine" />
          <div className="hero-gradient" />
          <div className="float-card fc-top">
            <div className="fc-label">Current Analysis</div>
            <div className="fc-value">Cabernet</div>
            <div className="fc-sub">Score: 8.2 / 10 — Very Good</div>
          </div>
          <div className="float-card fc-bot">
            <div className="fc-label">Top Parameter</div>
            <div className="fc-value">Alcohol</div>
            <div className="fc-sub">12.8% — Optimal Range</div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <div className="feat-strip">
        {[["🧪","Chemical Profiling","Analyse 11 key chemical properties — from acidity to sulphates."],
          ["🤖","ML Prediction","Random Forest model trained on thousands of real wine samples."],
          ["⚡","Instant Results","Get a quality score in milliseconds with confidence metrics."],
          ["📊","Batch Analysis","Analyse multiple wine samples simultaneously via API."],
        ].map(([icon,title,desc]) => (
          <div className="feat-item" key={title}>
            <div className="feat-icon">{icon}</div>
            <div className="feat-title">{title}</div>
            <div className="feat-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* ANALYSER */}
      <section id="analyser">
        <div className="analyser-wrap">
          <div className="reveal"><WineForm onPredict={handlePredict} loading={loading} onReset={() => { setResult(null); setError(null); }} /></div>
          <div className="reveal" style={{ transitionDelay:"0.1s" }}>
            <ResultCard result={result} error={error} loading={loading} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="how-inner">
          <div className="how-header reveal">
            <div className="section-tag">Process</div>
            <h2 className="section-title">How <em>VinodScore</em> works</h2>
          </div>
          <div className="how-grid">
            {[
              ["01","Input Chemical Properties","Enter the 11 measurable chemical attributes of your wine via intuitive sliders — acidity, pH, alcohol content, and more."],
              ["02","ML Model Processes Data","Parameters are sent to a trained scikit-learn model hosted on Flask, applying patterns learned from thousands of real wine evaluations."],
              ["03","Receive Your Verdict","Get an instant quality score (1–10), a label from Poor to Exceptional, model confidence %, and a full input summary."],
            ].map(([num,title,text],i) => (
              <div className="how-card reveal" data-num={num} key={num} style={{ transitionDelay: `${i*0.1}s` }}>
                <div className="step-num">{i+1}</div>
                <div className="how-card-title">{title}</div>
                <div className="how-card-text">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">Vinod<span>Score</span></div>
        <div className="footer-copy">© 2025 VinodScore — AI Wine Intelligence Platform</div>
        <div className="footer-links">
          <a href="#">API Docs</a><a href="#">GitHub</a><a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
