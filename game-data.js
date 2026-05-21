
const DATA={
names:["Lionel","Kaid","Lian","Nero","Ember","Mako","Orion","Cale","Riven","Sora","Vale","Juno","Kai","Amanda","Riku","Luna"],
origins:[
 {id:"dock",name:"Dock Rat",icon:"⚓",cost:0,desc:"You grew up around docks, surviving by your wits.",bonus:{strength:1,beli:50,survival:1}},
 {id:"marinefam",name:"Marine Family",icon:"🛡️",cost:0,desc:"Honor and justice run in your blood.",bonus:{discipline:1,intelligence:1,marineRep:1}},
 {id:"noble",name:"Noble Runaway",icon:"👑",cost:0,desc:"You ran from comfort to chase your own dream.",bonus:{charisma:1,beli:100,luck:1}},
 {id:"shipwright",name:"Shipwright Family",icon:"⚒️",cost:0,desc:"You were raised by builders and repairmen.",bonus:{intelligence:1,crafting:1,engineering:1}},
 {id:"fisher",name:"Fisher Family",icon:"🌊",cost:0,desc:"The sea raised you.",bonus:{stamina:1,swimming:1,perception:1}},
 {id:"unknown",name:"Unknown Past",icon:"❓",cost:0,desc:"You remember nothing before today.",bonus:{potential:2,luck:1}},
 {id:"performer",name:"Street Performer",icon:"🎭",cost:0,desc:"You learned to survive by entertaining crowds.",bonus:{charisma:2,beli:80}},
 {id:"scholar",name:"Scholar Family",icon:"📚",cost:0,desc:"Books and forbidden questions shaped you.",bonus:{intelligence:2,perception:1}},
 {id:"merchant",name:"Merchant Child",icon:"💰",cost:0,desc:"You learned trade, bargaining, and value.",bonus:{beli:300,charisma:1}},
 {id:"doctor",name:"Doctor Apprentice",icon:"🏥",cost:0,desc:"You learned how fragile life is.",bonus:{medicine:2,intelligence:1}},
 {id:"blacksmith",name:"Blacksmith Child",icon:"🔨",cost:0,desc:"Weapons and steel surrounded your childhood.",bonus:{crafting:1,strength:1}},
 {id:"wano",name:"Wano Exile",icon:"⚔️",cost:600,desc:"A blade and old shame follow you.",bonus:{sword:3,willpower:1,beli:200}},
 {id:"skykid",name:"Sky Island Child",icon:"☁️",cost:500,desc:"You remember clouds beneath your feet.",bonus:{perception:3,speed:1}},
 {id:"piratechild",name:"Pirate Captain Child",icon:"☠️",cost:800,desc:"Your family name already worries Marines.",bonus:{fame:5,infamy:2,charisma:1}},
 {id:"godvalley",name:"Survivor of God Valley",icon:"🔥",cost:750,desc:"The world remembers something you do not.",bonus:{potential:5,willpower:3}},
 {id:"celestial",name:"Celestial Dragon Escapee",icon:"🌟",cost:1500,desc:"You escaped a life above others.",bonus:{charisma:4,potential:3,heat:5}},
 {id:"ancient",name:"Ancient Bloodline",icon:"🌑",cost:2500,desc:"???",bonus:{potential:6,willpower:4,luck:2}}
],
races:[
 {id:"human",name:"Human",icon:"👤",cost:0,desc:"Adaptable with high growth.",bonus:{potential:1,xpBoost:5},weak:"No major weakness."},
 {id:"fishman",name:"Fishman",icon:"🐟",cost:0,desc:"Powerful sea-born fighter.",bonus:{strength:3,stamina:2,swimming:3},weak:"More prejudice events."},
 {id:"skypiean",name:"Skypiean",icon:"☁️",cost:0,desc:"Children of the sky with natural perception.",bonus:{perception:2,speed:1},weak:"Lower durability."},
 {id:"mink",name:"Mink",icon:"🦴",cost:0,desc:"Fast instinctive warriors with Electro.",bonus:{speed:2,reflex:2},weak:"Sulong depends on moon events."},
 {id:"halfgiant",name:"Half Giant",icon:"⚔️",cost:750,desc:"Large, strong, but still mobile.",bonus:{strength:3,stamina:3},weak:"Social identity events."},
 {id:"giant",name:"Giant",icon:"🗿",cost:1500,desc:"Born with monstrous strength.",bonus:{strength:6,stamina:5,hp:30},weak:"Slower and harder to hide."},
 {id:"buccaneer",name:"Buccaneer",icon:"💪",cost:1800,desc:"Built to endure impossible burdens.",bonus:{strength:4,stamina:4,willpower:3},weak:"Government suspicion."},
 {id:"lunarian",name:"Lunarian",icon:"🔥",cost:3000,desc:"Rare race of flame and endurance.",bonus:{strength:4,stamina:4,haki:3},weak:"Government hunts you."},
 {id:"hybrid",name:"Ancient Hybrid",icon:"🌑",cost:5000,desc:"Unknown inherited power.",bonus:{potential:8,luck:3},weak:"Unstable rare events."}
],
islands:[
 {id:"foosha",name:"Foosha Village",sea:"East Blue",danger:1,pop:1200,marine:1,pirate:2,weather:"Clear",desc:"A peaceful village where many legends begin.",places:["Tavern","Docks","Market","Hill Path"]},
 {id:"shells",name:"Shells Town",sea:"East Blue",danger:2,pop:4000,marine:7,pirate:2,weather:"Sunny",desc:"A Marine town with strict patrols.",places:["Marine Base","Docks","Market","Training Yard"]},
 {id:"orange",name:"Orange Town",sea:"East Blue",danger:3,pop:3500,marine:3,pirate:6,weather:"Windy",desc:"A lively port with pirate trouble.",places:["Tavern","Market","Alleys","Docks"]},
 {id:"syrup",name:"Syrup Village",sea:"East Blue",danger:2,pop:900,marine:1,pirate:3,weather:"Cloudy",desc:"Quiet hills, secrets, and rumors.",places:["Mansion Road","Village Square","Forest","Docks"]},
 {id:"loguetown",name:"Loguetown",sea:"East Blue",danger:5,pop:12000,marine:6,pirate:7,weather:"Rainy",desc:"Town of beginnings and endings.",places:["Execution Square","Weapon Shop","Tavern","Docks"]},
 {id:"moonveil",name:"Moonveil Island",sea:"Grand Line",danger:6,pop:5000,marine:4,pirate:8,weather:"Stormy",desc:"A mysterious island full of strange weather.",places:["Ruins","Black Market","Port","Wilderness"]}
],
weapons:[
 {name:"Rusty Sword",type:"Weapon",rarity:"Common",power:4,desc:"A worn sword, but better than nothing."},
 {name:"Iron Sword",type:"Weapon",rarity:"Common",power:8,desc:"A sturdy blade for basic combat."},
 {name:"Flintlock Pistol",type:"Weapon",rarity:"Common",power:6,desc:"A simple pistol for ranged attacks."},
 {name:"Graded Blade III",type:"Weapon",rarity:"Rare",power:18,desc:"A reliable graded blade."}
],
items:[
 {name:"Small Med Kit",type:"Item",rarity:"Common",qty:2,desc:"Restores 20 HP."},
 {name:"Energy Meat",type:"Item",rarity:"Common",qty:3,desc:"Restores energy."},
 {name:"Log Pose",type:"Key Item",rarity:"Rare",qty:1,desc:"Needed for dangerous sea routes."}
],
fruits:[
 {name:"Smoke Body Fruit",type:"Logia",rarity:"Epic",power:28,desc:"Become smoke to evade and bind enemies."},
 {name:"Wolf-Wolf Fruit",type:"Zoan",rarity:"Uncommon",power:13,desc:"Transform into a wolf or wolf hybrid."},
 {name:"Barrier-Barrier Fruit",type:"Paramecia",rarity:"Rare",power:20,desc:"Create protective barriers."}
],
news:[
 "Marine patrols increased near Shells Town.",
 "A rare fruit merchant was seen near Orange Town.",
 "Pirates have been extorting merchants.",
 "Strange weather patterns are forming near the Grand Line.",
 "A bounty hunter was spotted asking questions."
]
};
