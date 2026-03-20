import { useState } from "react";
import { INITIAL_CAMPAIGNS, DEFAULT_CATEGORIES } from "./data/sampleCampaign.js";
import CampaignHome from "./components/CampaignHome.jsx";
import DMDashboard from "./components/DMDashboard.jsx";

export default function App() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [activeCampaignId, setActiveCampaignId] = useState(null);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId);

  const handleCreate = ({ name, description, color }) => {
    const newCampaign = {
      id: "camp-" + Date.now(),
      name,
      description,
      color,
      docs: [],
      categories: [...DEFAULT_CATEGORIES],
    };
    setCampaigns((c) => [...c, newCampaign]);
    setActiveCampaignId(newCampaign.id);
  };

  const handleUpdate = (id, { docs, categories }) => {
    setCampaigns((c) =>
      c.map((x) => (x.id === id ? { ...x, docs, categories } : x)),
    );
  };

  const handleBack = (docs, categories) => {
    if (activeCampaignId) {
      handleUpdate(activeCampaignId, { docs, categories });
    }
    setActiveCampaignId(null);
  };

  if (!activeCampaign) {
    return (
      <CampaignHome
        campaigns={campaigns}
        onSelect={setActiveCampaignId}
        onCreate={handleCreate}
      />
    );
  }

  return (
    <DMDashboard
      key={activeCampaignId}
      campaign={activeCampaign}
      onBack={(docs, cats) => handleBack(docs, cats)}
      onUpdate={(data) => handleUpdate(activeCampaignId, data)}
    />
  );
}
