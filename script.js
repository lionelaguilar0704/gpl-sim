const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString();
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

const NAMES=["Kaid","Rook","Vera","Mako","Lian","Sora","Dax","Namiro","Vale","Rin","Cale","Juno","Arashi","Toma","Kira","Zeno","Mira","Dante","Koji","Namiya","Vex","Orin","Talia","Saiko","Crowe","Milo","Nero","Yuna","Cass","Bram"];
const SEAS=["East Blue","West Blue","North Blue","South Blue"];
const ISLANDS=[
  ["Loguetown","execution platforms, rain, rumors, Marines"],
  ["Shells Town","Marine corruption, rooftops, recruits"],
  ["Syrup Harbor","quiet mansions, lies, hidden pirates"],
  ["Organ Market","black markets, stolen maps, secret auctions"],
  ["Dustvale","desert saloons, bounty hunters, old gangs"],
  ["Brinehook Port","shipyards, tavern brawls, smugglers"],
  ["Karakuri Scrap Island","inventors, machines, failed weapons"],
  ["Moonreef","fishman docks, coral canals, sea beasts"],
  ["Ironbell","factories, chained workers, revolutionary whispers"],
  ["Skypierce Atoll","cloud bridges, strange dials, sky pirates"],
  ["Frostwake","ice storms, survival tribes, lost ships"],
  ["Amberfall","noble estates, hidden vaults, masked balls"],
  ["Cinder Key","volcanic caves, smugglers, heat mirages"],
  ["Pearl Graveyard","shipwrecks, ghosts, treasure divers"],
  ["Clockwork Cay","mechanical towers, genius engineers, malfunctioning guards"],
  ["Red Lantern Port","gamblers, assassins, sake houses, bounty rumors"]
];

const ORIGINS=[
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
["Sea Beast Survivor","🦈",{durability:2,navigation:1},["sea","trauma","survival"]]
];

const PATHS=[
["Pirate","☠️",{bounty:10000,infamy:2}],
["Marine","⚔️",{marineRep:3,discipline:2}],
["Bounty Hunter","🎯",{berries:5000,strength:1}],
["Revolutionary","🔥",{revolutionaryRep:3,honor:1}],
["Merchant","💰",{berries:10000,charisma:1}],
["Doctor","🩺",{medicine:2,honor:1}],
["Shipwright","🛠️",{craft:2,durability:1}],
["Cipher Pol Recruit","🕶️",{sneak:3,discipline:1,honor:-1}],
["Wandering Swordsman","🗡️",{sword:3,bounty:3000}],
["Treasure Diver","🫧",{navigation:2,berries:3000}],
["Gambler","🎲",{charisma:1,berries:2500,sneak:1}],
["News Courier","📰",{navigation:1,intelligence:1,charisma:1}]
];

const FRUITS=[
{name:"Carve-Carve Fruit",type:"Paramecia",power:"engrave symbols that create seals, traps, and summons"},
{name:"Smoke Body Fruit",type:"Logia-like",power:"turn into drifting smoke and obscure battlefields"},
{name:"Iron Body Fruit",type:"Paramecia",power:"harden flesh into living metal"},
{name:"Mist-Mist Fruit",type:"Logia-like",power:"create mist clones and fog ambushes"},
{name:"Panther Zoan",type:"Zoan",power:"become a black panther hybrid"},
{name:"Hawk Zoan",type:"Zoan",power:"gain flight, talons, and predator vision"},
{name:"Wall-Wall Fruit",type:"Paramecia",power:"raise defensive walls from surfaces"},
{name:"Pulse-Pulse Fruit",type:"Paramecia",power:"send shockwaves through touch"},
{name:"Thread-Thread Fruit",type:"Paramecia",power:"control razor-thin threads"},
{name:"Glide-Glide Fruit",type:"Paramecia",power:"slide through air and redirect momentum"},
{name:"Mend-Mend Fruit",type:"Paramecia",power:"rapidly stitch wounds and repair objects"},
{name:"Grav-Grav Fruit",type:"Paramecia",power:"briefly increase or reduce gravity around targets"},
{name:"Mirror-Mirror Fruit",type:"Paramecia",power:"reflect attacks and create false rooms"},
{name:"Rust-Rust Fruit",type:"Paramecia",power:"decay weapons, locks, and armor by touch"},
{name:"Ink-Ink Fruit",type:"Paramecia",power:"bring ink drawings to temporary life"}
];

const COMPANIONS=[
{name:"Ashfang",role:"Scarred Wolf",bonus:{sneak:1},loyalty:8},
{name:"Mira",role:"Runaway Mink Fighter",bonus:{speed:1},loyalty:6},
{name:"Captain Squawk",role:"Talking Parrot Scout",bonus:{navigation:1},loyalty:5},
{name:"Pip",role:"Cowardly Cabin Boy",bonus:{charisma:1},loyalty:4},
{name:"Old Salt",role:"Ship Cat Mascot",bonus:{sneak:1},loyalty:7},
{name:"Nelli",role:"Tontatta Gadgeteer",bonus:{craft:2},loyalty:6},
{name:"Rook",role:"Den-Den Mushi Handler",bonus:{intelligence:1},loyalty:5},
{name:"Doc Harlan",role:"Ex-Marine Medic",bonus:{medicine:2},loyalty:6},
{name:"Yume",role:"Masked Swordswoman",bonus:{sword:2},loyalty:5},
{name:"Boro",role:"Fishman Helmsman",bonus:{navigation:2},loyalty:6},
{name:"Grit",role:"Explosives Cook",bonus:{charisma:1},loyalty:5},
{name:"Lace",role:"Black Market Informant",bonus:{sneak:1,intelligence:1},loyalty:4}
];

