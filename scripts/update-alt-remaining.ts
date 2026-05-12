import { db } from '../src/db';
import { docs } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const updates = [
{ id:'d918856b-a407-4171-9a6e-eaabfde0c01d', title:'04 - Der Drache / The Dragon', de:`# The Loop — Der Drache

> Der Drache ist Timer, Bedrohung und möglicher Verhandlungspartner — je nachdem, wie die Spieler ihn angehen.

## Überblick

Ein erwachsener Drache ist durch einen 200 Jahre alten magischen Vertrag an Ashen gebunden. Er ist nicht einfach „böse“. Er machte einen Handel und erwartet Bezahlung. Seit Generationen kommt er nach Ashen. Jedes Mal gibt das Dorf ein Kind. Diesmal wurde das Kind versteckt.

Für die Gruppe ist der Drache zunächst nicht als normaler Kampf gedacht. Er ist die Uhr, die bei Sonnenuntergang abläuft. Erst durch mehrere Schleifen wird er zu einem lösbaren Problem.

## Persönlichkeit

Der Drache ist ruhig, alt und absolut sicher. Er spricht wie jemand, der sich nicht beeilen muss. Er sieht Sterbliche nicht als gleichwertig, aber er ist intelligent genug, Wahrheit, Mut und gute Verträge zu respektieren.

Er tötet nicht aus Wut. Er vollstreckt eine Schuld.

## Was der Drache weiß

- Ashens Vorfahren baten ihn vor 200 Jahren um Schutz.
- Der Preis war die Zahlung eines erstgeborenen Kindes pro Generation.
- Das Dorf hat diese Zahlung lange geleistet.
- Diese Generation versucht, den Preis zu verweigern.
- Der Vertrag ist magisch und bindet auch ihn.

## Was der Drache nicht versteht

Er versteht Trauer, Kindheit und menschliche Schuld nur abstrakt. Für ihn ist ein Vertrag eine Ordnung. Wenn Menschen diese Ordnung grausam finden, fragt er: Warum haben eure Ahnen sie dann geschlossen?

## Wichtige Sätze

- „Ich komme nicht als Räuber. Ich komme als Gläubiger.“
- „Eure Vorfahren baten. Ich antwortete. Nun zahlt ihr.“
- „Wenn ein Vertrag euch beschämt, hättet ihr ihn nicht erben sollen.“
- „Nennt mir einen Preis mit Gewicht.“
- „Ein Dorf, das sein Kind versteckt, versteckt auch seine Schuld.“

## Tagesablauf des Drachen

### Morgen

Er ruht auf dem Drachenrücken in den östlichen Hügeln. Wer früh aufbricht, kann den Ort finden. Er schläft, ist aber nicht wehrlos.

### Mittag

Er fliegt tief über die alte Mühle, um am Fluss zu trinken. Das ist die beste Gelegenheit für einen vorbereiteten Hinterhalt.

### Sonnenuntergang

Er kommt offen nach Ashen. Wenn nichts geändert wurde, zerstört er das Dorf und die Schleife setzt zurück.

## Schwachstelle

Unter dem linken Kiefer befindet sich eine alte Wunde, an der Schuppen fehlen. Diese Schwachstelle kann durch Erkundung, das Tagebuch im Wachturm oder riskante Beobachtung entdeckt werden.

Ohne Wissen über diese Schwachstelle ist der Kampf fast aussichtslos. Mit Wissen, Vorbereitung und richtiger Position wird er hart, aber fair.

## Kampfverhalten

Der Drache kämpft intelligent:

- Er bleibt in Bewegung.
- Er nutzt Angst, Feuer und Höhe.
- Er greift Gruppen an, die sich zu eng sammeln.
- Er zerstört Deckung, wenn sie gefährlich wird.
- Er erkennt Fallen, wenn sie schlecht vorbereitet sind.

Aber er ist arrogant. Er erwartet nicht, dass Sterbliche seinen Tagesablauf kennen. Genau das ist die Stärke der Schleife.

## Verhandlung

Der Drache kann verhandeln, wenn die Gruppe beweist, dass sie die Wahrheit kennt. Eine gute Verhandlung braucht:

1. Kenntnis des alten Paktes.
2. Anerkennung, dass Ashen eine echte Schuld trägt.
3. Eine Alternative zur Opferung Lises.
4. Einen Preis, der für den Drachen Bedeutung hat.

Mögliche neue Preise:

- Das Dorf gibt Land, Schatz oder Dienst über Generationen.
- Der Bürgermeister und Rat übernehmen persönlich die Schuld.
- Ashen schwört einen neuen Schutzvertrag ohne Kinderopfer.
- Die Gruppe bietet eine gefährliche Quest als Ausgleich an.

## Diplomatische Niederlage

Wenn die Gruppe nur sagt „Das ist unfair“, reicht das nicht. Der Drache weiß das. Ihn interessiert nicht Fairness, sondern bindende Ordnung.

## Diplomatischer Erfolg

Wenn die Gruppe zeigt, dass das ganze Dorf die Wahrheit anerkennt und nicht länger ein einzelnes Kind zahlen lässt, kann der Vertrag brechen oder neu geschrieben werden.

## Spielleitung

Spiele den Drachen nicht wie ein tobendes Monster. Spiele ihn wie eine Naturkatastrophe mit juristischem Gedächtnis. Er ist furchtbar, weil er logisch ist.`},
{ id:'82bc499a-253f-4572-98b4-f3f538049644', title:'05 - Das Geheimnis / The Secret', de:`# The Loop — Das Geheimnis: Pakt, Fluch und Tochter

> Dies ist der emotionale Kern des One-Shots. Hier wird aus einer Zeitschleife eine Geschichte über Schuld, Wegsehen und Verantwortung.

## Der Pakt vor 200 Jahren

Ashen war einst ein kleines Dorf nahe einer Kriegszone. Zwei Armeen verwüsteten die Gegend. Ashen sollte nicht gezielt vernichtet werden, aber es wäre zwischen den Fronten ausgelöscht worden.

Die damaligen Dorfältesten baten einen Drachen um Schutz. Der Drache stimmte zu. Seine Macht hielt Armeen, Feuer und Hunger fern. Ashen überlebte.

Der Preis: In jeder Generation sollte Ashen sein erstgeborenes Kind an den Drachen geben.

## Wie aus Opferung „Lehre“ wurde

Am Anfang wussten alle, was geschah. Später wurde die Wahrheit unerträglich. Das Dorf änderte die Sprache. Kinder wurden nicht mehr geopfert, sondern „in den Osten in die Lehre geschickt“.

Familien trauerten heimlich. Namen verschwanden aus Chroniken. Wer fragte, galt als undankbar oder gefährlich.

Die Lüge wurde Tradition.

## Diese Generation

Diesmal sollte Lise, Ilsas Tochter, gegeben werden. Ilsa weigerte sich. Sie versteckte Lise in der Kirche. Der Bürgermeister wusste davon oder vermutete es, konnte sie aber nicht offen holen, ohne die Wahrheit preiszugeben.

Der Drache kam trotzdem.

## Der Fluch der Schleife

Die Zeitschleife ist kein Zauber des Drachen. Sie kommt von Ilsa.

Ilsa wollte den Tag zurück. Nicht bewusst mit einem Ritual, sondern aus verzweifelter Trauer, Schuld und Liebe. In Ashen liegen 200 Jahre unausgesprochener Schuld. Ilsas Weigerung riss diese Schuld auf. Der Tag bleibt stecken, weil niemand die Wahrheit ausspricht und niemand Verantwortung übernimmt.

## Warum Ilsa sich nicht erinnert

Ihr Verstand erinnert sich nicht klar. Aber ihr Schmerz erinnert sich. Deshalb verändert sie manchmal ihre Wege. Deshalb sagt sie Dinge, die sie nicht wissen dürfte. Deshalb wirkt sie, als hätte sie denselben Morgen zu oft erlebt.

## Hinweise für die Spieler

### Frühe Hinweise

- Ilsa ist beim Apfelkind zu freundlich und danach zu traurig.
- Ein Drache im Rathausmural wurde übermalt.
- Leute sprechen seltsam ausweichend über Kinder „im Osten“.

### Mittlere Hinweise

- Ilsa verändert als einzige ohne Eingriff ihr Verhalten.
- Im Rathaus liegen Briefe über „die Zahlung“.
- Der Friedhof hat Lücken in Familiengräbern.
- Schwester Maela kennt beschädigte Chroniken.

### Späte Hinweise

- Lise wird im Kirchenkeller gefunden.
- Lise zeichnet Drachen und glaubt, schuld zu sein.
- Ilsa sagt: „Ich habe dieses Gespräch schon geführt.“
- Der Drache nennt sich Gläubiger, nicht Jäger.

## Die Wahrheit offenlegen

Die Wahrheit sollte nicht in einem einzigen Informationsblock kommen. Sie soll sich anfühlen, als würden Spieler eine Dorflüge Schicht für Schicht abtragen.

Gute Reihenfolge:

1. Es gibt eine wiederkehrende Tagesstruktur.
2. Der Drache kommt wegen einer alten Vereinbarung.
3. Kinder wurden seit Generationen fortgeschickt.
4. Lise ist das aktuelle Kind.
5. Ilsa versteckte sie.
6. Ilsas Trauer hält den Tag fest.
7. Nur Verantwortung bricht die Schleife.

## Ilsas Konfrontation

Wenn die Spieler Ilsa mit Beweisen konfrontieren, lass sie nicht sofort alles erklären. Sie ist eine Mutter in Panik.

Erst leugnet sie. Dann bittet sie. Dann bricht sie.

Mögliche Szene:

> „Ihr wollt Wahrheit? Die Wahrheit ist, dass dieses Dorf Kinder frisst und es Tradition nennt. Die Wahrheit ist, dass ich meine Tochter nicht hergebe. Nicht für Ashen. Nicht für den Bürgermeister. Nicht für irgendeinen Drachen.“

## Lises Rolle

Lise darf nie zur Ressource werden. Sie ist keine Lösung, sondern der Grund, warum eine Lösung moralisch nötig ist.

Wenn Spieler vorschlagen, sie zu opfern, lass die Welt darauf reagieren: Ilsa zerbricht, Maela schweigt entsetzt, selbst der Drache sieht nur eine erfüllte Zahlung — aber die Schleife muss nicht zwingend heilen, denn das Dorf hat nichts gelernt.

## Wie der Fluch endet

Der Fluch endet, wenn die alte Schuld nicht länger versteckt wird. Das kann durch drei Wege geschehen:

- Das Dorf steht gemeinsam zur Wahrheit und verweigert das Kinderopfer.
- Der Drache stirbt, sodass der Pakt keine Macht mehr hat.
- Der Vertrag wird neu verhandelt und die Schuld anders bezahlt.

## Spielleitung

Das Geheimnis soll weh tun, aber nicht hoffnungslos sein. Ashen ist schuldig, aber rettbar. Ilsa ist nicht perfekt, aber verständlich. Der Drache ist grausam, aber nicht sinnlos. Die Spieler bringen Bewegung in eine Geschichte, die 200 Jahre stillstand.`},
{ id:'be93b0f1-9ad9-491e-a130-632dea8114a2', title:'06 - Kampfbegegnung / Combat Encounter', de:`# The Loop — Kampfbegegnung

> Der Drachenkampf ist optional. Das Abenteuer kann ohne Kampf gelöst werden. Wenn deine Gruppe kämpfen will, zeigt dieses Dokument, wie der Kampf über mehrere Schleifen fair und befriedigend wird.

## Prinzip: Die Schleife ist die Vorbereitung

Die Gruppe kann den Drachen in Schleife 1 nicht gewinnen. Sie kann kaum überleben. Das ist Absicht. Der Sinn der Zeitschleife ist, dass Wissen, Positionierung und Vorbereitung über Resets hinweg erhalten bleiben.

Die Charakterwerte setzen zurück. Das Wissen der Spieler nicht.

## Was die Gruppe lernen muss

Für einen fairen Kampf braucht die Gruppe mindestens einige dieser Informationen:

- Der Drache schläft morgens im Osten.
- Er fliegt mittags tief über die Mühle.
- Er hat eine Schwachstelle unter dem linken Kiefer.
- Der Schmied kann passende Waffen bauen.
- Die Mühle kann als Falle genutzt werden.
- Wachen und Dorfbewohner können vorbereitet werden.

Je mehr sie wissen, desto weniger fühlt sich der Kampf wie Selbstmord an.

## Kampf in Schleife 1

Wenn die Gruppe bei Sonnenuntergang kämpft, zeig die Übermacht:

- Feuer trennt die Gruppe.
- Gebäude stürzen ein.
- Der Drache bleibt außerhalb leichter Reichweite.
- Ein direkter Schlag wirkt kaum.

Töte sie ruhig, aber beschreibe lernbare Details: Flugrichtung, Atemwaffe, verwundbare Stelle, Reaktion auf Glocken, Verhalten bei Wasser.

## Kampfplatz: Die Mühle

Die Mühle ist der beste finale Kampfplatz.

### Vorteile

- Der Drache fliegt mittags tief.
- Das Wasserrad kann Ketten bewegen.
- Balken bieten erhöhte Positionen.
- Mehlstaub kann Sicht verdecken.
- Der Fluss kann Feuer begrenzen.

### Mögliche Fallen

- Ketten um Flügel oder Hals.
- Harpunen in die Schwachstelle.
- Einstürzende Balken.
- Brennender Mehlstaub als riskanter Burst.
- Schützen auf vorbereiteten Positionen.

## Rolle des Schmieds

Harker kann nicht zaubern, aber Vorbereitung real machen. Wenn die Gruppe präzise Anweisungen gibt, kann er herstellen:

- Drachenpfeile.
- Widerhaken-Speere.
- Kettenanker.
- Verstärkte Schilde.
- Metallspitzen für die Mühlenfalle.

Er braucht klare Pläne. „Mach etwas gegen Drachen“ reicht nicht. „Baue Pfeile für eine offene Stelle unter dem linken Kiefer“ funktioniert.

## Rolle der Dorfbewohner

Dorfbewohner sind keine Heldenarmee. Aber mit Beweisen können sie helfen:

- Wachen halten Straßen frei.
- Müller bedient die Falle.
- Priesterin schützt Verletzte.
- Schmied liefert Waffen.
- Bürgermeister oder Hauptmann koordiniert Evakuierung.

Wenn die Spieler das Dorf einbeziehen, belohne es.

## Den Drachen leiten

Der Drache ist gefährlich, aber nicht allwissend. Er weiß nicht, dass die Gruppe seinen Tag mehrfach erlebt hat.

### Taktiken

- Atemwaffe gegen Gruppen.
- Fliegen und Abstand halten.
- Einzelne gefährliche Ziele greifen.
- Fallen zerstören, sobald er sie erkennt.
- Drohen und verhandeln, wenn verwundet.

### Arroganz

Seine Schwäche ist Überheblichkeit. In den ersten Runden unterschätzt er vorbereitete Sterbliche.

## Kampfphasen

### Phase 1 — Hinterhalt

Die Gruppe löst Falle oder ersten Angriff aus. Wenn vorbereitet, landet ein Treffer in der Schwachstelle oder der Drache wird kurz gebunden.

### Phase 2 — Wut

Der Drache erkennt die Gefahr und kämpft ernsthaft. Feuer, Flügelschläge, Einsturz, Panik.

### Phase 3 — Entscheidung

Bei schwerer Verwundung kann der Drache fliehen, verhandeln oder alles riskieren. Die Gruppe entscheidet, ob sie tötet, stoppt oder einen Vertrag erzwingt.

## Schwierigkeit anpassen

Wenn die Gruppe wenig vorbereitet ist, ist der Kampf brutal. Wenn sie viel vorbereitet hat, gib ihnen echte Vorteile:

- Vorteil auf erste Angriffe.
- Reduzierte Atemgefahr durch Positionierung.
- Einmalige Falle mit starkem Effekt.
- Dorfbewohner als Hilfeaktion.
- Schwachstellentreffer mit zusätzlichem Schaden.

## Wichtig

Der Kampf soll sich verdient anfühlen. Nicht weil Zahlen perfekt balanciert sind, sondern weil die Spieler denken: „Wir kennen diesen Tag. Wir kennen dieses Monster. Jetzt sind wir bereit.“`},
{ id:'7c229b7b-080e-41bf-83a9-5c8c5f869676', title:'07 - Enden / Endings', de:`# The Loop — Enden

> Es gibt drei gültige Enden. Die Gruppe soll spüren, dass sie gewählt hat — nicht, dass du sie geschoben hast.

## Ende 1: Das Dorf steht zusammen (diplomatisch)

**Auslöser:** Ilsa sagt die Wahrheit öffentlich. Lise wird gefunden, aber nicht ausgeliefert. Das Dorf verweigert den Pakt gemeinsam.

### Was passiert

Ilsa tritt mit der Gruppe und Lise auf den Marktplatz. Die Wahrheit wird ausgesprochen: Ashen hat Generationen von Kindern geopfert und es „Lehre“ genannt.

Zuerst herrscht Schock. Dann Wut. Einige wollen Lise ausliefern. Andere brechen zusammen. Die Spieler müssen das Dorf durch diesen Moment führen.

Wenn genug Wahrheit und Mut zusammenkommen, verändert sich etwas. Die Schleife beginnt zu reißen. Der Drache kommt, aber er findet kein verstecktes Kind und kein schweigendes Dorf mehr. Er findet eine Gemeinschaft, die ihre Schuld anerkennt.

### Ergebnis

Der Vertrag verliert Macht oder muss neu verhandelt werden. Die Schleife endet. Der nächste Morgen ist neu.

### Ton

Bitter, hoffnungsvoll, menschlich.

---

## Ende 2: Der Drache stirbt (Kampf)

**Auslöser:** Die Gruppe sammelt genug Wissen, bereitet Falle/Waffen vor und stellt den Drachen erfolgreich.

### Was passiert

Der finale Kampf sollte zeigen, dass jede Schleife etwas gebracht hat. Die Gruppe kennt Flugroute, Schwachstelle, Timing und Terrain. Dorfbewohner helfen, weil sie überzeugt wurden.

Der Drache ist immer noch gefährlich. Aber diesmal ist Ashen nicht hilflos.

### Ergebnis

Wenn der Drache stirbt, bricht der Pakt praktisch. Die Schleife endet, weil die unmittelbare Gefahr verschwunden ist. Das Dorf muss trotzdem mit seiner Schuld leben.

### Ton

Triumphierend, erschöpft, nicht völlig sauber. Töten löst die Bedrohung, aber nicht automatisch die Geschichte.

---

## Ende 3: Neuer Vertrag (Verhandlung)

**Auslöser:** Die Gruppe kennt die Wahrheit und spricht mit dem Drachen, bevor alles brennt oder nachdem sie ihn ernsthaft unter Druck gesetzt hat.

### Was passiert

Der Drache hört zu, wenn die Gruppe mit Wissen und Gewicht kommt. Er will keinen moralischen Vortrag, sondern eine Alternative zum alten Preis.

Mögliche Angebote:

- Ashen zahlt über Generationen Schatz, Dienst oder Land.
- Die Verantwortlichen übernehmen persönlich Schuld.
- Die Gruppe erfüllt eine gefährliche Aufgabe für den Drachen.
- Der Schutzvertrag wird in eine gegenseitige Verpflichtung ohne Kinderopfer geändert.

### Ergebnis

Der Pakt wird neu geschrieben. Lise bleibt frei. Die Schleife endet, weil es wieder eine Zukunft gibt.

### Ton

Mythisch, angespannt, klug.

---

## Scheitern, das trotzdem weiterführt

Wenn die Gruppe einen Plan versucht und scheitert, ist das nicht das Ende. Die Schleife gibt eine neue Chance. Wichtig ist, dass jeder Fehlschlag Information liefert.

Beispiele:

- Eine Rede scheitert, aber ein Dorfbewohner zeigt Zweifel.
- Eine Falle bricht, aber der Drache zeigt seine Schwachstelle.
- Ilsa flieht, aber verrät unbewusst den Weg zur Kirche.
- Der Bürgermeister lügt, aber ein Schreiber reagiert nervös.

## Schlechtes Ende: Lise wird geopfert

Wenn die Gruppe Lise tatsächlich ausliefert, erfüllt der Drache den Vertrag. Das Dorf überlebt vielleicht. Aber die Schleife muss nicht friedlich enden.

Du kannst entscheiden:

- Die Schleife endet, aber der Morgen fühlt sich falsch an.
- Die Schleife geht weiter, weil Ashen nichts gelernt hat.
- Ilsas Trauer wird schlimmer und verändert die Schleife.

Dieses Ende sollte bewusst unangenehm sein. Es ist eine Wahl, aber keine heldenhafte.

## Letzte Szene

Wenn die Schleife gebrochen ist, gib den Spielern einen neuen Morgen:

Die Vögel singen anders. Der Apfelkorb fällt vielleicht nicht. Oder er fällt — aber diesmal fängt jemand ihn auf. Ilsa atmet aus. Lise sieht zum ersten Mal den Sonnenaufgang ohne Angst.

Der Unterschied muss klein, aber spürbar sein.

## Spielleitung

Beende nicht mit Erklärung. Beende mit Veränderung. Die Spieler sollen fühlen: Dieser Tag gehört nicht mehr dem Drachen, nicht mehr der Schuld, nicht mehr der Schleife. Er gehört wieder Ashen.`},
{ id:'370fbcd6-0968-422d-9ed1-4bbca1a69942', title:'08 - Lösungswege / Solution Routes', de:`# The Loop — Lösungswege

> Schritt-für-Schritt-Pfade, die zu den Enden führen können. Die Spieler werden ihnen nicht exakt folgen — Spieler tun das nie — aber diese Routen zeigen, welche Informationen und Szenen jedes Ende erreichbar machen.

## Route A: Diplomatisch — Das Dorf retten, ohne den Drachen zu töten

**Kernidee:** Lise finden, Ilsa konfrontieren, das Dorf mit der Wahrheit vereinen und den Pakt kollektiv verweigern.

### Schleife 1 — Sterben

Die Gruppe erlebt Ashen normal. Bei Sonnenuntergang kommt der Drache. Das Dorf brennt. Reset.

### Schleife 2 — Warnen reicht nicht

Die Gruppe versucht vermutlich, Leute zu warnen. Niemand glaubt ihnen. Sie lernen: Sie brauchen Beweise.

### Schleife 3 — Hinweise sammeln

Wichtige Ziele:

- Rathaus untersuchen.
- Ilsa beobachten.
- Mit Schwester Maela sprechen.
- Herausfinden, was „Lehre im Osten“ bedeutet.

### Schleife 4 — Lise finden

Durch Ilsa, Kirche oder Rathausbriefe findet die Gruppe Lise im Kirchenkeller. Jetzt verstehen sie, was wirklich auf dem Spiel steht.

### Schleife 5 — Wahrheit öffentlich machen

Die Gruppe bringt Ilsa, Lise, Maela und möglichst Sera oder Harker auf den Marktplatz. Sie präsentieren Beweise. Rovan wird konfrontiert.

### Finale

Das Dorf entscheidet sich gegen das Opfer. Der Drache kommt, aber die Logik des alten Paktes bricht, weil die Schuld nicht länger versteckt wird.

## Route B: Kampf — Den Drachen töten

**Kernidee:** Die Schleife nutzen, um Informationen, Waffen, Verbündete und Terrain vorzubereiten.

### Schleife 1 — Übermacht erleben

Der Drache tötet die Gruppe oder zerstört Ashen. Beschreibe lernbare Details.

### Schleife 2 — Muster erkennen

Die Gruppe merkt, dass der Drache aus dem Osten kommt und nicht erst bei Sonnenuntergang existiert.

### Schleife 3 — Erkundung

Wichtige Ziele:

- Zum Drachenrücken gehen.
- Wachturm finden.
- Mühle beobachten.
- Mit Schmied sprechen.

### Schleife 4 — Schwachstelle und Timing

Die Gruppe findet das Tagebuch oder beobachtet die alte Wunde. Sie lernt: Mittag an der Mühle ist besser als Sonnenuntergang im Dorf.

### Schleife 5 — Vorbereitung

- Schmied fertigt Spezialwaffen.
- Müller bereitet Mühlenfalle vor.
- Wachen sichern Straßen.
- Gruppe positioniert sich.

### Finale

Hinterhalt an der Mühle. Der Kampf ist hart, aber die Gruppe hat verdiente Vorteile.

## Route C: Verhandlung — Den Vertrag neu schreiben

**Kernidee:** Den Drachen nicht als Monster, sondern als Vertragspartner verstehen.

### Schleife 1–2 — Drache als Bedrohung

Zuerst wirkt er wie reiner Untergang.

### Schleife 3 — Vertrag entdecken

Rathaus, Kirche oder Rovan enthüllen die alte Vereinbarung.

### Schleife 4 — Ilsa und Lise verstehen

Die Gruppe erkennt, dass der aktuelle Konflikt nicht nur „Drache greift an“ ist, sondern „Zahlung wurde verweigert“.

### Schleife 5 — Angebot vorbereiten

Ein gutes Angebot braucht Gewicht. Beispiele:

- Das Dorf bekennt sich öffentlich und bietet neue Zahlung.
- Rovan und Rat übernehmen Schuld.
- Die Gruppe bietet Dienst oder Quest.
- Der alte Schutz wird in einen neuen Eid umgewandelt.

### Finale

Die Gruppe trifft den Drachen am Osttor, an der Mühle oder auf dem Drachenrücken. Sie spricht mit Beweisen, nicht nur mit Moral.

## Route D: Gemischt

Viele Gruppen mischen Wege. Das ist gut.

Beispiele:

- Sie bereiten einen Kampf vor, verhandeln aber, als der Drache verwundet ist.
- Sie wollen diplomatisch lösen, brauchen aber eine Falle, um Zeit zu gewinnen.
- Sie stellen Rovan öffentlich bloß und nutzen dann den Drachen als Zeugen der Schuld.

Belohne flexible Pläne.

## Informations-Checkliste

Die Gruppe muss nicht alles finden. Aber je mehr sie hat, desto klarer wird die Lösung.

- Der Tag wiederholt sich.
- Der Drache kommt immer bei Sonnenuntergang.
- Der Drache ist mittags über der Mühle.
- Ashen hat einen alten Pakt.
- Kinder wurden als „Lehrlinge“ fortgeschickt.
- Lise ist die aktuelle Zahlung.
- Ilsa versteckte Lise.
- Ilsas Trauer hält die Schleife fest.
- Der Drache hat eine Schwachstelle.
- Das Dorf kann gemeinsam Verantwortung übernehmen.

## Wenn die Spieler feststecken

Nutze wiederkehrende Details, nicht offensichtliche Hinweise:

- Ilsa ist diesmal nicht am Stand.
- Ein Schreiber lässt einen Brief fallen.
- Das Apfelkind erwähnt Lise.
- Maela bittet die Gruppe, in der Kirche zu bleiben.
- Der Drache sagt ein Wort, das wie Vertragsrecht klingt.

## Tempo am Tisch

Nach jeder Schleife frage:

1. Was habt ihr gelernt?
2. Was wollt ihr diesmal anders machen?
3. Welche Szene überspringen wir, weil ihr sie schon kennt?

So bleibt das Abenteuer schnell und spielbar.

## Zielgefühl

Am Ende sollen die Spieler nicht denken: „Wir haben den richtigen Hinweis gefunden.“

Sie sollen denken: „Wir kennen diesen Tag. Wir kennen diese Menschen. Wir wissen, was getan werden muss.“`}
];

for (const u of updates) {
  const [row]=await db.select({content:docs.content}).from(docs).where(eq(docs.id,u.id));
  const english=(row?.content||'').replace(/^<!--\s*lang:de\s*-->[\s\S]*?<!--\s*lang:en\s*-->/i,'').trim();
  await db.update(docs).set({title:u.title, content:`<!-- lang:de -->\n${u.de}\n\n<!-- lang:en -->\n${english}`, updatedAt:new Date()}).where(eq(docs.id,u.id));
  console.log('updated', u.title);
}
process.exit(0);
