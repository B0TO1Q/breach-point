# Breach Point

A browser tactical shooter built around close-quarters battle (CQB), breaching and the rules for the use of force. The campaign is ten levels based on real hostage rescues and sieges from 1973 to 2012.

Inspired by Lucas Botkin's Antarctica prototype: lo-fi pixel rendering, smart enemies and few of them.

## Play

Open `index.html` in a desktop browser. You need a keyboard and mouse.

There's no build step and nothing to install. Three.js (r128) loads from cdnjs.

## Campaign

Levels unlock in order. Each one has a two-sentence brief and 2–3 plans to choose from, and after the mission the report says what really happened.

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

## Your team

You lead a five-man team: you plus four AI operators.

- **Plans:** before each level, pick how the team goes in: one stack behind you, a second team at another door, simultaneous multi-door breaches, tunnels, overwatch or a perimeter. Each plan card shows who goes where.
- **Getting into position:** teams start with you and walk to their doors, crouched and quiet. Teams coming in through a tunnel or on ropes start in place. Operators make noise like you do, so a careless approach can be heard.
- **The go signal:** press **X** and every team breaches at the same moment, as soon as the last team is in position. If the team is spotted or shooting starts, the stacks go in on their own. Press **Z** to call everyone back to you.
- **How operators fight:** they stay quiet until the team is compromised, give commands before firing, shoot only armed threats, cuff people who surrender, and shotgun any locked door in their way. They won't fire with a teammate, you or a hostage in the line; they step sideways for an angle instead. They can be wounded.
- **Keeping hostages alive:** after an alarm, gunmen near the hostages start turning on them. A gunman who is stunned, under fire or already dead can't. Being seen doesn't stop him. Flashbangs, speed and teams hitting the hostage rooms at the same moment are how you get everyone out.
- **Crossfire:** every round travels a real line. Misses keep going and can hit a hostage, a teammate or you. Your own stray rounds are unjustified hits; your team's are scored as team stray hits.

## Features

- **Breaching:** pick, kick or shotgun-breach doors; deadbolts and reinforced doors behave differently.
- **Enemy AI:** patrols, investigations, hold positions, fake surrenders and hostage executions after an alarm. Gunmen carry real magazines and have to reload, and they duck and shoot worse under suppressing fire.
- **Flashbangs:** a few seconds of full stun for everyone in the room. Anyone close who was looking toward it stays half-blind for up to 30 seconds: he sees only a couple of metres, shoots badly, can't pick out hostages, and often gives up when you shout.
- **Bodies take up space:** nobody walks through anyone. Teammates on the move squeeze past each other.
- **Use of force:** every shot is judged justified or not; shouting commands gets some suspects to surrender.
- **Loadout:** choose a primary (rifle, SMG, shotgun or scoped rifle) and a sidearm before each level. Each level carries the weapons that unit used at the time, from the Kpist m/45 in 1973 to the HK416 in 2012. Red dots appear only from 2000.
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
| X | Send the teams (simultaneous breach) |
| Z | Regroup on me |
| T / N | Weapon light / night vision |
| Esc / P | Pause: resume, retry from checkpoint, restart, save and quit |

## Security

- **Pinned library:** Three.js loads with a Subresource Integrity hash. If the CDN ever serves a modified file, the browser refuses to run it and the page shows a load error instead.
- **Content Security Policy:** the page may only run its own inline game script (pinned by hash) and Three.js from cdnjs, and load Google Fonts. It can't make network requests, open frames or submit forms.
- **No data collected:** no cookies, analytics or network calls. Saved progress is stored only in your own browser (`localStorage`, key `breachpoint.save.v2`) and never leaves your device. Clearing site data or using "Reset progress" on the level screen erases it.

When you edit the inline `<script>` in `index.html`, run `npm run csp` (or `python3 tools/update-csp.py`) to update its `sha256-…` hash in the Content-Security-Policy meta tag. Otherwise the browser blocks the game.

## Tests

```
npm install
npm test
```

The tests run the game headless in Node (jsdom) and check:

- every map and plan is valid;
- a scripted player can finish all ten levels in order;
- every plan runs without errors;
- checkpoints save and restore the player, the hostages and the team.

## Roadmap

1. Multi-floor buildings with stairs (the embassy, the residence)
2. More squad orders: hold a room, follow a different leader, cover a hallway
3. Enemy grenades and barricades
4. A map and objective markers; touch controls
5. More levels and a contractor mode

Design doc: https://claude.ai/artifact/Daj7Z1uaVygSQjUw2p4R6d