const RIVALS=[
"hotheaded Marine prodigy","laughing pirate captain","masked government agent","bounty hunter with twin pistols",
"noble swordsman","fishman bruiser","revolutionary extremist","black market queen","giant-blooded brawler",
"silent assassin child","fallen dojo champion","smiling CP trainee","steel-jawed pirate butcher",
"sky island sniper","false priest with a cannon staff"
];

const SHIPS=[
{name:"Leaky Dinghy",hp:30,cannons:0,cargo:1,cost:0},
{name:"Sloop",hp:60,cannons:1,cargo:3,cost:12000},
{name:"Caravel",hp:100,cannons:3,cargo:6,cost:35000},
{name:"Brigantine",hp:160,cannons:6,cargo:10,cost:85000},
{name:"Custom Adam-Wood Cutter",hp:240,cannons:8,cargo:14,cost:180000},
{name:"Ironclad Smuggler",hp:300,cannons:5,cargo:20,cost:240000}
];

const ITEMS=[
{name:"Smoke Bomb",cost:800,effect:{sneak:1}},
{name:"Training Weights",cost:2000,effect:{strength:1}},
{name:"Basic Katana",cost:3000,effect:{sword:1}},
{name:"Medical Kit",cost:2500,effect:{medicine:1}},
{name:"Log Pose Fragment",cost:7000,effect:{navigation:2}},
{name:"Dial Gadget",cost:8000,effect:{craft:1,speed:1}},
{name:"Fake Papers",cost:4000,effect:{heat:-2}},
{name:"Armor Vest",cost:6000,effect:{durability:1}},
{name:"Black Market Intel",cost:9000,effect:{mystery:1}}
];

const INJURIES=[
{name:"Bruised ribs",effect:{durability:-1},severity:1},
{name:"Cut above the eye",effect:{charisma:-1},severity:1},
{name:"Sprained ankle",effect:{speed:-1},severity:1},
{name:"Broken arm",effect:{strength:-1,sword:-1},severity:2},
{name:"Concussion",effect:{intelligence:-1},severity:2},
{name:"Deep scar",effect:{charisma:1},severity:2},
{name:"Damaged lung",effect:{durability:-2},severity:3},
{name:"Burned hand",effect:{craft:-1,sword:-1},severity:2},
{name:"Damaged reputation",effect:{charisma:-1,honor:-1},severity:1}
];

const MYSTERIES=["black coin with a chain mark","red vivre card","forbidden sea chart","sealed letter from a dead captain","rusted key with a sun symbol","broken Marine badge","strange fruit stem","map written in ancient cipher","wanted poster with your face crossed out","bloodstained newspaper clipping","half-burned auction invitation"];

const QUESTS=[
{name:"The Chain Mark",theme:"freedom fighters, slavers, old rebellions"},
{name:"The False Marine",theme:"corrupt justice and stolen uniforms"},
{name:"The Sunken Vault",theme:"treasure maps and sea monsters"},
{name:"The Laughing Captain",theme:"rival pirate crew escalation"},
{name:"The Cipher Letter",theme:"government secrets and assassins"},
{name:"The Black Auction",theme:"nobles, rare fruits, stolen people"},
{name:"The Broken Log Pose",theme:"lost islands, strange weather, impossible routes"},
{name:"The Red Debt",theme:"old family debts, bounty hunters, revenge"}
];

