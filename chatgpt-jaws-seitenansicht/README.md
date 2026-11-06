# ChatGPT-JAWS-Seitenansicht | ChatGPT JAWS Page View

**Version 2.4.0 · Kostenlose Chrome-Erweiterung / Free Chrome extension · Apache-2.0**

[Deutsch](#deutsch) | [English](#english)

## Deutsch

### Zweck

Diese Erweiterung erleichtert die Navigation in ChatGPT-Unterhaltungen mit dem Screenreader JAWS und Google Chrome. Sie macht die eigenen Nachrichten und die Antworten von ChatGPT über die Überschriftennavigation schneller erreichbar. Die Funktionen sind aus praktischen Anforderungen eines blinden JAWS-Nutzers entstanden.

### Funktionen

- ChatGPT-Antworten werden als navigierbare **H1-Überschriften** gekennzeichnet.
- Eigene Nachrichten erhalten navigierbare **H2-Überschriften**.
- Während eine Antwort entsteht, kann ein vorläufiger Navigationspunkt angezeigt werden; er wird bei Erscheinen der eigentlichen Antwort ersetzt.
- Störende Überschriften der ChatGPT-Weboberfläche und innerhalb der Nachrichtentexte werden für die Überschriftennavigation in der vereinfachten Ansicht unterdrückt, ohne den Nachrichtentext zu löschen.
- Die Seitenleiste lässt sich ein- und ausblenden; die vereinfachte Darstellung lässt sich deaktivieren.
- Eine technische Diagnose kann auf Wunsch kopiert werden.
- Die Erweiterung verschiebt den Tastaturfokus nicht absichtlich.

### Installation und Nutzung

**[Vollständige Installations- und Bedienungsanleitung auf Deutsch](INSTALLATION.de.md)**

Die Erweiterung wird **nicht über den Chrome Web Store** angeboten. Sie lässt sich kostenlos aus dem GitHub-Repository herunterladen und in Chrome als entpackte Erweiterung laden. Auf Wunsch in der Repo-Ansicht `Code` > `Download ZIP` wählen, ZIP entpacken und den Unterordner `chatgpt-jaws-seitenansicht/extension` in `chrome://extensions` über **Entpackte Erweiterung laden** auswählen. Bitte die ausführliche Anleitung beachten.

### Datenschutz und Kompatibilität

Der geprüfte Code liest für seine Arbeit die Struktur der geöffneten ChatGPT-Seite und verarbeitet diese lokal im Browser. Er enthält keine eigenen Netzwerkanfragen, Werbung oder Analysefunktionen; Ansichtseinstellungen werden nur lokal gespeichert. Details: [Datenschutzinformation (Deutsch)](DATENSCHUTZ.de.md).

Getestet in Chrome mit simulierten ChatGPT-Seiten sowie praktisch mit JAWS durch den Projektinitiator. Änderungen an der ChatGPT-Oberfläche können die Funktion beeinträchtigen. Keine offizielle Erweiterung von OpenAI oder Freedom Scientific/Vispero.

### Ursprung und Lizenz

**Ursprüngliches Projekt, Konzept und Praxistests: Marcel Lörz (GitHub: 0ver0n).** Webseite: **https://www.blindmitwomo.com**.

Die Software steht unter der [Apache License 2.0](LICENSE). Wer eine urheberrechtlich abgeleitete Version weiterverbreitet, muss die einschlägigen Herkunftshinweise aus [NOTICE](NOTICE) in einer von der Lizenz vorgesehenen Form beibehalten und geänderte Dateien entsprechend kennzeichnen. Eine Namensnennung jedes Bearbeiters ist nicht vorgeschrieben. Es besteht keine Pflicht, den Namen des ursprünglichen Projektinitiators in einer Benutzeroberfläche oder werblich hervorzuheben. Siehe Lizenztext.

---

## English

### Purpose

This extension makes ChatGPT conversations easier to navigate with the JAWS screen reader in Google Chrome. It exposes the user's messages and ChatGPT's replies through heading navigation. The project grew out of the practical requirements of a blind JAWS user.

### Features

- ChatGPT replies are exposed as navigable **H1 headings**.
- User messages are exposed as navigable **H2 headings**.
- A temporary navigation heading may appear while a reply is being generated; it is replaced by the final reply heading.
- In simplified mode, distracting headings from the ChatGPT interface and inside message bodies are removed from heading navigation without deleting the message text.
- The sidebar can be toggled, and simplified mode can be switched off.
- A technical diagnostic report can be copied on request.
- The extension does not deliberately move keyboard focus.

### Installation and use

**[Full installation and user guide in English](INSTALLATION.en.md)**

The extension is **not distributed through the Chrome Web Store**. It can be installed free of charge from this GitHub repository as an unpacked Chrome extension. From the repository, choose `Code` > `Download ZIP`, extract the archive, then select the `chatgpt-jaws-seitenansicht/extension` folder under **Load unpacked** on `chrome://extensions`. Please follow the full guide.

### Privacy and compatibility

The reviewed code inspects the structure of the open ChatGPT page and processes it locally in your browser. It contains no independent network calls, advertising, or analytics. Display preferences are stored locally. See [Privacy information (English)](PRIVACY.en.md).

Tested in Chromium with simulated ChatGPT pages, with practical JAWS testing by the project initiator. Changes to ChatGPT's interface may break compatibility. This is not an official extension from OpenAI or Freedom Scientific/Vispero.

### Origin and license

**Original project, concept and hands-on testing: Marcel Lörz (GitHub: 0ver0n).** Website: **https://www.blindmitwomo.com**.

Licensed under the [Apache License, Version 2.0](LICENSE). Redistributed copyright-derived versions must retain the applicable attribution notices from [NOTICE](NOTICE) in a form permitted by the license and clearly mark modified files. Contributors are not required to disclose their own names. The license does not require a prominent credit in the user interface or promotional material. See the license text for the exact requirements.
