// DDO Name Checker — app.js

const SERVERS = ['Shadowdale', 'Cormyr', 'Thrane', 'Moonsea'];
const RECENT_KEY = 'ddo-name-checker-recent';
const RECENT_MAX = 10;

let selectedServers = ['Shadowdale'];
let selectedStyle = 'fantasy';
let selectedLastStyle = 'fantasy';

// --- Name pools (fixed) ---

const NAME_POOLS = {
  fantasy: [
    ['Araveth', 'Ranger-born'], ['Theron', 'Battle-scarred'], ['Miravel', 'Shadow-touched'],
    ['Keldran', 'Iron-willed'], ['Seraphyn', 'Void-kissed'], ['Duskwyn', 'Twilight'],
    ['Orvath', 'Rune-marked'], ['Lyndreth', 'Storm-caller'], ['Vael', 'Pale fire'],
    ['Torindal', 'Oathkeeper'], ['Amarix', 'Forgotten'], ['Seladrae', 'Moonbound'],
    ['Cavreth', 'Dusk-sworn'], ['Ynavar', 'Far wanderer'], ['Drethis', 'Ashen path'],
    ['Sorvaine', 'Hollow crown'],
  ],
  dwarven: [
    ['Bolgrin', 'Stone-fist'], ['Thordak', 'Ironback'], ['Durnheld', 'Deep-axe'],
    ['Gunda', 'Forge-born'], ['Krumbar', 'Grudgebearer'], ['Valdrak', 'Mountainheart'],
    ['Bronka', 'Gold-vein'], ['Snorvik', 'Clanhammer'], ['Dagni', 'Ember-eye'],
    ['Rolfgar', 'Old stone'], ['Bryndis', 'Shield-maiden'], ['Ulvarn', 'Deep iron'],
    ['Heldrak', 'Tunnel-king'], ['Morkeld', 'Rune-axe'], ['Sigra', 'Fire-anvil'],
    ['Veldrak', 'Grudge-sworn'],
  ],
  duergar: [
    ['Grazzt', 'Underdark-born'], ['Thrak', 'Ashen-veined'], ['Dorzak', 'Bitter-heart'],
    ['Skrug', 'Stonegrey'], ['Varka', 'Shadowforged'], ['Grull', 'Deep-gnasher'],
    ['Thorzak', 'Grudge-keeper'], ['Drusk', 'Ashenhelm'], ['Kraza', 'Gloom-tempered'],
    ['Brak', 'Iron-spite'], ['Zulka', 'Cavern-bred'], ['Ghorza', 'Dusk-anvil'],
    ['Skruzz', 'Saltrock'], ['Vraka', 'Hollow-eye'], ['Driznak', 'Deepwatch'],
    ['Tharg', 'Stonewraith'],
  ],
  elven: [
    ['Aelindra', 'Starweave'], ['Sylvari', 'Dawnlight'], ['Caladrel', 'Windwhisper'],
    ['Elarith', 'Silver gaze'], ['Naevys', 'Moondrift'], ['Thalindë', 'Leaf-bound'],
    ['Aerindel', 'Sunspire'], ['Lireth', 'Dream-touch'], ['Valandil', 'Starfall'],
    ['Isilveth', 'Pale shore'], ['Celendil', 'Farseer'], ['Aravel', 'Ember dawn'],
    ['Sylavel', 'Twilight-blood'], ['Eredil', 'Moonveil'], ['Calithar', 'First light'],
    ['Miraeleth', 'Echo-song'],
  ],
  halfling: [
    ['Bimble', 'Lightfoot'], ['Corwin', 'Pipemaster'], ['Lidda', 'Quickstep'],
    ['Tomas', 'Barleycorn'], ['Merry', 'Hearthfire'], ['Belda', 'Thistledown'],
    ['Perrin', 'Copperkettle'], ['Rosalind', 'Meadow-run'], ['Finwick', 'Bramble'],
    ['Yonder', 'Luckpenny'], ['Sable', 'Foxfoot'], ['Jimble', 'Far-river'],
    ['Wren', 'Copperpenny'], ['Tibble', 'Burrow-born'], ['Nell', 'Pipesmoke'],
    ['Aldrick', 'Long-road'],
  ],
  gnome: [
    ['Bixby', 'Tinkerer'], ['Zook', 'Sparkcaster'], ['Namfoodle', 'Oddwright'],
    ['Alston', 'Glyphweaver'], ['Wrenn', 'Clockwarden'], ['Dimble', 'Fumble-fix'],
    ['Fibblestib', 'Rattle-brain'], ['Gimble', 'Lampwright'], ['Orryn', 'Gadgetsmith'],
    ['Waywocket', 'Far-tumbler'], ['Ellywick', 'Spell-tinker'], ['Sindri', 'Runewright'],
    ['Tavita', 'Mirthweaver'], ['Kellen', 'Prismwright'], ['Lilli', 'Inkstained'],
    ['Pock', 'Odd-step'],
  ],
  halforc: [
    ['Grax', 'Bone-crusher'], ['Morg', 'Warcaller'], ['Dasha', 'Ironblood'],
    ['Urzog', 'Scarred'], ['Brenna', 'Half-blood'], ['Karg', 'Stoneskin'],
    ['Yulga', 'Fell-handed'], ['Thokk', 'Ironjaw'], ['Durga', 'Storm-born'],
    ['Vrash', 'Sunderbone'], ['Nala', 'Ashwalker'], ['Gorka', 'Ravenbrow'],
    ['Tusk', 'Split-ear'], ['Bragh', 'Bloodcrown'], ['Olgra', 'Warlorn'],
    ['Krusk', 'Grudge-heart'],
  ],
  tiefling: [
    ['Mordecai', 'Hellbound'], ['Sevryn', 'Ember-born'], ['Vex', 'Shadowtail'],
    ['Zariel', 'Fallen light'], ['Nyx', 'Smokewraith'], ['Calix', 'Brimstone'],
    ['Lilith', 'Silvertongue'], ['Akmenos', 'Ashsoul'], ['Barakas', 'Hellmarked'],
    ['Damaia', 'Ember-eye'], ['Hadar', 'Darkpulse'], ['Kairon', 'Soulfire'],
    ['Morthos', 'Hex-born'], ['Riven', 'Ashblood'], ['Skamos', 'Voidwarden'],
    ['Therai', 'Brand-touched'],
  ],
  dragonborn: [
    ['Arjhan', 'Scale-sworn'], ['Balasar', 'Emberclaw'], ['Donaar', 'Thunderscale'],
    ['Ghesh', 'Ironwing'], ['Heskan', 'Ashbreath'], ['Kriv', 'Stormborn'],
    ['Medrash', 'Oathscale'], ['Mehen', 'Forgecrest'], ['Nadarr', 'Wildfire'],
    ['Pandjed', 'Goldscale'], ['Patrin', 'Skyborn'], ['Rhogar', 'Bladescale'],
    ['Shamash', 'Cinderclaw'], ['Shedinn', 'Voidwing'], ['Tarhun', 'Ironscale'],
    ['Torinn', 'Stormcrest'],
  ],
  warforged: [
    ['Onyx-7', 'Combat unit'], ['Frenkel', 'Sentinel'], ['Bastion', 'Shield-line'],
    ['Caliburn', 'Edge-sworn'], ['Ironveil', 'Watcher'], ['Null-4', 'Purpose-built'],
    ['Aurek', 'Stalwart'], ['Siege', 'Breaker'], ['Anvil', 'Forged-true'],
    ['Remnant', 'Survivor'], ['Crux', 'Resolver'], ['Veritas', 'Seeker'],
    ['Chassis', 'First-made'], ['Pyre-3', 'Incendiary'], ['Durakon', 'Unbreaking'],
    ['Nullval', 'Last unit'],
  ],
  eberron: [
    ['Khorvath', 'Dragonmarked'], ['Irulan', 'House-sworn'], ['Zendak', 'Wanderer'],
    ['Merrix', 'Artificer-kin'], ['Thessa', 'Lyrandar blood'], ['Vyndal', 'Deneith blade'],
    ['Raelith', 'Tharashk'], ['Kaeleth', 'Medani eye'], ['Davan', 'Kundarak vault'],
    ['Sorith', 'Cannith-made'], ['Phalan', 'Ghallanda inn'], ['Elix', 'Sivis-born'],
    ['Traveth', 'Storm-bound'], ['Nyrith', 'Shadow-marked'], ['Caldas', 'Coin-sworn'],
    ['Ryvek', 'Passage-born'],
  ],
};

