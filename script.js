
const SAVE_KEY="gpls_save_v120";
const DATA={names:["Lionel","Kaid","Lian","Nero","Ember","Mako","Orion","Cale","Riven","Sora","Vale","Juno","Kai","Amanda","Riku","Luna"],origins:[["dock","Dock Rat","⚓",0,"You grew up around docks.",{strength:1,beli:50,survival:1}],["marinefam","Marine Family","🛡️",0,"Justice shaped your home.",{discipline:1,intelligence:1,marineRep:1}],["noble","Noble Runaway","👑",0,"You fled comfort.",{charisma:1,beli:100,luck:1}],["shipwright","Shipwright Family","⚒️",0,"Builders raised you.",{intelligence:1,crafting:1,engineering:1}],["fisher","Fisher Family","🌊",0,"The sea raised you.",{stamina:1,swimming:1,perception:1}],["unknown","Unknown Past","❓",0,"Your past is a mystery.",{potential:2,luck:1}],["performer","Street Performer","🎭",0,"Crowds taught you charm.",{charisma:2,beli:80}],["scholar","Scholar Family","📚",0,"Books shaped you.",{intelligence:2,perception:1}],["merchant","Merchant Child","💰",0,"You learned trade.",{beli:300,charisma:1}],["doctor","Doctor Apprentice","🏥",0,"You learned medicine.",{medicine:2,intelligence:1}],["blacksmith","Blacksmith Child","🔨",0,"Steel surrounded you.",{crafting:1,strength:1}],["wano","Wano Exile","⚔️",600,"A blade follows you.",{sword:3,willpower:1,beli:200}],["piratechild","Pirate Captain Child","☠️",800,"Your name worries Marines.",{fame:5,infamy:2,charisma:1}],["godvalley","Survivor of God Valley","🔥",750,"The world remembers.",{potential:5,willpower:3}],["celestial","Celestial Dragon Escapee","🌟",1500,"You escaped the untouchable.",{charisma:4,potential:3,heat:5}],["ancient","Ancient Bloodline","🌑",2500,"???",{potential:6,willpower:4,luck:2}]].map(x=>({id:x[0],name:x[1],icon:x[2],cost:x[3],desc:x[4],bonus:x[5]})),races:[["human","Human","👤",0,"Adaptable growth.",{potential:1,xpBoost:5}],["fishman","Fishman","🐟",0,"Sea-born power.",{strength:3,stamina:2,swimming:3}],["skypiean","Skypiean","☁️",0,"Sky perception.",{perception:2,speed:1}],["mink","Mink","🦴",0,"Fast Electro warriors.",{speed:2,reflex:2}],["halfgiant","Half Giant","⚔️",750,"Large but mobile.",{strength:3,stamina:3}],["giant","Giant","🗿",1500,"Monster strength.",{strength:6,stamina:5,hp:30}],["buccaneer","Buccaneer","💪",1800,"Impossible endurance.",{strength:4,stamina:4,willpower:3}],["lunarian","Lunarian","🔥",3000,"Flame and defense.",{strength:4,stamina:4,haki:3}],["hybrid","Ancient Hybrid","🌑",5000,"Unknown power.",{potential:8,luck:3}]].map(x=>({id:x[0],name:x[1],icon:x[2],cost:x[3],desc:x[4],bonus:x[5]})),islands:[["foosha","Foosha Village","East Blue",1,1200,1,2,"Clear","Peaceful village where legends begin.",["Tavern","Docks","Market","Hill Path"]],["shells","Shells Town","East Blue",2,4000,7,2,"Sunny","Marine-controlled town.",["Marine Base","Docks","Market","Training Yard"]],["orange","Orange Town","East Blue",3,3500,3,6,"Windy","Lively port with pirate trouble.",["Tavern","Market","Alleys","Docks"]],["syrup","Syrup Village","East Blue",2,900,1,3,"Cloudy","Quiet hills and rumors.",["Mansion Road","Village Square","Forest","Docks"]],["loguetown","Loguetown","East Blue",5,12000,6,7,"Rainy","Town of beginnings and endings.",["Execution Square","Weapon Shop","Tavern","Docks"]],["moonveil","Moonveil Island","Grand Line",6,5000,4,8,"Stormy","Mysterious storm island.",["Ruins","Black Market","Port","Wilderness"]]].map(x=>({id:x[0],name:x[1],sea:x[2],danger:x[3],pop:x[4],marine:x[5],pirate:x[6],weather:x[7],desc:x[8],places:x[9]})),weapons:[{name:"Rusty Sword",type:"Weapon",rarity:"Common",power:4,equip:true,desc:"A worn sword."},{name:"Iron Sword",type:"Weapon",rarity:"Common",power:8,equip:true,desc:"A sturdy blade."},{name:"Flintlock Pistol",type:"Weapon",rarity:"Common",power:6,equip:true,desc:"A simple pistol."},{name:"Graded Blade III",type:"Weapon",rarity:"Rare",power:18,equip:true,desc:"A reliable graded blade."}],items:[{name:"Small Med Kit",type:"Consumable",rarity:"Common",qty:2,desc:"Restores 20 HP.",effect:"heal"},{name:"Energy Meat",type:"Consumable",rarity:"Common",qty:3,desc:"Restores 1 action.",effect:"energy"},{name:"Treasure Map",type:"Map",rarity:"Uncommon",qty:1,desc:"Starts a treasure event.",effect:"map"},{name:"Rumor Sheet",type:"Rumor",rarity:"Common",qty:1,desc:"Reveals an island event.",effect:"rumor"},{name:"Mystery Box",type:"Box",rarity:"Rare",qty:1,desc:"Open for a random reward.",effect:"box"},{name:"Log Pose",type:"Key Item",rarity:"Rare",qty:1,desc:"Unlocks dangerous travel.",effect:"key"}],fruits:[{name:"Smoke Body Fruit",type:"Logia",rarity:"Epic",power:28,desc:"Become smoke."},{name:"Wolf-Wolf Fruit",type:"Zoan",rarity:"Uncommon",power:13,desc:"Wolf transformation."},{name:"Barrier-Barrier Fruit",type:"Paramecia",rarity:"Rare",power:20,desc:"Create barriers."}],news:["Marine patrols increased near Shells Town.","A rare fruit merchant was seen near Orange Town.","Pirates have been extorting merchants.","Strange weather patterns are forming near the Grand Line.","A bounty hunter was spotted asking questions."]};
let S=null,page="dashboard",actionFilter="All",selectedOrigin="dock",selectedRace="human",selectedIsland=null,currentBattle=null;
const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),fmt=n=>Math.round(n||0).toLocaleString();
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(S))}
function load(){let r=localStorage.getItem(SAVE_KEY);if(r){try{S=JSON.parse(r);normalize();render();return}catch(e){localStorage.removeItem(SAVE_KEY)}}start()}
function normalize(){if(!S)return;S.actionsMax=actionsMax();if(S.actionsLeft==null||S.actionsLeft>S.actionsMax)S.actionsLeft=S.actionsMax;["crew","relationships","inventory","weapons","fruits","news","log","effects"].forEach(k=>S[k]=S[k]||[]);S.gems=S.gems||0;S.equipped=S.equipped||S.weapons?.[0]?.name||"Fists";S.unlocks=S.unlocks||{origins:[],races:[]}}
function actionsMax(){if(!S)return 5;if(S.age<13)return 5;if(S.age<18)return 8;if(S.age<55)return 12;if(S.age<70)return 10;return 8}
function applyBonus(o){Object.entries(o||{}).forEach(([k,v])=>{if(k in S.stats)S.stats[k]+=v;else S[k]=(S[k]||0)+v})}
function bonusText(b){return Object.entries(b||{}).map(([k,v])=>`+${v} ${k}`).join(" · ")}
function start(){document.getElementById("app").innerHTML=`<div class="startHero"><div><div class="startPanel"><button class="primary" onclick="showCreate()">☠️ New Life</button><button onclick="load()">🧭 Load Game</button><button>⚙️ Settings</button></div><div class="startPanel" style="margin-top:10px"><h3>The Sea Is Calling...</h3><p>You start at birth. Your path is earned through choices.</p></div></div><div class="bigLogo"><div class="logoIcon">☠️</div><h1>GREAT<br>PIRATE<br>LIFE SIM</h1><h2>Living World Foundation</h2></div><div class="startPanel"><h3>v12.0</h3><p>Purpose-based inventory.</p><p>Meaningful levels.</p><p>Outcome popups.</p><p>Stable rebuilt foundation.</p><button class="gold" onclick="showCreate()">Create Character</button></div><div id="create" class="startCreate" style="display:none">${createHTML()}</div></div>`}
function showCreate(){document.getElementById("create").style.display="grid";document.getElementById("create").scrollIntoView({behavior:"smooth"})}
function createHTML(){return `<div class="startPanel"><h3>1. Identity</h3><div class="portrait">🙂</div><label>Name</label><input id="nm" value="Lionel Aguilar"><label>Nickname</label><input id="nick" placeholder="Optional"><label>Gender</label><select id="gender"><option>Male</option><option>Female</option><option>Other</option></select></div><div class="startPanel"><h3>2. Origin</h3>${DATA.origins.map(o=>choice(o,"origin")).join("")}</div><div class="startPanel"><h3>3. Race</h3>${DATA.races.map(r=>choice(r,"race")).join("")}</div><div class="startPanel"><h3>4. Settings</h3><label>Difficulty</label><select id="diff"><option>Normal</option><option>Easy</option><option>Hard</option></select><button class="gold" onclick="newLife()">BEGIN LIFE</button><p class="small">Locked races/origins are earned with gems from play.</p></div>`}
function choice(o,t){let active=(t==="origin"&&o.id===selectedOrigin)||(t==="race"&&o.id===selectedRace),locked=o.cost>0;return `<div class="choice ${active?'active':''}" onclick="selectChoice('${t}','${o.id}')"><div class="icon">${o.icon}</div><div><b>${o.name}</b><div class="small">${o.desc}</div><div class="${locked?'req':'small'}">${locked?'🔒 💎 '+o.cost:'Free'} · ${bonusText(o.bonus)}</div></div><div>${active?'✓':locked?'🔒':''}</div></div>`}
function selectChoice(t,id){if(t==="origin")selectedOrigin=id;else selectedRace=id;start();showCreate()}
function chooseIsland(o){if(o.id==="marinefam")return DATA.islands.find(i=>i.id==="shells");if(o.id==="dock")return DATA.islands.find(i=>i.id==="foosha");return DATA.islands.find(i=>i.sea==="East Blue")}
function newLife(){let o=DATA.origins.find(x=>x.id===selectedOrigin)||DATA.origins[0],r=DATA.races.find(x=>x.id===selectedRace)||DATA.races[0];if(o.cost>0)return alert("Origin locked. Earn gems.");if(r.cost>0)return alert("Race locked. Earn gems.");let home=chooseIsland(o);S={version:"v12.0",name:document.getElementById("nm").value||"Rookie",nick:document.getElementById("nick").value||"",gender:document.getElementById("gender").value,origin:o.name,race:r.name,age:0,sea:home.sea,island:home.name,dream:"Undiscovered",title:"Child",beli:0,gems:2,fame:0,bounty:0,infamy:0,hp:100,maxHp:100,mood:80,exp:0,level:1,actionsLeft:5,actionsMax:5,equipped:"Rusty Sword",stats:{strength:5,speed:5,stamina:5,defense:5,haki:0,devilFruit:0,intelligence:5,charisma:5,willpower:5,discipline:0,sneak:0,navigation:0,perception:0,crafting:0,medicine:0,sword:0,survival:0,swimming:0,engineering:0,luck:0,potential:0,reflex:0},reps:{marines:0,pirates:0,revolutionaries:0,underworld:0,civilians:0},crew:[],relationships:[],inventory:JSON.parse(JSON.stringify(DATA.items)),weapons:[DATA.weapons[0]],fruits:[],news:DATA.news.map((text,i)=>({text,day:i+1})),log:[],effects:[],settings:{difficulty:document.getElementById("diff").value},unlocks:{origins:[],races:[]}};applyBonus(o.bonus);applyBonus(r.bonus);S.maxHp+=(r.bonus.hp||0);S.hp=S.maxHp;S.log.unshift(`Born in ${S.sea} at ${S.island}. Origin: ${o.name}. Race: ${r.name}.`);save();popup("Birth",`You were born in ${S.sea}. Your path has not been chosen yet.`,[{icon:"⚓",text:`Origin: ${o.name}`},{icon:r.icon,text:`Race: ${r.name}`},{icon:"💎",text:"+2 Starting Gems"}],()=>render())}
function popup(title,body,rewards=[],cb=()=>render()){let m=$("modal");m.innerHTML=`<div class="modalWrap"><div class="modalCard"><h2>${title}</h2><p>${body}</p><h3>Outcome</h3>${rewards.map(r=>`<div class="reward"><span>${r.icon||"⭐"}</span><span>${r.text}</span><b></b></div>`).join("")||"<p class='small'>No reward.</p>"}<button class="primary" id="cont">Continue</button></div></div>`;document.getElementById("cont").onclick=()=>{m.innerHTML="";cb()}}
function reward(title,body,items=[],free=false){items.forEach(x=>x.apply&&x.apply());if(!free)S.actionsLeft=Math.max(0,S.actionsLeft-1);S.log.unshift(body);if(Math.random()<.25)S.log.unshift("Bonus event: "+pick(["A stranger noticed your effort.","You heard a rumor nearby.","You found a small pouch of coins."]));save();popup(title,body,items)}
function xp(n){S.exp+=n;if(S.exp>=100){S.level++;S.exp-=100;let u=levelUnlock(S.level);S.log.unshift(`Reached level ${S.level}. ${u}`);S.gems+=5;popup("Level Up",`You reached level ${S.level}.`,[{icon:"⭐",text:u},{icon:"💎",text:"+5 Gems"}],()=>render())}}
function levelUnlock(l){if(l===5)return"Unlocked: nearby travel, street events, rumors.";if(l===10)return"Unlocked: arena, fruit searching, Haki basics.";if(l===15)return"Unlocked: crews, Marines, ship ownership.";if(l===25)return"Unlocked: Grand Line, recruiting, underworld.";if(l===40)return"Unlocked: territory and legendary events.";return"Your reputation grows."}
function topbar(){return `<div class="topbar"><div class="title">☠️ Great Pirate Life Sim <span class="ver">v12.0</span></div><div class="topStats"><span>฿ <b>${fmt(S.beli)}</b></span><span>💎 <b>${S.gems}</b></span><span>🗽 <b>${S.fame}</b></span><button onclick="save();alert('Saved')">Save</button></div></div>`}
function nav(){return `<div class="nav">${[["dashboard","🏠 Dashboard"],["actions","⚔️ Actions"],["crew","☠️ Crew"],["world","🌎 World"],["inventory","🎒 Inventory"],["logbook","📖 Logbook"],["relationships","❤️ Relationships"],["settings","⚙️ Settings"]].map(t=>`<button class="${page===t[0]?'active':''}" onclick="page='${t[0]}';render()">${t[1]}</button>`).join("")}</div>`}
function bar(l,v,m=100){return `<div class="line"><span>${l}</span><b>${Math.round(v)}/${m}</b></div><div class="meter"><i style="width:${clamp(v/m*100,0,100)}%"></i></div>`}
function left(){return `<aside><div class="card"><h2>${S.name}</h2><div class="small">${S.race} · ${S.origin}</div><div class="portrait">🙂</div><div class="line"><span>Age</span><b>${S.age}</b></div><div class="line"><span>Island</span><b>${S.island}</b></div><div class="line"><span>Equipped</span><b>${S.equipped}</b></div></div><div class="card"><h3>Vitality</h3>${bar("HP",S.hp,S.maxHp)}${bar("Actions",S.actionsLeft,S.actionsMax)}${bar("Mood",S.mood)}${bar("EXP",S.exp,100)}</div><div class="card"><h3>Attributes</h3>${Object.entries(S.stats).slice(0,10).map(([k,v])=>`<div class="line"><span>${k}</span><b>${v}</b></div>`).join("")}</div></aside>`}
function right(){return `<aside><div class="card"><h3>World News</h3>${S.news.slice(0,5).map(n=>`<div class="event"><span>${n.text}</span><b>Day ${n.day}</b></div>`).join("")}</div><div class="card"><h3>Location</h3><h2>${S.sea}</h2><p>${island().desc}</p></div><div class="card"><h3>Useful Unlocks</h3><p class="small">Level 5: Travel & rumors<br>Level 10: Arena & fruit search<br>Level 15: crews/marines<br>Level 25: Grand Line</p></div></aside>`}
function island(){return DATA.islands.find(i=>i.name===S.island)||DATA.islands[0]}
function power(){let st=S.stats,wp=DATA.weapons.find(w=>w.name===S.equipped)?.power||0;return Math.round(st.strength*12+st.speed*10+st.stamina*10+st.defense*10+st.haki*30+st.devilFruit*25+wp*20+S.fame*4+S.bounty/100000)}
function rank(v){if(v>=3500)return"SS";if(v>=2200)return"S";if(v>=1400)return"A";if(v>=900)return"B";if(v>=500)return"C";if(v>=250)return"D";if(v>=100)return"E";return"F"}
function progress(){let st=S.stats;return {Combat:{pct:clamp((st.strength+st.speed+st.stamina+st.defense)*1.2,0,100),rank:rank((st.strength+st.speed+st.stamina+st.defense)*15)},Haki:{pct:clamp(st.haki*10,0,100),rank:rank(st.haki*80)},Exploration:{pct:clamp(st.navigation*12+S.level*4,0,100),rank:rank(st.navigation*80+S.level*30)},Reputation:{pct:clamp(S.fame+S.infamy+S.bounty/1000000,0,100),rank:rank(S.fame*25+S.infamy*40+S.bounty/100000)},Crew:{pct:clamp(S.crew.length*12,0,100),rank:S.crew.length?rank(S.crew.reduce((a,c)=>a+c.strength,0)):"None"}}}
function dashboard(){let p=progress();return `<main><div class="card heroDream"><h3>⭐ Dream</h3><h2>“${S.dream}”</h2><p>${S.dream==="Undiscovered"?"Your dream awakens through life choices.":"Your life is bending toward this dream."}</p><div class="line"><span>Overall Power</span><b>${fmt(power())} · Rank ${rank(power())}</b></div></div><div class="card"><h3>Progress Overview</h3><div class="grid grid5">${Object.entries(p).map(([k,v])=>`<div class="progressCard"><div class="circle">${Math.round(v.pct)}%</div><h4>${k}</h4><div>Rank: ${v.rank}</div></div>`).join("")}</div></div><div class="card"><h3>Recent Events</h3>${S.log.slice(0,6).map(l=>`<div class="event"><span>${l}</span><b>Age ${S.age}</b></div>`).join("")}</div></main>`}
const ACTIONS=[{id:"play",cat:"General",icon:"🏝️",name:"Play / Explore",desc:"Mood, XP, gems.",req:()=>true,txt:"",do:()=>reward("Play / Explore","You explored your surroundings.",[{icon:"😊",text:"Mood +5",apply:()=>S.mood=clamp(S.mood+5,0,100)},{icon:"⭐",text:"EXP +5",apply:()=>xp(5)},{icon:"💎",text:"Gems +1",apply:()=>S.gems++}])},{id:"study",cat:"General",icon:"📘",name:"Study",desc:"Intelligence unlocks better choices.",req:()=>S.age>=5,txt:"Requires Age 5+",do:()=>reward("Study","You studied hard.",[{icon:"🧠",text:"Intelligence +1",apply:()=>S.stats.intelligence++},{icon:"⭐",text:"EXP +8",apply:()=>xp(8)}])},{id:"train",cat:"General",icon:"🏋️",name:"Train",desc:"Strength unlocks weapons and intimidation.",req:()=>S.age>=7,txt:"Requires Age 7+",do:()=>reward("Train","You trained until your body burned.",[{icon:"💪",text:"Strength +1",apply:()=>S.stats.strength++},{icon:"🛡️",text:"Stamina +1",apply:()=>S.stats.stamina++},{icon:"⭐",text:"EXP +10",apply:()=>xp(10)}])},{id:"work",cat:"General",icon:"💰",name:"Work",desc:"Earn Beli for items and training.",req:()=>S.age>=10,txt:"Requires Age 10+",do:()=>reward("Work","You worked hard for your money.",[{icon:"💰",text:"Beli +800",apply:()=>S.beli+=800},{icon:"⭐",text:"EXP +6",apply:()=>xp(6)}])},{id:"friends",cat:"Social",icon:"👥",name:"Make Friends",desc:"Relationships create quests and assists.",req:()=>S.age>=5,txt:"Requires Age 5+",do:()=>{let n=pick(DATA.names);S.relationships.unshift({name:n,type:"Friend",loyalty:60,desc:"A friend who can help later."});reward("New Friend",`You became friends with ${n}.`,[{icon:"❤️",text:`${n} added`},{icon:"⭐",text:"EXP +5",apply:()=>xp(5)}])}},{id:"rival",cat:"Social",icon:"⚔️",name:"Find Rival",desc:"Rivals trigger competition events.",req:()=>S.age>=10,txt:"Requires Age 10+",do:()=>{let n=pick(DATA.names);S.relationships.unshift({name:n,type:"Rival",loyalty:25,desc:"A rival who pushes you."});reward("Rival Found",`${n} sees you as competition.`,[{icon:"🔥",text:"Rival added"},{icon:"⭐",text:"EXP +8",apply:()=>xp(8)}])}},{id:"spar",cat:"Combat",icon:"🥊",name:"Spar",desc:"Safe combat growth.",req:()=>S.age>=8,txt:"Requires Age 8+",do:()=>reward("Sparring","You practiced combat safely.",[{icon:"💪",text:"Strength +1",apply:()=>S.stats.strength++},{icon:"⭐",text:"EXP +12",apply:()=>xp(12)}])},{id:"bounty",cat:"Combat",icon:"🎯",name:"Bounty Hunt",desc:"Fast move-based battle.",req:()=>S.age>=15||S.level>=10,txt:"Requires Age 15 or Level 10",do:()=>startBattle("Rogue Swordsman",100)},{id:"pirate",cat:"Crew / Career",icon:"☠️",name:"Join Pirate Crew",desc:"Changes crew screen and events.",req:()=>S.age>=14||S.level>=15,txt:"Requires Age 14 or Level 15",do:()=>joinPath("pirate")},{id:"marine",cat:"Crew / Career",icon:"🛡️",name:"Join Marines",desc:"Unlocks unit/missions.",req:()=>S.age>=15||S.level>=15,txt:"Requires Age 15 or Level 15",do:()=>joinPath("marine")},{id:"recruit",cat:"Crew / Career",icon:"🧑‍✈️",name:"Recruit Member",desc:"Crew assists and ship activities.",req:()=>S.age>=16||S.level>=25,txt:"Requires Age 16 or Level 25",do:()=>addCrew()},{id:"travel",cat:"Exploration",icon:"⛵",name:"Travel Nearby",desc:"Interactive map.",req:()=>S.age>=13||S.level>=5,txt:"Requires Age 13 or Level 5",do:()=>{page="world";render()}},{id:"fruit",cat:"Exploration",icon:"🍈",name:"Search Devil Fruit",desc:"Find powers and world reactions.",req:()=>S.age>=14||S.level>=10,txt:"Requires Age 14 or Level 10",do:()=>findFruit()},{id:"black",cat:"Underworld",icon:"🕶️",name:"Black Market",desc:"Rare items and risks.",req:()=>S.age>=18||S.level>=25,txt:"Requires Age 18 or Level 25",do:()=>reward("Black Market","You found illegal traders.",[{icon:"🕶️",text:"Infamy +2",apply:()=>S.infamy+=2},{icon:"🎁",text:"Mystery Box",apply:()=>S.inventory.push({name:"Mystery Box",type:"Box",rarity:"Rare",qty:1,desc:"Open for a reward.",effect:"box"})}])}];
function actions(){let cats=["All","General","Social","Combat","Crew / Career","Exploration","Underworld"],list=ACTIONS.filter(a=>actionFilter==="All"||a.cat===actionFilter);return `<main><div class="card"><h2>Actions</h2><div class="line"><span>All options visible. Locked actions show requirements.</span><b>${S.actionsLeft}/${S.actionsMax}</b></div><div class="actionTabs">${cats.map(c=>`<button class="${actionFilter===c?'active':''}" onclick="actionFilter='${c}';render()">${c}</button>`).join("")}</div><div class="grid grid2">${list.map(a=>actionCard(a)).join("")}</div></div></main>`}
function actionCard(a){let ok=a.req();return `<div class="actionCard ${ok?'':'locked'}"><div class="actionIcon">${ok?a.icon:"🔒"}</div><div><b>${a.name}</b><div class="small">${a.desc}</div><div class="${ok?'small':'req'}">${ok?"Energy Cost: 1":a.txt}</div></div><button onclick="doAction('${a.id}')" ${!ok||S.actionsLeft<=0?'disabled':''}>${ok?"Select":"Locked"}</button></div>`}
function doAction(id){let a=ACTIONS.find(x=>x.id===id);if(!a.req())return alert(a.txt);if(S.actionsLeft<=0)return alert("No actions left.");a.do()}
function joinPath(type){if(type==="pirate"){S.title="Pirate Crew Member";S.reps.pirates+=5;S.crewName=pick(["Crimson Tide Pirates","Black Fang Pirates","Storm Gull Pirates"]);reward("Crew Joined",`You joined the ${S.crewName}.`,[{icon:"☠️",text:"Pirate Reputation +5"},{icon:"👥",text:"Crew screen updated"}])}else{S.title="Marine Recruit";S.reps.marines+=5;S.marineUnit="East Blue Patrol Squad 3";reward("Marine Enlistment",`You joined ${S.marineUnit}.`,[{icon:"🛡️",text:"Marine Reputation +5"},{icon:"🎖️",text:"Rank: Recruit"}])}}
function addCrew(){let c={name:pick(DATA.names),role:pick(["Navigator","Swordsman","Doctor","Gunner","Cook"]),loyalty:60,strength:80+Math.floor(Math.random()*180),dream:pick(["Freedom","Riches","Map the World","Protect Friends"])};S.crew.push(c);reward("New Crew Member",`${c.name}, a ${c.role}, joined you.`,[{icon:"👥",text:`${c.name} added`},{icon:"⭐",text:"EXP +10",apply:()=>xp(10)}])}
function findFruit(){let f=pick(DATA.fruits);S.fruits.push(f);S.stats.devilFruit+=Math.ceil(f.power/10);reward("Strange Fruit",`You discovered the ${f.name}.`,[{icon:"🍈",text:f.type+" · "+f.rarity},{icon:"🔥",text:"Devil Fruit +"+Math.ceil(f.power/10)}])}
function inventory(){let all=[...S.weapons.map(w=>({...w,source:"weapon"})),...S.inventory,...S.fruits.map(f=>({...f,source:"fruit"}))];return `<main><div class="card"><h2>Inventory</h2><p class="small">Every item has a use: equip, consume, open, follow, investigate, or sell.</p><div class="itemGrid">${all.map(i=>`<div class="item"><h3>${i.name}</h3><div>${i.type||"Item"} · ${i.rarity||"Common"}</div><p class="small">${i.desc}</p>${i.qty?`<b>x${i.qty}</b>`:""}${i.power?`<b>Power ${i.power}</b>`:""}<button onclick="useItem('${i.name}')">${useLabel(i)}</button><button onclick="sellItem('${i.name}')">Sell</button></div>`).join("")}</div></div></main>`}
function useLabel(i){if(i.equip||i.source==="weapon")return"Equip";if(i.effect==="heal")return"Use";if(i.effect==="energy")return"Eat";if(i.effect==="map")return"Follow Map";if(i.effect==="rumor")return"Investigate";if(i.effect==="box")return"Open";if(i.source==="fruit")return"Eat Fruit";return"Use"}
function useItem(name){let w=S.weapons.find(x=>x.name===name);if(w){S.equipped=w.name;return popup("Equipped",`${w.name} equipped.`,[{icon:"⚔️",text:`Power ${w.power}`}],()=>render())}let f=S.fruits.find(x=>x.name===name);if(f){S.stats.devilFruit+=Math.ceil(f.power/10);return popup("Devil Fruit Power",`You focused on ${f.name}.`,[{icon:"🍈",text:"Devil Fruit mastery increased"}],()=>render())}let it=S.inventory.find(x=>x.name===name);if(!it)return;if(it.effect==="heal"){S.hp=clamp(S.hp+20,0,S.maxHp);consume(it);return popup("Med Kit Used","You recovered HP.",[{icon:"❤️",text:"HP +20"}],()=>render())}if(it.effect==="energy"){S.actionsLeft=clamp(S.actionsLeft+1,0,S.actionsMax);consume(it);return popup("Energy Meat","You gained an action.",[{icon:"⚡",text:"Action +1"}],()=>render())}if(it.effect==="map"){consume(it);return reward("Treasure Map","You followed an old map and found treasure.",[{icon:"💰",text:"Beli +1200",apply:()=>S.beli+=1200},{icon:"💎",text:"Gems +3",apply:()=>S.gems+=3},{icon:"⭐",text:"EXP +15",apply:()=>xp(15)}],true)}if(it.effect==="rumor"){consume(it);S.news.unshift({text:"A hidden opportunity appeared near "+S.island,day:S.age});return popup("Rumor Investigated","You revealed a new local opportunity.",[{icon:"📰",text:"World News updated"}],()=>render())}if(it.effect==="box"){consume(it);let ww=DATA.weapons[1];S.weapons.push(ww);return popup("Mystery Box Opened","Inside was a weapon.",[{icon:"⚔️",text:ww.name}],()=>render())}popup("Used",`${name} used.`,[],()=>render())}
function consume(it){if(it.qty){it.qty--;if(it.qty<=0)S.inventory=S.inventory.filter(x=>x!==it)}}
function sellItem(name){let value=250;S.beli+=value;S.inventory=S.inventory.filter(x=>x.name!==name);S.weapons=S.weapons.filter(x=>x.name!==name||x.name===S.equipped);popup("Sold Item",`Sold ${name}.`,[{icon:"💰",text:`Beli +${value}`}],()=>render())}
function world(){selectedIsland=selectedIsland||island().id;let si=DATA.islands.find(i=>i.id===selectedIsland)||island();return `<main><div class="card"><h2>World Map</h2><div class="mapBox">${DATA.islands.map((i,n)=>`<button class="island" style="left:${12+(n%3)*28}%;top:${18+Math.floor(n/3)*32}%" onclick="selectedIsland='${i.id}';render()">${i.name}</button>`).join("")}</div></div></main><aside><div class="card"><h3>${si.name}</h3><p>${si.desc}</p><div class="line"><span>Danger</span><b>${si.danger}/10</b></div><div class="line"><span>Marine</span><b>${si.marine}/10</b></div><div class="line"><span>Pirates</span><b>${si.pirate}/10</b></div><div class="line"><span>Weather</span><b>${si.weather}</b></div><h3>Locations</h3>${si.places.map(p=>`<button onclick="islandEvent('${p}')">${p}</button>`).join("")}<button class="primary" onclick="travelTo('${si.id}')">Travel Here</button></div></aside>`}
function islandEvent(place){popup(place,pick([`At the ${place}, someone whispers about treasure.`,`At the ${place}, you see someone being robbed.`,`At the ${place}, a merchant offers work.`]),[{icon:"⭐",text:"EXP +5",apply:()=>xp(5)},{icon:"💎",text:"Gems +1",apply:()=>S.gems++}],()=>{save();render()})}
function travelTo(id){let i=DATA.islands.find(x=>x.id===id);S.island=i.name;S.sea=i.sea;S.stats.navigation++;reward("Travel",`You traveled to ${i.name}.`,[{icon:"🧭",text:"Navigation +1"},{icon:"💎",text:"Gems +1",apply:()=>S.gems++}])}
function crew(){return `<main><div class="card"><h2>${S.crewName||S.marineUnit||"Crew / Unit"}</h2><p>${S.title}</p>${S.crew.map(c=>`<div class="crewMember"><div class="avatar">🧑‍✈️</div><div><b>${c.name}</b><div>${c.role}</div><div class="small">Dream: ${c.dream}</div><button onclick="crewTalk('${c.name}')">Talk</button><button onclick="crewTrain('${c.name}')">Train</button></div><div>${bar("Loyalty",c.loyalty)}</div></div>`).join("")||"<p>No crew yet. Join a crew, enlist, or recruit members.</p>"}</div></main>`}
function crewTalk(n){let c=S.crew.find(x=>x.name===n);c.loyalty=clamp(c.loyalty+5,0,100);popup("Crew Talk",`${n} appreciated the conversation.`,[{icon:"❤️",text:"Loyalty +5"}],()=>render())}
function crewTrain(n){let c=S.crew.find(x=>x.name===n);c.strength+=20;popup("Crew Training",`${n} grew stronger.`,[{icon:"💪",text:"Crew strength +20"}],()=>render())}
function relationships(){return `<main><div class="card"><h2>Relationships</h2>${S.relationships.map(r=>`<div class="relation"><div class="avatar">🙂</div><div><b>${r.name}</b><div>${r.type}</div><p class="small">${r.desc}</p><button onclick="relTalk('${r.name}')">Talk</button></div><div>${bar("Loyalty",r.loyalty)}</div></div>`).join("")||"<p>No relationships yet.</p>"}</div></main>`}
function relTalk(n){let r=S.relationships.find(x=>x.name===n);r.loyalty=clamp(r.loyalty+6,0,100);popup("Relationship",`${n} feels closer to you.`,[{icon:"❤️",text:"Loyalty +6"}],()=>render())}
function logbook(){return `<main><div class="card"><h2>Logbook</h2><div class="grid grid2"><div><h3>Life Summary</h3><div class="line"><span>Years</span><b>${S.age}</b></div><div class="line"><span>Power</span><b>${fmt(power())}</b></div><div class="line"><span>Bounty</span><b>฿${fmt(S.bounty)}</b></div><div class="line"><span>Crew</span><b>${S.crew.length}</b></div></div><div><h3>Entries</h3>${S.log.slice(0,14).map(l=>`<div class="event"><span>${l}</span><b>Age ${S.age}</b></div>`).join("")}</div></div></div></main>`}
function settings(){return `<main><div class="card"><h2>Settings</h2><div class="line"><span>Difficulty</span><b>${S.settings.difficulty}</b></div><button onclick="save();alert('Saved')">Save Game</button><button class="danger" onclick="localStorage.removeItem(SAVE_KEY);S=null;start()">New Save</button></div></main>`}
function startBattle(enemy,hp){currentBattle={enemy,enemyHp:hp,enemyMax:hp,playerHp:S.hp,log:[`${enemy} blocks your path.`]};page="battle";render()}
function battleScreen(){return `<div class="battle"><div class="line"><b>ENCOUNTER</b><span>${S.island}</span></div><h2>${currentBattle.enemy} blocks your path!</h2><div class="battleTop"><div class="fighter"><h2>YOU</h2>${bar("HP",currentBattle.playerHp,S.maxHp)}<div>Weapon: ${S.equipped}</div></div><h1>VS</h1><div class="fighter enemy"><h2>${currentBattle.enemy}</h2>${bar("HP",currentBattle.enemyHp,currentBattle.enemyMax)}<div>Style: Fast Duelist</div></div></div><h2>Choose your move</h2><div class="moveGrid">${["Quick Strike","Heavy Slash","Combo Attack","Guard","Focus","Taunt"].map(m=>`<button class="move" onclick="battleMove('${m}')"><b>${m}</b><div class="small">${moveDesc(m)}</div></button>`).join("")}<button class="move" onclick="retreat()">Retreat<div class="small">Escape.</div></button></div><div class="battleLog"><h3>Battle Log</h3>${currentBattle.log.slice(-5).map(l=>`<div>▸ ${l}</div>`).join("")}</div></div>`}
function moveDesc(m){return {"Quick Strike":"Reliable low damage.","Heavy Slash":"Risky high damage.","Combo Attack":"Multiple hits.",Guard:"Reduce damage.",Focus:"Improve next hit.",Taunt:"Lower enemy focus."}[m]||"Move"}
function battleMove(m){let dmg=0,wp=DATA.weapons.find(w=>w.name===S.equipped)?.power||0;if(m==="Quick Strike")dmg=18+wp+Math.floor(Math.random()*8);if(m==="Heavy Slash")dmg=Math.random()<.65?40+wp:0;if(m==="Combo Attack")dmg=(12+Math.floor(wp/2))*(1+Math.floor(Math.random()*3));if(m==="Guard")currentBattle.log.push("You guarded.");if(m==="Focus"){currentBattle.log.push("You focused and read the enemy.");S.stats.perception++}if(m==="Taunt"){currentBattle.log.push("You taunted the enemy.");dmg=8;S.infamy++}if(dmg){currentBattle.enemyHp=clamp(currentBattle.enemyHp-dmg,0,currentBattle.enemyMax);currentBattle.log.push(`${m} dealt ${dmg}.`)}if(currentBattle.enemyHp<=0)return winBattle();let ed=m==="Guard"?5:12+Math.floor(Math.random()*10);currentBattle.playerHp=clamp(currentBattle.playerHp-ed,0,S.maxHp);currentBattle.log.push(`${currentBattle.enemy} hit you for ${ed}.`);if(currentBattle.playerHp<=0)return loseBattle();render()}
function winBattle(){S.hp=currentBattle.playerHp;S.bounty+=500;S.beli+=350;S.fame+=2;xp(25);S.actionsLeft=Math.max(0,S.actionsLeft-1);let e=currentBattle.enemy;currentBattle=null;page="dashboard";popup("Victory",`${e} defeated.`,[{icon:"⭐",text:"EXP +25"},{icon:"💰",text:"Beli +350"},{icon:"☠️",text:"Bounty +500"}],()=>render())}
function loseBattle(){S.hp=10;S.actionsLeft=Math.max(0,S.actionsLeft-1);let e=currentBattle.enemy;currentBattle=null;page="dashboard";popup("Defeat",`${e} defeated you, but you survived.`,[{icon:"❤️",text:"HP set to 10"}],()=>render())}
function retreat(){S.infamy=Math.max(0,S.infamy-1);S.actionsLeft=Math.max(0,S.actionsLeft-1);currentBattle=null;page="dashboard";popup("Retreated","You escaped the battle.",[{icon:"🏃",text:"Reputation slightly reduced"}],()=>render())}
function ageUp(){let old=S.age;S.age++;S.actionsMax=actionsMax();S.actionsLeft=S.actionsMax;let g=1+Math.floor(Math.random()*3);S.gems+=g;let ev=randomEvent();S.log.unshift(ev);if(S.age===10&&S.dream==="Undiscovered")S.dream=pick(["Freedom","Become Pirate King","Justice","Knowledge","Riches","Strongest Swordsman"]);save();popup("Year Summary",`Age ${old} → ${S.age}. ${ev}`,[{icon:"💎",text:`Gems +${g}`},{icon:"⭐",text:"New life event"}],()=>render())}
function randomEvent(){if(S.age<13)return pick(["You heard sailors tell stories about the sea.","You helped your family around town.","You played near the docks."]);if(S.age<18)return pick(["A pirate ship arrived nearby.","A mentor noticed your potential.","Marine recruitment posters appeared."]);return pick(["A new opportunity appeared on the island.","Your reputation quietly grew.","World events shifted around you."])}
function render(){try{if(!S)return start();normalize();let main=page==="battle"?battleScreen():page==="dashboard"?dashboard():page==="actions"?actions():page==="crew"?crew():page==="world"?world():page==="inventory"?inventory():page==="logbook"?logbook():page==="relationships"?relationships():settings();let full=page==="battle";document.getElementById("app").innerHTML=topbar()+(!full?nav():"")+`<div class="layout">${full?main:left()+main+(page==="world"?"":right())}</div>`+(!full?`<button class="bottomAge gold" onclick="ageUp()">⭐ AGE UP<br><span class="small">Next Year</span></button>`:"")}catch(e){document.getElementById("app").innerHTML=`<div class="startPanel" style="margin:60px auto;max-width:650px"><h2>Recovery</h2><p>${e.message}</p><button onclick="localStorage.removeItem(SAVE_KEY);S=null;start()">New Save</button></div>`;console.error(e)}}
load();


