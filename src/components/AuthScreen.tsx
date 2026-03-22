import { useState } from "react";
import Icon from "./ui/Icon.tsx";
import Ripple from "./ui/Ripple.tsx";

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

interface AuthScreenProps {
  onAuth: (user: AuthUser) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (isRegister && !displayName)) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister
        ? { email, password, displayName }
        : { email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      onAuth(data);
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        "--dm-bg": "#111611",
        "--dm-surface": "#1e251e",
        "--dm-surface-bright": "#2a322a",
        "--dm-text": "#e2e3dc",
        "--dm-text-secondary": "#c2c9bb",
        "--dm-text-muted": "#8c9386",
        "--dm-primary": "#9fd494",
        "--dm-outline": "#8c9386",
        "--dm-outline-variant": "#424940",
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        height: "100vh",
        background: "var(--dm-bg)",
        color: "var(--dm-text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      } as React.CSSProperties}
    >
      <div
        style={{
          background: "var(--dm-surface)",
          borderRadius: 28,
          padding: 40,
          width: 400,
          maxWidth: "90vw",
          border: "1px solid var(--dm-outline-variant)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Icon
            name="shield_with_house"
            size={48}
            filled
            style={{ color: "var(--dm-primary)", marginBottom: 12 }}
          />
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: "0 0 4px",
            }}
          >
            DM Dashboard
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--dm-text-secondary)",
              margin: 0,
            }}
          >
            {isRegister ? "Create your account" : "Sign in to continue"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {isRegister && (
            <input
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="m3input"
              style={{ fontSize: 15 }}
              autoFocus
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="m3input"
            style={{ fontSize: 15 }}
            autoFocus={!isRegister}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="m3input"
            style={{ fontSize: 15 }}
          />

          {error && (
            <div
              style={{
                fontSize: 13,
                color: "#ffb4ab",
                background: "rgba(58,21,16,0.4)",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              {error}
            </div>
          )}

          <Ripple
            onClick={handleSubmit}
            style={{
              padding: "12px 24px",
              borderRadius: 20,
              background: loading
                ? "var(--dm-outline-variant)"
                : "var(--dm-primary)",
              color: "#0a3806",
              fontWeight: 600,
              fontSize: 15,
              textAlign: "center",
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            {loading ? "..." : isRegister ? "Create Account" : "Sign In"}
          </Ripple>

          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--dm-text-secondary)",
              marginTop: 4,
            }}
          >
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              style={{
                color: "var(--dm-primary)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {isRegister ? "Sign in" : "Register"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
