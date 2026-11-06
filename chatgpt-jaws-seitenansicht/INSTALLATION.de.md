# ChatGPT-JAWS-Seitenansicht v2.4.0 – Installation und Bedienung (Deutsch)

## Voraussetzungen

- Windows mit Google Chrome und JAWS.
- Zugang zur ChatGPT-Webseite `https://chatgpt.com/`.
- Keine Chrome-Web-Store-Registrierung, kein kostenpflichtiger Account und keine Windows-Administratorrechte für die Erweiterung.

## Download und Installation

1. Die GitHub-Seite `https://github.com/0ver0n/Tools-fuer-Barrierefreiheit` öffnen.
2. Über **Code** und **Download ZIP** das gesamte Repository herunterladen.
3. Die ZIP-Datei entpacken, damit ein normaler Ordner entsteht. Darin `chatgpt-jaws-seitenansicht` und darin wiederum `extension` öffnen. Dieser letzte Ordner enthält `manifest.json`.
4. In Chrome mit **Strg+L** zur Adresszeile wechseln, `chrome://extensions` eingeben und mit **Enter** bestätigen.
5. Den **Entwicklermodus** aktivieren.
6. **Entpackte Erweiterung laden** auswählen und **genau den Ordner `extension`** auswählen. Nicht das ZIP und nicht den übergeordneten Repository-Ordner auswählen.
7. Wenn eine ältere Version dieser Erweiterung (z. B. 2.3) installiert ist, diese deaktivieren oder entfernen. Zum Vergleich eine andere ChatGPT-Anpassung, etwa PageLive, zunächst deaktivieren, um Konflikte auszuschließen.
8. ChatGPT öffnen bzw. mit **Strg+R** neu laden.

## Navigation mit JAWS

- **Taste 1** in der JAWS-Schnellnavigation: zur nächsten ChatGPT-Antwort (Überschrift Ebene 1).
- **Taste 2**: zur nächsten eigenen Nachricht (Überschrift Ebene 2).
- **Taste E**: zum Eingabefeld (normales JAWS-Kommando).
- Die Erweiterung kann bereits während der Generierung einer Antwort einen vorläufigen H1-Navigationspunkt anbieten.

Die eigentlichen Nachrichten werden nicht gelöscht. Überschriften im Nachrichtentext werden im vereinfachten Modus nicht mehr als Überschriften angeboten, ihr Text bleibt aber lesbar.

## Bedienelemente

Auf der ChatGPT-Seite bietet die Erweiterung zusätzliche Bedienelemente zum Umschalten der Seitenleiste, zum Aktivieren/Deaktivieren der vereinfachten Ansicht und zum Kopieren einer technischen Diagnose. Das Erweiterungs-Popup enthält außerdem **Nachrichten neu erkennen**, **Seitenleiste umschalten** und **Vereinfachung ein- oder ausschalten**.

## Probleme beheben

1. Prüfen, ob die Erweiterung auf `chrome://extensions` eingeschaltet ist.
2. ChatGPT mit **Strg+R** neu laden.
3. Andere Erweiterungen, die ChatGPT verändern, testweise deaktivieren.
4. Auf der ChatGPT-Seite **Diagnose kopieren** auslösen. Den Bericht nur dann weitergeben, wenn du den Inhalt vorher geprüft hast.
5. Fehler oder Verbesserungsvorschläge über die GitHub-Issues des Projekts melden: `https://github.com/0ver0n/Tools-fuer-Barrierefreiheit/issues`.

## Aktualisieren

Da keine Chrome-Web-Store-Version angeboten wird, gibt es **keine automatische Aktualisierung**. Für eine neue Version die aktuellen Dateien von GitHub herunterladen und entpacken, anschließend die alte entpackte Version in Chrome durch die neue ersetzen. Danach ChatGPT neu laden.

## Datenschutz, Projekt und Lizenz

Die Erweiterung verarbeitet Elemente der geöffneten ChatGPT-Seite lokal. Sie übermittelt nach Prüfung des veröffentlichten Quellcodes keine eigenen Daten an einen Server. Nähere Angaben in `DATENSCHUTZ.de.md`. Ursprüngliches Projekt: **Marcel Lörz** (`0ver0n`). Webseite: **https://www.blindmitwomo.com**. Lizenz: Apache-2.0; siehe `LICENSE` und `NOTICE`.
