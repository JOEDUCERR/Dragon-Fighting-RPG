// =============================
//  Dragon Repeller — Expanded
// =============================

// ---------- Player state ----------
let level = 1;
let xp = 0;
let health = 100;
let maxHealth = 100;
let gold = 50;
let currentWeapon = 0;
let potions = 0;
let hasKey = false;
let inventory = ["Stick"];

// ---------- Combat state ----------
let fighting;
let lastFightIndex;
let monsterHealth;
let monsterMaxHealth;
let dodging = false;
let lastHub = 0; // location index to return to after a battle
let levelUpMsg = null;

// ---------- DOM refs ----------
const buttons = [
    document.querySelector("#button1"),
    document.querySelector("#button2"),
    document.querySelector("#button3"),
    document.querySelector("#button4")
];
const text = document.querySelector("#text");
const levelText = document.querySelector("#levelText");
const xpText = document.querySelector("#xpText");
const xpNeededText = document.querySelector("#xpNeededText");
const healthText = document.querySelector("#healthText");
const maxHealthText = document.querySelector("#maxHealthText");
const healthBar = document.querySelector("#healthBar");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterLevelText = document.querySelector("#monsterLevel");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterHealthBar = document.querySelector("#monsterHealthBar");
const inventoryText = document.querySelector("#inventory");

// ---------- Weapons ----------
const weapons = [
    { name: "Stick",         power: 5,   cost: 0   },
    { name: "Dagger",        power: 30,  cost: 30  },
    { name: "Claw Hammer",   power: 50,  cost: 50  },
    { name: "Silver Sword",  power: 100, cost: 100 },
    { name: "Flaming Sword", power: 150, cost: 180 },
    { name: "Dragon Slayer", power: 250, cost: 300 }
];

// ---------- Monsters ----------
// index: 0..5 — Skeleton guards the key; Dragon must stay last
const monsters = [
    { name: "Slime",        level: 2,  health: 15,  attack: 3,   gold: 15,  xp: 10  },
    { name: "Goblin",       level: 5,  health: 40,  attack: 6,   gold: 30,  xp: 20  },
    { name: "Fanged Beast", level: 8,  health: 70,  attack: 9,   gold: 50,  xp: 30  },
    { name: "Orc",          level: 10, health: 100, attack: 12,  gold: 80,  xp: 40  },
    { name: "Skeleton",     level: 15, health: 150, attack: 16,  gold: 130, xp: 60  },
    { name: "Dragon",       level: 20, health: 300, attack: 22,  gold: 200, xp: 200 }
];
const DRAGON = 5;
const SKELETON = 4;

// ---------- Rumors ----------
const rumors = [
    "An old drunk whispers: \"The undead knight in the ancient forest still carries the key to the dragon's gate...\"",
    "A scarred hunter says: \"Dodge, circle, strike. The beasts here swing at your heels.\"",
    "The barkeep laughs: \"Ten gold for health, but a feast here mends you far better.\"",
    "A traveler mutters: \"The dragon breathes fire when you least expect it. Bring a true sword.\"",
    "A bard strums: \"Critical blows come to the lucky — every swing is a gamble.\"",
    "A merchant sighs: \"Monsters sometimes drop potions. The slime... well, alchemists swear by it.\"",
    "The barkeep says: \"Sold your only weapon? Never, NEVER do that.\""
];

