
"use strict";

const SAVE_KEY = "gpls_save_v88";
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
    build:"v8.8", name:"Rookie", age:10, origin:"Unknown", dream:"Unknown", path:"Undecided", rank:"None",
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
  p.build="v8.8";
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
  p.build="v8.8";
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
function baseShowTab_v81(tab,silent=false){
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
  if(tab==="log")$("tab").innerHTML=`<h3>Game Info</h3><div class="notice">Version: v8.8<br>Save Build: ${p.build}<br>Cache-busted files: yes<br>Current URL tip: add ?v=70 if needed.</div>`;
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

function baseSetup_v81(){
  p=newPlayer();
  render();
  $("screen").innerHTML=`<h2>Start a New Life</h2>
    <p><b>v8.8 Remaster</b> rebuilds the game for stability, cleaner UI, and fewer freezes.</p>
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

function baseMainMenu_v81(){
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
function baseAgeUp_v81(){
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
   v8.8 Narrative Foundation — Birth to Legend
   ========================= */

const LIFE_FAMILIES=[
  {name:"Poor Dock Workers",wealth:"Poor",bonus:{berries:50,strength:1},text:"Your family survives on dock labor and favors."},
  {name:"Working Fisher Family",wealth:"Working",bonus:{health:4,navigation:1},text:"Your family knows the sea better than most."},
  {name:"Merchant Family",wealth:"Comfortable",bonus:{berries:1200,charisma:1},text:"Your family trades goods between islands."},
  {name:"Marine Family",wealth:"Stable",bonus:{discipline:2,marineRep:1},text:"Justice is discussed at your dinner table."},
  {name:"Criminal Family",wealth:"Unstable",bonus:{sneak:2,heat:1},text:"You learn early that law and survival are not the same."},
  {name:"Noble Household",wealth:"Rich",bonus:{berries:3000,charisma:2,mood:-4},text:"You are born with status, but expectations follow you."},
  {name:"Unknown Parents",wealth:"Unknown",bonus:{freedom:1},text:"No one knows where you came from. Maybe that matters."}
];
const SEAS_V81=["East Blue","West Blue","North Blue","South Blue"];
const DREAMS_V81=[
  {name:"Freedom",trait:"independence",text:"You want to live without chains."},
  {name:"Pirate King",trait:"ambition",text:"You want the whole sea to know your name."},
  {name:"Justice",trait:"discipline",text:"You want to decide what justice means."},
  {name:"Knowledge",trait:"curiosity",text:"You want to uncover hidden truths."},
  {name:"Riches",trait:"greed",text:"You want wealth beyond imagination."},
  {name:"Strongest Swordsman",trait:"courage",text:"You want your blade to reach the top."},
  {name:"Protect My People",trait:"compassion",text:"You want strength to protect what matters."},
  {name:"Unknown",trait:"willpower",text:"You do not know yet. The sea will show you."}
];

const LIFE_EVENTS_V81=[
  {phase:"Early Childhood",min:1,max:4,title:"The Market Crowd",text:"You wander away from your family in a crowded market.",choices:[
    ["Keep exploring",{curiosity:2,courage:1,mood:1},"You follow your curiosity through the crowd."],
    ["Return home",{caution:2,discipline:1},"You return before anyone notices."],
    ["Follow a strange sound",{curiosity:1,luck:1},"You find a musician playing a song about the sea."]
  ]},
  {phase:"Early Childhood",min:2,max:5,title:"Shiny Coin",text:"You find a shiny coin on the street.",choices:[
    ["Keep it",{greed:1,berries:100},"You keep the coin and feel clever."],
    ["Return it",{compassion:1,honor:1},"You return it to an old shopkeeper."],
    ["Spend it",{mood:4,greed:1},"You spend it on something sweet."]
  ]},
  {phase:"Foundation Years",min:5,max:12,title:"Bullied Child",text:"Older kids are picking on a smaller child near the docks.",choices:[
    ["Help them",{compassion:2,leadership:1,courage:1},"You step in even though you are scared."],
    ["Talk them down",{charisma:1,leadership:1,honor:1},"You talk the bullies away."],
    ["Join the bullies",{ruthless:2,infamy:1},"You learn that power can be cruel."],
    ["Ignore it",{caution:1,fear:1},"You walk away and remember their crying."]
  ]},
  {phase:"Foundation Years",min:6,max:12,title:"Dock Work",text:"Your family asks you to help at the docks.",choices:[
    ["Work hard",{strength:1,discipline:1,berries:200},"You work until your hands ache."],
    ["Slack off",{mood:2,discipline:-1},"You avoid the work and enjoy the day."],
    ["Listen to sailors",{curiosity:1,navigation:1},"You hear stories of dangerous seas."]
  ]},
  {phase:"Foundation Years",min:7,max:13,title:"First Fight",text:"A local kid shoves you and dares you to fight.",choices:[
    ["Fight back",{strength:1,courage:1,reckless:1},"You throw your first real punch."],
    ["Walk away",{discipline:1,caution:1},"You refuse to be baited."],
    ["Embarrass them",{charisma:1,confidence:1},"You make the crowd laugh at them instead."],
    ["Fight dirty",{sneak:1,ruthless:1},"You win with a cheap shot."]
  ]},
  {phase:"Identity Years",min:13,max:18,title:"Traveling Swordsman",text:"A traveling swordsman notices your stance and offers a brief lesson.",choices:[
    ["Train seriously",{sword:2,discipline:1,strength:1},"You learn the weight of a blade."],
    ["Ask about the world",{intelligence:1,curiosity:1},"You learn that every sea has monsters."],
    ["Challenge them",{courage:2,reckless:1,sword:1},"You lose quickly, but they respect your nerve."],
    ["Ignore them",{caution:1},"You let the chance pass."]
  ]},
  {phase:"Identity Years",min:13,max:18,title:"Pirate Ship Arrives",text:"A pirate ship docks nearby. The town becomes tense.",choices:[
    ["Sneak aboard",{sneak:2,curiosity:1,heat:1},"You glimpse maps, weapons, and treasure."],
    ["Tell the Marines",{marineRep:1,discipline:1},"You report the ship."],
    ["Approach the crew",{charisma:1,courage:1,infamy:1},"You speak to pirates and survive the conversation."],
    ["Stay away",{caution:2},"You avoid the danger."]
  ]},
  {phase:"Identity Years",min:14,max:19,title:"Mentor's Offer",text:"A local mentor offers to teach you if you commit your time.",choices:[
    ["Learn combat",{strength:1,sword:1,armamentXP:1},"You learn how to stand your ground."],
    ["Learn navigation",{navigation:2,intelligence:1},"You learn how islands connect."],
    ["Learn medicine",{medicine:2,intelligence:1},"You learn how fragile life is."],
    ["Refuse",{freedom:1,independence:1},"You choose your own road."]
  ]},
  {phase:"Identity Years",min:15,max:20,title:"Friend Insulted",text:"A drunk pirate insults someone close to you.",choices:[
    ["Ignore it",{discipline:1,caution:1},"You swallow your anger."],
    ["Threaten them",{courage:1,charisma:1},"You make it clear they should leave."],
    ["Fight them",{triggerCombat:"bar fight",courage:1,reckless:1},"You choose violence."],
    ["Get help",{leadership:1,compassion:1},"You bring others together before things explode."]
  ]},
  {phase:"Open Sea",min:18,max:99,title:"Crew Opportunity",text:"You meet a capable wanderer looking for purpose.",choices:[
    ["Recruit them",{leadership:1,crewAdd:true},"They join your journey."],
    ["Befriend them",{charisma:1,relationshipAdd:true},"You gain a valuable contact."],
    ["Rob them",{ruthless:1,berries:1500,infamy:1},"You take what they have."],
    ["Walk away",{caution:1},"You leave them behind."]
  ]},
  {phase:"Open Sea",min:18,max:99,title:"Bounty Poster",text:"A bounty poster with your face appears in town.",choices:[
    ["Celebrate",{confidence:1,infamy:1,mood:4},"You feel your legend growing."],
    ["Hide",{sneak:1,heat:-1},"You keep a low profile."],
    ["Confront the source",{triggerCombat:"bounty hunter",courage:1},"You hunt whoever spread it."],
    ["Use it for fame",{charisma:1,leadership:1},"You turn reputation into opportunity."]
  ]},
  {phase:"Open Sea",min:18,max:99,title:"Island Crisis",text:"The island faces a crisis. People are looking for someone to act.",choices:[
    ["Help civilians",{compassion:2,honor:1},"You protect people who cannot protect themselves."],
    ["Exploit the chaos",{greed:2,berries:5000,infamy:1},"You profit while others panic."],
    ["Side with Marines",{marineRep:2,discipline:1},"You help restore order."],
    ["Side with rebels",{revolutionaryRep:2,freedom:1,heat:1},"You help the oppressed fight back."]
  ]}
];

const FATE_EVENTS_V81=[
  {phase:"Fate Event",fate:true,title:"Strange Fruit",text:"A strange patterned fruit washes ashore after a storm.",choices:[
    ["Eat it",{fateFruit:true,courage:1,curiosity:1},"You take a bite and your life changes."],
    ["Hide it",{mystery:2,caution:1},"You hide the fruit for later."],
    ["Sell the rumor",{berries:8000,greed:1},"You sell the information to dangerous people."],
    ["Tell the Marines",{marineRep:2,discipline:1},"You report the discovery."]
  ]},
  {phase:"Fate Event",fate:true,title:"Village Raid",text:"Raiders attack your home. Smoke rises over the rooftops.",choices:[
    ["Protect people",{triggerCombat:"raiders",compassion:2,courage:2},"You stand between danger and your people."],
    ["Save family",{compassion:1,fear:1},"You focus only on those closest to you."],
    ["Loot during chaos",{ruthless:2,berries:4000,infamy:2},"You take advantage of disaster."],
    ["Run",{fear:2,caution:1},"You survive by fleeing."]
  ]},
  {phase:"Fate Event",fate:true,title:"Legendary Mentor",text:"A legendary fighter passes through your island and notices your potential.",choices:[
    ["Beg for training",{strength:2,discipline:2,potential:1},"They teach you one brutal lesson."],
    ["Ask about dreams",{ambition:2,willpower:1},"They ask what you truly want."],
    ["Challenge them",{triggerCombat:"mentor test",courage:2,reckless:1},"They accept with a smile."],
    ["Watch silently",{observationXP:3,caution:1},"You study their movement from afar."]
  ]}
];

function v81Ensure(){
  ensure();
  if(!p.hiddenTraits)p.hiddenTraits={compassion:0,ruthless:0,greed:0,courage:0,caution:0,curiosity:0,leadership:0,ambition:0,willpower:0,fear:0,confidence:0,independence:0,luck:0,reckless:0};
  if(!p.lifeFlags)p.lifeFlags={dreamChosen:false,traitMilestones:{},birthGenerated:false};
  if(!p.chapterLog)p.chapterLog=[];
  if(p.potential===undefined)p.potential=1;
  p.build="v8.8";
}
function trait(k,v=1){
  v81Ensure();
  if(p.hiddenTraits[k]===undefined)p.hiddenTraits[k]=0;
  p.hiddenTraits[k]+=v;
  if(k==="leadership")p.kingTraits.leadership=(p.kingTraits.leadership||0)+Math.max(0,v);
  if(k==="courage")p.kingTraits.courage=(p.kingTraits.courage||0)+Math.max(0,v);
  if(k==="ambition")p.kingTraits.ambition=(p.kingTraits.ambition||0)+Math.max(0,v);
  if(k==="willpower")p.kingTraits.presence=(p.kingTraits.presence||0)+Math.max(0,v);
}
function narrativeApply(e={}){
  v81Ensure();
  for(const [k,v] of Object.entries(e)){
    if(["triggerCombat","crewAdd","relationshipAdd","fateFruit"].includes(k))continue;
    if(k in p.hiddenTraits)trait(k,v);
    else apply({[k]:v});
  }
}
function createBirth(){
  p=newPlayer();
  v81Ensure();
  const sea=pick(SEAS_V81);
  const family=pick(LIFE_FAMILIES);
  p.name=($("nameInput")&&$("nameInput").value.trim())||pick(DATA.names);
  p.age=0;
  p.region=sea;
  p.island=pick(DATA.islands.filter(x=>x.region==="Home Sea")).name;
  p.origin=family.name;
  p.family=family;
  p.dream="Undiscovered";
  p.portrait=pick(["👶","🍼","🌊","⭐"]);
  p.potential=1+Math.floor(Math.random()*5);
  trait("luck",Math.floor(Math.random()*3));
  trait("willpower",Math.floor(Math.random()*3));
  trait("ambition",Math.floor(Math.random()*2));
  apply(family.bonus||{});
  p.lifeFlags.birthGenerated=true;
  p.feed.unshift(`Born in ${sea}. Family: ${family.name}. ${family.text}`);
  save();
  mainMenu();
}
function setup(){
  p=newPlayer();
  render();
  $("screen").innerHTML=`<h2>Begin a New Life</h2>
    <p><b>v8.8 Narrative Foundation</b> starts at birth and builds your legend through age-up life events.</p>
    <div class="chapterCard"><b>Concept:</b> BitLife-style aging at the core, with One Piece dreams, powers, combat, crew, rivals, and fate layered on top.</div>
    <input id="nameInput" placeholder="Character name, or leave blank for random">
    <div class="choices">
      <button class="primary" onclick="createBirth()">Be Born</button>
      ${hasSave()?'<button onclick="load()">Load Saved Life</button>':''}
      <button class="danger" onclick="clearSave()">Clear Save</button>
    </div>`;
}
function getLifePool(){
  v81Ensure();
  let pool=LIFE_EVENTS_V81.filter(e=>p.age>=e.min&&p.age<=e.max);
  if(!pool.length)pool=LIFE_EVENTS_V81.filter(e=>e.phase==="Open Sea");
  if(p.age>=10 && !p.lifeFlags.dreamChosen && Math.random()<.35)return [{dreamEvent:true}];
  if(p.age>=4 && Math.random()<fateChance())pool=pool.concat(FATE_EVENTS_V81);
  return pool;
}
function fateChance(){
  v81Ensure();
  return clamp(0.06+(p.hiddenTraits.curiosity||0)*0.006+(p.hiddenTraits.luck||0)*0.018,0.04,0.22);
}
function ageUp(){
  if(!p||p.dead)return;
  v81Ensure();
  p.age++;
  p.actionsLeft=p.energy;
  p.mood=clamp(p.mood+pick([-4,-2,0,1,3]),0,100);
  if(p.injuries.length && Math.random()<0.35){const healed=p.injuries.shift();log(`Recovered from ${healed}.`)}
  if(typeof worldTick==="function")worldTick();
  const event=pick(getLifePool());
  save();
  if(event.dreamEvent)return dreamChoiceEvent();
  showLifeEvent(event);
}
function showLifeEvent(e){
  v81Ensure();
  const fateClass=e.fate?" fateEvent":"";
  $("screen").innerHTML=`<h2>Age ${p.age}: ${e.title}</h2>
  <div class="chapterCard${fateClass}">
    <b>${e.phase||"Life Event"}</b>
    <p>${e.text}</p>
  </div>
  <div class="choices" id="lifeChoices"></div>`;
  const c=$("lifeChoices");
  e.choices.forEach(choice=>{
    const b=document.createElement("button");
    b.innerHTML=`${choice[0]}<div class="choiceImpact">${previewImpact(choice[1])}</div>`;
    b.onclick=()=>resolveLifeChoice(e,choice);
    c.appendChild(b);
  });
  addButton(c,"Do Nothing / Let Life Pass",()=>{log(`You let the moment pass: ${e.title}.`);save();mainMenu()},"primary");
  render();
}
function previewImpact(e={}){
  const keys=Object.keys(e).filter(k=>!["triggerCombat","crewAdd","relationshipAdd","fateFruit"].includes(k));
  const parts=keys.slice(0,4).map(k=>`${k} ${e[k]>0?"+":""}${e[k]}`);
  if(e.triggerCombat)parts.push("combat");
  if(e.crewAdd)parts.push("possible crew");
  if(e.relationshipAdd)parts.push("new contact");
  if(e.fateFruit)parts.push("Devil Fruit fate");
  return parts.join(" · ")||"story choice";
}
function resolveLifeChoice(event,choice){
  const [label,effect,result]=choice;
  narrativeApply(effect);
  p.chapterLog.unshift({age:p.age,title:event.title,choice:label,result});
  p.chapterLog=p.chapterLog.slice(0,100);
  log(result);
  if(effect.fateFruit)return grantNarrativeFruit();
  if(effect.crewAdd)return narrativeCrewJoin(result);
  if(effect.relationshipAdd)return narrativeRelationship(result);
  if(effect.triggerCombat)return startNarrativeCombat(effect.triggerCombat,result);
  checkTraitMilestones();
  save();
  mainMenu();
}
function dreamChoiceEvent(){
  $("screen").innerHTML=`<h2>Age ${p.age}: What Do You Seek?</h2>
  <div class="dreamCard"><p>Something inside you begins to take shape. It is not a career yet. It is the thing your life keeps turning toward.</p></div>
  <div class="choices" id="dreamChoices"></div>`;
  const c=$("dreamChoices");
  DREAMS_V81.forEach(d=>{
    const b=document.createElement("button");
    b.innerHTML=`${d.name}<small>${d.text}</small>`;
    b.onclick=()=>{p.dream=d.name;p.lifeFlags.dreamChosen=true;trait(d.trait,2);major(`Dream awakened: ${d.name}.`);save();mainMenu();};
    c.appendChild(b);
  });
  render();
}
function grantNarrativeFruit(){
  const order=["Common","Uncommon","Rare","Epic","Legendary","Mythic"];
  const max=2+Math.floor((p.hiddenTraits.luck||0)/3)+(p.hiddenTraits.curiosity>4?1:0);
  let pool=DATA.fruitCatalog.filter(f=>order.indexOf(f.rarity)<=Math.min(5,max));
  if(Math.random()<.08)pool=DATA.fruitCatalog;
  const f=deep(pick(pool.length?pool:DATA.fruitCatalog));
  window.__fruit=f;
  $("screen").innerHTML=`<h2>🍎 Fate Fruit: ${f.name}</h2>
  <div class="powerCard rarity${f.rarity}">
    <p><b>${f.type}</b> · ${f.rarity}</p>
    <p>${f.desc}</p>
    <p><b>Passives:</b> ${f.passives.join(", ")}</p>
    <p><b>Moves:</b> ${f.moves.join(", ")}</p>
    <p><b>Weakness:</b> ${f.weakness}</p>
  </div>
  <div class="choices">
    <button onclick="eatFoundFruit()">Eat It</button>
    <button onclick="sellFoundFruit()">Sell It</button>
    <button onclick="p.codex.fruits.push(window.__fruit);major('You hid the fruit and recorded its details.');mainMenu()">Hide It</button>
  </div>`;
  render();
}
function narrativeCrewJoin(result){
  const c={name:pick(DATA.names),role:pick(["Navigator","Fighter","Doctor","Sniper","Cook","Shipwright","Scout"]),loyalty:5+Math.floor(Math.random()*3),dream:pick(DREAMS_V81).name};
  p.crew.push(c);
  major(`${result} ${c.name}, a ${c.role}, joined your life. Their dream: ${c.dream}.`);
  save();mainMenu();
}
function narrativeRelationship(result){
  const r={name:pick(DATA.names),status:pick(["Friend","Rival","Mentor","Informant","Local Ally"]),ageMet:p.age};
  p.relationships.push(r);
  major(`${result} You met ${r.name}, now marked as ${r.status}.`);
  save();mainMenu();
}
function startNarrativeCombat(kind,result){
  log(result);
  startBattle(kind,"normal");
}
function checkTraitMilestones(){
  v81Ensure();
  const traits=p.hiddenTraits;
  const checks=[
    ["compassion","Compassionate"],["ruthless","Ruthless"],["courage","Fearless"],["greed","Opportunist"],
    ["leadership","Inspiring"],["curiosity","Curious"],["caution","Careful"],["reckless","Reckless"]
  ];
  checks.forEach(([k,name])=>{
    if((traits[k]||0)>=5 && !p.lifeFlags.traitMilestones[name]){
      p.lifeFlags.traitMilestones[name]=true;
      if(name==="Ruthless")p.epithet="the Cold";
      if(name==="Fearless")p.epithet="the Brave";
      log(`Trait emerged: ${name}.`);
    }
  });
  const kingScore=(traits.leadership||0)+(traits.courage||0)+(traits.ambition||0)+(traits.willpower||0);
  if(kingScore>=12 && p.conqueror===0 && Math.random()<0.25){
    p.conqueror=1;
    major("Your will erupted for the first time. Conqueror Haki awakened.");
  }
}
function lifePhaseName(){
  if(p.age<=4)return "Early Childhood";
  if(p.age<=12)return "Foundation Years";
  if(p.age<=18)return "Identity Years";
  return "Open Sea";
}
function mainMenu(){
  v81Ensure();
  render();
  if(p.dead)return deathScreen();
  if(p.age>=80)return ending();
  $("screen").innerHTML=`<h2>Age ${p.age}: ${p.name}'s Life</h2>
    <div class="chapterCard"><b>Chapter:</b> ${lifePhaseName()}<br><b>Dream:</b> ${p.dream}<br><b>Family:</b> ${p.origin}<br><b>Sea:</b> ${p.region}</div>
    <div class="dangerMeter survivalBox"><b>Danger:</b> ${dangerText()} · Reckless ${p.reckless}</div>
    <p><b>${p.actionsLeft}</b> energy left. Age Up is the heartbeat; actions shape the person you become.</p>
    <div class="menuGrid">
      <button class="primary" onclick="ageUp()">Age Up</button>
      <button onclick="lifeActionsMenu()">Life Actions</button>
      <button onclick="careerRoleMenu()">⭐ Career / Identity</button>
      <button onclick="combatMenu()">⚔️ Combat Practice</button>
      <button onclick="trainingMenu()">Training</button>
      <button onclick="hakiMenu()">Haki</button>
      <button onclick="powerCodexMenu()">📖 Codex</button>
      <button onclick="ownedWeapons()">⚔️ Weapons</button>
      <button onclick="relationshipsMenu()">Relationships</button>
      <button onclick="travelMenu()">Travel</button>
      <button onclick="assetsMenu()">Assets</button>
      <button onclick="legacyMenu()">Legacy</button>
      <button onclick="save()">Save</button>
    </div>`;
}
function lifeActionsMenu(){
  v81Ensure();
  const actions=[];
  if(p.age<=4){
    actions.push(["Play",()=>{if(spendAction()){trait("curiosity",1);p.mood=clamp(p.mood+4,0,100);silent("You played and explored the world.");mainMenu();}}]);
    actions.push(["Stay Near Family",()=>{if(spendAction()){trait("caution",1);p.mood=clamp(p.mood+2,0,100);silent("You stayed close to family.");mainMenu();}}]);
  }else if(p.age<=12){
    actions.push(["Help Family",()=>{if(spendAction()){apply({berries:200,discipline:1});trait("compassion",1);silent("You helped your family.");mainMenu();}}]);
    actions.push(["Sneak Around",()=>{if(spendAction()){apply({sneak:1});trait("curiosity",1);silent("You snuck around town.");mainMenu();}}]);
    actions.push(["Make Friends",()=>{if(spendAction()){narrativeRelationship("You opened yourself to others.");}}]);
  }else{
    actions.push(["Work",()=>{if(spendAction()){apply({berries:1200+Math.floor(Math.random()*2000)});silent("You worked for money.");mainMenu();}}]);
    actions.push(["Explore Island",()=>{if(spendAction()){showLifeEvent(pick(getLifePool()));}}]);
    actions.push(["Socialize",()=>{if(spendAction()){narrativeRelationship("You spent time with people nearby.");}}]);
    actions.push(["Seek Opportunity",()=>{if(spendAction()){const event=Math.random()<fateChance()?pick(FATE_EVENTS_V81):pick(LIFE_EVENTS_V81.filter(e=>p.age>=e.min&&p.age<=e.max));showLifeEvent(event);}}]);
  }
  actions.push(["Rest",()=>{if(spendAction()){p.health=clamp(p.health+20,0,100);p.mood=clamp(p.mood+5,0,100);silent("You rested.");mainMenu();}}]);
  submenu("Life Actions",`Current phase: ${lifePhaseName()}`,actions);
}
function showTab(tab,silent=false){
  currentTab=tab;
  if(!p){$("tab").innerHTML="";return;}
  if(tab==="life"){
    v81Ensure();
    $("tab").innerHTML=`<h3>Life</h3><div class="cardGrid">
      <div class="miniCard"><h4>Visible Stats</h4><p>Health ${p.health}<br>Morale ${p.mood}<br>Physical ${Math.floor((p.strength+p.speed+p.durability)/3)}<br>Intelligence ${p.intelligence}<br>Charisma ${p.charisma}<br>Potential ${p.potential}</p></div>
      <div class="miniCard"><h4>Hidden Traits</h4><p>${Object.entries(p.hiddenTraits).map(([k,v])=>`${k}: ${v}`).join("<br>")}</p></div>
      <div class="miniCard"><h4>Identity</h4><p>Dream: ${p.dream}<br>Family: ${p.origin}<br>Phase: ${lifePhaseName()}</p></div>
      <div class="miniCard"><h4>Injuries</h4><p>${p.injuries.join("<br>")||"None"}</p></div>
    </div>`;
    return;
  }
  if(tab==="log"){
    $("tab").innerHTML=`<h3>Life Chapters</h3>${(p.chapterLog||[]).slice(0,12).map(c=>`<div class="line"><span>Age ${c.age}: ${c.title}</span><b>${c.choice}</b></div>`).join("")||"<p>No chapters yet.</p>"}<h3>Game Info</h3><div class="notice">Version: v8.8<br>Save Build: ${p.build}<br>Core: BitLife-style aging, One Piece narrative systems.</div>`;
    return;
  }
  return baseShowTab_v81(tab,silent);
}


/* =========================
   v8.8 UI Stability Fix
   Safe mockup-style layout without render override
   ========================= */
function v84Bar(label,val,max=100,icon=""){
  const pct=clamp((val/max)*100,0,100);
  return `<div class="v84StatLine"><b>${icon} ${label}</b><div class="v84Bar"><i style="width:${pct}%"></i></div><span>${Math.round(val)}</span></div>`;
}
function renderDashboard(){
  if(!p){$("dashboard").innerHTML="<h2>Character</h2><p>No life started.</p>";return;}
  v81Ensure();
  const physical=Math.floor((p.strength+p.speed+p.durability)/3);
  $("dashboard").innerHTML=`
  <div class="v84Card">
    <h3 class="v84Title">Character</h3>
    <div class="v84PortraitRow">
      <div class="v84Portrait">${p.portrait||"🙂"}</div>
      <div>
        <h2 style="margin:0">${p.name}</h2>
        <div>Age: ${p.age}</div>
        <div>${p.region}</div>
        <div>${typeof lifePhaseName==="function"?lifePhaseName():p.origin}</div>
        <div>Bounty: ฿${fmt(p.bounty)}</div>
      </div>
    </div>
  </div>
  <div class="v84Card" style="margin-top:10px">
    <h3 class="v84Title">Stats</h3>
    ${v84Bar("Health",p.health,100,"❤️")}
    ${v84Bar("Morale",p.mood,100,"😊")}
    ${v84Bar("Intelligence",p.intelligence*10,100,"📘")}
    ${v84Bar("Physical",physical*10,100,"💪")}
    ${v84Bar("Charisma",p.charisma*10,100,"✨")}
    ${v84Bar("Potential",(p.potential||1)*15,100,"⚡")}
  </div>`;
}
function v84RightPanelHTML(){
  if(!p)return "";
  return `<aside class="v84Right">
    <div class="v84Card">
      <h3 class="v84Title">Dream</h3>
      <h2>${p.dream||"Undiscovered"}</h2>
      <p>${p.dream==="Undiscovered"||!p.dream?"Find your path in life and decide what you truly seek.":"Your dream quietly shapes the events that find you."}</p>
      <button onclick="typeof dreamChoiceEvent==='function'?dreamChoiceEvent():mainMenu()">Set / Reflect</button>
    </div>
    <div class="v84Card">
      <h3 class="v84Title">Faction Reputation</h3>
      <div class="line"><span>Marines</span><b>${p.marineRep||0}</b></div>
      <div class="line"><span>Pirates</span><b>${p.infamy||0}</b></div>
      <div class="line"><span>Revolutionaries</span><b>${p.revolutionaryRep||0}</b></div>
      <div class="line"><span>Underworld</span><b>${p.heat||0}</b></div>
    </div>
    <div class="v84Card">
      <h3 class="v84Title">World Hints</h3>
      <div class="line"><span>Pirate ship near Shells Town</span><b>soon</b></div>
      <div class="line"><span>Marine recruitment rumor</span><b>teen</b></div>
      <div class="line"><span>Fighting tournament whispers</span><b>later</b></div>
      <button onclick="showTab('log')">View Life Log</button>
    </div>
  </aside>`;
}
function v84InjectRightPanel(){
  const layout=document.querySelector(".layout");
  if(!layout||document.querySelector(".v84Right"))return;
  layout.insertAdjacentHTML("beforeend",v84RightPanelHTML());
}
function v84RefreshRightPanel(){
  const old=document.querySelector(".v84Right");
  if(old)old.outerHTML=v84RightPanelHTML();
  else v84InjectRightPanel();
}
function v84HomeEventText(){
  const last=(p.chapterLog&&p.chapterLog[0])?p.chapterLog[0]:null;
  if(last)return `<h2>${last.title}</h2><p>${last.result||"Your story continues."}</p>`;
  if(p.age===0)return `<h2>Birth</h2><p>You have been born into the world. The sea does not know your name yet.</p>`;
  return `<h2>Life Event</h2><p>Press Age Up to move into the next chapter of your life.</p>`;
}
function mainMenu(){
  v81Ensure();render();v84RefreshRightPanel();
  if(p.dead)return deathScreen();
  $("screen").innerHTML=`
  <div class="v84Scene">
    <div class="v84SceneHeader">
      <div>
        <div class="v84Age">AGE ${p.age}</div>
        <div>Year ${p.age} of Your Life</div>
        <div class="v84Location">📍 ${p.island||"Unknown Island"}, ${p.region||"Unknown Sea"}</div>
      </div>
      <div style="text-align:right">
        <div>Dream: <b>${p.dream||"Undiscovered"}</b></div>
        <div>Bounty: <b>฿${fmt(p.bounty)}</b></div>
      </div>
    </div>
    <div class="v84EventWrap">
      <div class="v84Parchment">
        ${v84HomeEventText()}
        <div class="choices">
          <button onclick="ageUp()">⭐ Continue Life / Age Up</button>
          <button onclick="lifeActionsMenu()">Do something this year</button>
          <button onclick="showTab('life')">Review your life</button>
        </div>
      </div>
    </div>
    <div class="v84History">
      <h3>Recent History</h3>
      ${(p.feed||[]).slice(0,5).map(x=>`<div>• ${x}</div>`).join("")||"<div>No history yet.</div>"}
    </div>
  </div>
  <div class="v84BottomActions">
    <button onclick="lifeActionsMenu()">🧭<br>Activities</button>
    <button onclick="relationshipsMenu()">👥<br>Relationships</button>
    <button onclick="ownedWeapons()">🎒<br>Inventory</button>
    <button class="v84AgeButton" onclick="ageUp()">⭐<br>Age Up</button>
    <button onclick="crewMenu()">☠️<br>Crew</button>
    <button onclick="trainingMenu()">🏋️<br>Training</button>
    <button onclick="assetsMenu()">🏠<br>Assets</button>
    <button onclick="travelMenu()">⛵<br>Travel</button>
  </div>`;
}
function setup(){
  p=newPlayer();
  render();v84RefreshRightPanel();
  $("screen").innerHTML=`
  <div class="v84Scene">
    <div class="v84SceneHeader">
      <div>
        <div class="v84Age">BEGIN LIFE</div>
        <div class="v84Location">🌊 A new legend is about to be born</div>
      </div>
    </div>
    <div class="v84EventWrap">
      <div class="v84Parchment">
        <h2>Great Pirate Life Sim</h2>
        <p>Start at birth. Grow through choices. Let the sea shape your story.</p>
        <input id="nameInput" placeholder="Character name, or leave blank for random">
        <div class="choices">
          <button onclick="createBirth()">Be Born</button>
          ${hasSave()?'<button onclick="load()">Load Saved Life</button>':''}
          <button onclick="clearSave()">Clear Save</button>
        </div>
      </div>
    </div>
  </div>`;
}


/* =========================
   v8.8 Age-Based Energy + Life Stage Limits
   ========================= */
function ageEnergyLimit(age){
  if(age<=2)return 1;      // baby/toddler: tiny influence
  if(age<=4)return 2;      // early childhood
  if(age<=8)return 3;      // child
  if(age<=12)return 4;     // older child
  if(age<=17)return 5;     // teen
  if(age<=49)return 6;     // adult prime
  if(age<=64)return 5;     // older adult
  return 4;                // elder
}
function ageStageLabel(age){
  if(age<=2)return "Infant / Toddler";
  if(age<=4)return "Early Childhood";
  if(age<=8)return "Childhood";
  if(age<=12)return "Foundation Years";
  if(age<=17)return "Teen Identity Years";
  if(age<=49)return "Open Sea Prime";
  if(age<=64)return "Veteran Years";
  return "Elder Legend";
}
function v85SyncEnergy(){
  if(!p)return;
  const limit=ageEnergyLimit(p.age||0);
  p.energy=limit;
  if(p.actionsLeft===undefined || p.actionsLeft>limit)p.actionsLeft=limit;
}
function v85ActionAllowed(kind){
  const a=p.age||0;
  const locked=[];
  if(a<5)locked.push("combat","travel","career","blackmarket","weaponhunt","fruithunt");
  else if(a<10)locked.push("career","blackmarket","deadlycombat","fruithunt");
  else if(a<13)locked.push("blackmarket","deadlycombat");
  else if(a<16)locked.push("deadlycombat");
  return !locked.includes(kind);
}
function ageLockedMessage(label){
  toast(`${label} is not available at this age yet.`);
}
const oldCreateBirth_v85 = typeof createBirth==="function" ? createBirth : null;
function createBirth(){
  if(oldCreateBirth_v85)oldCreateBirth_v85();
  v85SyncEnergy();
  save();
}
const oldAgeUp_v85 = typeof ageUp==="function" ? ageUp : null;
function ageUp(){
  if(!p||p.dead)return;
  if(oldAgeUp_v85)oldAgeUp_v85();
  v85SyncEnergy();
  save();
}
const oldSpendAction_v85 = typeof spendAction==="function" ? spendAction : null;
function spendAction(){
  v85SyncEnergy();
  if(p.dead)return false;
  if(p.actionsLeft<=0){toast("No energy left. Age up or rest.");return false;}
  p.actionsLeft--;
  return true;
}
const oldLifeActionsMenu_v85 = typeof lifeActionsMenu==="function" ? lifeActionsMenu : null;
function lifeActionsMenu(){
  v81Ensure();v85SyncEnergy();
  const a=p.age;
  let actions=[];
  if(a<=2){
    actions=[
      ["Observe the World",()=>{if(spendAction()){trait("curiosity",1);p.mood=clamp(p.mood+2,0,100);silent("You watched the world with wide eyes.");mainMenu();}}],
      ["Stay Close to Caregiver",()=>{if(spendAction()){trait("caution",1);p.health=clamp(p.health+4,0,100);silent("You stayed close and safe.");mainMenu();}}],
      ["Cry for Attention",()=>{if(spendAction()){trait("willpower",1);p.mood=clamp(p.mood+1,0,100);silent("You made sure someone noticed you.");mainMenu();}}]
    ];
  }else if(a<=4){
    actions=[
      ["Play",()=>{if(spendAction()){trait("curiosity",1);p.mood=clamp(p.mood+4,0,100);silent("You played and explored.");mainMenu();}}],
      ["Follow Family Around",()=>{if(spendAction()){trait("caution",1);p.mood=clamp(p.mood+2,0,100);silent("You followed family through town.");mainMenu();}}],
      ["Wander a Little",()=>{if(spendAction()){trait("curiosity",1);trait("courage",1);silent("You wandered just far enough to scare everyone.");mainMenu();}}]
    ];
  }else if(a<=8){
    actions=[
      ["Play With Kids",()=>{if(spendAction()){trait("confidence",1);p.mood=clamp(p.mood+4,0,100);silent("You played with local kids.");mainMenu();}}],
      ["Help Family",()=>{if(spendAction()){trait("compassion",1);apply({discipline:1});silent("You helped your family with small chores.");mainMenu();}}],
      ["Explore Neighborhood",()=>{if(spendAction()){trait("curiosity",1);apply({sneak:1});silent("You explored nearby streets.");mainMenu();}}],
      ["Make a Friend",()=>{if(spendAction()){narrativeRelationship("You made a childhood connection.");}}]
    ];
  }else if(a<=12){
    actions=[
      ["Help Family Work",()=>{if(spendAction()){apply({berries:200,discipline:1});trait("compassion",1);silent("You helped your family work.");mainMenu();}}],
      ["Sneak Around",()=>{if(spendAction()){apply({sneak:1});trait("curiosity",1);silent("You snuck around town.");mainMenu();}}],
      ["Basic Training",()=>{if(spendAction()){apply({strength:1,health:-1});trait("courage",1);silent("You trained like a kid pretending to be a hero.");mainMenu();}}],
      ["Make Friends",()=>{if(spendAction()){narrativeRelationship("You opened yourself to others.");}}]
    ];
  }else if(a<=17){
    actions=[
      ["Train Seriously",()=>{if(spendAction()){apply({strength:1,speed:1,health:-2});silent("You trained seriously.");mainMenu();}}],
      ["Study the Sea",()=>{if(spendAction()){apply({navigation:1,intelligence:1});trait("curiosity",1);silent("You studied maps and sea routes.");mainMenu();}}],
      ["Socialize",()=>{if(spendAction()){narrativeRelationship("You spent time with people your age.");}}],
      ["Seek Trouble",()=>{if(spendAction()){showLifeEvent(pick(getLifePool()));}}],
      ["Part-Time Work",()=>{if(spendAction()){apply({berries:700+Math.floor(Math.random()*900),discipline:1});silent("You worked for a little money.");mainMenu();}}]
    ];
  }else{
    actions=[
      ["Work",()=>{if(spendAction()){apply({berries:1200+Math.floor(Math.random()*2000)});silent("You worked for money.");mainMenu();}}],
      ["Explore Island",()=>{if(spendAction()){showLifeEvent(pick(getLifePool()));}}],
      ["Socialize",()=>{if(spendAction()){narrativeRelationship("You spent time with people nearby.");}}],
      ["Seek Opportunity",()=>{if(spendAction()){const event=Math.random()<fateChance()?pick(FATE_EVENTS_V81):pick(getLifePool());showLifeEvent(event);}}],
      ["Lay Low",()=>{if(spendAction()){p.heat=clamp((p.heat||0)-2,0,99);p.reckless=clamp((p.reckless||0)-1,0,99);silent("You kept a low profile.");mainMenu();}}]
    ];
  }
  actions.push(["Rest",()=>{if(spendAction()){p.health=clamp(p.health+20,0,100);p.mood=clamp(p.mood+5,0,100);silent("You rested.");mainMenu();}}]);
  submenu("Life Actions",`Stage: ${ageStageLabel(p.age)} · Energy: ${p.actionsLeft}/${p.energy}`,actions);
}
const oldCombatMenu_v85 = typeof combatMenu==="function" ? combatMenu : null;
function combatMenu(){
  if(!v85ActionAllowed("combat"))return ageLockedMessage("Combat");
  if(oldCombatMenu_v85)return oldCombatMenu_v85();
}
const oldTravelMenu_v85 = typeof travelMenu==="function" ? travelMenu : null;
function travelMenu(){
  if(!v85ActionAllowed("travel"))return ageLockedMessage("Travel");
  if(oldTravelMenu_v85)return oldTravelMenu_v85();
}
const oldCareerRoleMenu_v85 = typeof careerRoleMenu==="function" ? careerRoleMenu : null;
function careerRoleMenu(){
  if(!v85ActionAllowed("career"))return ageLockedMessage("Career paths");
  if(oldCareerRoleMenu_v85)return oldCareerRoleMenu_v85();
}
const oldBlackMarketMenu_v85 = typeof blackMarketMenu==="function" ? blackMarketMenu : null;
function blackMarketMenu(){
  if(!v85ActionAllowed("blackmarket"))return ageLockedMessage("Black market");
  if(oldBlackMarketMenu_v85)return oldBlackMarketMenu_v85();
}
const oldFindWeapon_v85 = typeof findWeapon==="function" ? findWeapon : null;
function findWeapon(){
  if(!v85ActionAllowed("weaponhunt"))return ageLockedMessage("Weapon hunting");
  if(oldFindWeapon_v85)return oldFindWeapon_v85();
}
const oldInspectFruit_v85 = typeof inspectFruitEncounter==="function" ? inspectFruitEncounter : null;
function inspectFruitEncounter(){
  if(!v85ActionAllowed("fruithunt"))return ageLockedMessage("Devil Fruit hunting");
  if(oldInspectFruit_v85)return oldInspectFruit_v85();
}
const oldMainMenu_v85 = typeof mainMenu==="function" ? mainMenu : null;
function mainMenu(){
  v85SyncEnergy();
  if(oldMainMenu_v85)oldMainMenu_v85();
  const scene=$("screen");
  if(scene && p){
    const tag=`<span class="lifeStageTag">${ageStageLabel(p.age)}</span><span class="lifeStageTag">Energy ${p.actionsLeft}/${p.energy}</span>`;
    const parchment=scene.querySelector(".v84Parchment")||scene.querySelector(".chapterCard");
    if(parchment && !parchment.querySelector(".energyNote")){
      parchment.insertAdjacentHTML("afterbegin",`<div class="energyNote">${tag}<br>Energy grows as you age. Childhood has smaller, safer actions; adulthood opens larger risks.</div>`);
    }
  }
}


/* =========================
   v8.8 Fixed Action Limit
   Keeps original-feeling set actions while age gates options.
   ========================= */
const FIXED_YEARLY_ACTIONS_V86 = 5;

function ageEnergyLimit(age){
  return FIXED_YEARLY_ACTIONS_V86;
}
function v85SyncEnergy(){
  if(!p)return;
  p.energy=FIXED_YEARLY_ACTIONS_V86;
  if(p.actionsLeft===undefined || p.actionsLeft>FIXED_YEARLY_ACTIONS_V86){
    p.actionsLeft=FIXED_YEARLY_ACTIONS_V86;
  }
}
function v86ResetYearActions(){
  if(!p)return;
  p.energy=FIXED_YEARLY_ACTIONS_V86;
  p.actionsLeft=FIXED_YEARLY_ACTIONS_V86;
}
const oldAgeUp_v86 = typeof ageUp==="function" ? ageUp : null;
function ageUp(){
  if(!p||p.dead)return;
  if(oldAgeUp_v86)oldAgeUp_v86();
  v86ResetYearActions();
  save();
}
const oldCreateBirth_v86 = typeof createBirth==="function" ? createBirth : null;
function createBirth(){
  if(oldCreateBirth_v86)oldCreateBirth_v86();
  v86ResetYearActions();
  save();
}
const oldMainMenu_v86 = typeof mainMenu==="function" ? mainMenu : null;
function mainMenu(){
  v85SyncEnergy();
  if(oldMainMenu_v86)oldMainMenu_v86();
  const note=document.querySelector(".energyNote");
  if(note){
    note.innerHTML=`<span class="lifeStageTag">${ageStageLabel(p.age)}</span><span class="lifeStageTag">Actions ${p.actionsLeft}/${p.energy}</span><br>You have a fixed yearly action limit. Age changes what actions are available, not how many actions you get.`;
  }
}


/* =========================
   v8.8 Life Stage Action Growth
   Childhood 5, Teen 8, Adult 12
   ========================= */
function ageEnergyLimit(age){
  if(age < 13) return 5;       // childhood
  if(age < 18) return 8;       // teenage years
  if(age < 55) return 12;      // adulthood / prime life
  if(age < 70) return 10;      // veteran years
  return 8;                    // elder legend
}
function v85SyncEnergy(){
  if(!p)return;
  const limit=ageEnergyLimit(p.age||0);
  p.energy=limit;
  if(p.actionsLeft===undefined || p.actionsLeft>limit){
    p.actionsLeft=limit;
  }
}
function v86ResetYearActions(){
  if(!p)return;
  const limit=ageEnergyLimit(p.age||0);
  p.energy=limit;
  p.actionsLeft=limit;
}
const oldAgeUp_v87 = typeof ageUp==="function" ? ageUp : null;
function ageUp(){
  if(!p||p.dead)return;
  if(oldAgeUp_v87)oldAgeUp_v87();
  v86ResetYearActions();
  save();
}
const oldCreateBirth_v87 = typeof createBirth==="function" ? createBirth : null;
function createBirth(){
  if(oldCreateBirth_v87)oldCreateBirth_v87();
  v86ResetYearActions();
  save();
}
const oldMainMenu_v87 = typeof mainMenu==="function" ? mainMenu : null;
function mainMenu(){
  v85SyncEnergy();
  if(oldMainMenu_v87)oldMainMenu_v87();
  const note=document.querySelector(".energyNote");
  if(note && p){
    note.innerHTML=`<span class="lifeStageTag">${ageStageLabel(p.age)}</span><span class="lifeStageTag">Actions ${p.actionsLeft}/${p.energy}</span><br>Actions grow as you mature: Childhood 5 · Teen 8 · Adult 12. Age also controls what actions are available.`;
  }
}


/* =========================
   v8.8 Visible Progression + Locked Options
   ========================= */
function v88StatPhysical(){
  return Math.floor(((p.strength||0)+(p.speed||0)+(p.durability||0))/3);
}
function v88OptionUnlocked(opt){
  if(!p)return false;
  if(opt.minAge!==undefined && p.age<opt.minAge)return false;
  if(opt.maxAge!==undefined && p.age>opt.maxAge)return false;
  if(opt.req){
    for(const [k,v] of Object.entries(opt.req)){
      if(k==="physical" && v88StatPhysical()<v)return false;
      else if(k==="crew" && (!p.crew || p.crew.length<v))return false;
      else if(k==="hasCrew" && (!p.crew || p.crew.length<1))return false;
      else if((p[k]||0)<v)return false;
    }
  }
  if(opt.custom && !opt.custom())return false;
  return true;
}
function v88ReqText(opt){
  const req=[];
  if(opt.minAge!==undefined)req.push(`Age ${opt.minAge}+`);
  if(opt.maxAge!==undefined)req.push(`Age ${opt.maxAge} or younger`);
  if(opt.req){
    for(const [k,v] of Object.entries(opt.req)){
      if(k==="physical")req.push(`Physical ${v}+`);
      else if(k==="crew")req.push(`Crew members ${v}+`);
      else if(k==="hasCrew")req.push(`Requires crew`);
      else req.push(`${k} ${v}+`);
    }
  }
  if(opt.reqText)req.push(opt.reqText);
  return req.length?`Requires: ${req.join(" · ")}`:"Locked";
}
function v88RunOption(opt){
  if(v88OptionUnlocked(opt)){
    opt.action();
  }else{
    $("screen").innerHTML=`<h2>🔒 ${opt.label}</h2>
    <div class="v88Preview">
      <b>This option is visible, but not unlocked yet.</b><br>
      ${v88ReqText(opt)}
      ${opt.preview?`<br><br><b>Unlocks:</b> ${opt.preview}`:""}
    </div>
    <div class="choices">
      <button class="primary" onclick="visibleProgressionMenu()">Back to Activities</button>
      <button onclick="mainMenu()">Return Home</button>
    </div>`;
    render();
  }
}
function v88Button(opt){
  const unlocked=v88OptionUnlocked(opt);
  const cls=unlocked?"v88Unlocked":"v88Locked";
  return `<button class="${cls}" onclick="v88RunOption(v88AllOptions.find(o=>o.id==='${opt.id}'))">
    ${unlocked?"":"🔒 "}${opt.icon||""} ${opt.label}
    <small>${opt.desc||""}</small>
    ${unlocked?"":`<span class="v88Req">${v88ReqText(opt)}</span>`}
  </button>`;
}
function v88Section(title,items){
  return `<div class="v88Section"><h3>${title}</h3><div class="v88OptionGrid">${items.map(v88Button).join("")}</div></div>`;
}
function v88SafeAction(fn){
  return ()=>{ fn(); };
}
const v88AllOptions=[
  // General
  {id:"play",cat:"General",icon:"🧸",label:"Play",desc:"Childhood morale and curiosity.",maxAge:12,action:()=>{if(spendAction()){trait("curiosity",1);p.mood=clamp(p.mood+4,0,100);silent("You played and explored.");mainMenu();}}},
  {id:"study",cat:"General",icon:"📚",label:"Study",desc:"Improve intelligence and discipline.",minAge:5,action:()=>{if(spendAction()){apply({intelligence:1,discipline:1});silent("You studied and learned.");mainMenu();}}},
  {id:"work",cat:"General",icon:"💼",label:"Work",desc:"Earn money.",minAge:13,action:()=>{if(spendAction()){apply({berries:900+Math.floor(Math.random()*1600),discipline:1});silent("You worked for money.");mainMenu();}}},
  {id:"rest",cat:"General",icon:"🛏️",label:"Rest",desc:"Recover health and morale.",action:()=>{if(spendAction()){p.health=clamp(p.health+20,0,100);p.mood=clamp(p.mood+5,0,100);silent("You rested.");mainMenu();}}},
  {id:"train",cat:"General",icon:"🏋️",label:"Train",desc:"Improve physical ability.",minAge:7,action:()=>{if(spendAction()){apply({strength:1,speed:1,health:-2});silent("You trained your body.");mainMenu();}}},
  {id:"helpfamily",cat:"General",icon:"🏠",label:"Help Family",desc:"Build discipline and compassion.",maxAge:17,action:()=>{if(spendAction()){apply({discipline:1,berries:p.age<13?150:500});trait("compassion",1);silent("You helped your family.");mainMenu();}}},

  // Social
  {id:"friends",cat:"Social",icon:"👥",label:"Make Friends",desc:"Meet people and build relationships.",minAge:5,action:()=>{if(spendAction()){narrativeRelationship("You opened yourself to others.");}}},
  {id:"rival",cat:"Social",icon:"⚡",label:"Find Rival",desc:"Create a long-term rival.",minAge:10,action:()=>{if(spendAction()){p.relationships.push({name:pick(DATA.names),status:"Rival",ageMet:p.age});trait("ambition",1);major("You found someone who pushes you to improve.");mainMenu();}}},
  {id:"network",cat:"Social",icon:"🤝",label:"Network",desc:"Meet useful contacts.",minAge:16,req:{charisma:2},action:()=>{if(spendAction()){p.relationships.push({name:pick(DATA.names),status:"Useful Contact",ageMet:p.age});apply({charisma:1});silent("You built your network.");mainMenu();}}},

  // Combat
  {id:"spar",cat:"Combat",icon:"🥊",label:"Spar",desc:"Safe combat practice.",minAge:8,action:()=>{if(spendAction()){apply({strength:1,armamentXP:1});silent("You sparred safely.");mainMenu();}}},
  {id:"barfight",cat:"Combat",icon:"🍺",label:"Street Fight",desc:"Risky local fight.",minAge:13,action:()=>{if(spendAction())startBattle("street fight","easy");}},
  {id:"arena",cat:"Combat",icon:"🏟️",label:"Arena Fight",desc:"Public combat for rewards.",minAge:16,req:{physical:3},preview:"Money, battle experience, reputation.",action:()=>{if(spendAction())startBattle("arena","normal");}},
  {id:"bountyhunt",cat:"Combat",icon:"🎯",label:"Bounty Hunting",desc:"Hunt wanted targets.",minAge:15,req:{physical:3},preview:"Berries, combat growth, reputation.",action:()=>huntBounty()},
  {id:"deadlybattle",cat:"Combat",icon:"☠️",label:"Deadly Battle",desc:"High risk, high reward.",minAge:18,req:{physical:5,reckless:2},preview:"Rare loot, scars, possible capture/death.",action:()=>{if(spendAction())startBattle("deadly","deadly");}},

  // Crew / Career
  {id:"joinpirates",cat:"Crew / Career",icon:"☠️",label:"Join Pirate Crew",desc:"Serve under a captain.",minAge:14,req:{charisma:2},action:()=>{if(spendAction()){p.path="Pirate";p.rank="Rookie";joinGeneratedCrew();}}},
  {id:"startcrew",cat:"Crew / Career",icon:"🏴",label:"Start Your Own Crew",desc:"Become captain.",minAge:16,req:{charisma:3,infamy:2},preview:"Captain role, crew recruitment, raids.",action:()=>{if(spendAction()){p.path="Pirate";p.rank="Captain";formOwnCrew();}}},
  {id:"recruit",cat:"Crew / Career",icon:"🧑‍✈️",label:"Recruit Member",desc:"Add someone to your crew.",minAge:16,req:{hasCrew:1},action:()=>recruitCrew?recruitCrew():narrativeCrewJoin("You found someone willing to follow you.")},
  {id:"enlist",cat:"Crew / Career",icon:"🛡️",label:"Enlist Marines",desc:"Join the Marines.",minAge:15,req:{discipline:2},action:()=>{if(spendAction()){p.path="Marine";p.rank="Recruit";setupMarineUnit();}}},
  {id:"officerexam",cat:"Crew / Career",icon:"🎖️",label:"Officer Exam",desc:"Attempt promotion.",minAge:18,req:{marineRep:2,discipline:3},preview:"Marine rank progression and platoon command.",action:()=>{if(spendAction()){apply({marineRep:1,discipline:1});silent("You prepared for Marine promotion.");mainMenu();}}},
  {id:"revolution",cat:"Crew / Career",icon:"🔥",label:"Join Revolutionaries",desc:"Fight the World Government.",minAge:16,req:{freedom:1},action:()=>{if(spendAction()){p.path="Revolutionary";p.rank="Recruit";p.roleData={cell:"Local Cell",role:"New Liberator"};apply({revolutionaryRep:1,heat:1});major("You joined a revolutionary cell.");mainMenu();}}},

  // Exploration / Power
  {id:"neartravel",cat:"Exploration / Power",icon:"⛵",label:"Travel Nearby",desc:"Move between safer islands.",minAge:13,action:()=>travelMenu()},
  {id:"grandline",cat:"Exploration / Power",icon:"🌊",label:"Grand Line Voyage",desc:"Dangerous sea adventure.",minAge:18,req:{navigation:2,physical:4},preview:"High danger islands, stronger events, better loot.",action:()=>{if(spendAction()){p.region="Paradise";p.island=pick(DATA.islands.filter(i=>i.region==="Paradise")).name;major("You entered Paradise, the first half of the Grand Line.");mainMenu();}}},
  {id:"fruitsearch",cat:"Exploration / Power",icon:"🍎",label:"Search Devil Fruit",desc:"Look for rumors of strange fruits.",minAge:14,req:{curiosity:2},preview:"Paramecia, Zoan, Logia, Mythical fruit events.",action:()=>inspectFruitEncounter()},
  {id:"weaponhunt",cat:"Exploration / Power",icon:"⚔️",label:"Search Weapon",desc:"Find weapons or cursed blades.",minAge:13,req:{sword:1},action:()=>findWeapon()},
  {id:"haki",cat:"Exploration / Power",icon:"👁️",label:"Haki Training",desc:"Train your will.",minAge:13,req:{willpower:1},action:()=>hakiMenu()},

  // Underworld
  {id:"blackmarket",cat:"Underworld",icon:"🕶️",label:"Black Market",desc:"Buy dangerous goods.",minAge:18,req:{heat:1},preview:"Rare weapons, fruit rumors, illegal jobs.",action:()=>blackMarketMenu()},
  {id:"smuggle",cat:"Underworld",icon:"📦",label:"Smuggling Run",desc:"Illegal money job.",minAge:16,req:{sneak:2},action:()=>{if(spendAction()){if(Math.random()<.25)return startBattle("smuggling","hard");apply({berries:6000,heat:2,infamy:1});silent("You completed a smuggling run.");mainMenu();}}},
  {id:"steal",cat:"Underworld",icon:"💰",label:"Steal Supplies",desc:"Quick profit, bad reputation.",minAge:10,req:{sneak:1},action:()=>{if(spendAction()){apply({berries:1500,heat:1,infamy:1});trait("ruthless",1);silent("You stole supplies.");mainMenu();}}},
];

function visibleProgressionMenu(){
  v81Ensure();v85SyncEnergy();
  const cats=["General","Social","Combat","Crew / Career","Exploration / Power","Underworld"];
  $("screen").innerHTML=`<h2>Activities</h2>
  <div class="v88Preview">
    All options are visible. Locked options show what you need, like BitLife-style progression.
    <br><b>Age:</b> ${p.age} · <b>Actions:</b> ${p.actionsLeft}/${p.energy}
  </div>
  ${cats.map(cat=>v88Section(cat,v88AllOptions.filter(o=>o.cat===cat))).join("")}
  <div class="choices"><button class="primary" onclick="mainMenu()">Back Home</button></div>`;
  render();
}
function lifeActionsMenu(){
  visibleProgressionMenu();
}
