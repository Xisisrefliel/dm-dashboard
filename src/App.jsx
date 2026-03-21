import { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen.jsx";
import CampaignHome from "./components/CampaignHome.jsx";
import DMDashboard from "./components/DMDashboard.jsx";
import CharacterCreator from "./components/CharacterCreator.jsx";

function getSlugFromURL() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return path || null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [page, setPage] = useState(getSlugFromURL() === "character-creator" ? "character-creator" : null);
  const [loading, setLoading] = useState(true);

  const fetchCampaignBySlug = async (slug) => {
    const res = await fetch(`/api/campaigns/${encodeURIComponent(slug)}`);
    if (res.ok) return res.json();
    return null;
  };

  // On mount: check auth, load campaigns, restore from URL
  useEffect(() => {
    const slug = getSlugFromURL();

    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(async (u) => {
        setUser(u);
        if (!u) return;

        const res = await fetch("/api/campaigns");
        const list = await res.json();
        setCampaigns(list);

        if (slug && slug !== "character-creator") {
          const campaign = await fetchCampaignBySlug(slug);
          if (campaign) {
            setActiveCampaign(campaign);
          } else {
            window.history.replaceState(null, "", "/");
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Browser back/forward
  useEffect(() => {
    const onPopState = async () => {
      const slug = getSlugFromURL();
      if (slug === "character-creator") {
        setActiveCampaign(null);
        setPage("character-creator");
        return;
      }
      setPage(null);
      if (!slug) {
        setActiveCampaign(null);
        const res = await fetch("/api/campaigns");
        setCampaigns(await res.json());
      } else {
        const campaign = await fetchCampaignBySlug(slug);
        if (campaign) {
          setActiveCampaign(campaign);
        } else {
          window.history.replaceState(null, "", "/");
          setActiveCampaign(null);
        }
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
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
    window.history.pushState(null, "", "/");
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
    window.history.pushState(null, "", `/${campaign.slug}`);
  };

  const handleSelect = async (id, slug) => {
    // Navigate immediately, then load data
    window.history.pushState(null, "", `/${slug}`);
    const res = await fetch(`/api/campaigns/${id}`);
    if (!res.ok) return;
    const campaign = await res.json();
    setActiveCampaign(campaign);
  };

  const handleBack = () => {
    setActiveCampaign(null);
    window.history.pushState(null, "", "/");
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

  if (page === "character-creator") {
    return (
      <CharacterCreator
        onBack={() => {
          setPage(null);
          window.history.pushState(null, "", "/");
        }}
      />
    );
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
      onCharacterCreator={() => {
        setPage("character-creator");
        window.history.pushState(null, "", "/character-creator");
      }}
    />
  );
}