const EVENTS=[
{title:"Burning Dock",tags:["dock","street"],text:"A dock warehouse catches fire. Screams, smoke, and opportunity all appear at once.",choices:[
["Save someone trapped inside",{honor:2,durability:1,berries:500,heat:1},"Risked your life in a burning dock warehouse."],
["Steal from the abandoned crates",{berries:4000,infamy:1,honor:-1},"Looted a burning warehouse."],
["Chase the suspicious arsonists",{speed:1,sneak:1,mystery:1},"Chased the arsonists and found a clue."],
["Disappear before anyone sees you",{sneak:1},"Vanished before the authorities arrived."]
]},
{title:"Black Market Offer",tags:["secret","money","fruit"],text:"A vendor under a torn tent offers you a disgusting fruit and swears it can change your life.",choices:[
["Eat the strange fruit",{fruitRoll:1,berries:-5000},"Took a chance on a strange fruit."],
["Sell the information",{berries:2500,infamy:1},"Sold a black market rumor."],
["Report the market",{marineRep:1,honor:1},"Reported the black market."],
["Rob the vendor",{berries:5000,infamy:2,honor:-2,heat:2},"Robbed a black market vendor."]
]},
{title:"Animal in Chains",tags:["chains","freedom"],text:"You find an animal trapped behind a tavern. It is scared, angry, and hurt.",choices:[
["Free and heal it",{honor:2,companionRoll:1,charisma:1},"Freed an animal from chains."],
["Ignore it",{discipline:1},"Ignored the trapped animal."],
["Use it as bait during a fight",{infamy:2,honor:-2},"Used a trapped animal as bait."],
["Track whoever chained it",{sneak:1,mystery:1},"Tracked the people who chained the animal."]
]},
{title:"Marine Inspection",tags:["marine","justice"],text:"Marines lock down the streets and begin checking papers. Something about you makes them stare too long.",choices:[
["Cooperate",{marineRep:1,discipline:1},"Cooperated with a Marine inspection."],
["Run across the rooftops",{speed:2,bounty:3000,heat:1},"Escaped Marines across rooftops."],
["Lie confidently",{charisma:2,sneak:1},"Bluffed through an inspection."],
["Pick a fight",{strength:2,bounty:10000,infamy:2,heat:3},"Started a fight with Marines."]
]},
{title:"Dojo Challenge",tags:["fighter","sword","honor"],text:"A dojo master offers to train you, but only if you survive a public challenge.",choices:[
["Fight fairly",{strength:1,speed:1,honor:1,sword:1},"Fought fairly in a dojo challenge."],
["Cheat to win",{sneak:2,infamy:1,honor:-1},"Cheated in a dojo challenge."],
["Study technique instead",{intelligence:2,sword:1},"Studied combat technique."],
["Refuse and work jobs",{berries:3000,discipline:1},"Skipped the dojo and worked instead."]
]},
{title:"Sea Storm",tags:["ship","sea"],text:"A sudden storm nearly destroys the ship you are riding on. Everyone panics.",choices:[
["Take the wheel",{navigation:2,honor:1,shipDamage:-8},"Took the wheel during a storm."],
["Protect supplies",{berries:2000,durability:1},"Protected supplies in a storm."],
["Save passengers",{honor:2,charisma:1},"Saved passengers during a storm."],
["Abandon ship early",{sneak:1,honor:-1,shipDamage:-15},"Abandoned ship early."]
]},
{title:"Rival Appears",tags:["rival","fighter"],text:"A future rival crosses your path. They recognize your potential and hate it immediately.",choices:[
["Challenge them",{strength:1,bounty:5000,rivalRoll:1,heat:1},"Challenged a future rival."],
["Talk them down",{charisma:2,rivalRoll:1},"Talked down a future rival."],
["Study their weakness",{intelligence:2,rivalRoll:1},"Studied a rival's weakness."],
["Avoid them",{sneak:1},"Avoided a dangerous rival."]
]},
{title:"Treasure Rumor",tags:["money","sea"],text:"A drunk sailor whispers about treasure hidden on a nearby island.",choices:[
["Sail after it",{navigation:1,berries:6000,shipXP:1},"Chased a treasure rumor."],
["Sell the rumor",{berries:2500,charisma:1},"Sold a treasure rumor."],
["Recruit help first",{crewRoll:1,charisma:1},"Recruited help for a treasure hunt."],
["Assume it is bait",{intelligence:1,discipline:1},"Avoided a likely trap."]
]},
{title:"Revolutionary Pamphlet",tags:["freedom","revolutionary"],text:"You find hidden pamphlets calling for revolt against a cruel local ruler.",choices:[
["Spread the pamphlets",{revolutionaryRep:2,honor:1,heat:1},"Spread revolutionary pamphlets."],
["Burn them",{marineRep:1,discipline:1,honor:-1},"Burned revolutionary pamphlets."],
["Rewrite them better",{intelligence:2,revolutionaryRep:1},"Rewrote revolutionary messaging."],
["Sell the names listed inside",{berries:6000,infamy:2,honor:-3,heat:2},"Sold revolutionary names."]
]},
{title:"Masked Ball",tags:["noble","secret"],text:"A noble family hosts a masked ball. Rumor says a rare map is hidden upstairs.",choices:[
["Sneak upstairs",{sneak:2,mystery:1},"Snuck through a noble estate."],
["Charm the guests",{charisma:2,berries:1500},"Charmed nobles at a masked ball."],
["Expose their corruption",{honor:2,revolutionaryRep:1,heat:1},"Exposed noble corruption."],
["Steal jewelry",{berries:8000,infamy:2,heat:2},"Stole jewelry from nobles."]
]},
{title:"Sea Beast Attack",tags:["sea","fighter"],text:"A sea beast rises beside your vessel, large enough to crack the hull in one bite.",choices:[
["Fight it head-on",{strength:2,bounty:5000,shipDamage:-20,health:-10},"Fought off a sea beast."],
["Outmaneuver it",{navigation:2,shipXP:1},"Outmaneuvered a sea beast."],
["Sacrifice cargo",{berries:-3000,shipDamage:0},"Sacrificed cargo to escape a sea beast."],
["Use your crew as bait",{infamy:3,honor:-3,crewLoss:1},"Used someone as bait."]
]},
{title:"Secret Training",tags:["haki","fighter"],text:"An old traveler notices something in your spirit and offers brutal training.",choices:[
["Accept the training",{discipline:2,hakiXP:2,health:-10},"Accepted brutal spirit training."],
["Ask for technique instead",{intelligence:1,hakiXP:1},"Studied spiritual technique."],
["Rob the traveler",{berries:4000,infamy:1,honor:-2},"Robbed an old traveler."],
["Decline politely",{honor:1},"Declined secret training politely."]
]},
{title:"Crew Dispute",tags:["crew"],text:"Two allies argue over supplies and loyalty. The crew watches how you handle it.",choices:[
["Mediate fairly",{charisma:1,honor:1,crewLoyalty:1},"Mediated a crew dispute."],
["Punish both",{discipline:2,infamy:1,crewLoyalty:-1},"Punished both sides of a crew dispute."],
["Take a side",{charisma:1,crewLoyalty:-1},"Took a side in a crew dispute."],
["Ignore it",{crewLoyalty:-2},"Ignored a growing crew dispute."]
]},
{title:"Bounty Board",tags:["money","fighter"],text:"A fresh bounty board lists criminals, pirates, and one suspiciously innocent face.",choices:[
["Hunt a dangerous target",{berries:9000,strength:1,marineRep:1,health:-10},"Hunted a dangerous bounty."],
["Protect the innocent target",{honor:2,revolutionaryRep:1,bounty:3000},"Protected an innocent bounty target."],
["Fake a capture",{berries:7000,sneak:1,infamy:1},"Faked a bounty capture."],
["Study the board",{intelligence:1,mystery:1},"Studied the bounty board for patterns."]
]},
{title:"Gambling Den",tags:["money","street"],text:"A smoky gambling den opens beneath a noodle shop. Everyone inside looks desperate or dangerous.",choices:[
["Gamble small",{gamble:1000},"Gambled at a small table."],
["Gamble big",{gamble:5000,heat:1},"Gambled at the dangerous table."],
["Cheat the table",{sneak:1,gamble:7000,infamy:1},"Cheated at a gambling den."],
["Expose loaded dice",{honor:1,charisma:1,berries:2000},"Exposed loaded dice."]
]},
{title:"Auction House",tags:["secret","money","noble"],text:"A hidden auction sells weapons, maps, and people. Guards patrol every exit.",choices:[
["Free a prisoner",{honor:3,revolutionaryRep:1,heat:2,companionRoll:1},"Freed a prisoner from an auction."],
["Steal a rare item",{mystery:1,sneak:1,heat:2},"Stole a rare auction item."],
["Bid quietly",{berries:-6000,itemRoll:1},"Bid at the auction."],
["Report it to Marines",{marineRep:2,honor:1},"Reported a black auction."]
]},
{title:"Newspaper Interview",tags:["fame"],text:"A newspaper courier wants your side of the story before printing tomorrow's issue.",choices:[
["Tell the truth",{honor:1,charisma:1,news:1},"Gave an honest newspaper interview."],
["Create a myth",{infamy:1,charisma:2,news:1},"Created a myth in the newspaper."],
["Threaten the writer",{infamy:2,heat:1},"Threatened a journalist."],
["Refuse comment",{discipline:1},"Refused a newspaper interview."]
]},
{title:"Fruit User Duel",tags:["fighter","fruit"],text:"A Devil Fruit user challenges you, showing off powers in the middle of town.",choices:[
["Duel them publicly",{strength:1,fruitMastery:1,bounty:8000,health:-10},"Dueled a Devil Fruit user publicly."],
["Study their power",{intelligence:2,hakiXP:1},"Studied an enemy Fruit power."],
["Ambush them later",{sneak:2,infamy:1,bounty:5000},"Ambushed a Devil Fruit user."],
["Recruit them",{charisma:2,crewRoll:1},"Tried to recruit a Fruit user."]
]},
{title:"Corrupt Captain",tags:["marine","justice"],text:"A Marine captain is shaking down civilians and calling it justice.",choices:[
["Expose him",{honor:2,revolutionaryRep:1,heat:2},"Exposed a corrupt Marine captain."],
["Help him for pay",{berries:7000,marineRep:1,honor:-2},"Helped a corrupt Marine captain."],
["Challenge him",{strength:2,bounty:12000,health:-12},"Challenged a corrupt Marine captain."],
["Collect evidence",{intelligence:2,mystery:1},"Collected evidence on a corrupt captain."]
]}
];

