# ChatGPT JAWS Page View v2.4.0 – Installation and user guide (English)

## Requirements

- Windows, Google Chrome, and the JAWS screen reader.
- Access to `https://chatgpt.com/`.
- No Chrome Web Store developer account, paid account, or Windows administrator privileges are required for this extension.

## Download and installation

1. Open the GitHub repository at `https://github.com/0ver0n/Tools-fuer-Barrierefreiheit`.
2. Select **Code**, then **Download ZIP** to download the repository.
3. Extract the ZIP archive. Open `chatgpt-jaws-seitenansicht`, then the `extension` folder inside it. This final folder contains `manifest.json`.
4. In Chrome, press **Ctrl+L**, enter `chrome://extensions`, and press **Enter**.
5. Turn on **Developer mode**.
6. Select **Load unpacked** and choose **the `extension` folder itself**, not the ZIP archive and not the parent repository folder.
7. Disable or remove an older installation of this extension (such as version 2.3). Initially disable other extensions that change ChatGPT, such as PageLive, to rule out conflicts.
8. Open ChatGPT or refresh its tab with **Ctrl+R**.

## JAWS navigation

- **1** in JAWS quick navigation: move to the next ChatGPT reply (level 1 heading).
- **2**: move to the next user message (level 2 heading).
- **E**: move to the message input field (standard JAWS quick navigation command).
- While ChatGPT generates a reply, the extension may provide a temporary H1 heading that is replaced when the actual reply appears.

Message content is not deleted. In simplified mode, headings inside messages stop being exposed as headings, while their text remains available.

## Controls

The extension adds controls to the ChatGPT page for toggling the sidebar, enabling/disabling the simplified view, and copying a technical diagnostic report. The extension's popup also includes the buttons **Nachrichten neu erkennen** (rescan messages), **Seitenleiste umschalten** (toggle sidebar), and **Vereinfachung ein- oder ausschalten** (toggle simplified mode). The popup controls remain labeled in German in version 2.4.0.

## Troubleshooting

1. Check that the extension is enabled on `chrome://extensions`.
2. Refresh ChatGPT using **Ctrl+R**.
3. Temporarily disable other extensions that modify ChatGPT.
4. On the ChatGPT page, use **Diagnose kopieren** (copy diagnostics). Review the contents before sharing the report.
5. Report issues or suggest improvements via GitHub Issues: `https://github.com/0ver0n/Tools-fuer-Barrierefreiheit/issues`.

## Updates

Because the extension is not in the Chrome Web Store, **updates are not automatic**. Download the new version from GitHub and extract it, then replace the previous unpacked extension with the updated one in Chrome. Reload ChatGPT afterwards.

## Privacy, project and license

The extension processes elements of the open ChatGPT page locally. The reviewed published source code does not send its own data to a server. For details, see `PRIVACY.en.md`. Original project: **Marcel Lörz** (`0ver0n`). Website: **https://www.blindmitwomo.com**. Licensed under Apache-2.0; see `LICENSE` and `NOTICE`.