// --- Last name pools (per race) ---

const LAST_NAME_POOLS = {
  fantasy: [
    ['Dawnmantle', 'Light-bearer'], ['Ashveil', 'Shadow-born'], ['Ironstride', 'Battle-road'],
    ['Voidwhisper', 'Forgotten tongue'], ['Stormcloak', 'Weather-worn'], ['Emberbane', 'Flame-quenched'],
    ['Nighthollow', 'Dark-dweller'], ['Swiftblade', 'Quick-steel'], ['Coldmantle', 'Frost-touched'],
    ['Ravenmark', 'Omen-born'], ['Silverveil', 'Moon-shrouded'], ['Duskhollow', 'Twilight vale'],
  ],
  dwarven: [
    ['Ironmantle', 'Forge-proud'], ['Stonebeard', 'Elder-kin'], ['Copperfist', 'Hard-handed'],
    ['Deepdelver', 'Tunnel-born'], ['Goldvein', 'Rich-lode'], ['Axebreaker', 'Battle-worn'],
    ['Hammerfall', 'Smith-line'], ['Flintrock', 'Hard as stone'], ['Grudgeborn', 'Long-memory'],
    ['Deepmantle', 'Under-cloak'], ['Runecarver', 'Mark-keeper'], ['Ironbelly', 'Stout-kin'],
  ],
  duergar: [
    ['Ashmantle', 'Soot-born'], ['Greystone', 'Underdark-grey'], ['Darkdelve', 'Depth-dweller'],
    ['Bitterfist', 'Grudge-handed'], ['Shadowvein', 'Grey-blooded'], ['Gloomhammer', 'Dark-smith'],
    ['Coldgranite', 'Stone-cold'], ['Dustmantle', 'Ash-cloak'], ['Voidstone', 'Hollow-rock'],
    ['Grimdelve', 'Bleak-digger'], ['Ironblight', 'Rust-touched'], ['Darkmantle', 'Shrouded-kin'],
  ],
  elven: [
    ['Dawnwhisper', 'First light'], ['Silverleaf', 'Moon-tree'], ['Starlace', 'Sky-woven'],
    ['Windveil', 'Air-shrouded'], ['Moonshadow', 'Night-touched'], ['Leafsong', 'Forest-voice'],
    ['Duskmantle', 'Twilight cloak'], ['Sunweave', 'Light-woven'], ['Mistthorn', 'Dawn-piercer'],
    ['Ithilmere', 'Moon-pool'], ['Aewenstar', 'Bird-sky'], ['Caladwen', 'Light-maid line'],
  ],
  halfling: [
    ['Goodbarrel', 'Cellar-proud'], ['Thistlewick', 'Meadow-kin'], ['Lightfoot', 'Quick-step'],
    ['Copperkettle', 'Hearth-warm'], ['Boulderbrook', 'Stream-side'], ['Meadowgrain', 'Field-born'],
    ['Underhill', 'Hollow-home'], ['Pipewhistle', 'Smoke-lover'], ['Riverstone', 'Water-smooth'],
    ['Brambletoe', 'Wandering kin'], ['Warmhearth', 'Fire-keeper'], ['Goldenbuckle', 'Well-dressed'],
  ],
  gnome: [
    ['Cogsworth', 'Gear-minded'], ['Sparkwhistle', 'Bright-sound'], ['Tinklebottom', 'Light-step'],
    ['Fumblefingers', 'Quick-handed'], ['Prismwick', 'Color-bright'], ['Runesprocket', 'Mark-gear'],
    ['Clockmantle', 'Time-cloak'], ['Oddwright', 'Strange-maker'], ['Glassweaver', 'Light-bender'],
    ['Whistlewick', 'Sound-keen'], ['Lampwright', 'Light-maker'], ['Inkfingers', 'Script-stained'],
  ],
  halforc: [
    ['Bonecrusher', 'Hard-handed'], ['Bloodmantle', 'War-cloak'], ['Ironscar', 'Battle-marked'],
    ['Gorefoot', 'Blood-track'], ['Skullbreaker', 'Hard-blow'], ['Ashbrand', 'Fire-marked'],
    ['Stonehide', 'Thick-skin'], ['Deathgrip', 'Iron-hand'], ['Rageborn', 'Fury-kin'],
    ['Darkblood', 'Mixed-vein'], ['Grimtusk', 'Hard-tooth'], ['Warcrown', 'Battle-won'],
  ],
  tiefling: [
    ['Emberveil', 'Flame-shrouded'], ['Ashmantle', 'Cinder-cloak'], ['Darkfire', 'Hellborn'],
    ['Shadowbrand', 'Mark-bearer'], ['Voidmantle', 'Empty-cloak'], ['Hellweave', 'Infernal-woven'],
    ['Cinderborn', 'Ember-kin'], ['Brimstone', 'Sulfur-blood'], ['Smokeveil', 'Mist-hidden'],
    ['Nightbrand', 'Dark-marked'], ['Ashveil', 'Soot-shrouded'], ['Emberthorn', 'Flame-piercer'],
  ],
  dragonborn: [
    ['Ironscale', 'Hard-hide'], ['Embercrest', 'Flame-crowned'], ['Stormwing', 'Thunder-flight'],
    ['Ashmantle', 'Cinder-cloak'], ['Goldscale', 'Bright-hide'], ['Bladescale', 'Edge-skin'],
    ['Cinderclaw', 'Ember-grip'], ['Voidwing', 'Dark-flight'], ['Oathscale', 'Sworn-hide'],
    ['Stormcrest', 'Thunder-crown'], ['Ironwing', 'Steel-flight'], ['Emberveil', 'Flame-shroud'],
  ],
  warforged: [
    ['Ironframe', 'Steel-body'], ['Voidcore', 'Empty-heart'], ['Steelmantle', 'Plate-cloak'],
    ['Nullframe', 'Blank-form'], ['Coreveil', 'Hidden-heart'], ['Ironwright', 'Steel-made'],
    ['Forgemark', 'Maker-signed'], ['Steelcore', 'Iron-heart'], ['Vaultframe', 'Sealed-form'],
    ['Ironveil', 'Steel-shroud'], ['Coldframe', 'Chill-form'], ['Nullmark', 'Blank-signed'],
  ],
  eberron: [
    ['d\'Cannith', 'House-made'], ['d\'Lyrandar', 'Storm-sailed'], ['d\'Deneith', 'Blade-sworn'],
    ['d\'Medani', 'Eye-sharp'], ['d\'Tharashk', 'Finder-kin'], ['d\'Kundarak', 'Vault-warden'],
    ['d\'Ghallanda', 'Hearth-sworn'], ['d\'Sivis', 'Word-keeper'], ['d\'Orien', 'Road-swift'],
    ['d\'Phiarlan', 'Shadow-dancer'], ['d\'Vadalis', 'Bond-keeper'], ['d\'Jorasco', 'Healer-kin'],
  ],
};

