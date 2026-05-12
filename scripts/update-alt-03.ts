import { db } from '../src/db';
import { docs } from '../src/db/schema';
import { eq } from 'drizzle-orm';
const id='b17f95a0-ad9e-4fd5-af2f-bdc8e36d7290';
const [row]=await db.select({content:docs.content}).from(docs).where(eq(docs.id,id));
const english=(row?.content||'').replace(/^<!--\s*lang:de\s*-->[\s\S]*?<!--\s*lang:en\s*-->/i,'').trim();
const german=`# The Loop — NSCs

> Jeder NSC hat eine Routine, ein Geheimnis und eine Haltung zur „Vereinbarung“. Die meisten kennen nicht die ganze Wahrheit. Sie kennen nur ihren Teil.

---

## Ilsa — Die Mutter / Blumenverkäuferin

**Wer sie ist:** Mitte 40, wettergegerbt, warmherzig. Verkauft Blumen auf dem Marktplatz. Sie hat eine sanfte Stimme und summt manchmal ein Schlaflied, ohne es zu merken. Das Dorf mag sie. Der Bürgermeister meidet sie.

**Routine:** Morgens am Blumenstand. Später kann sie an der Kirche, am Friedhof oder am Osttor auftauchen. Diese Abweichungen sind wichtig: Sie ist die einzige Person, deren Verhalten manchmal ohne Eingriff der Gruppe variiert.

**Geheimnis:** Sie hat ihre Tochter Lise versteckt, weil sie sich weigert, sie dem Drachen zu geben. Ihre Trauer und Schuld haben die Zeitschleife erschaffen, aber sie weiß es nicht bewusst.

**Was sie glaubt:** Wenn Lise gefunden wird, wird das Dorf sie opfern. Ilsa glaubt, sie müsse allein stark sein.

**Wie man sie spielt:** Freundlich, müde, abgelenkt. Sie lächelt zu spät. Wenn Kinder lachen, schaut sie hin und dann sofort weg.

**Hinweise in Gesprächen:**

- „Kinder gehen irgendwann fort. So ist das hier.“
- „Nicht jede Tradition verdient es, erinnert zu werden.“
- „Ich habe manchmal das Gefühl, ich habe diesen Morgen schon erlebt.“
- Bei Konfrontation: „Ihr versteht nicht, was sie ihr antun würden.“

**Wenn sie bricht:** Sie sagt nicht sofort alles. Erst bittet sie die Gruppe, Lise nicht auszuliefern. Dann gesteht sie, dass Lise in der Kirche versteckt ist.

---

## Lise — Ilsas Tochter

**Wer sie ist:** Ein verängstigtes Kind, ungefähr 8–10 Jahre alt. Versteckt im Keller der Kirche hinter einer falschen Wand.

**Routine:** Sie bleibt versteckt. Sie zeichnet Drachen. Sie hört Schritte über sich. Sie weiß, dass ihre Mutter Angst hat.

**Geheimnis:** Sie glaubt, der Drache komme, weil sie sich versteckt. Diese Schuld ist nicht rational, aber emotional wahr für sie.

**Wie man sie spielt:** Leise, vorsichtig, aber nicht passiv. Sie stellt direkte Kinderfragen.

**Sätze:**

- „Mama sagt, ich darf nicht raus.“
- „Kommt der Drache wegen mir?“
- „Wenn ich rausgehe, hört es dann auf?“
- „Ich will nicht, dass alle brennen.“

**Funktion im Abenteuer:** Lise ist kein Schlüsselgegenstand. Sie ist der Mensch, wegen dem die moralische Entscheidung zählt. Die Gruppe soll sie schützen wollen, nicht benutzen.

---

## Bürgermeister Rovan

**Wer er ist:** Gepflegt, kontrolliert, erschöpft. Ein Mann, der sich selbst eingeredet hat, Grausamkeit sei Verantwortung.

**Routine:** Morgens im Rathaus. Um 14:00 Uhr Ratssitzung. Danach versucht er, Unruhe zu unterdrücken.

**Geheimnis:** Er kennt den Pakt und weiß, dass „Lehrzeit im Osten“ eine Lüge ist. Er hat Briefe über die aktuelle Zahlung und Ilsas Weigerung.

**Was er glaubt:** Ein Kind zu opfern ist schrecklich, aber ein ganzes Dorf sterben zu lassen sei schlimmer. Er hält sich für den Einzigen, der erwachsen genug ist, diese Entscheidung zu tragen.

**Wie man ihn spielt:** Ruhig, defensiv, paternalistisch. Er sagt oft „Ihr versteht die Verantwortung nicht.“

**Sätze:**

- „Ashen steht noch, weil unsere Vorfahren schwere Entscheidungen trafen.“
- „Tradition ist nicht immer schön. Aber sie schützt uns.“
- „Wenn eine Mutter ihr Kind versteckt, gefährdet sie alle Kinder.“
- Bei Beweisen: „Ja. Und was hättet ihr getan?“

**Wenn er überzeugt wird:** Nur öffentliche Verantwortung oder klare Alternative bringt ihn zum Kippen. Er muss sehen, dass das Dorf gemeinsam handelt oder der Drache anders gestoppt werden kann.

---

## Schwester Maela — Priesterin

**Wer sie ist:** Ältere Priesterin der Dorfkirche. Ruhig, streng, mit echtem Mitgefühl.

**Routine:** Morgenandacht, Pflege der Kirche, kurze Gespräche mit Dorfbewohnern. Sie bemerkt, wenn jemand den Keller durchsucht.

**Geheimnis:** Sie kennt Bruchstücke des Paktes aus alten Chroniken, aber nicht unbedingt Lises Versteck. Sie hat weggesehen, weil Wegsehen einfacher war.

**Was sie glaubt:** Schuld kann nur enden, wenn sie ausgesprochen wird.

**Wie man sie spielt:** Langsam, bedacht. Sie antwortet selten sofort.

**Sätze:**

- „Manche Gebete bitten nicht um Vergebung, sondern um Vergessen.“
- „Die Chroniken haben Lücken. Lücken, die jemand wollte.“
- „Wenn ein Dorf gemeinsam sündigt, kann keine Einzelne allein büßen.“

**Nutzen:** Sie kann beim diplomatischen Ende helfen, Ilsa schützen oder das Dorf öffentlich zur Wahrheit zwingen.

---

## Der Schmied — Harker

**Wer er ist:** Kräftig, praktisch, rußverschmiert. Glaubt an Dinge, die man anfassen, wiegen und reparieren kann.

**Routine:** Arbeitet vormittags in der Schmiede, geht mittags zum Brunnen, arbeitet weiter bis zum Nachmittag.

**Geheimnis:** Sein Großvater erzählte Geschichten über Drachenschuppen und eine alte Wunde. Harker hielt das für Märchen.

**Was er glaubt:** Panik ist nutzlos. Ein Plan ist nützlich.

**Wie man ihn spielt:** Kurz angebunden, aber loyal, sobald er überzeugt ist.

**Sätze:**

- „Ein Drache? Dann bringt mir Maße, nicht Märchen.“
- „Ich kann euch helfen. Aber nicht, wenn ihr mir nur Angst bringt.“
- „Sag mir, wo die Schuppe offen ist, und ich mache euch etwas, das dort reinpasst.“

**Nutzen:** Er ist zentral für den Kampfweg. Mit Vorwissen fertigt er Pfeile, Ketten, Speere oder Fallenbauteile.

---

## Der Müller — Toben

**Wer er ist:** Nervöser Mann an der alten Mühle. Kennt den Fluss besser als jeder andere.

**Routine:** Vormittags an der Mühle, mittags sieht er den Schatten, nachmittags wird er unruhig.

**Geheimnis:** Er hat den Drachen schon mehrfach als Schatten gesehen, aber sich eingeredet, es seien Wolken.

**Sätze:**

- „Der Fluss wird still, kurz bevor der Schatten kommt.“
- „Ich schwöre, da war etwas über dem Wasser.“
- „Wenn ihr hier kämpfen wollt, dann kämpft nicht gegen die Mühle. Nutzt sie.“

**Nutzen:** Er kann die Mühle erklären und beim Aufbau einer Falle helfen.

---

## Hauptmann Sera — Torwache

**Wer sie ist:** Verantwortliche Wache am Osttor. Mutig, aber an Dorfordnung gebunden.

**Routine:** Morgens am Tor, später Patrouille, bei Panik versucht sie Menschen zu schützen.

**Geheimnis:** Ihre ältere Schwester wurde vor Jahren als „Lehrling“ fortgeschickt. Sera glaubt die offizielle Geschichte nicht mehr ganz.

**Sätze:**

- „Nach Osten geht niemand gern. Nicht laut. Nicht ehrlich.“
- „Meine Schwester schrieb nie zurück.“
- „Gebt mir einen Grund, dem Bürgermeister zu widersprechen.“

**Nutzen:** Mit Beweisen kann sie Wachen auf die Seite der Gruppe bringen.

---

## Das Apfelkind — Niko

**Wer er ist:** Kind auf dem Marktplatz, dessen Korb zu Beginn jeder Schleife fällt.

**Funktion:** Marker der Schleife. Emotionaler Anker. Zeigt, was auf dem Spiel steht.

**Sätze:**

- „Hey! Meine Äpfel!“
- „Ihr habt das schon mal gesehen, oder?“
- „Warum guckt Frau Ilsa immer so traurig?“

**Nutzen:** Niko kann kleine Gerüchte über Kinder, Lehrlinge und Lise liefern, ohne die Tragweite zu verstehen.

---

## Der Drache

**Wer er ist:** Alt, intelligent, vertraglich gebunden. Nicht menschlich grausam, aber gefährlich logisch.

**Routine:** Ruht morgens im Osten, fliegt mittags tief über die Mühle, kommt bei Sonnenuntergang nach Ashen.

**Was er glaubt:** Ashen hat einen Vertrag geschlossen. Verträge haben Preise. Wenn Sterbliche Verträge vergessen, macht sie das nicht frei.

**Wie man ihn spielt:** Ruhig, gewaltig, nicht hastig. Er muss nicht schreien. Er weiß, dass er Macht hat.

**Sätze:**

- „Ich komme nicht als Räuber. Ich komme als Gläubiger.“
- „Eure Vorfahren baten. Ich antwortete. Nun zahlt ihr.“
- „Wenn der Vertrag gebrochen werden soll, nennt mir einen Preis, der Gewicht hat.“

**Nutzen:** Er kann bekämpft, überzeugt oder neu verhandelt werden. Er ist nicht nur Monster, sondern auch Richter über eine alte Schuld.

---

## Spielleitung: NSCs in Schleifen

Wiederhole NSC-Routinen zuverlässig. Genau dadurch merken die Spieler, wann etwas abweicht. Gib jedem NSC eine klare erste Reaktion, aber lass sie durch Beweise, wiederholtes Wissen und emotionale Wahrheit kippen.

Die wichtigsten Beziehungen:

- Ilsa schützt Lise.
- Rovan schützt das Dorfbild.
- Maela schützt die Wahrheit, auch wenn sie zu spät handelt.
- Harker schützt durch Taten.
- Sera schützt Menschen, sobald sie weiß, wen sie schützen muss.
- Der Drache schützt den Vertrag, bis die Gruppe etwas Stärkeres anbietet.`;
await db.update(docs).set({title:'03 - NSCs / NPCs',content:`<!-- lang:de -->\n${german}\n\n<!-- lang:en -->\n${english}`,updatedAt:new Date()}).where(eq(docs.id,id));
console.log('updated',id);
process.exit(0);