/* v12.0 Inventory Realism + Rarity Colors */
function rarityClass(r){return String(r||"Common").toLowerCase();}
function rarityTag(r){let rr=r||"Common";return `<span class="rarityTag rarity-${rarityClass(rr)}">${rr}</span>`;}

function newLife(){
  let o=DATA.origins.find(x=>x.id===selectedOrigin)||DATA.origins[0],r=DATA.races.find(x=>x.id===selectedRace)||DATA.races[0];
  if(o.cost>0)return alert("Origin locked. Earn gems.");
  if(r.cost>0)return alert("Race locked. Earn gems.");
  let home=chooseIsland(o);
  S={version:"v12.0",name:document.getElementById("nm").value||"Rookie",nick:document.getElementById("nick").value||"",gender:document.getElementById("gender").value,origin:o.name,race:r.name,age:0,sea:home.sea,island:home.name,dream:"Undiscovered",title:"Infant",beli:0,gems:2,fame:0,bounty:0,infamy:0,hp:100,maxHp:100,mood:80,exp:0,level:1,actionsLeft:5,actionsMax:5,equipped:"None",stats:{strength:5,speed:5,stamina:5,defense:5,haki:0,devilFruit:0,intelligence:5,charisma:5,willpower:5,discipline:0,sneak:0,navigation:0,perception:0,crafting:0,medicine:0,sword:0,survival:0,swimming:0,engineering:0,luck:0,potential:0,reflex:0},reps:{marines:0,pirates:0,revolutionaries:0,underworld:0,civilians:0},crew:[],relationships:[],inventory:[],weapons:[],fruits:[],news:DATA.news.map((text,i)=>({text,day:i+1})),log:[],effects:[],settings:{difficulty:document.getElementById("diff").value},unlocks:{origins:[],races:[]}};
  applyBonus(o.bonus);applyBonus(r.bonus);S.maxHp+=(r.bonus.hp||0);S.hp=S.maxHp;
  S.log.unshift(`Born in ${S.sea} at ${S.island}. Origin: ${o.name}. Race: ${r.name}.`);
  S.log.unshift("You begin life with nothing. Everything you own must be earned, gifted, bought, stolen, or discovered.");
  save();
  popup("Birth",`You were born in ${S.sea}. You start with no inventory. Your path has not been chosen yet.`,[{icon:"⚓",text:`Origin: ${o.name}`},{icon:r.icon,text:`Race: ${r.name}`},{icon:"🎒",text:"Inventory: Empty"},{icon:"💎",text:"+2 Starting Gems"}],()=>render());
}

