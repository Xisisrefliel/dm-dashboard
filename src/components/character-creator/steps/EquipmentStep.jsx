import Icon from "../../ui/Icon.jsx";
import Ripple from "../../ui/Ripple.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import { styles, ms } from "../styles.js";
import EquipmentCard from "../cards/EquipmentCard.jsx";

export default function EquipmentStep({ char, isMobile: isMobileProp, haptic, classEquipConfig, selectEquipChoice, classData }) {
  const isMobile = useIsMobile();

  return (
    <div>
      <h2 style={styles.stepTitle}>Choose Starting Equipment</h2>
      <p style={styles.stepDesc}>
        {classData
          ? `As a ${classData.name}, select one option from each choice below. Guaranteed items are included automatically.`
          : "Select a class first to see equipment options."}
      </p>

      {classEquipConfig && (
        <>
          {/* Choice groups */}
          {classEquipConfig.choices.map((choiceGroup, idx) => {
            const selectedId = (char.equipChoices || {})[idx];
            return (
              <div key={idx} style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: "var(--dm-primary)",
                  textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 11,
                    background: selectedId != null ? "var(--dm-primary)" : "var(--dm-surface-bright)",
                    color: selectedId != null ? "var(--dm-on-primary)" : "var(--dm-text-muted)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {selectedId != null ? <Icon name="check" size={14} /> : idx + 1}
                  </span>
                  {choiceGroup.label}
                </div>
                <div style={ms(isMobile, styles.cardGrid, { gridTemplateColumns: "1fr" })}>
                  {choiceGroup.options.map((option) => (
                    <EquipmentCard
                      key={option.id}
                      eq={{
                        id: option.id,
                        name: option.name,
                        icon: option.items[0]?.icon || "inventory_2",
                        damage: option.items.length === 1 ? option.items[0].damage : undefined,
                        weight: option.items.length === 1 ? option.items[0].weight : undefined,
                        properties: option.items.length === 1 ? option.items[0].properties : undefined,
                        desc: option.items.length === 1
                          ? option.items[0].desc
                          : "Includes: " + option.items.map((it) => it.name).join(", "),
                      }}
                      selected={selectedId === option.id}
                      disabled={false}
                      onToggle={() => selectEquipChoice(idx, selectedId === option.id ? undefined : option.id)}
                      radioMode
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Guaranteed items */}
          {classEquipConfig.guaranteed.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: "var(--dm-text-muted)",
                textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Icon name="lock" size={16} style={{ color: "var(--dm-text-muted)" }} />
                Guaranteed Items
              </div>
              <div style={ms(isMobile, styles.cardGrid, { gridTemplateColumns: "1fr" })}>
                {classEquipConfig.guaranteed.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    eq={item}
                    selected={true}
                    disabled={true}
                    onToggle={() => {}}
                    locked
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
