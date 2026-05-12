import { db } from '../src/db';
import { docs } from '../src/db/schema';
import { eq } from 'drizzle-orm';
const id='821edc23-04f7-4b5f-93d8-eb4a6d75ea48';
const [row]=await db.select({content:docs.content}).from(docs).where(eq(docs.id,id));
const english=(row?.content||'').replace(/^<!--\s*lang:de\s*-->[\s\S]*?<!--\s*lang:en\s*-->/i,'').trim();
const german=`# The Loop — Orte

> Die stündlichen Abläufe stehen in **01 - Zeitlinie**. Dieses Dokument beschreibt, was an jedem Ort zu finden ist, was verborgen liegt und was sich durch Eingriffe der Gruppe verändert.

## Das Dorf Ashen

Ashen ist ein kleines Flussdorf mit ungefähr 200 Einwohnern. Eine Hauptstraße läuft von Westen nach Osten durch den Ort. In der Mitte liegt der Marktplatz. Nördlich fließt der Fluss hinter der alten Mühle. Im Osten steigen Hügel an, im Westen und Süden liegen Felder.

Ashen wirkt zu Beginn friedlich: Rauch aus Schornsteinen, Brotdunst, Marktgeräusche, Kinderlachen. Genau das macht die spätere Zerstörung stärker.

---

## Marktplatz

Der Platz ist das Herz des Dorfes und der Startpunkt vieler Schleifen. Hier fällt der Apfelkorb. Hier verkauft Ilsa Blumen. Hier können öffentliche Reden, Panik oder Geständnisse stattfinden.

### Sichtbares

- Obststände, Blumenstand, Brunnen, Anschlagbrett.
- Kinder spielen am Morgen.
- Händler wiederholen dieselben Gespräche in jeder Schleife.
- Der Brunnen ist Treffpunkt für Arbeiter und Schmied.

### Verborgenes

- Ilsa beobachtet Kinder zu lange und wird dabei traurig.
- Alte Steine am Brunnen tragen fast verwitterte Drachenmotive.
- Einige Dorfbewohner vermeiden das Thema „Lehre im Osten“.

### Nutzung im Finale

- Perfekter Ort für Ilsas Geständnis.
- Perfekter Ort, um das Dorf gegen den alten Pakt zu vereinen.
- Wenn Panik ausbricht, wird der Platz schnell gefährlich eng.

---

## Rathaus

Ein ordentliches Gebäude aus Holz und hellem Stein. Innen riecht es nach Wachs, Tinte und Staub. Der Bürgermeister arbeitet hier, und die Wahrheit über den Pakt ist am ehesten schriftlich zu finden.

### Sichtbares

- Empfangsraum mit Schreiberpult.
- Ratssaal mit Wandmalereien der Dorfgründung.
- Büro des Bürgermeisters.
- Verschlossene Truhe oder Aktenschrank.

### Hinweise

- Ein übermalter Drache im Gründungsmural.
- Briefe über „die Vereinbarung“ und „die Zahlung“.
- Listen früherer „Lehrlinge“, immer erstgeborene Kinder.
- Ilsas Name in aktuellen Notizen.

### Schwierigkeit

Die Gruppe kann hier sozial, heimlich oder gewaltsam vorgehen. Rovan ist nicht dumm, aber unter Druck. Beweise aus dem Rathaus sind stark genug, um Ilsa oder das Dorf zu konfrontieren.

---

## Kirche

Eine kleine Steinkirche mit kühlem Innenraum, Kerzen und alten Chroniken. Der Keller ist wichtiger als der Altar: Dort versteckt Ilsa ihre Tochter Lise hinter einer falschen Wand.

### Sichtbares

- Morgenandacht.
- Schwester Maela, die von Pflicht und Schutz spricht.
- Alte Bücher, teilweise beschädigt.
- Ein Keller mit Vorräten.

### Verborgenes

- Falsche Wand im Keller.
- Lises Versteck mit Decken, Wasser, Brot und Kinderzeichnungen.
- Zeichnungen eines Drachen, immer wieder neu gemalt.
- Chroniken, in denen Seiten entfernt wurden.

### Lise finden

Die Gruppe kann Lise finden durch:

- Ilsas Geständnis.
- Spuren im Keller.
- Beobachten, wohin Ilsa am Nachmittag geht.
- Hinweise in den Briefen des Bürgermeisters.

Lise sollte nicht wie ein Preis wirken, sondern wie ein verängstigtes Kind. Sie glaubt teilweise, dass alles ihre Schuld ist.

---

## Schmiede

Heiß, laut, praktisch. Der Schmied ist einer der nützlichsten Verbündeten, wenn die Gruppe konkrete Informationen hat.

### Sichtbares

- Werkzeuge, Amboss, Kohle, unfertige Arbeiten.
- Alte Waffen an der Wand.
- Der Schmied ist beschäftigt und hasst vage Warnungen.

### Was hier möglich ist

Mit genug Wissen kann die Gruppe vorbereiten lassen:

- Drachendorn-Pfeile.
- Widerhaken-Speere.
- Verstärkte Ketten.
- Metallhaken für die Mühlenfalle.
- Schilde oder Schutzplatten für Dorfbewohner.

### Begrenzung

Eine Schleife reicht nicht für alles. Die Spieler müssen priorisieren. Das macht Wissen wertvoll.

---

## Alte Mühle

Die Mühle liegt am Fluss nördlich des Dorfes. Mittags fliegt der Drache tief über diesen Ort, um zu trinken. Deshalb ist die Mühle der beste Kampfplatz, wenn die Gruppe das herausfindet.

### Sichtbares

- Wasserrad, Balken, Säcke, Mehlstaub.
- Ketten, Seile, Hebel.
- Müller, der Schatten im Wasser bemerkt.

### Taktische Möglichkeiten

- Kettenfalle am Wasserrad.
- Mehlstaub als Sichtschutz oder Explosionsgefahr.
- Speere von erhöhten Balken.
- Schusslinien auf den Hals des Drachen.

### Hinweis

Der Drache ist hier nicht automatisch besiegbar. Die Mühle gibt nur eine faire Chance, wenn die Gruppe Vorbereitung, Timing und Schwachstelle kennt.

---

## Osttor

Das Osttor führt zur Straße in die Hügel. Dorfbewohner meiden es emotional. Viele „Lehrlinge“ verließen Ashen durch dieses Tor.

### Sichtbares

- Wachen, die scherzen, aber nervös sind.
- Alte Kratzspuren.
- Blick auf Hügel und Wald.

### Hinweise

- Gespräche über Kinder, die „nach Osten“ geschickt wurden.
- Spuren großer Klauen an Steinen außerhalb des Tores.
- Ilsa kann hier am Nachmittag stehen und starren.

### Nutzung

- Zugang zum Drachenrücken.
- Ort für Verhandlung.
- Ort, an dem das Dorf sich dem Drachen entgegenstellt.

---

## Friedhof

Klein, windig, südlich der Kirche. Hier liegen viele Dorfbewohner, aber auffällig wenige der angeblichen Lehrlinge.

### Hinweise

- Familiengräber mit ausgelassenen Namen.
- Alte Grabsteine mit Drachenzeichen.
- Ilsa kann hier auftauchen und vor einem leeren Platz stehen.

### Bedeutung

Der Friedhof zeigt die Lüge des Dorfes: Die Kinder sind nicht weggezogen. Sie wurden aus der Erinnerung geordnet.

---

## Hügel im Osten / Drachenrücken

Wer früh genug nach Osten geht, findet den Ort, an dem der Drache ruht. Der Weg ist gefährlich, aber möglich.

### Sichtbares

- Verbrannte Felsen.
- Alte Klauenspuren.
- Knochenreste von Tieren.
- Warme Luft, obwohl es Morgen ist.

### Erkenntnisse

- Der Drache schläft bis zum späteren Tag.
- Er hat eine feste Route.
- Eine alte Wunde unter dem linken Kiefer ist sichtbar, wenn man nah genug kommt.

### Gefahr

Der Drache ist auch schlafend kein leichter Gegner. Unvorsichtige Gruppen sterben hier früh — und lernen trotzdem etwas für die nächste Schleife.

---

## Verlassener Wachturm

Auf einem nördlichen Hügel steht ein halb eingestürzter Turm. Ein Ranger starb hier vor zwanzig Jahren und hinterließ ein Tagebuch.

### Fundstücke

- Tagebuch mit Flugmustern.
- Beschreibung der Schwachstelle unter dem linken Kiefer.
- Hinweis, dass der Drache mittags tief über der Mühle trinkt.
- Alte Pfeile oder gebrochene Speere.

### Nutzen

Der Wachturm ist der wichtigste Ort für Gruppen, die den Kampfweg wählen. Ohne diese Informationen ist der Drachenkampf fast unmöglich.

---

## Spielleitung: Orte wiederverwenden

Jeder Ort sollte in mehreren Schleifen anders wirken. Am Anfang sind sie Kulisse. Später werden sie Werkzeuge. Am Ende sind sie emotional aufgeladen, weil die Gruppe weiß, wer dort sterben wird, wenn sie versagt.`;
await db.update(docs).set({title:'02 - Orte / Locations',content:`<!-- lang:de -->\n${german}\n\n<!-- lang:en -->\n${english}`,updatedAt:new Date()}).where(eq(docs.id,id));
console.log('updated',id);
process.exit(0);