// --- Procedural syllable engine ---
// Each style has onset consonants, vowel nuclei, and coda consonants.
// Names are built as 2–3 syllables: (onset)(vowel)(coda?)(onset)(vowel)(coda?)...

const SYLLABLE_SETS = {
  fantasy: {
    onset:  ['Ar', 'Vel', 'Dusk', 'Tor', 'Mir', 'Keld', 'Ser', 'Or', 'Lyn', 'Sel', 'Cav', 'Yn'],
    vowel:  ['a', 'e', 'i', 'o', 'ae', 'ey', 'ath'],
    coda:   ['n', 'th', 'r', 'l', 'x', 'dra', 'ven', 'wyn', 'vel', ''],
    hints:  ['Wanderer', 'Forgotten', 'Shadow-touched', 'Storm-caller', 'Void-kissed', 'Oathbound', 'Dusk-sworn', 'Pale fire'],
  },
  dwarven: {
    onset:  ['Bol', 'Thor', 'Dur', 'Gu', 'Krum', 'Vald', 'Bron', 'Snor', 'Dag', 'Rolf', 'Mork', 'Hel'],
    vowel:  ['a', 'u', 'o', 'un', 'ak'],
    coda:   ['grin', 'dak', 'nheld', 'nda', 'bar', 'rak', 'ka', 'vik', 'ni', 'gar', 'keld', 'drak'],
    hints:  ['Stone-fist', 'Forge-born', 'Deep-axe', 'Grudgebearer', 'Ironback', 'Clanhammer', 'Gold-vein', 'Rune-axe'],
  },
  duergar: {
    onset:  ['Gr', 'Thr', 'Dor', 'Skr', 'Vark', 'Grul', 'Brk', 'Drusk', 'Kr', 'Zulk', 'Ghor', 'Vrk'],
    vowel:  ['a', 'u', 'az', 'uzz', 'ok'],
    coda:   ['zzt', 'ak', 'zak', 'ug', 'a', 'll', 'zak', 'k', 'za', 'ka', 'za', 'arg'],
    hints:  ['Underdark-born', 'Ashen-veined', 'Bitter-heart', 'Stonegrey', 'Shadowforged', 'Deep-gnasher', 'Gloom-tempered', 'Cavern-bred'],
  },
  elven: {
    onset:  ['Ae', 'Syl', 'Cal', 'El', 'Nae', 'Thal', 'Aer', 'Li', 'Val', 'Isi', 'Cel', 'Mir'],
    vowel:  ['i', 'a', 'e', 'ae', 'in', 'el'],
    coda:   ['ndra', 'vari', 'adrel', 'arith', 'vys', 'indë', 'ndel', 'reth', 'andil', 'lveth', 'ndil', 'ravel'],
    hints:  ['Starweave', 'Dawnlight', 'Windwhisper', 'Silver gaze', 'Moondrift', 'Leaf-bound', 'Sunspire', 'Farseer'],
  },
  halfling: {
    onset:  ['Bim', 'Cor', 'Lid', 'Tom', 'Mer', 'Bel', 'Per', 'Ros', 'Fin', 'Yon', 'Jim', 'Wren'],
    vowel:  ['a', 'i', 'o', 'e', 'y'],
    coda:   ['ble', 'win', 'da', 'as', 'ry', 'da', 'rin', 'alind', 'wick', 'der', 'ble', ''],
    hints:  ['Lightfoot', 'Hearthfire', 'Quickstep', 'Bramble', 'Luckpenny', 'Meadow-run', 'Burrow-born', 'Pipesmoke'],
  },
  gnome: {
    onset:  ['Bix', 'Zook', 'Nam', 'Al', 'Wren', 'Dim', 'Fib', 'Gim', 'Or', 'Way', 'El', 'Sin'],
    vowel:  ['o', 'i', 'a', 'oo', 'y'],
    coda:   ['by', 'n', 'foodle', 'ston', 'n', 'ble', 'blestib', 'ble', 'ryn', 'wocket', 'lywick', 'dri'],
    hints:  ['Tinkerer', 'Sparkcaster', 'Glyphweaver', 'Clockwarden', 'Gadgetsmith', 'Spell-tinker', 'Runewright', 'Mirthweaver'],
  },
  halforc: {
    onset:  ['Gr', 'Mor', 'Da', 'Urz', 'Bren', 'Kar', 'Yul', 'Thok', 'Dur', 'Vr', 'Nal', 'Gor'],
    vowel:  ['a', 'u', 'o', 'og'],
    coda:   ['ax', 'g', 'sha', 'og', 'na', 'g', 'ga', 'k', 'ga', 'ash', 'a', 'ka'],
    hints:  ['Bone-crusher', 'Warcaller', 'Ironblood', 'Scarred', 'Half-blood', 'Stoneskin', 'Ashwalker', 'Bloodcrown'],
  },
  tiefling: {
    onset:  ['Mor', 'Sev', 'Vex', 'Zar', 'Nyx', 'Cal', 'Lil', 'Akm', 'Bar', 'Dam', 'Had', 'Kai'],
    vowel:  ['e', 'i', 'a', 'o', 'iel'],
    coda:   ['decai', 'ryn', '', 'iel', '', 'ix', 'ith', 'enos', 'akas', 'aia', 'ar', 'ron'],
    hints:  ['Hellbound', 'Ember-born', 'Shadowtail', 'Brimstone', 'Smokewraith', 'Silvertongue', 'Ashsoul', 'Hellmarked'],
  },
  dragonborn: {
    onset:  ['Ar', 'Bal', 'Don', 'Ghe', 'Hes', 'Kriv', 'Med', 'Meh', 'Nad', 'Pan', 'Pat', 'Rho'],
    vowel:  ['a', 'e', 'i', 'o', 'aa'],
    coda:   ['jhan', 'asar', 'aar', 'sh', 'kan', '', 'rash', 'en', 'arr', 'djed', 'rin', 'gar'],
    hints:  ['Scale-sworn', 'Emberclaw', 'Thunderscale', 'Stormborn', 'Oathscale', 'Ashbreath', 'Bladescale', 'Stormcrest'],
  },
  warforged: {
    onset:  ['Bas', 'Cal', 'Iron', 'Null', 'Au', 'Sie', 'An', 'Rem', 'Cru', 'Ver', 'Cha', 'Pyre'],
    vowel:  ['i', 'a', 'e', 'o'],
    coda:   ['tion', 'iburn', 'veil', '-4', 'rek', 'ge', 'vil', 'nant', 'x', 'itas', 'ssis', '-3'],
    hints:  ['Combat unit', 'Sentinel', 'Shield-line', 'Purpose-built', 'Stalwart', 'Forged-true', 'Survivor', 'Seeker'],
  },
  eberron: {
    onset:  ['Khor', 'Ir', 'Zen', 'Mer', 'Thes', 'Vyn', 'Rae', 'Kae', 'Dav', 'Sor', 'Pha', 'El'],
    vowel:  ['a', 'u', 'e', 'i', 'ae'],
    coda:   ['vath', 'ulan', 'dak', 'rix', 'sa', 'dal', 'lith', 'leth', 'an', 'ith', 'lan', 'ix'],
    hints:  ['Dragonmarked', 'House-sworn', 'Wanderer', 'Artificer-kin', 'Storm-bound', 'Deneith blade', 'Coin-sworn', 'Passage-born'],
  },
};

