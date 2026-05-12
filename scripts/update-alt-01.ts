import { db } from '../src/db';
import { docs } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const id = '3fdeda78-a235-4884-a659-942ca991d1c3';
const [row] = await db.select({content: docs.content}).from(docs).where(eq(docs.id, id));
const english = (row?.content || '').replace(/^<!--\s*lang:de\s*-->[\s\S]*?<!--\s*lang:en\s*-->/i, '').trim();
const german = `# The Loop — Zeitlinie

Dies ist der **Standardtag**. Jede Schleife beginnt hier. Wenn die Gruppe nichts verändert, passieren alle Ereignisse unten zur gleichen Zeit und auf dieselbe Weise.

Die Schleife wird bei **Sonnenuntergang um 18:00 Uhr** zurückgesetzt, sobald der Drache ankommt — oder früher, wenn die gesamte Gruppe stirbt.

---

## Zeitübersicht

| Zeit | Abschnitt | Zusammenfassung |
|------|-----------|-----------------|
| 06:00 | Morgengrauen | Das Dorf erwacht. Der Apfelkorb fällt. Ilsa verkauft Blumen. |
| 07:00 | Früher Morgen | Händler bauen auf, Bauern gehen auf die Felder, Wachen öffnen die Tore. |
| 08:00 | Morgen | Der Bürgermeister spricht mit Schreibern. Die Kirche bereitet die Morgenandacht vor. |
| 09:00 | Morgen | Erste Gerüchte über Unruhe im Osten. Kinder spielen auf dem Platz. |
| 10:00 | Vormittag | Der Schmied arbeitet. Ilsa wird unruhiger. |
| 11:00 | Vormittag | Der Müller bemerkt Schatten über dem Fluss. |
| 12:00 | Mittag | Der Schmied geht zum Brunnen. Der Drache trinkt tief über der Mühle. |
| 13:00 | Früher Nachmittag | Die Stadt wird nervös, ohne zu wissen warum. |
| 14:00 | Nachmittag | Der Bürgermeister hält Rat. Briefe und alte Verträge sind greifbar. |
| 15:00 | Nachmittag | Ilsa verschwindet oft Richtung Kirche, Friedhof oder Osttor. |
| 16:00 | Später Nachmittag | Tiere werden still. Wind kommt aus dem Osten. |
| 17:00 | Abend | Erste klare Zeichen der Drachenankunft. Panik ist möglich. |
| 17:30 | Dämmerung | Letzte Chance für Rede, Ritual, Falle oder Fluchtplan. |
| 18:00 | Sonnenuntergang | Der Drache kommt. Ashen brennt. Reset. |

---

## 06:00 — Morgengrauen

Die Charaktere erwachen an derselben Stelle wie in jeder Schleife. Beschreibe dieselben Sinneseindrücke jedes Mal ähnlich: kühle Luft, nasse Pflastersteine, Rauch aus Kaminen, Vögel, der Geruch von Brot.

Ein Kind rennt über den Platz und lässt einen Korb Äpfel fallen. Die Äpfel rollen über die Straße. Ilsa, die Blumenverkäuferin, lacht leise und hilft beim Aufheben.

### Ohne Eingreifen

- Das Kind sammelt die Äpfel ein.
- Ilsa schenkt ihm eine kleine Blume.
- Händler öffnen ihre Stände.
- Niemand wirkt bedroht.

### Mögliche Erkenntnisse

- Der Apfelkorb ist der erste zuverlässige Marker der Schleife.
- Ilsa wirkt wie normale Kulisse, ist aber von Anfang an präsent.
- Wer Ilsa beobachtet, bemerkt Müdigkeit und Traurigkeit unter ihrer Wärme.

### Wenn die Gruppe eingreift

- Fangen sie die Äpfel auf, erinnert sich das Kind natürlich nicht daran, aber reagiert dankbar.
- Sprechen sie Ilsa direkt an, ist sie freundlich, aber abgelenkt.
- Fragen sie nach Drachen, lacht sie zuerst unsicher und wird dann still.

---

## 07:00 — Früher Morgen

Das Dorf geht zur Arbeit. Bauern verlassen Ashen durch das Westtor. Ein Bote sortiert Briefe. Die Wachen scherzen am Osttor, obwohl eine von ihnen ständig zur Straße schaut.

### Ohne Eingreifen

- Die Tore werden geöffnet.
- Die Straße nach Osten bleibt leer.
- Der Bürgermeister ist noch nicht öffentlich sichtbar.

### Mögliche Erkenntnisse

- Das Osttor ist emotional wichtig: Viele Dorfbewohner meiden es ohne bewussten Grund.
- Alte Kratzspuren an Pfosten und Steinen können entdeckt werden.
- Wer nach Osten aufbricht, kann später den Drachenrücken finden.

---

## 08:00 — Morgen

Im Rathaus beginnen Schreiber mit der Arbeit. Der Bürgermeister Rovan diktiert Briefe und wirkt gereizt. In der Kirche bereitet Schwester Maela die Andacht vor.

### Ohne Eingreifen

- Rovan bleibt im Rathaus.
- Maela spricht über Pflicht, Schutz und Opferbereitschaft, ohne konkret zu werden.
- Ilsa bleibt am Marktstand.

### Mögliche Erkenntnisse

- Im Rathaus gibt es verschlossene Unterlagen über „die Vereinbarung“.
- In der Kirche existieren ältere Chroniken, in denen Seiten entfernt wurden.
- Maela weiß mehr, als sie öffentlich sagt, aber nicht alles.

---

## 09:00 — Morgen

Kinder spielen auf dem Platz. Händler reden über schlechtes Wetter, obwohl der Himmel klar ist. Ein alter Mann behauptet, er habe in der Nacht Flügel gehört.

### Ohne Eingreifen

- Niemand nimmt die Warnung ernst.
- Das Dorf bleibt friedlich.
- Ilsa beobachtet Kinder zu lange und schaut dann weg.

### Mögliche Erkenntnisse

- Wiederkehrende Formulierungen zeigen den Spielern, dass Gespräche exakt gleich ablaufen.
- Kinder kennen das Wort „Lehrzeit im Osten“, verstehen aber die Bedeutung nicht.

---

## 10:00 — Vormittag

Der Schmied arbeitet an Hufeisen und Pflugscharen. Er ist praktisch und ungeduldig, aber hilfsbereit, wenn die Gruppe konkrete Informationen liefert.

### Ohne Eingreifen

- Er arbeitet normal weiter.
- Er erwähnt, dass sein Großvater Geschichten über Drachenschuppen kannte.
- Er hat keine Zeit für vage Panik.

### Wenn die Gruppe ihn überzeugt

Mit Beweisen oder präzisem Wissen aus früheren Schleifen kann er:

- Speerspitzen mit Widerhaken fertigen.
- Pfeile für eine Schwachstelle vorbereiten.
- Ketten und Haken für eine Mühlenfalle herstellen.
- Wachen ausrüsten.

Er kann nicht alles in einer Schleife schaffen. Die Gruppe muss wissen, was sie braucht.

---

## 11:00 — Vormittag

An der Mühle wird der Fluss lauter. Der Müller sieht Schatten im Wasser und glaubt an Wolken, obwohl keine da sind.

### Mögliche Erkenntnisse

- Der Drache fliegt mittags tief über die Mühle, um zu trinken.
- Die Mühle ist ein möglicher Ort für einen Hinterhalt.
- Das Wasserrad, Ketten, Balken und Mehlstaub können als Umgebungsvorteile genutzt werden.

---

## 12:00 — Mittag

Der Schmied geht zum Brunnen. Gleichzeitig streift ein gewaltiger Schatten kurz über die Mühle. Nur wer dort ist oder bewusst den Himmel beobachtet, erkennt die Form.

### Ohne Eingreifen

- Niemand verbindet den Schatten mit Gefahr.
- Tiere werden kurz still.
- Der Drache verschwindet wieder nach Osten.

### Mögliche Erkenntnisse

- Der Drache ist vor Sonnenuntergang bereits in der Nähe.
- Er hat eine feste Flugroute.
- Ein finaler Kampf muss nicht bei Sonnenuntergang stattfinden; Mittag kann besser sein.

---

## 13:00 — Früher Nachmittag

Das Dorf wirkt angespannter. Kleine Streitigkeiten brechen aus. Leute vergessen Dinge. Ilsa schaut häufiger nach Osten oder zur Kirche.

### Mögliche Erkenntnisse

- Die Schleife beeinflusst Gefühle, nicht nur Ereignisse.
- Ilsa verändert ihr Verhalten manchmal, obwohl niemand mit ihr gesprochen hat.
- Das ist der erste starke Hinweis, dass sie mit der Schleife verbunden ist.

---

## 14:00 — Rat im Rathaus

Bürgermeister Rovan trifft sich mit wichtigen Dorfbewohnern. Das Treffen ist nicht öffentlich. Thema ist „Sicherheit“, tatsächlich geht es um die fällige Zahlung.

### Ohne Eingreifen

- Rovan beschwichtigt alle.
- Er sagt, die Tradition müsse respektiert werden.
- Niemand spricht offen von Opferung.

### Gefundene Hinweise

Im Büro oder in Briefen können die Spieler finden:

- Erwähnungen von „der Vereinbarung“.
- Hinweise auf „die Zahlung dieser Generation“.
- Ilsas Name.
- Die Aussage, dass der Drache nicht warten wird.

### Wenn die Gruppe konfrontiert

Rovan leugnet erst. Mit Beweisen gibt er zu, dass Ashen seit Generationen einen Pakt erfüllt. Er hält ihn für schrecklich, aber notwendig.

---

## 15:00 — Ilsas Bruchstellen

Ilsa ist nicht immer am selben Ort. Ohne Eingreifen kann sie in verschiedenen Schleifen an der Kirche, am Friedhof oder am Osttor stehen. Diese Abweichung ist Absicht.

### Bedeutung

Sie erinnert sich nicht bewusst an die Schleifen, aber ihr Schmerz tut es. Ihre Trauer sucht unbewusst immer wieder dieselben Orte auf.

### Wenn die Gruppe sie anspricht

Sie ist freundlich, dann defensiv. Bei sanftem Druck sagt sie:

- Ihre Tochter sei „in der Lehre“.
- Alle Kinder müssten irgendwann loslassen.
- Manche Traditionen seien grausam.

Mit starken Beweisen kann sie zusammenbrechen und andeuten, dass Lise versteckt ist.

---

## 16:00 — Später Nachmittag

Die Natur verändert sich. Vögel verstummen. Hunde jaulen. Der Wind riecht nach Asche und Regen auf heißem Stein.

### Ohne Eingreifen

- Die Dorfbewohner ignorieren die Zeichen oder erklären sie weg.
- Wachen werden nervös.
- Rovan versucht, Ordnung zu halten.

### Mögliche Nutzung

Dies ist eine gute Stunde für Vorbereitung:

- Dorfbewohner sammeln.
- Fallen aktivieren.
- Lise aus dem Versteck holen.
- Eine öffentliche Rede vorbereiten.
- Das Osttor sichern.

---

## 17:00 — Der Druck steigt

Jetzt wird die Bedrohung offensichtlich. Rauch am Horizont. Ein fernes Grollen. Schatten im Osten.

### Ohne Eingreifen

- Panik beginnt.
- Rovan versucht, die Menschen in Häuser zu schicken.
- Ilsa sucht entweder Lise oder bricht am Platz zusammen.

### Mögliche Szenen

- Die Gruppe hält eine Rede.
- Ilsa gesteht die Wahrheit.
- Das Dorf entscheidet, ob es Lise opfern oder sich weigern will.
- Der Drache kann bereits gerufen oder provoziert werden.

---

## 17:30 — Letzte Entscheidung

Dies ist die letzte ruhige Szene vor dem Reset. Alles sollte jetzt auf eine klare Richtung hinauslaufen.

### Diplomatischer Pfad

Ilsa, Lise und die Gruppe stehen vor dem Dorf. Die Wahrheit wird ausgesprochen. Das Dorf muss Verantwortung übernehmen.

### Kampfpfad

Die Falle steht. Der Schmied hat vorbereitet, was möglich war. Die Gruppe positioniert sich an Mühle, Tor oder Hügel.

### Verhandlungspfad

Die Gruppe geht dem Drachen entgegen oder ruft ihn bewusst, bereit mit Wissen über Vertrag, Schuld und Alternative.

---

## 18:00 — Sonnenuntergang

Der Drache kommt aus dem Osten. Sein Schatten fällt über Ashen. Wenn nichts Entscheidendes verändert wurde, zerstört er das Dorf. Feuer, Schreie, Einsturz, Tod — dann Dunkelheit.

Die Gruppe erwacht wieder um 06:00 Uhr.

### Wenn die Gruppe Fortschritt erzielt hat

Passe die Szene an:

- Hat das Dorf die Wahrheit akzeptiert, zögert der Drache.
- Ist Lise nicht allein, bricht die Logik des Paktes.
- Ist eine Falle vorbereitet, beginnt der Kampf unter besseren Bedingungen.
- Wird neu verhandelt, spricht der Drache statt sofort zu töten.

---

## Spielleitung: Wiederholung schnell halten

Ab der zweiten Schleife musst du nicht jede Stunde ausspielen. Frage die Spieler:

„Was macht ihr diesmal anders?“

Dann springe zu relevanten Zeitpunkten. Bekannte Ereignisse können in kurzen Wiederholungen erscheinen:

- „Der Apfelkorb fällt wieder.“
- „Der Schmied geht wie immer um zwölf zum Brunnen.“
- „Um zwei schließt sich die Tür des Rathauses.“
- „Um sechs verdunkelt der Drache den Himmel.“

Die Spannung entsteht nicht aus vollständiger Wiederholung, sondern aus gezielter Veränderung.`;

const content = `<!-- lang:de -->\n${german}\n\n<!-- lang:en -->\n${english}`;
await db.update(docs).set({ title: '01 - Zeitlinie / Timeline', content, updatedAt: new Date() }).where(eq(docs.id, id));
console.log('updated', id);
process.exit(0);
