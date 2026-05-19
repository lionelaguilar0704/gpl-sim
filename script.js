const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString();
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const deep=o=>JSON.parse(JSON.stringify(o));

const VERSION="1.0 Grand Line Foundation";

const DATA={
names:["Kaid","Rook","Vera","Mako","Lian","Sora","Dax","Namiro","Vale","Rin","Cale","Juno","Arashi","Toma","Kira","Zeno","Mira","Dante","Koji","Namiya","Vex","Orin","Talia","Saiko","Crowe","Milo","Nero","Yuna","Cass","Bram","Ari","Kael","Nox","Luma","Torren","Basil","Ember","Iris"],
regions:[
 {name:"Home Sea",danger:1,req:{nav:0,ship:0},desc:"The four Blues: safer routes, rookie pirates, corrupt towns, and local Marines."},
 {name:"Reverse Mountain",danger:3,req:{nav:3,ship:40},desc:"The violent gateway into the Grand Line."},
 {name:"Paradise",danger:5,req:{nav:5,ship:80},desc:"First half of the Grand Line. Weird climates, bigger crews, rising bounties."},
 {name:"Sabaody Crossroads",danger:7,req:{nav:7,ship:120},desc:"A dangerous checkpoint where rookies become legends or disappear."},
 {name:"New World",danger:9,req:{nav:10,ship:160},desc:"Emperors, storms, Haki monsters, impossible islands, and world-changing choices."}
 ],
islands:[
 {name:"Loguetown",region:"Home Sea",type:"Marine Town",tags:["marine","dock","fame"],desc:"execution platforms, rain, rumors, Marines"},
 {name:"Shells Town",region:"Home Sea",type:"Marine Base",tags:["marine","justice"],desc:"Marine corruption, rooftops, recruits"},
 {name:"Syrup Harbor",region:"Home Sea",type:"Quiet Port",tags:["street","secret"],desc:"quiet mansions, lies, hidden pirates"},
 {name:"Organ Market",region:"Home Sea",type:"Black Market",tags:["secret","money","fruit"],desc:"black markets, stolen maps, secret auctions"},
 {name:"Dustvale",region:"Home Sea",type:"Bounty Town",tags:["money","fighter"],desc:"desert saloons, bounty hunters, old gangs"},
 {name:"Brinehook Port",region:"Home Sea",type:"Shipyard",tags:["ship","dock"],desc:"shipyards, tavern brawls, smugglers"},
 {name:"Karakuri Scrap Island",region:"Paradise",type:"Tech Island",tags:["craft","secret"],desc:"inventors, machines, failed weapons"},
 {name:"Moonreef",region:"Paradise",type:"Fishman Port",tags:["fishman","sea"],desc:"fishman docks, coral canals, sea beasts"},
 {name:"Ironbell",region:"Paradise",type:"Factory Island",tags:["revolutionary","chains"],desc:"factories, chained workers, revolutionary whispers"},
 {name:"Skypierce Atoll",region:"Paradise",type:"Sky Island",tags:["sky","secret"],desc:"cloud bridges, strange dials, sky pirates"},
 {name:"Frostwake",region:"Paradise",type:"Survival Island",tags:["sea","fighter"],desc:"ice storms, survival tribes, lost ships"},
 {name:"Amberfall",region:"Paradise",type:"Noble Island",tags:["noble","secret"],desc:"noble estates, hidden vaults, masked balls"},
 {name:"Cinder Key",region:"New World",type:"Volcanic Island",tags:["fighter","sea"],desc:"volcanic caves, smugglers, heat mirages"},
 {name:"Pearl Graveyard",region:"New World",type:"Ship Graveyard",tags:["sea","money"],desc:"shipwrecks, ghosts, treasure divers"},
 {name:"Clockwork Cay",region:"New World",type:"Machine Island",tags:["craft","government"],desc:"mechanical towers, genius engineers, malfunctioning guards"},
 {name:"Red Lantern Port",region:"Sabaody Crossroads",type:"Underworld Hub",tags:["money","rival","secret"],desc:"gamblers, assassins, sake houses, bounty rumors"},
 {name:"Mangrove Ring",region:"Sabaody Crossroads",type:"Crossroads",tags:["fame","government","noble"],desc:"bubbles, auctions, veterans, and impossible choices"},
 {name:"Storm Crown",region:"New World",type:"Emperor Borderland",tags:["fighter","fame","sea"],desc:"permanent storms, emperor flags, and Haki pressure"}
 ],
origins:[
["Dock Rat","⚓",{navigation:1,sneak:1},["dock","street","pirate"]],
["Marine Base Child","🛡️",{discipline:2,marineRep:1},["marine","justice","rank"]],
["Fishman Street Fighter","🌊",{strength:2,durability:1},["fishman","street","fighter"]],
["Wano Exile","🗡️",{strength:1,discipline:1,sword:1},["sword","honor","exile"]],
["Noble Runaway","👑",{charisma:2,berries:3000},["noble","money","secret"]],
["Slave Escapee","⛓️",{durability:2,sneak:1,honor:1},["chains","escape","freedom"]],
["Sky Island Tinkerer","☁️",{intelligence:2,craft:1},["sky","gadget","dial"]],
["Doctor's Apprentice","🩺",{intelligence:1,honor:1,medicine:1},["doctor","healer","mercy"]],
["Shipwright's Kid","🔨",{intelligence:1,durability:1,craft:1},["ship","craft","sea"]],
["Street Performer","🎭",{charisma:2,sneak:1},["performance","deception","crowds"]],
["Forgotten Noble Guard","🏰",{discipline:1,strength:1,sword:1},["guard","loyalty","fall"]],
["Orphan Pickpocket","🪙",{sneak:2,berries:1000},["street","theft","survival"]],
["Monastery Student","📿",{discipline:2,hakiXP:1},["spirit","training","vows"]],
["Sea Beast Survivor","🦈",{durability:2,navigation:1},["sea","trauma","survival"]],
["Underground Courier","📦",{speed:1,sneak:1,navigation:1},["smuggling","routes","secrets"]],
["Failed Marine Cadet","🎖️",{discipline:1,strength:1,marineRep:-1},["failure","justice","resentment"]]
 ],
careers:{
 Pirate:["Rookie","Crewmate","Captain","Notorious Captain","Supernova","Warlord Candidate","Emperor Candidate","Sea Legend"],
 Marine:["Recruit","Seaman","Ensign","Lieutenant","Captain","Commodore","Vice Admiral Candidate","Admiral Candidate"],
 "Bounty Hunter":["Local Hunter","Regional Hunter","Grand Line Hunter","Warlord Contractor","Legend Hunter","Marine Consultant"],
 Revolutionary:["Sympathizer","Courier","Cell Leader","Liberator","Commander Candidate","World Threat"],
 Merchant:["Peddler","Trader","Route Owner","Underworld Broker","Shipping Magnate","Black Market Kingpin"],
 Doctor:["Apprentice","Field Medic","Ship Doctor","Miracle Doctor","War Surgeon","Legendary Healer"],
 Shipwright:["Apprentice","Dockhand","Shipwright","Master Shipwright","Adam-Wood Specialist","Legendary Builder"],
 "Cipher Pol Recruit":["Informer","Agent Trainee","Field Agent","Assassin","Cipher Specialist","Ghost Agent"],
 "Wandering Swordsman":["Student","Duelist","Blade Hunter","Master Swordsman","Cursed Blade Wielder","Legendary Swordsman"],
 "Treasure Diver":["Diver","Salvager","Map Hunter","Sunken Vault Raider","Sea Floor Legend"],
 Gambler:["Small Table","House Regular","Card Shark","Den Boss","Casino King"],
 "News Courier":["Runner","Reporter","Truth Hunter","War Correspondent","World Journalist"]
 },
paths:[
["Pirate","☠️",{bounty:10000,infamy:2}],["Marine","⚔️",{marineRep:3,discipline:2}],["Bounty Hunter","🎯",{berries:5000,strength:1}],["Revolutionary","🔥",{revolutionaryRep:3,honor:1}],
["Merchant","💰",{berries:10000,charisma:1}],["Doctor","🩺",{medicine:2,honor:1}],["Shipwright","🛠️",{craft:2,durability:1}],["Cipher Pol Recruit","🕶️",{sneak:3,discipline:1,honor:-1}],
["Wandering Swordsman","🗡️",{sword:3,bounty:3000}],["Treasure Diver","🫧",{navigation:2,berries:3000}],["Gambler","🎲",{charisma:1,berries:2500,sneak:1}],["News Courier","📰",{navigation:1,intelligence:1,charisma:1}]
 ],
fruits:[
{name:"Carve-Carve Fruit",type:"Paramecia",power:"engrave symbols that create seals, traps, and summons",tree:["Mark","Trap","Seal","Summon","Awakening: Living Sigils"]},
{name:"Smoke Body Fruit",type:"Logia-like",power:"turn into drifting smoke and obscure battlefields",tree:["Smoke Dodge","Fog Cloud","Smoke Bind","Choke Field","Awakening: City of Smoke"]},
{name:"Iron Body Fruit",type:"Paramecia",power:"harden flesh into living metal",tree:["Iron Skin","Metal Fist","Magnet Grip","Iron Fortress","Awakening: Living Armory"]},
{name:"Mist-Mist Fruit",type:"Logia-like",power:"create mist clones and fog ambushes",tree:["Mist Veil","Clone","Drown Sight","Ghost Step","Awakening: Endless Fog"]},
{name:"Panther Zoan",type:"Zoan",power:"become a black panther hybrid",tree:["Claws","Pounce","Predator Eye","Full Beast","Awakening: Apex Predator"]},
{name:"Hawk Zoan",type:"Zoan",power:"gain flight, talons, and predator vision",tree:["Talons","Glide","Divebomb","Sky Sight","Awakening: Storm Hawk"]},
{name:"Wall-Wall Fruit",type:"Paramecia",power:"raise defensive walls from surfaces",tree:["Wall","Rampart","Crush Wall","Maze","Awakening: Fortress Island"]},
{name:"Pulse-Pulse Fruit",type:"Paramecia",power:"send shockwaves through touch",tree:["Pulse Jab","Shock Step","Rupture","Quake Palm","Awakening: Heartbeat Field"]},
{name:"Thread-Thread Fruit",type:"Paramecia",power:"control razor-thin threads",tree:["Thread Grip","Wire Cut","Puppet Line","Sky String","Awakening: Thread World"]},
{name:"Glide-Glide Fruit",type:"Paramecia",power:"slide through air and redirect momentum",tree:["Slide","Air Skim","Redirect","Friction Break","Awakening: Momentum Domain"]},
{name:"Mend-Mend Fruit",type:"Paramecia",power:"rapidly stitch wounds and repair objects",tree:["Patch","Stitch","Field Surgery","Repair Burst","Awakening: Restoration Field"]},
{name:"Grav-Grav Fruit",type:"Paramecia",power:"briefly increase or reduce gravity around targets",tree:["Heavy Palm","Light Step","Crush Zone","Orbit Pull","Awakening: Gravity Well"]},
{name:"Mirror-Mirror Fruit",type:"Paramecia",power:"reflect attacks and create false rooms",tree:["Reflect","False Room","Mirror Step","Copy Image","Awakening: Mirror Labyrinth"]},
{name:"Rust-Rust Fruit",type:"Paramecia",power:"decay weapons, locks, and armor by touch",tree:["Rust Touch","Lock Rot","Armor Decay","Weapon Dust","Awakening: Corrosion City"]},
{name:"Ink-Ink Fruit",type:"Paramecia",power:"bring ink drawings to temporary life",tree:["Ink Shot","Draw Beast","Ink Wall","Living Script","Awakening: Painted Reality"]}
 ],
hakiTrees:{
 "Observation Haki":["Presence Sense","Danger Pulse","Lie Read","Future Flicker","Future Sight"],
 "Armament Haki":["Hardening","Weapon Coat","Armor Skin","Flowing Force","Internal Destruction"],
 "Conqueror's Haki - Rare Spark":["Pressure","Intimidate Crowd","Commanding Aura","Knockout Wave","Kingly Coating"]
 },
companions:[
{name:"Ashfang",role:"Beast Companion",bonus:{sneak:1},loyalty:8,salary:0},
{name:"Mira",role:"Mink Fighter",bonus:{speed:1},loyalty:6,salary:500},
{name:"Captain Squawk",role:"Scout",bonus:{navigation:1},loyalty:5,salary:0},
{name:"Pip",role:"Deckhand",bonus:{charisma:1},loyalty:4,salary:200},
{name:"Old Salt",role:"Mascot",bonus:{sneak:1},loyalty:7,salary:0},
{name:"Nelli",role:"Gadgeteer",bonus:{craft:2},loyalty:6,salary:900},
{name:"Rook",role:"Comms",bonus:{intelligence:1},loyalty:5,salary:600},
{name:"Doc Harlan",role:"Doctor",bonus:{medicine:2},loyalty:6,salary:1000},
{name:"Yume",role:"Swordsman",bonus:{sword:2},loyalty:5,salary:1200},
{name:"Boro",role:"Navigator",bonus:{navigation:2},loyalty:6,salary:1000},
{name:"Grit",role:"Cook",bonus:{charisma:1},loyalty:5,salary:700},
{name:"Lace",role:"Informant",bonus:{sneak:1,intelligence:1},loyalty:4,salary:800},
{name:"Bastion",role:"Helmsman",bonus:{navigation:1,durability:1},loyalty:5,salary:900},
{name:"Kuroh",role:"Sniper",bonus:{speed:1},loyalty:5,salary:900},
{name:"Elia",role:"Archaeologist",bonus:{intelligence:2},loyalty:4,salary:1100}
 ],
rivals:["hotheaded Marine prodigy","laughing pirate captain","masked government agent","bounty hunter with twin pistols","noble swordsman","fishman bruiser","revolutionary extremist","black market queen","giant-blooded brawler","silent assassin child","fallen dojo champion","smiling CP trainee","steel-jawed pirate butcher","sky island sniper","false priest with a cannon staff","ghost captain with no flag","emperor scout","rogue warlord candidate"],
ships:[
{name:"Leaky Dinghy",hp:30,cannons:0,cargo:1,cost:0,tier:0},
{name:"Sloop",hp:60,cannons:1,cargo:3,cost:12000,tier:1},
{name:"Caravel",hp:100,cannons:3,cargo:6,cost:35000,tier:2},
{name:"Brigantine",hp:160,cannons:6,cargo:10,cost:85000,tier:3},
{name:"Custom Adam-Wood Cutter",hp:240,cannons:8,cargo:14,cost:180000,tier:4},
{name:"Ironclad Smuggler",hp:300,cannons:5,cargo:20,cost:240000,tier:4},
{name:"Legendary Frigate",hp:420,cannons:12,cargo:25,cost:500000,tier:5}
 ],
items:[
{name:"Smoke Bomb",cost:800,effect:{sneak:1}}, {name:"Training Weights",cost:2000,effect:{strength:1}},
{name:"Basic Katana",cost:3000,effect:{sword:1}}, {name:"Medical Kit",cost:2500,effect:{medicine:1}},
{name:"Log Pose Fragment",cost:7000,effect:{navigation:2}}, {name:"Dial Gadget",cost:8000,effect:{craft:1,speed:1}},
{name:"Fake Papers",cost:4000,effect:{heat:-2}}, {name:"Armor Vest",cost:6000,effect:{durability:1}},
{name:"Black Market Intel",cost:9000,effect:{mystery:1}}, {name:"Quality Rifle",cost:6500,effect:{marksmanship:2}},
{name:"Weighted Cloak",cost:5000,effect:{discipline:1,durability:1}}, {name:"Rare Medical Text",cost:12000,effect:{medicine:2,intelligence:1}},
{name:"Cursed Blade Rumor",cost:25000,effect:{mystery:2,sword:1}}, {name:"Crew Feast",cost:3000,effect:{mood:15,crewLoyalty:1}}
 ],
businesses:[
{name:"Dockside Tavern",cost:45000,income:3500,risk:"street"},
{name:"Smuggling Route",cost:65000,income:8000,risk:"heat"},
{name:"Free Clinic",cost:55000,income:2500,risk:"honor"},
{name:"Ship Repair Stall",cost:80000,income:6000,risk:"craft"},
{name:"Bounty Agency",cost:100000,income:9000,risk:"fighter"},
{name:"Black Market Booth",cost:90000,income:11000,risk:"infamy"}
 ],
mysteries:["black coin with a chain mark","red vivre card","forbidden sea chart","sealed letter from a dead captain","rusted key with a sun symbol","broken Marine badge","strange fruit stem","map written in ancient cipher","wanted poster with your face crossed out","bloodstained newspaper clipping","half-burned auction invitation","strange poneglyph rubbing","ciphered bounty ledger"],
quests:[
{name:"The Chain Mark",theme:"freedom fighters, slavers, old rebellions"},
{name:"The False Marine",theme:"corrupt justice and stolen uniforms"},
{name:"The Sunken Vault",theme:"treasure maps and sea monsters"},
{name:"The Laughing Captain",theme:"rival pirate crew escalation"},
{name:"The Cipher Letter",theme:"government secrets and assassins"},
{name:"The Black Auction",theme:"nobles, rare fruits, stolen people"},
{name:"The Broken Log Pose",theme:"lost islands, strange weather, impossible routes"},
{name:"The Red Debt",theme:"old family debts, bounty hunters, revenge"},
{name:"The Forgotten Century Scrap",theme:"forbidden history and government attention"},
{name:"The Emperor's Scout",theme:"New World politics and impossible offers"}
 ]
};