// Build one procedural name from a syllable set
function buildProceduralName(set) {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const syllableCount = Math.random() < 0.4 ? 2 : 3;

  let name = '';
  for (let i = 0; i < syllableCount; i++) {
    name += pick(set.onset);
    name += pick(set.vowel);
    // Coda on all syllables except sometimes the last, to keep names readable
    if (i < syllableCount - 1 || Math.random() < 0.5) {
      name += pick(set.coda);
    }
  }

  // Capitalise first letter, lowercase the rest
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  // Re-capitalise after hyphens (for warforged style numbers like Pyre-3)
  name = name.replace(/-([a-z0-9])/g, (_, c) => '-' + c.toUpperCase());

  return [name, pick(set.hints)];
}

// Generate 8 unique procedural names for the given style
function buildProceduralNames(style) {
  const set = SYLLABLE_SETS[style];
  const results = [];
  const seen = new Set();
  let attempts = 0;

  while (results.length < 8 && attempts < 200) {
    attempts++;
    const [name, hint] = buildProceduralName(set);
    if (!seen.has(name) && name.length >= 4 && name.length <= 14) {
      seen.add(name);
      results.push([name, hint]);
    }
  }

  return results;
}

// --- Utility ---

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
    for (let j = 1; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
  }
  return dp[m][n];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- localStorage: recently checked ---

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable, silently skip
  }
}

