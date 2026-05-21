
const SAVE_KEY="gpls_save_v102";let s=null,currentScreen="dashboard",filter="All",selectedOrigin="dock",selectedRace="human",selectedIsland=null,selectedAction=null,battle=null;
const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),fmt=n=>Math.round(n||0).toLocaleString();
function toast(m){let t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
function load(){let r=localStorage.getItem(SAVE_KEY);if(r){s=JSON.parse(r);norm();render()}else start()}
function norm(){s.actionsMax=actionsMax();if(s.actionsLeft==null||s.actionsLeft>s.actionsMax)s.actionsLeft=s.actionsMax;if(!s.gems)s.gems=0;if(!s.unlocks)s.unlocks={origins:[],races:[]};if(!s.log)s.log=[]}
function actionsMax(){if(!s)return 5;if(s.age<13)return 5;if(s.age<18)return 8;if(s.age<55)return 12;if(s.age<70)return 10;return 8}
function stage(){if(s.age<13)return"Childhood";if(s.age<18)return"Teen";if(s.age<55)return"Adult";if(s.age<70)return"Veteran";return"Elder"}
function applyBonus(o){Object.entries(o||{}).forEach(([k,v])=>{if(k in s.stats)s.stats[k]+=v;else s[k]=(s[k]||0)+v})}
function start(){let app=$("app");app.innerHTML=`<div class="startHero"><div><div class="startPanel"><button class="primary" onclick="document.querySelector('#create').scrollIntoView()">☠️ New Life</button><button onclick="load()">🧭 Load Game</button><button>⚙️ Settings</button><button>📖 Credits</button></div><div class="startPanel" style="margin-top:10px"><h3>The Sea Is Calling...</h3><p>Every choice shapes your fate. Your path is not chosen at birth.</p></div></div><div class="bigLogo"><div class="logoIcon">☠️</div><h1>GREAT<br>PIRATE<br>LIFE SIM</h1><h2>Live Your Legend</h2></div><div class="startPanel"><h3>What happens next?</h3><p>• You are born at age 0.</p><p>• Your starting island is chosen by origin, race, and fate.</p><p>• Your path becomes Pirate, Marine, Revolutionary, or something else through life choices.</p></div><div id="create" class="startCreate"><div class="startPanel"><h3>1. Who are you?</h3><div class="portrait">🙂</div><label>Name</label><input id="nm" value="Lionel Aguilar"><label>Nickname</label><input id="nick" placeholder="Optional"><label>Gender</label><select id="gender"><option>Male</option><option>Female</option><option>Other</option></select></div><div class="startPanel"><h3>2. Origin</h3><div id="originList">${DATA.origins.map(o=>choiceHTML(o,"origin")).join("")}</div></div><div class="startPanel"><h3>3. Race</h3><div id="raceList">${DATA.races.map(r=>choiceHTML(r,"race")).join("")}</div></div><div class="startPanel"><h3>4. Life Settings</h3><label>Difficulty</label><select id="diff"><option>Normal</option><option>Easy</option><option>Hard</option></select><label>Event Frequency</label><select id="freq"><option>High</option><option>Normal</option><option>Low</option></select><label>Permadeath</label><select id="pd"><option>Off</option><option>On</option></select><button class="gold" onclick="newLife()">BEGIN LIFE</button></div></div></div>`}
function choiceHTML(o,type){let locked=o.cost>0;return `<div class="choice ${type==='origin'&&o.id===selectedOrigin||type==='race'&&o.id===selectedRace?'active':''}" onclick="selectChoice('${type}','${o.id}')"><div class="icon">${o.icon}</div><div><b>${o.name}</b><div class="small">${o.desc}</div><div class="${locked?'req':'small'}">${locked?'💎 '+o.cost+' Gems':'Free'} · ${bonusText(o.bonus)}</div></div><div>${locked?'🔒':''}</div></div>`}
function bonusText(b){return Object.entries(b||{}).map(([k,v])=>`+${v} ${k}`).join(" · ")}
function selectChoice(type,id){if(type==="origin")selectedOrigin=id;else selectedRace=id;start();setTimeout(()=>document.querySelector('#create')?.scrollIntoView(),0)}
function newLife(){let o=DATA.origins.find(x=>x.id===selectedOrigin),r=DATA.races.find(x=>x.id===selectedRace);if((o.cost||0)>0)return toast("Origin locked. Earn gems by playing.");if((r.cost||0)>0)return toast("Race locked. Earn gems by playing.");let island=chooseIsland(o,r);s={version:"v10.2",name:$("nm").value||"Rookie",nick:$("nick").value,gender:$("gender").value,origin:o.name,race:r.name,age:0,sea:island.sea,island:island.name,dream:"Undiscovered",title:"Child",beli:0,gems:0,fame:0,bounty:0,infamy:0,hp:100,maxHp:100,energy:5,mood:80,hunger:85,exp:0,level:1,actionsLeft:5,actionsMax:5,stats:{strength:5,speed:5,stamina:5,defense:5,haki:0,devilFruit:0,intelligence:5,charisma:5,willpower:5,discipline:0,sneak:0,navigation:0,perception:0,crafting:0,medicine:0,sword:0},reps:{marines:0,pirates:0,revolutionaries:0,underworld:0,civilians:0},crew:[],relationships:[],inventory:[...DATA.items],weapons:[DATA.weapons[0]],fruits:[],news:DATA.news.map((text,i)=>({text,day:i+1})),log:[],effects:[],settings:{difficulty:$("diff").value,eventFrequency:$("freq").value,permadeath:$("pd").value},unlocks:{origins:[],races:[]}};applyBonus(o.bonus);applyBonus(r.bonus);s.maxHp+=(r.bonus.hp||0);s.hp=s.maxHp;s.log.unshift(`Born in ${s.sea} at ${s.island}. Origin: ${o.name}. Race: ${r.name}.`);save();modal("Birth",`You were born in ${s.sea}. Your home is ${s.island}. Your path has not been chosen yet.`,[{icon:"⚓",text:`Origin: ${o.name}`},{icon:r.icon,text:`Race: ${r.name}`},{icon:"💎",text:"+2 Gems",apply:()=>s.gems+=2}],()=>render())}
function chooseIsland(o,r){if(o.id==="marinefam")return DATA.islands.find(i=>i.id==="shells");if(o.id==="dock")return pick(DATA.islands.filter(i=>["foosha","orange","syrup"].includes(i.id)));return pick(DATA.islands.filter(i=>i.sea==="East Blue"))}
function topbar(){return `<div class="topbar"><div class="logo"><div class="logoIcon">☠️</div><div><div class="title">Great Pirate Life Sim <span class="ver">v10.0</span></div><div class="small">Living World Remaster Hotfix</div></div></div><div class="topStats"><span>฿ <b>${fmt(s.beli)}</b></span><span>💎 <b>${s.gems}</b></span><span>🗽 <b>${s.fame}</b></span><button onclick="save();toast('Saved')">Save</button></div></div>`}
function nav(){return `<div class="nav">${[["dashboard","🏠 Dashboard"],["actions","⚔️ Actions"],["crew","☠️ Crew"],["world","🌎 World"],["inventory","🎒 Inventory"],["logbook","📖 Logbook"],["relationships","❤️ Relationships"],["settings","⚙️ Settings"]].map(t=>`<button class="${currentScreen===t[0]?'active':''}" onclick="currentScreen='${t[0]}';render()">${t[1]}</button>`).join("")}</div>`}
function bar(l,v,m=100){return `<div class="line"><span>${l}</span><b>${Math.round(v)}/${m}</b></div><div class="meter"><i style="width:${clamp(v/m*100,0,100)}%"></i></div>`}
function left(){return `<aside><div class="card"><h2>${s.name}</h2><div class="small">${s.race} · ${s.origin}</div><div class="portrait">🙂</div><div class="line"><span>Age</span><b>${s.age}</b></div><div class="line"><span>Island</span><b>${s.island}</b></div><div class="line"><span>Bounty</span><b>฿${fmt(s.bounty)}</b></div></div><div class="card"><h3>Vitality</h3>${bar("HP",s.hp,s.maxHp)}${bar("Actions",s.actionsLeft,s.actionsMax)}${bar("Mood",s.mood)}${bar("EXP",s.exp,100)}</div><div class="card"><h3>Attributes</h3>${Object.entries(s.stats).slice(0,10).map(([k,v])=>`<div class="line"><span>${k}</span><b>${v}</b></div>`).join("")}</div></aside>`}
function right(){return `<aside><div class="card"><h3>World News</h3>${s.news.slice(0,5).map(n=>`<div class="event"><span>${n.text}</span><b>Day ${n.day}</b></div>`).join("")}</div><div class="card"><h3>Current Location</h3><h2>${s.sea}</h2><p>${island().desc}</p><button onclick="currentScreen='world';render()">Go to World</button></div><div class="card"><h3>Active Effects</h3>${s.effects.map(e=>`<div>${e}</div>`).join("")||"<p class='small'>No active effects.</p>"}</div></aside>`}
function island(){return DATA.islands.find(i=>i.name===s.island)||DATA.islands[0]}
function power(){let st=s.stats;return Math.round(st.strength*12+st.speed*10+st.stamina*10+st.defense*10+st.haki*30+st.devilFruit*25+st.willpower*8+s.fame*4+s.bounty/100000)}
function rank(v){if(v>=3500)return"SS";if(v>=2200)return"S";if(v>=1400)return"A";if(v>=900)return"B";if(v>=500)return"C";if(v>=250)return"D";if(v>=100)return"E";return"F"}
function prog(){let st=s.stats;return {Combat:{pct:clamp((st.strength+st.speed+st.stamina+st.defense)*1.2,0,100),rank:rank((st.strength+st.speed+st.stamina+st.defense)*15)},Haki:{pct:clamp(st.haki*10,0,100),rank:rank(st.haki*80)},Exploration:{pct:clamp(st.navigation*12+s.level*4,0,100),rank:rank(st.navigation*80+s.level*30)},Reputation:{pct:clamp(s.fame+s.infamy+s.bounty/1000000,0,100),rank:rank(s.fame*25+s.infamy*40+s.bounty/100000)},Crew:{pct:clamp(s.crew.length*12,0,100),rank:s.crew.length?rank(s.crew.reduce((a,c)=>a+c.strength,0)):"None"}}}
function dashboard(){let p=prog();return `<main><div class="card heroDream"><h3>⭐ Dream</h3><h2>“${s.dream}”</h2><p>${s.dream==="Undiscovered"?"Your dream will awaken through your life choices.":"Your life is bending toward this dream."}</p><div class="line"><span>Overall Power</span><b>${fmt(power())} · Rank ${rank(power())}</b></div></div><div class="card"><h3>Progress Overview</h3><div class="grid grid5">${Object.entries(p).map(([k,v])=>`<div class="progressCard"><div class="circle">${Math.round(v.pct)}%</div><h4>${k}</h4><div>Rank: ${v.rank}</div></div>`).join("")}</div></div><div class="card"><h3>Recent Events</h3>${s.log.slice(0,6).map(l=>`<div class="event"><span>${l}</span><b>Age ${s.age}</b></div>`).join("")}</div><div class="card"><h3>Status</h3><div class="grid grid5">${["Health","Actions","Mood","Infamy","Gems"].map(x=>`<div class="statusCard"><h4>${x}</h4><b>${x==="Health"?s.hp+"/"+s.maxHp:x==="Actions"?s.actionsLeft+"/"+s.actionsMax:x==="Mood"?s.mood:x==="Infamy"?s.infamy:s.gems}</b></div>`).join("")}</div></div></main>`}
const ACTIONS=[
{id:"play",cat:"General",icon:"🏝️",name:"Play / Explore",desc:"Enjoy your surroundings.",req:()=>true,reqText:"",do:()=>outcome("Play / Explore","You explored your surroundings.",[{icon:"😊",text:"Mood +5",apply:()=>s.mood=clamp(s.mood+5,0,100)},{icon:"⭐",text:"EXP +5",apply:()=>xp(5)},{icon:"💎",text:"Gems +1",apply:()=>s.gems+=1}])},
{id:"study",cat:"General",icon:"📘",name:"Study",desc:"Improve your mind.",req:()=>s.age>=5,reqText:"Requires Age 5+",do:()=>outcome("Study","You studied hard.",[{icon:"🧠",text:"Intelligence +1",apply:()=>s.stats.intelligence++},{icon:"⭐",text:"EXP +8",apply:()=>xp(8)}])},
{id:"train",cat:"General",icon:"🏋️",name:"Train",desc:"Improve your body.",req:()=>s.age>=7,reqText:"Requires Age 7+",do:()=>outcome("Train","You trained until your body burned.",[{icon:"💪",text:"Strength +1",apply:()=>s.stats.strength++},{icon:"🛡️",text:"Stamina +1",apply:()=>s.stats.stamina++},{icon:"⭐",text:"EXP +10",apply:()=>xp(10)}])},
{id:"work",cat:"General",icon:"💰",name:"Work",desc:"Earn Beli.",req:()=>s.age>=10,reqText:"Requires Age 10+",do:()=>outcome("Work","You worked hard for your money.",[{icon:"💰",text:"Beli +800",apply:()=>s.beli+=800},{icon:"⭐",text:"EXP +6",apply:()=>xp(6)}])},
{id:"friends",cat:"Social",icon:"👥",name:"Make Friends",desc:"Meet someone new.",req:()=>s.age>=5,reqText:"Requires Age 5+",do:()=>{let n=pick(DATA.names);s.relationships.unshift({name:n,type:"Friend",loyalty:60,desc:"A friend from your life."});outcome("New Friend",`You became friends with ${n}.`,[{icon:"❤️",text:`${n} added to Relationships`},{icon:"⭐",text:"EXP +5",apply:()=>xp(5)}])}},
{id:"rival",cat:"Social",icon:"⚔️",name:"Find Rival",desc:"Create a rivalry.",req:()=>s.age>=10,reqText:"Requires Age 10+",do:()=>{let n=pick(DATA.names);s.relationships.unshift({name:n,type:"Rival",loyalty:25,desc:"A rival who pushes you."});outcome("Rival Found",`${n} sees you as competition.`,[{icon:"🔥",text:"Ambition grows"},{icon:"⭐",text:"EXP +8",apply:()=>xp(8)}])}},
{id:"spar",cat:"Combat",icon:"🥊",name:"Spar",desc:"Safe combat practice.",req:()=>s.age>=8,reqText:"Requires Age 8+",do:()=>outcome("Sparring","You practiced combat safely.",[{icon:"💪",text:"Strength +1",apply:()=>s.stats.strength++},{icon:"⭐",text:"Combat EXP +12",apply:()=>xp(12)}])},
{id:"bounty",cat:"Combat",icon:"🎯",name:"Bounty Hunt",desc:"Fast encounter battle.",req:()=>s.age>=15,reqText:"Requires Age 15+",do:()=>startBattle("Rogue Swordsman",100,["Quick Strike","Heavy Slash","Combo Attack","Guard","Focus","Taunt"])},
{id:"joinpirate",cat:"Crew / Career",icon:"☠️",name:"Join Pirate Crew",desc:"Serve under a captain.",req:()=>s.age>=14,reqText:"Requires Age 14+",do:()=>joinCrew("pirate")},
{id:"marine",cat:"Crew / Career",icon:"🛡️",name:"Join Marines",desc:"Enlist with Marines.",req:()=>s.age>=15,reqText:"Requires Age 15+",do:()=>joinCrew("marine")},
{id:"recruit",cat:"Crew / Career",icon:"🧑‍✈️",name:"Recruit Member",desc:"Add a crewmate.",req:()=>s.age>=16,reqText:"Requires Age 16+",do:()=>addCrew()},
{id:"travel",cat:"Exploration",icon:"⛵",name:"Travel Nearby",desc:"Visit another island.",req:()=>s.age>=13,reqText:"Requires Age 13+",do:()=>{currentScreen="world";render()}},
{id:"fruit",cat:"Exploration",icon:"🍈",name:"Search Devil Fruit",desc:"Look for fruit rumors.",req:()=>s.age>=14,reqText:"Requires Age 14+",do:()=>findFruit()},
{id:"black",cat:"Underworld",icon:"🕶️",name:"Black Market",desc:"Dangerous goods.",req:()=>s.age>=18,reqText:"Requires Age 18+",do:()=>outcome("Black Market","You found illegal traders.",[{icon:"🕶️",text:"Infamy +2",apply:()=>s.infamy+=2},{icon:"🎁",text:"Small Med Kit",apply:()=>s.inventory.push({name:"Small Med Kit",type:"Item",rarity:"Common",qty:1,desc:"Restores HP."})}])}
];
function actions(){let cats=["All","General","Social","Combat","Crew / Career","Exploration","Underworld"],list=ACTIONS.filter(a=>filter==="All"||a.cat===filter);return `<main><div class="card"><h2>Actions</h2><div class="line"><span>All options visible. Locked actions show requirements.</span><b>${s.actionsLeft}/${s.actionsMax}</b></div><div class="actionTabs">${cats.map(c=>`<button class="${filter===c?'active':''}" onclick="filter='${c}';render()">${c}</button>`).join("")}</div><div class="grid grid2">${list.map(a=>cardAction(a)).join("")}</div></div></main>`}
function cardAction(a){let ok=a.req();return `<div class="actionCard ${ok?'':'locked'}"><div class="actionIcon">${ok?a.icon:"🔒"}</div><div><b>${a.name}</b><div class="small">${a.desc}</div><div class="${ok?'small':'req'}">${ok?"Energy Cost: 1":a.reqText}</div></div><button onclick="doAct('${a.id}')" ${!ok||s.actionsLeft<=0?'disabled':''}>${ok?"Select":"Locked"}</button></div>`}
function doAct(id){let a=ACTIONS.find(x=>x.id===id);if(!a.req())return toast(a.reqText);if(s.actionsLeft<=0)return toast("No actions left.");a.do()}
function spend(){s.actionsLeft=Math.max(0,s.actionsLeft-1)}
function xp(n){s.exp+=n;if(s.exp>=100){s.level++;s.exp-=100;s.log.unshift(`Reached level ${s.level}.`)}}
function outcome(title,body,rewards=[]){rewards.forEach(r=>r.apply&&r.apply());spend();s.log.unshift(body);if(Math.random()<.25){let bonus=pick(["A stranger noticed your effort.","You heard a rumor nearby.","You found a small coin pouch."]);s.log.unshift("Bonus event: "+bonus)}save();modal(title,body,rewards,()=>render())}
function modal(title,body,rewards=[],cb=()=>{}){$("modal").innerHTML=`<div class="modalWrap"><div class="modalCard"><h2>${title}</h2><p>${body}</p><h3>Outcome</h3>${rewards.map(r=>`<div class="reward"><span>${r.icon||"⭐"}</span><span>${r.text}</span><b></b></div>`).join("")||"<p class='small'>No rewards.</p>"}<button class="primary" onclick="closeModal()">Continue</button></div></div>`;window._modalCB=cb}
function closeModal(){$("modal").innerHTML="";let cb=window._modalCB;window._modalCB=null;cb&&cb()}
function joinCrew(kind){if(kind==="pirate"){s.title="Pirate Crew Member";s.reps.pirates+=5;let name=pick(["Crimson Tide Pirates","Black Fang Pirates","Storm Gull Pirates"]);s.crewName=name;modal("Crew Joined",`You joined the ${name}. You are currently a deckhand.`,[{icon:"☠️",text:"Pirate Reputation +5"},{icon:"👥",text:"Crew currentScreen updated"}],()=>{spend();save();currentScreen="crew";render()})}else{s.title="Marine Recruit";s.reps.marines+=5;s.marineUnit="East Blue Patrol Squad 3";modal("Marine Enlistment",`You joined ${s.marineUnit}. Your commander expects discipline.`,[{icon:"🛡️",text:"Marine Reputation +5"},{icon:"🎖️",text:"Rank: Recruit"}],()=>{spend();save();currentScreen="crew";render()})}}
function addCrew(){let c={name:pick(DATA.names),role:pick(["Navigator","Swordsman","Doctor","Gunner","Cook"]),loyalty:60,strength:80+Math.floor(Math.random()*180),dream:pick(["Freedom","Riches","Map the World","Protect Friends"])};s.crew.push(c);outcome("New Crew Member",`${c.name}, a ${c.role}, joined you.`,[{icon:"👥",text:`${c.name} added to crew`},{icon:"⭐",text:"EXP +10",apply:()=>xp(10)}])}
function findFruit(){let f=pick(DATA.fruits);s.fruits.push(f);s.stats.devilFruit+=Math.ceil(f.power/10);outcome("Strange Fruit",`You discovered the ${f.name}.`,[{icon:"🍈",text:f.type+" · "+f.rarity},{icon:"🔥",text:"Devil Fruit +"+Math.ceil(f.power/10)}])}
function startBattle(enemy,hp,moves){battle={enemy,enemyHp:hp,enemyMax:hp,playerHp:s.hp,turn:1,log:[`${enemy} blocks your path.`],moves};currentScreen="battle";render()}
function battleScreen(){return `<main style="grid-column:1/-1"><div class="battle"><div class="line"><b>ENCOUNTER</b><span>${s.island}</span></div><h2>A ${battle.enemy} blocks your path!</h2><div class="battleTop"><div class="fighter"><h2>YOU</h2>${bar("HP",battle.playerHp,s.maxHp)}${bar("Energy",s.actionsLeft,s.actionsMax)}<div>Weapon: ${s.weapons?.[0]?.name||"Fists"}</div></div><h1>VS</h1><div class="fighter enemy"><h2>${battle.enemy}</h2>${bar("HP",battle.enemyHp,battle.enemyMax)}${bar("Stamina",80,100)}<div>Style: Fast Duelist</div></div></div><h2>Choose your move</h2><div class="moveGrid">${battle.moves.map(m=>`<button class="move" onclick="battleMove('${m}')"><b>${m}</b><div class="small">${moveDesc(m)}</div></button>`).join("")}<button class="move" onclick="retreat()">Retreat<div class="small">Escape battle.</div></button></div><div class="battleLog"><h3>Battle Log</h3>${battle.log.slice(-5).map(l=>`<div>▸ ${l}</div>`).join("")}</div></div></main>`}
function moveDesc(m){return {["Quick Strike"]:"Reliable low damage.",["Heavy Slash"]:"Risky high damage.",["Combo Attack"]:"Multiple hits.",Guard:"Reduce damage.",Focus:"Improve next hit.",Taunt:"Lower enemy focus."}[m]||"Move"}
function battleMove(m){let dmg=0;if(m==="Quick Strike")dmg=18+Math.floor(Math.random()*8);if(m==="Heavy Slash")dmg=Math.random()<.65?40:0;if(m==="Combo Attack")dmg=12*(1+Math.floor(Math.random()*3));if(m==="Guard"){battle.log.push("You guarded and reduced the next hit.");dmg=0}if(m==="Focus"){battle.log.push("You focused and found an opening.");s.stats.perception++;dmg=0}if(m==="Taunt"){battle.log.push("You taunted the enemy.");dmg=8;s.infamy++}if(dmg){battle.enemyHp=clamp(battle.enemyHp-dmg,0,battle.enemyMax);battle.log.push(`${m} dealt ${dmg} damage.`)}if(battle.enemyHp<=0)return winBattle();let edmg=m==="Guard"?5:12+Math.floor(Math.random()*10);battle.playerHp=clamp(battle.playerHp-edmg,0,s.maxHp);battle.log.push(`${battle.enemy} hit you for ${edmg}.`);if(battle.playerHp<=0)return loseBattle();battle.turn++;render()}
function winBattle(){s.hp=battle.playerHp;s.bounty+=500;s.beli+=350;s.fame+=2;xp(25);spend();let enemy=battle.enemy;battle=null;modal("Victory",`${enemy} defeated.`,[{icon:"⭐",text:"EXP +25"},{icon:"💰",text:"Beli +350"},{icon:"☠️",text:"Bounty +500"}],()=>{currentScreen="dashboard";save();render()})}
function loseBattle(){s.hp=10;spend();let enemy=battle.enemy;battle=null;modal("Defeat",`${enemy} defeated you, but you survived.`,[{icon:"❤️",text:"HP reduced to 10"},{icon:"⚠️",text:"Reputation damaged"}],()=>{currentScreen="dashboard";save();render()})}
function retreat(){s.infamy=Math.max(0,s.infamy-1);spend();battle=null;modal("Retreated","You escaped the battle.",[{icon:"🏃",text:"Lost face slightly"}],()=>{currentScreen="dashboard";save();render()})}
function world(){let isl=DATA.islands;selectedIsland=selectedIsland||island().id;let si=DATA.islands.find(i=>i.id===selectedIsland)||island();return `<main><div class="card"><h2>World Map</h2><div class="mapBox">${isl.map((i,n)=>`<button class="island" style="left:${12+(n%3)*28}%;top:${18+Math.floor(n/3)*32}%" onclick="selectedIsland='${i.id}';render()">${i.name}</button>`).join("")}</div></div></main><aside><div class="card"><h3>${si.name}</h3><p>${si.desc}</p><div class="line"><span>Danger</span><b>${si.danger}/10</b></div><div class="line"><span>Marine</span><b>${si.marine}/10</b></div><div class="line"><span>Pirates</span><b>${si.pirate}/10</b></div><div class="line"><span>Weather</span><b>${si.weather}</b></div><h3>Locations</h3>${si.places.map(p=>`<button onclick="islandEvent('${p}','${si.name}')">${p}</button>`).join("")}<button class="primary" onclick="travelTo('${si.id}')">Travel Here</button></div></aside>`}
function islandEvent(place,name){let ev=pick([`At the ${place}, someone whispers about treasure.`,`At the ${place}, you see someone being robbed.`,`At the ${place}, a merchant offers work.`]);modal(place,ev,[{icon:"⭐",text:"Exploration EXP +5",apply:()=>xp(5)},{icon:"💎",text:"Gems +1",apply:()=>s.gems++}],()=>{save();render()})}
function travelTo(id){let i=DATA.islands.find(x=>x.id===id);s.island=i.name;s.sea=i.sea;s.stats.navigation++;outcome("Travel",`You traveled to ${i.name}.`,[{icon:"🧭",text:"Navigation +1"},{icon:"💎",text:"Gems +1",apply:()=>s.gems++}])}
function crew(){return `<main><div class="card"><h2>${s.crewName||s.marineUnit||"Crew / Unit"}</h2><p>${s.title}</p>${s.crew.map(c=>`<div class="crewMember"><div class="avatar">🧑‍✈️</div><div><b>${c.name}</b><div>${c.role}</div><div class="small">Dream: ${c.dream}</div></div><div>${bar("Loyalty",c.loyalty)}</div></div>`).join("")||"<p>No crew yet. Join a crew, enlist, or recruit members.</p>"}</div></main>`}
function inventory(){let all=[...s.weapons,...s.inventory,...s.fruits];return `<main><div class="card"><h2>Inventory</h2><div class="itemGrid">${all.map(i=>`<div class="item"><h3>${i.name}</h3><div>${i.type||"Item"} · ${i.rarity||"Common"}</div><p class="small">${i.desc}</p>${i.qty?`<b>x${i.qty}</b>`:""}${i.power?`<b>Power ${i.power}</b>`:""}</div>`).join("")}</div></div></main>`}
function logbook(){return `<main><div class="card"><h2>Logbook</h2><div class="grid grid2"><div><h3>Life Summary</h3><div class="line"><span>Years Lived</span><b>${s.age}</b></div><div class="line"><span>Power</span><b>${fmt(power())}</b></div><div class="line"><span>Bounty</span><b>฿${fmt(s.bounty)}</b></div><div class="line"><span>Crew</span><b>${s.crew.length}</b></div></div><div><h3>Recent Entries</h3>${s.log.slice(0,12).map(l=>`<div class="event"><span>${l}</span><b>Age ${s.age}</b></div>`).join("")}</div></div></div></main>`}
function relationships(){return `<main><div class="card"><h2>Relationships</h2>${s.relationships.map(r=>`<div class="relation"><div class="avatar">🙂</div><div><b>${r.name}</b><div>${r.type}</div><p class="small">${r.desc}</p></div><div>${bar("Loyalty",r.loyalty)}</div></div>`).join("")||"<p>No relationships yet.</p>"}</div></main>`}
function settings(){return `<main><div class="card"><h2>Settings</h2><div class="line"><span>Difficulty</span><b>${s.settings.difficulty}</b></div><div class="line"><span>Event Frequency</span><b>${s.settings.eventFrequency}</b></div><div class="line"><span>Permadeath</span><b>${s.settings.permadeath}</b></div><button onclick="save();toast('Saved')">Save Game</button><button class="danger" onclick="localStorage.removeItem(SAVE_KEY);s=null;start()">New Save</button></div></main>`}
function ageUp(){let old=s.age;s.age++;s.actionsMax=actionsMax();s.actionsLeft=s.actionsMax;s.gems+=1+Math.floor(Math.random()*3);let ev=randomEvent();s.log.unshift(ev);if(s.age===10&&s.dream==="Undiscovered")s.dream=pick(["Freedom","Become Pirate King","Justice","Knowledge","Riches","Strongest Swordsman"]);save();modal("Year Summary",`Age ${old} → ${s.age}. ${ev}`,[{icon:"💎",text:"Gems +1-3"},{icon:"⭐",text:"New life event"}],()=>render())}
function randomEvent(){if(s.age<13)return pick(["You heard sailors tell stories about the sea.","You helped your family around town.","You played near the docks."]);if(s.age<18)return pick(["A pirate ship arrived nearby.","A mentor noticed your potential.","Marine recruitment posters appeared."]);return pick(["A new opportunity appeared on the island.","Your reputation quietly grew.","World events shifted around you."])}
function render(){if(!s)return start();norm();let main=currentScreen==="battle"?battleScreen():currentScreen==="dashboard"?dashboard():currentScreen==="actions"?actions():currentScreen==="crew"?crew():currentScreen==="world"?world():currentScreen==="inventory"?inventory():currentScreen==="logbook"?logbook():currentScreen==="relationships"?relationships():settings();let full=currentScreen==="battle";$("app").innerHTML=top()+(!full?nav():"")+`<div class="layout">${full?main:left()+main+(currentScreen==="world"?"":right())}</div>`+(!full?`<button class="bottomAge gold" onclick="ageUp()">⭐ AGE UP<br><span class="small">Next Year</span></button>`:"")}


/* v10.2 Boot Hotfix
   Fixes browser-global conflicts and prevents blank startup screens.
*/
function safeDefaults(){
  if(!window.DATA){
    window.DATA={names:["Rookie"],origins:[{id:"dock",name:"Dock Rat",icon:"⚓",cost:0,desc:"Dock origin.",bonus:{strength:1,beli:50}}],
    races:[{id:"human",name:"Human",icon:"👤",cost:0,desc:"Adaptable.",bonus:{potential:1}}],
    islands:[{id:"foosha",name:"Foosha Village",sea:"East Blue",danger:1,pop:1000,marine:1,pirate:1,weather:"Clear",desc:"A peaceful village.",places:["Docks","Market"]}],
    weapons:[{name:"Rusty Sword",type:"Weapon",rarity:"Common",power:4,desc:"A worn sword."}],items:[],fruits:[],news:["The sea is calm."]};
  }
}
function norm(){
  safeDefaults();
  if(!s || typeof s!=="object"){s=null;return;}
  s.stats=s.stats||{strength:5,speed:5,stamina:5,defense:5,haki:0,devilFruit:0,intelligence:5,charisma:5,willpower:5,discipline:0,sneak:0,navigation:0,perception:0,crafting:0,medicine:0,sword:0};
  s.reps=s.reps||{marines:0,pirates:0,revolutionaries:0,underworld:0,civilians:0};
  s.crew=s.crew||[]; s.relationships=s.relationships||[]; s.inventory=s.inventory||[]; s.weapons=s.weapons||[]; s.fruits=s.fruits||[];
  s.news=s.news||[]; s.log=s.log||[]; s.effects=s.effects||[]; s.settings=s.settings||{difficulty:"Normal",eventFrequency:"High",permadeath:"Off"};
  s.unlocks=s.unlocks||{origins:[],races:[]};
  if(s.hp===undefined)s.hp=100; if(s.maxHp===undefined)s.maxHp=100;
  if(s.gems===undefined)s.gems=0; if(s.beli===undefined)s.beli=0; if(s.fame===undefined)s.fame=0;
  s.actionsMax=actionsMax();
  if(s.actionsLeft==null||s.actionsLeft>s.actionsMax)s.actionsLeft=s.actionsMax;
}
function bootSafe(){
  try{
    safeDefaults();
    load();
  }catch(err){
    console.error("Boot failed:", err);
    const app=document.getElementById("app");
    if(app){
      app.innerHTML=`<div class="startHero" style="display:block;min-height:100vh;padding:20px">
        <div class="startPanel" style="max-width:680px;margin:60px auto">
          <h1>☠️ Great Pirate Life Sim</h1>
          <h2>Startup Recovery</h2>
          <p>The game caught a startup problem instead of staying blank.</p>
          <p class="small">${err.message}</p>
          <button class="primary" onclick="localStorage.removeItem('${SAVE_KEY}'); s=null; start()">Start New Life</button>
          <button onclick="start()">Open Start Screen</button>
        </div>
      </div>`;
    }
  }
}
try{
  // Replace previous auto-load result if the app is still empty/loading.
  const app=document.getElementById("app");
  if(app && app.textContent.includes("Loading Great Pirate Life Sim")) bootSafe();
}catch(e){console.error(e);}



/* =========================
   v10.2 Start Flow Hotfix
   Stable first screen + direct character creation.
   ========================= */

let createVisible_v102 = false;

function start(){
  safeDefaults();
  const app=document.getElementById("app");
  if(!app) return;
  app.innerHTML = `
  <div class="startHero v102Start">
    <div class="startPanel">
      <h2>☠️ Menu</h2>
      <button class="primary" onclick="showCreateLife()">New Life</button>
      <button onclick="load()">Load Game</button>
      <button onclick="showCreateLife()">Settings</button>
      <button onclick="alert('Great Pirate Life Sim v10.2')">Credits</button>
    </div>

    <div class="bigLogo">
      <div class="logoIcon">☠️</div>
      <h1>GREAT<br>PIRATE<br>LIFE SIM</h1>
      <h2>Live Your Legend</h2>
      <p class="small">You begin at birth. Your path is shaped by life, not chosen at the menu.</p>
    </div>

    <div class="startPanel">
      <h3>The Sea Is Calling...</h3>
      <p>• Choose your name, origin, race, and settings.</p>
      <p>• Your island is chosen based on your life.</p>
      <p>• Pirate, Marine, Revolutionary, or Wanderer emerges through play.</p>
      <button class="gold" onclick="showCreateLife()">Create Character</button>
    </div>

    <div id="createLifePanel" class="startCreate" style="display:${createVisible_v102?'grid':'none'}">
      ${createLifeHTML()}
    </div>
  </div>`;
}

function showCreateLife(){
  createVisible_v102 = true;
  start();
  setTimeout(()=>document.getElementById("createLifePanel")?.scrollIntoView({behavior:"smooth",block:"start"}),50);
}

function createLifeHTML(){
  const originCards = DATA.origins.map(o=>choiceHTML_v102(o,"origin")).join("");
  const raceCards = DATA.races.map(r=>choiceHTML_v102(r,"race")).join("");
  return `
    <div class="startPanel">
      <h3>1. Who are you?</h3>
      <div class="portrait">🙂</div>
      <label>Name</label>
      <input id="nm" value="Lionel Aguilar">
      <label>Nickname</label>
      <input id="nick" placeholder="Optional">
      <label>Gender</label>
      <select id="gender"><option>Male</option><option>Female</option><option>Other</option></select>
    </div>
    <div class="startPanel">
      <h3>2. Origin</h3>
      <div id="originList">${originCards}</div>
    </div>
    <div class="startPanel">
      <h3>3. Race</h3>
      <div id="raceList">${raceCards}</div>
    </div>
    <div class="startPanel">
      <h3>4. Life Settings</h3>
      <label>Difficulty</label>
      <select id="diff"><option>Normal</option><option>Easy</option><option>Hard</option></select>
      <label>Event Frequency</label>
      <select id="freq"><option>High</option><option>Normal</option><option>Low</option></select>
      <label>Permadeath</label>
      <select id="pd"><option>Off</option><option>On</option></select>
      <button class="gold" onclick="newLife()">BEGIN LIFE</button>
      <p class="small">Premium origins/races are visible but locked until you earn enough gems.</p>
    </div>`;
}

function choiceHTML_v102(o,type){
  const active = (type==="origin" && o.id===selectedOrigin) || (type==="race" && o.id===selectedRace);
  const locked = (o.cost||0)>0;
  return `<div class="choice ${active?'active':''}" onclick="selectChoice_v102('${type}','${o.id}')">
    <div class="icon">${o.icon}</div>
    <div>
      <b>${o.name}</b>
      <div class="small">${o.desc}</div>
      <div class="${locked?'req':'small'}">${locked?'🔒 💎 '+o.cost+' Gems':'Free'} · ${bonusText(o.bonus)}</div>
    </div>
    <div>${active?'✓':locked?'🔒':''}</div>
  </div>`;
}

function selectChoice_v102(type,id){
  if(type==="origin") selectedOrigin=id;
  if(type==="race") selectedRace=id;
  createVisible_v102 = true;
  start();
  setTimeout(()=>document.getElementById(type==="origin"?"originList":"raceList")?.scrollIntoView({behavior:"smooth",block:"center"}),30);
}

// Replace newLife with safer version that never silently fails.
function newLife(){
  try{
    safeDefaults();
    const origin = DATA.origins.find(x=>x.id===selectedOrigin) || DATA.origins[0];
    const race = DATA.races.find(x=>x.id===selectedRace) || DATA.races[0];

    if((origin.cost||0)>0) return toast("Origin locked. Earn gems by playing.");
    if((race.cost||0)>0) return toast("Race locked. Earn gems by playing.");

    const nameEl=document.getElementById("nm");
    const nickEl=document.getElementById("nick");
    const genderEl=document.getElementById("gender");
    const diffEl=document.getElementById("diff");
    const freqEl=document.getElementById("freq");
    const pdEl=document.getElementById("pd");

    const home = chooseIsland(origin,race) || DATA.islands[0];

    s = {
      version:"v10.2",
      name:(nameEl&&nameEl.value.trim()) || "Rookie",
      nick:(nickEl&&nickEl.value.trim()) || "",
      gender:(genderEl&&genderEl.value) || "Unknown",
      origin:origin.name,
      race:race.name,
      age:0,
      sea:home.sea,
      island:home.name,
      dream:"Undiscovered",
      title:"Child",
      beli:0,
      gems:2,
      fame:0,
      bounty:0,
      infamy:0,
      hp:100,
      maxHp:100,
      energy:5,
      mood:80,
      hunger:85,
      exp:0,
      level:1,
      actionsLeft:5,
      actionsMax:5,
      stats:{strength:5,speed:5,stamina:5,defense:5,haki:0,devilFruit:0,intelligence:5,charisma:5,willpower:5,discipline:0,sneak:0,navigation:0,perception:0,crafting:0,medicine:0,sword:0,survival:0,swimming:0,engineering:0,luck:0,potential:0,reflex:0},
      reps:{marines:0,pirates:0,revolutionaries:0,underworld:0,civilians:0},
      crew:[],
      relationships:[],
      inventory:[...DATA.items],
      weapons:[DATA.weapons[0]],
      fruits:[],
      news:DATA.news.map((text,i)=>({text,day:i+1})),
      log:[],
      effects:[],
      settings:{difficulty:(diffEl&&diffEl.value)||"Normal",eventFrequency:(freqEl&&freqEl.value)||"High",permadeath:(pdEl&&pdEl.value)||"Off"},
      unlocks:{origins:[],races:[]}
    };

    applyBonus(origin.bonus);
    applyBonus(race.bonus);
    s.maxHp += (race.bonus && race.bonus.hp) ? race.bonus.hp : 0;
    s.hp = s.maxHp;
    s.log.unshift(`Born in ${s.sea} at ${s.island}. Origin: ${origin.name}. Race: ${race.name}.`);

    save();

    modal("Birth",`You were born in ${s.sea}. Your home is ${s.island}. Your path has not been chosen yet.`,[
      {icon:"⚓",text:`Origin: ${origin.name}`},
      {icon:race.icon,text:`Race: ${race.name}`},
      {icon:"💎",text:"+2 Starting Gems"}
    ],()=>{screen="dashboard";render();});
  }catch(err){
    console.error("newLife failed",err);
    alert("Start error: "+err.message);
  }
}

function bootSafe(){
  try{
    safeDefaults();
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){
      try{ s=JSON.parse(raw); norm(); render(); return; }
      catch(e){ localStorage.removeItem(SAVE_KEY); }
    }
    start();
  }catch(err){
    console.error("Boot failed:", err);
    const app=document.getElementById("app");
    if(app){
      app.innerHTML=`<div class="startHero" style="display:block;min-height:100vh;padding:20px">
        <div class="startPanel" style="max-width:680px;margin:60px auto">
          <h1>☠️ Great Pirate Life Sim</h1>
          <h2>Startup Recovery</h2>
          <p>${err.message}</p>
          <button class="primary" onclick="localStorage.removeItem('${SAVE_KEY}'); s=null; createVisible_v102=true; start()">Start New Life</button>
        </div>
      </div>`;
    }
  }
}

bootSafe();
