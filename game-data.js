
const DATA = {
  names:["Kaid","Lian","Nero","Ember","Mako","Orion","Cale","Riven","Sora","Vale","Juno","Axel"],
  dreams:["Become Pirate King","Destroy corrupt justice","Find the lost history","Become the strongest fighter","Build the greatest ship","Become the richest person alive","Free oppressed islands","Become an Admiral","Find a mythical Devil Fruit","Create a legendary crew"],
  origins:[
    ["Dock Rat","⚓",{speed:1,sneak:1}],
    ["Marine Base Child","🛡️",{discipline:2,marineRep:1}],
    ["Fishman Street Fighter","🌊",{strength:2,durability:1}],
    ["Wano Exile","🗡️",{sword:2,discipline:1}],
    ["Noble Runaway","👑",{charisma:2,berries:1500}],
    ["Slave Escapee","⛓️",{freedom:2,courage:2,heat:1}],
    ["Sky Island Tinkerer","☁️",{craft:2,intelligence:1}],
    ["Doctor's Apprentice","🩺",{medicine:2,intelligence:1}],
    ["Shipwright's Kid","🔨",{craft:2,shipXP:1}],
    ["Street Performer","🎭",{charisma:2,mood:8}]
  ],
  paths:[
    ["Pirate","☠️",{bounty:5000,freedom:1}],
    ["Marine","🛡️",{marineRep:2,discipline:1}],
    ["Revolutionary","🔥",{revolutionaryRep:2,heat:1,honor:1}],
    ["Bounty Hunter","🎯",{berries:3000,marksmanship:1}],
    ["Doctor","🩺",{medicine:2,honor:1}],
    ["Shipwright","🔨",{craft:2,shipXP:1}]
  ],
  ranks:{
    Pirate:["Rookie","Supernova","Captain","Warlord Candidate","Yonko Commander","Yonko","Pirate King Contender"],
    Marine:["Recruit","Seaman","Petty Officer","Lieutenant","Captain","Commodore","Vice Admiral Candidate","Admiral Candidate"],
    Revolutionary:["Recruit","Cell Agent","Liberator","Commander","Chief of Staff Candidate"],
    "Bounty Hunter":["Rookie Hunter","Licensed Hunter","Black Card Hunter","Warlord-Class Hunter"],
    Doctor:["Medic","Field Doctor","Miracle Doctor","Legendary Surgeon"],
    Shipwright:["Apprentice","Dockhand","Master Builder","Legendary Shipwright"],
    Undecided:["None"]
  },
  islands:[
    {name:"Syrup Harbor",region:"Home Sea",danger:1},
    {name:"Shell Town",region:"Home Sea",danger:2},
    {name:"Dustvale",region:"Home Sea",danger:3},
    {name:"Moonveil Island",region:"Paradise",danger:5},
    {name:"Ironjaw Port",region:"Paradise",danger:6},
    {name:"Thunder Reef",region:"New World",danger:8},
    {name:"Oni Crown",region:"New World",danger:9}
  ],
  events:[
    {title:"Market Trouble",text:"A thief is being chased through the market.",choices:[
      ["Help the victim",{honor:1,marineRep:1,mood:2},"You helped recover stolen goods."],
      ["Help the thief",{sneak:1,freedom:1,heat:1},"You helped the thief vanish into an alley."],
      ["Rob both sides",{berries:1500,infamy:1,heat:2},"You turned chaos into profit."]
    ]},
    {title:"Burning Dock",text:"A fire spreads across the docks.",choices:[
      ["Save workers",{honor:2,courage:1,health:-5},"You saved trapped dockworkers."],
      ["Loot warehouses",{berries:3000,infamy:1,heat:2},"You stole goods during the panic."],
      ["Organize rescue",{leadership:1,charisma:1},"People followed your orders."]
    ]},
    {title:"Strange Fruit Rumor",text:"A black market contact whispers about a Devil Fruit.",choices:[
      ["Investigate",{mystery:1},"You found clues to a fruit dealer."],
      ["Ignore it",{discipline:1},"You avoid a dangerous rabbit hole."],
      ["Set a trap",{sneak:1,heat:1},"You baited the dealer into revealing more."]
    ]}
  ],
  fruitCatalog:[
    {name:"Flame-Flame Fruit",type:"Logia",rarity:"Legendary",desc:"Create, control, and become fire.",passives:["Logia intangibility vs non-Haki attacks","Fire resistance"],moves:["Fire Spear","Flame Dragon","Inferno Burst"],weakness:"Water, sea-prism, Armament Haki"},
    {name:"Storm-Storm Fruit",type:"Logia",rarity:"Mythic",desc:"Become living storm clouds, wind, and lightning.",passives:["Logia intangibility","Lightning movement"],moves:["Thunder Spear","Storm Prison","Heavenly Judgment"],weakness:"Rubber-like counters, sea-prism, Armament Haki"},
    {name:"Smoke Body Fruit",type:"Logia",rarity:"Epic",desc:"Become smoke to evade, bind, and blind enemies.",passives:["Logia intangibility","Fog concealment"],moves:["Smoke Bind","Whiteout","Choke Field"],weakness:"Strong wind, sea-prism, Armament Haki"},
    {name:"Barrier-Barrier Fruit",type:"Paramecia",rarity:"Rare",desc:"Create nearly indestructible barriers.",passives:["Defense bonus","Protect allies"],moves:["Barrier Wall","Barrier Cage","Barrier Crash"],weakness:"Limited early offense"},
    {name:"Wolf-Wolf Fruit",type:"Zoan",rarity:"Uncommon",desc:"Transform into a wolf or wolf hybrid.",passives:["Hybrid Form: speed and claws","Beast Form: tracking"],moves:["Savage Fang","Pack Rush","Moon Howl"],weakness:"Lower utility"},
    {name:"Phoenix Fruit",type:"Mythical Zoan",rarity:"Mythic",desc:"Mythical bird fruit with blue healing flames.",passives:["Flight","Healing flames","Regeneration chance"],moves:["Phoenix Talon","Healing Flame","Rebirth Burst"],weakness:"High mastery requirement"},
    {name:"Spinosaurus Fruit",type:"Ancient Zoan",rarity:"Epic",desc:"Ancient Zoan with monstrous durability.",passives:["Hybrid armor","Beast HP"],moves:["Tail Cleaver","Ancient Charge","Bone Breaker"],weakness:"Slow speed"}
  ],
  weaponCatalog:[
    {name:"Rusty Cutlass",type:"Sword",rarity:"Common",desc:"A chipped blade used by rookies.",effects:["Small sword damage"],moves:["Basic Slash"],special:"None",power:4,history:"No known history."},
    {name:"Marine Saber",type:"Sword",rarity:"Uncommon",desc:"A reliable military saber.",effects:["Sword damage","Parry bonus"],moves:["Officer Slash","Guard Break"],special:"Discipline scaling",power:9,history:"Standard Marine issue."},
    {name:"Iron Knuckle Gauntlets",type:"Gauntlets",rarity:"Uncommon",desc:"Heavy iron gauntlets for brawlers.",effects:["Punch damage","Stun chance"],moves:["Iron Jab","Rib Breaker"],special:"Pairs well with Armament",power:10,history:"Underground fight pits."},
    {name:"Sea King's Tooth Club",type:"Heavy Weapon",rarity:"Epic",desc:"A brutal club carved from Sea King tooth.",effects:["Stun","Armor break"],moves:["Skull Tide","Bone Quake"],special:"Bonus vs beasts",power:26,history:"Taken from a monster that sank seven ships."},
    {name:"Storm Fang",type:"Spear",rarity:"Legendary",desc:"A spear forged from storm iron.",effects:["High crit chance","Lightning damage"],moves:["Thunder Pierce","Sky Splitter","Storm Fang Lance"],special:"Can evolve with Observation Haki",power:32,history:"Wielded by the Thunder King."},
    {name:"Enketsu",type:"Cursed Blade",rarity:"Mythic",desc:"A cursed blade burning with hatred.",effects:["Massive slash damage","Blood Flame"],moves:["Blood Flame Cut","Soul Ignition","Crimson Execution"],special:"Hidden curse may drain stamina",power:42,history:"Wielded by the Crimson Executioner."}
  ],
  loot:[
    {name:"Marine Rations",rarity:"Common",value:600,effect:{health:6}},
    {name:"Smoke Pellets",rarity:"Uncommon",value:1800,effect:{sneak:1}},
    {name:"Log Pose Shard",rarity:"Rare",value:6500,effect:{navigation:2}},
    {name:"Ancient Rubbing",rarity:"Epic",value:35000,effect:{mystery:2,heat:2}},
    {name:"Sea King's Tooth Charm",rarity:"Legendary",value:120000,effect:{charisma:2,courage:2}},
    {name:"Void Century Cipher",rarity:"Mythic",value:300000,effect:{mystery:5,heat:5}}
  ]
};