function normalize(){
  if(!S)return;S.actionsMax=actionsMax();if(S.actionsLeft==null||S.actionsLeft>S.actionsMax)S.actionsLeft=S.actionsMax;["crew","relationships","inventory","weapons","fruits","news","log","effects"].forEach(k=>S[k]=S[k]||[]);S.gems=S.gems||0;if(!S.equipped)S.equipped=(S.weapons&&S.weapons[0])?S.weapons[0].name:"None";S.unlocks=S.unlocks||{origins:[],races:[]};
}

function left(){
  return `<aside><div class="card"><h2>${S.name}</h2><div class="small">${S.race} · ${S.origin}</div><div class="portrait">🙂</div><div class="line"><span>Age</span><b>${S.age}</b></div><div class="line"><span>Island</span><b>${S.island}</b></div><div class="line"><span>Equipped</span><b>${S.equipped||"None"}</b></div></div><div class="card"><h3>Vitality</h3>${bar("HP",S.hp,S.maxHp)}${bar("Actions",S.actionsLeft,S.actionsMax)}${bar("Mood",S.mood)}${bar("EXP",S.exp,100)}</div><div class="card"><h3>Attributes</h3>${Object.entries(S.stats).slice(0,10).map(([k,v])=>`<div class="line"><span>${k}</span><b>${v}</b></div>`).join("")}</div></aside>`;
}

