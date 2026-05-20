
"use strict";

const SAVE_KEY = "gpls_save_v71";
const OLD_KEYS = ["gpls_save_v70","gpls_save_v68","gpls_save_v67","gpls_save_v66","gpls_save_v65","gpls_save_v61","gpls_save_v52","gpls_save_v42"];
let p = null;
let currentTab = "feed";
let booted = false;

const $ = id => document.getElementById(id);
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const deep = obj => JSON.parse(JSON.stringify(obj));
const fmt = n => Math.round(n||0).toLocaleString();

function toast(msg, major=false){
  const d=document.createElement("div");
  d.className="toast";
  d.innerHTML=msg;
  if(major)d.style.borderLeftColor="var(--gold)";
  $("toastWrap").appendChild(d);
  setTimeout(()=>d.remove(),4200);
}
function log(msg){
  if(!p) return;
  p.feed.unshift(`Age ${p.age}: ${msg}`);
  p.feed=p.feed.slice(0,80);
}
function major(msg){ log(msg); toast(msg,true); render(); }
function silent(msg){ log(msg); toast(msg,false); render(); }

function newPlayer(){
  return {
    build:"v7.1", name:"Rookie", age:10, origin:"Unknown", dream:"Unknown", path:"Undecided", rank:"None",
    portrait:"🙂", epithet:"No Epithet", region:"Home Sea", island:"Syrup Harbor",
    health:100, mood:55, energy:5, actionsLeft:5, berries:0, debt:0, bounty:0, heat:0, infamy:0, honor:0,
    strength:1, speed:1, durability:1, intelligence:1, charisma:1, sneak:1, discipline:1, leadership:0,
    sword:0, marksmanship:0, medicine:0, craft:0, navigation:0,
    freedom:0, courage:0, revolutionaryRep:0, marineRep:0,
    observation:0, armament:0, conqueror:0, observationXP:0, armamentXP:0, conquerorXP:0,
    kingTraits:{leadership:0,ambition:0,defiance:0,courage:0,presence:0,sacrifice:0,independence:0},
    fruit:"None", fruitType:"None", fruitMastery:0, fruitSkills:[],
    weapons:[], equippedWeapon:null, loot:[], items:[], codex:{fruits:[],weapons:[]}, movesMastery:{},
    crew:[], crewMode:"solo", roleData:{}, rivals:[], relationships:[],
    ship:{name:"None",hp:0,maxHp:0,cannons:0,tier:0},
    injuries:[], scars:[], reckless:0, dead:false, captured:false, battle:null,
    feed:[], timeline:[], worldNews:[], flags:{started:false,pathChosen:false}
  };
}

function ensure(){
  if(!p)p=newPlayer();
  const defaults=newPlayer();
  for(const k of Object.keys(defaults)){
    if(p[k]===undefined)p[k]=deep(defaults[k]);
  }
  if(!p.codex)p.codex={fruits:[],weapons:[]};
  if(!p.codex.fruits)p.codex.fruits=[];
  if(!p.codex.weapons)p.codex.weapons=[];
  if(!p.roleData)p.roleData={};
  if(!p.crew)p.crew=[];
  if(!p.weapons)p.weapons=[];
  if(!p.loot)p.loot=[];
  if(!p.injuries)p.injuries=[];
  if(!p.kingTraits)p.kingTraits=deep(defaults.kingTraits);
}

function apply(e={}){
  ensure();
  for(const [k,v] of Object.entries(e)){
    if(["health","mood"].includes(k))p[k]=clamp((p[k]||0)+v,0,100);
    else if(k==="berries")p.berries=Math.max(0,(p.berries||0)+v);
    else if(k==="shipDamage" && p.ship)p.ship.hp=clamp(p.ship.hp-v,0,p.ship.maxHp||0);
    else if(k==="bounty")p.bounty=Math.max(0,(p.bounty||0)+v);
    else if(k.endsWith("XP"))p[k]=(p[k]||0)+v;
    else if(k in p)p[k]=(p[k]||0)+v;
    else if(k in p.kingTraits)p.kingTraits[k]=(p.kingTraits[k]||0)+v;
  }
  checkUnlocks();
}

function checkUnlocks(){
  const haki = [["observation","observationXP"],["armament","armamentXP"],["conqueror","conquerorXP"]];
  for(const [stat,xp] of haki){
    while((p[xp]||0)>=10+(p[stat]||0)*5){
      p[xp]-=10+p[stat]*5;
      p[stat]++;
      log(`Unlocked ${stat} Haki level ${p[stat]}.`);
    }
  }
  if(p.fruit!=="None" && p.fruitMastery>0){
    const f = DATA.fruitCatalog.find(x=>x.name===p.fruit);
    if(f){
      const idx=Math.min(f.moves.length-1, Math.floor(p.fruitMastery/3));
      const move=f.moves[idx];
      if(move && !p.fruitSkills.includes(move)){
        p.fruitSkills.push(move);
        log(`Unlocked fruit move: ${move}.`);
      }
    }
  }
}

function save(){
  ensure();
  p.build="v7.1";
  localStorage.setItem(SAVE_KEY,JSON.stringify(p));
  toast("Game saved.");
}
function load(){
  let data=localStorage.getItem(SAVE_KEY);
  if(!data){
    for(const k of OLD_KEYS){ data=localStorage.getItem(k); if(data)break; }
  }
  if(!data){ setup(); return; }
  p=JSON.parse(data);
  ensure();
  p.build="v7.1";
  save();
  mainMenu();
}
function clearSave(){
  [SAVE_KEY,...OLD_KEYS].forEach(k=>localStorage.removeItem(k));
  setup();
}