function addToRecent(entry) {
  let list = loadRecent();
  list = list.filter(e => e.name.toLowerCase() !== entry.name.toLowerCase());
  list.unshift(entry);
  if (list.length > RECENT_MAX) list = list.slice(0, RECENT_MAX);
  saveRecent(list);
  renderRecent();
}

function renderRecent() {
  const list = loadRecent();
  const panel = document.getElementById('recent-panel');
  const ul = document.getElementById('recent-list');

  if (!list.length) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;
  ul.innerHTML = list.map(entry => {
    const statusClass = entry.status === 'taken' ? 'taken' : entry.status === 'risky' ? 'risky' : 'safe';
    const statusLabel = entry.status === 'taken' ? '✕' : entry.status === 'risky' ? '⚠' : '✓';
    return `
      <li class="recent-item">
        <button class="recent-name" data-name="${escapeHtml(entry.name)}">${escapeHtml(entry.name)}</button>
        <span class="recent-meta">${escapeHtml(entry.server)}</span>
        <span class="recent-status ${statusClass}">${statusLabel}</span>
        <button class="recent-copy" data-copy="${escapeHtml(entry.name)}" title="Copy name">⎘</button>
      </li>`;
  }).join('');

  ul.querySelectorAll('.recent-name').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('name-input').value = btn.dataset.name;
      checkName();
      document.getElementById('name-input').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  ul.querySelectorAll('.recent-copy').forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
  });
}