function inventory(){
  let all=[...S.weapons.map(w=>({...w,source:"weapon"})),...S.inventory,...S.fruits.map(f=>({...f,source:"fruit"}))];
  return `<main><div class="card"><h2>Inventory</h2><p class="small">Every item has a use. Rarity colors: Grey Common · Green Uncommon · Blue Rare · Purple Epic · Gold Legendary · Red Mythic.</p>${all.length?`<div class="itemGrid">${all.map(i=>`<div class="item ${rarityClass(i.rarity)}"><h3>${i.name}</h3>${rarityTag(i.rarity)}<div>${i.type||"Item"}</div><p class="small">${i.desc||""}</p>${i.qty?`<b>x${i.qty}</b>`:""}${i.power?`<b>Power ${i.power}</b>`:""}<button onclick="useItem('${i.name}')">${useLabel(i)}</button><button onclick="sellItem('${i.name}')">Sell</button></div>`).join("")}</div>`:`<div class="emptyInventory"><h3>🎒 Empty Inventory</h3><p>You are a baby. You do not start with weapons or supplies.</p><p>Items come from events, gifts, markets, treasure maps, battles, and age progression.</p></div>`}</div></main>`;
}

function power(){
  let st=S.stats,wp=S.equipped==="None"?0:(DATA.weapons.find(w=>w.name===S.equipped)?.power||0);
  return Math.round(st.strength*12+st.speed*10+st.stamina*10+st.defense*10+st.haki*30+st.devilFruit*25+wp*20+S.fame*4+S.bounty/100000);
}