function render(){
  if(!p){renderEmpty();return;}
  ensure();
  renderPoster();
  renderDashboard();
  renderTabs();
}
function renderEmpty(){
  $("wantedPoster").innerHTML=`<h2>WANTED</h2><div class="posterFace">🙂</div><div class="wantedName">ROOKIE</div><p>DEAD OR ALIVE</p><div class="bounty">฿0</div><b>No Epithet</b>`;
  $("dashboard").innerHTML=`<h2>Captain Dashboard</h2><p>No life started.</p>`;
}
function renderPoster(){
  $("wantedPoster").innerHTML=`
    <h2>WANTED</h2>
    <div class="posterFace">${p.portrait||"🙂"}</div>
    <div class="wantedName">${p.name||"ROOKIE"}</div>
    <p>DEAD OR ALIVE</p>
    <div class="bounty">฿${fmt(p.bounty)}</div>
    <b>${p.epithet||"No Epithet"}</b>`;
}
function meter(label,val,max=100){
  const pct=clamp((val/max)*100,0,100);
  return `<div class="line"><span>${label}</span><b>${Math.round(val)}</b></div><div class="meter"><i style="width:${pct}%"></i></div>`;
}
function renderDashboard(){
  $("dashboard").innerHTML=`
    <h2>Dashboard</h2>
    ${meter("Health",p.health)}
    ${meter("Mood",p.mood)}
    ${meter("Energy",p.actionsLeft,p.energy)}
    <div class="line"><span>Age</span><b>${p.age}</b></div>
    <div class="line"><span>Origin</span><b>${p.origin}</b></div>
    <div class="line"><span>Dream</span><b>${p.dream}</b></div>
    <div class="line"><span>Career</span><b>${p.path}</b></div>
    <div class="line"><span>Rank</span><b>${p.rank}</b></div>
    <div class="line"><span>Region</span><b>${p.region}</b></div>
    <div class="line"><span>Danger</span><b>${dangerText()}</b></div>`;
}
function renderTabs(){
  const tabs=[["feed","Feed"],["life","Life"],["role","Role"],["crew","Crew"],["haki","Haki"],["powers","Powers"],["codex","Codex"],["map","Map"],["log","Log"]];
  $("tabs").innerHTML=tabs.map(([id,label])=>`<button onclick="showTab('${id}')">${label}</button>`).join("");
  showTab(currentTab,true);
}
function showTab(tab,silent=false){
  currentTab=tab;
  if(!p){$("tab").innerHTML="";return;}
  if(tab==="feed")$("tab").innerHTML=`<h3>Recent Feed</h3>${p.feed.slice(0,12).map(x=>`<div class="line"><span>${x}</span></div>`).join("")||"<p>No events yet.</p>"}`;
  if(tab==="life")$("tab").innerHTML=`<h3>Life</h3><div class="cardGrid">
    <div class="miniCard"><h4>Reputation</h4><p>Bounty ฿${fmt(p.bounty)}<br>Heat ${p.heat}<br>Honor ${p.honor}<br>Infamy ${p.infamy}</p></div>
    <div class="miniCard"><h4>Stats</h4><p>STR ${p.strength} · SPD ${p.speed} · DUR ${p.durability}<br>INT ${p.intelligence} · CHA ${p.charisma}</p></div>
    <div class="miniCard"><h4>Injuries</h4><p>${p.injuries.join("<br>")||"None"}</p></div>
    <div class="miniCard"><h4>Money</h4><p>Berries ฿${fmt(p.berries)}<br>Debt ฿${fmt(p.debt)}</p></div>
  </div>`;
  if(tab==="role")$("tab").innerHTML=roleSummary();
  if(tab==="crew")$("tab").innerHTML=`<h3>Crew / Unit</h3>${roleSummary()}<div class="cardGrid">${p.crew.map(c=>`<div class="miniCard"><h4>${c.name}</h4><p>${c.role}<br>Loyalty ${c.loyalty}</p></div>`).join("")||"<p>No companions yet.</p>"}</div>`;
  if(tab==="haki")$("tab").innerHTML=`<h3>Haki</h3><div class="cardGrid">
    <div class="miniCard"><h4>Observation ${p.observation}</h4><p>XP ${p.observationXP}<br>${p.observation?"Presence Sense":"Dormant"}</p></div>
    <div class="miniCard"><h4>Armament ${p.armament}</h4><p>XP ${p.armamentXP}<br>${p.armament?"Hardening":"Dormant"}</p></div>
    <div class="miniCard"><h4>Conqueror ${p.conqueror}</h4><p>XP ${p.conquerorXP}<br>${p.conqueror?"Will Burst":"Dormant"}</p></div>
    <div class="miniCard"><h4>King Traits</h4><p>${Object.entries(p.kingTraits).map(([k,v])=>`${k}: ${v}`).join("<br>")}</p></div>
  </div>`;
  if(tab==="powers")$("tab").innerHTML=`<h3>Powers</h3>
    <div class="notice"><b>Devil Fruit:</b> ${p.fruit} (${p.fruitType})<br>Mastery ${p.fruitMastery}<br>Moves: ${p.fruitSkills.join(", ")||"None"}</div>
    <div class="weaponEquipped notice"><b>Weapon:</b> ${p.equippedWeapon?`${p.equippedWeapon.rarity} ${p.equippedWeapon.name}`:"None"}<br>${p.equippedWeapon?`Moves: ${p.equippedWeapon.moves.join(", ")}`:"Find or equip one."}</div>
    <h3>Inventory</h3><div class="cardGrid">${p.loot.slice(-8).map(l=>`<div class="miniCard rarity${l.rarity}"><h4>${l.rarity} ${l.name}</h4><p>Value ฿${fmt(l.value)}</p></div>`).join("")||"<p>No loot yet.</p>"}</div>`;
  if(tab==="codex")$("tab").innerHTML=`<h3>Codex</h3><div class="choices"><button onclick="fruitCodex()">Devil Fruits</button><button onclick="weaponCodex()">Weapons</button><button onclick="ownedWeapons()">Owned Weapons</button></div>`;
  if(tab==="map")$("tab").innerHTML=`<h3>Map</h3>${DATA.islands.map(i=>`<div class="line"><span>${i.name}</span><b>${i.region} · Danger ${i.danger}</b></div>`).join("")}`;
  if(tab==="log")$("tab").innerHTML=`<h3>Game Info</h3><div class="notice">Version: v7.1<br>Save Build: ${p.build}<br>Cache-busted files: yes<br>Current URL tip: add ?v=70 if needed.</div>`;
}

function roleSummary(){
  return `<h3>Career Role</h3><div class="roleCard"><h4>${p.path}</h4><p>Rank: ${p.rank}<br>Mode: ${p.crewMode}<br>${Object.entries(p.roleData||{}).map(([k,v])=>`${k}: ${v}`).join("<br>")||"No role data yet."}</p></div>`;
}
function dangerText(){
  const score=(100-p.health)+(p.heat*6)+(p.reckless*4)+(currentIsland().danger*8);
  if(score<45)return "🟢 Safe";
  if(score<85)return "🟡 Risky";
  if(score<130)return "🟠 Dangerous";
  if(score<180)return "🔴 Deadly";
  return "☠️ Critical";
}
function currentIsland(){return DATA.islands.find(i=>i.name===p.island)||DATA.islands[0];}