// --- Clipboard ---

function copyToClipboard(text, triggerEl) {
  navigator.clipboard.writeText(text).then(() => {
    const original = triggerEl.textContent;
    triggerEl.textContent = '✓';
    triggerEl.classList.add('copied');
    setTimeout(() => {
      triggerEl.textContent = original;
      triggerEl.classList.remove('copied');
    }, 1500);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// --- DDO Audit fetch ---

async function fetchCharacter(server, name) {
  const url = `/.netlify/functions/ddo-lookup?server=${encodeURIComponent(server)}&name=${encodeURIComponent(name)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function buildCharInfo(data) {
  if (!data) return null;
  const parts = [];
  if (data.race) parts.push(data.race);
  if (Array.isArray(data.classes) && data.classes.length) {
    const classes = data.classes.map(c => `${c.name} ${c.level}`).join(' / ');
    parts.push(classes);
  } else if (data.total_level) {
    parts.push(`Level ${data.total_level}`);
  }
  if (data.guild_name) parts.push(`Guild: ${data.guild_name}`);
  return parts.length ? parts.join(' · ') : null;
}

// --- Main check ---

async function checkName() {
  const input = document.getElementById('name-input');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }

  const btn = document.getElementById('check-btn');
  const area = document.getElementById('result-area');

  btn.classList.add('loading');
  btn.disabled = true;
  area.innerHTML = `<p class="loading-msg">Consulting the registry&hellip;</p>`;

  const servers = selectedServers.length ? selectedServers : SERVERS;
  const results = [];

  for (const server of servers) {
    try {
      const data = await fetchCharacter(server, name);
      results.push({ server, data, error: false });
    } catch {
      results.push({ server, data: null, error: true });
    }
  }

  btn.classList.remove('loading');
  btn.disabled = false;

  renderResult(name, results);
}

function renderResult(name, results) {
  const area = document.getElementById('result-area');
  const nameLower = name.toLowerCase();

  const exactHits = results.filter(r => !r.error && r.data && r.data.name?.toLowerCase() === nameLower);
  const closeHits = results.filter(r => {
    if (r.error || !r.data?.name) return false;
    const dist = levenshtein(r.data.name.toLowerCase(), nameLower);
    return dist > 0 && dist <= 2;
  });
  const errorCount = results.filter(r => r.error).length;
  const checkedCount = results.length;

  let html = '';

  if (exactHits.length > 0) {
    const serverPills = exactHits.map(r => `<span class="server-hit">${r.server}</span>`).join('');
    const charInfos = exactHits.map(r => {
      const info = buildCharInfo(r.data);
      return info ? `<p class="char-info">${escapeHtml(r.server)}: ${escapeHtml(info)}</p>` : '';
    }).join('');

    html = `
      <div class="result-card taken" role="alert">
        <div class="result-verdict-row">
          <p class="result-verdict">✕ Likely Taken</p>
          <button class="copy-btn" data-copy="${escapeHtml(name)}">⎘ Copy</button>
        </div>
        <p class="result-detail">An exact match for <strong>${escapeHtml(name)}</strong> was found.</p>
        <div class="server-hits">${serverPills}</div>
        ${charInfos}
        ${errorCount > 0 ? `<p class="result-note">⚠ ${errorCount} server(s) could not be reached — results may be incomplete.</p>` : ''}
      </div>`;

    addToRecent({ name, server: exactHits.map(r => r.server).join(', '), status: 'taken' });

  } else if (closeHits.length > 0) {
    const pills = closeHits.map(r => `<span class="match-pill">${escapeHtml(r.data.name)}</span>`).join('');

    html = `
      <div class="result-card risky" role="alert">
        <div class="result-verdict-row">
          <p class="result-verdict">⚠ Risky — Close Matches Found</p>
          <button class="copy-btn" data-copy="${escapeHtml(name)}">⎘ Copy</button>
        </div>
        <p class="result-detail">No exact match, but similar names exist and may cause confusion or be rejected.</p>
        <div class="match-pills">${pills}</div>
        ${errorCount > 0 ? `<p class="result-note">⚠ ${errorCount} server(s) could not be reached.</p>` : ''}
      </div>`;

    addToRecent({ name, server: selectedServers.join(', '), status: 'risky' });

  } else if (errorCount === checkedCount) {
    html = `
      <div class="result-card risky" role="alert">
        <p class="result-verdict">⚠ Could Not Reach DDO Audit</p>
        <p class="result-detail">All server lookups failed. DDO Audit may be down, or the Netlify function is unavailable. Try again in a moment.</p>
      </div>`;

  } else {
    html = `
      <div class="result-card safe" role="alert">
        <div class="result-verdict-row">
          <p class="result-verdict">✓ Likely Safe</p>
          <button class="copy-btn" data-copy="${escapeHtml(name)}">⎘ Copy</button>
        </div>
        <p class="result-detail">No match found for <strong>${escapeHtml(name)}</strong> on ${checkedCount - errorCount} server(s) checked.</p>
        ${errorCount > 0 ? `<p class="result-note">⚠ ${errorCount} server(s) could not be reached — verify in-game to be sure.</p>` : ''}
      </div>`;

    addToRecent({ name, server: selectedServers.join(', '), status: 'safe' });
  }

  area.innerHTML = html;

  area.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
  });
}

// --- Name generator ---

function generateNames() {
  let picks;

  if (selectedStyle === 'procedural') {
    // Procedural mode: pick a random underlying style and generate from its syllables
    const proceduralStyles = Object.keys(SYLLABLE_SETS);
    const randomStyle = proceduralStyles[Math.floor(Math.random() * proceduralStyles.length)];
    picks = buildProceduralNames(randomStyle);
  } else if (NAME_POOLS[selectedStyle]) {
    // Fixed pool: shuffle and slice
    picks = shuffle([...NAME_POOLS[selectedStyle]]).slice(0, 8);
  } else {
    // Fallback: procedural from matching syllable set
    picks = buildProceduralNames(selectedStyle);
  }

  const grid = document.getElementById('name-grid');

  grid.innerHTML = picks.map(([name, hint]) => `
    <div class="name-tile">
      <button class="tile-check" data-name="${escapeHtml(name)}">
        <span class="tile-name">${escapeHtml(name)}</span>
        <span class="tile-hint">${escapeHtml(hint)}</span>
      </button>
      <button class="tile-copy" data-copy="${escapeHtml(name)}" title="Copy name">⎘</button>
    </div>
  `).join('');

  grid.querySelectorAll('.tile-check').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('name-input').value = btn.dataset.name;
      checkName();
      document.getElementById('name-input').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  grid.querySelectorAll('.tile-copy').forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
  });
}

// --- Server button logic ---

document.querySelectorAll('.server-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const server = btn.dataset.server;

    if (server === 'all') {
      selectedServers = [...SERVERS];
      document.querySelectorAll('.server-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      return;
    }

    document.querySelectorAll('.server-btn[data-server="all"]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });

    btn.classList.toggle('active');
    const pressed = btn.classList.contains('active');
    btn.setAttribute('aria-pressed', String(pressed));

    selectedServers = [...document.querySelectorAll('.server-btn.active:not([data-server="all"])')].map(b => b.dataset.server);

    if (!selectedServers.length) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      selectedServers = [server];
    }
  });
});

// --- Style button logic ---

document.querySelectorAll('.style-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.style-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    selectedStyle = btn.dataset.style;
    generateNames();
  });
});

// --- Last name style button logic ---

document.querySelectorAll('.lastname-style-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lastname-style-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    selectedLastStyle = btn.dataset.style;
    generateLastNames();
  });
});

// --- Clear recent ---

document.getElementById('clear-recent-btn').addEventListener('click', () => {
  saveRecent([]);
  renderRecent();
});

// --- Last name generator ---

function generateLastNames() {
  // Fall back to fantasy pool if the selected style has no last name pool
  const pool = LAST_NAME_POOLS[selectedLastStyle] || LAST_NAME_POOLS.fantasy;
  const picks = shuffle([...pool]).slice(0, 8);
  const grid = document.getElementById('lastname-grid');

  grid.innerHTML = picks.map(([name, hint]) => `
    <div class="name-tile">
      <button class="tile-check" data-name="${escapeHtml(name)}">
        <span class="tile-name">${escapeHtml(name)}</span>
        <span class="tile-hint">${escapeHtml(hint)}</span>
      </button>
      <button class="tile-copy" data-copy="${escapeHtml(name)}" title="Copy surname">⎘</button>
    </div>
  `).join('');

  grid.querySelectorAll('.tile-check').forEach((btn, i) => {
    btn.addEventListener('click', () => copyToClipboard(picks[i][0], btn));
  });

  grid.querySelectorAll('.tile-copy').forEach((btn) => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
  });
}

// --- Keyboard / button wiring ---

document.getElementById('name-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkName();
});

document.getElementById('check-btn').addEventListener('click', checkName);
document.getElementById('regen-btn').addEventListener('click', generateNames);
document.getElementById('lastname-regen-btn').addEventListener('click', generateLastNames);

// --- Init ---

generateNames();
generateLastNames();
renderRecent();