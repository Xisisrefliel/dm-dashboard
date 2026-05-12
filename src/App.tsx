import { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen.tsx";
import CampaignHome from "./components/CampaignHome.tsx";
import DMDashboard from "./components/DMDashboard.tsx";
import CharacterCreator from "./components/CharacterCreator.tsx";
import InviteJoin from "./components/InviteJoin.tsx";

interface AppUser {
  id: string;
  email: string;
  displayName: string;
}

interface AppCampaignSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  docCount: number;
  categoryCount: number;
  role: string;
}

interface AppCampaign {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  role: string;
  docs: any[];
  categories: any[];
}

function getSlugFromURL(): string | null {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return path || null;
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [campaigns, setCampaigns] = useState<AppCampaignSummary[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<AppCampaign | null>(null);
  const [page, setPage] = useState<string | null>(() => {
    const slug = getSlugFromURL();
    if (slug === "character-creator") return "character-creator";
    if (slug === "characters") return "characters";
    if (slug?.startsWith("invite/")) return "invite";
    return null;
  });
  const [inviteToken] = useState<string | null>(() => {
    const slug = getSlugFromURL();
    return slug?.startsWith("invite/") ? slug.replace("invite/", "") : null;
  });
  const [editCharacterId, setEditCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [leavingHome, setLeavingHome] = useState<boolean>(false);
  const [enteringCampaign, setEnteringCampaign] = useState<boolean>(false);

  const fetchCampaignBySlug = async (slug: string): Promise<AppCampaign | null> => {
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

        if (slug && slug !== "character-creator" && slug !== "characters" && !slug.startsWith("invite/")) {
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
      if (slug === "character-creator" || slug === "characters" || slug?.startsWith("invite/")) {
        setActiveCampaign(null);
        setPage(slug?.startsWith("invite/") ? "invite" : slug);
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

  const handleAuth = (u: AppUser) => {
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

  const handleCreate = async ({ name, description, color }: { name: string; description: string; color: string }) => {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, color }),
    });
    if (!res.ok) return;
    const campaign = await res.json();
    window.history.pushState(null, "", `/${campaign.slug}`);
    setLeavingHome(true);
    setEnteringCampaign(true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    setActiveCampaign(campaign);
    setLeavingHome(false);
  };

  const handleSelect = async (id: string, slug: string) => {
    window.history.pushState(null, "", `/${slug}`);

    const campaign = await fetch(`/api/campaigns/${id}`).then((r) => (r.ok ? r.json() : null));

    if (!campaign) {
      window.history.replaceState(null, "", "/");
      return;
    }

    // Keep the home screen visible while data loads. Only fade once the
    // campaign is ready, so navigation never shows an empty color frame.
    setLeavingHome(true);
    setEnteringCampaign(true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    setActiveCampaign(campaign);
    setLeavingHome(false);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleRename = async (id: string, name: string) => {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: updated.name, slug: updated.slug } : c)),
    );
  };

  const handleBack = () => {
    setEnteringCampaign(false);
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
          background: "#141518",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c7c9d1",
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

  if (page === "invite" && inviteToken) {
    return (
      <InviteJoin
        token={inviteToken}
        onBack={() => {
          setPage(null);
          window.history.pushState(null, "", "/");
        }}
      />
    );
  }

  if (page === "character-creator") {
    return (
      <CharacterCreator
        editId={editCharacterId}
        onBack={() => {
          setEditCharacterId(null);
          setPage("characters");
          window.history.pushState(null, "", "/characters");
        }}
      />
    );
  }

  if (page === "characters") {
    return (
      <CharacterCreator
        listMode
        onBack={() => {
          setPage(null);
          window.history.pushState(null, "", "/");
        }}
        onNewCharacter={() => {
          setEditCharacterId(null);
          setPage("character-creator");
          window.history.pushState(null, "", "/character-creator");
        }}
        onEditCharacter={(id) => {
          setEditCharacterId(id);
          setPage("character-creator");
          window.history.pushState(null, "", "/character-creator");
        }}
      />
    );
  }

  if (activeCampaign) {
    return (
      <div
        key={activeCampaign.id}
        className={enteringCampaign ? "page-enter-forward" : undefined}
        onAnimationEnd={() => setEnteringCampaign(false)}
      >
        <DMDashboard campaign={activeCampaign} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className={leavingHome ? "page-leave-forward" : "page-home"}>
      <CampaignHome
        campaigns={campaigns}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onRename={handleRename}
        user={user}
        onLogout={handleLogout}
        onCharacterCreator={() => {
          setPage("characters");
          window.history.pushState(null, "", "/characters");
        }}
      />
    </div>
  );
}