function setup(){
  p=newPlayer();
  render();
  $("screen").innerHTML=`<h2>Start a New Life</h2>
    <p><b>v7.1 Remaster</b> rebuilds the game for stability, cleaner UI, and fewer freezes.</p>
    <div class="safeNotice notice">This version uses a clean save slot. Old saves can still be loaded, but a new life is recommended for testing.</div>
    <input id="nameInput" placeholder="Character name, or leave blank for random">
    <div class="choices">
      <button class="primary" onclick="chooseOriginScreen()">Choose Origin</button>
      <button onclick="randomStart()">Random Life</button>
      ${hasSave()?'<button onclick="load()">Load Saved Life</button>':''}
      <button class="danger" onclick="clearSave()">Clear Save</button>
    </div>`;
}
function hasSave(){return localStorage.getItem(SAVE_KEY)||OLD_KEYS.some(k=>localStorage.getItem(k));}
function chooseOriginScreen(){
  p=newPlayer();
  p.name=($("nameInput")&&$("nameInput").value.trim())||pick(DATA.names);
  p.dream=pick(DATA.dreams);
  render();
  $("screen").innerHTML=`<h2>Choose Origin</h2><p>Your origin gives early bonuses. You can safely tap once; the remaster blocks duplicate startup bugs.</p>
  <div class="choices">${DATA.origins.map((o,i)=>`<button onclick="selectOrigin(${i})">${o[1]} ${o[0]}</button>`).join("")}</div>`;
}
function randomStart(){
  p=newPlayer();
  p.name=($("nameInput")&&$("nameInput").value.trim())||pick(DATA.names);
  p.dream=pick(DATA.dreams);
  selectOrigin(Math.floor(Math.random()*DATA.origins.length));
}
let selectingOrigin=false;
function selectOrigin(i){
  if(selectingOrigin)return;
  selectingOrigin=true;
  setTimeout(()=>selectingOrigin=false,500);
  const o=DATA.origins[i]||DATA.origins[0];
  const isl=pick(DATA.islands.filter(x=>x.region==="Home Sea"));
  p.origin=o[0];p.portrait=o[1];p.region=isl.region;p.island=isl.name;
  p.epithet=pick(["No-Name","the Quiet Spark","Sea Rat","Iron Will","the Runaway","Chainbreaker"]);
  apply(o[2]||{});
  p.flags.started=true;
  major(`Born as a ${p.origin}, starting on ${p.island}. Dream: ${p.dream}.`);
  save();
  mainMenu();
}
function choosePath(){
  $("screen").innerHTML=`<h2>Age 16: Choose Your Path</h2>
    <p>This now creates specialized role gameplay.</p>
    <div class="choices">${DATA.paths.map((x,i)=>`<button onclick="setPath(${i})">${x[1]} ${x[0]}</button>`).join("")}</div>`;
}
function setPath(i){
  const x=DATA.paths[i];
  p.path=x[0];p.portrait=x[1];p.rank=DATA.ranks[p.path][0];
  apply(x[2]||{});
  p.flags.pathChosen=true;
  if(p.path==="Pirate")return pirateCrewChoice();
  if(p.path==="Marine")return setupMarineUnit();
  if(p.path==="Revolutionary")p.roleData={cell:"Unassigned Cell",role:"New Liberator",missions:0};
  if(p.path==="Bounty Hunter")p.roleData={guild:"Local Hunter Office",contracts:0};
  if(p.path==="Doctor")p.roleData={clinic:"Field Clinic",patients:0};
  if(p.path==="Shipwright")p.roleData={yard:"Dockyard Apprentice",builds:0};
  major(`Chose the path of ${p.path}.`);
  save();mainMenu();
}
function pirateCrewChoice(){
  $("screen").innerHTML=`<h2>Pirate Path</h2><p>Do you want to form your own crew or join an existing crew?</p>
  <div class="choices"><button onclick="formOwnCrew()">Form My Own Crew</button><button onclick="joinGeneratedCrew()">Join an Existing Crew</button></div>`;
}
function formOwnCrew(){
  p.crewMode="captain";p.roleData={crewName:`${p.name} Pirates`,position:"Captain",captain:p.name,influence:1};
  major(`Founded the ${p.roleData.crewName}.`);
  save();mainMenu();
}
function joinGeneratedCrew(){
  const captains=["Red Jack","Mira Blackfin","Captain Crowe","Darius Bloodwolf","Velvet Vane","Iron Mako"];
  const crews=["Red Wake Pirates","Blackfin Crew","Crowe Raiders","Bloodwolf Pirates","Velvet Corsairs","Iron Tide Crew"];
  const idx=Math.floor(Math.random()*crews.length);
  p.crewMode="member";p.roleData={crewName:crews[idx],position:pick(["Deckhand","Fighter","Scout","Gunner","Navigator Trainee"]),captain:captains[idx],influence:0};
  p.crew.push({name:p.roleData.captain,role:"Captain",loyalty:5});
  major(`Joined the ${p.roleData.crewName} under ${p.roleData.captain}.`);
  save();mainMenu();
}
function setupMarineUnit(){
  const unitName=pick(["Shells Platoon","Blue Shield Unit","G-12 Patrol","Iron Gull Platoon","East Watch Division"]);
  p.crewMode="assigned";p.roleData={unitName,position:"Assigned Marine",platoonSize:8,discipline:1};
  major(`Assigned to ${unitName}.`);
  save();mainMenu();
}