const EVENTS=[
{title:"Burning Dock",tags:["dock","street"],text:"A dock warehouse catches fire. Screams, smoke, and opportunity all appear at once.",choices:[["Save someone trapped inside",{honor:2,durability:1,berries:500,heat:1},"Risked your life in a burning dock warehouse."],["Steal from the abandoned crates",{berries:4000,infamy:1,honor:-1},"Looted a burning warehouse."],["Chase the suspicious arsonists",{speed:1,sneak:1,mystery:1},"Chased the arsonists and found a clue."],["Disappear before anyone sees you",{sneak:1},"Vanished before the authorities arrived."]]},
{title:"Black Market Offer",tags:["secret","money","fruit"],text:"A vendor under a torn tent offers you a disgusting fruit and swears it can change your life.",choices:[["Eat the strange fruit",{fruitRoll:1,berries:-5000},"Took a chance on a strange fruit."],["Sell the information",{berries:2500,infamy:1},"Sold a black market rumor."],["Report the market",{marineRep:1,honor:1},"Reported the black market."],["Rob the vendor",{berries:5000,infamy:2,honor:-2,heat:2},"Robbed a black market vendor."]]},
{title:"Animal in Chains",tags:["chains","freedom"],text:"You find an animal trapped behind a tavern. It is scared, angry, and hurt.",choices:[["Free and heal it",{honor:2,companionRoll:1,charisma:1},"Freed an animal from chains."],["Ignore it",{discipline:1},"Ignored the trapped animal."],["Use it as bait during a fight",{infamy:2,honor:-2},"Used a trapped animal as bait."],["Track whoever chained it",{sneak:1,mystery:1},"Tracked the people who chained the animal."]]},
{title:"Marine Inspection",tags:["marine","justice"],text:"Marines lock down the streets and begin checking papers. Something about you makes them stare too long.",choices:[["Cooperate",{marineRep:1,discipline:1},"Cooperated with a Marine inspection."],["Run across the rooftops",{speed:2,bounty:3000,heat:1},"Escaped Marines across rooftops."],["Lie confidently",{charisma:2,sneak:1},"Bluffed through an inspection."],["Pick a fight",{strength:2,bounty:10000,infamy:2,heat:3},"Started a fight with Marines."]]},
{title:"Dojo Challenge",tags:["fighter","sword","honor"],text:"A dojo master offers to train you, but only if you survive a public challenge.",choices:[["Fight fairly",{strength:1,speed:1,honor:1,sword:1},"Fought fairly in a dojo challenge."],["Cheat to win",{sneak:2,infamy:1,honor:-1},"Cheated in a dojo challenge."],["Study technique instead",{intelligence:2,sword:1},"Studied combat technique."],["Refuse and work jobs",{berries:3000,discipline:1},"Skipped the dojo and worked instead."]]},
{title:"Sea Storm",tags:["ship","sea"],text:"A sudden storm nearly destroys the ship you are riding on. Everyone panics.",choices:[["Take the wheel",{navigation:2,honor:1,shipDamage:8},"Took the wheel during a storm."],["Protect supplies",{berries:2000,durability:1},"Protected supplies in a storm."],["Save passengers",{honor:2,charisma:1},"Saved passengers during a storm."],["Abandon ship early",{sneak:1,honor:-1,shipDamage:15},"Abandoned ship early."]]},
{title:"Rival Appears",tags:["rival","fighter"],text:"A future rival crosses your path. They recognize your potential and hate it immediately.",choices:[["Challenge them",{strength:1,bounty:5000,rivalRoll:1,heat:1},"Challenged a future rival."],["Talk them down",{charisma:2,rivalRoll:1},"Talked down a future rival."],["Study their weakness",{intelligence:2,rivalRoll:1},"Studied a rival's weakness."],["Avoid them",{sneak:1},"Avoided a dangerous rival."]]},
{title:"Treasure Rumor",tags:["money","sea"],text:"A drunk sailor whispers about treasure hidden on a nearby island.",choices:[["Sail after it",{navigation:1,berries:6000,shipXP:1},"Chased a treasure rumor."],["Sell the rumor",{berries:2500,charisma:1},"Sold a treasure rumor."],["Recruit help first",{crewRoll:1,charisma:1},"Recruited help for a treasure hunt."],["Assume it is bait",{intelligence:1,discipline:1},"Avoided a likely trap."]]},
{title:"Revolutionary Pamphlet",tags:["freedom","revolutionary"],text:"You find hidden pamphlets calling for revolt against a cruel local ruler.",choices:[["Spread the pamphlets",{revolutionaryRep:2,honor:1,heat:1},"Spread revolutionary pamphlets."],["Burn them",{marineRep:1,discipline:1,honor:-1},"Burned revolutionary pamphlets."],["Rewrite them better",{intelligence:2,revolutionaryRep:1},"Rewrote revolutionary messaging."],["Sell the names listed inside",{berries:6000,infamy:2,honor:-3,heat:2},"Sold revolutionary names."]]},
{title:"Masked Ball",tags:["noble","secret"],text:"A noble family hosts a masked ball. Rumor says a rare map is hidden upstairs.",choices:[["Sneak upstairs",{sneak:2,mystery:1},"Snuck through a noble estate."],["Charm the guests",{charisma:2,berries:1500},"Charmed nobles at a masked ball."],["Expose their corruption",{honor:2,revolutionaryRep:1,heat:1},"Exposed noble corruption."],["Steal jewelry",{berries:8000,infamy:2,heat:2},"Stole jewelry from nobles."]]},
{title:"Sea Beast Attack",tags:["sea","fighter"],text:"A sea beast rises beside your vessel, large enough to crack the hull in one bite.",choices:[["Fight it head-on",{strength:2,bounty:5000,shipDamage:20,health:-10},"Fought off a sea beast."],["Outmaneuver it",{navigation:2,shipXP:1},"Outmaneuvered a sea beast."],["Sacrifice cargo",{berries:-3000},"Sacrificed cargo to escape a sea beast."],["Use your crew as bait",{infamy:3,honor:-3,crewLoss:1},"Used someone as bait."]]},
{title:"Secret Training",tags:["haki","fighter"],text:"An old traveler notices something in your spirit and offers brutal training.",choices:[["Accept the training",{discipline:2,hakiXP:2,health:-10},"Accepted brutal spirit training."],["Ask for technique instead",{intelligence:1,hakiXP:1},"Studied spiritual technique."],["Rob the traveler",{berries:4000,infamy:1,honor:-2},"Robbed an old traveler."],["Decline politely",{honor:1},"Declined secret training politely."]]},
{title:"Crew Dispute",tags:["crew"],text:"Two allies argue over supplies and loyalty. The crew watches how you handle it.",choices:[["Mediate fairly",{charisma:1,honor:1,crewLoyalty:1},"Mediated a crew dispute."],["Punish both",{discipline:2,infamy:1,crewLoyalty:-1},"Punished both sides of a crew dispute."],["Take a side",{charisma:1,crewLoyalty:-1},"Took a side in a crew dispute."],["Ignore it",{crewLoyalty:-2},"Ignored a growing crew dispute."]]},
{title:"Auction House",tags:["secret","money","noble"],text:"A hidden auction sells weapons, maps, and people. Guards patrol every exit.",choices:[["Free a prisoner",{honor:3,revolutionaryRep:1,heat:2,companionRoll:1},"Freed a prisoner from an auction."],["Steal a rare item",{mystery:1,sneak:1,heat:2},"Stole a rare auction item."],["Bid quietly",{berries:-6000,itemRoll:1},"Bid at the auction."],["Report it to Marines",{marineRep:2,honor:1},"Reported a black auction."]]},
{title:"Fruit User Duel",tags:["fighter","fruit"],text:"A Devil Fruit user challenges you, showing off powers in the middle of town.",choices:[["Duel them publicly",{strength:1,fruitMastery:1,bounty:8000,health:-10},"Dueled a Devil Fruit user publicly."],["Study their power",{intelligence:2,hakiXP:1},"Studied an enemy Fruit power."],["Ambush them later",{sneak:2,infamy:1,bounty:5000},"Ambushed a Devil Fruit user."],["Recruit them",{charisma:2,crewRoll:1},"Tried to recruit a Fruit user."]]},
{title:"Poneglyph Rubbing",tags:["secret","government"],text:"You find an ancient rubbing hidden inside a sealed wall. Reading it could invite disaster.",choices:[["Study it carefully",{intelligence:2,mystery:2,heat:2},"Studied a forbidden rubbing."],["Sell it to the underworld",{berries:25000,infamy:2,heat:3},"Sold a forbidden historical clue."],["Destroy it",{discipline:1,honor:-1},"Destroyed a dangerous clue."],["Hide it on your ship",{mystery:1,sneak:1,heat:1},"Hid the rubbing away."]]},
{title:"Emperor Scout",tags:["newworld","fame","rival"],text:"A scout from a terrifying New World power offers you protection in exchange for loyalty.",choices:[["Refuse proudly",{honor:2,bounty:30000,rivalRoll:1},"Refused an emperor scout."],["Accept temporarily",{infamy:1,berries:20000},"Accepted an ugly alliance."],["Attack the scout",{strength:2,hakiXP:2,bounty:50000,health:-20},"Attacked an emperor scout."],["Gather intel",{sneak:2,mystery:1},"Gathered intel on an emperor crew."]]},
{title:"Prison Transport",tags:["marine","government"],text:"A prison transport ship anchors nearby. Someone important is locked inside.",choices:[["Break them out",{revolutionaryRep:2,bounty:25000,heat:3,companionRoll:1},"Raided a prison transport."],["Guard the ship",{marineRep:2,berries:8000},"Helped guard a prison transport."],["Steal the manifest",{sneak:2,mystery:1},"Stole a prison manifest."],["Sink the ship",{infamy:4,bounty:60000,heat:5,honor:-4},"Sank a prison transport."]]}
];