// ---------- Locations ----------
const locations = [
    // 0 town square
    {
        name: "town square",
        btnText: ["🏪 Go to store", "🍺 Visit tavern", "🕳️ Go to cave", "🌲 Go to forest"],
        btnFns:  [goStore, goTavern, goCave, goForest],
        text: "You are in the town square. A sign points to the \"store\" and the \"tavern\". " +
              "Muddy paths lead down to the old cave and into the ancient forest."
    },
    // 1 store
    {
        name: "store",
        btnText: ["Buy 10 health (10 gold)", "Buy potion (15 gold)", "Buy weapon", "Exit"],
        btnFns:  [buyHealth, buyPotion, buyWeapon, goTown],
        text: "You enter the store. Beside the counter hangs every weapon you're brave enough to buy."
    },
    // 2 tavern
    {
        name: "tavern",
        btnText: ["🍲 Buy feast (30 gold)", "🎲 Play dice (30 gold)", "🪑 Listen to rumors", "Exit"],
        btnFns:  [buyFeast, goDice, hearRumors, goTown],
        text: "You enter the tavern. It's warm, loud, and smells of stew. Heroes gather here."
    },
    // 3 dice table
    {
        name: "dice table",
        btnText: ["🥃 Barrel 1", "🍔 Barrel 2", "🧀 Barrel 3", "Leave the table"],
        btnFns:  [pickBarrel, pickBarrel, pickBarrel, goTavern],
        text: "The barkeep grins: \"Thirty gold to play. Three barrels, sealed shut — " +
              "one is stuffed with 100 gold coins. Pick one: one, two, or three!\""
    },
    // 4 cave
    {
        name: "cave",
        btnText: ["Fight Slime", "Fight Goblin", "Fight Fanged Beast", "Exit"],
        btnFns:  [fightSlime, fightGoblin, fightBeast, goTown],
        text: "You enter the cave. Eyes glint in the dark. You hear scratching, slithering, and something big breathing."
    },
    // 5 forest
    {
        name: "ancient forest",
        btnText: ["Fight Orc", "Fight Skeleton Knight", "⛓️ Sneak to the Dragon's Lair", "Exit"],
        btnFns:  [fightOrc, fightSkeleton, goLair, goTown],
        text: "You enter the ancient forest. A cold wind blows. Rumor says a sealed lair lies deeper within."
    },
    // 6 fight
    {
        name: "fight",
        btnText: ["⚔️ Attack", "🌀 Dodge", "🧪 Use potion", "🏃 Run"],
        btnFns:  [attack, dodge, usePotion, run],
        text: "You are fighting a monster."
    },
    // 7 kill monster
    {
        name: "kill monster",
        btnText: ["⚔️ Fight again", "🏃 Head back", "", ""],
        btnFns:  [fightAgain, goBack, null, null],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    // 8 lose
    {
        name: "lose",
        btnText: ["🔄 REPLAY?", "🔄 REPLAY?", "🔄 REPLAY?", "🔄 REPLAY?"],
        btnFns:  [restart, restart, restart, restart],
        text: "You die. ☠️"
    },
    // 9 win
    {
        name: "win",
        btnText: ["🔄 REPLAY?", "🔄 REPLAY?", "🔄 REPLAY?", "🔄 REPLAY?"],
        btnFns:  [restart, restart, restart, restart],
        text: "You defeat the dragon!"
    }
];

// =============================
//  Core UI
// =============================
function update(location) {
    monsterStats.style.display = "none";
    for (let i = 0; i < 4; i++) {
        buttons[i].innerText = location.btnText[i];
        buttons[i].onclick = location.btnFns[i] || null;
        buttons[i].classList.toggle("disabled", !location.btnFns[i]);
    }
    text.innerHTML = location.text;
    saveGame();
}

function updateStats() {
    levelText.innerText = level;
    xpText.innerText = xp;
    xpNeededText.innerText = xpNeeded();
    healthText.innerText = health;
    maxHealthText.innerText = maxHealth;
    goldText.innerText = gold;
    healthBar.style.width = Math.max(0, (health / maxHealth) * 100) + "%";
    healthBar.classList.toggle("low", health / maxHealth < 0.3);
    inventoryText.innerHTML = "🎒 <strong>Weapon:</strong> " + weapons[currentWeapon].name +
        " (+" + weapons[currentWeapon].power + " power) | 🧪 Potions: " + potions + " (heal 40 HP)" +
        (hasKey ? " | 🔑 Dragon Key" : "");
    saveGame();
}

function setMonsterUi(monster) {
    monsterStats.style.display = "block";
    monsterNameText.innerText = monster.name;
    monsterLevelText.innerText = monster.level;
    monsterHealthText.innerText = monsterHealth;
    monsterHealthBar.style.width = Math.max(0, (monsterHealth / monsterMaxHealth) * 100) + "%";
}

// =============================
//  Navigation
// =============================
function goTown()   { update(locations[0]); }
function goStore()  { update(locations[1]); refreshStoreButtons(); }
function goTavern() { update(locations[2]); }
function goCave()   { update(locations[4]); lastHub = 4; }
function goForest() { update(locations[5]); lastHub = 5; }

function goDice() {
    if (gold < 30) {
        text.innerHTML = "The barkeep shakes his head: \"No coin, no roll.\" (You need 30 gold to play.)";
        return;
    }
    update(locations[3]);
}

function goBack() {
    if (lastHub === 4)      goCave();
    else if (lastHub === 5) goForest();
    else                    goTown();
}

function run() {
    text.innerHTML = "You flee. The " + monsters[fighting].name + " snarls but does not chase (lucky you).";
    fighting = undefined;
    dodging = false;
    monsterStats.style.display = "none";
    setTimeout(goBack, 800);
}

// =============================
//  Store
// =============================
function refreshStoreButtons() {
    if (currentWeapon < weapons.length - 1) {
        const next = weapons[currentWeapon + 1];
        buttons[2].innerText = "Buy weapon: " + next.name + " (" + next.cost + " gold)";
        buttons[2].onclick = buyWeapon;
    } else {
        buttons[2].innerText = "Sell weapon (15 gold)";
        buttons[2].onclick = sellWeapon;
    }
}

function buyHealth() {
    if (gold < 10) {
        text.innerHTML = "You don't have enough gold for health.";
        return;
    }
    if (health >= maxHealth) {
        text.innerHTML = "You are already in perfect health. Save your coin.";
        return;
    }
    gold -= 10;
    health = Math.min(maxHealth, health + 10);
    text.innerHTML = "You bought 10 health. <span class='heal'>+10 HP ❤️</span>";
    updateStats();
}

function buyPotion() {
    if (gold < 15) {
        text.innerHTML = "You don't have enough gold for a potion.";
        return;
    }
    gold -= 15;
    potions++;
    text.innerHTML = "You bought a health potion 🧪 (heals 40 HP in battle).";
    updateStats();
}

function buyWeapon() {
    if (currentWeapon >= weapons.length - 1) {
        refreshStoreButtons();
        return;
    }
    const next = weapons[currentWeapon + 1];
    if (gold < next.cost) {
        text.innerHTML = "You don't have enough gold for the " + next.name + ". (" + next.cost + " gold)";
        return;
    }
    gold -= next.cost;
    currentWeapon++;
    inventory.push(weapons[currentWeapon].name);
    text.innerHTML = "You now have the <strong>" + weapons[currentWeapon].name +
        "</strong> <span class='power'>(+" + weapons[currentWeapon].power + " power ⚔️)</span>." +
        "<br>In your inventory: " + inventory.join(", ");
    updateStats();
    refreshStoreButtons();
}

function sellWeapon() {
    if (inventory.length <= 1) {
        text.innerHTML = "You'd be fighting dragons with rocks... Don't sell your only weapon!";
        return;
    }
    if (currentWeapon < weapons.length - 1) {
        text.innerHTML = "You should BUY weapons, not sell them. (Head to the store.)";
        return;
    }
    gold += 15;
    const sold = inventory.pop();
    currentWeapon--;
    text.innerHTML = "You sold the " + sold + " for 15 gold. You equip the " + weapons[currentWeapon].name + ".";
    updateStats();
    refreshStoreButtons();
}

// =============================
//  Tavern
// =============================
function buyFeast() {
    if (gold < 30) {
        text.innerHTML = "The waiter frowns: no gold, no feast.";
        return;
    }
    if (health >= maxHealth) {
        text.innerHTML = "You're already at full health — you eat for joy alone. (No charge: you walk out before ordering.)";
        return;
    }
    gold -= 30;
    health = maxHealth;
    text.innerHTML = "You eat a glorious roast feast. <span class='heal'>❤️ Fully healed!</span>";
    updateStats();
}

function hearRumors() {
    text.innerHTML = rumors[Math.floor(Math.random() * rumors.length)];
}

function pickBarrel() {
    if (gold < 30) {
        text.innerHTML = "The barkeep: \"No coin, no roll.\"";
        return;
    }
    gold -= 30;
    const guess  = Number(this.innerText.match(/(\d+)/)[1]);
    const winner = Math.ceil(Math.random() * 3);
    if (guess === winner) {
        gold += 100;
        text.innerHTML = "You pry open barrel " + guess + "... it IS stuffed with coins! <span class='heal'>🎲 +100 gold!</span>";
    } else {
        text.innerHTML = "You pry open barrel " + guess + "... it's just pickled onions. <span class='dmg'>−30 gold</span>";
    }
    updateStats();
}

// =============================
//  Fighting
// =============================
function fightSlime()    { lastHub = 4; goFight(0); }
function fightGoblin()   { lastHub = 4; goFight(1); }
function fightBeast()    { lastHub = 4; goFight(2); }
function fightOrc()      { lastHub = 5; goFight(3); }
function fightSkeleton() { lastHub = 5; goFight(SKELETON); }
function fightDragon()   { lastHub = 5; goFight(DRAGON); }

function fightAgain() {
    if (typeof lastFightIndex === "number") goFight(lastFightIndex);
    else goTown();
}

function goFight(index) {
    fighting = index;
    lastFightIndex = index;
    update(locations[6]);
    dodging = false;
    monsterHealth = monsters[index].health;
    monsterMaxHealth = monsters[index].health;
    setMonsterUi(monsters[index]);
    text.innerHTML = "The <strong>" + monsters[index].name + "</strong> appears! (Lv " + monsters[index].level + ")" +
        (index === DRAGON ? " Flames drip from its jaws. <strong>This is your moment.</strong>" : "");
    saveGame();
}

function goLair() {
    if (!hasKey) {
        text.innerHTML = "The obsidian gate of the dragon's lair is sealed shut. A rusted keyhole glimmers. " +
            "Legend says a 🔑 <strong>Dragon Key</strong> is carried by the Skeleton Knight deep in the ancient forest.";
        return;
    }
    fightDragon();
}

function attack() {
    if (typeof fighting !== "number") {
        text.innerHTML = "The battle is already over.";
        return;
    }
    const monster = monsters[fighting];
    const weapon = weapons[currentWeapon];

    // ---- player's strike ----
    if (Math.random() < 0.10) {
        text.innerHTML = "You swing your " + weapon.name + " and <span class='miss'>miss!</span>";
    } else {
        let dmg = weapon.power + Math.floor(Math.random() * (weapon.power * 0.3)) + 1;
        dmg = Math.round(dmg * (1 + (level - 1) * 0.05)); // level scaling
        let critPrefix = "";
        if (Math.random() < 0.10) {
            dmg *= 2;
            critPrefix = "<span class='crit'>💥 CRITICAL! </span>";
        }
        monsterHealth -= dmg;
        text.innerHTML = critPrefix + "You hit the " + monster.name +
            " with your " + weapon.name + " for <span class='dmg'>" + dmg + "</span> damage.";
    }

    // ---- monster defeated? ----
    if (monsterHealth <= 0) {
        if (fighting === DRAGON) { winGame(); } else { defeatMonster(); }
        return;
    }

    // ---- monster counter-attack ----
    setMonsterUi(monster);

    if (dodging) {
        dodging = false;
        text.innerHTML += "<br>The " + monster.name + " strikes, but you <strong>dodge every blow!</strong> 🌀";
    } else {
        let hit = getMonsterAttackValue(monster);
        if (fighting === DRAGON && Math.random() < 0.25) {
            hit = Math.round(hit * 1.5);
            text.innerHTML += "<br><span class='crit'>🔥 The dragon breathes FIRE for " + hit + " damage!</span>";
        } else {
            text.innerHTML += "<br>The " + monster.name + " attacks you for <span class='dmg'>" + hit + "</span> damage.";
        }
        health -= hit;
    }

    updateStats();
    if (health <= 0) {
        lose();
    }
}

function getMonsterAttackValue(monster) {
    return Math.max(1, Math.round(monster.attack * (0.8 + Math.random() * 0.4)));
}

function dodge() {
    if (typeof fighting !== "number") {
        text.innerHTML = "The battle is already over.";
        return;
    }
    if (Math.random() < 0.5) {
        dodging = true;
        text.innerHTML = "You ready your reflexes — <strong>you will dodge the enemy's next attack!</strong> 🌀";
    } else {
        dodging = false;
        text.innerHTML = "You brace to dodge, but stumble over a rock. You'll take the next hit head-on.";
    }
}

function usePotion() {
    if (typeof fighting !== "number") {
        text.innerHTML = "The battle is already over.";
        return;
    }
    if (potions <= 0) {
        text.innerHTML = "You search your bag... no potions! (Buy some at the store 🧪)";
        return;
    }
    potions--;
    health = Math.min(maxHealth, health + 40);
    text.innerHTML = "You quaff a potion. <span class='heal'>+40 HP ❤️</span> The monster lets you drink — apparently even dragons have manners.";
    updateStats();
}

// =============================
//  Progression
// =============================
function xpNeeded() {
    return level * 20;
}

function gainXp(amount) {
    xp += amount;
    while (xp >= xpNeeded()) {
        xp -= xpNeeded();
        levelUp();
    }
}

function levelUp() {
    level++;
    maxHealth += 15;
    health = maxHealth;
    levelUpMsg = "⭐ LEVEL UP! You are now level " + level +
        ". Max health is now " + maxHealth + " and you feel fully restored!";
}

function defeatMonster() {
    const monster = monsters[fighting];
    gold += monster.gold;

    // XP (may trigger level-up)
    levelUpMsg = null;
    gainXp(monster.xp);

    // Loot
    let lootMsg = "";
    const roll = Math.random();
    if (roll < 0.20) {
        potions++;
        lootMsg = "<br>You found a 🧪 potion on the body!";
    } else if (roll < 0.30) {
        const bonus = Math.floor(Math.random() * 20) + 5;
        gold += bonus;
        lootMsg = "<br>You also found a small bag of loot worth <span class='heal'>" + bonus + " gold</span>!";
    }

    // Quest item: Skeleton Knight guards the Dragon Key
    if (fighting === SKELETON && !hasKey) {
        hasKey = true;
        lootMsg += "<br>🔑 <strong>The Skeleton Knight drops the Dragon Key!</strong> The dragon's lair is now accessible!";
    }

    update(locations[7]);
    text.innerHTML = "The " + monster.name + " screams \"Arg!\" as it dies. " +
        "You gain <span class='power'>" + monster.xp + " XP</span> and <span class='heal'>" +
        monster.gold + " gold 🪙</span>." +
        (levelUpMsg ? "<br><span class='crit'>" + levelUpMsg + "</span>" : "") +
        lootMsg +
        "<br><em>Progress: Lv " + level + " | " + xp + "/" + xpNeeded() + " XP | " + gold + " gold</em>";

    // Show the fallen monster at 0 HP for flavor
    monsterHealth = 0;
    setMonsterUi(monster);
    fighting = undefined;

    updateStats();
}

function lose() {
    fighting = undefined;
    update(locations[8]);
    text.innerHTML = "You die. ☠️<br>The town forgets your name... until another hero tries again.";
    try { localStorage.removeItem("dragonRpgSave"); } catch (e) {}
}

function winGame() {
    update(locations[9]);
    monsterStats.style.display = "none";
    const monster = monsters[DRAGON];
    monsterHealth = 0;
    // Award final spoils
    gold += monster.gold;
    xp += monster.xp;
    setMonsterUi(monster);
    fighting = undefined;
    text.innerHTML = "The dragon falls with a roar of dying fire. The valley is free! " +
        "Villagers pour from their homes shouting your name.<br>" +
        "🏆 It drops " + monster.gold + " gold, you bank " + monster.xp + " XP.<br><br>" +
        "<strong>👑 YOU WIN THE GAME!</strong><br>" +
        "Final stats — Level " + level + ", " + xp + " XP banked, " + gold +
        " gold, wielding the " + weapons[currentWeapon].name +
        " (+" + weapons[currentWeapon].power + " power ⚔️).";
    updateStats();
}

function restart() {
    level = 1;
    xp = 0;
    health = 100;
    maxHealth = 100;
    gold = 50;
    currentWeapon = 0;
    potions = 0;
    hasKey = false;
    inventory = ["Stick"];
    fighting = undefined;
    lastFightIndex = undefined;
    dodging = false;
    lastHub = 0;
    updateStats();
    goTown();
    text.innerHTML = "A new hero arrives... The dragon still casts its shadow over the town.<br><br>" +
        locations[0].text;
}

// =============================
//  Save / Load (localStorage)
// =============================
function saveGame() {
    try {
        localStorage.setItem("dragonRpgSave", JSON.stringify({
            level: level,
            xp: xp,
            health: health,
            maxHealth: maxHealth,
            gold: gold,
            currentWeapon: currentWeapon,
            potions: potions,
            hasKey: hasKey,
            inventory: inventory
        }));
    } catch (e) { /* storage unavailable — game continues */ }
}

function loadGame() {
    try {
        const raw = localStorage.getItem("dragonRpgSave");
        if (!raw) return false;
        const s = JSON.parse(raw);
        if (typeof s.level !== "number" || s.level < 1 || typeof s.health !== "number") return false;
        level = s.level;
        xp = s.xp;
        maxHealth = Math.max(100, s.maxHealth);
        health = Math.min(Math.max(1, s.health), maxHealth);
        gold = s.gold;
        currentWeapon = Math.min(Math.max(0, s.currentWeapon), weapons.length - 1);
        potions = s.potions;
        hasKey = !!s.hasKey;
        inventory = Array.isArray(s.inventory) && s.inventory.length ? s.inventory : ["Stick"];
        return true;
    } catch (e) {
        return false;
    }
}

// =============================
//  Boot
// =============================
const loaded = loadGame();
for (let i = 0; i < 4; i++) {
    buttons[i].onclick = locations[0].btnFns[i];
}
updateStats();
goTown();
if (loaded) {
    text.innerHTML = "Welcome back, hero! Your save was restored — the town still trembles under the dragon's shadow." +
        "<br><br>" + locations[0].text;
}
