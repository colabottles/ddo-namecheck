// DDO Name Checker — app.js

const SERVERS = ['Shadowdale', 'Cormyr', 'Thrane', 'Moonsea'];
const RECENT_KEY = 'ddo-name-checker-recent';
const RECENT_MAX = 10;

let selectedServers = ['Shadowdale'];
let selectedStyle = 'fantasy';
let selectedGender = 'male';
let selectedLastStyle = 'fantasy';

// --- Name pools (fixed, split by gender) ---
// Each race has male, female, and neutral sub-pools of ~24 names each.

const NAME_POOLS = {
  fantasy: {
    male: [
      ['Araveth', 'Ranger-born'], ['Theron', 'Battle-scarred'], ['Keldran', 'Iron-willed'],
      ['Orvath', 'Rune-marked'], ['Torindal', 'Oathkeeper'], ['Cavreth', 'Dusk-sworn'],
      ['Drethis', 'Ashen path'], ['Valdros', 'Storm-bringer'], ['Mordecai', 'Far-wanderer'],
      ['Eryndal', 'Shadow-step'], ['Halveth', 'Pale rider'], ['Corvyn', 'Night-born'],
      ['Bravik', 'Iron oath'], ['Seldran', 'Ember-eye'], ['Tharvin', 'Cold-hearted'],
      ['Gorveth', 'Void-touched'], ['Malrak', 'Dark-warden'], ['Drevan', 'Last-light'],
      ['Korrath', 'Stone-sworn'], ['Aelvyn', 'Silver-tongue'], ['Draeven', 'Shadow-cloak'],
      ['Caerath', 'First-blade'], ['Nyrvath', 'Dusk-born'], ['Zorvyn', 'Hollow-crown'],
    ],
    female: [
      ['Miravel', 'Shadow-touched'], ['Seraphyn', 'Void-kissed'], ['Lyndreth', 'Storm-caller'],
      ['Amarix', 'Forgotten'], ['Seladrae', 'Moonbound'], ['Sorvaine', 'Hollow crown'],
      ['Vaelith', 'Pale fire'], ['Threnody', 'Mourning-song'], ['Caeldris', 'Silver-born'],
      ['Duskwyn', 'Twilight'], ['Nyravel', 'Night-weaver'], ['Elyndra', 'Moon-touched'],
      ['Zareveth', 'Storm-kissed'], ['Mirasel', 'Dawn-walker'], ['Coravel', 'Ember-born'],
      ['Sylveth', 'Leaf-touched'], ['Aelindra', 'Star-weave'], ['Vexara', 'Shadow-heart'],
      ['Thessaly', 'Rune-singer'], ['Rynavel', 'Pale shore'], ['Kaeldris', 'Iron-will'],
      ['Solvaine', 'Cold-fire'], ['Draveth', 'Ashen-born'], ['Morvaine', 'Dark-crown'],
    ],
    neutral: [
      ['Vael', 'Pale fire'], ['Ynavar', 'Far wanderer'], ['Duskwyn', 'Twilight'],
      ['Ryn', 'Swift shadow'], ['Corveth', 'Nightborn'], ['Aelith', 'Star-touched'],
      ['Xavan', 'Void-walker'], ['Dreth', 'Ashen'], ['Solvan', 'Cold light'],
      ['Miran', 'Silver-eye'], ['Nyxan', 'Dark-wanderer'], ['Vaen', 'Pale'],
      ['Zorah', 'Ember-born'], ['Caelith', 'Sky-touched'], ['Tharyn', 'Stone-heart'],
      ['Elvan', 'Forest-kin'], ['Vorath', 'Null-sworn'], ['Serath', 'Twilight-walker'],
      ['Kael', 'Iron-born'], ['Marev', 'Shadow-touched'], ['Zoryn', 'Hollow'],
      ['Daevyn', 'Storm-marked'], ['Ryven', 'Quick-blade'], ['Ashan', 'Ash-born'],
    ],
  },
  dwarven: {
    male: [
      ['Bolgrin', 'Stone-fist'], ['Thordak', 'Ironback'], ['Durnheld', 'Deep-axe'],
      ['Krumbar', 'Grudgebearer'], ['Valdrak', 'Mountainheart'], ['Snorvik', 'Clanhammer'],
      ['Rolfgar', 'Old stone'], ['Ulvarn', 'Deep iron'], ['Heldrak', 'Tunnel-king'],
      ['Morkeld', 'Rune-axe'], ['Veldrak', 'Grudge-sworn'], ['Thordin', 'Forge-heart'],
      ['Brumbar', 'Clan-elder'], ['Durkon', 'Stone-warden'], ['Grumnak', 'Iron-fist'],
      ['Baldrek', 'Gold-finder'], ['Mordin', 'Deep-delver'], ['Thordun', 'Hammer-sworn'],
      ['Grimnar', 'Battle-scarred'], ['Vondrak', 'Stone-crusher'], ['Dolgrin', 'Rune-forger'],
      ['Bruldar', 'Fire-beard'], ['Thokdak', 'Iron-jaw'], ['Gorvald', 'Grudge-heart'],
    ],
    female: [
      ['Gunda', 'Forge-born'], ['Bronka', 'Gold-vein'], ['Dagni', 'Ember-eye'],
      ['Bryndis', 'Shield-maiden'], ['Sigra', 'Fire-anvil'], ['Helka', 'Stone-heart'],
      ['Thordis', 'Hammer-born'], ['Grimsa', 'Battle-scarred'], ['Durna', 'Deep-miner'],
      ['Valdra', 'Mountain-kin'], ['Morkra', 'Rune-carved'], ['Brunheld', 'Forge-maid'],
      ['Heldra', 'Tunnel-born'], ['Snora', 'Clanswoman'], ['Korna', 'Iron-born'],
      ['Dagra', 'Ember-heart'], ['Thrina', 'Gold-vein'], ['Vordna', 'Stone-warden'],
      ['Balda', 'Fire-touched'], ['Grimda', 'Battle-maid'], ['Ulvra', 'Deep-iron'],
      ['Dorna', 'Grudge-keeper'], ['Skafna', 'Mountain-born'], ['Rolfra', 'Clan-heart'],
    ],
    neutral: [
      ['Durin', 'Deep-one'], ['Stonik', 'Stone-child'], ['Veld', 'Iron-born'],
      ['Bronk', 'Gold-touch'], ['Thrik', 'Hammer-sworn'], ['Grun', 'Deep-delver'],
      ['Durnk', 'Forge-kin'], ['Skeld', 'Stone-ward'], ['Mork', 'Rune-mark'],
      ['Helm', 'Iron-will'], ['Brak', 'Grudge-born'], ['Torn', 'Old-stone'],
      ['Volk', 'Mountain-born'], ['Greld', 'Deep-axe'], ['Thunk', 'Hammer-kin'],
      ['Durk', 'Stone-heart'], ['Beld', 'Forge-born'], ['Snork', 'Clan-sworn'],
      ['Grunk', 'Iron-back'], ['Threk', 'Battle-worn'], ['Meld', 'Deep-fire'],
      ['Vord', 'Gold-finder'], ['Brunk', 'Stone-fist'], ['Held', 'Tunnel-ward'],
    ],
  },
  duergar: {
    male: [
      ['Grazzt', 'Underdark-born'], ['Thrak', 'Ashen-veined'], ['Dorzak', 'Bitter-heart'],
      ['Skrug', 'Stonegrey'], ['Grull', 'Deep-gnasher'], ['Thorzak', 'Grudge-keeper'],
      ['Drusk', 'Ashenhelm'], ['Brak', 'Iron-spite'], ['Driznak', 'Deepwatch'],
      ['Tharg', 'Stonewraith'], ['Vorzak', 'Gloom-born'], ['Skruzz', 'Saltrock'],
      ['Grukk', 'Ash-veined'], ['Dorzul', 'Deep-warden'], ['Thrugg', 'Stone-gnasher'],
      ['Borzak', 'Bitter-axe'], ['Skrull', 'Hollow-eye'], ['Drukk', 'Thrall-born'],
      ['Grazzak', 'Underdark-grey'], ['Threkk', 'Ashen-lord'], ['Vorzul', 'Shadow-delver'],
      ['Dorznak', 'Gloom-warden'], ['Skravak', 'Stone-spite'], ['Gruknak', 'Bitter-soul'],
    ],
    female: [
      ['Varka', 'Shadowforged'], ['Kraza', 'Gloom-tempered'], ['Zulka', 'Cavern-bred'],
      ['Ghorza', 'Dusk-anvil'], ['Vraka', 'Hollow-eye'], ['Skarna', 'Ashen-born'],
      ['Druna', 'Reclaimed'], ['Thrakka', 'Unbroken'], ['Mogra', 'Stone-hearted'],
      ['Borga', 'Endured'], ['Vorzka', 'Deep-born'], ['Skraza', 'Gloom-touched'],
      ['Grazza', 'Bitter-heart'], ['Dorzna', 'Shadow-vein'], ['Threkka', 'Ash-maid'],
      ['Borzna', 'Iron-spite'], ['Skrulla', 'Hollow-born'], ['Druska', 'Cavern-born'],
      ['Gruzza', 'Underdark-bred'], ['Thrunga', 'Stone-maid'], ['Vorzna', 'Gloom-heart'],
      ['Dorzka', 'Deep-warden'], ['Skravna', 'Stone-vein'], ['Gruknza', 'Bitter-born'],
    ],
    neutral: [
      ['Vrox', 'Hollow'], ['Skarn', 'Scar-marked'], ['Druz', 'Ash-born'],
      ['Grak', 'Stone-grey'], ['Thraz', 'Bitter'], ['Bork', 'Iron-spite'],
      ['Skraz', 'Gloom-touched'], ['Dorn', 'Deep-one'], ['Vrak', 'Shadow-born'],
      ['Gruz', 'Underdark'], ['Throk', 'Ashen'], ['Skrul', 'Hollow-eye'],
      ['Drak', 'Dark-born'], ['Vorz', 'Cavern-bred'], ['Grax', 'Bitter-stone'],
      ['Thruk', 'Ash-veined'], ['Skrax', 'Gloom-born'], ['Drux', 'Stone-spite'],
      ['Vrax', 'Hollow-heart'], ['Graz', 'Deep-grey'], ['Brak', 'Iron-born'],
      ['Skrok', 'Shadow-kin'], ['Dorz', 'Cavern-ward'], ['Thrix', 'Bitter-soul'],
    ],
  },
  elven: {
    male: [
      ['Caladrel', 'Windwhisper'], ['Valandil', 'Starfall'], ['Celendil', 'Farseer'],
      ['Calithar', 'First light'], ['Aerindel', 'Sunspire'], ['Thalion', 'Steadfast'],
      ['Galadhon', 'Tree-friend'], ['Iorhael', 'Old wise one'], ['Eluréd', 'Star-crowned'],
      ['Maeglin', 'Sharp-glance'], ['Caranthir', 'Red-faced'], ['Faelivrin', 'Sun-glitter'],
      ['Elarith', 'Silver gaze'], ['Aerindor', 'Dawn-walker'], ['Sylvador', 'Forest-kin'],
      ['Calindor', 'Light-bringer'], ['Tharindel', 'Storm-eye'], ['Vaelindor', 'Star-walker'],
      ['Aerindoth', 'Sky-touched'], ['Sylvindel', 'Leaf-bringer'], ['Caladindor', 'Wind-friend'],
      ['Mithindel', 'Grey-eye'], ['Elorveth', 'Star-born'], ['Celindor', 'Silver-walker'],
    ],
    female: [
      ['Aelindra', 'Starweave'], ['Sylvari', 'Dawnlight'], ['Naevys', 'Moondrift'],
      ['Thalindë', 'Leaf-bound'], ['Lireth', 'Dream-touch'], ['Isilveth', 'Pale shore'],
      ['Aravel', 'Ember dawn'], ['Sylavel', 'Twilight-blood'], ['Eredil', 'Moonveil'],
      ['Miraeleth', 'Echo-song'], ['Elarith', 'Silver gaze'], ['Nimloth', 'White blossom'],
      ['Elwing', 'Star-spray'], ['Tathar', 'Willow'], ['Lossëa', 'Snow-touched'],
      ['Mithrellas', 'Grey-leaf'], ['Sereth', 'Calm river'], ['Aewen', 'Bird-maiden'],
      ['Caladwen', 'Light-maid'], ['Sylindra', 'Forest-dancer'], ['Aerindra', 'Sky-maiden'],
      ['Calindra', 'Silver-born'], ['Vaelindra', 'Star-maiden'], ['Tharindra', 'Storm-touched'],
    ],
    neutral: [
      ['Vael', 'Star-touched'], ['Tathar', 'Willow'], ['Sereth', 'Calm river'],
      ['Aelin', 'Silver-light'], ['Calin', 'Bright-one'], ['Sylvin', 'Forest-kin'],
      ['Mithrin', 'Grey-mantle'], ['Thalin', 'Storm-touched'], ['Aerith', 'Sky-born'],
      ['Lorien', 'Dream-land'], ['Elarin', 'Star-born'], ['Calindë', 'Silver-touched'],
      ['Sylindë', 'Forest-born'], ['Vaelin', 'Star-walker'], ['Tharindë', 'Storm-born'],
      ['Aelindë', 'Star-weave'], ['Mithindë', 'Grey-eye'], ['Elorindë', 'Star-song'],
      ['Celindë', 'Silver-song'], ['Aerindë', 'Sky-touched'], ['Sylvindë', 'Leaf-song'],
      ['Caladindë', 'Wind-song'], ['Vaelindë', 'Star-song'], ['Galindë', 'Tree-song'],
    ],
  },
  halfling: {
    male: [
      ['Corwin', 'Pipemaster'], ['Tomas', 'Barleycorn'], ['Finwick', 'Bramble'],
      ['Yonder', 'Luckpenny'], ['Jimble', 'Far-river'], ['Aldrick', 'Long-road'],
      ['Tibble', 'Burrow-born'], ['Perrin', 'Copperkettle'], ['Odo', 'Round and merry'],
      ['Bungo', 'Homebody'], ['Falco', 'Quick feet'], ['Drogo', 'Quiet farmer'],
      ['Milo', 'Garden-tender'], ['Tobold', 'Pipe-lover'], ['Hamfast', 'Old Shire stock'],
      ['Largo', 'Slow-footed'], ['Fosco', 'Deep-root'], ['Merric', 'Merry kin'],
      ['Bimble', 'Lightfoot'], ['Willum', 'Wander-foot'], ['Cob', 'Field-born'],
      ['Stirling', 'Silver-bright'], ['Bramwell', 'Thorn-vale'], ['Rondo', 'Round-road'],
    ],
    female: [
      ['Lidda', 'Quickstep'], ['Rosalind', 'Meadow-run'], ['Belda', 'Thistledown'],
      ['Wren', 'Copperpenny'], ['Nell', 'Pipesmoke'], ['Marigold', 'Flower-named'],
      ['Rosie', 'Sweet and sturdy'], ['Pansy', 'Garden-named'], ['Daisy', 'Bright'],
      ['Belladonna', 'Adventurous'], ['Primula', 'River-born'], ['Esmeralda', 'Jewel-named'],
      ['Lily', 'Flower-named'], ['Peony', 'Bloom-bright'], ['Ruby', 'Gem-heart'],
      ['Peregrina', 'Far-walker'], ['Camelia', 'Flower-kin'], ['Lavinia', 'Soft-spoken'],
      ['Coral', 'River-bright'], ['Hilda', 'Steadfast'], ['Blossom', 'Spring-born'],
      ['Amber', 'Warm-glow'], ['Ivy', 'Creeper-root'], ['Fern', 'Forest-kin'],
    ],
    neutral: [
      ['Sable', 'Foxfoot'], ['Merry', 'Hearthfire'], ['Pip', 'Small-step'],
      ['Robin', 'Quick-wit'], ['Brin', 'Briar-born'], ['Ash', 'Hearth-warm'],
      ['Clover', 'Meadow-kin'], ['Reed', 'River-born'], ['Flint', 'Field-stone'],
      ['Brook', 'Stream-side'], ['Dew', 'Morning-touch'], ['Briar', 'Thorn-born'],
      ['Thistle', 'Prickle-kin'], ['Grain', 'Field-born'], ['Vale', 'Hollow-home'],
      ['Wick', 'Candle-bright'], ['Soot', 'Hearth-born'], ['Cress', 'Stream-side'],
      ['Burr', 'Thorn-touch'], ['Nook', 'Hidden-hollow'], ['Gorse', 'Bush-born'],
      ['Peat', 'Bog-kin'], ['Sedge', 'Marsh-born'], ['Twig', 'Forest-light'],
    ],
  },
  gnome: {
    male: [
      ['Bixby', 'Tinkerer'], ['Zook', 'Sparkcaster'], ['Alston', 'Glyphweaver'],
      ['Dimble', 'Fumble-fix'], ['Gimble', 'Lampwright'], ['Orryn', 'Gadgetsmith'],
      ['Sindri', 'Runewright'], ['Kellen', 'Prismwright'], ['Pock', 'Odd-step'],
      ['Fibble', 'Rattle-brain'], ['Wren', 'Clockwarden'], ['Glim', 'Bright-touch'],
      ['Twick', 'Spring-winder'], ['Cogsworth', 'Gear-minded'], ['Sprock', 'Wheel-turner'],
      ['Fizzwick', 'Spark-bright'], ['Glitter', 'Shine-touched'], ['Ratchet', 'Gear-born'],
      ['Noodle', 'Odd-think'], ['Sprocket', 'Wheel-born'], ['Tinker', 'Make-it-work'],
      ['Glimmer', 'Light-touch'], ['Wobble', 'Off-kilter'], ['Cog', 'Gear-heart'],
    ],
    female: [
      ['Namfoodle', 'Oddwright'], ['Wrenn', 'Clockwarden'], ['Ellywick', 'Spell-tinker'],
      ['Tavita', 'Mirthweaver'], ['Lilli', 'Inkstained'], ['Waywocket', 'Far-tumbler'],
      ['Zanna', 'Spark-bright'], ['Milli', 'Gear-heart'], ['Fizzle', 'Bright-spark'],
      ['Glinda', 'Glow-born'], ['Trinket', 'Small-craft'], ['Nimble', 'Quick-finger'],
      ['Sparkie', 'Flame-touch'], ['Whisper', 'Soft-gear'], ['Glitter', 'Shine-born'],
      ['Dazzle', 'Bright-work'], ['Twinkle', 'Star-touched'], ['Prism', 'Color-born'],
      ['Gadget', 'Make-it-work'], ['Widget', 'Small-make'], ['Gizmo', 'Odd-craft'],
      ['Blinky', 'Light-born'], ['Fizzy', 'Bubble-bright'], ['Zippy', 'Quick-gear'],
    ],
    neutral: [
      ['Pock', 'Odd-step'], ['Glim', 'Bright-touch'], ['Sprocket', 'Wheel-born'],
      ['Cog', 'Gear-heart'], ['Pip', 'Small-make'], ['Zap', 'Spark-born'],
      ['Nib', 'Ink-touch'], ['Whir', 'Gear-sound'], ['Buzz', 'Hum-bright'],
      ['Click', 'Gear-turn'], ['Tick', 'Clock-born'], ['Snap', 'Quick-touch'],
      ['Flux', 'Change-born'], ['Blink', 'Light-touch'], ['Rune', 'Mark-born'],
      ['Glyph', 'Sign-touch'], ['Spark', 'Fire-born'], ['Arc', 'Bright-curve'],
      ['Volt', 'Charge-born'], ['Beam', 'Light-born'], ['Prism', 'Color-touch'],
      ['Lens', 'See-through'], ['Coil', 'Spring-touch'], ['Flint', 'Spark-born'],
    ],
  },
  halforc: {
    male: [
      ['Grax', 'Bone-crusher'], ['Morg', 'Warcaller'], ['Urzog', 'Scarred'],
      ['Karg', 'Stoneskin'], ['Thokk', 'Ironjaw'], ['Vrash', 'Sunderbone'],
      ['Gorka', 'Ravenbrow'], ['Tusk', 'Split-ear'], ['Bragh', 'Bloodcrown'],
      ['Krusk', 'Grudge-heart'], ['Thrak', 'Bone-breaker'], ['Grull', 'Iron-jaw'],
      ['Mork', 'War-scarred'], ['Urzak', 'Battle-born'], ['Krug', 'Stone-fist'],
      ['Thograk', 'Bone-crusher'], ['Vrakk', 'Scar-face'], ['Gorkak', 'Iron-born'],
      ['Bruggak', 'Blood-axe'], ['Krugak', 'Stone-breaker'], ['Thrakk', 'War-born'],
      ['Morkak', 'Battle-scarred'], ['Urzak', 'Grudge-bearer'], ['Garrak', 'Iron-hide'],
    ],
    female: [
      ['Dasha', 'Ironblood'], ['Brenna', 'Half-blood'], ['Yulga', 'Fell-handed'],
      ['Durga', 'Storm-born'], ['Nala', 'Ashwalker'], ['Olgra', 'Warlorn'],
      ['Graka', 'Battle-scarred'], ['Morga', 'War-born'], ['Thurka', 'Iron-will'],
      ['Vrakka', 'Scar-born'], ['Narka', 'Half-blood'], ['Brega', 'Stone-heart'],
      ['Draka', 'Battle-maid'], ['Urza', 'Iron-born'], ['Gorka', 'War-scarred'],
      ['Thrakka', 'Bone-crusher'], ['Grulla', 'Iron-jaw'], ['Morkka', 'Battle-born'],
      ['Urgga', 'Stone-fist'], ['Krugga', 'Grudge-heart'], ['Thrukka', 'War-maid'],
      ['Morukka', 'Battle-scarred'], ['Urzakka', 'Iron-hide'], ['Garraka', 'Stone-born'],
    ],
    neutral: [
      ['Grix', 'Battle-born'], ['Mork', 'War-scarred'], ['Urg', 'Iron-born'],
      ['Krak', 'Stone-fist'], ['Thok', 'Bone-breaker'], ['Vrax', 'Scar-born'],
      ['Gruk', 'Half-blood'], ['Brak', 'Iron-hide'], ['Thrug', 'War-born'],
      ['Mrak', 'Battle-scarred'], ['Urak', 'Grudge-bearer'], ['Grak', 'Stone-born'],
      ['Bruk', 'Iron-will'], ['Krux', 'Stone-breaker'], ['Thrak', 'War-kin'],
      ['Mork', 'Battle-worn'], ['Urk', 'Iron-fist'], ['Grax', 'Stone-heart'],
      ['Brax', 'Half-blood'], ['Kruk', 'Grudge-born'], ['Thrux', 'War-mark'],
      ['Morx', 'Battle-kin'], ['Urkax', 'Iron-born'], ['Grukax', 'Stone-scarred'],
    ],
  },
  tiefling: {
    male: [
      ['Mordecai', 'Hellbound'], ['Calix', 'Brimstone'], ['Akmenos', 'Ashsoul'],
      ['Barakas', 'Hellmarked'], ['Hadar', 'Darkpulse'], ['Kairon', 'Soulfire'],
      ['Morthos', 'Hex-born'], ['Skamos', 'Voidwarden'], ['Riven', 'Ashblood'],
      ['Zaros', 'Ember-born'], ['Corvax', 'Shadow-heart'], ['Malachar', 'Hellfire'],
      ['Thadeus', 'Brimstone-born'], ['Carax', 'Void-touched'], ['Sevryn', 'Ember-born'],
      ['Pyrax', 'Flame-born'], ['Zarak', 'Shadow-marked'], ['Malvex', 'Hell-marked'],
      ['Darax', 'Void-born'], ['Tarquin', 'Brand-touched'], ['Varek', 'Hell-sworn'],
      ['Neros', 'Ash-born'], ['Dravan', 'Shadowtail'], ['Caelar', 'Ember-soul'],
    ],
    female: [
      ['Lilith', 'Silvertongue'], ['Damaia', 'Ember-eye'], ['Therai', 'Brand-touched'],
      ['Vex', 'Shadowtail'], ['Nyx', 'Smokewraith'], ['Zariel', 'Fallen light'],
      ['Sevryn', 'Ember-born'], ['Xara', 'Void-born'], ['Malevex', 'Hell-touched'],
      ['Pyrith', 'Flame-born'], ['Zarith', 'Shadow-marked'], ['Malvexia', 'Hell-marked'],
      ['Darith', 'Void-born'], ['Tarquinia', 'Brand-touched'], ['Varith', 'Hell-sworn'],
      ['Nerith', 'Ash-born'], ['Dravith', 'Shadowtail'], ['Caelith', 'Ember-soul'],
      ['Luxia', 'Void-touched'], ['Serafex', 'Hell-fire'], ['Nyxara', 'Smoke-born'],
      ['Zarexia', 'Shadow-heart'], ['Malvara', 'Hell-born'], ['Pyrvex', 'Flame-heart'],
    ],
    neutral: [
      ['Riven', 'Ashblood'], ['Nyx', 'Smokewraith'], ['Vex', 'Shadowtail'],
      ['Zar', 'Void-born'], ['Mav', 'Hell-touched'], ['Pyrex', 'Flame-born'],
      ['Darex', 'Shadow-marked'], ['Varek', 'Hell-sworn'], ['Nerex', 'Ash-born'],
      ['Drex', 'Shadowtail'], ['Caelx', 'Ember-soul'], ['Luxex', 'Void-touched'],
      ['Serafex', 'Hell-fire'], ['Nyxex', 'Smoke-born'], ['Zarex', 'Shadow-heart'],
      ['Malvex', 'Hell-born'], ['Pyrvex', 'Flame-heart'], ['Darvex', 'Void-mark'],
      ['Tarvex', 'Brand-born'], ['Nervex', 'Ash-mark'], ['Corvex', 'Shadow-born'],
      ['Xavex', 'Void-walker'], ['Mavex', 'Hell-mark'], ['Pyrex', 'Flame-born'],
    ],
  },
  dragonborn: {
    male: [
      ['Arjhan', 'Scale-sworn'], ['Donaar', 'Thunderscale'], ['Heskan', 'Ashbreath'],
      ['Kriv', 'Stormborn'], ['Medrash', 'Oathscale'], ['Mehen', 'Forgecrest'],
      ['Nadarr', 'Wildfire'], ['Pandjed', 'Goldscale'], ['Rhogar', 'Bladescale'],
      ['Shamash', 'Cinderclaw'], ['Tarhun', 'Ironscale'], ['Torinn', 'Stormcrest'],
      ['Balasar', 'Emberclaw'], ['Ghesh', 'Ironwing'], ['Shedinn', 'Voidwing'],
      ['Patrin', 'Skyborn'], ['Donaar', 'Thunder-born'], ['Krivaan', 'Storm-sworn'],
      ['Medraash', 'Oath-bearer'], ['Mehenaar', 'Forge-sworn'], ['Nadaraan', 'Wildfire-born'],
      ['Pandjaar', 'Gold-wing'], ['Rhogaraan', 'Blade-born'], ['Tarhunaan', 'Iron-born'],
    ],
    female: [
      ['Akra', 'Flame-born'], ['Biri', 'White-scale'], ['Daar', 'Ember-born'],
      ['Farideh', 'Twin-cursed'], ['Harann', 'Silver-scale'], ['Havilar', 'Twin-born'],
      ['Jheri', 'Gold-scale'], ['Kava', 'Storm-born'], ['Korinn', 'Sea-scale'],
      ['Mishann', 'Copper-born'], ['Nala', 'Ember-scale'], ['Perra', 'Wind-born'],
      ['Raiann', 'Sun-scale'], ['Sora', 'Sky-born'], ['Surina', 'Fire-heart'],
      ['Thava', 'Earth-born'], ['Uadjit', 'Snake-scale'], ['Vrinn', 'Storm-scale'],
      ['Arjhani', 'Scale-maid'], ['Krivaan', 'Storm-born'], ['Medraashi', 'Oath-scale'],
      ['Nadarri', 'Wildfire-born'], ['Rhogari', 'Blade-scale'], ['Tarhuni', 'Iron-scale'],
    ],
    neutral: [
      ['Kriv', 'Stormborn'], ['Sora', 'Sky-born'], ['Raan', 'Scale-touched'],
      ['Veth', 'Flame-born'], ['Torinn', 'Storm-crest'], ['Nadarr', 'Wildfire'],
      ['Arjhan', 'Scale-sworn'], ['Ghesh', 'Iron-wing'], ['Balasar', 'Ember-claw'],
      ['Mehen', 'Forge-crest'], ['Pandjed', 'Gold-scale'], ['Rhogar', 'Blade-scale'],
      ['Shamash', 'Cinder-claw'], ['Tarhun', 'Iron-scale'], ['Heskan', 'Ash-breath'],
      ['Donaar', 'Thunder-scale'], ['Patrin', 'Sky-born'], ['Shedinn', 'Void-wing'],
      ['Medrash', 'Oath-scale'], ['Krivaan', 'Storm-sworn'], ['Nala', 'Ember-scale'],
      ['Perra', 'Wind-born'], ['Raiann', 'Sun-scale'], ['Thava', 'Earth-born'],
    ],
  },
  warforged: {
    male: [
      ['Onyx-7', 'Combat unit'], ['Bastion', 'Shield-line'], ['Caliburn', 'Edge-sworn'],
      ['Aurek', 'Stalwart'], ['Siege', 'Breaker'], ['Remnant', 'Survivor'],
      ['Crux', 'Resolver'], ['Chassis', 'First-made'], ['Durakon', 'Unbreaking'],
      ['Ironveil', 'Watcher'], ['Anvil', 'Forged-true'], ['Bulwark', 'Shield-born'],
      ['Rampart', 'Wall-sworn'], ['Citadel', 'Stone-heart'], ['Garrison', 'Fort-born'],
      ['Battlement', 'Wall-born'], ['Stronghold', 'Fortress-heart'], ['Palisade', 'Stake-born'],
      ['Rampart', 'Wall-sworn'], ['Barricade', 'Barrier-born'], ['Embrasure', 'Gap-watcher'],
      ['Merlon', 'Wall-tooth'], ['Battlement', 'Wall-born'], ['Parapet', 'Wall-heart'],
    ],
    female: [
      ['Frenkel', 'Sentinel'], ['Ironveil', 'Watcher'], ['Veritas', 'Seeker'],
      ['Pyre-3', 'Incendiary'], ['Nullval', 'Last unit'], ['Forgewarden', 'Smith-born'],
      ['Sentinel', 'Watch-born'], ['Vanguard', 'Front-born'], ['Bulwark', 'Shield-heart'],
      ['Citadel', 'Stone-born'], ['Bastion', 'Shield-heart'], ['Rampart', 'Wall-born'],
      ['Garrison', 'Fort-heart'], ['Stronghold', 'Fortress-born'], ['Palisade', 'Stake-heart'],
      ['Barricade', 'Barrier-heart'], ['Embrasure', 'Gap-born'], ['Merlon', 'Wall-born'],
      ['Parapet', 'Wall-heart'], ['Crenelle', 'Gap-born'], ['Machicolation', 'Drop-born'],
      ['Battlement', 'Wall-heart'], ['Counterscarp', 'Slope-born'], ['Gorge', 'Throat-born'],
    ],
    neutral: [
      ['Null-4', 'Purpose-built'], ['Anvil', 'Forged-true'], ['Crux', 'Resolver'],
      ['Veritas', 'Seeker'], ['Remnant', 'Survivor'], ['Chassis', 'First-made'],
      ['Forge', 'Made-true'], ['Iron', 'Hard-born'], ['Steel', 'Tempered'],
      ['Brass', 'Warm-metal'], ['Bronze', 'Old-metal'], ['Copper', 'Bright-metal'],
      ['Nickel', 'Hard-silver'], ['Cobalt', 'Blue-metal'], ['Chromium', 'Bright-born'],
      ['Titanium', 'Light-strong'], ['Tungsten', 'Heavy-hard'], ['Osmium', 'Dense-born'],
      ['Iridium', 'Rainbow-born'], ['Platinum', 'Grey-bright'], ['Palladium', 'Pale-born'],
      ['Rhodium', 'Rose-bright'], ['Rhenium', 'Rhine-born'], ['Vanadium', 'Vale-born'],
    ],
  },
  eberron: {
    male: [
      ['Khorvath', 'Dragonmarked'], ['Zendak', 'Wanderer'], ['Merrix', 'Artificer-kin'],
      ['Vyndal', 'Deneith blade'], ['Davan', 'Kundarak vault'], ['Elix', 'Sivis-born'],
      ['Traveth', 'Storm-bound'], ['Caldas', 'Coin-sworn'], ['Ryvek', 'Passage-born'],
      ['Khorvyn', 'Mark-born'], ['Zendak', 'Far-walker'], ['Merrak', 'Forge-kin'],
      ['Vyndar', 'Blade-sworn'], ['Davrak', 'Vault-warden'], ['Elindor', 'Word-keeper'],
      ['Travrak', 'Storm-sworn'], ['Calrak', 'Coin-born'], ['Ryverak', 'Passage-sworn'],
      ['Khorvak', 'Mark-sworn'], ['Zenrak', 'Far-born'], ['Merrak', 'Forge-sworn'],
      ['Vyndrak', 'Blade-born'], ['Davak', 'Vault-born'], ['Elrak', 'Word-born'],
    ],
    female: [
      ['Irulan', 'House-sworn'], ['Thessa', 'Lyrandar blood'], ['Raelith', 'Tharashk'],
      ['Kaeleth', 'Medani eye'], ['Sorith', 'Cannith-made'], ['Phalan', 'Ghallanda inn'],
      ['Nyrith', 'Shadow-marked'], ['Khorvara', 'Mark-born'], ['Zendara', 'Far-walker'],
      ['Merrith', 'Forge-kin'], ['Vyndara', 'Blade-sworn'], ['Davara', 'Vault-warden'],
      ['Elindra', 'Word-keeper'], ['Travara', 'Storm-sworn'], ['Calara', 'Coin-born'],
      ['Ryvara', 'Passage-sworn'], ['Khorvindra', 'Mark-sworn'], ['Zenvara', 'Far-born'],
      ['Merrvara', 'Forge-sworn'], ['Vynvara', 'Blade-born'], ['Davindra', 'Vault-born'],
      ['Elindara', 'Word-born'], ['Travindra', 'Storm-born'], ['Calindra', 'Coin-born'],
    ],
    neutral: [
      ['Sorith', 'Cannith-made'], ['Caldas', 'Coin-sworn'], ['Elix', 'Sivis-born'],
      ['Khorv', 'Mark-born'], ['Zend', 'Far-walker'], ['Merr', 'Forge-kin'],
      ['Vynd', 'Blade-sworn'], ['Dav', 'Vault-warden'], ['Elin', 'Word-keeper'],
      ['Trav', 'Storm-sworn'], ['Cal', 'Coin-born'], ['Ryv', 'Passage-sworn'],
      ['Khorin', 'Mark-sworn'], ['Zenin', 'Far-born'], ['Merrin', 'Forge-sworn'],
      ['Vyndin', 'Blade-born'], ['Davin', 'Vault-born'], ['Elinin', 'Word-born'],
      ['Travin', 'Storm-born'], ['Calin', 'Coin-born'], ['Ryvin', 'Passage-born'],
      ['Khorvin', 'Mark-born'], ['Zenvin', 'Far-sworn'], ['Merrvin', 'Forge-born'],
    ],
  },
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
  // Keep to 2 syllables — 3 produces names that run too long
  const syllableCount = 2;

  let name = '';
  for (let i = 0; i < syllableCount; i++) {
    name += pick(set.onset);
    name += pick(set.vowel);
    if (i < syllableCount - 1 || Math.random() < 0.4) {
      name += pick(set.coda);
    }
  }

  // Capitalise first letter, lowercase the rest
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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
    if (!seen.has(name) && name.length >= 4 && name.length <= 10) {
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
    const proceduralStyles = Object.keys(SYLLABLE_SETS);
    const randomStyle = proceduralStyles[Math.floor(Math.random() * proceduralStyles.length)];
    picks = buildProceduralNames(randomStyle);
  } else if (NAME_POOLS[selectedStyle]) {
    // Pull from the gender sub-pool, fall back to neutral if the key is missing
    const pool = NAME_POOLS[selectedStyle][selectedGender] || NAME_POOLS[selectedStyle].neutral || [];
    picks = shuffle([...pool]).slice(0, 8);
  } else {
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

// --- Gender button logic ---

document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    selectedGender = btn.dataset.gender;
    generateNames();
  });
});

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