function battleScreen(){
  return `<div class="battle"><div class="line"><b>ENCOUNTER</b><span>${S.island}</span></div><h2>${currentBattle.enemy} blocks your path!</h2><div class="battleTop"><div class="fighter"><h2>YOU</h2>${bar("HP",currentBattle.playerHp,S.maxHp)}<div>Weapon: ${S.equipped||"None"}</div></div><h1>VS</h1><div class="fighter enemy"><h2>${currentBattle.enemy}</h2>${bar("HP",currentBattle.enemyHp,currentBattle.enemyMax)}<div>Style: Fast Duelist</div></div></div><h2>Choose your move</h2><div class="moveGrid">${["Quick Strike","Heavy Slash","Combo Attack","Guard","Focus","Taunt"].map(m=>`<button class="move" onclick="battleMove('${m}')"><b>${m}</b><div class="small">${moveDesc(m)}</div></button>`).join("")}<button class="move" onclick="retreat()">Retreat<div class="small">Escape.</div></button></div><div class="battleLog"><h3>Battle Log</h3>${currentBattle.log.slice(-5).map(l=>`<div>▸ ${l}</div>`).join("")}</div></div>`;
}
function battleMove(m){
  let dmg=0,wp=S.equipped==="None"?0:(DATA.weapons.find(w=>w.name===S.equipped)?.power||0);
  if(m==="Quick Strike")dmg=12+wp+Math.floor(Math.random()*8);
  if(m==="Heavy Slash")dmg=Math.random()<.65?28+wp:0;
  if(m==="Combo Attack")dmg=(8+Math.floor(wp/2))*(1+Math.floor(Math.random()*3));
  if(m==="Guard")currentBattle.log.push("You guarded.");
  if(m==="Focus"){currentBattle.log.push("You focused and read the enemy.");S.stats.perception++}
  if(m==="Taunt"){currentBattle.log.push("You taunted the enemy.");dmg=6;S.infamy++}
  if(dmg){currentBattle.enemyHp=clamp(currentBattle.enemyHp-dmg,0,currentBattle.enemyMax);currentBattle.log.push(`${m} dealt ${dmg}.`)}
  if(currentBattle.enemyHp<=0)return winBattle();
  let ed=m==="Guard"?5:12+Math.floor(Math.random()*10);
  currentBattle.playerHp=clamp(currentBattle.playerHp-ed,0,S.maxHp);
  currentBattle.log.push(`${currentBattle.enemy} hit you for ${ed}.`);
  if(currentBattle.playerHp<=0)return loseBattle();
  render();
}

