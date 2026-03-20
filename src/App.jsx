import { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen.jsx";
import CampaignHome from "./components/CampaignHome.jsx";
import DMDashboard from "./components/DMDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        setUser(u);
        if (u) return fetch("/api/campaigns").then((r) => r.json());
        return [];
      })
      .then((c) => setCampaigns(c || []))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (u) => {
    setUser(u);
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then(setCampaigns);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCampaigns([]);
    setActiveCampaign(null);
  };

  const handleCreate = async ({ name, description, color }) => {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, color }),
    });
    if (!res.ok) return;
    const campaign = await res.json();
    setActiveCampaign(campaign);
  };

  const handleSelect = async (id) => {
    const res = await fetch(`/api/campaigns/${id}`);
    if (!res.ok) return;
    const campaign = await res.json();
    setActiveCampaign(campaign);
  };

  const handleBack = () => {
    setActiveCampaign(null);
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then(setCampaigns);
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#111611",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9fd494",
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        <span style={{ fontSize: 16, opacity: 0.6 }}>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (activeCampaign) {
    return (
      <DMDashboard
        key={activeCampaign.id}
        campaign={activeCampaign}
        onBack={handleBack}
      />
    );
  }

  return (
    <CampaignHome
      campaigns={campaigns}
      onSelect={handleSelect}
      onCreate={handleCreate}
      user={user}
      onLogout={handleLogout}
    />
  );
}
