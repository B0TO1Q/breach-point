# Breach Point

A browser tactical shooter built around close-quarters battle (CQB), breaching and the rules for the use of force. The campaign is ten levels based on real hostage rescues and sieges from 1973 to 2012.

Inspired by Lucas Botkin's Antarctica prototype: lo-fi pixel rendering, smart enemies and few of them.

## Play

Open `index.html` in a desktop browser. You need a keyboard and mouse.

There's no build step and nothing to install. Three.js (r128) loads from cdnjs.

## Campaign

Levels unlock in order. Each one has a two-sentence brief, and after the mission the report says what really happened.

| # | Year | Level | You are | Objective |
| --- | --- | --- | --- | --- |
| 1 | 1973 | Norrmalmstorg Bank, Stockholm | Swedish police | Secure the vault |
| 2 | 1975 | Balcombe Street, London | Metropolitan Police | Secure the flat |
| 3 | 1976 | Entebbe, Uganda | Israeli commandos | Secure the old terminal |
| 4 | 1977 | Lufthansa 181, Mogadishu | GSG 9 | Clear the aircraft cabin |
| 5 | 1980 | Iranian Embassy, London | SAS | Secure the embassy |
| 6 | 1982 | The Dozier Rescue, Padua | NOCS | Rescue the general |
| 7 | 1992 | Ruby Ridge, Idaho | US Marshals and FBI | Talk everyone out alive |
| 8 | 1997 | Japanese Residence, Lima | Peruvian special forces | Secure the residence |
| 9 | 2000 | Operation Barras, Sierra Leone | SAS and Paras | Rescue the soldiers |
| 10 | 2012 | Mountain Compound, Afghanistan | US Navy SEALs | Rescue the doctor |

The levels are simplified to one floor and a handful of people. Real people appear by name only in the briefs and the history notes. Operations where children died, and recent events that are still raw for the families, were left out.

**Objective types**

- **Secure:** arrest or neutralize every hostile. Hostages are seated among them. After an alarm, gunmen near the hostages start killing them, so speed matters.
- **Rescue:** find the tied hostages, cut them free and walk them to the green flare.
- **Talk out (Ruby Ridge):** stay outside and call the occupants out. Gunfire, breaching or walking in turns it violent, and any death fails the level.

## Features

- **Breaching:** pick, kick or shotgun-breach doors; deadbolts and reinforced doors behave differently.
- **Enemy AI:** patrols, investigations, hold positions, fake surrenders, and hostage executions after an alarm.
- **Use of force:** every shot is judged justified or not; shouting commands gets some suspects to surrender.
- **Loadout:** choose a primary (CQB carbine, compact SMG, combat shotgun or scoped marksman rifle) and a sidearm before each level.
- **Saved progress:** unlocked levels, best grade and time per level, and your loadout are kept between visits.
- **Checkpoints and retry:** saved at milestones and every 45 seconds when nobody is shooting at you. Pause with Esc or P to retry from a checkpoint, restart or save and quit.

## Controls

| Key | Action |
| --- | --- |
| WASD | Move |
| Shift | Sprint |
| C | Crouch |
| Mouse | Look; left button fires, right button aims |
| Q / E | Lean |
| R | Reload (partial mags are kept) |
| 1 / 2 | Primary / sidearm |
| F | Open, close, hold to pick, restrain, cut free |
| B | Kick door |
| H | Shotgun breach |
| G | Flashbang |
| V | Shout commands |
| T / N | Weapon light / night vision |
| Esc / P | Pause: resume, retry from checkpoint, restart, save and quit |

## Security

- **Pinned library:** Three.js loads with a Subresource Integrity hash. If the CDN ever serves a modified file, the browser refuses to run it and the page shows a load error instead.
- **Content Security Policy:** the page may only run its own inline game script (pinned by hash) and Three.js from cdnjs, and load Google Fonts. It can't make network requests, open frames or submit forms.
- **No data collected:** no cookies, analytics or network calls. Saved progress is stored only in your own browser (`localStorage`, key `breachpoint.save.v2`) and never leaves your device. Clearing site data or using "Reset progress" on the level screen erases it.

When you edit the inline `<script>` in `index.html`, update its `sha256-…` hash in the Content-Security-Policy meta tag, or the browser will block the game.

## Roadmap

1. Multi-floor buildings with stairs (the embassy, the residence)
2. Era-appropriate weapons per level
3. AI squad orders: stack, breach and clear together
4. More levels and a contractor mode

Design doc: https://claude.ai/artifact/Daj7Z1uaVygSQjUw2p4R6d
