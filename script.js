const $=id=>document.getElementById(id);const fmt=n=>Math.round(n).toLocaleString();
const names=["Kaid","Rook","Vera","Mako","Lian","Sora","Dax","Namiro","Vale","Rin","Cale","Juno","Arashi","Toma","Kira"];
const seas=["East Blue","West Blue","North Blue","South Blue"];
const origins=[
["Dock Rat","⚓",{navigation:1,sneak:1},["dock","street","pirate"]],
["Marine Base Child","🛡️",{discipline:2,marineRep:1},["marine","justice","rank"]],
["Fishman Street Fighter","🌊",{strength:2,durability:1},["fishman","street","fighter"]],
["Wano Exile","🗡️",{strength:1,discipline:1},["sword","honor","exile"]],
["Noble Runaway","👑",{charisma:2,berries:3000},["noble","money","secret"]],
["Slave Escapee","⛓️",{durability:2,sneak:1,honor:1},["chains","escape","freedom"]],
["Sky Island Tinkerer","☁️",{intelligence:2},["sky","gadget","dial"]],
["Doctor's Apprentice","🩺",{intelligence:1,honor:1},["doctor","healer","mercy"]],
["Shipwright's Kid","🔨",{intelligence:1,durability:1},["ship","craft","sea"]]
];
const paths=[
["Pirate","☠️",{bounty:10000,infamy:2}],["Marine","⚔️",{marineRep:3,discipline:2}],["Bounty Hunter","🎯",{berries:5000,strength:1}],["Revolutionary","🔥",{revolutionaryRep:3,honor:1}],["Merchant","💰",{berries:10000,charisma:1}],["Cipher Pol Recruit","🕶️",{sneak:3,discipline:1,honor:-1}]
];
const fruits=["Carve-Carve Fruit","Smoke Body Fruit","Iron Body Fruit","Mist-Mist Fruit","Panther Zoan","Hawk Zoan","Wall-Wall Fruit","Pulse-Pulse Fruit","Thread-Thread Fruit","Glide-Glide Fruit"];
const companions=["scarred wolf","runaway mink","talking parrot","cowardly cabin boy","old ship cat","tiny tontatta inventor","retired den-den mushi handler"];
const rivals=["hotheaded Marine prodigy","laughing pirate captain","masked government agent","bounty hunter with twin pistols","noble swordsman","fishman bruiser"];
const mysteries=["black coin with a chain mark","red vivre card","forbidden sea chart","sealed letter from a dead captain","rusted key with a sun symbol","broken Marine badge","strange fruit stem"];
const eventTemplates=[
{title:"Burning Dock",text:"A dock warehouse catches fire. Screams, smoke, and opportunity all appear at once.",choices:[
["Save someone trapped inside",{honor:2,durability:1,berries:500}],
["Steal from the abandoned crates",{berries:4000,infamy:1,honor:-1}],
["Chase the suspicious arsonists",{speed:1,sneak:1,mystery:1}],
["Disappear before anyone sees you",{sneak:1}]
]},
{title:"Black Market Offer",text:"A vendor under a torn tent offers you a disgusting fruit and swears it can change your life.",choices:[
["Eat the strange fruit",{fruitRoll:1,berries:-5000}],
["Sell the information",{berries:2500,infamy:1}],
["Report the market",{marineRep:1,honor:1}],
["Rob the vendor",{berries:5000,infamy:2,honor:-2}]
]},
{title:"Animal in Chains",text:"You find an animal trapped behind a tavern. It is scared, angry, and hurt.",choices:[
["Free and heal it",{honor:2,companionRoll:1,charisma:1}],
["Ignore it",{discipline:1}],
["Use it as bait during a fight",{infamy:2,honor:-2}],
["Track whoever chained it",{sneak:1,mystery:1}]
]},
{title:"Marine Inspection",text:"Marines lock down the streets and begin checking papers. Something about you makes them stare too long.",choices:[
["Cooperate",{marineRep:1,discipline:1}],
["Run across the rooftops",{speed:2,bounty:3000}],
["Lie confidently",{charisma:2,sneak:1}],
["Pick a fight",{strength:2,bounty:10000,infamy:2}]
]},
{title:"Dojo Challenge",text:"A dojo master offers to train you, but only if you survive a public challenge.",choices:[
["Fight fairly",{strength:1,speed:1,honor:1}],
["Cheat to win",{sneak:2,infamy:1,honor:-1}],
["Study technique instead",{intelligence:2}],
["Refuse and work jobs",{berries:3000,discipline:1}]
]},
{title:"Sea Storm",text:"A sudden storm nearly destroys the ship you are riding on. Everyone panics.",choices:[
["Take the wheel",{navigation:2,honor:1}],
["Protect supplies",{berries:2000,durability:1}],
["Save passengers",{honor:2,charisma:1}],
["Abandon ship early",{sneak:1,honor:-1}]
]},
{title:"Rival Appears",text:"A future rival crosses your path. They recognize your potential and hate it immediately.",choices:[
["Challenge them",{strength:1,bounty:5000,rivalRoll:1}],
["Talk them down",{charisma:2,rivalRoll:1}],
["Study their weakness",{intelligence:2,rivalRoll:1}],
["Avoid them",{sneak:1}]
]},
{title:"Treasure Rumor",text:"A drunk sailor whispers about treasure hidden on a nearby island.",choices:[
["Sail after it",{navigation:1,berries:6000}],
["Sell the rumor",{berries:2500,charisma:1}],
["Recruit help first",{crewRoll:1,charisma:1}],
["Assume it is bait",{intelligence:1,discipline:1}]
]}
];
let p=null;
function newPlayer(){return{name:"Rookie",age:10,origin:"—",path:"Undecided",sea:"—",portrait:"☠️",berries:500,bounty:0,fruit:"None",haki:"Dormant",strength:1,speed:1,durability:1,intelligence:1,charisma:1,navigation:0,sneak:0,discipline:0,honor:0,infamy:0,marineRep:0,revolutionaryRep:0,crew:[],rivals:[],items:[],mystery:0,log:[]}}
function addLog(t){p.log.unshift(`Age ${p.age}: ${t}`);p.log=p.log.slice(0,60)}
function apply(e){for(const[k,v]of Object.entries(e)){if(k==="fruitRoll"){if(p.fruit==="None"&&Math.random()<.48){p.fruit=pick(fruits);addLog(`Ate the ${p.fruit}. Swimming is now impossible.`)}else addLog("The fruit was fake or useless.");continue}if(k==="companionRoll"){let c=pick(companions);if(!p.crew.includes(c)){p.crew.push(c);addLog(`Gained companion: ${c}.`)}continue}if(k==="rivalRoll"){let r=pick(rivals);if(!p.rivals.includes(r)){p.rivals.push(r);addLog(`Made a rival: ${r}.`)}continue}if(k==="crewRoll"){let c=pick(["navigator","cook","doctor","shipwright","sniper","swordsman","musician"]);p.crew.push(c);addLog(`Recruited a ${c}.`);continue}if(k==="mystery"){p.mystery+=v;let item=pick(mysteries);p.items.push(item);addLog(`Found clue: ${item}.`);continue}p[k]=(p[k]||0)+v;if(k==="berries"||k==="bounty")p[k]=Math.max(0,p[k])}}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function render(){if(!p)return;$("portrait").textContent=p.portrait;$("posterName").textContent=p.name.toUpperCase();$("posterBounty").textContent="฿"+fmt(p.bounty);$("age").textContent=p.age;$("origin").textContent=p.origin;$("path").textContent=p.path;$("sea").textContent=p.sea;$("berries").textContent=fmt(p.berries);$("fruit").textContent=p.fruit;$("haki").textContent=p.haki;let stats=["strength","speed","durability","intelligence","charisma","navigation","sneak","discipline"];$("stats").innerHTML=stats.map(s=>`<div class="stat"><div class="statTop"><span>${s}</span><b>${p[s]}</b></div><div class="bar"><div class="fill" style="width:${Math.min(100,p[s]*10)}%"></div></div></div>`).join("");localStorage.setItem("gpls_save",JSON.stringify(p));showTab(currentTab||"life",true)}
let currentTab="life";
function showTab(tab,silent=false){currentTab=tab;if(!p)return;let html="";if(tab==="life")html=`<h3>Reputation</h3><div class="badgeRow"><span class="badge">Honor ${p.honor}</span><span class="badge">Infamy ${p.infamy}</span><span class="badge">Marine Rep ${p.marineRep}</span><span class="badge">Revolutionary Rep ${p.revolutionaryRep}</span><span class="badge">Mystery ${p.mystery}/5</span></div>`;if(tab==="crew")html=`<h3>Crew & Relationships</h3>${p.crew.length?p.crew.map(x=>`<div class="line"><span>Crew</span><b>${x}</b></div>`).join(""):"<p>No crew yet.</p>"}${p.rivals.length?"<h3>Rivals</h3>"+p.rivals.map(x=>`<div class="line"><span>Rival</span><b>${x}</b></div>`).join(""):""}`;if(tab==="world")html=`<h3>World State</h3><p>You are in the early Great Pirate Era. Each life can become pirate, Marine, hunter, revolutionary, merchant, agent, or drifter.</p><div class="badgeRow">${p.items.map(i=>`<span class="badge">${i}</span>`).join("")||"<span class='badge'>No special items</span>"}</div>`;if(tab==="log")html=`<h3>Life Log</h3>${p.log.map(x=>`<div class="logEntry">${x}</div>`).join("")||"<p>No log yet.</p>"}`;$("tab").innerHTML=html}
function setup(){p=newPlayer();$("screen").innerHTML=`<h2>Start a New Life</h2><p>Every run can be different. Pick your name, randomize your beginning, or choose an origin manually.</p><input id="nameInput" placeholder="Character name, or leave blank for random"><div class="choices"><button class="primary" onclick="randomStart()">Random Life</button><button onclick="chooseOriginScreen()">Choose Origin</button>${localStorage.getItem("gpls_save")?'<button onclick="loadGame()">Load Saved Life</button>':''}<button class="danger" onclick="clearSave()">Clear Save</button></div>`;render()}
function randomStart(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(names);let o=pick(origins);startWithOrigin(o)}
function chooseOriginScreen(){p=newPlayer();p.name=$("nameInput").value.trim()||pick(names);$("screen").innerHTML=`<h2>Choose Origin</h2><p>Choose manually, or go back and randomize for a BitLife-style start.</p><div class="choices">${origins.map((o,i)=>`<button onclick="startWithOrigin(origins[${i}])">${o[1]} ${o[0]}</button>`).join("")}</div>`}
function startWithOrigin(o){p.origin=o[0];p.portrait=o[1];p.sea=pick(seas);apply(o[2]);addLog(`Born as a ${p.origin} in ${p.sea}.`);mainMenu()}
function mainMenu(){render();if(p.age>=65)return ending();if(p.age===16&&p.path==="Undecided")return choosePath();$("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2><p>Choose how this year goes. Events are randomized, so each life can branch differently.</p><div class="choices"><button class="primary" onclick="ageEvent()">Age Up / Random Event</button><button onclick="train()">Train</button><button onclick="study()">Study</button><button onclick="work()">Work</button><button onclick="seekAdventure()">Seek Adventure</button><button onclick="manualSave()">Save</button><button class="danger" onclick="setup()">New Life</button></div>`}
function passive(){let s=pick(["strength","speed","durability","intelligence","charisma"]);p[s]++;if(p.age>=15&&p.haki==="Dormant"){let chance=Math.max(.04,(p.discipline+p.honor+p.infamy+p.strength)/45);if(Math.random()<chance){p.haki=pick(["Observation Haki","Armament Haki","Conqueror's Haki - Rare Spark"]);addLog(`Awakened ${p.haki}.`)}}}
function grow(){p.age++;passive()}
function choosePath(){$("screen").innerHTML=`<h2>Age 16: Choose Your Path</h2><p>This does not lock your whole life, but it shapes opportunities and reputation.</p><div class="choices">${paths.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`).join("")}</div>`;render()}
function setPath(i){let x=paths[i];p.path=x[0];p.portrait=x[1];apply(x[2]);addLog(`Chose the path of ${p.path}.`);mainMenu()}
function ageEvent(){grow();let e=pick(eventTemplates);$("screen").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p><div class="choices">${e.choices.map((c,i)=>`<button onclick="chooseEvent(${eventTemplates.indexOf(e)},${i})">${c[0]}</button>`).join("")}</div>`;render()}
function chooseEvent(ei,ci){let c=eventTemplates[ei].choices[ci];apply(c[1]);addLog(c[2]);mainMenu()}
function train(){grow();apply({strength:1,speed:Math.random()<.5?1:0,durability:Math.random()<.5?1:0,discipline:1});addLog("Spent the year training.");mainMenu()}
function study(){grow();apply({intelligence:2,navigation:Math.random()<.5?1:0});addLog("Studied maps, history, tactics, and rumors.");mainMenu()}
function work(){grow();let pay=2000+Math.floor(Math.random()*6000);apply({berries:pay,charisma:Math.random()<.5?1:0});addLog(`Worked and earned ${fmt(pay)} berries.`);mainMenu()}
function seekAdventure(){grow();let e=pick(eventTemplates);apply({bounty:2000,infamy:1});addLog("Went looking for trouble and found it.");$("screen").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p><div class="choices">${e.choices.map((c,i)=>`<button onclick="chooseEvent(${eventTemplates.indexOf(e)},${i})">${c[0]}</button>`).join("")}</div>`;render()}
function ending(){let title="Unknown Drifter";if(p.bounty>100000000)title="Supernova";else if(p.marineRep>18)title="Marine Hero";else if(p.revolutionaryRep>12)title="Revolutionary Threat";else if(p.berries>200000)title="Underworld Tycoon";else if(p.infamy>15)title="Sea Menace";else if(p.honor>15)title="Local Legend";$("screen").innerHTML=`<h2>Ending: ${title}</h2><p>Your life reaches its final chapter. Start again to see a different story.</p><div class="choices"><button class="primary" onclick="setup()">Start New Life</button></div>`;addLog(`Final title: ${title}.`);render()}
function manualSave(){localStorage.setItem("gpls_save",JSON.stringify(p));addLog("Game saved.");mainMenu()}
function loadGame(){p=JSON.parse(localStorage.getItem("gpls_save"));mainMenu()}
function clearSave(){localStorage.removeItem("gpls_save");setup()}
$("saveBtn").onclick=manualSave;
setup();
