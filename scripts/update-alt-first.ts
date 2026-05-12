import { db } from '../src/db';
import { docs } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const id = 'ede205be-c3f5-4b78-9bbc-600a193ac8d0';
const en = await db.select({content: docs.content}).from(docs).where(eq(docs.id, id));
const english = en[0]?.content || '';
const german = `# The Loop — DM-Übersicht

## Pitch

Die Gruppe erwacht im Dorf Ashen bei Sonnenaufgang. Vögel singen. Marktstände öffnen. Ein Kind lässt auf der Straße einen Korb Äpfel fallen. Bei Sonnenuntergang zerstört ein Drache das Dorf. Alle sterben. Dann erwachen sie wieder bei Sonnenaufgang. Dieselben Vögel. Dasselbe Kind. Dieselben Äpfel. Sie stecken in einer Zeitschleife fest und haben so viele Versuche, wie sie brauchen, um herauszufinden, wie sie Ashen retten können — oder ob Ashen überhaupt gerettet werden kann.

## Genre

Groundhog Day trifft D&D. Mysteriös, emotional, taktisch. Kein klassischer Krimi mit einem einzelnen Tatort; der ganze Tag ist das Rätsel.

## Länge

3–4 Stunden, normalerweise 5–7 Schleifen.

## Spieler

4 Spieler, Stufe 3–5.

## Grundprinzip

Die Spieler können nicht endgültig verlieren. Wenn sie sterben oder der Drache bei Sonnenuntergang kommt, beginnt der Tag neu. Die Charaktere behalten ihr Wissen, aber Hitpoints, Zauberplätze, Ausrüstung und verbrauchte Ressourcen werden zurückgesetzt. Genau dadurch werden sie mutiger: Sie probieren Dinge aus, gehen Risiken ein, scheitern spektakulär und lernen jedes Mal etwas Neues.

## Was die Spielleitung im Kopf behalten sollte

- Die Schleife ist kein Gimmick, sondern die Struktur des Abenteuers.
- Der Drache ist am Anfang nicht der Endboss, sondern der Timer.
- Jede Schleife sollte eine klare neue Erkenntnis bringen.
- Lass die Spieler bewusst experimentieren und auch absurde Pläne testen.
- Wiederhole bekannte Tagesereignisse schnell, damit es nicht langweilig wird.
- Verändere nur Dinge, die durch Aktionen der Gruppe verändert wurden.

## Der Standardtag

Jede Schleife beginnt um 06:00 Uhr morgens. Ohne Eingreifen passiert immer dasselbe: Das Dorf wacht auf, der Markt öffnet, das Kind lässt Äpfel fallen, der Schmied geht mittags zum Brunnen, der Bürgermeister hält am Nachmittag Rat, und bei Sonnenuntergang kommt der Drache aus dem Osten.

## Das Geheimnis

Ashen schloss vor 200 Jahren einen Pakt mit einem Drachen. Das Dorf gab seine erstgeborenen Kinder als Zahlung, der Drache beschützte Ashen dafür im Krieg. Der Krieg endete, aber der Vertrag blieb bestehen. Jede Generation wird ein Kind in den Osten geschickt und offiziell als „Lehrling“ verabschiedet.

Diesmal weigerte sich eine Mutter: Ilsa, die Blumenverkäuferin. Sie versteckte ihre Tochter Lise. Der Drache kam trotzdem. Ilsas Trauer, Schuld und verzweifelter Wunsch nach einem anderen Ausgang haben den Tag in eine Schleife verwandelt. Ilsa weiß nicht bewusst, dass sie die Ursache ist — aber ihr Schmerz erinnert sich.

## Zentrale NSCs

### Ilsa

Blumenverkäuferin auf dem Marktplatz. Warmherzig, erschöpft, abgelenkt. Sie hat ihre Tochter versteckt und glaubt, das Dorf würde Lise opfern, wenn es sie findet. Sie ist der emotionale Kern des Abenteuers.

### Lise

Ilsas Tochter. Versteckt im Keller der Kirche hinter einer falschen Wand. Sie zeichnet immer wieder Drachen. Sie glaubt, der Drache komme, weil sie sich versteckt.

### Bürgermeister Rovan

Kennt den Pakt teilweise und versucht, die alte Ordnung aufrechtzuerhalten. Er denkt, ein Opfer sei schrecklich, aber notwendig.

### Der Schmied

Praktisch, direkt, nützlich. Kann mit genügend Wissen und klaren Anweisungen Spezialwaffen oder Fallen vorbereiten.

### Der Drache

Nicht einfach böse. Er ist alt, intelligent und an einen magischen Vertrag gebunden. Er erwartet Zahlung, kann aber bekämpft, überlistet oder neu verhandelt werden.

## Typische Schleifen

### Schleife 1 — Verwirrung

Die Gruppe kennt die Gefahr nicht. Lass sie das Dorf erleben. Dann kommt bei Sonnenuntergang der Drache und zerstört alles. Das darf unfair sein. Es soll schockieren.

### Schleife 2 — Panik

Die Gruppe versucht vermutlich, alle zu warnen. Niemand glaubt ihnen ohne Beweise. Dadurch lernen sie: Wissen allein reicht nicht. Sie brauchen Vertrauen, Beweise und einen Plan.

### Schleife 3–4 — Experimente

Jetzt testen sie Möglichkeiten. Was passiert, wenn sie nach Osten gehen? Was steht im Büro des Bürgermeisters? Was macht Ilsa? Kann man das Dorf verlassen? Kann man den Drachen im Schlaf finden? Hier sammelt die Gruppe die entscheidenden Bausteine.

### Schleife 5–6 — Ausführung

Die Gruppe hat einen Plan. Sie überzeugt NSCs, nutzt Wissen aus früheren Schleifen, bereitet Fallen vor, findet Lise, konfrontiert Ilsa oder stellt den Drachen. Dies ist die Schleife, in der alles zusammenklickt.

## Mögliche Enden

### Diplomatisch

Die Gruppe findet Lise, bringt Ilsa dazu, die Wahrheit zu sagen, und zwingt das Dorf, sich gemeinsam seiner Schuld zu stellen. Der Drache kommt nicht oder akzeptiert, dass der Pakt gebrochen ist.

### Kampf

Die Gruppe nutzt Wissen aus mehreren Schleifen, bereitet das Dorf vor, kennt Schwachstellen und Flugmuster des Drachen und tötet ihn in einem verdienten finalen Kampf.

### Verhandlung

Die Gruppe erfährt die Wahrheit und handelt mit dem Drachen einen neuen Vertrag aus. Der alte Pakt endet, ohne dass Lise geopfert wird.

## Warum dieses One-Shot funktioniert

- Spieler dürfen scheitern, ohne dass die Kampagne endet.
- Jede Schleife fühlt sich wie Fortschritt an.
- Der Timer ist natürlich: Sonnenuntergang kommt immer.
- Die Gruppe kann sich aufteilen und mehrere Experimente pro Schleife durchführen.
- Das Ende fühlt sich verdient an, weil die Spieler Ashen mehrfach sterben gesehen haben.
- Kampf, Diplomatie und Verhandlung sind alle gültige Lösungen.

## Spielleitungs-Tipp

Halte Wiederholungen kurz. Wenn ein Ereignis schon bekannt ist, fasse es in einem Satz zusammen: „Der Apfelkorb fällt wieder, genau wie zuvor.“ Gib nur dann Details, wenn die Spieler eingreifen oder bewusst beobachten. So bleibt die Schleife schnell, spielbar und spannend.`;

const content = `<!-- lang:de -->\n${german}\n\n<!-- lang:en -->\n${english}`;
await db.update(docs).set({ title: '00 - SL-Übersicht / DM Overview', content, updatedAt: new Date() }).where(eq(docs.id, id));
console.log('updated', id);
process.exit(0);
