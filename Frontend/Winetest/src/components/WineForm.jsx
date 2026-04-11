import { useState } from "react";
import "./WineForm.css";

const GROUPS = {
  acidity: [
    { key:"fixed_acidity",    label:"Fixed Acidity",    unit:"g/dm³",  min:4,    max:16,   step:0.1,   def:7.4,   tip:"Tartaric acid content" },
    { key:"volatile_acidity", label:"Volatile Acidity", unit:"g/dm³",  min:0.1,  max:1.6,  step:0.01,  def:0.6,   tip:"Acetic acid — too high = vinegar" },
    { key:"citric_acid",      label:"Citric Acid",      unit:"g/dm³",  min:0,    max:1,    step:0.01,  def:0.26,  tip:"Adds freshness & flavour" },
    { key:"pH",               label:"pH Level",         unit:"",       min:2.7,  max:4.1,  step:0.01,  def:3.35,  tip:"Acidity / basicity scale" },
  ],
  sugars: [
    { key:"residual_sugar",   label:"Residual Sugar",   unit:"g/dm³",  min:0.9,  max:15.5, step:0.1,   def:2.5,   tip:"Sugar after fermentation" },
    { key:"chlorides",        label:"Chlorides",        unit:"g/dm³",  min:0.01, max:0.2,  step:0.001, def:0.075, tip:"Salt content in wine" },
    { key:"sulphates",        label:"Sulphates",        unit:"g/dm³",  min:0.3,  max:2,    step:0.01,  def:0.65,  tip:"Wine preservative" },
  ],
  sulfur: [
    { key:"free_sulfur_dioxide",  label:"Free SO₂",  unit:"mg/dm³", min:1,  max:72,  step:1, def:20, tip:"Free form of SO₂" },
    { key:"total_sulfur_dioxide", label:"Total SO₂", unit:"mg/dm³", min:6,  max:289, step:1, def:80, tip:"Total SO₂ content" },
  ],
  physical: [
    { key:"density", label:"Density", unit:"g/cm³", min:0.990, max:1.004, step:0.0001, def:0.9970, tip:"Liquid density" },
    { key:"alcohol", label:"Alcohol", unit:"% vol",  min:8,    max:15,    step:0.1,    def:10.5,   tip:"Alcohol % by volume" },
  ],
};

const ALL_FIELDS = Object.values(GROUPS).flat();

const SAMPLES = {
  "Average Red": { fixed_acidity:7.8, volatile_acidity:0.53, citric_acid:0.04, residual_sugar:1.7, chlorides:0.076, free_sulfur_dioxide:17, total_sulfur_dioxide:31, density:0.9964, pH:3.33, sulphates:0.56, alcohol:10 },
  "Good Red":    { fixed_acidity:6.8, volatile_acidity:0.6,  citric_acid:0.18, residual_sugar:1.9, chlorides:0.079, free_sulfur_dioxide:18, total_sulfur_dioxide:86, density:0.9968, pH:3.59, sulphates:0.57, alcohol:9.3 },
  "Premium":     { fixed_acidity:7.3, volatile_acidity:0.32, citric_acid:0.42, residual_sugar:2.4, chlorides:0.058, free_sulfur_dioxide:22, total_sulfur_dioxide:60, density:0.9962, pH:3.28, sulphates:0.82, alcohol:13.2 },
  "Poor Quality":{ fixed_acidity:7.6, volatile_acidity:0.95, citric_acid:0.03, residual_sugar:2.0, chlorides:0.09,  free_sulfur_dioxide:7,  total_sulfur_dioxide:20, density:0.9959, pH:3.2,  sulphates:0.56, alcohol:9.6 },
};

const TAB_LABELS = { acidity:"Acidity", sugars:"Sugars & Salts", sulfur:"Sulfur", physical:"Physical" };

function defaults() { return ALL_FIELDS.reduce((a,f) => ({...a,[f.key]:f.def}), {}); }

export default function WineForm({ onPredict, loading, onReset }) {
  const [values, setValues] = useState(defaults());
  const [tab, setTab] = useState("acidity");

  const dec = (f) => f.step < 0.001 ? 4 : f.step < 0.01 ? 3 : f.step < 0.1 ? 2 : f.step < 1 ? 1 : 0;

  const handleSlider = (key, val, field) => {
    setValues(p => ({...p, [key]: parseFloat(val)}));
  };

  const loadSample = (name) => { setValues({...values,...SAMPLES[name]}); onReset(); };
  const reset = () => { setValues(defaults()); onReset(); };

  const activeFields = GROUPS[tab];

  return (
    <div className="wf-panel">
      {/* Header */}
      <div className="wf-header">
        <div>
          <div className="wf-title">Wine Parameter Input</div>
          <div className="wf-subtitle">Adjust sliders to match your wine's chemistry</div>
        </div>
        <div className="wf-status"><span className="wf-dot" /> Model Ready</div>
      </div>

      {/* Quick samples */}
      <div className="wf-samples">
        <span className="samples-hint">Quick load:</span>
        {Object.keys(SAMPLES).map(name => (
          <button key={name} className="wf-chip" onClick={() => loadSample(name)}>{name}</button>
        ))}
      </div>

      {/* Tabs */}
      <div className="wf-tabs">
        {Object.keys(GROUPS).map(g => (
          <button key={g} className={`wf-tab${tab===g?" active":""}`} onClick={() => setTab(g)}>
            {TAB_LABELS[g]}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="wf-fields">
        {activeFields.map(f => {
          const v = values[f.key];
          const d = dec(f);
          const pct = ((v - f.min) / (f.max - f.min)) * 100;
          return (
            <div key={f.key} className="wf-field">
              <div className="wf-field-header">
                <div>
                  <span className="wf-field-label">{f.label}</span>
                  <span className="wf-field-tip">{f.tip}</span>
                </div>
                <div className="wf-field-val">
                  {v.toFixed(d)}<span>{f.unit ? " "+f.unit : ""}</span>
                </div>
              </div>
              <div className="wf-slider-wrap">
                <input type="range" min={f.min} max={f.max} step={f.step} value={v}
                  style={{ background:`linear-gradient(to right,#c02940 ${pct}%,#281520 ${pct}%)` }}
                  onChange={e => handleSlider(f.key, e.target.value, f)} />
              </div>
              <div className="wf-bounds">
                <span>{f.min}</span><span>{f.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="wf-actions">
        <button className="wf-reset" onClick={reset} disabled={loading}>↺ Reset</button>
        <button className="wf-predict" onClick={() => onPredict(values)} disabled={loading}>
          {loading
            ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}><span className="wf-spin" /> Analysing…</span>
            : "✦ Analyse Wine Quality"}
        </button>
      </div>
    </div>
  );
}