function mainMenu(){
  ensure();render();
  if(p.dead)return deathScreen();
  if(p.age>=80)return ending();
  if(p.age>=16 && p.path==="Undecided")return choosePath();
  $("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2>
    <div class="dangerMeter survivalBox"><b>Danger:</b> ${dangerText()} · Reckless ${p.reckless}</div>
    <p><b>${p.actionsLeft}</b> energy left.</p>
    <div class="menuGrid">
      <button class="primary" onclick="ageUp()">Age Up</button>
      <button onclick="careerRoleMenu()">⭐ Career Role</button>
      <button onclick="combatMenu()">⚔️ Combat</button>
      <button onclick="activitiesMenu()">Activities</button>
      <button onclick="trainingMenu()">Training</button>
      <button onclick="hakiMenu()">Haki</button>
      <button onclick="powerCodexMenu()">📖 Pirate Codex</button>
      <button onclick="inspectFruitEncounter()">🍎 Search Fruit</button>
      <button onclick="ownedWeapons()">⚔️ Weapons</button>
      <button onclick="travelMenu()">Travel</button>
      <button onclick="crewMenu()">Crew / Unit</button>
      <button onclick="assetsMenu()">Assets</button>
      <button onclick="relationshipsMenu()">Social</button>
      <button onclick="legacyMenu()">Legacy</button>
      <button onclick="save()">Save</button>
    </div>`;
}

function spendAction(){
  if(p.dead)return false;
  if(p.actionsLeft<=0){toast("No energy left. Age up or rest.");return false;}
  p.actionsLeft--;return true;
}
function ageUp(){
  if(!p||p.dead)return;
  p.age++;p.actionsLeft=p.energy;p.mood=clamp(p.mood+pick([-4,-2,0,1,3]),0,100);
  if(p.injuries.length && Math.random()<0.35){const healed=p.injuries.shift();log(`Recovered from ${healed}.`)}
  worldTick();
  if(p.age>=16 && p.path==="Undecided"){render();return choosePath();}
  randomLifeBeat();
  save();mainMenu();
}
function randomLifeBeat(){
  const e=pick(DATA.events);
  if(Math.random()<0.55)log(e.title+": "+e.text);
}
function worldTick(){
  if(Math.random()<0.5){
    const news=pick(["A new pirate crew rises in Paradise.","Marine HQ increases patrols.","Revolutionaries liberate a small island.","A Warlord candidate defeats a rival.","A mysterious fruit appears on the black market."]);
    p.worldNews.unshift(`Age ${p.age}: ${news}`);
    p.worldNews=p.worldNews.slice(0,25);
  }
}

function careerRoleMenu(){
  if(p.path==="Undecided")return choosePath();
  if(p.path==="Pirate")return pirateRoleMenu();
  if(p.path==="Marine")return marineRoleMenu();
  if(p.path==="Revolutionary")return submenu("🔥 Revolutionary Role","Liberation missions and covert work.",[
    [`Liberation Mission`,()=>{if(spendAction()){apply({revolutionaryRep:2,honor:1,heat:1,freedom:1});silent("Helped liberate civilians.");mainMenu();}}],
    [`Covert Intel`,()=>{if(spendAction()){apply({sneak:2,mystery:1,heat:1});silent("Ran covert intel.");mainMenu();}}]
  ]);
  if(p.path==="Bounty Hunter")return submenu("🎯 Bounty Hunter Role","Contracts and pursuit.",[
    [`Take Contract`,()=>huntBounty()],
    [`Track Target`,()=>{if(spendAction()){apply({intelligence:1,observationXP:1});silent("Tracked a target.");mainMenu();}}]
  ]);
  if(p.path==="Doctor")return submenu("🩺 Doctor Role","Treat patients and improve survival.",[
    [`Treat Patients`,()=>{if(spendAction()){p.health=clamp(p.health+25,0,100);apply({medicine:1,honor:1});silent("Treated patients.");mainMenu();}}],
    [`Medical Research`,()=>{if(spendAction()){apply({medicine:2,intelligence:1});silent("Researched rare disease.");mainMenu();}}]
  ]);
  if(p.path==="Shipwright")return submenu("🛠️ Shipwright Role","Build, repair, and modify ships.",[
    [`Repair Ship`,()=>repairShip()],
    [`Build Parts`,()=>{if(spendAction()){apply({craft:2,berries:4000});silent("Built ship parts for profit.");mainMenu();}}]
  ]);
}
function submenu(title,desc,items){
  $("screen").innerHTML=`<h2>${title}</h2><p>${desc}</p><div class="choices"></div>`;
  const c=$("screen").querySelector(".choices");
  items.forEach(([label,fn])=>{const b=document.createElement("button");b.textContent=label;b.onclick=fn;c.appendChild(b)});
  const back=document.createElement("button");back.textContent="Back";back.className="primary";back.onclick=mainMenu;c.appendChild(back);
  render();
}
function pirateRoleMenu(){
  $("screen").innerHTML=`<h2>☠️ Pirate Role</h2>${roleSummary()}<div class="choices" id="roleChoices"></div>`;
  const c=$("roleChoices");
  if(p.crewMode==="member"){
    addButton(c,"Run Captain Mission",crewMemberMission);
    addButton(c,"Earn Crew Influence",earnCrewInfluence);
    addButton(c,"Challenge Captain",challengeCaptain);
  }else{
    addButton(c,"Captain Raid",captainRaid);
    addButton(c,"Give Crew Orders",giveCrewOrders);
    addButton(c,"Recruit Crew",recruitCrew);
  }
  addButton(c,"Back",mainMenu,"primary");
}
function addButton(parent,label,fn,cls=""){const b=document.createElement("button");b.textContent=label;b.onclick=fn;if(cls)b.className=cls;parent.appendChild(b);}
function crewMemberMission(){if(!spendAction())return;apply({berries:3000,bounty:4000,strength:1});p.roleData.influence=(p.roleData.influence||0)+1;major(`Completed a mission for ${p.roleData.captain}.`);mainMenu();}
function earnCrewInfluence(){if(!spendAction())return;p.roleData.influence=(p.roleData.influence||0)+2;apply({charisma:1,leadership:1});silent("Built influence inside the crew.");mainMenu();}
function challengeCaptain(){if(!spendAction())return;const chance=.25+(p.strength+p.armament+p.conqueror)/80+(p.roleData.influence||0)*.03;if(Math.random()<chance){p.crewMode="captain";p.roleData.position="Captain";p.roleData.captain=p.name;major(`You took command of ${p.roleData.crewName}.`)}else{p.health=clamp(p.health-25,0,100);major(`You challenged ${p.roleData.captain} and lost, but survived.`)}mainMenu();}
function captainRaid(){if(!spendAction())return;startBattle("raid","hard");}
function giveCrewOrders(){if(!spendAction())return;p.crew.forEach(c=>c.loyalty=clamp((c.loyalty||5)+1,0,10));apply({leadership:1});silent("Crew loyalty improved.");mainMenu();}
function recruitCrew(){if(!spendAction())return;const c={name:pick(DATA.names),role:pick(["Fighter","Cook","Navigator","Doctor","Sniper","Shipwright"]),loyalty:5};p.crew.push(c);major(`${c.name} joined as ${c.role}.`);mainMenu();}
function marineRoleMenu(){
  const canCommand=["Captain","Commodore","Vice Admiral Candidate","Admiral Candidate"].includes(p.rank);
  if(canCommand){p.crewMode="commander";p.roleData.position="Commanding Officer";p.roleData.platoonSize=24;}
  $("screen").innerHTML=`<h2>🛡️ Marine Role</h2>${roleSummary()}<div class="choices" id="roleChoices"></div>`;
  const c=$("roleChoices");
  addButton(c,"Patrol Waters",()=>{if(spendAction()){apply({marineRep:1,discipline:1,berries:2500});silent("Completed Marine patrol.");mainMenu();}});
  addButton(c,"Arrest Pirate",()=>{if(spendAction())startBattle("bounty","normal");});
  if(p.crewMode==="commander")addButton(c,"Command Platoon",()=>{if(spendAction()){p.roleData.discipline=(p.roleData.discipline||1)+1;apply({leadership:1,marineRep:1});silent("Drilled your platoon.");mainMenu();}});
  else addButton(c,"Follow Orders",()=>{if(spendAction()){apply({discipline:2,marineRep:1});silent("Followed orders and earned trust.");mainMenu();}});
  addButton(c,"Back",mainMenu,"primary");
}

function combatMenu(){
  $("screen").innerHTML=`<h2>Combat</h2><p>Choose a battle tier. Higher tiers give better loot but stronger enemies.</p><div class="choices">
  <button onclick="startBattle('random','easy')">Easy Battle<small>Low risk</small></button>
  <button onclick="startBattle('random','normal')">Normal Battle<small>Balanced</small></button>
  <button onclick="startBattle('random','hard')">Hard Battle<small>Better loot</small></button>
  <button class="danger" onclick="startBattle('random','deadly')">Deadly Battle<small>Serious consequences</small></button>
  <button onclick="mainMenu()">Back</button></div>`;
  render();
}
const TIERS={easy:.75,normal:1,hard:1.35,deadly:1.85};
function startBattle(kind="random",tier="normal"){
  if(!spendAction())return;
  const mult=TIERS[tier]||1;
  const danger=currentIsland().danger;
  const enemy={name:pick(["Rogue Pirate","Marine Officer","Bounty Hunter","Street Killer","Sea Beast Spawn"]),icon:pick(["🏴‍☠️","🛡️","🦈","🗡️"]),maxHp:Math.round((65+danger*14)*mult),hp:0,power:Math.round((10+danger*4)*mult)};
  enemy.hp=enemy.maxHp;
  p.battle={tier,kind,enemy,player:{hp:Math.max(20,p.health+70),maxHp:p.health+70,stamina:55,haki:35},log:[`${tier.toUpperCase()} battle started.`]};
  renderBattle();
}
function battlePct(a,b){return clamp((a/Math.max(1,b))*100,0,100);}
function buildMoves(){
  const moves=[
    {name:"Heavy Punch",cost:4,power:12+p.strength*2,type:"basic"},
    {name:"Rush Combo",cost:8,power:14+p.speed*2,type:"basic"}
  ];
  if(p.sword>0)moves.push({name:"Sword Slash",cost:7,power:15+p.sword*3,type:"style"});
  if(p.armament>0)moves.push({name:"Black Iron Fist",cost:10,haki:6,power:24+p.armament*7,type:"haki"});
  if(p.observation>0)moves.push({name:"Predict Strike",cost:8,haki:5,power:10+p.observation*4,type:"haki"});
  if(p.conqueror>0)moves.push({name:"Will Burst",cost:12,haki:10,power:20+p.conqueror*8,type:"haki"});
  if(p.fruit!=="None")moves.push({name:p.fruitSkills.slice(-1)[0]||"Fruit Technique",cost:12,power:20+p.fruitMastery*6,type:"fruit"});
  if(p.equippedWeapon)(p.equippedWeapon.moves||[]).forEach((m,i)=>moves.push({name:m,cost:8+i*3,power:p.equippedWeapon.power+p.sword*2,type:"weapon"}));
  if(p.crew.length)moves.push({name:"Crew Assist",cost:6,power:10+p.crew.length*5,type:"crew"});
  return moves;
}
function renderBattle(){
  const b=p.battle;if(!b)return mainMenu();
  $("screen").innerHTML=`<h2>⚔️ ${b.tier.toUpperCase()} BATTLE</h2>
  <div class="battleStage">
    <div class="fighterCard"><h3>${p.name}</h3><div class="fighterSprite">${p.portrait}</div><div>HP ${Math.round(b.player.hp)}/${b.player.maxHp}</div><div class="hpBar"><i style="width:${battlePct(b.player.hp,b.player.maxHp)}%"></i></div><div>Stamina ${Math.round(b.player.stamina)}</div><div class="staminaBar"><i style="width:${battlePct(b.player.stamina,55)}%"></i></div><div>Haki ${Math.round(b.player.haki)}</div><div class="hakiBar"><i style="width:${battlePct(b.player.haki,35)}%"></i></div></div>
    <div class="fighterCard"><h3>${b.enemy.name}</h3><div class="fighterSprite">${b.enemy.icon}</div><div>HP ${Math.round(b.enemy.hp)}/${b.enemy.maxHp}</div><div class="hpBar"><i style="width:${battlePct(b.enemy.hp,b.enemy.maxHp)}%"></i></div></div>
  </div>
  <div class="battleLog">${b.log.slice(-8).map(x=>`<div>${x}</div>`).join("")}</div>
  <div class="battleMoves">${buildMoves().map((m,i)=>`<button onclick="useMove(${i})">${m.name}<small>Power ${m.power} · STA ${m.cost}${m.haki?` · Haki ${m.haki}`:""}</small></button>`).join("")}<button onclick="battleRecover()">Recover</button><button class="danger" onclick="retreatBattle()">Retreat</button></div>`;
  render();
}
function useMove(i){
  const b=p.battle,m=buildMoves()[i];if(!b||!m)return;
  if(b.player.stamina<m.cost){b.log.push("Not enough stamina.");return renderBattle();}
  if(m.haki && b.player.haki<m.haki){b.log.push("Not enough Haki.");return renderBattle();}
  b.player.stamina-=m.cost;if(m.haki)b.player.haki-=m.haki;
  let dmg=m.power+Math.random()*10+(p.movesMastery[m.name]||0);
  if(Math.random()<.1+p.observation*.015){dmg*=1.6;b.log.push("Critical hit!");}
  b.enemy.hp-=dmg;p.movesMastery[m.name]=(p.movesMastery[m.name]||0)+1;
  b.log.push(`${m.name} dealt ${Math.round(dmg)} damage.`);
  if(b.enemy.hp<=0)return winBattle();
  enemyTurn();
}
function battleRecover(){const b=p.battle;b.player.stamina=Math.min(55,b.player.stamina+18);b.player.haki=Math.min(35,b.player.haki+8);b.log.push("You recovered.");enemyTurn();}
function enemyTurn(){
  const b=p.battle;let dmg=b.enemy.power+Math.random()*12;
  if(p.observation && Math.random()<.15+p.observation*.03){dmg*=.45;b.log.push("Observation softened the hit.");}
  if(p.armament && Math.random()<.12+p.armament*.03){dmg*=.6;b.log.push("Armament blocked part of the damage.");}
  b.player.hp-=dmg;b.log.push(`${b.enemy.name} hit you for ${Math.round(dmg)}.`);
  if(b.player.hp<=0)return survivalDefeat(`You were defeated by ${b.enemy.name}.`);
  renderBattle();
}
function winBattle(){
  const tier=p.battle.tier;
  const enemy=p.battle.enemy.name;
  const reward={easy:1500,normal:4500,hard:10000,deadly:22000}[tier]||4000;
  p.berries+=reward;p.bounty+=Math.floor(reward*1.5);
  const loot=rollLoot(tier);p.loot.push(loot);apply(loot.effect||{});
  p.health=clamp(Math.round((p.battle.player.hp/p.battle.player.maxHp)*100),1,100);
  p.battle=null;
  major(`Won battle against ${enemy}. Found ${loot.rarity} ${loot.name}.`);
  save();mainMenu();
}
function retreatBattle(){
  const tier=p.battle.tier;p.bounty=Math.max(0,p.bounty-({easy:200,normal:800,hard:2000,deadly:5000}[tier]||1000));p.mood=clamp(p.mood-5,0,100);
  p.battle=null;major("Retreated from battle. Reputation suffered.");mainMenu();
}
function survivalDefeat(reason){
  p.battle=null;p.reckless++;
  const roll=Math.random();
  if(p.crew.length && roll<.25){p.health=20;major("Your allies rescued you from defeat.");return mainMenu();}
  if(roll<.5){p.health=18;p.captured=true;major(reason+" You were captured instead of killed.");$("screen").innerHTML=`<h2>⛓️ Captured</h2><div class="captureBox">You survived but were thrown into captivity.</div><div class="choices"><button onclick="p.captured=false;p.health=25;major('Escaped captivity.');mainMenu()">Escape</button></div>`;render();return;}
  if(roll<.78){p.health=10;p.injuries.push("Permanent scar");major(reason+" You survived with a scar.");return mainMenu();}
  $("screen").innerHTML=`<h2>⚠️ Last Chance</h2><p>${reason}</p><div class="survivalBox">You are not dead yet. Choose how to survive.</div><div class="choices"><button onclick="p.health=12;major('You crawled away from death.');mainMenu()">Crawl Away</button><button onclick="p.health=15;p.berries=Math.max(0,p.berries-5000);major('You dropped valuables and escaped.');mainMenu()">Drop Loot and Run</button><button class="danger" onclick="death('Journey Ended','You chose to accept your fate.')">Accept Fate</button></div>`;render();
}
function death(title,detail){p.dead=true;p.health=0;$("screen").innerHTML=`<h2>${title}</h2><div class="dangerBox">${detail}</div><div class="choices"><button class="primary" onclick="setup()">Start New Life</button></div>`;render();}
function deathScreen(){ $("screen").innerHTML=`<h2>You Died</h2><div class="dangerBox">Your journey has ended.</div><button onclick="setup()">Start New Life</button>`; }

function rollLoot(tier){
  const bonus={easy:0,normal:1,hard:2,deadly:4}[tier]||1;
  const order=["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  const max=Math.min(5, bonus+Math.floor(currentIsland().danger/3)+(Math.random()<.08?2:0));
  const pool=DATA.loot.filter(l=>order.indexOf(l.rarity)<=max);
  return deep(pick(pool.length?pool:DATA.loot));
}

function activitiesMenu(){
  submenu("Activities","Safer non-aging actions.",[
    ["Rest",()=>{if(spendAction()){p.health=clamp(p.health+18,0,100);p.mood=clamp(p.mood+5,0,100);silent("Rested and recovered.");mainMenu();}}],
    ["Gamble",()=>gambleMenu()],
    ["Explore Town",()=>{if(spendAction()){apply({mood:2,intelligence:1});silent("Explored town.");mainMenu();}}],
    ["Black Market",()=>blackMarketMenu()]
  ]);
}
function gambleMenu(){
  $("screen").innerHTML=`<h2>Gambling</h2><p>Win odds are capped. You can lose money or gain debt.</p><div class="choices"><button onclick="doGamble(500)">Bet ฿500</button><button onclick="doGamble(2500)">Bet ฿2,500</button><button onclick="doGamble(10000)">Bet ฿10,000</button><button onclick="mainMenu()">Back</button></div>`;
}
function doGamble(amount){
  if(!spendAction())return;if(p.berries<amount){toast("Not enough berries.");return;}
  p.berries-=amount;const chance=clamp(.38+(p.charisma+p.sneak+p.intelligence)/100,.25,.72);
  if(Math.random()<chance){const win=Math.floor(amount*(1.5+Math.random()*1.6));p.berries+=win;major(`Won ฿${fmt(win)} gambling.`);}
  else{p.mood=clamp(p.mood-4,0,100);if(Math.random()<.16){const debt=Math.floor(amount*(.5+Math.random()));p.debt+=debt;major(`Lost and gained ฿${fmt(debt)} debt.`)}else major(`Lost ฿${fmt(amount)} gambling.`);}
  mainMenu();
}
function trainingMenu(){
  submenu("Training","Improve stats without aging.",[
    ["Strength Training",()=>{if(spendAction()){apply({strength:1,health:-2,armamentXP:1});silent("Trained strength.");mainMenu();}}],
    ["Speed Drills",()=>{if(spendAction()){apply({speed:1,health:-1,observationXP:1});silent("Trained speed.");mainMenu();}}],
    ["Study",()=>{if(spendAction()){apply({intelligence:1,discipline:1});silent("Studied.");mainMenu();}}],
    ["Weapon Practice",()=>{if(spendAction()){apply({sword:1,armamentXP:1});silent("Practiced weapon skill.");mainMenu();}}]
  ]);
}
function hakiMenu(){
  submenu("Haki Actions","Train and use all three Haki types.",[
    ["Observation Meditation",()=>{if(spendAction()){apply({observationXP:3,discipline:1});silent("Trained Observation.");mainMenu();}}],
    ["Armament Conditioning",()=>{if(spendAction()){apply({armamentXP:3,strength:1});silent("Trained Armament.");mainMenu();}}],
    ["Conqueror Trial",()=>{if(spendAction()){p.kingTraits.courage++;p.kingTraits.defiance++;apply({conquerorXP:2,health:-4});silent("Tested your will.");mainMenu();}}]
  ]);
}
function travelMenu(){
  $("screen").innerHTML=`<h2>Travel</h2><p>Choose an island. Danger affects battles and loot.</p><div class="choices">${DATA.islands.map(i=>`<button onclick="travelTo('${i.name}')">${i.name}<small>${i.region} · Danger ${i.danger}</small></button>`).join("")}<button onclick="mainMenu()">Back</button></div>`;
}
function travelTo(name){
  if(!spendAction())return;
  const i=DATA.islands.find(x=>x.name===name);if(!i)return;
  p.island=i.name;p.region=i.region;
  if(Math.random()<i.danger*.03){p.health=clamp(p.health-12,0,100);p.injuries.push("Travel injury");major(`Reached ${i.name}, but the trip injured you.`)}
  else major(`Traveled to ${i.name}.`);
  mainMenu();
}
function crewMenu(){careerRoleMenu();}
function assetsMenu(){
  $("screen").innerHTML=`<h2>Assets</h2><div class="cardGrid"><div class="miniCard"><h4>Berries</h4><p>฿${fmt(p.berries)}</p></div><div class="miniCard"><h4>Debt</h4><p>฿${fmt(p.debt)}</p></div><div class="miniCard"><h4>Ship</h4><p>${p.ship.name}<br>HP ${p.ship.hp}/${p.ship.maxHp}</p></div></div><div class="choices"><button onclick="buyShip()">Buy/Upgrade Ship</button><button onclick="repairShip()">Repair Ship</button><button onclick="mainMenu()">Back</button></div>`;
}
function buyShip(){
  if(!spendAction())return;
  const cost=p.ship.name==="None"?8000:12000+p.ship.tier*8000;
  if(p.berries<cost){toast(`Need ฿${fmt(cost)}.`);return;}
  p.berries-=cost;p.ship={name:p.ship.name==="None"?"Starter Sloop":"Upgraded Ship",hp:100+p.ship.tier*30,maxHp:100+p.ship.tier*30,cannons:2+p.ship.tier,tier:p.ship.tier+1};
  major("Ship upgraded.");mainMenu();
}
function repairShip(){if(!spendAction())return;if(p.ship.name==="None"){toast("No ship.");return;}p.ship.hp=p.ship.maxHp;major("Ship repaired.");mainMenu();}
function relationshipsMenu(){ $("screen").innerHTML=`<h2>Relationships</h2><div class="cardGrid">${p.relationships.map(r=>`<div class="miniCard"><h4>${r.name}</h4><p>${r.status}</p></div>`).join("")||"<p>No major relationships yet.</p>"}</div><button onclick="mainMenu()">Back</button>`;render();}
function legacyMenu(){ $("screen").innerHTML=`<h2>Legacy</h2><div class="notice">Age ${p.age}<br>Bounty ฿${fmt(p.bounty)}<br>Path ${p.path}<br>Dream: ${p.dream}</div><button onclick="mainMenu()">Back</button>`;render();}
function blackMarketMenu(){ submenu("Black Market","Dangerous opportunities.",[["Buy Weapon Lead",()=>findWeapon()],["Ask About Fruit",()=>inspectFruitEncounter()]]);}

function powerCodexMenu(){showTab("codex");$("screen").innerHTML=`<h2>Pirate Codex</h2><div class="choices"><button onclick="fruitCodex()">🍎 Devil Fruits</button><button onclick="weaponCodex()">⚔️ Weapons</button><button onclick="ownedWeapons()">Owned Weapons</button><button onclick="mainMenu()">Back</button></div>`;render();}
function fruitCodex(){
  $("screen").innerHTML=`<h2>🍎 Devil Fruit Encyclopedia</h2><p><b>Logia Rule:</b> non-Haki physical attacks miss Logia users unless countered by Armament, sea-prism, or a natural weakness.</p>${DATA.fruitCatalog.map(f=>`<div class="powerCard rarity${f.rarity}"><h3>${f.name}</h3><p><b>${f.type}</b> · ${f.rarity}</p><p>${f.desc}</p><p><b>Passives:</b> ${f.passives.join(", ")}</p><p><b>Moves:</b> ${f.moves.join(", ")}</p><p><b>Weakness:</b> ${f.weakness}</p></div>`).join("")}<button onclick="powerCodexMenu()">Back</button>`;render();
}
function weaponCodex(){
  $("screen").innerHTML=`<h2>⚔️ Weapon Tier Encyclopedia</h2>${DATA.weaponCatalog.map(w=>`<div class="powerCard rarity${w.rarity}"><h3>${w.name}</h3><p><b>${w.rarity}</b> ${w.type} · Power ${w.power}</p><p>${w.desc}</p><p><b>Effects:</b> ${w.effects.join(", ")}</p><p><b>Moves:</b> ${w.moves.join(", ")}</p><p><b>Special:</b> ${w.special}</p><p><b>History:</b> ${w.history}</p></div>`).join("")}<button onclick="powerCodexMenu()">Back</button>`;render();
}
function ownedWeapons(){
  $("screen").innerHTML=`<h2>Owned Weapons</h2>${p.equippedWeapon?`<div class="notice"><b>Equipped:</b> ${p.equippedWeapon.rarity} ${p.equippedWeapon.name}</div>`:"<p>No weapon equipped.</p>"}<div class="choices">${p.weapons.map((w,i)=>`<button onclick="equipWeapon(${i})">${w.rarity} ${w.name}<small>${w.type} · Power ${w.power}</small></button>`).join("")||"<p>No weapons owned.</p>"}<button onclick="findWeapon()">Search for Weapon</button><button onclick="mainMenu()">Back</button></div>`;render();
}
function findWeapon(){
  if(!spendAction())return;
  const max=10+currentIsland().danger*6+(p.reckless*2);
  let pool=DATA.weaponCatalog.filter(w=>w.power<=max);
  if(!pool.length)pool=DATA.weaponCatalog.slice(0,3);
  if(Math.random()<.08)pool=DATA.weaponCatalog;
  const w=deep(pick(pool));p.weapons.push(w);p.codex.weapons.push(w);
  major(`Found weapon: ${w.rarity} ${w.name}.`);ownedWeapons();
}
function equipWeapon(i){if(!p.weapons[i])return;p.equippedWeapon=p.weapons[i];major(`Equipped ${p.equippedWeapon.name}.`);mainMenu();}
function inspectFruitEncounter(){
  if(!spendAction())return;
  const order=["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  const max=Math.min(5,Math.floor(currentIsland().danger/2)+2);
  let pool=DATA.fruitCatalog.filter(f=>order.indexOf(f.rarity)<=max);
  if(!pool.length)pool=DATA.fruitCatalog;
  if(Math.random()<.05)pool=DATA.fruitCatalog;
  const f=deep(pick(pool));window.__fruit=f;p.codex.fruits.push(f);
  $("screen").innerHTML=`<h2>🍎 Devil Fruit Found</h2><div class="powerCard rarity${f.rarity}"><h3>${f.name}</h3><p><b>${f.type}</b> · ${f.rarity}</p><p>${f.desc}</p><p><b>Passives:</b> ${f.passives.join(", ")}</p><p><b>Moves:</b> ${f.moves.join(", ")}</p><p><b>Weakness:</b> ${f.weakness}</p></div><div class="choices"><button onclick="eatFoundFruit()">Eat Fruit</button><button onclick="sellFoundFruit()">Sell Fruit</button><button onclick="mainMenu()">Leave It</button></div>`;render();
}
function eatFoundFruit(){
  const f=window.__fruit;if(!f)return mainMenu();
  if(p.fruit!=="None"){toast("You already have a Devil Fruit.");return;}
  p.fruit=f.name;p.fruitType=f.type;p.fruitMastery=1;p.fruitSkills=[f.moves[0]];
  major(`Ate the ${f.name}.`);mainMenu();
}
function sellFoundFruit(){
  const f=window.__fruit;if(!f)return mainMenu();
  const values={Common:1000,Uncommon:5000,Rare:20000,Epic:60000,Legendary:150000,Mythic:400000};
  p.berries+=values[f.rarity]||5000;major(`Sold ${f.name}.`);mainMenu();
}

function huntBounty(){ if(spendAction())startBattle("bounty","normal"); }
function ending(){ $("screen").innerHTML=`<h2>Legacy Complete</h2><div class="notice">${p.name} lived to age ${p.age}. Final bounty ฿${fmt(p.bounty)}.</div><button onclick="setup()">New Life</button>`;render(); }
function help(){ $("screen").innerHTML=`<h2>Help</h2><p>Use energy actions freely. Age Up advances time. Dangerous losses now cause survival outcomes instead of random instant death. Use Role for career-specific gameplay.</p><button onclick="mainMenu()">Back</button>`; }

function boot(){
  if(boot.done)return;boot.done=true;
  $("saveBtn").onclick=save;
  $("newBtn").onclick=setup;
  $("helpBtn").onclick=help;
  setup();
}
boot();


/* =========================
   v7.1 Sandbox Freedom Update
   ========================= */
function freedomHub(){
  $("screen").innerHTML=`<h2>🌊 Open Sea</h2>
  <p>This is the free-play hub. Your career gives special options, but it does not control your entire life.</p>
  <div class="freedomPanel">
    <b>Identity:</b> ${p.path}<br>
    <b>Role:</b> ${p.crewMode}<br>
    <b>Location:</b> ${p.island}<br>
    <span class="sandboxTag">Explore</span><span class="sandboxTag">Train</span><span class="sandboxTag">Scheme</span><span class="sandboxTag">Drift</span><span class="sandboxTag">Join factions</span>
  </div>
  <div class="pathGrid">
    <button onclick="dailyLifeMenu()">Daily Life<small>Rest, work, socialize, gamble, lay low</small></button>
    <button onclick="adventureMenu()">Adventure<small>Explore, rumors, travel, island events</small></button>
    <button onclick="powerMenu()">Power Hunt<small>Fruits, weapons, Haki, mastery</small></button>
    <button onclick="factionMenu()">Faction Choices<small>Pirates, Marines, Revolutionaries, hunters</small></button>
    <button onclick="underworldMenu()">Underworld<small>Smuggling, crime, black market</small></button>
    <button onclick="drifterMenu()">Drifter Life<small>Stay uncommitted and survive freely</small></button>
    <button class="primary" onclick="mainMenu()">Back</button>
  </div>`;
  render();
}
function dailyLifeMenu(){
  submenu("Daily Life","Low-risk actions that make the world feel alive between major events.",[
    ["Work Odd Jobs",()=>{if(spendAction()){apply({berries:1200+Math.floor(Math.random()*1800),mood:-1});silent("Worked odd jobs.");mainMenu();}}],
    ["Rest Properly",()=>{if(spendAction()){p.health=clamp(p.health+25,0,100);p.mood=clamp(p.mood+8,0,100);silent("You rested properly.");mainMenu();}}],
    ["Study Maps",()=>{if(spendAction()){apply({navigation:1,intelligence:1});silent("Studied maps and sea routes.");mainMenu();}}],
    ["Socialize",()=>{if(spendAction()){p.relationships.push({name:pick(DATA.names),status:pick(["Friend","Contact","Rival Contact","Informant"])});apply({charisma:1,mood:3});silent("Met someone new.");mainMenu();}}],
    ["Lay Low",()=>{if(spendAction()){p.heat=clamp(p.heat-2,0,99);p.reckless=clamp(p.reckless-1,0,99);silent("You kept a low profile.");mainMenu();}}],
    ["Gamble",()=>gambleMenu()]
  ]);
}
function adventureMenu(){
  submenu("Adventure","Open-ended ways to find trouble, stories, and secrets.",[
    ["Explore Island",()=>{if(spendAction()){if(Math.random()<.35){const e=pick(DATA.events);showEventFree(e)}else{apply({mystery:1,mood:2});silent("Explored the island and found rumors.");mainMenu();}}}],
    ["Follow Rumor",()=>{if(spendAction()){apply({mystery:2,heat:Math.random()<.4?1:0});silent("Followed a rumor deeper into the island.");mainMenu();}}],
    ["Look for Trouble",()=>{if(spendAction())startBattle("random","normal")}],
    ["Help Civilians",()=>{if(spendAction()){apply({honor:1,charisma:1,mood:2});silent("Helped civilians and earned local trust.");mainMenu();}}],
    ["Travel",()=>travelMenu()]
  ]);
}
function powerMenu(){
  submenu("Power Hunt","Choose how you pursue strength without being locked to a faction.",[
    ["Train Body",()=>{if(spendAction()){apply({strength:1,speed:1,health:-3});silent("Trained your body.");mainMenu();}}],
    ["Train Haki",()=>hakiMenu()],
    ["Search Fruit",()=>inspectFruitEncounter()],
    ["Search Weapon",()=>findWeapon()],
    ["Practice Weapon",()=>{if(spendAction()){apply({sword:1,armamentXP:1});silent(p.equippedWeapon?`Practiced with ${p.equippedWeapon.name}.`:"Practiced basic weapon forms.");mainMenu();}}],
    ["Create Signature Move",()=>{if(spendAction()){const move=signatureMoveName();p.movesMastery[move]=1;major(`Created signature move: ${move}.`);mainMenu();}}]
  ]);
}
function signatureMoveName(){
  const a=pick(["Storm","Iron","Crimson","Black","Thunder","Dragon","Wolf","Phoenix","Sea"]);
  const b=pick(["Fang","Lance","Burst","Breaker","Crash","Fist","Slash","Cannon","Judgment"]);
  return `${a} ${b}`;
}
function factionMenu(){
  submenu("Faction Choices","Interact with factions without fully changing your life path.",[
    ["Take Pirate Job",()=>{if(spendAction()){apply({bounty:3500,infamy:1,berries:2500});silent("Took a pirate-side job.");mainMenu();}}],
    ["Help Marines",()=>{if(spendAction()){apply({marineRep:1,honor:1,berries:2000});silent("Helped a Marine patrol.");mainMenu();}}],
    ["Aid Revolutionaries",()=>{if(spendAction()){apply({revolutionaryRep:1,heat:1,honor:1});silent("Aided a revolutionary contact.");mainMenu();}}],
    ["Take Bounty Contract",()=>huntBounty()],
    ["Join / Change Career Path",()=>choosePath()],
    ["Abandon Formal Path",()=>{p.path="Undecided";p.rank="None";p.crewMode="solo";p.roleData={};major("You abandoned your formal path and returned to the open sea.");mainMenu();}]
  ]);
}
function underworldMenu(){
  submenu("Underworld","Higher reward, higher consequence sandbox options.",[
    ["Smuggling Run",()=>{if(spendAction()){if(Math.random()<.25)return startBattle("raid","hard");apply({berries:8500,heat:2,infamy:1});silent("Completed a smuggling run.");mainMenu();}}],
    ["Black Market",()=>blackMarketMenu()],
    ["Steal Supplies",()=>{if(spendAction()){apply({berries:4000,heat:2,infamy:1,sneak:1});silent("Stole valuable supplies.");mainMenu();}}],
    ["Bribe Officials",()=>{if(spendAction()){const cost=3000+p.heat*1000;if(p.berries<cost){toast(`Need ฿${fmt(cost)}.`);return;}p.berries-=cost;p.heat=clamp(p.heat-3,0,99);silent("Bribed officials to lower heat.");mainMenu();}}],
    ["Start Rumor Network",()=>{if(spendAction()){apply({charisma:1,sneak:1,mystery:1});p.relationships.push({name:"Underworld Contact",status:"Information broker"});silent("Started building a rumor network.");mainMenu();}}]
  ]);
}
function drifterMenu(){
  submenu("Drifter Life","Stay uncommitted. Drift, survive, and build your legend without joining anyone.",[
    ["Sleep Under the Stars",()=>{if(spendAction()){p.health=clamp(p.health+12,0,100);p.mood=clamp(p.mood+4,0,100);silent("Slept under the stars.");mainMenu();}}],
    ["Take Any Job",()=>{if(spendAction()){apply({berries:2000,experience:1});silent("Took whatever job the island offered.");mainMenu();}}],
    ["Make a Local Friend",()=>{if(spendAction()){p.relationships.push({name:pick(DATA.names),status:"Local friend"});apply({charisma:1,mood:4});silent("Made a local friend.");mainMenu();}}],
    ["Start a New Reputation",()=>{if(spendAction()){p.epithet=pick(["the Wanderer","the Free Blade","the Nameless Storm","the Sea Ghost","the Laughing Rookie"]);major(`People started calling you ${p.epithet}.`);mainMenu();}}],
    ["Choose a Real Path",()=>choosePath()]
  ]);
}
function showEventFree(e){
  $("screen").innerHTML=`<h2>${e.title}</h2><p>${e.text}</p><div class="choices" id="eventChoices"></div>`;
  const c=$("eventChoices");
  e.choices.forEach(choice=>{
    const b=document.createElement("button");
    b.textContent=choice[0];
    b.onclick=()=>{apply(choice[1]);major(choice[2]);mainMenu();};
    c.appendChild(b);
  });
  addButton(c,"Walk Away",()=>{silent("You walked away from the situation.");mainMenu()},"primary");
  render();
}

/* Override: age 16 no longer forces the career screen */
function ageUp(){
  if(!p||p.dead)return;
  p.age++;p.actionsLeft=p.energy;p.mood=clamp(p.mood+pick([-4,-2,0,1,3]),0,100);
  if(p.injuries.length && Math.random()<0.35){const healed=p.injuries.shift();log(`Recovered from ${healed}.`)}
  worldTick();
  if(p.age===16 && p.path==="Undecided"){
    log("You are old enough to choose a path, but the open sea does not force you.");
  }
  randomLifeBeat();
  save();mainMenu();
}

/* Override: career role is optional */
function careerRoleMenu(){
  if(p.path==="Undecided"){
    $("screen").innerHTML=`<h2>⭐ Career Role</h2>
    <p>You have not committed to a formal path. You can choose one, keep drifting, or do faction jobs without joining anyone.</p>
    <div class="choices">
      <button onclick="choosePath()">Choose a Path</button>
      <button onclick="drifterMenu()">Stay a Drifter</button>
      <button onclick="factionMenu()">Do Faction Jobs</button>
      <button class="primary" onclick="mainMenu()">Back</button>
    </div>`;
    render();
    return;
  }
  if(p.path==="Pirate")return pirateRoleMenu();
  if(p.path==="Marine")return marineRoleMenu();
  if(p.path==="Revolutionary")return submenu("🔥 Revolutionary Role","Liberation missions and covert work.",[
    ["Liberation Mission",()=>{if(spendAction()){apply({revolutionaryRep:2,honor:1,heat:1,freedom:1});silent("Helped liberate civilians.");mainMenu();}}],
    ["Covert Intel",()=>{if(spendAction()){apply({sneak:2,mystery:1,heat:1});silent("Ran covert intel.");mainMenu();}}],
    ["Leave Cell",()=>{p.path="Undecided";p.rank="None";p.roleData={};major("You left your revolutionary cell.");mainMenu();}]
  ]);
  if(p.path==="Bounty Hunter")return submenu("🎯 Bounty Hunter Role","Contracts and pursuit.",[
    ["Take Contract",()=>huntBounty()],
    ["Track Target",()=>{if(spendAction()){apply({intelligence:1,observationXP:1});silent("Tracked a target.");mainMenu();}}],
    ["Leave Guild",()=>{p.path="Undecided";p.rank="None";p.roleData={};major("You left the bounty guild.");mainMenu();}]
  ]);
  if(p.path==="Doctor")return submenu("🩺 Doctor Role","Treat patients and improve survival.",[
    ["Treat Patients",()=>{if(spendAction()){p.health=clamp(p.health+25,0,100);apply({medicine:1,honor:1});silent("Treated patients.");mainMenu();}}],
    ["Medical Research",()=>{if(spendAction()){apply({medicine:2,intelligence:1});silent("Researched rare disease.");mainMenu();}}],
    ["Close Clinic",()=>{p.path="Undecided";p.rank="None";p.roleData={};major("You left the clinic life.");mainMenu();}]
  ]);
  if(p.path==="Shipwright")return submenu("🛠️ Shipwright Role","Build, repair, and modify ships.",[
    ["Repair Ship",()=>repairShip()],
    ["Build Parts",()=>{if(spendAction()){apply({craft:2,berries:4000});silent("Built ship parts for profit.");mainMenu();}}],
    ["Leave Dockyard",()=>{p.path="Undecided";p.rank="None";p.roleData={};major("You left dockyard work.");mainMenu();}]
  ]);
}

/* Override main menu into sandbox-first layout */
function mainMenu(){
  ensure();render();
  if(p.dead)return deathScreen();
  if(p.age>=80)return ending();
  $("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2>
    <div class="dangerMeter survivalBox"><b>Danger:</b> ${dangerText()} · Reckless ${p.reckless}</div>
    <p><b>${p.actionsLeft}</b> energy left. This is the open sea — commit to a path, drift, scheme, train, explore, or switch allegiances.</p>
    <div class="menuGrid">
      <button class="primary" onclick="ageUp()">Age Up</button>
      <button class="gold" onclick="freedomHub()">🌊 Open Sea</button>
      <button onclick="careerRoleMenu()">⭐ Career Role</button>
      <button onclick="combatMenu()">⚔️ Combat</button>
      <button onclick="dailyLifeMenu()">Daily Life</button>
      <button onclick="adventureMenu()">Adventure</button>
      <button onclick="powerMenu()">Power Hunt</button>
      <button onclick="factionMenu()">Faction Choices</button>
      <button onclick="underworldMenu()">Underworld</button>
      <button onclick="drifterMenu()">Drifter Life</button>
      <button onclick="powerCodexMenu()">📖 Pirate Codex</button>
      <button onclick="ownedWeapons()">⚔️ Weapons</button>
      <button onclick="travelMenu()">Travel</button>
      <button onclick="crewMenu()">Crew / Unit</button>
      <button onclick="assetsMenu()">Assets</button>
      <button onclick="relationshipsMenu()">Social</button>
      <button onclick="legacyMenu()">Legacy</button>
      <button onclick="save()">Save</button>
    </div>`;
}
