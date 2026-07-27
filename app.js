// DDO Name Checker — app.js

const SERVERS = ['Shadowdale', 'Cormyr', 'Thrane', 'Moonsea'];
const RECENT_KEY = 'ddo-name-checker-recent';
const RECENT_MAX = 10;

let selectedServers = ['Shadowdale'];
let selectedStyle = 'human';
let selectedGender = 'male';
let selectedLastStyle = 'human';

// --- Procedural syllable engine ---
// Gender-split syllable sets per race.
// Each has: onset[], vowel[], coda[], hints[]
// Surnames have their own sets: sOnset[], sVowel[], sCoda[]
// Combination count = onset * vowel * coda^2 (with/without final coda) — easily thousands per race.

const RACE_SETS = {

  aasimar: {
    male: {
      onset:  ['Aur', 'Cael', 'Sar', 'Lum', 'Raph', 'Zeph', 'Sol', 'Bel', 'Mir', 'Ith', 'Cas', 'Dav', 'El', 'Gab', 'Mal', 'Ner', 'Or', 'Phan', 'Rem', 'Ser'],
      vowel:  ['iel', 'ael', 'iel', 'and', 'iel', 'yr', 'ael', 'ael', 'ael', 'iel', 'ael', 'iel', 'ael', 'iel', 'ael', 'iel', 'ael', 'iel', 'ael', 'iel'],
      coda:   ['ion', 'us', 'ar', 'iel', 'on', 'eth', 'an', 'iel', 'or', 'us', 'ian', 'el', 'ath', 'en', 'is', 'al', 'iel', 'on', 'us', 'ar', ''],
      hints:  ['Heaven-touched', 'Light-bearer', 'Star-born', 'Dawn-blessed', 'Radiant', 'Celestial-kin', 'Sky-sworn', 'Halo-born', 'Blessed-one', 'Luminous'],
    },
    female: {
      onset:  ['Aur', 'Syl', 'Lum', 'Cael', 'Ser', 'Mir', 'El', 'Cas', 'Thal', 'Bel', 'Ith', 'Gal', 'Nar', 'Oph', 'Raph', 'Sol', 'Uri', 'Ves', 'Zan', 'Zeph'],
      vowel:  ['ia', 'iel', 'ael', 'ina', 'ara', 'iel', 'ine', 'iel', 'ael', 'iel', 'ina', 'ara', 'iel', 'ael', 'iel', 'ara', 'iel', 'iel', 'ael', 'yra'],
      coda:   ['na', 'el', 'iel', 'ra', 'th', 'ne', 'la', 'iel', 'ra', 'na', 'el', 'iel', 'ra', 'th', 'ne', 'la', 'iel', 'ra', 'na', 'el', ''],
      hints:  ['Heaven-touched', 'Light-bearer', 'Star-born', 'Dawn-blessed', 'Radiant', 'Celestial-kin', 'Sky-sworn', 'Halo-born', 'Blessed-one', 'Luminous'],
    },
    neutral: {
      onset:  ['Aur', 'Lum', 'Sol', 'Cael', 'Mir', 'El', 'Ser', 'Ith', 'Bel', 'Raph', 'Nar', 'Oph', 'Rem', 'Ves', 'Zan', 'Thal', 'Gal', 'Uri', 'Phan', 'Zeph'],
      vowel:  ['iel', 'ael', 'yn', 'en', 'in', 'an', 'on', 'ael', 'iel', 'yn', 'en', 'in', 'an', 'on', 'ael', 'iel', 'yn', 'en', 'in', 'an'],
      coda:   ['', 'el', 'ar', 'on', 'iel', 'eth', 'an', 'or', 'us', 'ian', 'al', 'ath', 'en', 'is', 'iel', 'on', 'us', 'ar', 'el', 'an'],
      hints:  ['Heaven-touched', 'Light-bearer', 'Star-born', 'Dawn-blessed', 'Radiant', 'Celestial-kin', 'Sky-sworn', 'Halo-born', 'Blessed-one', 'Luminous'],
    },
    sOnset: ['Dawn', 'Sol', 'Lum', 'Cael', 'Star', 'Aur', 'Halo', 'Heav', 'Radi', 'Bless', 'Cel', 'Aeth', 'Glo', 'Shin', 'Lux', 'Bril', 'Illu', 'Lumm', 'Ser', 'Div'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'grace', 'light', 'wing', 'song', 'heart', 'bloom', 'crown', 'fire', 'touch', 'mark', 'ward', 'glow', 'bless', 'kin', 'rise', 'fall', 'path'],
  },

  dhampir: {
    male: {
      onset:  ['Vor', 'Mal', 'Drac', 'Sev', 'Cass', 'Laz', 'Rad', 'Vlad', 'Mor', 'Cor', 'Dusk', 'Noc', 'Shad', 'Crim', 'Noir', 'Obsid', 'Rav', 'Dusk', 'Goth', 'Vel'],
      vowel:  ['an', 'us', 'ek', 'ir', 'or', 'en', 'in', 'ax', 'ul', 'ev', 'ar', 'ok', 'ov', 'uk', 'on', 'ix', 'ux', 'oth', 'ath', 'eth'],
      coda:   ['', 'ius', 'ian', 'ov', 'ak', 'ir', 'an', 'ek', 'or', 'us', 'ev', 'ok', 'in', 'ax', 'ul', 'ath', 'eth', 'oth', 'ix', 'ux'],
      hints:  ['Blood-touched', 'Night-born', 'Shadow-veined', 'Dusk-kin', 'Half-dead', 'Pale-heart', 'Dusk-sworn', 'Crimson-eyed', 'Dark-hunger', 'Twilight-born'],
    },
    female: {
      onset:  ['Luc', 'Mor', 'Ser', 'Carm', 'Nar', 'Bel', 'Cas', 'Eliz', 'Rav', 'Vor', 'Noc', 'Shad', 'Crim', 'Vel', 'Goth', 'Dusk', 'Noir', 'Obsid', 'Viol', 'Lil'],
      vowel:  ['ia', 'ina', 'ella', 'ara', 'iva', 'ila', 'ena', 'etta', 'ora', 'ula', 'anda', 'antha', 'issa', 'anya', 'ona', 'una', 'aine', 'eine', 'oire', 'ette'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'ine', 'ora', 'ara', 'ena', 'ula', 'iva'],
      hints:  ['Blood-touched', 'Night-born', 'Shadow-veined', 'Dusk-kin', 'Half-dead', 'Pale-heart', 'Dusk-sworn', 'Crimson-eyed', 'Dark-hunger', 'Twilight-born'],
    },
    neutral: {
      onset:  ['Noc', 'Shad', 'Dusk', 'Crim', 'Noir', 'Vel', 'Mor', 'Vor', 'Mal', 'Rav', 'Obsid', 'Goth', 'Viol', 'Lil', 'Luc', 'Ser', 'Nar', 'Bel', 'Cas', 'Eliz'],
      vowel:  ['en', 'in', 'an', 'or', 'ar', 'ix', 'ux', 'eth', 'ath', 'oth'],
      coda:   ['', 'ov', 'ak', 'ir', 'an', 'ek', 'or', 'us', 'ev', 'ok', 'in', 'ax', 'ul', 'ath', 'eth', 'oth', 'ix', 'ux', 'ian', 'ius'],
      hints:  ['Blood-touched', 'Night-born', 'Shadow-veined', 'Dusk-kin', 'Half-dead', 'Pale-heart', 'Dusk-sworn', 'Crimson-eyed', 'Dark-hunger', 'Twilight-born'],
    },
    sOnset: ['Blood', 'Night', 'Shadow', 'Dusk', 'Crim', 'Noir', 'Pale', 'Dark', 'Twi', 'Obsid', 'Rav', 'Mort', 'Noc', 'Vel', 'Goth', 'Shad', 'Void', 'Ash', 'Bone', 'Crypt'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'hunger', 'shroud', 'fang', 'thorn', 'heart', 'bloom', 'crown', 'brand', 'touch', 'mark', 'ward', 'glow', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  dragonborn: {
    male: {
      onset:  ['Arj', 'Bal', 'Don', 'Ghe', 'Hes', 'Kriv', 'Med', 'Meh', 'Nad', 'Pan', 'Pat', 'Rho', 'Sha', 'She', 'Tar', 'Tor', 'Bra', 'Cal', 'Drak', 'Gar'],
      vowel:  ['a', 'e', 'i', 'o', 'aa', 'ar', 'an', 'ash', 'esh', 'or'],
      coda:   ['jhan', 'asar', 'aar', 'sh', 'kan', 'rash', 'en', 'arr', 'djed', 'rin', 'gar', 'inn', 'mash', 'dinn', 'hun', 'rinn', 'xan', 'zar', 'nak', 'kesh', ''],
      hints:  ['Scale-sworn', 'Emberclaw', 'Thunderscale', 'Stormborn', 'Oathscale', 'Ashbreath', 'Bladescale', 'Stormcrest', 'Fireborn', 'Ironwing'],
    },
    female: {
      onset:  ['Akr', 'Bir', 'Dar', 'Far', 'Har', 'Hav', 'Jher', 'Kav', 'Kor', 'Mis', 'Nal', 'Per', 'Rai', 'Sor', 'Sur', 'Thav', 'Uadj', 'Vrin', 'Zash', 'Bira'],
      vowel:  ['a', 'i', 'ann', 'ara', 'ina', 'ora', 'ina', 'a', 'inn', 'ann'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'it', 'ora', 'ara', 'ena', 'ula', 'iva'],
      hints:  ['Scale-sworn', 'Emberclaw', 'Thunderscale', 'Stormborn', 'Oathscale', 'Ashbreath', 'Bladescale', 'Stormcrest', 'Fireborn', 'Ironwing'],
    },
    neutral: {
      onset:  ['Kriv', 'Sora', 'Raan', 'Veth', 'Nadarr', 'Arjhan', 'Ghesh', 'Mehen', 'Rhogar', 'Sham', 'Tarh', 'Hes', 'Don', 'Pat', 'She', 'Bal', 'Gar', 'Drak', 'Cal', 'Bra'],
      vowel:  ['a', 'e', 'i', 'o', 'ar', 'an', 'ash', 'or', 'inn', 'aa'],
      coda:   ['', 'an', 'in', 'ar', 'ash', 'esh', 'or', 'inn', 'rash', 'en', 'arr', 'rin', 'gar', 'hun', 'xan', 'zar', 'nak', 'kesh', 'mash', 'dinn'],
      hints:  ['Scale-sworn', 'Emberclaw', 'Thunderscale', 'Stormborn', 'Oathscale', 'Ashbreath', 'Bladescale', 'Stormcrest', 'Fireborn', 'Ironwing'],
    },
    sOnset: ['Iron', 'Ember', 'Storm', 'Ash', 'Gold', 'Blade', 'Cinder', 'Void', 'Oath', 'Scale', 'Fire', 'Thun', 'Drag', 'Wyrm', 'Flame', 'Fang', 'Claw', 'Wing', 'Breath', 'Tail'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['scale', 'claw', 'wing', 'born', 'breath', 'fang', 'thorn', 'heart', 'crest', 'crown', 'fire', 'touch', 'mark', 'ward', 'glow', 'bane', 'kin', 'rise', 'mantle', 'veil'],
  },

  drow: {
    male: {
      onset:  ['Driz', 'Rizz', 'Mal', 'Viz', 'Jal', 'Khal', 'Aust', 'Zar', 'Pha', 'Ilth', 'Tur', 'Ner', 'Bel', 'Vel', 'Xan', 'Dun', 'Rel', 'Sol', 'Quen', 'Ard'],
      vowel:  ['ar', 'in', 'or', 'ul', 'en', 'ax', 'ith', 'ez', 'an', 'un'],
      coda:   ['', 'zt', 'zt', 'afein', 'ous', 'rin', 'gos', 'ynn', 'tyl', 'ryn', 'afein', 'zt', 'do', 'afein', 'ous', 'rin', 'gos', 'ynn', 'tyl', 'ryn'],
      hints:  ['Underdark-born', 'Shadow-kin', 'Spider-blessed', 'Night-heart', 'Deep-walker', 'Web-sworn', 'Dark-elf', 'Silent-blade', 'Poison-touched', 'Cavern-born'],
    },
    female: {
      onset:  ['Quen', 'Mal', 'Sos', 'Vierna', 'Ash', 'Lir', 'Pha', 'Ilth', 'Zar', 'Bel', 'Vel', 'Ner', 'Rel', 'Xan', 'Dun', 'Ard', 'Tur', 'Khal', 'Jal', 'Aust'],
      vowel:  ['thi', 'ice', 'an', 'or', 'iel', 'in', 'yl', 'ara', 'en', 'ith'],
      coda:   ['', 'ra', 'lyn', 'da', 'ss', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'na', 'ra', 'la', 'lyn', 'da'],
      hints:  ['Underdark-born', 'Shadow-kin', 'Spider-blessed', 'Night-heart', 'Deep-walker', 'Web-sworn', 'Dark-elf', 'Silent-blade', 'Poison-touched', 'Cavern-born'],
    },
    neutral: {
      onset:  ['Zar', 'Vel', 'Ner', 'Bel', 'Xan', 'Dun', 'Rel', 'Sol', 'Ard', 'Tur', 'Ilth', 'Pha', 'Khal', 'Jal', 'Aust', 'Mal', 'Sos', 'Quen', 'Lir', 'Ash'],
      vowel:  ['ar', 'in', 'or', 'ul', 'en', 'ax', 'ith', 'ez', 'an', 'un'],
      coda:   ['', 'zt', 'afein', 'ous', 'rin', 'gos', 'ynn', 'tyl', 'ryn', 'do', 'zt', 'afein', 'ous', 'rin', 'gos', 'ynn', 'tyl', 'ryn', 'do', 'zt'],
      hints:  ['Underdark-born', 'Shadow-kin', 'Spider-blessed', 'Night-heart', 'Deep-walker', 'Web-sworn', 'Dark-elf', 'Silent-blade', 'Poison-touched', 'Cavern-born'],
    },
    sOnset: ['Shadow', 'Night', 'Dark', 'Web', 'Silk', 'Venom', 'Obsid', 'Dusk', 'Crypt', 'Void', 'Spider', 'Black', 'Shade', 'Pois', 'Silent', 'Deep', 'Cave', 'Noc', 'Crim', 'Vel'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'web', 'shroud', 'fang', 'thorn', 'heart', 'blade', 'crown', 'brand', 'touch', 'mark', 'ward', 'glow', 'bane', 'kin', 'dance', 'fall', 'path'],
  },

  duergar: {
    male: {
      onset:  ['Graz', 'Thr', 'Dor', 'Skr', 'Grul', 'Brak', 'Drusk', 'Vork', 'Zulk', 'Ghor', 'Vrak', 'Throg', 'Skrag', 'Dorzn', 'Grukk', 'Threkk', 'Borzk', 'Skrull', 'Vorzk', 'Grazzk'],
      vowel:  ['a', 'u', 'az', 'uz', 'ok', 'ak', 'ug', 'og', 'uk', 'ek'],
      coda:   ['', 'zt', 'ak', 'zak', 'ug', 'll', 'k', 'za', 'arg', 'rak', 'zul', 'kk', 'gg', 'rg', 'zz', 'krak', 'grak', 'zrak', 'krag', 'graz'],
      hints:  ['Underdark-born', 'Ashen-veined', 'Bitter-heart', 'Stonegrey', 'Shadowforged', 'Deep-gnasher', 'Gloom-tempered', 'Cavern-bred', 'Iron-spite', 'Hollow-eye'],
    },
    female: {
      onset:  ['Vark', 'Kraz', 'Zulk', 'Ghorz', 'Vrak', 'Skarn', 'Thrak', 'Mogr', 'Borg', 'Vorzk', 'Skraz', 'Gruzz', 'Dorzn', 'Threk', 'Borzn', 'Skrul', 'Drus', 'Gruzz', 'Vorzn', 'Gruknz'],
      vowel:  ['a', 'u', 'az', 'uz', 'ok', 'ak', 'ug', 'og', 'uk', 'ek'],
      coda:   ['', 'ka', 'za', 'na', 'ga', 'ra', 'la', 'kka', 'gga', 'rga', 'zza', 'kna', 'gna', 'rna', 'zna', 'kra', 'gra', 'zra', 'kla', 'gla'],
      hints:  ['Underdark-born', 'Ashen-veined', 'Bitter-heart', 'Stonegrey', 'Shadowforged', 'Deep-gnasher', 'Gloom-tempered', 'Cavern-bred', 'Iron-spite', 'Hollow-eye'],
    },
    neutral: {
      onset:  ['Vrox', 'Skarn', 'Druz', 'Grak', 'Thraz', 'Bork', 'Skraz', 'Dorn', 'Vrak', 'Gruz', 'Throk', 'Skrul', 'Drak', 'Vorz', 'Grax', 'Thruk', 'Skrax', 'Drux', 'Vrax', 'Graz'],
      vowel:  ['a', 'u', 'az', 'uz', 'ok', 'ak', 'ug', 'og', 'uk', 'ek'],
      coda:   ['', 'x', 'rn', 'z', 'k', 'rg', 'kk', 'gg', 'n', 'g', 'rk', 'zk', 'gk', 'rz', 'gz', 'kz', 'ng', 'nk', 'nz', 'nx'],
      hints:  ['Underdark-born', 'Ashen-veined', 'Bitter-heart', 'Stonegrey', 'Shadowforged', 'Deep-gnasher', 'Gloom-tempered', 'Cavern-bred', 'Iron-spite', 'Hollow-eye'],
    },
    sOnset: ['Ash', 'Grey', 'Dark', 'Void', 'Grim', 'Bleak', 'Dust', 'Iron', 'Blight', 'Rust', 'Shadow', 'Gloom', 'Cold', 'Stone', 'Deep', 'Bitter', 'Dusk', 'Grit', 'Salt', 'Soot'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'stone', 'born', 'delve', 'shroud', 'hammer', 'thorn', 'heart', 'blight', 'vein', 'brand', 'touch', 'mark', 'ward', 'fist', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  dwarven: {
    male: {
      onset:  ['Bol', 'Thor', 'Dur', 'Krum', 'Vald', 'Bron', 'Snor', 'Rolf', 'Mork', 'Hel', 'Bald', 'Grim', 'Vond', 'Dolg', 'Brul', 'Thok', 'Gorv', 'Skaf', 'Bruk', 'Torv'],
      vowel:  ['a', 'u', 'o', 'un', 'ak', 'ok', 'in', 'im', 'ar', 'or'],
      coda:   ['grin', 'dak', 'bar', 'rak', 'vik', 'gar', 'keld', 'drak', 'din', 'nar', 'kon', 'dul', 'bur', 'fen', 'mak', 'bak', 'zak', 'har', 'tar', 'sar', ''],
      hints:  ['Stone-fist', 'Forge-born', 'Deep-axe', 'Grudgebearer', 'Ironback', 'Clanhammer', 'Gold-vein', 'Rune-axe', 'Tunnel-king', 'Fire-anvil'],
    },
    female: {
      onset:  ['Gun', 'Bron', 'Dag', 'Bryn', 'Sig', 'Hel', 'Thor', 'Grim', 'Dur', 'Vald', 'Mork', 'Ulv', 'Skaf', 'Rolf', 'Korn', 'Dag', 'Thrin', 'Vord', 'Bald', 'Grims'],
      vowel:  ['a', 'u', 'o', 'i', 'da', 'ra', 'na', 'ka', 'ga', 'sa'],
      coda:   ['', 'ra', 'na', 'da', 'ka', 'ga', 'sa', 'nda', 'rda', 'kda', 'gda', 'sda', 'ldra', 'ndra', 'rdra', 'kdra', 'gdra', 'sdra', 'la', 'ma'],
      hints:  ['Stone-fist', 'Forge-born', 'Deep-axe', 'Grudgebearer', 'Ironback', 'Clanhammer', 'Gold-vein', 'Rune-axe', 'Tunnel-king', 'Fire-anvil'],
    },
    neutral: {
      onset:  ['Dur', 'Ston', 'Veld', 'Brak', 'Thrik', 'Grun', 'Durnk', 'Skeld', 'Mork', 'Helm', 'Torn', 'Volk', 'Greld', 'Thunk', 'Durk', 'Beld', 'Snork', 'Grunk', 'Threk', 'Meld'],
      vowel:  ['a', 'u', 'o', 'i', 'in', 'an', 'un', 'on', 'ar', 'or'],
      coda:   ['', 'k', 'n', 'r', 'l', 'g', 'm', 'b', 'd', 'f', 'rn', 'ld', 'nd', 'rd', 'lk', 'nk', 'rk', 'lm', 'nm', 'rm'],
      hints:  ['Stone-fist', 'Forge-born', 'Deep-axe', 'Grudgebearer', 'Ironback', 'Clanhammer', 'Gold-vein', 'Rune-axe', 'Tunnel-king', 'Fire-anvil'],
    },
    sOnset: ['Iron', 'Stone', 'Copper', 'Deep', 'Gold', 'Axe', 'Hammer', 'Flint', 'Grudge', 'Rune', 'Forge', 'Fire', 'Coal', 'Mithral', 'Anvil', 'Tun', 'Keg', 'Cask', 'Ore', 'Vein'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'fist', 'born', 'delver', 'beard', 'hammer', 'back', 'heart', 'brow', 'crown', 'brand', 'touch', 'mark', 'ward', 'belly', 'bane', 'kin', 'fall', 'axe', 'stone'],
  },

  eladrin: {
    male: {
      onset:  ['Aer', 'Cal', 'Eld', 'Faer', 'Gal', 'Ith', 'Lyr', 'Mith', 'Naer', 'Oel', 'Phaer', 'Quel', 'Raer', 'Syl', 'Thaer', 'Uel', 'Vaer', 'Wael', 'Xael', 'Yael'],
      vowel:  ['ael', 'iel', 'uer', 'oer', 'aer', 'iel', 'uel', 'ael', 'ier', 'oel'],
      coda:   ['', 'ith', 'ath', 'eth', 'oth', 'uth', 'iel', 'ael', 'uel', 'oel', 'aer', 'ier', 'uer', 'oer', 'eer', 'ar', 'er', 'ir', 'or', 'ur'],
      hints:  ['Season-touched', 'Fey-born', 'Feywild-kin', 'Court-sworn', 'Spring-heart', 'Summer-born', 'Autumn-touched', 'Winter-born', 'Twilight-elf', 'Star-court'],
    },
    female: {
      onset:  ['Aer', 'Cael', 'Eld', 'Faer', 'Gael', 'Ith', 'Lyr', 'Mith', 'Naer', 'Oel', 'Phaer', 'Quel', 'Raer', 'Syl', 'Thaer', 'Uel', 'Vaer', 'Wael', 'Xael', 'Yael'],
      vowel:  ['iae', 'iel', 'aer', 'uel', 'oel', 'iael', 'uael', 'oael', 'iuel', 'ouel'],
      coda:   ['', 'na', 'la', 'ra', 'tha', 'nia', 'lia', 'ria', 'thia', 'niel', 'liel', 'riel', 'thiel', 'nael', 'lael', 'rael', 'thael', 'nuel', 'luel', 'ruel'],
      hints:  ['Season-touched', 'Fey-born', 'Feywild-kin', 'Court-sworn', 'Spring-heart', 'Summer-born', 'Autumn-touched', 'Winter-born', 'Twilight-elf', 'Star-court'],
    },
    neutral: {
      onset:  ['Aer', 'Cael', 'Eld', 'Faer', 'Gael', 'Ith', 'Lyr', 'Mith', 'Naer', 'Oel', 'Phaer', 'Quel', 'Raer', 'Syl', 'Thaer', 'Uel', 'Vaer', 'Wael', 'Xael', 'Yael'],
      vowel:  ['ael', 'iel', 'uer', 'oer', 'aer', 'uel', 'oel', 'ier', 'eer', 'uael'],
      coda:   ['', 'ith', 'ath', 'eth', 'oth', 'iel', 'ael', 'uel', 'oel', 'aer', 'ier', 'uer', 'oer', 'ar', 'er', 'ir', 'or', 'ur', 'in', 'an'],
      hints:  ['Season-touched', 'Fey-born', 'Feywild-kin', 'Court-sworn', 'Spring-heart', 'Summer-born', 'Autumn-touched', 'Winter-born', 'Twilight-elf', 'Star-court'],
    },
    sOnset: ['Spring', 'Summer', 'Autumn', 'Winter', 'Dawn', 'Dusk', 'Fey', 'Star', 'Moon', 'Sun', 'Silver', 'Gold', 'Crystal', 'Mist', 'Bloom', 'Frost', 'Storm', 'Wind', 'Rain', 'Snow'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'court', 'bloom', 'petal', 'thorn', 'heart', 'song', 'crown', 'grace', 'touch', 'mark', 'ward', 'glow', 'blossom', 'kin', 'rise', 'fall', 'path'],
  },

  gnome: {
    male: {
      onset:  ['Bix', 'Zook', 'Als', 'Dim', 'Gim', 'Orr', 'Sin', 'Kel', 'Poc', 'Fib', 'Wren', 'Glim', 'Twick', 'Cogs', 'Sproc', 'Fizz', 'Ratch', 'Nood', 'Sprk', 'Crank'],
      vowel:  ['o', 'i', 'a', 'oo', 'y', 'e', 'u', 'oo', 'ee', 'ie'],
      coda:   ['by', 'n', 'ston', 'ble', 'ryn', 'dri', 'len', 'wick', 'worth', 'spring', 'ford', 'hatch', 'wrench', 'bolt', 'cog', 'gear', 'spring', 'valve', 'shaft', 'pin', ''],
      hints:  ['Tinkerer', 'Sparkcaster', 'Glyphweaver', 'Clockwarden', 'Gadgetsmith', 'Spell-tinker', 'Runewright', 'Mirthweaver', 'Prismwright', 'Lampwright'],
    },
    female: {
      onset:  ['Namf', 'Wrenn', 'Ellyw', 'Tav', 'Lill', 'Wayw', 'Zann', 'Mill', 'Fizzl', 'Glind', 'Trink', 'Nimbl', 'Spark', 'Whisp', 'Glitt', 'Dazzl', 'Twink', 'Prism', 'Gadg', 'Widg'],
      vowel:  ['a', 'i', 'o', 'oo', 'y', 'e', 'u', 'ee', 'ie', 'oo'],
      coda:   ['', 'oodle', 'ocket', 'ita', 'i', 'ie', 'le', 'et', 'a', 'y', 'na', 'ra', 'la', 'da', 'ka', 'ga', 'sa', 'ta', 'va', 'wa'],
      hints:  ['Tinkerer', 'Sparkcaster', 'Glyphweaver', 'Clockwarden', 'Gadgetsmith', 'Spell-tinker', 'Runewright', 'Mirthweaver', 'Prismwright', 'Lampwright'],
    },
    neutral: {
      onset:  ['Poc', 'Glim', 'Sproc', 'Cog', 'Pip', 'Zap', 'Nib', 'Whir', 'Buzz', 'Click', 'Tick', 'Snap', 'Flux', 'Blink', 'Rune', 'Glyph', 'Spark', 'Arc', 'Volt', 'Beam'],
      vowel:  ['o', 'i', 'a', 'oo', 'y', 'e', 'u', 'ee', 'ie', 'oo'],
      coda:   ['', 'k', 'n', 'r', 'l', 'g', 'm', 'b', 'd', 'f', 'et', 'it', 'at', 'ot', 'ut', 'ick', 'ack', 'eck', 'ock', 'uck'],
      hints:  ['Tinkerer', 'Sparkcaster', 'Glyphweaver', 'Clockwarden', 'Gadgetsmith', 'Spell-tinker', 'Runewright', 'Mirthweaver', 'Prismwright', 'Lampwright'],
    },
    sOnset: ['Cog', 'Spark', 'Gear', 'Spring', 'Bolt', 'Rune', 'Glyph', 'Lamp', 'Prism', 'Clock', 'Tick', 'Tink', 'Wrench', 'Valve', 'Shaft', 'Pin', 'Cam', 'Crank', 'Lever', 'Piston'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['worth', 'wick', 'ford', 'hatch', 'spring', 'wright', 'smith', 'heart', 'bottom', 'crown', 'brand', 'touch', 'mark', 'ward', 'works', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  halfelf: {
    male: {
      onset:  ['Aer', 'Bran', 'Cor', 'Dal', 'Eld', 'Fal', 'Gar', 'Hal', 'Ind', 'Jar', 'Kel', 'Lan', 'Mar', 'Nar', 'Oed', 'Par', 'Quel', 'Ran', 'Sel', 'Tal'],
      vowel:  ['an', 'in', 'or', 'en', 'ar', 'el', 'ith', 'on', 'un', 'ir'],
      coda:   ['', 'ath', 'eth', 'ith', 'oth', 'uth', 'ael', 'iel', 'uel', 'oel', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un'],
      hints:  ['Two-blooded', 'Bridge-born', 'Between-worlds', 'Mixed-heart', 'Half-kin', 'Twice-blessed', 'Human-elf', 'Wanderer-born', 'Dual-heart', 'Heritage-blend'],
    },
    female: {
      onset:  ['Aer', 'Bran', 'Cor', 'Dal', 'Eld', 'Fal', 'Gar', 'Hal', 'Ind', 'Jar', 'Kel', 'Lan', 'Mar', 'Nar', 'Oed', 'Par', 'Quel', 'Ran', 'Sel', 'Tal'],
      vowel:  ['ia', 'ina', 'ella', 'ara', 'iel', 'ila', 'ena', 'ael', 'ora', 'ula'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'ine', 'ora', 'ara', 'ena', 'ula', 'iva'],
      hints:  ['Two-blooded', 'Bridge-born', 'Between-worlds', 'Mixed-heart', 'Half-kin', 'Twice-blessed', 'Human-elf', 'Wanderer-born', 'Dual-heart', 'Heritage-blend'],
    },
    neutral: {
      onset:  ['Aer', 'Bran', 'Cor', 'Dal', 'Eld', 'Fal', 'Gar', 'Hal', 'Ind', 'Jar', 'Kel', 'Lan', 'Mar', 'Nar', 'Oed', 'Par', 'Quel', 'Ran', 'Sel', 'Tal'],
      vowel:  ['an', 'in', 'or', 'en', 'ar', 'el', 'ith', 'on', 'un', 'ir'],
      coda:   ['', 'ath', 'eth', 'ith', 'oth', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un', 'ael', 'iel', 'uel', 'oel', 'uth'],
      hints:  ['Two-blooded', 'Bridge-born', 'Between-worlds', 'Mixed-heart', 'Half-kin', 'Twice-blessed', 'Human-elf', 'Wanderer-born', 'Dual-heart', 'Heritage-blend'],
    },
    sOnset: ['Silver', 'Dawn', 'Star', 'Moon', 'Sun', 'Wind', 'River', 'Forest', 'Mist', 'Dusk', 'Twin', 'Bridge', 'Cross', 'Blend', 'Mixed', 'Dual', 'Two', 'Half', 'Between', 'Border'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'blood', 'heart', 'song', 'thorn', 'grace', 'glow', 'crown', 'brand', 'touch', 'mark', 'ward', 'bloom', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  halfling: {
    male: {
      onset:  ['Cor', 'Tom', 'Fin', 'Yon', 'Jim', 'Ald', 'Tib', 'Per', 'Odo', 'Bun', 'Fal', 'Dro', 'Mil', 'Tob', 'Ham', 'Lar', 'Fos', 'Merr', 'Bim', 'Will'],
      vowel:  ['a', 'i', 'o', 'e', 'y', 'u', 'oo', 'ee', 'ay', 'ey'],
      coda:   ['win', 'as', 'wick', 'der', 'ble', 'rick', 'ble', 'rin', 'do', 'go', 'co', 'go', 'lo', 'old', 'fast', 'go', 'co', 'ric', 'ble', 'lum', ''],
      hints:  ['Lightfoot', 'Hearthfire', 'Quickstep', 'Bramble', 'Luckpenny', 'Meadow-run', 'Burrow-born', 'Pipesmoke', 'Field-born', 'Garden-tender'],
    },
    female: {
      onset:  ['Lidd', 'Ros', 'Beld', 'Wren', 'Nell', 'Marig', 'Ros', 'Pans', 'Dais', 'Belladonn', 'Primul', 'Esmerald', 'Lil', 'Peon', 'Rub', 'Peregin', 'Camel', 'Lavin', 'Cor', 'Hild'],
      vowel:  ['a', 'ie', 'a', '', 'a', 'old', 'ie', 'y', 'y', 'a', 'a', 'a', 'y', 'y', 'y', 'a', 'ia', 'ia', 'al', 'a'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'na', 'ra', 'la', 'lyn', 'da', 'ss'],
      hints:  ['Lightfoot', 'Hearthfire', 'Quickstep', 'Bramble', 'Luckpenny', 'Meadow-run', 'Burrow-born', 'Pipesmoke', 'Field-born', 'Garden-tender'],
    },
    neutral: {
      onset:  ['Sabl', 'Merr', 'Pip', 'Rob', 'Brin', 'Ash', 'Clov', 'Reed', 'Flin', 'Brook', 'Dew', 'Briar', 'Thistl', 'Grain', 'Val', 'Wick', 'Soot', 'Cress', 'Burr', 'Nook'],
      vowel:  ['a', 'e', 'i', 'o', 'y', 'u', 'oo', 'ee', 'ay', 'ey'],
      coda:   ['', 'le', 'y', 'in', 'er', 'ow', 'ey', 'ie', 'ey', 'en', 'on', 'an', 'un', 'in', 'ot', 'at', 'et', 'it', 'ut', 'e'],
      hints:  ['Lightfoot', 'Hearthfire', 'Quickstep', 'Bramble', 'Luckpenny', 'Meadow-run', 'Burrow-born', 'Pipesmoke', 'Field-born', 'Garden-tender'],
    },
    sOnset: ['Good', 'Thistle', 'Light', 'Copper', 'Boulder', 'Meadow', 'Under', 'Pipe', 'River', 'Bramble', 'Warm', 'Golden', 'Merry', 'Green', 'Bright', 'Sweet', 'Clover', 'Honey', 'Lucky', 'Happy'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['barrel', 'wick', 'foot', 'kettle', 'brook', 'grain', 'hill', 'whistle', 'stone', 'buckle', 'hearth', 'touch', 'mark', 'ward', 'belly', 'bane', 'kin', 'toe', 'bottom', 'path'],
  },

  halforc: {
    male: {
      onset:  ['Gr', 'Mor', 'Urz', 'Kr', 'Thok', 'Vr', 'Gor', 'Tusk', 'Bragh', 'Krug', 'Thog', 'Grul', 'Mork', 'Urzak', 'Krug', 'Thogr', 'Vrakk', 'Gorkak', 'Brugg', 'Krugg'],
      vowel:  ['a', 'u', 'o', 'og', 'ak', 'ug', 'ok', 'ag', 'uk', 'ek'],
      coda:   ['ax', 'g', 'zog', 'ark', 'rk', 'ash', 'k', 'ga', 'ak', 'kk', 'gg', 'rg', 'zz', 'krak', 'grak', 'zrak', 'krag', 'graz', 'nakk', 'gakk', ''],
      hints:  ['Bone-crusher', 'Warcaller', 'Ironblood', 'Scarred', 'Half-blood', 'Stoneskin', 'Ashwalker', 'Bloodcrown', 'Battle-born', 'Iron-jaw'],
    },
    female: {
      onset:  ['Dash', 'Bren', 'Yulg', 'Durg', 'Nal', 'Olgr', 'Grak', 'Morg', 'Thurk', 'Vrakk', 'Nark', 'Breg', 'Drak', 'Urz', 'Gork', 'Thrakk', 'Grull', 'Morkk', 'Urgg', 'Krugg'],
      vowel:  ['a', 'u', 'o', 'og', 'ak', 'ug', 'ok', 'ag', 'uk', 'ek'],
      coda:   ['', 'sha', 'na', 'ga', 'ra', 'a', 'ka', 'kka', 'gga', 'rga', 'zza', 'kna', 'gna', 'rna', 'zna', 'kra', 'gra', 'zra', 'kla', 'gla'],
      hints:  ['Bone-crusher', 'Warcaller', 'Ironblood', 'Scarred', 'Half-blood', 'Stoneskin', 'Ashwalker', 'Bloodcrown', 'Battle-born', 'Iron-jaw'],
    },
    neutral: {
      onset:  ['Grix', 'Mork', 'Urg', 'Krak', 'Thok', 'Vrax', 'Gruk', 'Brak', 'Thrug', 'Mrak', 'Urak', 'Grak', 'Bruk', 'Krux', 'Thrak', 'Morx', 'Urkax', 'Grukax', 'Krakk', 'Thokk'],
      vowel:  ['a', 'u', 'o', 'og', 'ak', 'ug', 'ok', 'ag', 'uk', 'ek'],
      coda:   ['', 'x', 'k', 'g', 'r', 'n', 'rk', 'gk', 'rg', 'gz', 'ng', 'nk', 'nz', 'nx', 'rz', 'gz', 'kz', 'xk', 'xg', 'xr'],
      hints:  ['Bone-crusher', 'Warcaller', 'Ironblood', 'Scarred', 'Half-blood', 'Stoneskin', 'Ashwalker', 'Bloodcrown', 'Battle-born', 'Iron-jaw'],
    },
    sOnset: ['Bone', 'Blood', 'Iron', 'Ash', 'Gore', 'Skull', 'Stone', 'Death', 'Rage', 'Dark', 'Grim', 'War', 'Scar', 'Tusk', 'Grim', 'Fang', 'Blade', 'Axe', 'Hate', 'Bane'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['crusher', 'fist', 'born', 'hide', 'brand', 'jaw', 'thorn', 'heart', 'brow', 'crown', 'brand', 'touch', 'mark', 'ward', 'belly', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  human: {
    male: {
      onset:  ['Ald', 'Bran', 'Cor', 'Dal', 'Edd', 'Gar', 'Hal', 'Jem', 'Keld', 'Lan', 'Mar', 'Ned', 'Orr', 'Per', 'Ran', 'Ser', 'Tal', 'Ull', 'Var', 'Wil'],
      vowel:  ['an', 'in', 'or', 'en', 'ar', 'el', 'ith', 'on', 'un', 'ir'],
      coda:   ['', 'ric', 'ald', 'win', 'ton', 'ford', 'wick', 'ham', 'ley', 'ston', 'er', 'ar', 'or', 'an', 'en', 'on', 'in', 'un', 'eth', 'ath'],
      hints:  ['Common-born', 'Farmstead', 'Townsfolk', 'Road-worn', 'Hearth-bound', 'Field-born', 'Market-kin', 'Trade-road', 'Adventurer', 'Free-born'],
    },
    female: {
      onset:  ['Alic', 'Beth', 'Cath', 'Dor', 'Edit', 'Fion', 'Gwen', 'Hild', 'Isa', 'Jan', 'Kath', 'Lil', 'Mar', 'Nan', 'Oph', 'Pru', 'Rob', 'Sar', 'Tam', 'Vic'],
      vowel:  ['a', 'ie', 'rine', 'a', 'h', 'na', 'a', 'a', 'bel', 'ice', 'leen', 'ia', 'y', 'cy', 'elia', 'ella', 'erta', 'ah', 'sin', 'toria'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'na', 'ra', 'la', 'lyn', 'da', 'ss'],
      hints:  ['Common-born', 'Farmstead', 'Townsfolk', 'Road-worn', 'Hearth-bound', 'Field-born', 'Market-kin', 'Trade-road', 'Adventurer', 'Free-born'],
    },
    neutral: {
      onset:  ['Ash', 'Bly', 'Cade', 'Drew', 'El', 'Fern', 'Glen', 'Hay', 'Ind', 'Jay', 'Kel', 'Lark', 'Marsh', 'North', 'Oak', 'Page', 'Quin', 'Ren', 'Sage', 'Tal'],
      vowel:  ['an', 'in', 'or', 'en', 'ar', 'el', 'ith', 'on', 'un', 'ir'],
      coda:   ['', 'ley', 'ton', 'ford', 'wick', 'ham', 'ston', 'er', 'ar', 'or', 'an', 'en', 'on', 'in', 'un', 'eth', 'ath', 'ric', 'ald', 'win'],
      hints:  ['Common-born', 'Farmstead', 'Townsfolk', 'Road-worn', 'Hearth-bound', 'Field-born', 'Market-kin', 'Trade-road', 'Adventurer', 'Free-born'],
    },
    sOnset: ['Black', 'Brown', 'White', 'Green', 'Red', 'Grey', 'Gold', 'Silver', 'Iron', 'Stone', 'Wood', 'Hill', 'Dale', 'Brook', 'Moor', 'Field', 'North', 'South', 'East', 'West'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['wick', 'ton', 'ford', 'ham', 'ley', 'ston', 'wood', 'field', 'brook', 'moor', 'gate', 'bridge', 'burg', 'shire', 'land', 'mark', 'ward', 'born', 'fall', 'path'],
  },

  khorvaire: {
    male: {
      onset:  ['Aer', 'Cal', 'Cor', 'Dal', 'El', 'Fal', 'Gal', 'Hal', 'Ith', 'Kel', 'Lyr', 'Mar', 'Nar', 'Oel', 'Phar', 'Quel', 'Raer', 'Syl', 'Thal', 'Vaer'],
      vowel:  ['ael', 'iel', 'and', 'ith', 'or', 'en', 'in', 'ar', 'on', 'un'],
      coda:   ['', 'ith', 'ath', 'eth', 'oth', 'ael', 'iel', 'uel', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un', 'rath', 'reth'],
      hints:  ['Khorvaire-born', 'House-kin', 'Marked-blood', 'Dragonmark', 'Bound-oath', 'City-born', 'Trade-sworn', 'Five-Nations', 'Covenant-kin', 'Passage-born'],
    },
    female: {
      onset:  ['Aer', 'Cal', 'Cor', 'Dal', 'El', 'Fal', 'Gal', 'Hal', 'Ith', 'Kel', 'Lyr', 'Mar', 'Nar', 'Oel', 'Phar', 'Quel', 'Raer', 'Syl', 'Thal', 'Vaer'],
      vowel:  ['ia', 'iel', 'ina', 'ara', 'iel', 'ila', 'ena', 'ael', 'ora', 'ula'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'ine', 'ora', 'ara', 'ena', 'ula', 'iva'],
      hints:  ['Khorvaire-born', 'House-kin', 'Marked-blood', 'Dragonmark', 'Bound-oath', 'City-born', 'Trade-sworn', 'Five-Nations', 'Covenant-kin', 'Passage-born'],
    },
    neutral: {
      onset:  ['Aer', 'Cal', 'Cor', 'Dal', 'El', 'Fal', 'Gal', 'Hal', 'Ith', 'Kel', 'Lyr', 'Mar', 'Nar', 'Oel', 'Phar', 'Quel', 'Raer', 'Syl', 'Thal', 'Vaer'],
      vowel:  ['ael', 'iel', 'and', 'ith', 'or', 'en', 'in', 'ar', 'on', 'un'],
      coda:   ['', 'ith', 'ath', 'eth', 'oth', 'ael', 'iel', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un', 'rath', 'reth', 'lith'],
      hints:  ['Khorvaire-born', 'House-kin', 'Marked-blood', 'Dragonmark', 'Bound-oath', 'City-born', 'Trade-sworn', 'Five-Nations', 'Covenant-kin', 'Passage-born'],
    },
    sOnset: ['Storm', 'Wind', 'Rain', 'Mist', 'Cloud', 'Silver', 'Gold', 'Iron', 'Steel', 'Mark', 'House', 'Cov', 'Pact', 'Oath', 'Bond', 'Seal', 'Writ', 'Sage', 'Star', 'Moon'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'blood', 'heart', 'song', 'thorn', 'grace', 'glow', 'crown', 'brand', 'touch', 'mark', 'ward', 'bloom', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  shifter: {
    male: {
      onset:  ['Brak', 'Claw', 'Dusk', 'Fang', 'Grr', 'Howl', 'Jak', 'Kael', 'Loup', 'Mrak', 'Narr', 'Oak', 'Prr', 'Rawl', 'Skar', 'Trak', 'Ulf', 'Vrak', 'Wrak', 'Xrak'],
      vowel:  ['a', 'u', 'o', 'ar', 'ur', 'or', 'an', 'un', 'on', 'en'],
      coda:   ['', 'k', 'n', 'r', 'l', 'g', 'm', 'rk', 'nk', 'lk', 'rn', 'ln', 'gn', 'rm', 'nm', 'gm', 'rl', 'nl', 'gl', 'rg'],
      hints:  ['Beast-touched', 'Wild-heart', 'Moon-blessed', 'Hunt-born', 'Pack-sworn', 'Feral-kin', 'Shape-shifter', 'Predator-born', 'Night-runner', 'Primal-heart'],
    },
    female: {
      onset:  ['Brak', 'Claw', 'Dusk', 'Fang', 'Grr', 'Howl', 'Jak', 'Kael', 'Loup', 'Mrak', 'Narr', 'Oak', 'Prr', 'Rawl', 'Skar', 'Trak', 'Ulf', 'Vrak', 'Wrak', 'Xrak'],
      vowel:  ['a', 'u', 'o', 'ar', 'ur', 'or', 'an', 'un', 'on', 'en'],
      coda:   ['', 'ka', 'na', 'ra', 'la', 'ga', 'ma', 'rka', 'nka', 'lka', 'rna', 'lna', 'gna', 'rma', 'nma', 'gma', 'rla', 'nla', 'gla', 'rga'],
      hints:  ['Beast-touched', 'Wild-heart', 'Moon-blessed', 'Hunt-born', 'Pack-sworn', 'Feral-kin', 'Shape-shifter', 'Predator-born', 'Night-runner', 'Primal-heart'],
    },
    neutral: {
      onset:  ['Brak', 'Claw', 'Dusk', 'Fang', 'Grr', 'Howl', 'Jak', 'Kael', 'Loup', 'Mrak', 'Narr', 'Oak', 'Prr', 'Rawl', 'Skar', 'Trak', 'Ulf', 'Vrak', 'Wrak', 'Xrak'],
      vowel:  ['a', 'u', 'o', 'ar', 'ur', 'or', 'an', 'un', 'on', 'en'],
      coda:   ['', 'k', 'n', 'r', 'l', 'g', 'm', 'rk', 'nk', 'lk', 'rn', 'ln', 'gn', 'rm', 'nm', 'gm', 'rl', 'nl', 'gl', 'rg'],
      hints:  ['Beast-touched', 'Wild-heart', 'Moon-blessed', 'Hunt-born', 'Pack-sworn', 'Feral-kin', 'Shape-shifter', 'Predator-born', 'Night-runner', 'Primal-heart'],
    },
    sOnset: ['Wild', 'Feral', 'Moon', 'Hunt', 'Pack', 'Beast', 'Fang', 'Claw', 'Howl', 'Pelt', 'Mane', 'Talon', 'Prowl', 'Stalk', 'Night', 'Dark', 'Dusk', 'Blood', 'Bone', 'Ash'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['heart', 'claw', 'born', 'runner', 'blood', 'fang', 'thorn', 'mane', 'pelt', 'crown', 'brand', 'touch', 'mark', 'ward', 'howl', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  tabaxi: {
    male: {
      onset:  ['Mist', 'Blur', 'Spot', 'Cloud', 'Dusk', 'Dawn', 'Ink', 'Jade', 'Moon', 'Rust', 'Scratch', 'Soot', 'Storm', 'Swift', 'Track', 'Twitch', 'Whisker', 'Wind', 'Ash', 'Coal'],
      vowel:  [' of', ' on', ' in', ' at', ' by', ' from', ' over', ' under', ' beside', ' beyond'],
      coda:   [' the Mountain', ' the River', ' the Storm', ' the Moon', ' the Sun', ' the Stars', ' the Wind', ' the Rain', ' the Snow', ' the Fire', ' the Ice', ' the Sea', ' the Forest', ' the Plains', ' the Desert', ' the Swamp', ' the Night', ' the Day', ' the Mist', ' the Shadow'],
      hints:  ['Wanderer-born', 'Curiosity-driven', 'Story-collector', 'Relic-hunter', 'Sky-watcher', 'Moon-chaser', 'River-crosser', 'Wind-follower', 'Cloud-walker', 'Storm-born'],
    },
    female: {
      onset:  ['Mist', 'Blur', 'Spot', 'Cloud', 'Dusk', 'Dawn', 'Ink', 'Jade', 'Moon', 'Rust', 'Scratch', 'Soot', 'Storm', 'Swift', 'Track', 'Twitch', 'Whisker', 'Wind', 'Ash', 'Coal'],
      vowel:  [' of', ' on', ' in', ' at', ' by', ' from', ' over', ' under', ' beside', ' beyond'],
      coda:   [' the Mountain', ' the River', ' the Storm', ' the Moon', ' the Sun', ' the Stars', ' the Wind', ' the Rain', ' the Snow', ' the Fire', ' the Ice', ' the Sea', ' the Forest', ' the Plains', ' the Desert', ' the Swamp', ' the Night', ' the Day', ' the Mist', ' the Shadow'],
      hints:  ['Wanderer-born', 'Curiosity-driven', 'Story-collector', 'Relic-hunter', 'Sky-watcher', 'Moon-chaser', 'River-crosser', 'Wind-follower', 'Cloud-walker', 'Storm-born'],
    },
    neutral: {
      onset:  ['Mist', 'Blur', 'Spot', 'Cloud', 'Dusk', 'Dawn', 'Ink', 'Jade', 'Moon', 'Rust', 'Scratch', 'Soot', 'Storm', 'Swift', 'Track', 'Twitch', 'Whisker', 'Wind', 'Ash', 'Coal'],
      vowel:  [' of', ' on', ' in', ' at', ' by', ' from', ' over', ' under', ' beside', ' beyond'],
      coda:   [' the Mountain', ' the River', ' the Storm', ' the Moon', ' the Sun', ' the Stars', ' the Wind', ' the Rain', ' the Snow', ' the Fire', ' the Ice', ' the Sea', ' the Forest', ' the Plains', ' the Desert', ' the Swamp', ' the Night', ' the Day', ' the Mist', ' the Shadow'],
      hints:  ['Wanderer-born', 'Curiosity-driven', 'Story-collector', 'Relic-hunter', 'Sky-watcher', 'Moon-chaser', 'River-crosser', 'Wind-follower', 'Cloud-walker', 'Storm-born'],
    },
    sOnset: ['Quick', 'Swift', 'Silent', 'Soft', 'Sharp', 'Keen', 'Bright', 'Dark', 'Spotted', 'Striped', 'Sleek', 'Lithe', 'Agile', 'Nimble', 'Fleet', 'Sly', 'Wily', 'Clever', 'Cunning', 'Wise'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['paw', 'claw', 'born', 'runner', 'whisker', 'fang', 'thorn', 'tail', 'stride', 'crown', 'brand', 'touch', 'mark', 'ward', 'leap', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  tiefling: {
    male: {
      onset:  ['Mor', 'Cal', 'Akm', 'Bar', 'Had', 'Kai', 'Mort', 'Skam', 'Riv', 'Zar', 'Corv', 'Malach', 'Thad', 'Car', 'Sev', 'Pyr', 'Zar', 'Malv', 'Dar', 'Tarq'],
      vowel:  ['e', 'i', 'a', 'o', 'iel', 'ax', 'en', 'on', 'us', 'an'],
      coda:   ['', 'decai', 'ix', 'enos', 'akas', 'ar', 'ron', 'hos', 'os', 'n', 'ius', 'ian', 'ax', 'ek', 'or', 'us', 'ev', 'ok', 'in', 'ul'],
      hints:  ['Hellbound', 'Ember-born', 'Shadowtail', 'Brimstone', 'Smokewraith', 'Silvertongue', 'Ashsoul', 'Hellmarked', 'Voidwarden', 'Brand-touched'],
    },
    female: {
      onset:  ['Lil', 'Dam', 'Ther', 'Vex', 'Nyx', 'Zar', 'Sev', 'Xar', 'Malv', 'Pyr', 'Luxe', 'Sera', 'Nyx', 'Zar', 'Malv', 'Pyr', 'Dar', 'Tarq', 'Nerv', 'Corv'],
      vowel:  ['ia', 'aia', 'ai', '', 'x', 'iel', 'yn', 'a', 'exia', 'ith'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'na', 'ra', 'la', 'lyn', 'da', 'ss'],
      hints:  ['Hellbound', 'Ember-born', 'Shadowtail', 'Brimstone', 'Smokewraith', 'Silvertongue', 'Ashsoul', 'Hellmarked', 'Voidwarden', 'Brand-touched'],
    },
    neutral: {
      onset:  ['Riv', 'Nyx', 'Vex', 'Zar', 'Mav', 'Pyr', 'Dar', 'Var', 'Ner', 'Corv', 'Xav', 'Mav', 'Pyr', 'Darv', 'Tarv', 'Nerv', 'Corvv', 'Xavv', 'Mavv', 'Pyrr'],
      vowel:  ['e', 'i', 'a', 'o', 'iel', 'ax', 'en', 'on', 'us', 'an'],
      coda:   ['', 'n', 'x', 'r', 'l', 'g', 'm', 'ex', 'ax', 'ox', 'ux', 'ix', 'en', 'an', 'on', 'un', 'in', 'iel', 'ael', 'uel'],
      hints:  ['Hellbound', 'Ember-born', 'Shadowtail', 'Brimstone', 'Smokewraith', 'Silvertongue', 'Ashsoul', 'Hellmarked', 'Voidwarden', 'Brand-touched'],
    },
    sOnset: ['Ember', 'Ash', 'Dark', 'Void', 'Crim', 'Noir', 'Pale', 'Hell', 'Twi', 'Obsid', 'Rav', 'Mort', 'Noc', 'Vel', 'Goth', 'Shad', 'Brim', 'Smok', 'Cin', 'Brand'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'hunger', 'shroud', 'fang', 'thorn', 'heart', 'bloom', 'crown', 'brand', 'touch', 'mark', 'ward', 'glow', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  warforged: {
    male: {
      onset:  ['Bas', 'Cal', 'Dur', 'Forg', 'Gal', 'Helm', 'Iron', 'Jud', 'Kron', 'Lith', 'Man', 'Null', 'Obs', 'Pyr', 'Ram', 'Sieg', 'Tit', 'Ultr', 'Vang', 'War'],
      vowel:  ['i', 'a', 'e', 'o', 'id', 'an', 'on', 'en', 'in', 'un'],
      coda:   ['', 'tion', 'iburn', 'veil', 'rek', 'ge', 'vil', 'x', 'itas', 'ssis', 'ford', 'ment', 'ance', 'ence', 'ion', 'ism', 'ist', 'ite', 'ive', 'ize'],
      hints:  ['Combat unit', 'Sentinel', 'Shield-line', 'Purpose-built', 'Stalwart', 'Forged-true', 'Survivor', 'Seeker', 'Watcher', 'First-made'],
    },
    female: {
      onset:  ['Aur', 'Balt', 'Clar', 'Dawn', 'Emer', 'Fort', 'Grac', 'Har', 'Illu', 'Just', 'Kin', 'Lib', 'Mer', 'Nob', 'Omn', 'Prov', 'Quer', 'Res', 'Sol', 'Truth'],
      vowel:  ['a', 'i', 'e', 'o', 'ia', 'ine', 'ara', 'ella', 'ora', 'ula'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'ance', 'ence', 'ion', 'ism', 'ist', 'ite'],
      hints:  ['Combat unit', 'Sentinel', 'Shield-line', 'Purpose-built', 'Stalwart', 'Forged-true', 'Survivor', 'Seeker', 'Watcher', 'First-made'],
    },
    neutral: {
      onset:  ['Null', 'Crux', 'Rem', 'Ver', 'Chas', 'Anv', 'Bas', 'Bul', 'Cit', 'Fort', 'Gar', 'Ram', 'Par', 'Bar', 'Emb', 'Mer', 'Pali', 'Cren', 'Mach', 'Count'],
      vowel:  ['i', 'a', 'e', 'o', 'id', 'an', 'on', 'en', 'in', 'un'],
      coda:   ['', '-4', '-7', '-3', '-9', '-1', '-2', '-5', '-6', '-8', 'ex', 'ax', 'ox', 'ux', 'ix', 'en', 'an', 'on', 'un', 'in'],
      hints:  ['Combat unit', 'Sentinel', 'Shield-line', 'Purpose-built', 'Stalwart', 'Forged-true', 'Survivor', 'Seeker', 'Watcher', 'First-made'],
    },
    sOnset: ['Iron', 'Steel', 'Brass', 'Bronze', 'Copper', 'Nickel', 'Cobalt', 'Forge', 'Mold', 'Cast', 'Weld', 'Bolt', 'Gear', 'Plate', 'Chain', 'Mail', 'Shield', 'Sword', 'Axe', 'Mace'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['frame', 'core', 'born', 'forge', 'mark', 'seal', 'thorn', 'heart', 'hull', 'crown', 'brand', 'touch', 'plate', 'ward', 'works', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

  woodelf: {
    male: {
      onset:  ['Aer', 'Bran', 'Cel', 'Dal', 'El', 'Fal', 'Gal', 'Hal', 'Ith', 'Kel', 'Lyr', 'Mar', 'Nar', 'Oel', 'Phar', 'Quel', 'Raer', 'Syl', 'Thal', 'Vaer'],
      vowel:  ['an', 'in', 'or', 'en', 'ar', 'el', 'ith', 'on', 'un', 'ir'],
      coda:   ['', 'ath', 'eth', 'ith', 'oth', 'ael', 'iel', 'uel', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un', 'rath', 'reth'],
      hints:  ['Forest-born', 'Wood-heart', 'Leaf-touched', 'Tree-sworn', 'Wild-elf', 'Branch-walker', 'Canopy-born', 'Root-kin', 'Glade-sworn', 'Bark-touched'],
    },
    female: {
      onset:  ['Aer', 'Bran', 'Cel', 'Dal', 'El', 'Fal', 'Gal', 'Hal', 'Ith', 'Kel', 'Lyr', 'Mar', 'Nar', 'Oel', 'Phar', 'Quel', 'Raer', 'Syl', 'Thal', 'Vaer'],
      vowel:  ['ia', 'iel', 'ina', 'ara', 'iel', 'ila', 'ena', 'ael', 'ora', 'ula'],
      coda:   ['', 'na', 'ra', 'la', 'ne', 'th', 'ia', 'el', 'in', 'an', 'a', 'ine', 'one', 'ette', 'ine', 'ora', 'ara', 'ena', 'ula', 'iva'],
      hints:  ['Forest-born', 'Wood-heart', 'Leaf-touched', 'Tree-sworn', 'Wild-elf', 'Branch-walker', 'Canopy-born', 'Root-kin', 'Glade-sworn', 'Bark-touched'],
    },
    neutral: {
      onset:  ['Aer', 'Bran', 'Cel', 'Dal', 'El', 'Fal', 'Gal', 'Hal', 'Ith', 'Kel', 'Lyr', 'Mar', 'Nar', 'Oel', 'Phar', 'Quel', 'Raer', 'Syl', 'Thal', 'Vaer'],
      vowel:  ['an', 'in', 'or', 'en', 'ar', 'el', 'ith', 'on', 'un', 'ir'],
      coda:   ['', 'ath', 'eth', 'ith', 'oth', 'ael', 'iel', 'ar', 'er', 'ir', 'or', 'ur', 'an', 'en', 'in', 'on', 'un', 'rath', 'reth', 'lith'],
      hints:  ['Forest-born', 'Wood-heart', 'Leaf-touched', 'Tree-sworn', 'Wild-elf', 'Branch-walker', 'Canopy-born', 'Root-kin', 'Glade-sworn', 'Bark-touched'],
    },
    sOnset: ['Oak', 'Ash', 'Elm', 'Yew', 'Pine', 'Birch', 'Maple', 'Cedar', 'Willow', 'Rowan', 'Leaf', 'Root', 'Branch', 'Bark', 'Moss', 'Vine', 'Fern', 'Thorn', 'Briar', 'Glade'],
    sVowel: ['en', 'in', 'an', 'or', 'ar', 'ia', 'ion', 'ic', 'al', 'iel'],
    sCoda:  ['mantle', 'veil', 'born', 'walker', 'heart', 'song', 'thorn', 'grace', 'glow', 'crown', 'brand', 'touch', 'mark', 'ward', 'bloom', 'bane', 'kin', 'rise', 'fall', 'path'],
  },

};

// --- Build one first name from a race/gender syllable set ---

function buildName(style, gender) {
  const set = RACE_SETS[style]?.[gender] || RACE_SETS[style]?.neutral;
  if (!set) return ['Unknown', 'Unknown'];

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // Tabaxi names are descriptive phrases — special handling
  if (style === 'tabaxi') {
    const name = pick(set.onset) + pick(set.vowel) + pick(set.coda);
    return [name, pick(set.hints)];
  }

  // Standard: onset + vowel + optional coda, 2–3 syllables
  const syllableCount = Math.random() < 0.45 ? 2 : 3;
  let name = '';
  for (let i = 0; i < syllableCount; i++) {
    name += pick(set.onset);
    name += pick(set.vowel);
    if (i < syllableCount - 1 || Math.random() < 0.45) {
      name += pick(set.coda);
    }
  }

  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  name = name.replace(/-([a-z0-9])/g, (_, c) => '-' + c.toUpperCase());

  return [name, pick(set.hints)];
}

// --- Build one surname from a race syllable set ---

function buildSurname(style) {
  const set = RACE_SETS[style];
  if (!set?.sOnset) return ['Unknown', 'Unknown'];

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // Tabaxi don't use traditional surnames
  if (style === 'tabaxi') {
    return [pick(set.sOnset) + pick(set.sVowel) + pick(set.sCoda), 'Clan-name'];
  }

  // Compound word: sOnset + sVowel (optional) + sCoda
  const useVowel = Math.random() < 0.35;
  const name = pick(set.sOnset) + (useVowel ? pick(set.sVowel) : '') + pick(set.sCoda);

  return [name.charAt(0).toUpperCase() + name.slice(1), 'Surname'];
}

// --- Generate 8 unique names, checking length ---

function generatePool(buildFn, minLen, maxLen) {
  const results = [];
  const seen = new Set();
  let attempts = 0;

  while (results.length < 8 && attempts < 300) {
    attempts++;
    const [name, hint] = buildFn();
    const clean = name.trim();
    if (!seen.has(clean) && clean.length >= minLen && clean.length <= maxLen) {
      seen.add(clean);
      results.push([clean, hint]);
    }
  }

  return results;
}

// --- Levenshtein distance ---

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
    for (let j = 1; j <= n; j++) {
      if (i === 0) { dp[i][j] = j; continue; }
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
    }
  }
  return dp[m][n];
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// --- localStorage: recently checked ---

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function saveRecent(list) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch {}
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

  if (!list.length) { panel.hidden = true; return; }

  panel.hidden = false;
  ul.innerHTML = list.map(entry => {
    const sc = entry.status === 'taken' ? 'taken' : entry.status === 'risky' ? 'risky' : 'safe';
    const sl = entry.status === 'taken' ? '✕' : entry.status === 'risky' ? '⚠' : '✓';
    return `<li class="recent-item">
      <button class="recent-name" data-name="${escapeHtml(entry.name)}">${escapeHtml(entry.name)}</button>
      <span class="recent-meta">${escapeHtml(entry.server || '')}</span>
      <span class="recent-status ${sc}">${sl}</span>
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
    setTimeout(() => { triggerEl.textContent = original; triggerEl.classList.remove('copied'); }, 1500);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
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
    parts.push(data.classes.map(c => `${c.name} ${c.level}`).join(' / '));
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
  if (!name) { input.focus(); return; }

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
    const cleanServers = results.filter(r => !r.error && !exactHits.includes(r)).map(r => `<span class="match-pill">${r.server}</span>`).join('');
    const charInfos = exactHits.map(r => {
      const info = buildCharInfo(r.data);
      return info ? `<p class="char-info">${escapeHtml(r.server)}: ${escapeHtml(info)}</p>` : '';
    }).join('');

    html = `<div class="result-card taken" role="alert">
      <div class="result-verdict-row">
        <p class="result-verdict">✕ Likely Taken</p>
        <button class="copy-btn" data-copy="${escapeHtml(name)}">⎘ Copy</button>
      </div>
      <p class="result-detail">An exact match for <strong>${escapeHtml(name)}</strong> was found.</p>
      <div class="server-hits">${serverPills}</div>
      ${cleanServers ? `<p class="result-note">Not found on: ${cleanServers}</p>` : ''}
      ${charInfos}
      ${errorCount > 0 ? `<p class="result-note">⚠ ${errorCount} server(s) could not be reached — results may be incomplete.</p>` : ''}
    </div>`;
    addToRecent({ name, server: exactHits.map(r => r.server).join(', '), status: 'taken' });

  } else if (closeHits.length > 0) {
    const pills = closeHits.map(r => `<span class="match-pill">${escapeHtml(r.data.name)}</span>`).join('');
    html = `<div class="result-card risky" role="alert">
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
    html = `<div class="result-card risky" role="alert">
      <p class="result-verdict">⚠ Could Not Reach DDO Audit</p>
      <p class="result-detail">All server lookups failed. DDO Audit may be down, or the Netlify function is unavailable. Try again in a moment.</p>
    </div>`;

  } else {
    html = `<div class="result-card safe" role="alert">
      <div class="result-verdict-row">
        <p class="result-verdict">✓ Not Found in DDO Audit</p>
        <button class="copy-btn" data-copy="${escapeHtml(name)}">⎘ Copy</button>
      </div>
      <p class="result-detail">No match for <strong>${escapeHtml(name)}</strong> on ${checkedCount - errorCount} server(s). DDO Audit only tracks recently active characters — this name may still be taken in-game. Always verify at character creation.</p>
      ${errorCount > 0 ? `<p class="result-note">⚠ ${errorCount} server(s) could not be reached — results may be incomplete.</p>` : ''}
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
  const picks = generatePool(() => buildName(selectedStyle, selectedGender), 3, 28);
  renderTileGrid('name-grid', picks, (name) => {
    document.getElementById('name-input').value = name;
    checkName();
    document.getElementById('name-input').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// --- Last name generator ---

function generateLastNames() {
  const picks = generatePool(() => buildSurname(selectedLastStyle), 4, 22);
  renderTileGrid('lastname-grid', picks, (name) => copyToClipboard(name, document.activeElement));
}

function renderTileGrid(gridId, picks, onCheck) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = picks.map(([name, hint]) => `
    <div class="name-tile">
      <button class="tile-check" data-name="${escapeHtml(name)}">
        <span class="tile-name">${escapeHtml(name)}</span>
        <span class="tile-hint">${escapeHtml(hint)}</span>
      </button>
      <button class="tile-copy" data-copy="${escapeHtml(name)}" title="Copy">⎘</button>
    </div>
  `).join('');

  grid.querySelectorAll('.tile-check').forEach(btn => {
    btn.addEventListener('click', () => onCheck(btn.dataset.name));
  });
  grid.querySelectorAll('.tile-copy').forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
  });
}

// --- Button wiring ---

document.querySelectorAll('.server-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const server = btn.dataset.server;
    if (server === 'all') {
      selectedServers = [...SERVERS];
      document.querySelectorAll('.server-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      return;
    }
    document.querySelectorAll('.server-btn[data-server="all"]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.toggle('active');
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    selectedServers = [...document.querySelectorAll('.server-btn.active:not([data-server="all"])')].map(b => b.dataset.server);
    if (!selectedServers.length) { btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true'); selectedServers = [server]; }
  });
});

document.querySelectorAll('.style-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.style-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    selectedStyle = btn.dataset.style;
    generateNames();
  });
});

document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    selectedGender = btn.dataset.gender;
    generateNames();
  });
});

document.querySelectorAll('.lastname-style-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lastname-style-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    selectedLastStyle = btn.dataset.style;
    generateLastNames();
  });
});

document.getElementById('clear-recent-btn').addEventListener('click', () => { saveRecent([]); renderRecent(); });
document.getElementById('name-input').addEventListener('keydown', e => { if (e.key === 'Enter') checkName(); });
document.getElementById('check-btn').addEventListener('click', checkName);
document.getElementById('regen-btn').addEventListener('click', generateNames);
document.getElementById('lastname-regen-btn').addEventListener('click', generateLastNames);

// --- Init ---
generateNames();
generateLastNames();
renderRecent();