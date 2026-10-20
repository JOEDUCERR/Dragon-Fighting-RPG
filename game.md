# Dragon Repeller — Expanded Edition

A browser-based, turn-based fantasy RPG. A dragon has sealed the town's roads;
level up, forge a legend, unlock the lair, and slay it.

**How to run:** open `index.html` in any browser. No build step or server needed.

---

## How to Play
- Use the grid of buttons to navigate locations and take actions.
- In a fight: **Attack**, **Dodge**, **Use potion**, or **Run**.
- Defeating monsters grants **XP**, **gold**, and sometimes bonus loot 🧪💰.
- Level up to raise your max health and damage output.
- The dragon's lair is **locked** — find the 🔑 **Dragon Key** first.

## The Quest Chain
1. Grind the **Old Cave** (Slime → Goblin → Fanged Beast) for XP and gold.
2. Buy weapons (and potions!) at the **Store**; heal fully at the **Tavern**.
3. Enter the **Ancient Forest** when strong enough (Orc, Skeleton Knight).
4. The **Skeleton Knight** guards the 🔑 Dragon Key.
5. With the key, sneak past the forest to the dragon's lair and fight.

## Locations
| Place | What you do there |
|---|---|
| Town Square | Hub — travel to any location |
| Store | Buy health (10g), potions (15g), weapons; sell spare weapons (15g) |
| Tavern | Feast (30g, full heal), dice game (30g entry, 1-in-3 to win 100g), rumors |
| Old Cave | Slime, Goblin, Fanged Beast |
| Ancient Forest | Orc, **Skeleton Knight** (quest), Dragon's Lair (locked/entry) |

## Weapons
Ladder — each purchase arms the next tier; selling strips the top.

| Weapon | Power | Cost |
|---|---|---|
| Stick | 5 | starting gear |
| Dagger | 30 | 30g |
| Claw Hammer | 50 | 50g |
| Silver Sword | 100 | 100g |
| Flaming Sword | 150 | 180g |
| Dragon Slayer | 250 | 300g |

## Monsters
| Monster | Lv | HP | Atk | Gold | XP | Notes |
|---|---|---|---|---|---|---|
| Slime | 2 | 15 | 3 | 15 | 10 | cave |
| Goblin | 5 | 40 | 6 | 30 | 20 | cave |
| Fanged Beast | 8 | 70 | 9 | 50 | 30 | cave |
| Orc | 10 | 100 | 12 | 80 | 40 | forest |
| Skeleton Knight | 15 | 150 | 16 | 130 | 60 | drops 🔑 Dragon Key |
| Dragon | 20 | 300 | 22 | 200 | 200 | **boss** — breathes fire |

## Combat Mechanics
- **Your attack:** weapon power + up to 30% variance, scaled by your level
  (+5% damage per level above 1).
- **Miss:** 10% chance to miss entirely.
- **Critical hit:** 10% chance to double your damage 💥.
- **Dodge:** 50% chance to neutralize the enemy's *next* attack 🌀.
- **Monster attacks:** base attack ± 20% variance.
- **Dragon fire:** 25% of the dragon's counterattacks are a 🔥 fire breath
  (1.5× damage).
- **Potions:** heal 40 HP mid-battle; the monster kindly waits for you.

## Progression
- Every monster's XP carries a level-up threshold of `level × 20` XP.
- Each level: **max health +15** and a **full heal** on level-up.
- Loot: 20% chance of a dropped potion, 10% chance of a bonus gold bag.

## Economy
- Gold comes from kills, loot bags, and gambling at the tavern.
- Core costs: feast (30g), potions (15g), health (10g), weapon ladder above.
- The tavern dice is slightly better than break-even if you stop after wins.

## Persistence
- Progress auto-saves to `localStorage` (`dragonRpgSave`): level, XP, health,
  gold, weapon, potions, key, inventory.
- Dying clears the save; dying is meant to sting.

## Bug Fixes vs. Original Prototype
- Removed duplicated monster entries from the data table.
- Fixed `#monnsterStats` CSS selector typo (monster panel now styled).
- Fixed "Draon Repeller" title typo.
- Dead monsters can no longer be farmed for infinite gold/XP
  (battle state now properly ends on victory/death/escape).
- Win screen now actually credits the dragon's spoils.
- "Fight again" returns you to the *same* monster instead of 3 identical
  "Go to town square" buttons.

## Roadmap Ideas
- Armor and defense stat.
- Multiple endings / peaceful resolution.
- Elemental weapon types interacting with monster weaknesses.
- Sound effects and simple sprite art.
- Random encounters while traveling.
