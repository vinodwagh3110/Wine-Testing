import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">🍷</span>
          <div>
            <h1 className="logo-title">yash<span>Score</span></h1>
            <p className="logo-sub">AI Wine Quality Analyser</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="dot" />
          ML Model Active
        </div>
      </div>
    </header>
  );
}