let p=null,currentTab="life";

function newPlayer(){return{
  name:"Rookie",age:10,actionsLeft:5,origin:"—",path:"Undecided",sea:"—",island:"—",portrait:"☠️",epithet:"No Epithet",
  berries:500,bounty:0,fruit:"None",fruitType:"",fruitMastery:0,haki:"Dormant",hakiXP:0,health:100,mood:50,
  strength:1,speed:1,durability:1,intelligence:1,charisma:1,navigation:0,sneak:0,discipline:0,sword:0,medicine:0,craft:0,
  honor:0,infamy:0,marineRep:0,revolutionaryRep:0,heat:0,crew:[],rivals:[],items:[],mystery:0,quest:null,
  ship:{name:"None",hp:0,maxHp:0,cannons:0,cargo:0,xp:0},log:[],newspapers:[],dead:false
}}

function addLog(t){p.log.unshift(`Age ${p.age}: ${t}`);p.log=p.log.slice(0,110)}
function addNews(headline,body){p.newspapers.unshift({age:p.age,headline,body});p.newspapers=p.newspapers.slice(0,20)}
function spendAction(n=1){
  if(p.actionsLeft<n){notice("You are out of energy for this age. Press Age Up to continue.");return false}
  p.actionsLeft-=n; p.mood=clamp(p.mood-2*n,0,100); return true
}
function notice(msg){$("screen").innerHTML=`<h2>Notice</h2><div class="notice">${msg}</div><div class="choices"><button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function apply(e){
  for(const[k,v]of Object.entries(e)){
    if(k==="fruitRoll"){fruitRoll();continue}
    if(k==="companionRoll"){gainCompanion();continue}
    if(k==="rivalRoll"){gainRival();continue}
    if(k==="crewRoll"){gainCrewRole();continue}
    if(k==="mystery"){p.mystery+=v;let item=pick(MYSTERIES);p.items.push(item); if(!p.quest) p.quest=pick(QUESTS); addLog(`Found clue: ${item}.`);continue}
    if(k==="shipDamage"){damageShip(Math.abs(v));continue}
    if(k==="shipXP"){p.ship.xp+=v;continue}
    if(k==="hakiXP"){gainHaki(v);continue}
    if(k==="crewLoss"){loseCrew();continue}
    if(k==="crewLoyalty"){p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+v,0,10));continue}
    if(k==="gamble"){gamble(v);continue}
    if(k==="itemRoll"){gainItem();continue}
    if(k==="news"){addNews("THE STORY FROM THEIR OWN MOUTH",`${p.name} gave a statement that shifted public opinion.`);continue}
    p[k]=(p[k]||0)+v;
    if(["berries","bounty","health","mood","heat"].includes(k))p[k]=Math.max(0,p[k]);
  }
  if(p.health<=0) survivalCheck();
}
function fruitRoll(){
  if(p.fruit!=="None"){addLog("Found a Devil Fruit, but already had powers.");return}
  if(Math.random()<.55){
    let f=pick(FRUITS);p.fruit=f.name;p.fruitType=f.type;p.fruitMastery=1;
    addLog(`Ate the ${f.name}: ${f.power}. Swimming is now impossible.`);
    addNews("STRANGE FRUIT INCIDENT",`${p.name} reportedly gained unnatural powers after eating a mysterious fruit.`);
  }else addLog("The fruit was fake or rotten. Nothing happened.");
}
function gainCompanion(){let c=JSON.parse(JSON.stringify(pick(COMPANIONS)));p.crew.push(c);apply(c.bonus);addLog(`Gained companion: ${c.name}, ${c.role}.`)}
function gainCrewRole(){let roles=["Navigator","Cook","Doctor","Shipwright","Sniper","Swordsman","Musician","Quartermaster","Lookout","Archaeologist","Scout"];let c={name:pick(NAMES),role:pick(roles),loyalty:4+Math.floor(Math.random()*5),bonus:{}};p.crew.push(c);addLog(`Recruited ${c.name}, the ${c.role}.`)}
function gainRival(){let r=pick(RIVALS);if(!p.rivals.includes(r)){p.rivals.push(r);addLog(`Made a rival: ${r}.`);addNews("NEW RIVALRY ON THE SEAS",`${p.name} has reportedly crossed paths with a ${r}.`)}}
function loseCrew(){if(!p.crew.length)return;let lost=p.crew.splice(Math.floor(Math.random()*p.crew.length),1)[0];addLog(`${lost.name||lost} was lost because of your decision.`)}
function gainItem(){let i=pick(ITEMS);p.items.push(i.name);apply(i.effect);addLog(`Acquired item: ${i.name}.`)}
function gamble(amount){if(p.berries<amount){addLog("Tried to gamble without enough berries.");return}p.berries-=amount;let skill=(p.charisma+p.sneak+p.intelligence)/30; if(Math.random()<.42+skill){let win=amount*(2+Math.floor(Math.random()*3));p.berries+=win;addLog(`Won ฿${fmt(win)} gambling.`)}else{addLog(`Lost ฿${fmt(amount)} gambling.`);if(Math.random()<.2)gainRival()}}
function damageShip(amount){if(p.ship.name==="None")return;p.ship.hp=clamp(p.ship.hp-amount,0,p.ship.maxHp);if(p.ship.hp<=0){addLog(`${p.ship.name} was destroyed.`);p.ship={name:"None",hp:0,maxHp:0,cannons:0,cargo:0,xp:0}}}
function gainHaki(n){p.hakiXP+=n;if(p.haki==="Dormant"&&p.hakiXP>=3){p.haki=pick(["Observation Haki","Armament Haki"]);addLog(`Awakened ${p.haki}.`);addNews("ROOKIE SHOWS STRANGE WILLPOWER",`${p.name} displayed signs of unusual spiritual force.`)}else if(p.haki!=="Dormant"&&p.hakiXP>=8&&!p.haki.includes("Advanced")){p.haki="Advanced "+p.haki;addLog(`Advanced your ${p.haki}.`)}}
function survivalCheck(){let chance=(p.durability+p.discipline+p.medicine)/25;if(Math.random()<chance){p.health=15;addLog("Barely survived a near-death event.");injuryRoll()}else{p.dead=true;p.health=0;ending("Death at Sea")}}
function injuryRoll(){let inj=pick(INJURIES);p.items.push("Injury: "+inj.name);apply(inj.effect);addLog(`Suffered injury: ${inj.name}.`)}
function passiveYear(){
  let s=pick(["strength","speed","durability","intelligence","charisma"]);p[s]++;
  p.health=clamp(p.health+12,0,100);p.mood=clamp(p.mood+18,0,100);p.actionsLeft=5+Math.floor((p.discipline+p.durability)/6);
  if(p.fruit!=="None"&&Math.random()<.35){p.fruitMastery++;addLog(`Improved Devil Fruit mastery to ${p.fruitMastery}.`)}
  if(p.age>=15&&p.haki==="Dormant"){let chance=Math.max(.04,(p.discipline+p.honor+p.infamy+p.strength+p.hakiXP)/48);if(Math.random()<chance){p.haki=pick(["Observation Haki","Armament Haki","Conqueror's Haki - Rare Spark"]);addLog(`Awakened ${p.haki}.`)}}
  if(p.heat>=6&&Math.random()<.35)marinePursuit();
  if(p.mystery>=5&&p.quest)questResolution();
  if(p.age%5===0)yearlyNews();
}
function ageUp(){p.age++;passiveYear();addLog("A year passed.");if(p.age===16&&p.path==="Undecided")choosePath();else if(Math.random()<.65)showEvent(chooseWeightedEvent());else showMenu()}
function yearlyNews(){addNews("WORLD ECONOMIC JOURNAL",`${p.name}, known as ${p.epithet}, has reached age ${p.age}. Current bounty: ฿${fmt(p.bounty)}.`)}
function marinePursuit(){pick([()=>{p.bounty+=15000;p.health-=15;addLog("Marine pursuit forced a violent escape.")},()=>{p.berries=Math.max(0,p.berries-5000);p.heat-=2;addLog("Bribed your way out of a Marine dragnet.")},()=>{gainRival();p.heat+=1;addLog("A Marine rival was assigned to your case.")}])()}
function questResolution(){addNews("MYSTERY UNRAVELED",`${p.name} made major progress in ${p.quest.name}: ${p.quest.theme}.`);p.bounty+=10000;p.honor+=1;p.infamy+=1;p.mystery=0;addLog(`Resolved a chapter of ${p.quest.name}.`);p.quest=Math.random()<.5?pick(QUESTS):null}
function postEventConsequences(){if(Math.random()<.12&&p.health<70)injuryRoll();if(p.bounty>0&&Math.random()<.18)addNews("BOUNTY UPDATED",`${p.name}, ${p.epithet}, now carries a bounty of ฿${fmt(p.bounty)}.`);if(p.infamy>=10&&p.epithet==="No Epithet"){p.epithet=pick(["the Menace","Red-Hand","the Problem","Stormbringer"]);addLog(`Earned epithet: ${p.epithet}.`)}if(p.honor>=10&&p.epithet==="No Epithet"){p.epithet=pick(["the Kind Blade","Harbor Saint","the Shield","the Gentle Storm"]);addLog(`Earned epithet: ${p.epithet}.`)}}

function render(){
  if(!p)return;
  $("portrait").textContent=p.portrait;$("posterName").textContent=p.name.toUpperCase();$("posterBounty").textContent="฿"+fmt(p.bounty);$("epithet").textContent=p.epithet;
  $("age").textContent=p.age;$("energy").textContent=p.actionsLeft;$("origin").textContent=p.origin;$("path").textContent=p.path;$("sea").textContent=p.sea;$("island").textContent=p.island;$("ship").textContent=p.ship.name;
  $("berries").textContent=fmt(p.berries);$("fruit").textContent=p.fruit==="None"?"None":`${p.fruit} Lv.${p.fruitMastery}`;$("haki").textContent=p.haki;$("health").textContent=p.health+"%";$("mood").textContent=p.mood+"%";
  let stats=["strength","speed","durability","intelligence","charisma","navigation","sneak","discipline","sword","medicine","craft"];
  $("stats").innerHTML=stats.map(s=>`<div class="stat"><div class="statTop"><span>${s}</span><b>${p[s]}</b></div><div class="bar"><div class="fill" style="width:${Math.min(100,p[s]*10)}%"></div></div></div>`).join("");
  localStorage.setItem("gpls_save_v04",JSON.stringify(p));
  showTab(currentTab,true);
}
function showTab(tab,silent=false){
  currentTab=tab;if(!p)return;let html="";
  if(tab==="life")html=`<h3>Reputation</h3><div class="badgeRow"><span class="badge">Honor ${p.honor}</span><span class="badge">Infamy ${p.infamy}</span><span class="badge">Marine Rep ${p.marineRep}</span><span class="badge">Revolutionary Rep ${p.revolutionaryRep}</span><span class="badge">Heat ${p.heat}</span><span class="badge">Mystery ${p.mystery}/5</span></div>${p.quest?`<div class="notice"><b>Active Quest:</b> ${p.quest.name}<br><span class="small">${p.quest.theme}</span></div>`:""}`;
  if(tab==="crew")html=`<h3>Crew & Relationships</h3>${p.crew.length?p.crew.map((x,i)=>`<div class="line"><span>${x.role||"Crew"}</span><b>${x.name||x} · Loyalty ${x.loyalty??"?"}</b></div>`).join(""):"<p>No crew yet.</p>"}${p.rivals.length?"<h3>Rivals</h3>"+p.rivals.map(x=>`<div class="line"><span>Rival</span><b>${x}</b></div>`).join(""):""}`;
  if(tab==="ship")html=`<h3>Shipyard</h3><div class="line"><span>Current Ship</span><b>${p.ship.name}</b></div><div class="line"><span>Hull</span><b>${p.ship.hp}/${p.ship.maxHp}</b></div><div class="line"><span>Cannons</span><b>${p.ship.cannons}</b></div><div class="line"><span>Cargo</span><b>${p.ship.cargo}</b></div><div class="choices">${SHIPS.map((s,i)=>`<button onclick="buyShip(${i})">${s.name} — ฿${fmt(s.cost)} · HP ${s.hp} · Cannons ${s.cannons}</button>`).join("")}<button onclick="repairShip()">Repair Current Ship</button><button onclick="upgradeShip()">Upgrade Current Ship</button></div>`;
  if(tab==="world")html=`<h3>World State</h3><p>Early Great Pirate Era. Each life can become pirate, Marine, hunter, revolutionary, merchant, agent, doctor, shipwright, swordsman, gambler, courier, or drifter.</p><div class="badgeRow">${p.items.map(i=>`<span class="badge">${typeof i==="string"?i:i.name}</span>`).join("")||"<span class='badge'>No special items</span>"}</div><h3>Newspapers</h3>${p.newspapers.length?p.newspapers.map(n=>`<div class="newspaper"><h2>${n.headline}</h2><p><b>Age ${n.age}</b> — ${n.body}</p></div>`).join(""):"<p>No newspapers yet.</p>"}`;
  if(tab==="log")html=`<h3>Life Log</h3>${p.log.map(x=>`<div class="logEntry">${x}</div>`).join("")||"<p>No log yet.</p>"}`;
  $("tab").innerHTML=html;
}

function setup(){
  p=newPlayer();
  $("screen").innerHTML=`<h2>Start a New Life</h2><p>Every run is different. Most actions no longer age you. You have yearly energy, and <b>Age Up</b> is its own button.</p><input id="nameInput" placeholder="Character name, or leave blank for random"><div class="choices"><button class="primary" onclick="randomStart()">Random Life</button><button onclick="chooseOriginScreen()">Choose Origin</button>${localStorage.getItem("gpls_save_v04")?'<button onclick="loadGame()">Load Saved Life</button>':''}<button class="danger" onclick="clearSave()">Clear Save</button></div>`;
  render();
}
function randomStart(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(NAMES);let o=pick(ORIGINS);startWithOrigin(o)}
function chooseOriginScreen(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(NAMES);$("screen").innerHTML=`<h2>Choose Origin</h2><p>Your origin gives bonuses and shapes the event pool.</p><div class="choices">${ORIGINS.map((o,i)=>`<button onclick="startWithOrigin(ORIGINS[${i}])">${o[1]} ${o[0]}</button>`).join("")}</div>`}
function startWithOrigin(o){
  p.origin=o[0];p.portrait=o[1];p.sea=pick(SEAS);p.island=pick(ISLANDS)[0];apply(o[2]);
  p.epithet=pick(["the Unwritten","the Small Storm","Iron Will","Chainbreaker","Sea Rat","the Runaway","the Quiet Spark","No-Name","the Dawn Rookie"]);
  addLog(`Born as a ${p.origin} in ${p.sea}, starting on ${p.island}.`);
  if(Math.random()<.25){p.items.push(pick(MYSTERIES));p.mystery=1;addLog("Started life already carrying a strange clue.")}
  showMenu();
}
function showMenu(){
  render(); if(p.dead)return; if(p.age>=70)return ending();
  if(p.age===16&&p.path==="Undecided")return choosePath();
  $("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2><p>You have <b>${p.actionsLeft}</b> yearly energy left. Do actions, explore, train, shop, recruit, gamble, or age up when ready.</p>
  <div class="menuGrid">
    <button class="primary" onclick="ageUp()">Age Up</button>
    <button onclick="randomEventAction()">Random Event</button>
    <button onclick="train()">Train Body</button>
    <button onclick="study()">Study / Scheme</button>
    <button onclick="work()">Work for Berries</button>
    <button onclick="explore()">Explore Island</button>
    <button onclick="sail()">Sail / Travel</button>
    <button onclick="huntBounty()">Hunt Bounty</button>
    <button onclick="recruit()">Recruit Crew</button>
    <button onclick="crewBond()">Spend Time with Crew</button>
    <button onclick="fruitTrain()">Train Devil Fruit</button>
    <button onclick="hakiTrain()">Haki Training</button>
    <button onclick="shop()">Shop / Black Market</button>
    <button onclick="gambleMenu()">Gamble</button>
    <button onclick="rest()">Rest / Recover</button>
    <button onclick="manualSave()">Save</button>
  </div>`;
}
function choosePath(){$("screen").innerHTML=`<h2>Age 16: Choose Your Path</h2><p>This does not lock your entire life, but it shapes opportunities, enemies, and reputation.</p><div class="choices">${PATHS.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`).join("")}</div>`;render()}
function setPath(i){let x=PATHS[i];p.path=x[0];p.portrait=x[1];apply(x[2]);addLog(`Chose the path of ${p.path}.`);showMenu()}
function chooseWeightedEvent(){let pool=[...EVENTS];if(p.ship.name==="None")pool=pool.filter(e=>!e.tags.includes("sea")||Math.random()<.35);if(p.crew.length===0)pool=pool.filter(e=>!e.tags.includes("crew")||Math.random()<.25);if(p.path==="Marine")pool.push(...EVENTS.filter(e=>e.tags.includes("marine")));if(p.path==="Revolutionary")pool.push(...EVENTS.filter(e=>e.tags.includes("revolutionary")||e.tags.includes("freedom")));if(p.path==="Pirate")pool.push(...EVENTS.filter(e=>e.tags.includes("sea")||e.tags.includes("money")));return pick(pool)}
function showEvent(e){$("screen").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p><div class="choices">${e.choices.map((c,i)=>`<button onclick="chooseEvent(${EVENTS.indexOf(e)},${i})">${c[0]}</button>`).join("")}</div>`;render()}
function chooseEvent(ei,ci){let c=EVENTS[ei].choices[ci];apply(c[1]);addLog(c[2]);postEventConsequences();showMenu()}
function randomEventAction(){if(!spendAction())return;showEvent(chooseWeightedEvent())}
function train(){if(!spendAction())return;apply({strength:1,speed:Math.random()<.5?1:0,durability:Math.random()<.5?1:0,discipline:1,health:-4});addLog("Spent time training.");showMenu()}
function study(){if(!spendAction())return;apply({intelligence:2,navigation:Math.random()<.5?1:0,hakiXP:Math.random()<.25?1:0});addLog("Studied maps, history, tactics, and rumors.");showMenu()}
function work(){if(!spendAction())return;let pay=1500+Math.floor(Math.random()*6000);apply({berries:pay,charisma:Math.random()<.5?1:0});addLog(`Worked and earned ฿${fmt(pay)}.`);showMenu()}
function explore(){if(!spendAction())return;if(Math.random()<.65)showEvent(chooseWeightedEvent());else{let found=pick(["quiet shrine","hidden tavern","abandoned camp","strange footprint","old battlefield","locked cellar"]);addLog(`Explored ${p.island} and found a ${found}.`);apply({mystery:Math.random()<.35?1:0,berries:Math.random()<.3?1000:0});showMenu()}}
function sail(){if(!spendAction())return;if(p.ship.name==="None"){addLog("Bought passage to another island.");p.berries=Math.max(0,p.berries-1000)}else{p.ship.xp++;if(Math.random()<.25)damageShip(5+Math.floor(Math.random()*20))}let isl=pick(ISLANDS);p.island=isl[0];addLog(`Sailed to ${isl[0]}: ${isl[1]}.`);if(Math.random()<.35)showEvent(chooseWeightedEvent());else showMenu()}
function huntBounty(){if(!spendAction())return;let power=p.strength+p.speed+p.sword+p.hakiXP+(p.fruitMastery||0)+p.crew.length;if(Math.random()<Math.min(.78,power/24)){let pay=5000+Math.floor(Math.random()*22000);apply({berries:pay,marineRep:1,strength:1});addLog(`Captured a bounty and earned ฿${fmt(pay)}.`)}else{apply({health:-25,bounty:3000});addLog("A bounty hunt went badly.");injuryRoll()}showMenu()}
function recruit(){if(!spendAction())return;if(Math.random()<.55+(p.charisma/30)){gainCrewRole();p.mood+=3}else{addLog("Failed to recruit anyone useful.");if(Math.random()<.25)gainRival()}showMenu()}
function crewBond(){if(!spendAction())return;if(!p.crew.length){notice("You have no crew yet.");return}p.crew.forEach(c=>c.loyalty=clamp(c.loyalty+1,0,10));p.mood=clamp(p.mood+8,0,100);addLog("Spent time bonding with the crew.");showMenu()}
function fruitTrain(){if(!spendAction())return;if(p.fruit==="None"){notice("You do not have a Devil Fruit.");return}p.fruitMastery++;p.health=clamp(p.health-5,0,100);addLog(`Trained ${p.fruit}. Mastery is now ${p.fruitMastery}.`);showMenu()}
function hakiTrain(){if(!spendAction())return;apply({hakiXP:1,discipline:1,health:-6});addLog("Focused on willpower and Haki training.");showMenu()}
function shop(){$("screen").innerHTML=`<h2>Shop / Black Market</h2><p>Buy items without aging. Each purchase uses 1 energy.</p><div class="choices">${ITEMS.map((it,i)=>`<button onclick="buyItem(${i})">${it.name} — ฿${fmt(it.cost)}</button>`).join("")}<button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function buyItem(i){if(!spendAction())return;let it=ITEMS[i];if(p.berries<it.cost){notice("Not enough berries.");return}p.berries-=it.cost;p.items.push(it.name);apply(it.effect);addLog(`Bought ${it.name}.`);showMenu()}
function gambleMenu(){$("screen").innerHTML=`<h2>Gambling Den</h2><p>Risk berries for a chance at profit. Uses 1 energy.</p><div class="choices"><button onclick="doGamble(500)">Low Table — ฿500</button><button onclick="doGamble(2500)">Mid Table — ฿2,500</button><button onclick="doGamble(10000)">High Roller — ฿10,000</button><button class="primary" onclick="showMenu()">Back</button></div>`;render()}
function doGamble(amount){if(!spendAction())return;apply({gamble:amount});showMenu()}
function rest(){if(!spendAction())return;p.health=clamp(p.health+30,0,100);p.mood=clamp(p.mood+15,0,100);if(p.berries>500)p.berries-=500;addLog("Rested and recovered.");showMenu()}
function buyShip(i){let s=SHIPS[i];if(p.berries<s.cost){alert("Not enough berries.");return}p.berries-=s.cost;p.ship={name:s.name,hp:s.hp,maxHp:s.hp,cannons:s.cannons,cargo:s.cargo,xp:0};addLog(`Acquired ship: ${s.name}.`);showMenu()}
function repairShip(){if(p.ship.name==="None")return;let cost=(p.ship.maxHp-p.ship.hp)*120;if(p.berries<cost){alert("Not enough berries.");return}p.berries-=cost;p.ship.hp=p.ship.maxHp;addLog(`Repaired ${p.ship.name}.`);showMenu()}
function upgradeShip(){if(p.ship.name==="None")return;let cost=10000+p.ship.cannons*5000;if(p.berries<cost){alert("Not enough berries.");return}p.berries-=cost;p.ship.cannons++;p.ship.maxHp+=10;p.ship.hp+=10;addLog(`Upgraded ${p.ship.name}.`);showMenu()}

function ending(forcedTitle=null){let title=forcedTitle||"Unknown Drifter";if(!forcedTitle){if(p.bounty>300000000)title="Legendary Pirate";else if(p.bounty>100000000)title="Supernova";else if(p.marineRep>25)title="Marine Hero";else if(p.revolutionaryRep>18)title="Revolutionary Threat";else if(p.berries>350000)title="Underworld Tycoon";else if(p.infamy>20)title="Sea Menace";else if(p.honor>20)title="Local Legend";else if(p.crew.length>=8)title="Beloved Captain"}$("screen").innerHTML=`<h2>Ending: ${title}</h2><p>Your life reaches its final chapter. Start again to see a completely different story.</p><div class="choices"><button class="primary" onclick="setup()">Start New Life</button></div>`;addLog(`Final title: ${title}.`);addNews("LIFE OF A LEGEND",`${p.name}'s story ends with the title: ${title}.`);render()}
function manualSave(){localStorage.setItem("gpls_save_v04",JSON.stringify(p));addLog("Game saved.");showMenu()}
function loadGame(){p=JSON.parse(localStorage.getItem("gpls_save_v04"));showMenu()}
function clearSave(){localStorage.removeItem("gpls_save_v04");setup()}

$("saveBtn").onclick=manualSave;
$("newBtn").onclick=setup;
setup();
