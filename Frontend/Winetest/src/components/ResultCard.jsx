import { useEffect, useRef, useState } from "react";
import "./ResultCard.css";

const CFG = {
  Poor:       { color:"#e05050", bar:12, emoji:"😞", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=70" },
  Average:    { color:"#e0a050", bar:36, emoji:"😐", img:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=70" },
  Good:       { color:"#5090e0", bar:58, emoji:"😊", img:"https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&auto=format&fit=crop&q=70" },
  "Very Good":{ color:"#50c080", bar:78, emoji:"😄", img:"https://images.unsplash.com/photo-1547595628-c61a29f498af?w=600&auto=format&fit=crop&q=70" },
  Exceptional:{ color:"#c9a55a", bar:96, emoji:"🤩", img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=70" },
};

const FEAT_NAMES = ["Fixed Acidity","Volatile Acidity","Citric Acid","Residual Sugar","Chlorides","Free SO₂","Total SO₂","Density","pH","Sulphates","Alcohol"];

export default function ResultCard({ result, error }) {
  const [barW, setBarW] = useState(0);
  const cfg = result ? (CFG[result.quality_label] || CFG["Good"]) : null;

  useEffect(() => {
    if (result && cfg) {
      setBarW(0);
      setTimeout(() => setBarW(cfg.bar), 120);
    }
  }, [result]);

  if (error) return (
    <div className="rc-error">
      <span style={{fontSize:"1.4rem"}}>⚠</span>
      <div>
        <div style={{fontWeight:600,marginBottom:"0.25rem"}}>Prediction Error</div>
        <div style={{fontSize:"0.82rem",color:"#e8647a"}}>{error}</div>
      </div>
    </div>
  );

  if (!result) return (
    <div className="rc-placeholder">
      <div className="rc-ph-img-wrap">
        <img src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=70" alt="Wine" className="rc-ph-img" />
        <div className="rc-ph-gradient" />
      </div>
      <div className="rc-ph-body">
        <div className="rc-ph-glass">🍷</div>
        <div className="rc-ph-title">Awaiting Analysis</div>
        <div className="rc-ph-sub">Configure parameters on the left, then click <strong>Analyse Wine Quality</strong> to reveal the verdict.</div>
      </div>
    </div>
  );

  return (
    <div className="rc-result">
      {/* Hero image with score badge */}
      <div className="rc-img-wrap">
        <img src={cfg.img} alt={result.quality_label} className="rc-img" />
        <div className="rc-img-gradient" />
        <div className="rc-score-badge" style={{background:`linear-gradient(135deg,#8b1a2f,${cfg.color})`}}>
          <span className="rc-score-num">{result.quality_score}</span>
          <span className="rc-score-sub">/10</span>
        </div>
      </div>

      <div className="rc-body">
        {/* Label */}
        <div className="rc-quality" style={{color:cfg.color}}>{cfg.emoji} {result.quality_label}</div>
        <div className="rc-desc">{result.description}</div>

        {/* Bar */}
        <div className="rc-bar-section">
          <div className="rc-bar-labels"><span>Poor</span><span>Exceptional</span></div>
          <div className="rc-bar"><div className="rc-bar-fill" style={{width:`${barW}%`,background:`linear-gradient(to right,#8b1a2f,${cfg.color})`}} /></div>
        </div>

        {/* Confidence */}
        {result.confidence !== undefined && (
          <div className="rc-confidence">
            🎯 Model Confidence: <strong style={{color:"#c9a55a"}}>{result.confidence.toFixed(1)}%</strong>
          </div>
        )}

        {result._demo && (
          <div className="rc-demo-note">⚠ Demo mode — connect Flask backend for real predictions</div>
        )}

        {/* Feature pills */}
        {result.features_used && (
          <div className="rc-features">
            {FEAT_NAMES.map((name,i) => (
              <div key={name} className="rc-pill">
                <span className="rc-pill-name">{name}</span>
                <span className="rc-pill-val">{typeof result.features_used[i]==="number"?result.features_used[i].toFixed(3):result.features_used[i]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