let p=null,currentTab="life";

function newPlayer(){return{
 name:"Rookie",age:10,actionsLeft:5,origin:"—",path:"Undecided",rank:"None",region:"Home Sea",island:"—",portrait:"☠️",epithet:"No Epithet",
 berries:500,bounty:0,fruit:"None",fruitType:"",fruitMastery:0,fruitSkills:[],haki:"Dormant",hakiXP:0,hakiSkills:[],health:100,mood:50,
 strength:1,speed:1,durability:1,intelligence:1,charisma:1,navigation:0,sneak:0,discipline:0,sword:0,medicine:0,craft:0,marksmanship:0,
 honor:0,infamy:0,marineRep:0,revolutionaryRep:0,heat:0,crew:[],rivals:[],relationships:[],items:[],mystery:0,quest:null,
 ship:{name:"None",hp:0,maxHp:0,cannons:0,cargo:0,xp:0,tier:0},businesses:[],debt:0,legacy:0,
 log:[],newspapers:[],dead:false,patchRead:false
}}

function addLog(t){p.log.unshift(`Age ${p.age}: ${t}`);p.log=p.log.slice(0,140)}
function addNews(headline,body){p.newspapers.unshift({age:p.age,headline,body});p.newspapers=p.newspapers.slice(0,30)}
function notice(title,msg){$("screen").innerHTML=`<h2>${title}</h2><div class="notice">${msg}</div><div class="choices"><button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function spendAction(n=1){if(p.actionsLeft<n){notice("Out of Energy","You are out of energy for this age. Press Age Up to continue.");return false}p.actionsLeft-=n;p.mood=clamp(p.mood-2*n,0,100);return true}
function statSum(keys){return keys.reduce((a,k)=>a+(p[k]||0),0)}
function crewBonus(role){return p.crew.filter(c=>String(c.role).toLowerCase().includes(role)).length}
function currentIsland(){return DATA.islands.find(i=>i.name===p.island)||DATA.islands[0]}
function currentRegion(){return DATA.regions.find(r=>r.name===p.region)||DATA.regions[0]}

function apply(e){
 for(const[k,v]of Object.entries(e)){
  if(k==="fruitRoll"){fruitRoll();continue}
  if(k==="companionRoll"){gainCompanion();continue}
  if(k==="rivalRoll"){gainRival();continue}
  if(k==="crewRoll"){gainCrewRole();continue}
  if(k==="mystery"){p.mystery+=v;let item=pick(DATA.mysteries);p.items.push(item);if(!p.quest)p.quest=pick(DATA.quests);addLog(`Found clue: ${item}.`);continue}
  if(k==="shipDamage"){damageShip(Math.abs(v));continue}
  if(k==="shipXP"){p.ship.xp+=v;continue}
  if(k==="hakiXP"){gainHaki(v);continue}
  if(k==="crewLoss"){loseCrew();continue}
  if(k==="crewLoyalty"){p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+v,0,10));continue}
  if(k==="itemRoll"){gainItem();continue}
  if(k==="fruitMastery"&&p.fruit==="None")continue;
  p[k]=(p[k]||0)+v;
  if(["berries","bounty","health","mood","heat"].includes(k))p[k]=Math.max(0,p[k]);
 }
 if(p.health<=0)survivalCheck();
}

function fruitRoll(){if(p.fruit!=="None"){addLog("Found a Devil Fruit, but already had powers.");return}
 if(Math.random()<.58){let f=pick(DATA.fruits);p.fruit=f.name;p.fruitType=f.type;p.fruitMastery=1;p.fruitSkills=[f.tree[0]];addLog(`Ate the ${f.name}: ${f.power}. Unlocked ${f.tree[0]}.`);addNews("STRANGE FRUIT INCIDENT",`${p.name} reportedly gained unnatural powers after eating a mysterious fruit.`)}
 else addLog("The fruit was fake or rotten. Nothing happened.")
}
function fruitObj(){return DATA.fruits.find(f=>f.name===p.fruit)}
function trainFruitSkill(){if(p.fruit==="None"){notice("No Devil Fruit","You do not have a Devil Fruit.");return}let f=fruitObj();let next=f.tree[p.fruitSkills.length];if(!next){p.fruitMastery++;addLog(`${p.fruit} mastery improved beyond its known tree.`);return}p.fruitSkills.push(next);p.fruitMastery++;addLog(`Unlocked Devil Fruit skill: ${next}.`);if(next.includes("Awakening"))addNews("AWAKENED POWER SHAKES THE SEA",`${p.name}'s Devil Fruit power has reportedly reached an awakened state.`)}
function gainHaki(n){p.hakiXP+=n;if(p.haki==="Dormant"&&p.hakiXP>=3){p.haki=pick(["Observation Haki","Armament Haki",...(Math.random()<.08?["Conqueror's Haki - Rare Spark"]:[])]);p.hakiSkills=[DATA.hakiTrees[p.haki][0]];addLog(`Awakened ${p.haki}.`);addNews("ROOKIE SHOWS STRANGE WILLPOWER",`${p.name} displayed signs of unusual spiritual force.`)}else if(p.haki!=="Dormant"){let tree=DATA.hakiTrees[p.haki.replace("Advanced ","")]||DATA.hakiTrees[p.haki]; if(tree){let next=tree[p.hakiSkills.length]; if(next && p.hakiXP>=p.hakiSkills.length*3+3){p.hakiSkills.push(next);addLog(`Unlocked Haki skill: ${next}.`); if(next==="Future Sight"||next==="Internal Destruction"||next==="Kingly Coating")p.haki="Advanced "+p.haki.replace("Advanced ","")}}}}
function gainCompanion(){let c=deep(pick(DATA.companions));p.crew.push(c);apply(c.bonus);addLog(`Gained companion: ${c.name}, ${c.role}.`)}
function gainCrewRole(){let roles=["Navigator","Cook","Doctor","Shipwright","Sniper","Swordsman","Musician","Quartermaster","Lookout","Archaeologist","Scout","Helmsman","Informant"];let c={name:pick(DATA.names),role:pick(roles),loyalty:4+Math.floor(Math.random()*5),salary:400+Math.floor(Math.random()*1000),bonus:{}};p.crew.push(c);addLog(`Recruited ${c.name}, the ${c.role}.`)}
function gainRival(){let r=pick(DATA.rivals);if(!p.rivals.includes(r)){p.rivals.push(r);addLog(`Made a rival: ${r}.`);addNews("NEW RIVALRY ON THE SEAS",`${p.name} has reportedly crossed paths with a ${r}.`)}}
function loseCrew(){if(!p.crew.length)return;let lost=p.crew.splice(Math.floor(Math.random()*p.crew.length),1)[0];addLog(`${lost.name||lost} was lost because of your decision.`)}
function gainItem(){let i=pick(DATA.items);p.items.push(i.name);apply(i.effect);addLog(`Acquired item: ${i.name}.`)}
function damageShip(amount){if(p.ship.name==="None")return;p.ship.hp=clamp(p.ship.hp-amount,0,p.ship.maxHp);if(p.ship.hp<=0){addLog(`${p.ship.name} was destroyed.`);p.ship={name:"None",hp:0,maxHp:0,cannons:0,cargo:0,xp:0,tier:0}}}
function survivalCheck(){let chance=(p.durability+p.discipline+p.medicine+crewBonus("doctor")*3)/30;if(Math.random()<chance){p.health=15;addLog("Barely survived a near-death event.");injuryRoll()}else{p.dead=true;p.health=0;ending("Death at Sea")}}
function injuryRoll(){let injuries=[["Bruised ribs",{durability:-1}],["Cut above the eye",{charisma:-1}],["Sprained ankle",{speed:-1}],["Broken arm",{strength:-1,sword:-1}],["Concussion",{intelligence:-1}],["Deep scar",{charisma:1}],["Damaged lung",{durability:-2}],["Burned hand",{craft:-1,sword:-1}],["Damaged reputation",{charisma:-1,honor:-1}]];let inj=pick(injuries);p.items.push("Injury: "+inj[0]);apply(inj[1]);addLog(`Suffered injury: ${inj[0]}.`)}

function passiveYear(){
 let s=pick(["strength","speed","durability","intelligence","charisma"]);p[s]++;
 p.health=clamp(p.health+12+crewBonus("doctor")*3,0,100);p.mood=clamp(p.mood+18+crewBonus("cook")*3,0,100);
 p.actionsLeft=5+Math.floor((p.discipline+p.durability)/6);
 let expenses=p.crew.reduce((a,c)=>a+(c.salary||0),0); let income=p.businesses.reduce((a,b)=>a+b.income,0);
 p.berries+=income-expenses;
 if(expenses>0)addLog(`Paid crew expenses: ฿${fmt(expenses)}.`);
 if(income>0)addLog(`Collected business income: ฿${fmt(income)}.`);
 if(p.berries<0){p.debt+=Math.abs(p.berries);p.berries=0;addLog(`Went into debt. Total debt: ฿${fmt(p.debt)}.`)}
 if(p.debt>0){let interest=Math.floor(p.debt*.08);p.debt+=interest;addLog(`Debt interest added: ฿${fmt(interest)}.`)}
 if(p.fruit!=="None"&&Math.random()<.2)trainFruitSkill();
 if(p.age>=15&&p.haki==="Dormant"){let chance=Math.max(.04,(p.discipline+p.honor+p.infamy+p.strength+p.hakiXP)/48);if(Math.random()<chance)gainHaki(3)}
 if(p.heat>=6&&Math.random()<.35)marinePursuit();
 if(p.mystery>=5&&p.quest)questResolution();
 if(lowLoyaltyRisk())mutinyCheck();
 if(p.age%5===0)yearlyNews();
 promoteCheck();
}
function ageUp(){p.age++;passiveYear();addLog("A year passed.");if(p.age===16&&p.path==="Undecided")choosePath();else if(Math.random()<.65)showEvent(chooseWeightedEvent());else showMenu()}
function yearlyNews(){addNews("WORLD ECONOMIC JOURNAL",`${p.name}, known as ${p.epithet}, has reached age ${p.age}. Current bounty: ฿${fmt(p.bounty)}.`)}
function marinePursuit(){pick([()=>{p.bounty+=15000;p.health-=15;addLog("Marine pursuit forced a violent escape.")},()=>{p.berries=Math.max(0,p.berries-5000);p.heat-=2;addLog("Bribed your way out of a Marine dragnet.")},()=>{gainRival();p.heat+=1;addLog("A Marine rival was assigned to your case.")}])()}
function questResolution(){addNews("MYSTERY UNRAVELED",`${p.name} made major progress in ${p.quest.name}: ${p.quest.theme}.`);p.bounty+=10000;p.honor+=1;p.infamy+=1;p.mystery=0;p.legacy+=3;addLog(`Resolved a chapter of ${p.quest.name}.`);p.quest=Math.random()<.55?pick(DATA.quests):null}
function lowLoyaltyRisk(){return p.crew.length>=3 && p.crew.some(c=>c.loyalty<=1)}
function mutinyCheck(){if(Math.random()<.25){let deserters=p.crew.filter(c=>c.loyalty<=2);p.crew=p.crew.filter(c=>c.loyalty>2);p.infamy++;p.mood-=10;addLog(`Mutiny/desertion: ${deserters.map(d=>d.name).join(", ")} left the crew.`)}}
function promoteCheck(){if(p.path==="Undecided")return;let ranks=DATA.careers[p.path]||["Rookie"];let score=p.bounty/50000+p.marineRep*1.5+p.revolutionaryRep*1.5+p.berries/75000+p.infamy+p.honor+p.crew.length+p.legacy;let idx=clamp(Math.floor(score/7),0,ranks.length-1);if(ranks[idx]!==p.rank){p.rank=ranks[idx];addLog(`Rank changed: ${p.rank}.`);addNews("RANK UPDATE",`${p.name} is now recognized as ${p.rank} in the ${p.path} path.`)}}

function combatScore(mode="duel"){
 let score=p.strength*2+p.speed+p.durability+p.sword*2+p.marksmanship*1.5+p.hakiSkills.length*4+p.fruitMastery*3+p.crew.length*1.5;
 if(mode==="naval")score+=p.ship.cannons*5+p.ship.tier*8+crewBonus("navigator")*4+crewBonus("sniper")*3;
 if(mode==="escape")score+=p.speed*2+p.sneak*2+p.navigation+crewBonus("navigator")*3;
 return score;
}
function resolveCombat(kind,targetPower,reward){
 let score=combatScore(kind)+Math.random()*20;let enemy=targetPower+Math.random()*20;
 if(score>=enemy){apply(reward||{});addLog(`Won ${kind} encounter. Score ${Math.round(score)} vs ${Math.round(enemy)}.`);return true}
 let dmg=Math.floor((enemy-score)/2)+10;p.health-=dmg;p.bounty+=kind==="naval"?8000:3000;addLog(`Lost or barely escaped ${kind} encounter. Took ${dmg} damage.`);if(Math.random()<.35)injuryRoll();if(p.health<=0)survivalCheck();return false;
}

function chooseWeightedEvent(){
 let pool=[...EVENTS];let isl=currentIsland();pool=pool.concat(EVENTS.filter(e=>e.tags.some(t=>isl.tags.includes(t))));
 if(p.ship.name==="None")pool=pool.filter(e=>!e.tags.includes("sea")||Math.random()<.35);
 if(p.crew.length===0)pool=pool.filter(e=>!e.tags.includes("crew")||Math.random()<.25);
 if(p.region!=="New World")pool=pool.filter(e=>!e.tags.includes("newworld"));
 if(p.path==="Marine")pool.push(...EVENTS.filter(e=>e.tags.includes("marine")));
 if(p.path==="Revolutionary")pool.push(...EVENTS.filter(e=>e.tags.includes("revolutionary")||e.tags.includes("freedom")));
 if(p.path==="Pirate")pool.push(...EVENTS.filter(e=>e.tags.includes("sea")||e.tags.includes("money")));
 return pick(pool);
}
function showEvent(e){$("screen").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p><div class="choices">${e.choices.map((c,i)=>`<button onclick="chooseEvent(${EVENTS.indexOf(e)},${i})">${c[0]}</button>`).join("")}</div>`;render()}
function chooseEvent(ei,ci){let c=EVENTS[ei].choices[ci];apply(c[1]);addLog(c[2]);postEventConsequences();showMenu()}
function postEventConsequences(){if(Math.random()<.12&&p.health<70)injuryRoll();if(p.bounty>0&&Math.random()<.18)addNews("BOUNTY UPDATED",`${p.name}, ${p.epithet}, now carries a bounty of ฿${fmt(p.bounty)}.`);if(p.infamy>=10&&["No Epithet","the Unwritten"].includes(p.epithet)){p.epithet=pick(["the Menace","Red-Hand","the Problem","Stormbringer","Black Wake"]);addLog(`Earned epithet: ${p.epithet}.`)}if(p.honor>=10&&["No Epithet","the Unwritten"].includes(p.epithet)){p.epithet=pick(["the Kind Blade","Harbor Saint","the Shield","the Gentle Storm","Dawn Hand"]);addLog(`Earned epithet: ${p.epithet}.`)}}

function setup(){
 p=newPlayer();
 $("screen").innerHTML=`<h2>Start a New Life</h2><p><b>v1.0 Grand Line Foundation</b> adds regions, rank progression, combat, naval battles, businesses, legacy, power trees, relationships, prisons, and deeper world simulation.</p><input id="nameInput" placeholder="Character name, or leave blank for random"><div class="choices"><button class="primary" onclick="randomStart()">Random Life</button><button onclick="chooseOriginScreen()">Choose Origin</button>${localStorage.getItem("gpls_save_v10")?'<button onclick="loadGame()">Load Saved Life</button>':''}<button class="danger" onclick="clearSave()">Clear Save</button></div>`;
 render();
}
function randomStart(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(DATA.names);let o=pick(DATA.origins);startWithOrigin(o)}
function chooseOriginScreen(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(DATA.names);$("screen").innerHTML=`<h2>Choose Origin</h2><p>Your origin gives bonuses and shapes your event pool.</p><div class="choices">${DATA.origins.map((o,i)=>`<button onclick="startWithOrigin(DATA.origins[${i}])">${o[1]} ${o[0]}</button>`).join("")}</div>`}
function startWithOrigin(o){p.origin=o[0];p.portrait=o[1];let starts=DATA.islands.filter(i=>i.region==="Home Sea");let isl=pick(starts);p.region=isl.region;p.island=isl.name;apply(o[2]);p.epithet=pick(["the Unwritten","the Small Storm","Iron Will","Chainbreaker","Sea Rat","the Runaway","the Quiet Spark","No-Name","the Dawn Rookie"]);addLog(`Born as a ${p.origin}, starting on ${p.island}.`);if(Math.random()<.25){p.items.push(pick(DATA.mysteries));p.mystery=1;addLog("Started life already carrying a strange clue.")}showMenu()}
function choosePath(){$("screen").innerHTML=`<h2>Age 16: Choose Your Path</h2><p>This shapes ranks, events, promotion, enemies, and endings.</p><div class="choices">${DATA.paths.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`).join("")}</div>`;render()}
function setPath(i){let x=DATA.paths[i];p.path=x[0];p.portrait=x[1];p.rank=DATA.careers[p.path][0];apply(x[2]);addLog(`Chose the path of ${p.path}.`);showMenu()}

function showMenu(){
 render(); if(p.dead)return; if(p.age>=80)return ending();
 if(p.age===16&&p.path==="Undecided")return choosePath();
 $("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2><p><b>${p.actionsLeft}</b> energy left. Region danger: <b>${currentRegion().danger}/10</b>. Choose what to do this year.</p>
 <div class="menuGrid">
 <button class="primary" onclick="ageUp()">Age Up</button>
 <button onclick="randomEventAction()">Random Event</button>
 <button onclick="activitiesMenu()">Activities</button>
 <button onclick="trainingMenu()">Training</button>
 <button onclick="travelMenu()">Travel</button>
 <button onclick="combatMenu()">Combat</button>
 <button onclick="crewMenu()">Crew</button>
 <button onclick="careerMenu()">Career</button>
 <button onclick="assetsMenu()">Assets</button>
 <button onclick="blackMarketMenu()">Black Market</button>
 <button onclick="relationshipsMenu()">Relationships</button>
 <button onclick="legacyMenu()">Legacy</button>
 <button onclick="manualSave()">Save</button>
 </div>`;
}

function submenu(title,desc,buttons){$("screen").innerHTML=`<h2>${title}</h2><p>${desc}</p><div class="choices">${buttons.join("")}<button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function randomEventAction(){if(!spendAction())return;showEvent(chooseWeightedEvent())}
function activitiesMenu(){submenu("Activities","Non-career activities. Most use 1 energy.",[
`<button onclick="work()">Work for Berries</button>`,`<button onclick="explore()">Explore Island</button>`,`<button onclick="rest()">Rest / Recover</button>`,`<button onclick="gambleMenu()">Gamble</button>`,`<button onclick="investigate()">Investigate Mystery</button>`,`<button onclick="newspaperInterview()">Newspaper Interview</button>`])}
function trainingMenu(){submenu("Training","Improve stats, Haki, fruit mastery, or combat styles.",[
`<button onclick="train()">Train Body</button>`,`<button onclick="study()">Study / Scheme</button>`,`<button onclick="fruitTrain()">Train Devil Fruit</button>`,`<button onclick="hakiTrain()">Haki Training</button>`,`<button onclick="swordTrain()">Sword Training</button>`,`<button onclick="shootTrain()">Marksmanship Training</button>`])}
function travelMenu(){let regionButtons=DATA.regions.map((r,i)=>`<button onclick="travelRegion(${i})">${r.name} — Danger ${r.danger}/10</button>`);submenu("Travel","Sail islands or attempt to advance regions. Better ship and navigation matter.",[`<button onclick="sail()">Sail to Nearby Island</button>`,...regionButtons])}
function combatMenu(){submenu("Combat","Risky actions with bigger rewards.",[
`<button onclick="huntBounty()">Hunt Bounty</button>`,`<button onclick="duelRival()">Duel Rival</button>`,`<button onclick="navalBattle()">Seek Naval Battle</button>`,`<button onclick="raidTarget()">Raid Target</button>`,`<button onclick="escapeHeat()">Escape Marine Heat</button>`])}
function crewMenu(){submenu("Crew","Recruit, manage, bond, or discipline your crew.",[
`<button onclick="recruit()">Recruit Crew</button>`,`<button onclick="crewBond()">Spend Time with Crew</button>`,`<button onclick="payBonus()">Pay Crew Bonus</button>`,`<button onclick="disciplineCrew()">Discipline Crew</button>`,`<button onclick="fireLowest()">Dismiss Lowest Loyalty Crew</button>`])}
function careerMenu(){submenu("Career","Build your path and reputation.",[
`<button onclick="careerWork()">Career Mission</button>`,`<button onclick="seekPromotion()">Seek Promotion / Recognition</button>`,`<button onclick="changePath()">Change Career Path</button>`,`<button onclick="layLow()">Lay Low</button>`])}
function assetsMenu(){submenu("Assets","Buy ships, businesses, repairs, upgrades, and items.",[
`<button onclick="shipyard()">Shipyard</button>`,`<button onclick="businessMenu()">Businesses</button>`,`<button onclick="shop()">Item Shop</button>`,`<button onclick="payDebt()">Pay Debt</button>`])}
function blackMarketMenu(){submenu("Black Market","High-risk, high-reward options.",[
`<button onclick="blackFruit()">Search for Devil Fruit</button>`,`<button onclick="buySecret()">Buy Secret Intel</button>`,`<button onclick="smuggleRun()">Smuggling Run</button>`,`<button onclick="bribeOfficials()">Bribe Officials</button>`])}
function relationshipsMenu(){submenu("Relationships","Create or deepen relationships.",[
`<button onclick="makeFriend()">Make Friend</button>`,`<button onclick="findMentor()">Find Mentor</button>`,`<button onclick="romance()">Romance</button>`,`<button onclick="betrayContact()">Betray Contact</button>`])}
function legacyMenu(){submenu("Legacy","Long-term progression and inheritance.",[
`<button onclick="writeWill()">Write Legacy Will</button>`,`<button onclick="trainSuccessor()">Train Successor</button>`,`<button onclick="retire()">Retire / End Life</button>`])}

function work(){if(!spendAction())return;let pay=1500+Math.floor(Math.random()*6000)+(p.rank!=="None"?1000:0);apply({berries:pay,charisma:Math.random()<.5?1:0});addLog(`Worked and earned ฿${fmt(pay)}.`);showMenu()}
function train(){if(!spendAction())return;apply({strength:1,speed:Math.random()<.5?1:0,durability:Math.random()<.5?1:0,discipline:1,health:-4});addLog("Spent time training.");showMenu()}
function study(){if(!spendAction())return;apply({intelligence:2,navigation:Math.random()<.5?1:0,hakiXP:Math.random()<.25?1:0});addLog("Studied maps, history, tactics, and rumors.");showMenu()}
function swordTrain(){if(!spendAction())return;apply({sword:2,discipline:1,health:-5});addLog("Trained swordsmanship.");showMenu()}
function shootTrain(){if(!spendAction())return;apply({marksmanship:2,speed:1,health:-4});addLog("Trained marksmanship.");showMenu()}
function fruitTrain(){if(!spendAction())return;if(p.fruit==="None"){notice("No Devil Fruit","You do not have a Devil Fruit.");return}trainFruitSkill();p.health=clamp(p.health-5,0,100);showMenu()}
function hakiTrain(){if(!spendAction())return;apply({hakiXP:1,discipline:1,health:-6});addLog("Focused on willpower and Haki training.");showMenu()}
function explore(){if(!spendAction())return;if(Math.random()<.65)showEvent(chooseWeightedEvent());else{let found=pick(["quiet shrine","hidden tavern","abandoned camp","strange footprint","old battlefield","locked cellar","underground tunnel","washed-up crate"]);addLog(`Explored ${p.island} and found a ${found}.`);apply({mystery:Math.random()<.35?1:0,berries:Math.random()<.3?1000:0});showMenu()}}
function rest(){if(!spendAction())return;p.health=clamp(p.health+30,0,100);p.mood=clamp(p.mood+15,0,100);if(p.berries>500)p.berries-=500;addLog("Rested and recovered.");showMenu()}
function investigate(){if(!spendAction())return;apply({mystery:1,intelligence:1,heat:Math.random()<.25?1:0});addLog("Investigated ongoing mysteries.");showMenu()}
function newspaperInterview(){if(!spendAction())return;let mode=pick(["honest","myth","silent"]);if(mode==="honest"){p.honor++;p.charisma++;addNews("ROOKIE SPEAKS",`${p.name} gave an unusually honest interview.`)}else if(mode==="myth"){p.infamy++;p.charisma+=2;addNews("A LEGEND IS BORN?",`${p.name} exaggerated their exploits, and people believed it.`)}else{p.discipline++;addLog("Refused to comment to the newspaper.")}showMenu()}
function gambleMenu(){submenu("Gambling Den","Risk berries for a chance at profit. Uses 1 energy.",[`<button onclick="doGamble(500)">Low Table — ฿500</button>`,`<button onclick="doGamble(2500)">Mid Table — ฿2,500</button>`,`<button onclick="doGamble(10000)">High Roller — ฿10,000</button>`])}
function doGamble(amount){if(!spendAction())return;if(p.berries<amount){notice("Not enough berries","You cannot cover the bet.");return}p.berries-=amount;let skill=(p.charisma+p.sneak+p.intelligence)/30;if(Math.random()<.42+skill){let win=amount*(2+Math.floor(Math.random()*3));p.berries+=win;addLog(`Won ฿${fmt(win)} gambling.`)}else{addLog(`Lost ฿${fmt(amount)} gambling.`);if(Math.random()<.2)gainRival()}showMenu()}
function sail(){if(!spendAction())return;if(p.ship.name==="None"){addLog("Bought passage to another island.");p.berries=Math.max(0,p.berries-1000)}else{p.ship.xp++;if(Math.random()<.25)damageShip(5+Math.floor(Math.random()*20))}let list=DATA.islands.filter(i=>i.region===p.region);let isl=pick(list);p.island=isl.name;addLog(`Sailed to ${isl.name}: ${isl.desc}.`);if(Math.random()<.35)showEvent(chooseWeightedEvent());else showMenu()}
function travelRegion(i){if(!spendAction())return;let r=DATA.regions[i];let ok=p.navigation+crewBonus("navigator")*2>=r.req.nav && p.ship.maxHp>=r.req.ship;if(!ok){p.health-=10;damageShip(20);addLog(`Failed to safely reach ${r.name}. Need Navigation ${r.req.nav} and ship HP ${r.req.ship}.`);showMenu();return}p.region=r.name;let islands=DATA.islands.filter(x=>x.region===r.name);p.island=pick(islands).name;addLog(`Reached ${r.name}. ${r.desc}`);addNews("NEW SEA REACHED",`${p.name} has entered ${r.name}.`);showMenu()}
function huntBounty(){if(!spendAction())return;let power=25+currentRegion().danger*8;resolveCombat("duel",power,{berries:9000+currentRegion().danger*3000,marineRep:1,strength:1});showMenu()}
function duelRival(){if(!spendAction())return;if(!p.rivals.length)gainRival();let power=30+currentRegion().danger*10+p.rivals.length*3;let win=resolveCombat("duel",power,{bounty:12000,infamy:1,hakiXP:1});if(win&&Math.random()<.35){let r=p.rivals.shift();addLog(`Defeated rival permanently: ${r}.`);p.legacy+=2}showMenu()}
function navalBattle(){if(!spendAction())return;if(p.ship.name==="None"){notice("No Ship","You need a ship for naval battles.");return}let power=30+currentRegion().danger*12;resolveCombat("naval",power,{berries:15000,bounty:18000,shipXP:2,infamy:1});damageShip(Math.floor(Math.random()*15));showMenu()}
function raidTarget(){if(!spendAction())return;let power=35+currentRegion().danger*10;resolveCombat("duel",power,{berries:22000,bounty:25000,infamy:2,heat:2});showMenu()}
function escapeHeat(){if(!spendAction())return;let power=25+p.heat*8;let win=resolveCombat("escape",power,{heat:-3,sneak:1});if(win)p.heat=clamp(p.heat-3,0,99);showMenu()}
function recruit(){if(!spendAction())return;if(Math.random()<.55+(p.charisma/30)){gainCrewRole();p.mood+=3}else{addLog("Failed to recruit anyone useful.");if(Math.random()<.25)gainRival()}showMenu()}
function crewBond(){if(!spendAction())return;if(!p.crew.length){notice("No Crew","You have no crew yet.");return}p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+1,0,10));p.mood=clamp(p.mood+8,0,100);addLog("Spent time bonding with the crew.");showMenu()}
function payBonus(){if(!spendAction())return;if(!p.crew.length){notice("No Crew","You have no crew yet.");return}let cost=p.crew.length*2000;if(p.berries<cost){notice("Not enough berries",`Need ฿${fmt(cost)}.`);return}p.berries-=cost;p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+2,0,10));addLog("Paid crew bonuses.");showMenu()}
function disciplineCrew(){if(!spendAction())return;p.crew.forEach(c=>c.loyalty=clamp(c.loyalty-1,0,10));p.discipline+=2;p.infamy++;addLog("Disciplined the crew harshly.");showMenu()}
function fireLowest(){if(!spendAction())return;if(!p.crew.length)return notice("No Crew","No one to dismiss.");p.crew.sort((a,b)=>a.loyalty-b.loyalty);let c=p.crew.shift();addLog(`Dismissed ${c.name}.`);showMenu()}
function careerWork(){if(!spendAction())return;let reward={};if(p.path==="Marine")reward={marineRep:2,berries:5000,heat:-1};else if(p.path==="Pirate")reward={bounty:12000,infamy:1,berries:8000};else if(p.path==="Revolutionary")reward={revolutionaryRep:2,honor:1,heat:1};else reward={berries:7000,charisma:1};apply(reward);addLog(`Completed a ${p.path} career mission.`);promoteCheck();showMenu()}
function seekPromotion(){if(!spendAction())return;promoteCheck();p.charisma++;addLog("Sought recognition and advancement.");showMenu()}
function changePath(){submenu("Change Career","Choose a new life path.",DATA.paths.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`))}
function layLow(){if(!spendAction())return;p.heat=clamp(p.heat-3,0,99);p.bounty=Math.max(0,p.bounty-1000);p.mood-=3;addLog("Laid low to reduce heat.");showMenu()}
function shipyard(){submenu("Shipyard","Buy, repair, or upgrade ships.",[...DATA.ships.map((s,i)=>`<button onclick="buyShip(${i})">${s.name} — ฿${fmt(s.cost)} · HP ${s.hp} · Cannons ${s.cannons}</button>`),`<button onclick="repairShip()">Repair Current Ship</button>`,`<button onclick="upgradeShip()">Upgrade Current Ship</button>`])}
function buyShip(i){let s=DATA.ships[i];if(p.berries<s.cost){notice("Not enough berries",`Need ฿${fmt(s.cost)}.`);return}p.berries-=s.cost;p.ship={name:s.name,hp:s.hp,maxHp:s.hp,cannons:s.cannons,cargo:s.cargo,xp:0,tier:s.tier};addLog(`Acquired ship: ${s.name}.`);showMenu()}
function repairShip(){if(p.ship.name==="None")return notice("No Ship","You do not own a ship.");let cost=(p.ship.maxHp-p.ship.hp)*120;if(p.berries<cost)return notice("Not enough berries",`Need ฿${fmt(cost)}.`);p.berries-=cost;p.ship.hp=p.ship.maxHp;addLog(`Repaired ${p.ship.name}.`);showMenu()}
function upgradeShip(){if(p.ship.name==="None")return notice("No Ship","You do not own a ship.");let cost=10000+p.ship.cannons*5000;if(p.berries<cost)return notice("Not enough berries",`Need ฿${fmt(cost)}.`);p.berries-=cost;p.ship.cannons++;p.ship.maxHp+=15;p.ship.hp+=15;p.ship.tier+=.2;addLog(`Upgraded ${p.ship.name}.`);showMenu()}
function businessMenu(){submenu("Businesses","Buy assets that generate yearly income, but may create risk.",DATA.businesses.map((b,i)=>`<button onclick="buyBusiness(${i})">${b.name} — ฿${fmt(b.cost)} · Income ฿${fmt(b.income)}/yr</button>`))}
function buyBusiness(i){if(!spendAction())return;let b=DATA.businesses[i];if(p.berries<b.cost)return notice("Not enough berries",`Need ฿${fmt(b.cost)}.`);p.berries-=b.cost;p.businesses.push(deep(b));addLog(`Bought business: ${b.name}.`);showMenu()}
function shop(){submenu("Item Shop","Buy useful items. Purchases use 1 energy.",DATA.items.map((it,i)=>`<button onclick="buyItem(${i})">${it.name} — ฿${fmt(it.cost)}</button>`))}
function buyItem(i){if(!spendAction())return;let it=DATA.items[i];if(p.berries<it.cost)return notice("Not enough berries",`Need ฿${fmt(it.cost)}.`);p.berries-=it.cost;p.items.push(it.name);apply(it.effect);addLog(`Bought ${it.name}.`);showMenu()}
function payDebt(){if(!spendAction())return;if(p.debt<=0)return notice("No Debt","You have no debt.");let amount=Math.min(p.berries,p.debt);p.berries-=amount;p.debt-=amount;addLog(`Paid ฿${fmt(amount)} toward debt.`);showMenu()}
function blackFruit(){if(!spendAction())return;if(p.berries<15000)return notice("Not enough berries","Need ฿15,000 to search black market fruit sellers.");p.berries-=15000;apply({fruitRoll:1,heat:1});showMenu()}
function buySecret(){if(!spendAction())return;if(p.berries<8000)return notice("Not enough berries","Need ฿8,000.");p.berries-=8000;apply({mystery:1});showMenu()}
function smuggleRun(){if(!spendAction())return;let power=25+currentRegion().danger*8;let win=resolveCombat("escape",power,{berries:25000,infamy:1,heat:2});if(win)addLog("Completed smuggling run.");showMenu()}
function bribeOfficials(){if(!spendAction())return;let cost=5000+p.heat*2000;if(p.berries<cost)return notice("Not enough berries",`Need ฿${fmt(cost)}.`);p.berries-=cost;p.heat=clamp(p.heat-4,0,99);addLog("Bribed officials to reduce heat.");showMenu()}
function makeFriend(){if(!spendAction())return;let rel={name:pick(DATA.names),type:"Friend",bond:3+Math.floor(Math.random()*4)};p.relationships.push(rel);p.mood+=5;addLog(`Made a friend: ${rel.name}.`);showMenu()}
function findMentor(){if(!spendAction())return;let rel={name:pick(DATA.names),type:"Mentor",bond:4};p.relationships.push(rel);apply({discipline:1,hakiXP:1});addLog(`Found a mentor: ${rel.name}.`);showMenu()}
function romance(){if(!spendAction())return;let rel={name:pick(DATA.names),type:"Romance",bond:3+Math.floor(Math.random()*5)};p.relationships.push(rel);p.mood+=10;addLog(`Started a romance with ${rel.name}.`);showMenu()}
function betrayContact(){if(!spendAction())return;if(!p.relationships.length)return notice("No Contacts","You have no relationships to betray.");let rel=p.relationships.shift();p.berries+=12000;p.infamy+=2;p.mood-=10;addLog(`Betrayed ${rel.name} for money.`);showMenu()}
function writeWill(){if(!spendAction())return;p.legacy+=2;p.discipline++;addLog("Wrote a legacy will.");showMenu()}
function trainSuccessor(){if(!spendAction())return;p.legacy+=3;p.mood+=4;p.honor++;addLog("Trained a possible successor.");showMenu()}
function retire(){ending("Retired Legend")}

function render(){
 if(!p)return;
 $("portrait").textContent=p.portrait;$("posterName").textContent=p.name.toUpperCase();$("posterBounty").textContent="฿"+fmt(p.bounty);$("epithet").textContent=p.epithet;
 $("age").textContent=p.age;$("energy").textContent=p.actionsLeft;$("origin").textContent=p.origin;$("path").textContent=p.path;$("rank").textContent=p.rank;$("region").textContent=p.region;$("island").textContent=p.island;$("ship").textContent=p.ship.name;
 $("berries").textContent=fmt(p.berries);$("fruit").textContent=p.fruit==="None"?"None":`${p.fruit} Lv.${p.fruitMastery}`;$("haki").textContent=p.haki;$("health").textContent=p.health+"%";$("mood").textContent=p.mood+"%";
 let stats=["strength","speed","durability","intelligence","charisma","navigation","sneak","discipline","sword","marksmanship","medicine","craft"];
 $("stats").innerHTML=stats.map(s=>`<div class="stat"><div class="statTop"><span>${s}</span><b>${p[s]}</b></div><div class="bar"><div class="fill" style="width:${Math.min(100,p[s]*10)}%"></div></div></div>`).join("");
 localStorage.setItem("gpls_save_v10",JSON.stringify(p));
 showTab(currentTab,true);
}
function showTab(tab,silent=false){
 currentTab=tab;if(!p)return;let html="";
 if(tab==="life")html=`<h3>Reputation & Progress</h3><div class="badgeRow"><span class="badge">Honor ${p.honor}</span><span class="badge">Infamy ${p.infamy}</span><span class="badge">Marine Rep ${p.marineRep}</span><span class="badge">Revolutionary Rep ${p.revolutionaryRep}</span><span class="badge">Heat ${p.heat}</span><span class="badge">Mystery ${p.mystery}/5</span><span class="badge">Legacy ${p.legacy}</span><span class="badge">Debt ฿${fmt(p.debt)}</span></div>${p.quest?`<div class="notice"><b>Active Quest:</b> ${p.quest.name}<br><span class="small">${p.quest.theme}</span></div>`:""}<h3>Relationships</h3>${p.relationships.length?p.relationships.map(r=>`<div class="line"><span>${r.type}</span><b>${r.name} · Bond ${r.bond}</b></div>`).join(""):"<p>No relationships yet.</p>"}`;
 if(tab==="crew")html=`<h3>Crew & Rivals</h3>${p.crew.length?p.crew.map(c=>`<div class="line"><span>${c.role}</span><b>${c.name} · Loyalty ${c.loyalty} · ฿${fmt(c.salary||0)}/yr</b></div>`).join(""):"<p>No crew yet.</p>"}${p.rivals.length?"<h3>Rivals</h3>"+p.rivals.map(x=>`<div class="line"><span>Rival</span><b>${x}</b></div>`).join(""):""}`;
 if(tab==="powers")html=`<h3>Powers</h3><div class="line"><span>Devil Fruit</span><b>${p.fruit}</b></div><div class="line"><span>Fruit Type</span><b>${p.fruitType||"None"}</b></div><div class="line"><span>Fruit Mastery</span><b>${p.fruitMastery}</b></div><div class="badgeRow">${p.fruitSkills.map(s=>`<span class="badge">${s}</span>`).join("")||"<span class='badge'>No fruit skills</span>"}</div><h3>Haki</h3><div class="line"><span>Type</span><b>${p.haki}</b></div><div class="line"><span>Haki XP</span><b>${p.hakiXP}</b></div><div class="badgeRow">${p.hakiSkills.map(s=>`<span class="badge">${s}</span>`).join("")||"<span class='badge'>No Haki skills</span>"}</div>`;
 if(tab==="assets")html=`<h3>Assets</h3><div class="line"><span>Ship</span><b>${p.ship.name} · HP ${p.ship.hp}/${p.ship.maxHp} · Cannons ${p.ship.cannons}</b></div><h3>Businesses</h3>${p.businesses.length?p.businesses.map(b=>`<div class="line"><span>${b.name}</span><b>฿${fmt(b.income)}/yr</b></div>`).join(""):"<p>No businesses yet.</p>"}<h3>Items</h3><div class="badgeRow">${p.items.map(i=>`<span class="badge">${typeof i==="string"?i:i.name}</span>`).join("")||"<span class='badge'>No items</span>"}</div>`;
 if(tab==="world")html=`<h3>World Map</h3><p>${currentRegion().desc}</p><div class="cardGrid">${DATA.regions.map(r=>`<div class="miniCard"><h4>${r.name}</h4><p>Danger ${r.danger}/10 · Req Nav ${r.req.nav}, Ship HP ${r.req.ship}</p></div>`).join("")}</div><h3>Current Island</h3><p><b>${currentIsland().name}</b> — ${currentIsland().type}: ${currentIsland().desc}</p><h3>Newspapers</h3>${p.newspapers.length?p.newspapers.map(n=>`<div class="newspaper"><h2>${n.headline}</h2><p><b>Age ${n.age}</b> — ${n.body}</p></div>`).join(""):"<p>No newspapers yet.</p>"}`;
 if(tab==="log")html=`<h3>Life Log</h3>${p.log.map(x=>`<div class="logEntry">${x}</div>`).join("")||"<p>No log yet.</p>"}`;
 $("tab").innerHTML=html;
}
function ending(forcedTitle=null){let title=forcedTitle||"Unknown Drifter";if(!forcedTitle){if(p.bounty>500000000)title="Emperor Candidate";else if(p.bounty>300000000)title="Legendary Pirate";else if(p.bounty>100000000)title="Supernova";else if(p.marineRep>35)title="Admiral Candidate";else if(p.revolutionaryRep>25)title="World Government Threat";else if(p.berries>600000)title="Underworld Tycoon";else if(p.infamy>25)title="Sea Menace";else if(p.honor>25)title="Local Legend";else if(p.crew.length>=10)title="Beloved Captain"}$("screen").innerHTML=`<h2>Ending: ${title}</h2><p>Your life reaches its final chapter. Legacy: ${p.legacy}. Start again to see a completely different story.</p><div class="choices"><button class="primary" onclick="setup()">Start New Life</button></div>`;addLog(`Final title: ${title}.`);addNews("LIFE OF A LEGEND",`${p.name}'s story ends with the title: ${title}.`);render()}
function help(){ $("screen").innerHTML=`<h2>How to Play</h2><div class="notice"><b>Energy:</b> Actions use energy. Age Up refreshes energy and triggers yearly consequences.<br><br><b>Regions:</b> Advance from Home Sea to Reverse Mountain, Paradise, Sabaody Crossroads, and the New World when your navigation and ship are strong enough.<br><br><b>Builds:</b> You can be a pirate, Marine, hunter, revolutionary, merchant, doctor, shipwright, agent, swordsman, diver, gambler, or journalist.<br><br><b>Goal:</b> There is no single win condition. Build bounty, rank, crew, businesses, Haki, Devil Fruit skills, legacy, and survive.</div><div class="choices"><button class="primary" onclick="showMenu()">Back</button></div>`}
function manualSave(){localStorage.setItem("gpls_save_v10",JSON.stringify(p));addLog("Game saved.");showMenu()}
function loadGame(){p=JSON.parse(localStorage.getItem("gpls_save_v10"));showMenu()}
function clearSave(){localStorage.removeItem("gpls_save_v10");setup()}
$("saveBtn").onclick=manualSave;$("newBtn").onclick=setup;$("helpBtn").onclick=help;setup();
