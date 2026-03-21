import classesData from "../data/srd-classes.json";

export function buildSnapshot(ch) {
  const cd = classesData.find((c) => c.id === ch.class);
  const stats = ch.assignedStats || ch.stats || {};
  const hitDie = cd?.hitDie || 8;
  const hp = hitDie + (ch.level - 1) * (Math.floor(hitDie / 2) + 1);
  const dexMod = Math.floor(((stats.DEX || 10) - 10) / 2);
  const ac = 10 + dexMod;

  return {
    localId: ch.id,
    name: ch.name,
    race: ch.race,
    class: ch.class,
    level: ch.level || 1,
    hp,
    ac,
    stats,
  };
}

export function syncCharacterToParty(ch) {
  if (!ch?.id) return;
  const snapshot = buildSnapshot(ch);
  fetch("/api/party/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ character: snapshot }),
  }).catch(() => {});
}
