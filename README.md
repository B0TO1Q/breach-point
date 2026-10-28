# Breach Point

A browser tactical shooter built around close-quarters battle (CQB), breaching and the rules for the use of force. You run a small private security firm taking contracts in a fictional border region. A Military mode on the same maps is planned.

Inspired by Lucas Botkin's Antarctica prototype: lo-fi pixel rendering, smart enemies and few of them.

## Play

Open `index.html` in a desktop browser. You need a keyboard and mouse.

There's no build step and nothing to install. Three.js (r128) loads from cdnjs.

## Security

- **Pinned library:** Three.js loads with a Subresource Integrity hash. If the CDN ever serves a modified file, the browser refuses to run it and the page shows a load error instead.
- **Content Security Policy:** the page may only run its own inline game script (pinned by hash) and Three.js from cdnjs, and load Google Fonts. It can't make network requests, open frames or submit forms.
- **No data collected:** no cookies, storage, analytics or network calls. Everything runs in the browser.

When you edit the inline `<script>` in `index.html`, update its `sha256-…` hash in the Content-Security-Policy meta tag, or the browser will block the game.

## Milestone 1: farmhouse kidnap recovery

Contract KR-0417. Recover a survey engineer held at a farmhouse on the valley road and walk him back to the exfil flare.

- **Entry options:** a deadbolted front door (kick or pick), an unlocked side door that creaks, and a reinforced back room door (shotgun breach or a slow pick).
- **Enemy AI:** six hostiles. Quiet noises send them to investigate, gunfire sends them to hold positions, and they're stunned by breaches and flashbangs.
- **Verbal commands:** one suspect surrenders, one fakes it with a hidden pistol, and a civilian holds a phone that looks like a pistol at a glance.
- **After-action review:** a grade, every shot judged justified or not, the firm's account after ammo, medevac and incident penalties, and a timeline.

## Controls

| Key | Action |
| --- | --- |
| WASD | Move |
| Shift | Sprint |
| C | Crouch |
| Mouse | Look; left button fires, right button aims |
| Q / E | Lean |
| R | Reload (partial mags are kept) |
| 1 / 2 | Carbine / pistol |
| F | Open, close, hold to pick, restrain, cut free |
| B | Kick door |
| H | Shotgun breach |
| G | Flashbang |
| V | Shout commands |
| T / N | Weapon light / night vision |
| Esc | Pause |

## Roadmap

1. Breach room (this build)
2. Full two-floor building: stairs, barricading and fall-back AI
3. Wilderness approach: patrols, sniping response, day and night
4. Quartermaster terminal and loadout economy
5. Second map and AI squad orders
6. Polish: audio, mission grading, more maps

Design doc: https://claude.ai/artifact/Daj7Z1uaVygSQjUw2p4R6d