ACTIONS.push(
  {id:"gift",cat:"General",icon:"🎁",name:"Ask for Gift",desc:"Childhood chance to receive a useful item.",req:()=>S.age>=3&&S.age<=12,txt:"Requires Age 3-12",do:()=>{S.inventory.push({name:"Energy Meat",type:"Consumable",rarity:"Common",qty:1,desc:"Restores 1 action.",effect:"energy"});reward("Gift Received","Someone gave you food for later.",[{icon:"🎁",text:"Energy Meat gained"},{icon:"⬜",text:"Common item"}]);}},
  {id:"market",cat:"General",icon:"🛒",name:"Visit Market",desc:"Buy basic useful items.",req:()=>S.age>=8,txt:"Requires Age 8+",do:()=>{if(S.beli<100)return alert("Need 100 Beli.");S.beli-=100;S.inventory.push({name:"Small Med Kit",type:"Consumable",rarity:"Common",qty:1,desc:"Restores 20 HP.",effect:"heal"});reward("Market Purchase","You bought a basic med kit.",[{icon:"❤️",text:"Small Med Kit gained"},{icon:"💰",text:"Beli -100"}],true);}},
  {id:"weaponshop",cat:"General",icon:"⚔️",name:"Buy First Weapon",desc:"Get your first weapon when old enough.",req:()=>S.age>=10,txt:"Requires Age 10+",do:()=>{if(S.beli<250)return alert("Need 250 Beli.");S.beli-=250;let w=DATA.weapons[0];S.weapons.push(w);reward("First Weapon","You bought a Rusty Sword.",[{icon:"⚔️",text:"Rusty Sword gained"},{icon:"⬜",text:"Common weapon"},{icon:"💰",text:"Beli -250"}],true);}}
);


/* =========================
   v12.0 Living World Update
   ========================= */

const WEATHER_V120 = ["Clear","Rain","Fog","Storm","Heat Wave","Calm Seas"];
const TITLES_V120 = [
  {name:"Dock Rat", req:()=>S.age>=5, bonus:"Street events slightly better"},
  {name:"Rookie Fighter", req:()=>S.fame>=3, bonus:"+combat respect"},
  {name:"Treasure Hunter", req:()=>S.stats.navigation>=3, bonus:"+exploration flavor"},
  {name:"East Blue Menace", req:()=>S.bounty>=5000 || S.infamy>=8, bonus:"+pirate reputation"},
  {name:"Pirate Hunter", req:()=>S.reps.marines>=5 && S.fame>=5, bonus:"+marine reputation"},
  {name:"Storm Breaker", req:()=>S.log.some(x=>String(x).includes("Storm")), bonus:"+legend flavor"}
];

const ACHIEVEMENTS_V120 = [
  {id:"first_year", name:"First Step", desc:"Reach age 1.", gems:3, check:()=>S.age>=1},
  {id:"first_friend", name:"First Bond", desc:"Make a relationship.", gems:5, check:()=>S.relationships.length>=1},
  {id:"first_item", name:"First Possession", desc:"Gain any item or weapon.", gems:5, check:()=>S.inventory.length+S.weapons.length+S.fruits.length>=1},
  {id:"first_fight", name:"First Blood", desc:"Gain fame from combat.", gems:10, check:()=>S.fame>=2},
  {id:"traveler", name:"Traveler", desc:"Raise navigation to 2.", gems:8, check:()=>S.stats.navigation>=2},
  {id:"rich", name:"Small Fortune", desc:"Reach 5,000 Beli.", gems:15, check:()=>S.beli>=5000},
  {id:"crew", name:"Crew Ties", desc:"Recruit or join a crew/unit.", gems:10, check:()=>S.crew.length>=1 || S.crewName || S.marineUnit},
  {id:"wanted", name:"Wanted", desc:"Gain a bounty.", gems:8, check:()=>S.bounty>0}
];

function ensureV120(){
  if(!S)return;
  S.personality=S.personality||{honor:0,aggression:0,greed:0,courage:0,discipline:0,kindness:0};
  S.memories=S.memories||[];
  S.achievements=S.achievements||[];
  S.world=S.world||{year:0,weather:{},events:[],pirateHeat:2,marinePressure:2};
  S.titles=S.titles||[];
  S.activeTitle=S.activeTitle||"None";
  S.ship=S.ship||null;
  DATA.islands.forEach(i=>{
    if(!S.world.weather[i.name])S.world.weather[i.name]=i.weather||"Clear";
  });
}
const oldNormalize_v120 = normalize;
function normalize(){
  oldNormalize_v120();
  ensureV120();
}

function addPersonality(delta){
  ensureV120();
  Object.entries(delta||{}).forEach(([k,v])=>{
    S.personality[k]=(S.personality[k]||0)+v;
  });
}
function addMemory(who,what,impact=0){
  ensureV120();
  S.memories.unshift({age:S.age,who,what,impact});
  S.memories=S.memories.slice(0,50);
}
function currentWeather(){
  ensureV120();
  return S.world.weather[S.island] || island().weather || "Clear";
}
function weatherEffectText(){
  const w=currentWeather();
  if(w==="Storm")return "Travel is riskier. Fishman and strong navigators benefit.";
  if(w==="Fog")return "Ambush and mystery events are more likely.";
  if(w==="Rain")return "Combat visibility is reduced.";
  if(w==="Heat Wave")return "Stamina checks are harder.";
  if(w==="Calm Seas")return "Travel and fishing are safer.";
  return "No major effect.";
}
function worldTick(){
  ensureV120();
  S.world.year=S.age;
  DATA.islands.forEach(i=>{
    if(Math.random()<0.45)S.world.weather[i.name]=pick(WEATHER_V120);
  });
  const events=[
    ()=>`Black Fang Pirates attacked ${pick(DATA.islands).name}.`,
    ()=>`Marine patrols increased near ${pick(DATA.islands).name}.`,
    ()=>`A strange chest washed ashore near ${pick(DATA.islands).name}.`,
    ()=>`A bounty hunter was seen asking about rookies.`,
    ()=>`A merchant convoy vanished during ${pick(WEATHER_V120).toLowerCase()}.`,
    ()=>`Rumors spread about a Devil Fruit near ${pick(DATA.islands).name}.`
  ];
  let e=pick(events)();
  S.world.events.unshift({age:S.age,text:e});
  S.world.events=S.world.events.slice(0,20);
  S.news.unshift({text:e,day:S.age});
  S.news=S.news.slice(0,20);
  S.world.pirateHeat=clamp(S.world.pirateHeat+Math.floor(Math.random()*3)-1,0,10);
  S.world.marinePressure=clamp(S.world.marinePressure+Math.floor(Math.random()*3)-1,0,10);
}
function checkAchievements(){
  ensureV120();
  let gained=[];
  ACHIEVEMENTS_V120.forEach(a=>{
    if(!S.achievements.includes(a.id) && a.check()){
      S.achievements.push(a.id);
      S.gems+=a.gems;
      gained.push({icon:"🏆",text:`${a.name}: +${a.gems} Gems`});
      S.log.unshift(`Achievement unlocked: ${a.name}.`);
    }
  });
  return gained;
}
function checkTitles(){
  ensureV120();
  TITLES_V120.forEach(t=>{
    if(!S.titles.includes(t.name) && t.req()){
      S.titles.push(t.name);
      S.log.unshift(`Title unlocked: ${t.name}.`);
    }
  });
}

/* Replace popup so every continue also checks achievements/titles */
const oldPopup_v120 = popup;
function popup(title,body,rewards=[],cb=()=>render()){
  checkTitles();
  let ach = checkAchievements();
  let allRewards = [...rewards, ...ach];
  let m=$("modal");
  m.innerHTML=`<div class="modalWrap"><div class="modalCard"><h2>${title}</h2><p>${body}</p><h3>Outcome</h3>${allRewards.map(r=>`<div class="reward"><span>${r.icon||"⭐"}</span><span>${r.text}</span><b></b></div>`).join("")||"<p class='small'>No reward.</p>"}<button class="primary" id="cont">Continue</button></div></div>`;
  document.getElementById("cont").onclick=()=>{m.innerHTML="";save();cb()};
}

/* New event choice popup */
function choicePopup(title,body,choices){
  let m=$("modal");
  m.innerHTML=`<div class="modalWrap"><div class="modalCard"><h2>${title}</h2><p>${body}</p><div class="choiceButtons">${choices.map((c,i)=>`<button onclick="resolveChoiceV120(${i})">${c.icon||"•"} <b>${c.label}</b><br><span class="small">${c.hint||""}</span></button>`).join("")}</div></div></div>`;
  window._choicesV120=choices;
}
function resolveChoiceV120(i){
  let c=window._choicesV120[i];
  $("modal").innerHTML="";
  if(c.apply)c.apply();
  reward(c.title||"Event Result",c.result||"You made a choice.",c.rewards||[],c.free!==false);
}

function maybeRandomEvent(source="action"){
  ensureV120();
  if(Math.random()>0.33)return false;
  const events=[
    {
      title:"A Dog Follows You",
      body:"A scrappy dog follows you through the street.",
      choices:[
        {icon:"🍖",label:"Feed it",hint:"Kindness +2",title:"Kindness",result:"The dog happily follows you for a while.",apply:()=>addPersonality({kindness:2}),rewards:[{icon:"❤️",text:"Kindness +2"}]},
        {icon:"🚶",label:"Ignore it",hint:"No reward",title:"Ignored",result:"You keep walking.",rewards:[]},
        {icon:"😠",label:"Scare it away",hint:"Aggression +1",title:"Cruel Moment",result:"The dog runs away.",apply:()=>addPersonality({aggression:1}),rewards:[{icon:"😠",text:"Aggression +1"}]}
      ]
    },
    {
      title:"Suspicious Chest",
      body:"You notice a weathered chest partly hidden nearby.",
      choices:[
        {icon:"🎁",label:"Open it",hint:"Possible loot",title:"Chest Opened",result:"Inside you find a mystery box.",apply:()=>S.inventory.push({name:"Mystery Box",type:"Box",rarity:"Rare",qty:1,desc:"Open for a random reward.",effect:"box"}),rewards:[{icon:"🎁",text:"Mystery Box gained"}]},
        {icon:"💰",label:"Sell its location",hint:"Greed +1, Beli +300",title:"Sold Information",result:"You sold the location to a shady merchant.",apply:()=>{S.beli+=300;addPersonality({greed:1})},rewards:[{icon:"💰",text:"Beli +300"},{icon:"🤑",text:"Greed +1"}]},
        {icon:"🚫",label:"Leave it",hint:"Discipline +1",title:"Left Alone",result:"You decide not to risk it.",apply:()=>addPersonality({discipline:1}),rewards:[{icon:"🧘",text:"Discipline +1"}]}
      ]
    },
    {
      title:"Kid Challenges You",
      body:"A local kid challenges you in front of others.",
      choices:[
        {icon:"🥊",label:"Fight",hint:"Aggression +1, XP",title:"Challenge Accepted",result:"You accept the challenge and learn from it.",apply:()=>addPersonality({aggression:1,courage:1}),rewards:[{icon:"⭐",text:"EXP +8",apply:()=>xp(8)}]},
        {icon:"🤝",label:"Teach them",hint:"Kindness +2",title:"Mentor Moment",result:"You show them a better stance.",apply:()=>addPersonality({kindness:2,honor:1}),rewards:[{icon:"❤️",text:"Kindness +2"}]},
        {icon:"😐",label:"Ignore",hint:"Discipline +1",title:"Walked Away",result:"You refuse to waste energy.",apply:()=>addPersonality({discipline:1}),rewards:[{icon:"🧘",text:"Discipline +1"}]}
      ]
    },
    {
      title:"Merchant Remembers You",
      body:"A merchant looks at you carefully. They seem to recognize your face.",
      choices:[
        {icon:"🙂",label:"Be polite",hint:"Honor +1",title:"Good Impression",result:"The merchant relaxes and offers a small discount.",apply:()=>{addPersonality({honor:1});addMemory("Merchant","treated politely",1)},rewards:[{icon:"🤝",text:"Merchant memory improved"}]},
        {icon:"🤑",label:"Pressure them",hint:"Greed +2",title:"Pressure",result:"They give in, but they will remember this.",apply:()=>{addPersonality({greed:2});addMemory("Merchant","was pressured",-2)},rewards:[{icon:"🤑",text:"Greed +2"}]},
        {icon:"🚶",label:"Leave",hint:"No risk",title:"Left",result:"You move along.",rewards:[]}
      ]
    }
  ];
  choicePopup(pick(events).title,pick(events).body,pick(events).choices);
  return true;
}

/* Replace reward to sometimes branch into random event before final popup */
function reward(title,body,items=[],free=false){
  items.forEach(x=>x.apply&&x.apply());
  if(!free)S.actionsLeft=Math.max(0,S.actionsLeft-1);
  S.log.unshift(body);
  if(Math.random()<0.25)S.log.unshift("Bonus event: "+pick(["A stranger noticed your effort.","You heard a rumor nearby.","You found a small pouch of coins."]));
  save();
  if(!maybeRandomEvent(title))popup(title,body,items);
}

/* Replace ageUp to tick world, weather, achievements, titles */
function ageUp(){
  let old=S.age;
  S.age++;
  S.actionsMax=actionsMax();
  S.actionsLeft=S.actionsMax;
  let g=1+Math.floor(Math.random()*3);
  S.gems+=g;
  worldTick();
  let ev=randomEvent();
  S.log.unshift(ev);
  if(S.age===10&&S.dream==="Undiscovered")S.dream=pick(["Freedom","Become Pirate King","Justice","Knowledge","Riches","Strongest Swordsman"]);
  if(S.age===13 && !S.ship){
    S.ship={name:"Unnamed Dinghy",rarity:"Common",hull:30,maxHull:30,storage:3,crewCap:2,cannons:0};
    S.log.unshift("You gained access to a tiny dinghy. It is not impressive, but it can carry dreams.");
  }
  save();
  popup("Year Summary",`Age ${old} → ${S.age}. ${ev}`,[
    {icon:"💎",text:`Gems +${g}`},
    {icon:"📰",text:"World news updated"},
    {icon:"🌧️",text:`Weather at ${S.island}: ${currentWeather()}`}
  ],()=>render());
}

/* Replace topbar for v12 */
function topbar(){return `<div class="topbar"><div class="title">☠️ Great Pirate Life Sim <span class="ver">v12.0</span></div><div class="topStats"><span>฿ <b>${fmt(S.beli)}</b></span><span>💎 <b>${S.gems}</b></span><span>🏆 <b>${S.achievements?.length||0}</b></span><span>👑 <b>${S.activeTitle||"None"}</b></span><button onclick="save();alert('Saved')">Save</button></div></div>`}

/* Replace right panel to show world state */
function right(){
  ensureV120();
  return `<aside>
    <div class="card"><h3>World News</h3>${S.news.slice(0,5).map(n=>`<div class="event"><span>${n.text}</span><b>Day ${n.day}</b></div>`).join("")}</div>
    <div class="card"><h3>Location</h3><h2>${S.sea}</h2><p>${island().desc}</p><div class="line"><span>Weather</span><b class="weatherTag">${currentWeather()}</b></div><p class="small">${weatherEffectText()}</p></div>
    <div class="card"><h3>World State</h3><div class="line"><span>Pirate Heat</span><b>${S.world.pirateHeat}/10</b></div><div class="line"><span>Marine Pressure</span><b>${S.world.marinePressure}/10</b></div></div>
  </aside>`;
}

/* Replace dashboard to include personality/titles/ship summary */
function dashboard(){
  ensureV120();
  let p=progress();
  return `<main>
    <div class="card heroDream"><h3>⭐ Dream</h3><h2>“${S.dream}”</h2><p>${S.dream==="Undiscovered"?"Your dream awakens through life choices.":"Your life is bending toward this dream."}</p><div class="line"><span>Overall Power</span><b>${fmt(power())} · Rank ${rank(power())}</b></div><div>${S.titles.map(t=>`<span class="badge">${t}</span>`).join("")||"<span class='small'>No titles yet.</span>"}</div></div>
    <div class="card"><h3>Progress Overview</h3><div class="grid grid5">${Object.entries(p).map(([k,v])=>`<div class="progressCard"><div class="circle">${Math.round(v.pct)}%</div><h4>${k}</h4><div>Rank: ${v.rank}</div></div>`).join("")}</div></div>
    <div class="card"><h3>Personality</h3><div class="personalityGrid">${Object.entries(S.personality).map(([k,v])=>`<div class="line"><span>${k}</span><b>${v}</b></div>`).join("")}</div></div>
    ${S.ship?`<div class="card shipCard"><h3>Ship</h3><div class="line"><span>Name</span><b>${S.ship.name}</b></div><div class="line"><span>Rarity</span><b>${S.ship.rarity}</b></div><div class="line"><span>Hull</span><b>${S.ship.hull}/${S.ship.maxHull}</b></div><div class="line"><span>Crew Cap</span><b>${S.ship.crewCap}</b></div></div>`:""}
    <div class="card"><h3>Recent Events</h3>${S.log.slice(0,6).map(l=>`<div class="event"><span>${l}</span><b>Age ${S.age}</b></div>`).join("")}</div>
  </main>`;
}

/* Replace world screen with weather/events */
function world(){
  ensureV120();
  selectedIsland=selectedIsland||island().id;
  let si=DATA.islands.find(i=>i.id===selectedIsland)||island();
  let w=S.world.weather[si.name]||si.weather;
  return `<main><div class="card"><h2>World Map</h2><div class="mapBox">${DATA.islands.map((i,n)=>`<button class="island" style="left:${12+(n%3)*28}%;top:${18+Math.floor(n/3)*32}%" onclick="selectedIsland='${i.id}';render()">${i.name}</button>`).join("")}</div></div><div class="card"><h3>Recent World Events</h3>${S.world.events.slice(0,8).map(e=>`<div class="worldEvent">📰 ${e.text}<br><span class="small">Age ${e.age}</span></div>`).join("")||"<p>No major events yet.</p>"}</div></main>
  <aside><div class="card"><h3>${si.name}</h3><p>${si.desc}</p><div class="line"><span>Danger</span><b>${si.danger}/10</b></div><div class="line"><span>Marine</span><b>${si.marine}/10</b></div><div class="line"><span>Pirates</span><b>${si.pirate}/10</b></div><div class="line"><span>Weather</span><b class="weatherTag">${w}</b></div><h3>Locations</h3>${si.places.map(p=>`<button onclick="islandEvent('${p}')">${p}</button>`).join("")}<button class="primary" onclick="travelTo('${si.id}')">Travel Here</button></div></aside>`;
}

/* Replace relationships to show memory */
function relationships(){
  ensureV120();
  return `<main><div class="card"><h2>Relationships</h2>${S.relationships.map(r=>`<div class="relation"><div class="avatar">🙂</div><div><b>${r.name}</b><div>${r.type}</div><p class="small">${r.desc}</p><button onclick="relTalk('${r.name}')">Talk</button></div><div>${bar("Loyalty",r.loyalty)}</div></div>`).join("")||"<p>No relationships yet.</p>"}</div><div class="card"><h3>NPC Memory</h3>${S.memories.slice(0,10).map(m=>`<div class="event"><span>${m.who}: ${m.what}</span><b>${m.impact>0?"+":""}${m.impact}</b></div>`).join("")||"<p>No one remembers anything important yet.</p>"}</div></main>`;
}

/* Replace logbook to include achievements */
function logbook(){
  ensureV120();
  return `<main><div class="card"><h2>Logbook</h2><div class="grid grid2"><div><h3>Life Summary</h3><div class="line"><span>Years</span><b>${S.age}</b></div><div class="line"><span>Power</span><b>${fmt(power())}</b></div><div class="line"><span>Bounty</span><b>฿${fmt(S.bounty)}</b></div><div class="line"><span>Crew</span><b>${S.crew.length}</b></div></div><div><h3>Entries</h3>${S.log.slice(0,14).map(l=>`<div class="event"><span>${l}</span><b>Age ${S.age}</b></div>`).join("")}</div></div></div>
  <div class="card"><h3>Achievements</h3>${ACHIEVEMENTS_V120.map(a=>`<div class="achievement ${S.achievements.includes(a.id)?"done":""}"><b>${S.achievements.includes(a.id)?"🏆":"⬜"} ${a.name}</b><br><span class="small">${a.desc} · Reward: ${a.gems} Gems</span></div>`).join("")}</div></main>`;
}

/* Add title selection in settings */
function settings(){
  ensureV120();
  return `<main><div class="card"><h2>Settings</h2><div class="line"><span>Difficulty</span><b>${S.settings.difficulty}</b></div><h3>Active Title</h3><select onchange="S.activeTitle=this.value;save();render()"><option ${S.activeTitle==="None"?"selected":""}>None</option>${S.titles.map(t=>`<option ${S.activeTitle===t?"selected":""}>${t}</option>`).join("")}</select><button onclick="save();alert('Saved')">Save Game</button><button class="danger" onclick="localStorage.removeItem(SAVE_KEY);S=null;start()">New Save</button></div></main>`;
}
